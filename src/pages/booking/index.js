import React from 'react';
import { Button, Card, Space, Input, DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Tag from '../../components/tag';
import Table from '../../components/table';
import './booking.scss';

const { RangePicker } = DatePicker;

const Booking = () => {

    const bookingColumns = [
        {
            title: 'Title',
            dataIndex: 'title'
        },
        {
            title: 'When',
            dataIndex: 'when'
        },
        {
            title: 'Meeting Room',
            dataIndex: 'meetingRoom'
        },
        {
            title: 'Action',
            dataIndex: 'actino',
            render: (_, record) => (
              <Space size="middle">
                <span className="material-symbols-outlined">visibility</span>
                <span className="material-symbols-outlined">edit</span>
                <span className="material-symbols-outlined">delete</span>
              </Space>  
            ),
            width: '185px'
        }
    ];
    
    const bookingData = [
        {
            key: '1',
            title: 'SCH 1',
            when: 'Schedule A',
            meetingRoom: 'Kuala Lumpur'
        },
        {
            key: '2',
            title: 'SCH 2',
            when: 'Schedule B',
            meetingRoom: 'Kuala Lumpur'
        }
    ];

    return (
        <>
            <div className="booking-page">
                <Card className='table-card'>
                    <div className='d-flex align-center j-c-space-between top-section'>
                        <p className='card-title'>Booking</p>
                        <div className='d-flex align-center'>
                            <Input placeholder="search..." prefix={<SearchOutlined />}  className='search-input'/>
                            <RangePicker />
                            <Button className='view-mode-btn' type='primary'>New Booking</Button> 
                        </div>
                    </div>
                    <Table
                        columns={bookingColumns}
                        dataSource={bookingData}
                    />
                </Card>
                <Tag label={'webOS'} color={'green'} />
            </div>            
        </>
    );
}

export default Booking;
