import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Tools from './pages/Tools';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tools" element={<Tools />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
