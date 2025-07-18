import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

/**
 * AddUserForm component
 * @param onAddUser - callback to add a new user
 */
function AddUserForm({ onAddUser }) {
  // State for the input field
  const [name, setName] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddUser(name.trim());
    setName('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, mb: 2 }}>
      {/* Input for new user name */}
      <TextField
        label="Enter user name"
        variant="outlined"
        size="small"
        value={name}
        onChange={e => setName(e.target.value)}
        sx={{ flex: 1 }}
      />
      {/* Add User button */}
      <Button type="submit" variant="contained" color="primary" sx={{ boxShadow: 3, fontWeight: 700 }}>
        Add User
      </Button>
    </Box>
  );
}

export default AddUserForm;
