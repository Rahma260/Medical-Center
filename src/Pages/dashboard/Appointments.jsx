import React, { useEffect } from "react";
import {
  Box,
  TableRow,
  TableCell,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { data: appointments, loading } = useFirestore("Appointments");
  const { alert, hideAlert } = useAlert();

  const { searchQuery, filteredData, handleSearchChange, clearSearch } = useSearch(
    appointments,
    ["patientName", "doctorName", "department", "date", "status"]
  );

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

  // ✅ Mobile Card View
  const MobileCardView = () => (
    <Grid container spacing={2}>
      {paginatedData.map((apt) => (
        <Grid item xs={12} key={apt.id}>
          <Card sx={{ borderRadius: "12px", border: "1px solid #e0e0e0" }}>
            <CardContent>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" sx={{ color: "#666" }}>
                    Patient
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0c2993" }}>
                    {apt.patientName || "N/A"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#666" }}>
                      Doctor
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {apt.doctorName || "N/A"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#666" }}>
                      Department
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {apt.department || "N/A"}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#666" }}>
                      Date
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {apt.date || "N/A"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#666" }}>
                      Time
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {apt.time || apt.startTime || "N/A"}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <StatusChip
                    status={apt.status || "Pending"}
                    getStatusColor={getStatusColor}
                  />
                  <Typography variant="caption" sx={{ color: "#999" }}>
                    {apt.createdAt?.toDate
                      ? apt.createdAt.toDate().toLocaleDateString()
                      : "N/A"}
                  </Typography>
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
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <PageHeader title="Appointments List" icon={Event} />

      <SearchBar
        value={searchQuery}
        onChange={handleSearchChange}
        onClear={clearSearch}
        placeholder="Search appointments..."
      />

      {isMobile ? (
        <>
          <MobileCardView />
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
            >
              Previous
            </Button>
            <Button disabled size="small">
              Page {page + 1}
            </Button>
            <Button
              disabled={page >= Math.ceil(totalItems / rowsPerPage) - 1}
              onClick={() => handleChangePage(null, page + 1)}
              size="small"
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
      )}

      <AlertSnackbar alert={alert} onClose={hideAlert} />
    </Box>
  );
};

export default Appointments;