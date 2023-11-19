import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import {useNavigate} from 'react-router-dom';
import { Button, Radio } from 'antd';
import Dashboard from '../../pages/dashboard';
import Media from '../../pages/media';
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
            <div className='d-flex align-center j-c-space-between mb-30'>
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
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/media" element={<Media />} />
            </Routes>
        </div> 
    );
}
  
export default Layout;
