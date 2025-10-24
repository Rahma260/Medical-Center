import React, { useEffect } from "react";
import {
  Box,
  Button,
  TableRow,
  TableCell,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  MedicalInformation,
  Add,
  Edit,
  Delete,
  Phone,
  Home,
  CalendarToday,
  Person,
} from "@mui/icons-material";

import { usePagination } from "../../hooks/usePagination";
import { useFirestore } from "../../hooks/useFirestore";
import { useAlert } from "../../hooks/useAlert";
import { useDialog } from "../../hooks/useDialog";
import { useSearch } from "../../hooks/useSearch";
import PageHeader from "../../Components/dashboard/PageHeader";
import DataTable from "../../Components/dashboard/DataTable";
import AlertSnackbar from "../../Components/dashboard/AlertSnackbar";
import ActionButtons from "../../Components/dashboard/ActionButtons";
import InfoWithIcon from "../../Components/dashboard/InfoWithIcon";
import StatusChip from "../../Components/dashboard/StatusChip";
import PatientDialog from "../../Components/dashboard/patients/PatientDialog";
import SearchBar from "../../Components/common/SearchBar";

const Patients = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { data: patients, loading, addData, updateData, deleteData } =
    useFirestore("Patients");
  const { alert, showAlert, hideAlert } = useAlert();
  const { open, selectedItem, openDialog, closeDialog } = useDialog();

  const { searchQuery, filteredData, handleSearchChange, clearSearch } =
    useSearch(patients, ["name", "email", "phone", "address", "gender", "role"]);

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

  const handleSubmit = async (formData) => {
    const result = selectedItem
      ? await updateData(selectedItem.id, formData)
      : await addData(formData);

    if (result.success) {
      showAlert(
        `Patient ${selectedItem ? "updated" : "added"} successfully!`,
        "success"
      );
      closeDialog();
    } else {
      showAlert("Failed to save patient.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      const result = await deleteData(id);
      if (result.success) {
        showAlert("Patient deleted successfully!", "success");
      } else {
        showAlert("Failed to delete patient.", "error");
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
      {paginatedData.map((patient) => (
        <Grid
          item
          xs={12}
          sm={10}
          md={8}
          key={patient.id}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Card
            sx={{
              borderRadius: "16px",
              border: "2px solid #e0e0e0",
              width: "100%",
              maxWidth: "450px",
              minHeight: "420px",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 8px 24px rgba(12, 41, 147, 0.15)",
                borderColor: "#0c2993",
              },
            }}
          >
            <CardContent>
              <Stack spacing={2.5} sx={{ height: "100%" }}>
                {/* Name & Email */}
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#0c2993", mb: 0.5 }}
                  >
                    {patient.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.85rem" }}>
                    {patient.email}
                  </Typography>
                </Box>

                {/* Details Grid */}
                <Stack spacing={2}>
                  <Box sx={{ bgcolor: "#f5f7ff", p: 1.5, borderRadius: "8px" }}>
                    <Typography variant="caption" sx={{ color: "#666", display: "block", mb: 0.5 }}>
                      Phone Number
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#0c2993" }}>
                      {patient.phone || "N/A"}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1.5 }}>
                    <Box sx={{ flex: 1, bgcolor: "#fde4f0", p: 1.5, borderRadius: "8px" }}>
                      <Typography variant="caption" sx={{ color: "#666", display: "block", mb: 0.5 }}>
                        Gender
                      </Typography>
                      <StatusChip
                        status={patient.gender || "N/A"}
                        getStatusColor={(g) => ({
                          bg: g === "female" ? "#fde4f0" : "#e3f2fd",
                          color: g === "female" ? "#ff66b2" : "#0c2993",
                        })}
                      />
                    </Box>
                    <Box sx={{ flex: 1, bgcolor: "#e3f2fd", p: 1.5, borderRadius: "8px" }}>
                      <Typography variant="caption" sx={{ color: "#666", display: "block", mb: 0.5 }}>
                        Role
                      </Typography>
                      <StatusChip
                        status={patient.role || "patient"}
                        getStatusColor={() => ({ bg: "#e3f2fd", color: "#0c2993" })}
                      />
                    </Box>
                  </Box>

                  <Box sx={{ bgcolor: "#f5f7ff", p: 1.5, borderRadius: "8px" }}>
                    <Typography variant="caption" sx={{ color: "#666", display: "block", mb: 0.5 }}>
                      Address
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#0c2993", fontSize: "0.9rem" }}>
                      {patient.address || "N/A"}
                    </Typography>
                  </Box>


                </Stack>

                {/* Action Buttons */}
                <Box sx={{ display: "flex", gap: 1, mt: "auto", pt: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={() => openDialog(patient)}
                    size="small"
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
                    onClick={() => handleDelete(patient.id)}
                    size="small"
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
    { label: "Patient" },
    { label: "Phone" },
    { label: "Gender" },
    { label: "Address" },
    { label: "Created At" },
    { label: "Role" },
    { label: "Actions", align: "center" },
  ];

  const renderRow = (patient) => (
    <TableRow
      key={patient.id}
      sx={{
        "&:hover": { backgroundColor: "#f5f7ff" },
        transition: "background-color 0.2s ease",
      }}
    >
      <TableCell>
        <Box>
          <Typography variant="body1" fontWeight={600} color="#0c2993">
            {patient.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {patient.email}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        <InfoWithIcon icon={Phone} text={patient.phone || "N/A"} color="#ff66b2" />
      </TableCell>
      <TableCell>
        <StatusChip
          status={patient.gender || "N/A"}
          getStatusColor={(g) => ({
            bg: g === "female" ? "#fde4f0" : "#e3f2fd",
            color: g === "female" ? "#ff66b2" : "#0c2993",
          })}
        />
      </TableCell>
      <TableCell>
        <InfoWithIcon icon={Home} text={patient.address || "N/A"} />
      </TableCell>
      <TableCell>
        <InfoWithIcon
          icon={CalendarToday}
          text={
            patient.createdAt?.toDate
              ? patient.createdAt.toDate().toLocaleDateString()
              : "N/A"
          }
          color="#ff66b2"
        />
      </TableCell>
      <TableCell>
        <StatusChip status={patient.role || "patient"} />
      </TableCell>
      <TableCell align="center">
        <ActionButtons
          actions={[
            {
              icon: <Edit fontSize="small" />,
              onClick: () => openDialog(patient),
              bgcolor: "#e3f2fd",
              color: "#0c2993",
              hoverBg: "#0c2993",
              title: "Edit",
            },
            {
              icon: <Delete fontSize="small" />,
              onClick: () => handleDelete(patient.id),
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
      <PageHeader
        title="Patients List"
        icon={MedicalInformation}
        actionButton={
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => openDialog()}
            fullWidth={isMobile}
            sx={{
              bgcolor: "#0c2993",
              "&:hover": { bgcolor: "#061a5e" },
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1.2,
              borderRadius: 2,
            }}
          >
            Add Patient
          </Button>
        }
      />

      <SearchBar
        value={searchQuery}
        onChange={handleSearchChange}
        onClear={clearSearch}
        placeholder="Search patients..."
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
              Page {page + 1}
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
              ? `No patients found matching "${searchQuery}"`
              : "No patients found."
          }
          emptyIcon={Person}
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

      <PatientDialog
        open={open}
        patient={selectedItem}
        onClose={closeDialog}
        onSubmit={handleSubmit}
      />

      <AlertSnackbar alert={alert} onClose={hideAlert} />
    </Box>
  );
};

export default Patients;