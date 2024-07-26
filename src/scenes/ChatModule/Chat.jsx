import React, { useState, useRef } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  Box,
  TextField,
  Typography,
  Skeleton,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { tokens } from "../../theme";
import { MdCancel } from "react-icons/md";
import { BsArrowsFullscreen } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import * as XLSX from "xlsx";
import axios from "axios";
import Markdown from 'markdown-to-jsx'
import "./Chat.css"
import { PushSpinner,CubeSpinner,RotateSpinner } from "react-spinners-kit";

const FileUpload = ({htmlContent,setHtmlContent,isResponse,setIsResponse,...props}) => {
  const [search, setSearch] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [srcdoc, setSrcdoc] = useState();
  const fileInputRef = useRef(null);
  const [fullScreen, setFullScreen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [isHtml, setIsHtml] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleRemoveFile = () => {
    setSearch("");
    setFileName("");
    setHtmlContent("");
    setRows([]); // Reset rows when the file is removed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearch(value);
  };

  const handlePrompt = () => {
    setLoading(true);
    setSrcdoc("");
    setSearch("");
    axios
      .get(
        `http://127.0.0.1:5000/analyze?input=${encodeURIComponent(
          search.toLowerCase().replaceAll("&", " and ") +
            ".* Graph height should be " +
            window.innerHeight +
            "px and width " +
            window.innerWidth +
            "px."
        )}`
      )
      .then((response) => {
        setIsHtml(!response.data?.text_response);
        setHtmlContent(response.data?.text_response || response.data);
        !response.data?.text_response &&
          setTimeout(() => {
            const dev = response.data.split("");
            dev.splice(
              response.data.indexOf("<div>") + 4,
              0,
              ' style="display:flex; justify-content:center; align-items:center;"'
            );

            setSrcdoc(dev.join(""));
          });
        setLoading(false);
        setIsResponse(true);
      })
      .catch((error) => {
        console.error("Error fetching HTML file:", error);
        setLoading(false);
        alertError();
      });
  };
  const alertError = () => {
    toast.error("Graph cannot be Generated please try again", {
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
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handlePrompt();
    }
  };
  const handleViewButtonClick = () => {
    setShowTable(!showTable); // Toggle the visibility of the table
  };
  const toggleFullScreen = () => {
    setFullScreen(!fullScreen);
  };
  return (
    <div className={"padding " + theme.palette.mode}>
      {/* <Button
        variant="contained"
        component="label"
        startIcon={<CloudUploadIcon />}
        sx={{ marginBottom: 2 }}
      >
        <input
          type="file"
          accept=".csv, .xlsx, .xls"
          onChange={handleFileUpload}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
      </Button> */}
      {fileName && (
        <>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleViewButtonClick}
            sx={{ marginBottom: 2 }}
          >
            {showTable ? "Hide Table" : "View Table"}
          </Button>
        </>
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

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          position: "fixed",
          bottom: 0,
          width: "100%",
          padding: "10px",
          backgroundColor: "#141b2d",
        }}
      >
        <TextField
          type="text"
          variant="outlined"
          placeholder="Prompt..."
          value={search}
          onChange={handleSearch}
          onKeyPress={handleKeyPress}
          fullWidth
          sx={{
            marginBottom: 2,
            width: "70%",
            height: "100%",
            paddingTop: "5px",
            paddingBottom: "5px",
            borderRadius: "50%",
          }}
        />
        <Button
          onClick={handlePrompt}
          className="primaryButton"
          size="small"
          sx={{
            height: "100%",
            marginLeft: "8px",
            padding: "9px 0px",
          }}
        >
          <IoSend sx={{ color: "white" }} />
        </Button>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
        {srcdoc && !loading && !fullScreen ? (
          <Button
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
          </Button>
        ) : (
          ""
        )}
      </Box>

      {loading ? (
        // <Skeleton
        //   animation="wave"
        //   variant="rectangular"
        //   width="100%"
        //   height={400}
        // />
        <CubeSpinner/>
      ) : fullScreen ? (
        <div
          onDoubleClick={setFullScreen.bind(this, false)}
          style={{
            zIndex: 2000,
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            onClick={setFullScreen.bind(this, false)}
            style={{
              cursor: "pointer",
              position: "fixed",
              top: "50px",
              right: "50px",
              width: "20px",
              height: "20px",
            }}
          >
            <MdCancel className="cancelButton" />
          </div>
          <iframe
            srcdoc={srcdoc}
            id="htmlRender"
            style={{
              width: window.innerWidth,
              height: window.innerHeight,
              border: "none",
            }}
          ></iframe>
        </div>
      ) : isHtml ? (
        <iframe
          srcdoc={srcdoc}
          id="htmlRender"
          style={{ width: "100%", height: "400px", border: "none" }}
        ></iframe>
      ) : ( isResponse &&
        <Typography variant="body1" className="textresponse"><Markdown >{htmlContent}</Markdown></Typography>
      )}

      {showTable && rows.length > 0 && (
        <div
          onClick={handleViewButtonClick}
          style={{
            zIndex: 2000,
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "#0000009f",
            display: "flex",
            "justify-content": "center",
            "align-items": "center",
          }}
        >
          {/* <div
          onClick={handleViewButtonClick}
          className="cancelButton"
        >
          <MdCancel  />
        </div> */}
          <span
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "block",
              width: "80%",
              maxHeight: "400px", // Fixed height
              overflow: "auto", // Enable scrolling
            }}
          >
            <TableContainer
              component={Paper}
              style={{
                width: "max-content",
                height: "100%",
                overflow: "visible",
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {rows[0].map((cell, index) => (
                      <TableCell key={index}>{cell}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.slice(1).map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </span>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default FileUpload;
