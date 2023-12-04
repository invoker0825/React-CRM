import React from 'react';
import { Button, Card, Row, Col } from 'antd';
import { useNavigate } from "react-router-dom";
import Table from '../../components/table';
import './mediaReport.scss';

const reportColumns = [
    {
        title: 'Media Name',
        dataIndex: 'name'
    },
    {
        title: 'Schedule',
        dataIndex: 'schedule'
    },
    {
        title: 'Start Date',
        dataIndex: 'sDate'
    },
    {
        title: 'End Date',
        dataIndex: 'eDate'
    },
    {
        title: 'Start Time',
        dataIndex: 'sTime'
    },
    {
        title: 'End Time',
        dataIndex: 'eTime'
    },
    {
        title: 'Duration',
        dataIndex: 'duration'
    },
    {
        title: 'User',
        dataIndex: 'user'
    }
];

const reportData = [
    {
        key: '1',
        name: 'media 1',
        schedule: 'Schedule A',
        sDate: '22/10/20',
        eDate: '22/10/20',
        sTime: '6:00 AM',
        eTime: '11:59 PM',
        duration: 'Schedule A',
        user: 'user 1'
    }
];

const MediaReport = () => {

    const navigate = useNavigate();

    return (
        <>
            <div className="media-report-page">
                <Card className='table-card'>
                        <Row justify={'space-between'} className='top-section'>
                            <Col span={13}>
                                <div className='d-flex align-center j-c-space-between' style={{height: '100%'}}>
                                    <p className='card-title'>Media Report: Report Name</p>
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

export default MediaReport;
