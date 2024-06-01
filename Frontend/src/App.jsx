import React, { useState, useRef } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import UserForm from './components/UserForm';
import UserTable from './components/UserTable';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const userTableRef = useRef();

  const handleShowForm = () => {
    setShowForm(!showForm);
    setSelectedUser(null);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setSelectedUser(null);
    userTableRef.current.refreshUserList(); // Call the refresh function
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <Button variant="contained" color="primary" onClick={handleShowForm}>
        {showForm ? 'Hide Form' : 'Add User'}
      </Button>
      {showForm && (
        <Box mt={3}>
          <UserForm selectedUser={selectedUser} onFormSubmit={handleFormSubmit} />
        </Box>
      )}
      <UserTable ref={userTableRef} onEditUser={handleEditUser} />
      <ToastContainer />
    </Container>
  );
}

export default App;
