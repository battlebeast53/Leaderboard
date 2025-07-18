import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

function UserSelect({ users, selectedUserId, setSelectedUserId }) {
  return (
    <FormControl fullWidth size="small" sx={{ minWidth: 180 }}>
      <InputLabel id="user-select-label">Select a user</InputLabel>
      <Select
        labelId="user-select-label"
        value={selectedUserId}
        label="Select a user"
        onChange={e => setSelectedUserId(e.target.value)}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {users.map(user => (
          <MenuItem value={user._id} key={user._id}>{user.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default UserSelect;
