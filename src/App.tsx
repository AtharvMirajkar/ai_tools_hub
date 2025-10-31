import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Tools from './pages/Tools';
import Admin from './pages/Admin';
import AdminDashboard from './pages/AdminDashboard';
import ScrollToTop from './components/ScrollToTop';
import AdminLayout from './layouts/AdminLayout';
import ToolPage from './pages/ToolPage';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/tool/:id" element={<ToolPage />} />
        <Route path="/admin" element={<Admin />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
