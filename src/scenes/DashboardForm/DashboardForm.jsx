import React, { useState, useRef } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import "./DashboardForm.css";
import { useTheme, Button } from "@mui/material";
import { tokens } from "../../theme";
import * as XLSX from "xlsx";



const DashboardForm = (props) => {
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const fileInputRef = useRef(null);
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dashboardName: "",
    file: null,
  });

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
    setTimeout(() => {
      console.log(formData);
      setLoading(false);
      props.setOpen(false);
    }, 2000);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      setRows(jsonData);
      setShowTable(false);
      props.onFileUpload(jsonData);
    };

    reader.readAsArrayBuffer(file);
    const formData = new FormData();
    formData.append("file", file);

    fetch("http://127.0.0.1:5000/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("File uploaded successfully", data);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  };

  return (
    <div className="dashboard_form_container">
      <div className="login-form">
        <h1>Welcome to DataInsight!</h1>
        <h3>
          Your AI-powered solution for CSV data analysis, summaries, charts and
          more.
        </h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <br />
          <input
            type="text"
            name="dashboardName"
            placeholder="Dashboard Name"
            value={formData.dashboardName}
            onChange={handleChange}
            required
          />
          <br />
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
            sx={{ marginBottom: 2 }}
          >
            Upload Excel
            <input
              type="file"
              accept=".csv, .xlsx, .xls"
              onChange={handleFileUpload}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
          </Button>
          {fileName && <p>File Selected: {fileName}</p>}
          <br />
          <button type="submit" disabled={loading}>
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Create Dashboard"
            )}
          </button>
          {loading && <p>Analyzing the data. Please wait...</p>}
        </form>
      </div>
    </div>
  );
};

export default DashboardForm;
