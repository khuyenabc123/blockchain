import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { StudentPortal } from "./pages/StudentPortal";
import AdminDashboard from "./pages/AdminDashboard";
import VerifierSearch from "./pages/VerifierSearch";
import LayoutComponent from "./components/Layout";
import "./index.css";
import UserGuide from "./pages/GuideToUse";

function App() {
  return (
    <Router>
      <LayoutComponent>
        <Routes>
          <Route path="/guide" element={<UserGuide />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/certificate-search" element={<VerifierSearch />} />
          <Route path="/portal" element={<StudentPortal />} />
          <Route path="*" element={<UserGuide />} />
        </Routes>
      </LayoutComponent>
    </Router>
  );
}

export default App;
