import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function ClaimButton({ onClaim, disabled, awardedPoints, setShowPoints }) {
  useEffect(() => {
    if (awardedPoints !== null) {
      const timer = setTimeout(() => setShowPoints(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [awardedPoints, setShowPoints]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Button
        onClick={onClaim}
        disabled={disabled}
        variant="contained"
        color="success"
        sx={{ fontWeight: 700, minWidth: 140, boxShadow: 3 }}
      >
        Claim Points
      </Button>
      {awardedPoints !== null && (
        <Typography sx={{ ml: 1, color: 'success.main', fontWeight: 700 }}>
          +{awardedPoints} pts!
        </Typography>
      )}
    </Box>
  );
}

export default ClaimButton;
