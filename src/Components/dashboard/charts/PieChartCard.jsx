import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { People } from "@mui/icons-material";
import { motion } from "framer-motion";

const PieChartCard = ({ title, data, colors, totalLabel, totalValue, borderColor }) => {
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null; // Don't show label for small slices

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        style={{ fontSize: "16px", fontWeight: "bold", textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: "white",
            p: 2,
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            border: `2px solid ${payload[0].payload.fill}`,
          }}
        >
          <Typography variant="body2" fontWeight={700} sx={{ mb: 0.5, color: payload[0].payload.fill }}>
            {payload[0].name}
          </Typography>
          <Typography variant="h6" fontWeight={700}>
            {payload[0].value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {payload[0].payload.percentage}% of total
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        borderTop: `5px solid ${borderColor}`,
        height: "100%",
        background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        border: "1px solid rgba(0,0,0,0.05)",
        borderTopWidth: "5px",
        borderTopColor: borderColor,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
          transform: "translateY(-4px)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{
            mb: 3,
            fontSize: "1.3rem",
            color: borderColor,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <People sx={{ fontSize: 28 }} />
          {title}
        </Typography>

        {data && data.length > 0 ? (
          <Box>
            {/* Pie Chart */}
            <Box sx={{ width: "100%", height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={110}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                        style={{
                          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            {/* Enhanced Legend with Stats */}
            <Box sx={{ mt: 3 }}>
              {data.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 2,
                      mb: 1.5,
                      borderRadius: 3,
                      bgcolor: "white",
                      border: `2px solid ${colors[index]}`,
                      boxShadow: `0 4px 12px ${colors[index]}20`,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateX(8px)",
                        boxShadow: `0 6px 20px ${colors[index]}30`,
                      },
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          bgcolor: colors[index],
                          boxShadow: `0 2px 8px ${colors[index]}40`,
                        }}
                      />
                      <Typography variant="body1" fontWeight={700} color={colors[index]}>
                        {item.name}
                      </Typography>
                    </Box>
                    <Box textAlign="right">
                      <Typography variant="h5" fontWeight={800} color={colors[index]}>
                        {item.value}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          fontWeight: 700,
                          bgcolor: `${colors[index]}15`,
                          px: 1,
                          py: 0.3,
                          borderRadius: 1,
                        }}
                      >
                        {item.percentage}%
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </Box>

            {/* Enhanced Total Summary */}
            <Box
              sx={{
                mt: 3,
                p: 2.5,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${borderColor}15 0%, ${borderColor}05 100%)`,
                border: `2px solid ${borderColor}`,
                textAlign: "center",
                boxShadow: `0 4px 16px ${borderColor}20`,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={600}
                sx={{ mb: 1, textTransform: "uppercase", letterSpacing: 1 }}
              >
                {totalLabel}
              </Typography>
              <Typography variant="h3" fontWeight={800} color={borderColor}>
                {totalValue}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <People sx={{ fontSize: 80, color: "#e0e0e0", mb: 2 }} />
            <Typography color="text.secondary" variant="body1" fontWeight={600}>
              No data available
            </Typography>
            <Typography color="text.secondary" variant="caption">
              Data will appear here once available
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PieChartCard;