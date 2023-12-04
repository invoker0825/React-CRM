import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ConfigProvider } from 'antd';
import Login from './pages/login';
import Layout from './components/layout';
import MeetingLayout from './components/meetingLayout';
import Dashboard from "./pages/dashboard";
import Media from "./pages/media";
import Report from "./pages/report";
import UserReport from "./pages/userReport";
import MediaReport from "./pages/mediaReport";
import PlayBackReport from './pages/playBackReport';
import User from "./pages/user";
import Player from './pages/player';
import Schedule from './pages/schedule';
import PlayList from './pages/playlist';
import LayoutPage from './pages/layout';
import Settings from './pages/settings';
import Booking from './pages/booking';
import MeetingRooms from './pages/meetingRooms';
import MeetingUsers from './pages/meetingUsers';
import MeetingSettings from './pages/meetingSettings';
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
              <Route path="/report" element={<Report />} />
              <Route path="/report/user" element={<UserReport />} />
              <Route path="/report/media" element={<MediaReport />} />
              <Route path="/report/playback" element={<PlayBackReport />} />
              <Route path="/user" element={<User />} />
              <Route path="/player" element={<Player />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/playlist" element={<PlayList />} />
              <Route path="/layout" element={<LayoutPage />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="/meeting" element={<MeetingLayout />}>
              <Route path='/meeting/booking' element={<Booking />} />
              <Route path='/meeting/rooms' element={<MeetingRooms />} />
              <Route path='/meeting/users' element={<MeetingUsers />} />
                  <Route path='/meeting/settings' element={<MeetingSettings />} />
            </Route>
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
     </ConfigProvider>
    </div>
  );
}

export default App;
