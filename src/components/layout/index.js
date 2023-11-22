import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Button, Radio } from 'antd';
import Dashboard from '../../pages/dashboard';
import Media from '../../pages/media';
import Report from '../../pages/report';
import User from '../../pages/user';
import Player from '../../pages/player';
import Schedule from '../../pages/schedule';
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
        console.log('radio4 checked', value);
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
                    <a href='/' className='logo-title'>Digital signage</a>
                    <Radio.Group
                        options={options}
                        onChange={onChangeNav}
                        value={navValue}
                        optionType="button"
                        className='nav-radio'
                    />
                </div>
                <Button type='primary' onClick={logOut}>Logout</Button>
            </div>
            <div className='routing-section'>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/media" element={<Media />} />
                    <Route path="/report" element={<Report />} />
                    <Route path="/user" element={<User />} />
                    <Route path="/player" element={<Player />} />
                    <Route path="/schedule" element={<Schedule />} />
                </Routes>
            </div>
        </div> 
    );
}
  
export default Layout;
