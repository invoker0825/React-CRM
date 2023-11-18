import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ConfigProvider } from 'antd';
import Login from './pages/login'
import Dashboard from './pages/dashboard'
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
          <Route>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
     </ConfigProvider>
    </div>
  );
}

export default App;
