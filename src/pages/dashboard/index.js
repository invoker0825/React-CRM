import { useState } from 'react';
import { Button, Card, Checkbox, Form, Input, Col, Row, Radio, Space } from 'antd';
import {useNavigate} from 'react-router-dom';
import Tag from '../../components/tag';
import Table from '../../components/table';
import './dashboard.scss';
import packImg from '../../assets/img/pack.png';
import watchImg from '../../assets/img/watch.png';

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

const mediaColumns = [
    {
        title: 'Name',
        dataIndex: 'name',
        width: '150px'
    },
    {
        title: 'Screenshot',
        dataIndex: 'screenshot',
        render: (screenShot) => <img src={screenShot} alt='' />,
        width: '170px',
        sorter: (a, b) => a.screenshot - b.screenshot,
    },
    {
        title: 'Date/Time',
        dataIndex: 'date',
        width: '200px',
        sorter: (a, b) => a.date.localeCompare(b.date),
    },
    {
        title: 'By User',
        dataIndex: 'user',
        render: (user) => <><p className='black-text'>{user.name}</p><p className='small-text'>{user.email}</p></>,
        width: '180px'
    },
    {
        title: 'Resolution (px)',
        dataIndex: 'resolution',
        width: '175px',
        sorter: (a, b) => a.resolution.localeCompare(b.resolution),
    },
    {
        title: 'File Type',
        dataIndex: 'fileType',
        width: '140px',
        render: (fileType) => <p>{fileType.toUpperCase()}</p>,
    },
    {
        title: 'Status',
        dataIndex: 'status',        
        render: (status) => <Tag label={status.label} color={status.color}/>,
        width: '145px',
        sorter: (a, b) => a.status.label.localeCompare(b.status.label),
    },
    {
        title: 'Action',
        dataIndex: 'actino',
        render: (_, record) => (
          <Space size="small">
            <span className="material-symbols-outlined">visibility</span>
            <span className="material-symbols-outlined">edit</span>
          </Space>
        ),
    }
];

const mediaData = [
    {
        key: '1',
        name: 'BP-backdrop',
        screenshot: packImg,
        date: '1 min ago',
        user: {name: 'John Bushmill', email: 'Johnb@mail.com'},
        resolution: '800x600',
        fileType: 'ppt',
        status: {label: 'Uploading', color: 'orange'},
    },
    {
        key: '2',
        name: 'Powerpoint',
        screenshot: watchImg,
        date: '1 min ago',
        user: {name: 'Ilham Budi A', email: 'ilahmbudi@mail.com'},
        resolution: '1920x1080',
        fileType: 'jpg',
        status: {label: 'Processing', color: 'purple'},
    }
];

const Dashboard = () => {
    const cardInfo = [
        { name: 'Total players', value: 426 },
        { name: 'Active Schedule', value: 19 },
        { name: 'Active Playlist', value: 6 },
        { name: 'Total Users', value: 8 }
    ]
    const navigate = useNavigate()

    const [navValue, setNavValue] = useState('dashboard');
    
    const onChangeNav = ({ target: { value } }) => {
        console.log('radio4 checked', value);
        setNavValue(value);
    };

    const logOut = () => {
        navigate('/login');
    }

    return (
        <div className="dashboard-page">
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
            <div className='d-flex align-center mb-30'>
                {
                    cardInfo.map(card => 
                        <Card className='status-card'>
                            <p className='card-name'>{card.name}</p>
                            <p className='card-value'>{card.value}</p>
                        </Card>
                    )
                }
            </div>
            <Card className='table-card'>
                <div className='d-flex align-center j-c-space-between top-section'>
                    <div className='d-flex align-center'>
                        <p className='card-title'>Recent Media</p>
                        <Tag label={'+' + mediaData.length +' Media'} color='green'/>
                    </div>
                    <Button type='primary'>Go to Media Manager</Button>
                </div>
                <Table
                    columns={mediaColumns}
                    dataSource={mediaData}
                />
            </Card>
        </div> 
    );
}

export default Dashboard;
