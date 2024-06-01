import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Grid } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserForm = ({ selectedUser, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    age: '',
    about: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedUser) {
      setFormData(selectedUser);
    }
  }, [selectedUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const errors = {};

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    // Name validation
    if (!formData.name) {
      errors.name = 'Name is required';
    }

    // Age validation
    if (!formData.age) {
      errors.age = 'Age is required';
    } else if (isNaN(formData.age) || formData.age < 0) {
      errors.age = 'Invalid age';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (selectedUser) {
        await axios.put(`http://localhost:3001/users/${selectedUser.email}`, formData);
        toast.success('User updated successfully');
      } else {
        await axios.post('http://localhost:3001/users', formData);
        toast.success('User added successfully');
      }
      setFormData({ email: '', name: '', age: '', about: '' });
      onFormSubmit();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            error={!!errors.email}
            helperText={errors.email}
            disabled={!!selectedUser}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            error={!!errors.name}
            helperText={errors.name}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="age"
            label="Age"
            value={formData.age}
            onChange={handleChange}
            type="number"
            fullWidth
            margin="normal"
            required
            error={!!errors.age}
            helperText={errors.age}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="about"
            label="About"
            value={formData.about}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            {selectedUser ? 'Update User' : 'Add User'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserForm;
