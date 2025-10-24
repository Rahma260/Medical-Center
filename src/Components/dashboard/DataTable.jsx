import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Typography,
  TablePagination,
} from "@mui/material";

const DataTable = ({
  columns,
  data,
  loading,
  emptyMessage,
  emptyIcon: EmptyIcon,
  renderRow,
  pagination,
}) => {
  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h6" color="text.secondary">
          {emptyMessage}
        </Typography>
        {EmptyIcon && <EmptyIcon sx={{ fontSize: 60, color: "#e0e0e0", mt: 2 }} />}
      </Box>
    );
  }

  return (
    <Paper
      sx={{
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                background: "linear-gradient(90deg, #0c2993, #ff66b2)",
                "& th": {
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                },
              }}
            >
              {columns.map((col, index) => (
                <TableCell key={index} align={col.align || "left"}>
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => renderRow(row))}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={pagination.total}
          rowsPerPage={pagination.rowsPerPage}
          page={pagination.page}
          onPageChange={pagination.onPageChange}
          onRowsPerPageChange={pagination.onRowsPerPageChange}
          sx={{
            borderTop: "1px solid #e0e0e0",
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
              fontWeight: 500,
            },
          }}
        />
      )}
    </Paper>
  );
};

export default DataTable;