import React, { useState, useRef } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import "./DashboardForm.css";
import { useTheme, Button } from "@mui/material";
import { tokens } from "../../theme";
import * as XLSX from "xlsx";
import axios from "axios";


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

  const dummyData={
    "summary": [
      {
        "Key": "Sales",
        "Value": "$1,000,000",
        
      },
      {
        "Key": "Revenue",
        "Value": "$500,000",
        
      },
      {
        "Key": "Profit",
        "Value": "$200,000",
        
      },
      {
        "Key": "Customer Satisfaction",
        "Value": "90%",
        
      }
    ],
    "html_files": {
      "pie_chart.html": "<html>\n<head>\n<title>Pie Chart</title>\n<script src=\"https://cdn.jsdelivr.net/npm/chart.js\"></script>\n</head>\n<body>\n<canvas id=\"pieChart\"></canvas>\n<script>\nvar ctx = document.getElementById('pieChart').getContext('2d');\nvar pieChart = new Chart(ctx, {\ntype: 'pie',\ndata: {\nlabels: ['Sales', 'Revenue', 'Profit', 'Customer Satisfaction'],\ndatasets: [{\ndata: [1000000, 500000, 200000, 90],\nbackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733']\n}]\n},\noptions: {\nresponsive: true\n}\n});\n</script>\n</body>\n</html>",
      "bar_chart.html": "<html>\n<head>\n<title>Bar Chart</title>\n<script src=\"https://cdn.jsdelivr.net/npm/chart.js\"></script>\n</head>\n<body>\n<canvas id=\"barChart\"></canvas>\n<script>\nvar ctx = document.getElementById('barChart').getContext('2d');\nvar barChart = new Chart(ctx, {\ntype: 'bar',\ndata: {\nlabels: ['Sales', 'Revenue', 'Profit', 'Customer Satisfaction'],\ndatasets: [{\nlabel: 'Metrics',\ndata: [1000000, 500000, 200000, 90],\nbackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733']\n}]\n},\noptions: {\nresponsive: true\n}\n});\n</script>\n</body>\n</html>",
      "line_chart.html": "<html>\n<head>\n<title>Line Chart</title>\n<script src=\"https://cdn.jsdelivr.net/npm/chart.js\"></script>\n</head>\n<body>\n<canvas id=\"lineChart\"></canvas>\n<script>\nvar ctx = document.getElementById('lineChart').getContext('2d');\nvar lineChart = new Chart(ctx, {\ntype: 'line',\ndata: {\nlabels: ['Q1', 'Q2', 'Q3', 'Q4'],\ndatasets: [{\nlabel: 'Sales',\ndata: [250000, 300000, 200000, 250000],\nborderColor: '#FF6384',\nfill: false\n}, {\nlabel: 'Revenue',\ndata: [120000, 150000, 100000, 130000],\nborderColor: '#36A2EB',\nfill: false\n}, {\nlabel: 'Profit',\ndata: [50000, 60000, 40000, 50000],\nborderColor: '#FFCE56',\nfill: false\n}, {\nlabel: 'Customer Satisfaction',\ndata: [85, 88, 86, 90],\nborderColor: '#FF5733',\nfill: false\n}]\n},\noptions: {\nresponsive: true\n}\n});\n</script>\n</body>\n</html>"
    }
  }
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

    axios.get('http://127.0.0.1:5000/dashboard').then((response) => {
      console.log("Response Data",response.data)
      props.setDashboardData(dummyData)
      console.log('success')
    }).catch();
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
