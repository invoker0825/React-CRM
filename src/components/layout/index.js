import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Button, Radio } from 'antd';
import Dashboard from '../../pages/dashboard';
import Media from '../../pages/media';
import Report from '../../pages/report';
import UserReport from '../../pages/userReport';
import MediaReport from '../../pages/mediaReport';
import PlayBackReport from '../../pages/playBackReport';
import User from '../../pages/user';
import Player from '../../pages/player';
import Schedule from '../../pages/schedule';
import PlayList from '../../pages/playlist';
import LayoutPage from '../../pages/layout';
import Settings from '../../pages/settings';
import './layout.scss';

const options = [
    {
      label: 'Dashboard',
      value: 'dashboard',
    },
    {
      label: 'Media',
      value: 'media',
    },
    {
      label: 'Layout',
      value: 'layout',
    },
    {
      label: 'Playlist',
      value: 'playlist',
    },
    {
      label: 'Schedule',
      value: 'schedule',
    },
    {
      label: 'Player',
      value: 'player',
    },
    {
      label: 'Report',
      value: 'report',
    },
    {
      label: 'Settings',
      value: 'settings',
    },
];

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [navValue, setNavValue] = useState('dashboard');

    useEffect(() => {
        setNavValue(location.pathname.split('/')[1]);
        const logged = localStorage.getItem('logged');
        if (!logged || logged === 'false') navigate('/login');
    }, [location, navigate]);
    
    const onChangeNav = ({ target: { value } }) => {
        setNavValue(value);
        navigate(`/${value}`);
    };

    const logOut = () => {
        localStorage.setItem('logged', false);
        navigate('/login');
    }

    return (
        <div className="layout-page">
            <div className='d-flex align-center j-c-space-between nav-bar'>
                <div className='d-flex align-center'>
                    <a href='/' className='logo-title'>EUMEDIA DMS</a>
                    <Radio.Group
                        options={options}
                        onChange={onChangeNav}
                        value={navValue}
                        optionType="button"
                        className='nav-radio'
                    />
                </div>
                <div className='d-flex align-center'>
                  <Button type='primary' className='control-btn' onClick={() => navigate('/control/live')}>Control Room (CRS)</Button>
                  <Button type='primary' className='meeting-btn' onClick={() => navigate('/meeting')}>Meeting Room (MRS)</Button>
                  <Button type='primary' onClick={logOut}>Logout</Button>
                </div>
            </div>
            <div className='routing-section'>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
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
                </Routes>
            </div>
        </div> 
    );
}
  
export default Layout;
