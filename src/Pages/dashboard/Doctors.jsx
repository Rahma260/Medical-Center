import React, { useEffect } from "react";
import { Box, Button, TableRow, TableCell } from "@mui/material";
import {
  MedicalInformation,
  Add,
  Edit,
  Delete,
} from "@mui/icons-material";
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
  const { data: doctors, loading, addData, updateData, deleteData } = useFirestore("Doctors");
  const { data: departments } = useFirestore("Departments");
  const { alert, showAlert, hideAlert } = useAlert();
  const { open, selectedItem, openDialog, closeDialog } = useDialog();
  const imageUpload = useImageUpload();

  const departmentNames = departments.map((d) => d.name || d.id);

  // Search functionality
  const { searchQuery, filteredData, handleSearchChange, clearSearch } = useSearch(
    doctors,
    [
      "firstName",
      "lastName",
      "email",
      "phone",
      "department",
      "institution",
      "medicalLicense",
    ]
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
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Doctors Management"
        icon={MedicalInformation}
        actionButton={
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => openDialog()}
            sx={{
              background: "linear-gradient(90deg,#0c2993,#ff66b2)",
              borderRadius: "10px",
              px: 3,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                background: "linear-gradient(90deg,#0b1f73,#e55599)",
              },
            }}
          >
            Add Doctor
          </Button>
        }
      />

      <SearchBar
        value={searchQuery}
        onChange={handleSearchChange}
        onClear={clearSearch}
        placeholder="Search doctors by name, email, phone, department, license..."
      />

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