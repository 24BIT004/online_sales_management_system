import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/CustomerDashboard";

function App() {
  return (
  
      <Routes>
        {/* Default route: redirect to login */}
      

        {/* Auth routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      <Route path="/Dashboard" element={<CustomerDashboard />} />

        {/* Catch-all: redirect to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    
  );
}

export default App;
