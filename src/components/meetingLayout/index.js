import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Button, Radio } from 'antd';
import Booking from '../../pages/booking';
import MeetingRooms from '../../pages/meetingRooms';
import MeetingUsers from '../../pages/meetingUsers';
import MeetingSettings from '../../pages/meetingSettings';
import './meetingLayout.scss';

const options = [
    {
      label: 'Booking',
      value: 'booking',
    },
    {
      label: 'Today’s Listing',
      value: 'today-listing',
    },
    {
      label: 'Meeting Rooms',
      value: 'rooms',
    },
    {
      label: 'Users',
      value: 'users',
    },
    {
      label: 'Settings',
      value: 'settings',
    },
    {
      label: 'Profile',
      value: 'profile',
    }
];

const MeetingLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [navValue, setNavValue] = useState('booking');

    useEffect(() => {
        location.pathname.split('/').length === 2 ? setNavValue('booking') : setNavValue(location.pathname.split('/')[2]);
        const logged = localStorage.getItem('logged');
        if (!logged || logged === 'false') navigate('/login');
    }, [location, navigate]);
    
    const onChangeNav = ({ target: { value } }) => {
        setNavValue(value);
        navigate(`/meeting/${value}`);
    };

    const logOut = () => {
        localStorage.setItem('logged', false);
        navigate('/login');
    }

    return (
        <div className="meeting-layout-page">
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
                <Button type='primary' onClick={logOut}>Logout</Button>
            </div>
            <div className='routing-section'>
                <Routes>
                  <Route path='/' element={<Booking />} />
                  <Route path='/booking' element={<Booking />} />
                  <Route path='/rooms' element={<MeetingRooms />} />
                  <Route path='/users' element={<MeetingUsers />} />
                  <Route path='/settings' element={<MeetingSettings />} />
                </Routes>
            </div>
        </div> 
    );
}
  
export default MeetingLayout;
