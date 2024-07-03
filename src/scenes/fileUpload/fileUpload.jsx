import React, { useState, useRef } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Box, TextField, Typography, Skeleton, Modal, useTheme } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { tokens } from "../../theme";
import { MdCancel } from "react-icons/md";
import { BsArrowsFullscreen } from "react-icons/bs";
import { ExcelRenderer, OutTable } from "react-excel-renderer";
import axios from "axios";


const FileUpload = () => {
  const [search, setSearch] = useState("");
  const [fileName, setFileName] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [srcdoc, setSrcdoc] = useState();
  const fileInputRef = useRef(null);
  const [fullScreen, setFullScreen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
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
      .get(`http://127.0.0.1:5000/analyze?input=${search+ '. Graph height should be '+window.innerHeight+'px and width '+window.innerWidth+'px.'}`)
      .then((response) => {
        setHtmlContent(response.data);
        setTimeout(() => {
          setSrcdoc(response.data)
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching HTML file:", error);
        setLoading(false);
        alertError();
      });
  };
  const alertError = () => {
    toast.error("Graph cannot be Generated please try again",{
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme.palette?.mode,
      transition: Bounce,
      });
  };

  const handleShowPreview = () => {
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

  const toggleFullScreen = () => {
    setFullScreen(!fullScreen);
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
        <Button
          variant="outlined"
          color="primary"
          onClick={handleShowPreview}
          sx={{ marginBottom: 2 }}
        >
          Show Preview
        </Button>
      )}
      {fileName && (
        <div style={{ marginBottom: "1rem" }} className="flex-align-center">
          <Typography variant="body1" className="uploadFile">
            {fileName}
          </Typography>
          <Button
            variant="outlined"
            color="error"
            onClick={handleRemoveFile}
            sx={{ marginLeft: "8px" }}
          >
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
          sx={{ height: "100%", marginLeft: "8px", padding: "5px 28px" }}
        >
          Submit
        </Button>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
        {srcdoc && !loading && !fullScreen? <Button
          variant="outlined"
          color="primary"
          onClick={toggleFullScreen}
          size="medium"
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
        >
         <BsArrowsFullscreen />
        </Button> : ""}
      </Box>

      {loading ? (
        <Skeleton
          animation="wave"
          variant="rectangular"
          width="100%"
          height={400}
        />
      ) : (
        fullScreen ? ( <div style={{ zIndex:2000,position:"fixed", top:0,left:0, width: "100vw", height: "100vh", }}>
          <div onClick={setFullScreen.bind(this,false)} style={{ cursor:'pointer', position:"fixed", top:"50px",right:"50px", width: "20px", height: "20px", }}><MdCancel className="cancelButton"/></div>
          <iframe srcdoc={srcdoc}
          id="htmlRender"
          style={{ width: "100%", height: "100%", border: "none" }}
        ></iframe>
        </div>
        ):(<iframe srcdoc={srcdoc}
          id="htmlRender"
          style={{ width: "100%", height: "400px", border: "none" }}
        ></iframe>)
      )}
        <ToastContainer  />  
         
      
    </div>
  );
};

export default FileUpload;
