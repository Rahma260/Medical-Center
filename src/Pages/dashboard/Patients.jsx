import React from "react";
import { Box, Button, TableRow, TableCell, Typography } from "@mui/material";
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
  const { data: patients, loading, addData, updateData, deleteData } = useFirestore("Patients");
  const { alert, showAlert, hideAlert } = useAlert();
  const { open, selectedItem, openDialog, closeDialog } = useDialog();

  // Search functionality
  const { searchQuery, filteredData, handleSearchChange, clearSearch } = useSearch(
    patients,
    ["name", "email", "phone", "address", "gender", "role"]
  );

  // Pagination on filtered data
  const {
    page,
    rowsPerPage,
    paginatedData,
    handleChangePage,
    handleChangeRowsPerPage,
    totalItems,
    resetPagination,
  } = usePagination(filteredData, 10);

  // Reset pagination when search changes
  React.useEffect(() => {
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
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Patients List"
        icon={MedicalInformation}
        actionButton={
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => openDialog()}
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
        placeholder="Search patients by name, email, phone, address..."
      />

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