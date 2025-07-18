import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

/**
 * UserSelect component
 * @param users - array of user objects
 * @param selectedUserId - currently selected user id
 * @param setSelectedUserId - function to update selected user
 */
function UserSelect({ users, selectedUserId, setSelectedUserId }) {
  return (
    <FormControl fullWidth size="small" sx={{ minWidth: 180 }}>
      {/* Dropdown label */}
      <InputLabel id="user-select-label">Select a user</InputLabel>
      {/* Dropdown select */}
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
