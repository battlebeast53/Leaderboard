import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/**
 * ClaimButton component
 * @param onClaim - callback to claim points
 * @param disabled - whether the button is disabled
 * @param awardedPoints - points just awarded
 * @param setShowPoints - function to reset awarded points
 */
function ClaimButton({ onClaim, disabled, awardedPoints, setShowPoints }) {
  // Reset awarded points display after 2 seconds
  useEffect(() => {
    if (awardedPoints !== null) {
      const timer = setTimeout(() => setShowPoints(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [awardedPoints, setShowPoints]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {/* Claim Points button */}
      <Button
        onClick={onClaim}
        disabled={disabled}
        variant="contained"
        color="success"
        sx={{ fontWeight: 700, minWidth: 140, boxShadow: 3 }}
      >
        Claim Points
      </Button>
      {/* Display awarded points if any */}
      {awardedPoints !== null && (
        <Typography sx={{ ml: 1, color: 'success.main', fontWeight: 700 }}>
          +{awardedPoints} pts!
        </Typography>
      )}
    </Box>
  );
}

export default ClaimButton;
