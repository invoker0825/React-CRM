import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ConfigProvider } from 'antd';
import Login from './pages/login';
import Layout from './components/layout';
import Dashboard from "./pages/dashboard";
import Media from "./pages/media";
import './App.scss';

function App() {
  return (
    <div className="app">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#5C59E8',
          },
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/media" element={<Media />} />
            </Route>
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
     </ConfigProvider>
    </div>
  );
}

export default App;
