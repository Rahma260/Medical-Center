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
} from "@mui/material";
import { MedicalInformation, Add, Edit, Delete } from "@mui/icons-material";
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
  } = usePagination(filteredData, isMobile ? 5 : 10);

  useEffect(() => {
    resetPagination();
  }, [searchQuery]);

  const getInitials = (firstName, lastName) =>
    `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return `$${parseFloat(price).toFixed(2)}`;
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
        showAlert(
          `Doctor ${selectedItem ? "updated" : "added"} successfully!`,
          "success"
        );
        closeDialog();
        imageUpload.resetImage();
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

  // ✅ Mobile Card View - Larger, Centered, Uniform Size
  const MobileCardView = () => (
    <Grid
      container
      spacing={2}
      justifyContent="center"
      sx={{ width: "100%", margin: "0 auto" }}
    >
      {paginatedData.map((doctor) => (
        <Grid
          item
          xs={12}
          sm={10}
          md={8}
          key={doctor.docId}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Card
            sx={{
              borderRadius: "16px",
              border: "2px solid #e0e0e0",
              width: "100%",
              maxWidth: "500px",
              minHeight: "480px",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 12px 32px rgba(12, 41, 147, 0.2)",
                borderColor: "#0c2993",
                transform: "translateY(-4px)",
              },
            }}
          >
            <CardContent>
              <Stack spacing={2.5} sx={{ height: "100%" }}>
                {/* Doctor Avatar & Name */}
                <Box sx={{ textAlign: "center" }}>
                  <AvatarWithInfo
                    src={doctor.photo || ""}
                    initials={getInitials(doctor.firstName, doctor.lastName)}
                    primaryText={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                    secondaryText={doctor.medicalLicense || "No license"}
                    size={60}
                  />
                </Box>

                {/* Details */}
                <Stack spacing={2}>
                  <Box sx={{ bgcolor: "#f5f7ff", p: 1.5, borderRadius: "8px" }}>
                    <Typography variant="caption" sx={{ color: "#666", display: "block", mb: 0.5 }}>
                      Email
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#0c2993", fontSize: "0.9rem" }}>
                      {doctor.email}
                    </Typography>
                  </Box>

                  <Box sx={{ bgcolor: "#f5f7ff", p: 1.5, borderRadius: "8px" }}>
                    <Typography variant="caption" sx={{ color: "#666", display: "block", mb: 0.5 }}>
                      Phone
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#0c2993", fontSize: "0.9rem" }}>
                      {doctor.phone}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <StatusChip
                      status={doctor.department}
                      getStatusColor={() => ({ bg: "#e3f2fd", color: "#0c2993" })}
                    />
                    <Chip
                      label={`${doctor.yearsOfExperience} years`}
                      size="small"
                      sx={{ bgcolor: "#fce4ec", color: "#ff66b2", fontWeight: 600 }}
                    />
                    <Chip
                      label={formatPrice(doctor.consultationPrice)}
                      size="small"
                      sx={{ bgcolor: "#fff3e0", color: "#e65100", fontWeight: 600 }}
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
                <Box sx={{ display: "flex", gap: 1, mt: "auto", pt: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={() => openDialog(doctor)}
                    fullWidth
                    sx={{
                      bgcolor: "#0c2993",
                      color: "white",
                      fontWeight: 600,
                      "&:hover": { bgcolor: "#061a5e" },
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Delete />}
                    onClick={() => handleDelete(doctor.docId)}
                    fullWidth
                    sx={{
                      color: "#ff66b2",
                      borderColor: "#ff66b2",
                      fontWeight: 600,
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

  // ✅ Desktop Table View
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
      {/* ✅ Header Section with Title and Button Stacked */}
      <Box sx={{ mb: 3 }}>
        <PageHeader
          title="Doctors Management"
          icon={MedicalInformation}
        />

        {/* ✅ Add Doctor Button Below Title */}
        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => openDialog()}
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

      <AlertSnackbar alert={alert} onClose={hideAlert} />
    </Box>
  );
};

export default Doctors;