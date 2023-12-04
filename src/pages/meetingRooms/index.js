import React from 'react';
import { Button, Card, Space } from 'antd';
import Table from '../../components/table';
import './meetingRooms.scss';

const MeetingRooms = () => {

    const roomColumns = [
        {
            title: 'Name',
            dataIndex: 'name'
        },
        {
            title: 'Location',
            dataIndex: 'location'
        },
        {
            title: 'Action',
            dataIndex: 'actino',
            render: (_, record) => (
              <Space size="middle">
                <span className="material-symbols-outlined">desktop_windows</span>
                <span className="material-symbols-outlined">edit</span>
                <span className="material-symbols-outlined">delete</span>
              </Space>  
            ),
            width: '185px'
        }
    ];
    
    const roomData = [
        {
            key: '1',
            name: 'Room 1',
            location: 'Location 1'
        },
        {
            key: '2',
            name: 'Room 2',
            location: 'Location 2'
        }
    ];

    return (
        <>
            <div className="meeting-rooms-page">
                <Card className='table-card'>
                    <div className='d-flex align-center j-c-space-between top-section'>
                        <p className='card-title'>Meeting Room</p>
                        <Button className='view-mode-btn' type='primary'>New Room</Button>
                    </div>
                    <Table
                        columns={roomColumns}
                        dataSource={roomData}
                    />
                </Card>
            </div>            
        </>
    );
}

export default MeetingRooms;
