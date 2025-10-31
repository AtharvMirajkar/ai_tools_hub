import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Tools from './pages/Tools';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import ScrollToTop from './components/ScrollToTop';
import AdminLayout from './layouts/AdminLayout';
import ToolPage from './pages/ToolPage';
import Header from './components/Header';
import Favorites from './pages/Favorites';
import Blog from './pages/Blog';
import NewPost from './pages/NewPost';
import PostPage from './pages/PostPage';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/tool/:id" element={<ToolPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/new" element={<NewPost />} />
        <Route path="/blog/:id" element={<PostPage />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
