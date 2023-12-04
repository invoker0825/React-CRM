import React from 'react';
import { Button, Card, Row, Col } from 'antd';
import { useNavigate } from "react-router-dom";
import Table from '../../components/table';
import './userReport.scss';

const reportColumns = [
    {
        title: 'Username',
        dataIndex: 'name'
    },
    {
        title: 'User Group',
        dataIndex: 'group'
    },
    {
        title: 'User Type',
        dataIndex: 'type'
    },
    {
        title: 'Date',
        dataIndex: 'date'
    },
    {
        title: 'Time',
        dataIndex: 'time'
    },
    {
        title: 'Module',
        dataIndex: 'module'
    },
    {
        title: 'Activity',
        dataIndex: 'activity'
    }
];

const reportData = [
    {
        key: '1',
        name: 'yokemay.mah',
        group: 'Schedule A',
        type: 'Administrator',
        date: '8/5/19',
        time: '4:19 PM',
        module: 'player_module',
        activity: 'access_module'
    },
    {
        key: '2',
        name: 'yokemay.mah',
        group: 'Schedule A',
        type: 'Administrator',
        date: '8/5/19',
        time: '4:19 PM',
        module: 'player_module',
        activity: 'login'
    },
    {
        key: '3',
        name: 'yokemay.mah',
        group: 'Schedule A',
        type: 'Administrator',
        date: '8/5/19',
        time: '4:19 PM',
        module: 'player_module',
        activity: 'access_module'
    }
];

const UserReport = () => {

    const navigate = useNavigate();

    return (
        <>
            <div className="user-report-page">
                <Card className='table-card'>
                        <Row justify={'space-between'} className='top-section'>
                            <Col span={13}>
                                <div className='d-flex align-center j-c-space-between' style={{height: '100%'}}>
                                    <p className='card-title'>User Report: Report Name</p>
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

export default UserReport;
