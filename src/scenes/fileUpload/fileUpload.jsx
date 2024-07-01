import React, { useState, useRef } from "react";
import {
  Button,
  Box,
  TextField,
  Typography,
  Skeleton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import axios from "axios";

const FileUpload = () => {
  const [search, setSearch] = useState("");
  const [fileName, setFileName] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFileName(file.name);

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

  const handleRemoveFile = () => {
    setSearch("");
    setFileName("");
    setHtmlContent("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearch(value);
  };

  const handlePrompt = () => {
    setLoading(true);
    const filename = "enhanced_interactive_graph.html";
    axios
      .get(`http://127.0.0.1:5000/analyze?input=${search}`)
      .then((response) => {
        setHtmlContent(response.data);
        const iframe = document.getElementById("htmlRender");
        iframe.srcdoc = response.data;
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching HTML file:", error);
        alert("Hello! Internal Server Error");
        setLoading(false);
      });
  };

  return (
    <div className="padding">
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
          style={{ display: "none" }}
        />
      </Button>

      {fileName && (
        <div style={{ marginBottom: "1rem" }} className="flex-align-center">
          <Typography variant="body1" className="uploadFile">{fileName}</Typography>
          <Button variant="outlined" color="error" onClick={handleRemoveFile} sx={{marginLeft: "8px"}}>
            Remove File
          </Button>
        </div>
      )}

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <TextField
          type="text"
          variant="outlined"
          placeholder="Prompt..."
          value={search}
          onChange={handleSearch}
          fullWidth
          sx={{
            marginBottom: 2,
            width: "70%",
            height: "100%",
            paddingTop: "5px",
            paddingBottom: "5px",
          }}
        />
        <Button
          variant="outlined"
          color="secondary"
          onClick={handlePrompt}
          size="medium"
          sx={{ height: "100%", marginLeft: "8px" ,padding: "5px 28px"}}
        >
          Submit
        </Button>
      </Box>

      {loading ? (
        <Skeleton animation="wave" variant="rectangular" width="100%" height={400} />
      ) : (
        <iframe id="htmlRender" style={{ width: "100%", height: "400px", border: "none" }}></iframe>
      )}
    </div>
  );
};

export default FileUpload;
