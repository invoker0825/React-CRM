import React from 'react';
import { Button, Card, Row, Col } from 'antd';
import { useNavigate } from "react-router-dom";
import Table from '../../components/table';
import './playBackReport.scss';

const reportColumns = [
    {
        title: 'Date',
        dataIndex: 'date'
    },
    {
        title: 'Media',
        dataIndex: 'media'
    },
    {
        title: 'Location (Group)',
        dataIndex: 'location'
    },
    {
        title: 'Time',
        dataIndex: 'time'
    },
    {
        title: 'Player',
        dataIndex: 'player'
    },
    {
        title: 'Schedule',
        dataIndex: 'schedule'
    },
    {
        title: 'Hits',
        dataIndex: 'hits'
    },
    {
        title: 'User',
        dataIndex: 'user'
    },
    {
        title: 'Action',
        dataIndex: 'action',
        render: (_, record) => (<a href='/' className='purple-text'>View Log</a>),
    }
];

const reportData = [
    {
        key: '1',
        date: 'Schedule A',
        media: 'Schedule A',
        location: '22/10/20',
        time: '22/10/20',
        player: '6:00 AM',
        schedule: '11:59 PM',
        hits: 'Schedule A',
        user: 'user 1'
    }
];

const PlayBackReport = () => {

    const navigate = useNavigate();

    return (
        <>
            <div className="media-report-page">
                <Card className='table-card'>
                        <Row justify={'space-between'} className='top-section'>
                            <Col span={13}>
                                <div className='d-flex align-center j-c-space-between' style={{height: '100%'}}>
                                    <p className='card-title'>Playback Report: Report Name</p>
                                    <p className='card-title'>1 December 2023 - 31 December 2023</p>
                                </div>
                            </Col>
                            <div className='d-flex align-center'>
                                <Button className='view-mode-btn' type='primary'>Download .CSV</Button> 
                                <Button className='view-mode-btn' type='primary'>Download .PDF</Button> 
                            </div>
                        </Row> 
                    <Table
                        columns={reportColumns}
                        dataSource={reportData}
                        className='report-table'
                    />
                </Card>
                <Button type='primary' style={{width: '146px'}} onClick={() => navigate('../report')}>Back</Button>
            </div> 
        </>
    );
}

export default PlayBackReport;
