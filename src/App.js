import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Chat from "./scenes/ChatModule/Chat.jsx"
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import DashboardForm from "./scenes/DashboardForm/DashboardForm.jsx";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [defaultOpen, setDefaultOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState([]);
  const [rows, setRows] = useState([]);
  const [htmlContent, setHtmlContent] = useState("");
  const [isResponse,setIsResponse]=useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dashboardName: "",
    file: null,
  });
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} formData={formData}/>
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Dashboard formData={formData} setFormData={setFormData} rows={rows} setRows={setRows} defaultOpen={defaultOpen} setDefaultOpen={setDefaultOpen} dashboardData={dashboardData} setDashboardData={setDashboardData}/>} />
              <Route path="/team" element={<Team />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/form" element={<Form />} />
              <Route path="/chat" element={<Chat htmlContent={htmlContent} setHtmlContent={setHtmlContent} isResponse={isResponse} setIsResponse={setIsResponse}/>} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
