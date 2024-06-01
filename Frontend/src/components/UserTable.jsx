import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper, IconButton, Box, Typography } from '@mui/material';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';

const UserTable = forwardRef(({ onEditUser }, ref) => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useImperativeHandle(ref, () => ({
    refreshUserList: () => {
      fetchUsers();
    }
  }));

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/users');
      console.log('Fetched users:', response.data);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleDelete = async (email) => {
    try {
      await axios.delete(`http://localhost:3001/users/${email}`);
      setUsers(users.filter(user => user.email !== email));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.email.includes(filter) ||
    user.name.includes(filter) ||
    user.age.toString().includes(filter)
  );

  return (
    <Box mb={4}>
      <TextField
        label="Filter by Email, Name, or Age"
        value={filter}
        onChange={handleFilterChange}
        fullWidth
        margin="normal"
      />
      <TableContainer component={Paper} elevation={3} style={{ backgroundColor: '#f0f0f0', border: '2px solid #ccc' }}>
        <Table >
          <TableHead>
            <TableRow style={{ backgroundColor: '#808080', color: '#fff' }}>
              <TableCell>
                <Typography variant="h6">User Email</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">User Name</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">User Age</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">About User</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Actions</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.email}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.age}</TableCell>
                  <TableCell>{user.about}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => onEditUser(user)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(user.email)} color="secondary">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
});

export default UserTable;
