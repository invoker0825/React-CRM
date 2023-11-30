import { useNavigate } from "react-router-dom";
import { Button, Card, Space } from 'antd';
import Tooltip from '@mui/material/Tooltip';
import { Label } from 'semantic-ui-react'
import Tag from '../../components/tag';
import Table from '../../components/table';
import packImg from '../../assets/img/pack.png';
import watchImg from '../../assets/img/watch.png';
import playerMap from '../../assets/img/player-map.png'
import './dashboard.scss';

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

const playListColumns = [
    {
        title: 'Name',
        dataIndex: 'name',
        width: '150px'
    },
    {
        title: 'Duration',
        dataIndex: 'duration',
        width: '170px',
        sorter: (a, b) => a.duration - b.duration,
    },
    {
        title: 'Layout Name',
        dataIndex: 'layoutName',
        width: '200px',
        sorter: (a, b) => a.layoutName.localeCompare(b.layoutName),
    },
    {
        title: 'By User',
        dataIndex: 'user',
        render: (user) => <><p className='black-text'>{user.name}</p><p className='small-text'>{user.email}</p></>,
        width: '180px'
    },
    {
        title: 'User Group',
        dataIndex: 'userGroup',
        width: '175px',
        sorter: (a, b) => a.userGroup.localeCompare(b.userGroup),
    },
    {
        title: 'Schedule Attached',
        dataIndex: 'schedule',
        width: '140px',
        render: (schedule) => <p className='purple-text'>{schedule}</p>,
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

const playListData = [
    {
        key: '1',
        name: 'July Promo',
        duration: '5 mins',
        layoutName: 'L-Panel',
        user: {name: 'John Bushmill', email: 'Johnb@mail.com'},
        userGroup: '800x600',
        schedule: 'July',
        status: {label: 'Active', color: 'green'},
    }
];

const alertColumns = [
    {
        title: 'Name',
        dataIndex: 'name',
        width: '150px'
    },
    {
        title: 'Duration',
        dataIndex: 'duration',
        width: '170px',
        sorter: (a, b) => a.duration - b.duration,
    },
    {
        title: 'Location',
        dataIndex: 'location',
        width: '200px',
        sorter: (a, b) => a.location.localeCompare(b.location),
    },
    {
        title: 'Error Message',
        dataIndex: 'errorMessage',
        render: (errorMessage) => <p className='black-text'>{errorMessage}</p>,
        width: '255px'
    },
    {
        title: 'Date/Time',
        dataIndex: 'date',
        width: '175px',
        render: (date) => <p className='purple-text'>{date}</p>
    },
    {
        title: 'Status',
        dataIndex: 'status',        
        render: (status) => <Tag label={status.label} color={status.color}/>,
        width: '145px',
        sorter: (a, b) => a.status.label.localeCompare(b.status.label),
    },
    {
        title: 'User Group',
        dataIndex: 'userGroup',
        sorter: (a, b) => a.userGroup.localeCompare(b.userGroup),
    },
];

const alertData = [
    {
        key: '1',
        name: 'Lobby',
        duration: '5 mins ago',
        location: 'Kuala Lumpur',
        errorMessage: 'Destination Host Unreachable',
        date: '2-18-2023',
        status: {label: 'Disconnected', color: 'red'},
        userGroup: 'Select Support Enginner'
    }
];

const scheduleColumns = [
    {
        title: 'Name',
        dataIndex: 'name',
        width: '150px'
    },
    {
        title: 'Location',
        dataIndex: 'location',
        width: '200px',
        sorter: (a, b) => a.location.localeCompare(b.location),
    },
    {
        title: 'By User',
        dataIndex: 'user',
        width: '180px',
        sorter: (a, b) => a.user.localeCompare(b.user),
    },
    {
        title: 'Start Date/Time',
        dataIndex: 'startDate',
        width: '175px',
        render: (startDate) => <p className='purple-text'>{startDate}</p>
    },
    {
        title: 'End Date/Time',
        dataIndex: 'endDate',
        width: '175px',
        render: (endDate) => <p className='purple-text'>{endDate}</p>
    },
    {
        title: 'Status',
        dataIndex: 'status',        
        render: (status) => <Tag label={status.label} color={status.color}/>,
        sorter: (a, b) => a.status.label.localeCompare(b.status.label)
    }
];

const scheduleData = [
    {
        key: '1',
        name: 'Lobby',
        location: 'Kuala Lumpur',
        user: 'John Bushmill',
        startDate: '2-18-2023',
        endDate: '3-18-2023',
        status: {label: 'Inactive', color: 'orange'}
    }
];

const Dashboard = () => {
    const navigate = useNavigate();
    const cardInfo = [
        { name: 'Total players', value: 426 },
        { name: 'Active Schedule', value: 19 },
        { name: 'Active Playlist', value: 6 },
        { name: 'Total Users', value: 8 },
        { name: 'Last Login', value: 8 },
        { name: 'Display', value: 88 },
        { name: 'Licenses', value: '19/100' },
        { name: 'Version Number', value: '8.8.888' }

    ]

    return (
        <div className="dashboard-page">
            <div className='d-flex align-center mb-30 flex-wrap'>
                {
                    cardInfo.map(card => 
                        <Tooltip title={'This is ' + card.name + '.'} arrow placement="top-start" followCursor>
                            <Card className='status-card'>
                                <p className='card-name'>{card.name}</p>
                                <p className='card-value'>{card.value}</p>
                            </Card>
                        </Tooltip>
                    )
                }
            </div>
            <Card className='table-card'>
                <div className='d-flex align-center j-c-space-between top-section'>
                    <div className='d-flex align-center'>
                        <p className='card-title'>Recent Media</p>
                        <Tag label={'+' + mediaData.length +' Media'} color='green'/>
                    </div>
                    <Button type='primary' onClick={()=> navigate('/media')}>Go to Media Manager</Button>
                </div>
                <Table
                    columns={mediaColumns}
                    dataSource={mediaData}
                />
            </Card>
            <Card className='table-card'>
                <div className='d-flex align-center j-c-space-between top-section'>
                    <div className='d-flex align-center'>
                        <p className='card-title'>Recent PlayList</p>
                        <Tag label={'+' + playListData.length +' Playlist'} color='green'/>
                    </div>
                    <Button type='primary' onClick={()=> navigate('/playlist')}>Go to Playlist Manager</Button>
                </div>
                <Table
                    columns={playListColumns}
                    dataSource={playListData}
                />
            </Card>
            <Card className='table-card'>
                <div className='d-flex align-center j-c-space-between top-section'>
                    <div className='d-flex align-center'>
                        <p className='card-title'>Player Alert</p>
                        <Tag label={'+' + alertData.length +' Alert'} color='red'/>
                    </div>
                    <Button><div className='d-flex align-center'><span className="material-symbols-outlined">tune</span><span>&nbsp;&nbsp;Filters</span></div></Button>
                </div>
                <Table
                    columns={alertColumns}
                    dataSource={alertData}
                />
            </Card>
            <Card className='table-card'>
                <div className='d-flex align-center j-c-space-between top-section'>
                    <div className='d-flex align-center'>
                        <p className='card-title'>Inactive Schedule</p>
                        <Tag label={'+' + scheduleData.length +' Expired Schdule'} color='orange'/>
                    </div>
                    <Button type='primary' onClick={()=> navigate('/schedule')}>Go to Schedule Manager</Button>
                </div>
                <Table
                    columns={scheduleColumns}
                    dataSource={scheduleData}
                />
            </Card>
            <Card className='table-card'>
                <div className='d-flex align-center j-c-space-between top-section'>
                    <div className='d-flex align-center'>
                        <p className='card-title'>Active Player</p>
                    </div>
                    <Button type='primary' onClick={()=> navigate('/player')}>Go to Player Manager</Button>
                </div>
                <div className='map-section'>
                    <img src={playerMap} alt='player map' />
                    <Label basic pointing='below' className="player-label">
                        <p className="player-name">Johor Baharu</p>
                        <p className="player-number">168 Players</p>
                    </Label>
                </div>
            </Card>
        </div> 
    );
}

export default Dashboard;
