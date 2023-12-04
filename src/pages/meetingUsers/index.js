import React from 'react';
import { Button, Card, Space } from 'antd';
import Table from '../../components/table';
import './meetingUsers.scss';

const MeetingUsers = () => {

    const userColumns = [
        {
            title: 'Name',
            dataIndex: 'name'
        },
        {
            title: 'Role',
            dataIndex: 'role'
        },
        {
            title: 'Email',
            dataIndex: 'email'
        },
        {
            title: 'Action',
            dataIndex: 'actino',
            render: (_, record) => (
              <Space size="middle">
                <span className="material-symbols-outlined">edit</span>
                <span className="material-symbols-outlined">delete</span>
              </Space>
            ),
            width: '185px'
        }
    ];
    
    const userData = [
        {
            key: '1',
            name: 'Room 1',
            role: 'Role 1',
            email: 'test1@gmail.com'
        },
        {
            key: '2',
            name: 'Room 2',
            role: 'Role 2',
            email: 'test2@gmail.com'
        }
    ];

    return (
        <>
            <div className="meeting-rooms-page">
                <Card className='table-card'>
                    <div className='d-flex align-center j-c-space-between top-section'>
                        <p className='card-title'>User</p>
                        <Button className='view-mode-btn' type='primary'>New User</Button>
                    </div>
                    <Table
                        columns={userColumns}
                        dataSource={userData}
                    />
                </Card>
            </div>            
        </>
    );
}

export default MeetingUsers;
