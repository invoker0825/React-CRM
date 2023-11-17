import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ConfigProvider } from 'antd';
import Login from './pages/login'
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
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
     </ConfigProvider>
    </div>
  );
}

export default App;
