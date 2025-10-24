import React, { useEffect } from "react";
import { Box, TableRow, TableCell, Typography } from "@mui/material";
import {
  Event,
  MedicalServices,
  Business,
  CalendarToday,
  AccessTime,
} from "@mui/icons-material";
import { useFirestore } from "../../hooks/useFirestore";
import { useAlert } from "../../hooks/useAlert";
import { useSearch } from "../../hooks/useSearch";
import PageHeader from "../../Components/dashboard/PageHeader";
import DataTable from "../../Components/dashboard/DataTable";
import AlertSnackbar from "../../Components/dashboard/AlertSnackbar";
import InfoWithIcon from "../../Components/dashboard/InfoWithIcon";
import StatusChip from "../../Components/dashboard/StatusChip";
import { usePagination } from "../../hooks/usePagination";
import SearchBar from "../../Components/common/SearchBar";

const Appointments = () => {
  const { data: appointments, loading } = useFirestore("Appointments");
  const { alert, hideAlert } = useAlert();

  // Search functionality
  const { searchQuery, filteredData, handleSearchChange, clearSearch } = useSearch(
    appointments,
    ["patientName", "doctorName", "department", "date", "status"]
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "scheduled":
        return { bg: "#fde4f0", color: "#ff66b2" };
      case "completed":
        return { bg: "#e3f2fd", color: "#0c2993" };
      case "pending":
        return { bg: "#fff3e0", color: "#ff9800" };
      case "cancelled":
        return { bg: "#f5f5f5", color: "#757575" };
      default:
        return { bg: "#e0e0e0", color: "#616161" };
    }
  };

  const columns = [
    { label: "Patient" },
    { label: "Doctor" },
    { label: "Department" },
    { label: "Date" },
    { label: "Time" },
    { label: "Status" },
    { label: "Created At" },
  ];

  const renderRow = (apt) => (
    <TableRow
      key={apt.id}
      sx={{
        "&:hover": { backgroundColor: "#f5f7ff" },
        transition: "background-color 0.2s ease",
      }}
    >
      <TableCell>
        <Typography variant="body1" fontWeight={600} color="#0c2993">
          {apt.patientName || "N/A"}
        </Typography>
      </TableCell>
      <TableCell>
        <InfoWithIcon
          icon={MedicalServices}
          text={apt.doctorName || "N/A"}
          color="#ff66b2"
        />
      </TableCell>
      <TableCell>
        <InfoWithIcon icon={Business} text={apt.department || "N/A"} />
      </TableCell>
      <TableCell>
        <InfoWithIcon
          icon={CalendarToday}
          text={apt.date || "N/A"}
          color="#ff66b2"
          bold
        />
      </TableCell>
      <TableCell>
        <InfoWithIcon
          icon={AccessTime}
          text={apt.time || apt.startTime || "N/A"}
        />
      </TableCell>
      <TableCell>
        <StatusChip
          status={apt.status || "Pending"}
          getStatusColor={getStatusColor}
        />
      </TableCell>
      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {apt.createdAt?.toDate
            ? apt.createdAt.toDate().toLocaleDateString()
            : "N/A"}
        </Typography>
      </TableCell>
    </TableRow>
  );

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader title="Appointments List" icon={Event} />

      <SearchBar
        value={searchQuery}
        onChange={handleSearchChange}
        onClear={clearSearch}
        placeholder="Search appointments by patient, doctor, department, date..."
      />

      <DataTable
        columns={columns}
        data={paginatedData}
        loading={loading}
        emptyMessage={
          searchQuery
            ? `No appointments found matching "${searchQuery}"`
            : "No appointments found."
        }
        emptyIcon={Event}
        renderRow={renderRow}
        pagination={{
          total: totalItems,
          rowsPerPage,
          page,
          onPageChange: handleChangePage,
          onRowsPerPageChange: handleChangeRowsPerPage,
        }}
      />

      <AlertSnackbar alert={alert} onClose={hideAlert} />
    </Box>
  );
};

export default Appointments;