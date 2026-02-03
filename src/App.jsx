import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ContactProvider } from './context/ContactContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/common/Toast';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Scan from './pages/Scan';
import Archive from './pages/Archive';
import Contact from './pages/Contact';

function App() {
  return (
    <ThemeProvider>
      <ContactProvider>
        <ToastProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="scan" element={<Scan />} />
                <Route path="archive" element={<Archive />} />
                <Route path="contact/:id" element={<Contact />} />
              </Route>
            </Routes>
          </Router>
        </ToastProvider>
      </ContactProvider>
    </ThemeProvider>
  );
}

export default App;
