import React from 'react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import StarOutlineIcon from '@mui/icons-material/StarOutline';

// Helper to get initials from a name string
function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

/**
 * ClaimHistory component
 * @param history - array of claim objects
 */
function ClaimHistory({ history }) {
  // Sort history descending by timestamp (most recent first)
  const sortedHistory = [...history].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  return (
    <div>
      {/* Recent Claims header */}
      <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: '#F3F6F9' }}>
        <StarOutlineIcon color="primary" sx={{ mr: 1 }} /> Recent Claims
      </Typography>
      {/* Scrollable list of recent claims */}
      <List
        disablePadding
        sx={{
          overflowY: 'auto',
          maxHeight: 800,
          minHeight: 0,
          pr: 1,
        }}
      >
        {sortedHistory.map((item, idx) => (
          <ListItem key={idx} sx={{
            mb: 1,
            borderRadius: 1.5,
            background: '#2D3146',
            boxShadow: 1,
            px: 2,
            py: 1,
            minHeight: 48,
            color: '#F3F6F9',
            transition: 'background 0.3s, color 0.3s',
            '&:hover': {
              background: '#fff',
              color: '#23263A',
              boxShadow: 6,
              '& .MuiTypography-root': { color: '#23263A' },
              '& .MuiChip-root': { color: '#00C9A7', background: '#e0f7f4' },
            },
          }}>
            {/* Avatar with user initials */}
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: '#6C63FF', color: '#fff', fontWeight: 700 }}>
                {getInitials(item.userId?.name || 'D')}
              </Avatar>
            </ListItemAvatar>
            {/* User name and timestamp */}
            <ListItemText
              primary={item.userId?.name || 'Deleted user'}
              secondary={new Date(item.timestamp).toLocaleString()}
              primaryTypographyProps={{ sx: { fontWeight: 600, color: 'inherit' } }}
              secondaryTypographyProps={{ sx: { fontSize: 13, color: 'inherit' } }}
            />
            {/* Points claimed */}
            <Chip
              label={`+${item.points} pts`}
              color="secondary"
              sx={{ fontWeight: 700, fontSize: 15, bgcolor: '#181A20', color: '#00C9A7', ml: 2, transition: 'background 0.3s, color 0.3s' }}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default ClaimHistory;
