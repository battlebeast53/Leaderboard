// App.js - Main entry point for the Leaderboard frontend
import React, { useState, useEffect } from 'react';
import UserSelect from './components/UserSelect';
import AddUserForm from './components/AddUserForm';
import ClaimButton from './components/ClaimButton';
import Leaderboard from './components/Leaderboard.js';
import ClaimHistory from './components/ClaimHistory';
import TopRankers from './components/TopRankers';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import './App.css';

// Load Poppins font from Google Fonts
const poppins = document.createElement('link');
poppins.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
poppins.rel = 'stylesheet';
document.head.appendChild(poppins);

// Custom MUI theme for dark mode and modern look
const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#181A20',
      paper: '#23263A',
    },
    primary: { main: '#6C63FF' },
    secondary: { main: '#00C9A7' },
    text: { primary: '#F3F6F9', secondary: '#B0B3C6' },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: 'Poppins, Arial, sans-serif',
    h1: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
  },
});

function App() {
  // State for users, selected user, awarded points, claim history, and last claimed user for highlight
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [showPoints, setShowPoints] = useState(null);
  const [history, setHistory] = useState([]);
  const [lastClaimedUser, setLastClaimedUser] = useState(null);

  // Get API base URL from environment variable
  const API_URL = process.env.REACT_APP_API_URL;

  // Fetch users from backend API
  const fetchUsers = async () => {
    const res = await fetch(`${API_URL}/users`);
    const data = await res.json();
    setUsers(data);
  };

  // Fetch claim history from backend API
  const fetchHistory = async () => {
    const res = await fetch(`${API_URL}/claims`);
    const data = await res.json();
    setHistory(data);
  };

  // Initial data fetch on mount
  useEffect(() => {
    fetchUsers();
    fetchHistory();
  }, []);

  // Add a new user
  const handleAddUser = async (name) => {
    await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    fetchUsers();
  };

  // Claim points for the selected user
  const handleClaim = async () => {
    const res = await fetch(`${API_URL}/claims`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: selectedUserId }),
    });
    const data = await res.json();
    setShowPoints(data.points);
    setLastClaimedUser({ id: selectedUserId, ts: Date.now() }); // highlight after claim
    fetchUsers();
    fetchHistory();
  };

  // Main layout: header, control panel, leaderboard, and recent claims
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #181A20 0%, #23263A 100%)', py: 4 }}>
        <Container maxWidth="md">
          {/* App header */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Box sx={{
              background: 'linear-gradient(90deg, #23263A 0%, #6C63FF 100%)',
              px: 5, py: 2, borderRadius: 99, boxShadow: 3, display: 'flex', alignItems: 'center',
              mb: 1
            }}>
              <span style={{ fontSize: 28, marginRight: 12 }}>🏆</span>
              <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, letterSpacing: 1, fontFamily: 'Poppins, Arial, sans-serif' }}>
                Leaderboard Champions
              </Typography>
            </Box>
            <Typography variant="subtitle1" sx={{ color: '#6C63FF', fontWeight: 500, fontFamily: 'Poppins, Arial, sans-serif' }}>
              Track achievements and celebrate winners
            </Typography>
          </Box>
          {/* Control Panel */}
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: '#F3F6F9' }}>
              <span role="img" aria-label="control">👤</span> Control Panel
            </Typography>
            <AddUserForm onAddUser={handleAddUser} />
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <UserSelect users={users} selectedUserId={selectedUserId} setSelectedUserId={setSelectedUserId} />
              <ClaimButton
                onClaim={handleClaim}
                disabled={!selectedUserId}
                awardedPoints={showPoints}
                setShowPoints={setShowPoints}
              />
            </Box>
          </Paper>

          {/* Top 3 Rankers with bouncing animation */}
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <TopRankers users={users} />
          </Paper>

          {/* Main content: Leaderboard and Recent Claims side by side */}
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {/* Leaderboard card */}
            <Paper elevation={3} sx={{ flex: 1, minWidth: 320, p: 3, minHeight: 480, display: 'flex', flexDirection: 'column' }}>
              <Leaderboard users={users} claimedUser={lastClaimedUser} />
            </Paper>
            {/* Recent Claims card */}
            <Paper elevation={3} sx={{ flex: 1, minWidth: 320, p: 3, minHeight: 480, display: 'flex', flexDirection: 'column' }}>
              <ClaimHistory history={history} />
            </Paper>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
