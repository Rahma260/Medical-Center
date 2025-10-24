import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const LineChartCard = ({ title, data, lines, colors, height = 380 }) => {
  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: "white",
            p: 2,
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            border: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="body2" fontWeight={700} sx={{ mb: 1, color: "#333" }}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor: entry.color,
                }}
              />
              <Typography variant="caption" fontWeight={600} color="text.secondary">
                {entry.name}:
              </Typography>
              <Typography variant="caption" fontWeight={700} color={entry.color}>
                {entry.value}
              </Typography>
            </Box>
          ))}
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
        height: "100%",
        width: "100%",
        background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        border: "1px solid rgba(0,0,0,0.05)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
          transform: "translateY(-4px)",
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 }, height: "100%", width: "100%" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Box
            sx={{
              bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: 2,
              p: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            <TrendingUpIcon sx={{ color: "white", fontSize: 24 }} />
          </Box>
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{
              fontSize: { xs: "1.1rem", md: "1.3rem" },
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {title}
          </Typography>
        </Box>

        {data && data.length > 0 ? (
          <Box sx={{ width: "100%", height: height }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
              >
                <defs>
                  {colors.map((color, index) => (
                    <linearGradient key={index} id={`gradient${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                <XAxis
                  dataKey="month"
                  style={{ fontSize: "0.85rem", fontWeight: 600 }}
                  stroke="#666"
                  tickLine={false}
                />
                <YAxis
                  style={{ fontSize: "0.85rem", fontWeight: 600 }}
                  stroke="#666"
                  tickLine={false}
                  axisLine={false}
                  width={40}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#ddd", strokeWidth: 2 }} />
                <Legend
                  wrapperStyle={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    paddingTop: "15px",
                  }}
                  iconType="circle"
                />
                {lines.map((line, index) => (
                  <Line
                    key={index}
                    type="monotone"
                    dataKey={line.dataKey}
                    stroke={colors[index]}
                    strokeWidth={3}
                    dot={{
                      r: 5,
                      fill: colors[index],
                      strokeWidth: 2,
                      stroke: "white",
                    }}
                    activeDot={{
                      r: 7,
                      fill: colors[index],
                      strokeWidth: 3,
                      stroke: "white",
                    }}
                    name={line.name}
                    fill={`url(#gradient${index})`}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TrendingUpIcon sx={{ fontSize: 70, color: "#e0e0e0", mb: 2 }} />
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

export default LineChartCard;