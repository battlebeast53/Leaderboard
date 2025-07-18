import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { AnimatePresence, motion } from 'framer-motion';

// SVG medal images for top 3 and default ranks
const GoldMedal = () => (
  // Gold medal SVG for 1st place
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" fill="#FFD700" stroke="#E6C200" strokeWidth="2"/><text x="50%" y="55%" textAnchor="middle" fill="#23263A" fontSize="14" fontWeight="bold" dy=".3em">1</text></svg>
);
const SilverMedal = () => (
  // Silver medal SVG for 2nd place
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" fill="#C0C0C0" stroke="#B0B3C6" strokeWidth="2"/><text x="50%" y="55%" textAnchor="middle" fill="#23263A" fontSize="14" fontWeight="bold" dy=".3em">2</text></svg>
);
const BronzeMedal = () => (
  // Bronze medal SVG for 3rd place
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" fill="#CD7F32" stroke="#B87333" strokeWidth="2"/><text x="50%" y="55%" textAnchor="middle" fill="#23263A" fontSize="14" fontWeight="bold" dy=".3em">3</text></svg>
);
const DefaultMedal = ({rank}) => (
  // Default circle with rank number for 4th and below
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" fill="#2D3146" stroke="#6C63FF" strokeWidth="2"/><text x="50%" y="55%" textAnchor="middle" fill="#6C63FF" fontSize="14" fontWeight="bold" dy=".3em">{rank}</text></svg>
);

// Helper to select the correct medal SVG
function getRankMedal(rank) {
  if (rank === 1) return <GoldMedal />;
  if (rank === 2) return <SilverMedal />;
  if (rank === 3) return <BronzeMedal />;
  return <DefaultMedal rank={rank} />;
}

/**
 * Leaderboard component
 * @param users - array of user objects
 * @param claimedUser - user object {id, ts} to highlight after claim
 */
function Leaderboard({ users = [], claimedUser }) {
  // Sort users by totalPoints descending
  const sorted = [...users].sort((a, b) => b.totalPoints - a.totalPoints);

  // Highlight the user who just claimed points
  const [highlighted, setHighlighted] = useState(null);
  useEffect(() => {
    if (claimedUser && claimedUser.id) {
      setHighlighted(claimedUser.id);
      const timer = setTimeout(() => setHighlighted(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [claimedUser?.ts]);

  return (
    <Box>
      {/* Leaderboard header */}
      <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: '#F3F6F9' }}>
        <EmojiEventsIcon color="primary" /> Leaderboard
      </Typography>
      {/* Animated list of users with highlight on claim */}
      <List disablePadding>
        <AnimatePresence>
          {sorted.map((user, idx) => (
            <motion.div
              key={user._id}
              layout
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              style={{ width: '100%' }}
            >
              <ListItem
                sx={{
                  mb: 1,
                  borderRadius: 1.5,
                  boxShadow: idx === 0 ? 3 : 1,
                  background: '#2D3146',
                  color: '#F3F6F9',
                  display: 'flex',
                  alignItems: 'center',
                  px: 2,
                  py: 1,
                  minHeight: 48,
                  transition: 'background 0.3s, color 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    background: '#fff',
                    color: '#23263A',
                    boxShadow: 6,
                    '& .MuiTypography-root': { color: '#23263A' },
                  },
                  // Gold glow highlight for the user who just claimed points
                  boxShadow: highlighted === user._id ? '0 0 0 4px #FFD700, 0 2px 8px #0002' : (idx === 0 ? 3 : 1),
                  zIndex: highlighted === user._id ? 2 : 1,
                }}
              >
                {/* Medal avatar */}
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'transparent', width: 36, height: 36, mr: 2, boxShadow: 2 }}>
                    {getRankMedal(idx + 1)}
                  </Avatar>
                </ListItemAvatar>
                {/* User name and rank */}
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" sx={{ fontWeight: idx === 0 ? 700 : 500, color: 'inherit' }}>
                      {user.name}
                    </Typography>
                  }
                  secondary={`#${idx + 1}`}
                  secondaryTypographyProps={{ sx: { fontWeight: 500, color: 'inherit' } }}
                />
                {/* Points */}
                <Typography variant="h6" sx={{ ml: 'auto', fontWeight: 700, color: 'inherit' }}>
                  {user.totalPoints} pts
                </Typography>
              </ListItem>
            </motion.div>
          ))}
        </AnimatePresence>
      </List>
    </Box>
  );
}

export default Leaderboard;
