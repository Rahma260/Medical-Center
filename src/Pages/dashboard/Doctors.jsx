import React, { useEffect } from "react";
import {
  Box,
  Button,
  TableRow,
  TableCell,
  Card,
  CardContent,
  Chip,
  useMediaQuery,
  useTheme,
  Grid,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  IconButton,
} from "@mui/material";
import { MedicalInformation, Add, Edit, Delete, ContentCopy, Close } from "@mui/icons-material";
import { useFirestore } from "../../hooks/useFirestore";
import { useAlert } from "../../hooks/useAlert";
import { useDialog } from "../../hooks/useDialog";
import { useImageUpload } from "../../hooks/useImageUpload";
import { usePagination } from "../../hooks/usePagination";
import { useSearch } from "../../hooks/useSearch";
import PageHeader from "../../Components/dashboard/PageHeader";
import DataTable from "../../Components/dashboard/DataTable";
import AlertSnackbar from "../../Components/dashboard/AlertSnackbar";
import ActionButtons from "../../Components/dashboard/ActionButtons";
import StatusChip from "../../Components/dashboard/StatusChip";
import AvatarWithInfo from "../../Components/dashboard/AvatarWithInfo";
import DoctorDialog from "../../Components/dashboard/doctors/DoctorDialog";
import SearchBar from "../../Components/common/SearchBar";
import { auth } from "../../Firebase/firebase";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

const Doctors = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const { data: doctors, loading, addData, updateData, deleteData } =
    useFirestore("Doctors");
  const { data: departments } = useFirestore("Departments");
  const { alert, showAlert, hideAlert } = useAlert();
  const { open, selectedItem, openDialog, closeDialog } = useDialog();
  const imageUpload = useImageUpload();

  const [credentialsOpen, setCredentialsOpen] = React.useState(false);
  const [doctorCredentials, setDoctorCredentials] = React.useState(null);
  const [creatingAuth, setCreatingAuth] = React.useState(false);

  const departmentNames = departments.map((d) => d.name || d.id);

  const { searchQuery, filteredData, handleSearchChange, clearSearch } =
    useSearch(doctors, [
      "firstName",
      "lastName",
      "email",
      "phone",
      "department",
      "institution",
      "medicalLicense",
    ]);

  const {
    page,
    rowsPerPage,
    paginatedData,
    handleChangePage,
    handleChangeRowsPerPage,
    totalItems,
    resetPagination,
  } = usePagination(filteredData, isMobile ? 4 : 10);

  useEffect(() => {
    resetPagination();
  }, [searchQuery]);

  const getInitials = (firstName, lastName) =>
    `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const generateRandomPassword = (length = 12) => {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const createDoctorAuthAccount = async (email, firstName, lastName) => {
    try {
      setCreatingAuth(true);
      const tempPassword = generateRandomPassword();

      // Create user in Firebase Auth
      await createUserWithEmailAndPassword(auth, email, tempPassword);

      // Send password reset email
      await sendPasswordResetEmail(auth, email);

      // Store credentials to show to admin
      setDoctorCredentials({
        email,
        tempPassword,
        firstName,
        lastName,
      });

      setCredentialsOpen(true);

      showAlert(
        `Authentication account created! Password reset email sent to ${email}`,
        "success"
      );

      return true;
    } catch (error) {
      console.error("Error creating auth account:", error);

      if (error.code === "auth/email-already-in-use") {
        showAlert(
          `Email ${email} is already registered. Please use a different email.`,
          "warning"
        );
      } else if (error.code === "auth/invalid-email") {
        showAlert("Invalid email address", "error");
      } else {
        showAlert(`Error creating authentication account: ${error.message}`, "error");
      }

      return false;
    } finally {
      setCreatingAuth(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      let photoUrl = formData.photo;

      if (imageUpload.imageFile) {
        photoUrl = await imageUpload.uploadImage();
      }

      const doctorData = {
        ...formData,
        photo: photoUrl,
        consultationPrice: parseFloat(formData.consultationPrice) || 0,
        name: `${formData.firstName} ${formData.lastName}`,
        role: "doctor",
      };

      const result = selectedItem
        ? await updateData(selectedItem.docId, doctorData)
        : await addData(doctorData);

      if (result.success) {
        if (!selectedItem) {
          const authCreated = await createDoctorAuthAccount(
            formData.email,
            formData.firstName,
            formData.lastName
          );

          if (authCreated) {
            showAlert(
              `Doctor ${formData.firstName} ${formData.lastName} added successfully!`,
              "success"
            );
            closeDialog();
            imageUpload.resetImage();
            return;
          }
        } else {
          showAlert("Doctor updated successfully!", "success");
          closeDialog();
          imageUpload.resetImage();
        }
      } else {
        showAlert("Failed to save doctor.", "error");
      }
    } catch (err) {
      console.error("Error saving doctor:", err);
      showAlert("Error saving doctor: " + err.message, "error");
    }
  };

  const handleDelete = async (docId) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      const result = await deleteData(docId);
      if (result.success) {
        showAlert("Doctor deleted successfully!", "info");
      } else {
        showAlert("Failed to delete doctor.", "error");
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showAlert("Copied to clipboard!", "info");
  };

  const CredentialsDialog = () => (
    <Dialog
      open={credentialsOpen}
      onClose={() => setCredentialsOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#0c2993" }}>
          Doctor Authentication Created
        </Typography>
        <IconButton onClick={() => setCredentialsOpen(false)} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          A password reset email has been sent to {doctorCredentials?.email}. The doctor can use the link to set their own password.
        </Alert>

        <Box sx={{ bgcolor: "#f5f7ff", p: 2.5, borderRadius: "12px", mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1, color: "#0c2993" }}>
            Doctor Information:
          </Typography>
          <Stack spacing={1.5}>
            <Box>
              <Typography variant="caption" sx={{ color: "#666", display: "block" }}>
                Name
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#0c2993" }}>
                Dr. {doctorCredentials?.firstName} {doctorCredentials?.lastName}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: "#666", display: "block" }}>
                Email
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#0c2993", wordBreak: "break-all" }}>
                  {doctorCredentials?.email}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => copyToClipboard(doctorCredentials?.email)}
                  sx={{ color: "#0c2993" }}
                >
                  <ContentCopy sx={{ fontSize: "1rem" }} />
                </IconButton>
              </Box>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: "#666", display: "block" }}>
                Temporary Password
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: "#0c2993",
                    wordBreak: "break-all",
                    fontFamily: "monospace",
                    p: 1,
                    bgcolor: "white",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                    flex: 1,
                  }}
                >
                  {doctorCredentials?.tempPassword}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => copyToClipboard(doctorCredentials?.tempPassword)}
                  sx={{ color: "#0c2993" }}
                >
                  <ContentCopy sx={{ fontSize: "1rem" }} />
                </IconButton>
              </Box>
            </Box>
          </Stack>
        </Box>

        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            Next Steps:
          </Typography>
          <Typography variant="caption" component="div" sx={{ mb: 0.5 }}>
            1. Share the email and temporary password with the doctor
          </Typography>
          <Typography variant="caption" component="div" sx={{ mb: 0.5 }}>
            2. Doctor can login with these credentials at first attempt
          </Typography>
          <Typography variant="caption" component="div" sx={{ mb: 0.5 }}>
            3. A password reset email has been sent to change the password
          </Typography>
          <Typography variant="caption" component="div">
            4. Doctor can also use "Forgot Password" on login page
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: "#f9fafb" }}>
        <Button
          onClick={() => setCredentialsOpen(false)}
          sx={{
            color: "#0c2993",
            fontWeight: 600,
            textTransform: "none",
          }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );

  const MobileCardView = () => (
    <Grid
      container
      spacing={1.5}
      justifyContent="center"
      sx={{ width: "100%", margin: "0 auto" }}
    >
      {paginatedData.map((doctor) => (
        <Grid
          item
          xs={6}
          sm={6}
          key={doctor.docId}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Card
            sx={{
              borderRadius: "14px",
              border: "2px solid #e0e0e0",
              width: "100%",
              minHeight: "420px",
              transition: "all 0.3s ease",
              display: "flex",
              flexDirection: "column",
              "&:hover": {
                boxShadow: "0 12px 32px rgba(12, 41, 147, 0.2)",
                borderColor: "#0c2993",
                transform: "translateY(-4px)",
              },
            }}
          >
            <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%", p: { xs: 1.5, sm: 2 } }}>
              <Stack spacing={{ xs: 1.5, sm: 2 }} sx={{ height: "100%" }}>
                {/* Doctor Avatar & Name */}
                <Box sx={{ textAlign: "center" }}>
                  <AvatarWithInfo
                    src={doctor.photo || ""}
                    initials={getInitials(doctor.firstName, doctor.lastName)}
                    primaryText={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                    secondaryText={doctor.medicalLicense || "No license"}
                    size={{ xs: 50, sm: 60 }}
                  />
                </Box>

                {/* Details */}
                <Stack spacing={{ xs: 1, sm: 1.5 }}>
                  <Box sx={{ bgcolor: "#f5f7ff", p: 1, borderRadius: "6px" }}>
                    <Typography variant="caption" sx={{ color: "#666", display: "block", mb: 0.3, fontSize: "0.7rem" }}>
                      Email
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: "#0c2993",
                        fontSize: { xs: "0.75rem", sm: "0.85rem" },
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {doctor.email}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                    <StatusChip
                      status={doctor.department}
                      getStatusColor={() => ({ bg: "#e3f2fd", color: "#0c2993" })}
                    />
                  </Box>

                  <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                    <Chip
                      label={`${doctor.yearsOfExperience}y`}
                      size="small"
                      sx={{
                        bgcolor: "#fce4ec",
                        color: "#ff66b2",
                        fontWeight: 600,
                        fontSize: "0.7rem",
                        height: "24px",
                      }}
                    />
                    <Chip
                      label={formatPrice(doctor.consultationPrice)}
                      size="small"
                      sx={{
                        bgcolor: "#fff3e0",
                        color: "#e65100",
                        fontWeight: 600,
                        fontSize: "0.7rem",
                        height: "24px",
                      }}
                    />
                  </Box>

                  <Box>
                    <StatusChip
                      status={doctor.status}
                      getStatusColor={(s) => ({
                        bg: s === "Active" ? "#e3f2fd" : "#fff3e0",
                        color: s === "Active" ? "#0c2993" : "#ff9800",
                      })}
                    />
                  </Box>
                </Stack>

                {/* Actions */}
                <Box sx={{ display: "flex", gap: 0.75, mt: "auto", pt: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<Edit sx={{ fontSize: "0.9rem" }} />}
                    onClick={() => openDialog(doctor)}
                    fullWidth
                    size="small"
                    sx={{
                      bgcolor: "#0c2993",
                      color: "white",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      py: 0.75,
                      "&:hover": { bgcolor: "#061a5e" },
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Delete sx={{ fontSize: "0.9rem" }} />}
                    onClick={() => handleDelete(doctor.docId)}
                    fullWidth
                    size="small"
                    sx={{
                      color: "#ff66b2",
                      borderColor: "#ff66b2",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      py: 0.75,
                      "&:hover": { bgcolor: "#fde4f0", borderColor: "#ff66b2" },
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  // Desktop Table View
  const columns = [
    { label: "Doctor" },
    { label: "Email" },
    { label: "Phone" },
    { label: "Department" },
    { label: "Experience" },
    { label: "Price" },
    { label: "Status" },
    { label: "Actions", align: "center" },
  ];

  const renderRow = (doctor) => (
    <TableRow
      key={doctor.docId}
      sx={{
        "&:hover": { backgroundColor: "#f5f7ff" },
        transition: "background-color 0.2s ease",
      }}
    >
      <TableCell>
        <AvatarWithInfo
          src={doctor.photo || ""}
          initials={getInitials(doctor.firstName, doctor.lastName)}
          primaryText={`Dr. ${doctor.firstName} ${doctor.lastName}`}
          secondaryText={doctor.medicalLicense || "No license"}
          size={50}
        />
      </TableCell>
      <TableCell>{doctor.email}</TableCell>
      <TableCell>{doctor.phone}</TableCell>
      <TableCell>
        <StatusChip
          status={doctor.department}
          getStatusColor={() => ({ bg: "#e3f2fd", color: "#0c2993" })}
        />
      </TableCell>
      <TableCell>{doctor.yearsOfExperience} years</TableCell>
      <TableCell>
        <StatusChip
          status={formatPrice(doctor.consultationPrice)}
          getStatusColor={() => ({ bg: "#fff3e0", color: "#e65100" })}
        />
      </TableCell>
      <TableCell>
        <StatusChip
          status={doctor.status}
          getStatusColor={(s) => ({
            bg: s === "Active" ? "#e3f2fd" : "#fff3e0",
            color: s === "Active" ? "#0c2993" : "#ff9800",
          })}
        />
      </TableCell>
      <TableCell align="center">
        <ActionButtons
          actions={[
            {
              icon: <Edit />,
              onClick: () => openDialog(doctor),
              bgcolor: "#e3f2fd",
              color: "#0c2993",
              hoverBg: "#0c2993",
              title: "Edit",
            },
            {
              icon: <Delete />,
              onClick: () => handleDelete(doctor.docId),
              bgcolor: "#fde4f0",
              color: "#ff66b2",
              hoverBg: "#ff66b2",
              title: "Delete",
            },
          ]}
        />
      </TableCell>
    </TableRow>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <PageHeader
          title="Doctors Management"
          icon={MedicalInformation}
        />

        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => openDialog()}
            disabled={creatingAuth}
            fullWidth={isMobile}
            sx={{
              background: "linear-gradient(90deg,#0c2993,#ff66b2)",
              borderRadius: "10px",
              px: 3,
              py: 1.2,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.95rem",
              width: isMobile ? "100%" : "auto",
              "&:hover": {
                background: "linear-gradient(90deg,#0b1f73,#e55599)",
              },
            }}
          >
            Add Doctor
          </Button>
        </Box>
      </Box>

      <SearchBar
        value={searchQuery}
        onChange={handleSearchChange}
        onClear={clearSearch}
        placeholder="Search doctors..."
      />

      {isMobile ? (
        <>
          <Box sx={{ mt: 3 }}>
            <MobileCardView />
          </Box>
          {/* Mobile Pagination */}
          {Math.ceil(totalItems / rowsPerPage) > 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 1,
                mt: 3,
                flexWrap: "wrap",
              }}
            >
              <Button
                disabled={page === 0}
                onClick={() => handleChangePage(null, page - 1)}
                size="small"
                variant="outlined"
              >
                Previous
              </Button>
              <Button disabled size="small" variant="outlined">
                Page {page + 1} of {Math.ceil(totalItems / rowsPerPage)}
              </Button>
              <Button
                disabled={page >= Math.ceil(totalItems / rowsPerPage) - 1}
                onClick={() => handleChangePage(null, page + 1)}
                size="small"
                variant="outlined"
              >
                Next
              </Button>
            </Box>
          )}
        </>
      ) : (
        <DataTable
          columns={columns}
          data={paginatedData}
          loading={loading}
          emptyMessage={
            searchQuery
              ? `No doctors found matching "${searchQuery}"`
              : "No doctors found."
          }
          emptyIcon={MedicalInformation}
          renderRow={renderRow}
          pagination={{
            total: totalItems,
            rowsPerPage,
            page,
            onPageChange: handleChangePage,
            onRowsPerPageChange: handleChangeRowsPerPage,
          }}
        />
      )}

      <DoctorDialog
        open={open}
        doctor={selectedItem}
        departments={departmentNames}
        onClose={closeDialog}
        onSubmit={handleSubmit}
        imageUpload={imageUpload}
        showAlert={showAlert}
      />

      <CredentialsDialog />

      <AlertSnackbar alert={alert} onClose={hideAlert} />
    </Box>
  );
};

export default Doctors;