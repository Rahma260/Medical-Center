import React, { useState, useEffect } from "react";
import { Stack, Avatar, Box, Typography } from "@mui/material";

const AvatarWithInfo = ({ src, initials, primaryText, secondaryText, size = 40 }) => {
  const [imgError, setImgError] = useState(false);

  // Reset error state when src changes
  useEffect(() => {
    setImgError(false);
  }, [src]);

  // Determine if we should show the image
  const hasImage = src && !imgError && src.trim() !== "";

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Avatar
        {...(hasImage && { src: src })}
        alt={primaryText}
        imgProps={{
          onError: () => setImgError(true),
        }}
        sx={{
          bgcolor: "#0c2993",
          color: "white",
          width: size,
          height: size,
          fontSize: `${size / 2.5}rem`,
          fontWeight: 600,
          borderRadius: "50%",
          border: "2px solid #e3f2fd",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "& img": {
            borderRadius: "50%",
            objectFit: "cover",
          },
        }}
      >
        {!hasImage && (initials || "?")}
      </Avatar>
      <Box>
        <Typography variant="body1" fontWeight={600} color="#0c2993">
          {primaryText}
        </Typography>
        {secondaryText && (
          <Typography variant="body2" color="text.secondary">
            {secondaryText}
          </Typography>
        )}
      </Box>
    </Stack>
  );
};

export default AvatarWithInfo;