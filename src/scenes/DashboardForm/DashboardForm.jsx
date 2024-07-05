import React, { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import './DashboardForm.css';

const DashboardForm = (props) => {
  const [formData, setFormData] = useState({
    name: '',
    dashboardName: '',
    file: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate an async operation such as an API call
    setTimeout(() => {
      console.log(formData);
      setLoading(false);
      props.setOpen(false)
      // Handle form submission logic here
    }, 2000); // Simulate a 2-second delay
  };

  return (
    <div className="dashboard_form_container">
      <div className="login-form">
        <h1>Welcome to DataInsight!</h1>
        <h3>Your AI-powered solution for CSV data analysis, summaries, charts and more.</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          /><br />
          <input
            type="text"
            name="dashboardName"
            placeholder="Dashboard Name"
            value={formData.dashboardName}
            onChange={handleChange}
            required
          /><br />
          <input
            type="file"
            name="file"
            className='input-button'
            accept=".xls,.xlsx"
            onChange={handleChange}
            required
          /><br />
          
          <button type="submit" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Dashboard'}
          </button>
            {loading? <p>Analyzing the data. Please wait... </p> : ""}

        </form>
      </div>
    </div>
  );
};

export default DashboardForm;
