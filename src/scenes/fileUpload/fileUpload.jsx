// FileUpload.jsx
import React, { useState, useRef } from "react";
import { Button, Table, TableHead, TableBody,Box, TableRow, TableCell, TextField, Typography, useTheme } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import axios from "axios";
const FileUpload = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);
  const theme = useTheme();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFileName(file.name);
  
    // Create a new FormData object
    const formData = new FormData();
    formData.append('file', file);
  
    // Send the file to the server
    fetch('http://127.0.0.1:5000/upload', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        // Handle the response data
        console.log('File uploaded successfully', data);
      })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
  
    const reader = new FileReader();
  
    reader.onload = (e) => {
      const binaryStr = e.target.result;
      if (file.type.includes("spreadsheetml") || file.type.includes("excel")) {
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(worksheet);
        setData(json);
        setFilteredData(json);
      } else if (file.type === "text/csv") {
        Papa.parse(file, {
          header: true,
          complete: (results) => {
            setData(results.data);
            setFilteredData(results.data);
          },
        });
      }
    };
  
    if (file.type.includes("spreadsheetml") || file.type.includes("excel")) {
      reader.readAsBinaryString(file);
    } else if (file.type === "text/csv") {
      reader.readAsText(file);
    }
  };
  

  const handleRemoveFile = () => {
    setData([]);
    setFilteredData([]);
    setSearch("");
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearch(value);
    const filtered = data.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };
  const handlePrompt= (event) => {
    
  }
  return (
    <div className="padding" >
      <Button
        variant="contained"
        component="label"
        startIcon={<CloudUploadIcon />}
        sx={{ marginBottom: 2 }}
      >
        Upload File
        <input
          type="file"
          accept=".csv, .xlsx, .xls"
          onChange={handleFileUpload}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
      </Button>

      {fileName && (
        <div style={{ marginBottom: '1rem' }}>
          <Typography variant="body1">{fileName}</Typography>
          <Button variant="outlined" color="error" onClick={handleRemoveFile}>Remove File</Button>
        </div>
      )}

<Box sx={{ display: 'flex', alignItems: 'center' }}>
    <TextField
        type="text"
        variant="outlined"
        placeholder="Prompt..."
        value={search}
        onChange={handleSearch}
        fullWidth
        sx={{ marginBottom: 2, width: '70%' ,height:"100%",paddingTop:"5px",paddingBottom:"5px"}} 
    />
    <Button
        variant="outlined"
        color="secondary"
        onClick={handlePrompt}
        size="medium"
        sx={{ height: '100%', marginLeft: '8px' }} 
    >
        Submit
    </Button>
</Box>


      <div style={{ maxHeight: "400px", overflowY: "scroll", marginBottom: '1rem' }}>
        <Table>
          <TableHead>
            <TableRow>
              {data.length > 0 &&
                Object.keys(data[0]).map((key, index) => (
                  <TableCell key={index}>{key}</TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {Object.values(row).map((value, colIndex) => (
                  <TableCell key={colIndex}>{value}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FileUpload;
