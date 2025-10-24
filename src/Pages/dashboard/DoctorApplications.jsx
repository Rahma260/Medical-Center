import React from "react";
import { Box, TableRow, TableCell, Chip } from "@mui/material";
import {
  MedicalServices,
  Visibility,
  CheckCircleOutline,
  HighlightOff,
  AttachMoney,
} from "@mui/icons-material";
import { useFirestore } from "../../hooks/useFirestore";
import { useAlert } from "../../hooks/useAlert";
import { useDialog } from "../../hooks/useDialog";
import { setDoc, doc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../Firebase/firebase";
import PageHeader from "../../Components/dashboard/PageHeader";
import DataTable from "../../Components/dashboard/DataTable";
import AlertSnackbar from "../../Components/dashboard/AlertSnackbar";
import ActionButtons from "../../Components/dashboard/ActionButtons";
import AvatarWithInfo from "../../Components/dashboard/AvatarWithInfo";
import StatusChip from "../../Components/dashboard/StatusChip";
import ConfirmDialog from "../../Components/dashboard/ConfirmDialog";
import DoctorApplicationDetailsDialog from "../../Components/dashboard/applications/DoctorApplicationDetailsDialog";
import { usePagination } from "../../hooks/usePagination";

const DoctorApplications = () => {
  const { data: applications, loading, fetchData } = useFirestore("doctorApplications");
  const { alert, showAlert, hideAlert } = useAlert();
  const confirmDialog = useDialog();
  const viewDialog = useDialog();

  const {
    page,
    rowsPerPage,
    paginatedData,
    handleChangePage,
    handleChangeRowsPerPage,
    totalItems,
  } = usePagination(applications, 10);

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const handleAccept = async (doctor) => {
    try {
      const doctorUid = doctor.uid || doctor.id;

      await setDoc(doc(db, "Doctors", doctorUid), {
        ...doctor,
        approved: true,
        approvedBy: "admin",
        status: "Active",
        applicationStatus: "approved",
        approvedAt: serverTimestamp(),
      });

      await deleteDoc(doc(db, "doctorApplications", doctor.id));
      await fetchData();

      showAlert(
        `${doctor.firstName} ${doctor.lastName} has been accepted.`,
        "success"
      );
    } catch (error) {
      console.error("Error accepting doctor:", error);
      showAlert("Failed to accept doctor. Please try again.", "error");
    }
  };

  const handleReject = async (doctor) => {
    try {
      await deleteDoc(doc(db, "doctorApplications", doctor.id));
      await fetchData();

      showAlert(
        `${doctor.firstName} ${doctor.lastName} has been rejected.`,
        "info"
      );
    } catch (error) {
      console.error("Error rejecting doctor:", error);
      showAlert("Failed to reject doctor. Please try again.", "error");
    }
  };

  const handleConfirmAction = () => {
    const { selectedItem: doctor } = confirmDialog;
    const isAccept = confirmDialog.open && doctor?.action === "accept";

    if (isAccept) {
      handleAccept(doctor);
    } else {
      handleReject(doctor);
    }
    confirmDialog.closeDialog();
  };

  const columns = [
    { label: "Doctor" },
    { label: "Department" },
    { label: "Experience" },
    { label: "Institution" },
    { label: "Price" },
    { label: "Actions" },
  ];

  const renderRow = (app) => (
    <TableRow
      key={app.id}
      sx={{
        "&:hover": {
          backgroundColor: "#f5f7ff",
        },
        transition: "background-color 0.2s ease",
      }}
    >
      <TableCell>
        <AvatarWithInfo
          src={app.photo || null}
          initials={getInitials(app.firstName, app.lastName)}
          primaryText={`Dr. ${app.firstName} ${app.lastName}`}
          secondaryText={`License: ${app.medicalLicense}`}
          size={40}
        />
      </TableCell>
      <TableCell>
        <StatusChip
          status={app.department || "N/A"}
          getStatusColor={() => ({ bg: "#e3f2fd", color: "#0c2993" })}
        />
      </TableCell>
      <TableCell>
        <StatusChip
          status={`${app.yearsOfExperience || 0} years`}
          getStatusColor={() => ({ bg: "#fce4ec", color: "#ff66b2" })}
        />
      </TableCell>
      <TableCell>{app.institution || "N/A"}</TableCell>
      <TableCell>
        <Chip
          icon={<AttachMoney sx={{ fontSize: 16 }} />}
          label={formatPrice(app.consultationPrice)}
          size="small"
          sx={{
            backgroundColor: "#fff3e0",
            color: "#e65100",
            fontWeight: 600,
            borderRadius: 1,
          }}
        />
      </TableCell>
      <TableCell>
        <ActionButtons
          actions={[
            {
              icon: <Visibility sx={{ color: "#0c2993" }} />,
              onClick: () => viewDialog.openDialog(app),
              bgcolor: "#f3f5ff",
              color: "#0c2993",
              hoverBg: "#e0e4ff",
              title: "View Details",
            },
            {
              icon: <CheckCircleOutline sx={{ color: "#2e7d32" }} />,
              onClick: () =>
                confirmDialog.openDialog({ ...app, action: "accept" }),
              bgcolor: "#e6f8ed",
              color: "#2e7d32",
              hoverBg: "#d0f2de",
              title: "Accept",
            },
            {
              icon: <HighlightOff sx={{ color: "#c62828" }} />,
              onClick: () =>
                confirmDialog.openDialog({ ...app, action: "reject" }),
              bgcolor: "#ffeaea",
              color: "#c62828",
              hoverBg: "#ffd6d6",
              title: "Reject",
            },
          ]}
        />
      </TableCell>
    </TableRow>
  );

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader title="Doctor Applications" icon={MedicalServices} />

      <DataTable
        columns={columns}
        data={paginatedData}
        loading={loading}
        emptyMessage="No pending doctor applications."
        emptyIcon={MedicalServices}
        renderRow={renderRow}
        pagination={{
          total: totalItems,
          rowsPerPage,
          page,
          onPageChange: handleChangePage,
          onRowsPerPageChange: handleChangeRowsPerPage,
        }}
      />

      <ConfirmDialog
        open={confirmDialog.open}
        title={
          confirmDialog.selectedItem?.action === "accept"
            ? "Accept Doctor Application"
            : "Reject Doctor Application"
        }
        message={`Are you sure you want to ${confirmDialog.selectedItem?.action} Dr. ${confirmDialog.selectedItem?.firstName} ${confirmDialog.selectedItem?.lastName}?`}
        onConfirm={handleConfirmAction}
        onCancel={confirmDialog.closeDialog}
        confirmColor={
          confirmDialog.selectedItem?.action === "accept" ? "success" : "error"
        }
      />

      <DoctorApplicationDetailsDialog
        open={viewDialog.open}
        doctor={viewDialog.selectedItem}
        onClose={viewDialog.closeDialog}
        formatPrice={formatPrice}
      />

      <AlertSnackbar alert={alert} onClose={hideAlert} />
    </Box>
  );
};

export default DoctorApplications;