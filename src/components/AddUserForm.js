import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

function AddUserForm({ onAddUser }) {
  const [name, setName] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddUser(name.trim());
    setName('');
  };
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <TextField
        label="Enter user name"
        variant="outlined"
        size="small"
        value={name}
        onChange={e => setName(e.target.value)}
        sx={{ flex: 1 }}
      />
      <Button type="submit" variant="contained" color="primary" sx={{ boxShadow: 3, fontWeight: 700 }}>
        Add User
      </Button>
    </Box>
  );
}

export default AddUserForm;
