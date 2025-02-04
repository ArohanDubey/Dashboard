import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
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
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import { useNavigate } from "react-router-dom";
import DashboardForm from "../DashboardForm/DashboardForm";
import ConfirmationDialog from "./ConfirmationDialog";

const Dashboard = ({
  formData, setFormData,
  rows,
  setRows,
  dashboardData,
  setDashboardData,
  ...props
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
 
  const [openDialog, setOpenDialog] = useState(false);

  const handelDialogCancel = () => {
    setOpenDialog(false);
  };
  const handleNewDashboardClick = () => {
    setOpenDialog(true);
  };

  const handleFileUpload = (data) => {
    setRows(data);
  };

  useEffect(() => {
    if (!props.defaultOpen) {
      props.setDefaultOpen(true);
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    console.log(dashboardData);
    console.log(dashboardData.html_files);
  }, [dashboardData]);
  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
            onClick={handleNewDashboardClick}
          >
            New Dashboard
          </Button>
        </Box>
      </Box>

      {open ? (
        <DashboardForm
          setOpen={setOpen}
          onFileUpload={handleFileUpload}
          setDashboardData={setDashboardData}
          setFormData={setFormData}
          formData={formData}
        />
      ) : (
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="140px"
          gap="20px"
        >
          {/* ROW 1 */}
          <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={dashboardData.summary && dashboardData.summary[0].Value.replaceAll(/[\[\]]/g, "")}
              subtitle={dashboardData.summary && dashboardData.summary[0].Key.replaceAll(/[\[\]]/g, "")}
              // icon={
              //   <EmailIcon
              //     sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              //   />
              // }
            />
          </Box>
          <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={dashboardData.summary && dashboardData.summary[1].Value.replaceAll(/[\[\]]/g, "")}
              subtitle={dashboardData.summary && dashboardData.summary[1].Key.replaceAll(/[\[\]]/g, "")}
              // icon={
              //   <PointOfSaleIcon
              //     sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              //   />
              // }
            />
          </Box>
          <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={dashboardData.summary && dashboardData.summary[2].Value.replaceAll(/[\[\]]/g, "")}
              subtitle={dashboardData.summary && dashboardData.summary[2].Key.replaceAll(/[\[\]]/g, "")}
              // icon={
              //   <PersonAddIcon
              //     sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              //   />
              // }
            />
          </Box>
          <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={dashboardData.summary && dashboardData.summary[3].Value.replaceAll(/[\[\]]/g, "")}
              subtitle={dashboardData.summary && dashboardData.summary[3].Key.replaceAll(/[\[\]]/g, "")}
              // icon={
              //   <TrafficIcon
              //     sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              //   />
              // }
            />
          </Box>

          {/* ROW 2 */}
          <Box
            gridColumn="span 4"
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
            p="10px"
          >
            {/* <Typography variant="h5" fontWeight="600">
              Campaign
            </Typography> */}
            <iframe
              srcDoc={
                dashboardData.html_files &&
                dashboardData.html_files.pie_chart
              }
            ></iframe>
            {/* <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mt="25px"
            >
              <ProgressCircle size="125" />
              <Typography
                variant="h5"
                color={colors.greenAccent[500]}
                sx={{ mt: "15px" }}
              >
                $48,352 revenue generated
              </Typography>
              <Typography>
                Includes extra misc expenditures and costs
              </Typography>
            </Box> */}
          </Box>
          <Box
            gridColumn="span 4"
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
            p="10px"
          >
            {/* <Typography variant="h5" fontWeight="600">
              Campaign
            </Typography> */}
            <iframe
              srcDoc={
                dashboardData.html_files &&
                dashboardData.html_files.bar_chart
              }
            ></iframe>
            {/* <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mt="25px"
            >
              <ProgressCircle size="125" />
              <Typography
                variant="h5"
                color={colors.greenAccent[500]}
                sx={{ mt: "15px" }}
              >
                $48,352 revenue generated
              </Typography>
              <Typography>
                Includes extra misc expenditures and costs
              </Typography>
            </Box> */}
          </Box>
          <Box
            gridColumn="span 4"
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
            p="10px"
          >
            {/* <Typography variant="h5" fontWeight="600">
              Campaign
            </Typography> */}
            <iframe
              srcDoc={
                dashboardData.html_files &&
                dashboardData.html_files.line_chart
              }
            ></iframe>
            {/* <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mt="25px"
            >
              <ProgressCircle size="125" />
              <Typography
                variant="h5"
                color={colors.greenAccent[500]}
                sx={{ mt: "15px" }}
              >
                $48,352 revenue generated
              </Typography>
              <Typography>
                Includes extra misc expenditures and costs
              </Typography>
            </Box> */}
          </Box>
          <Box
            gridColumn="span 12"
            // gridRow="span 2"
            height="max-content"
            backgroundColor={colors.primary[400]}
            display="flex"
            flexDirection="column"
          >
            <Box
              mt="25px"
              p="0"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            ></Box>
            <Box
              flex="1"
              overflow="auto"
              maxHeight="400px"
              p="0px 10px 10px 10px"
              bgcolor={colors.primary[400]}
            >
              <TableContainer
                component={Paper}
                style={{
                  width: "max-content",
                  minWidth: "100%",
                  height: "fit-content",
                  overflow: "visible",
                }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {rows[0]?.map((cell, index) => (
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
            </Box>
          </Box>

          {/* ROW 3 */}
        </Box>
      )}
      {openDialog ? (
        <ConfirmationDialog
          handleClose={handelDialogCancel}
          handleConfirm={() => {
            handelDialogCancel();
            setOpen(true);
          }}
        />
      ) : (
        " "
      )}
    </Box>
  );
};

export default Dashboard;
