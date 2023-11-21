import React, { useState } from 'react';
import { Button, Card, Space } from 'antd';
import Tag from '../../components/tag';
import Table from '../../components/table';
import './report.scss';

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
        title: 'Email',
        dataIndex: 'email'
    },
    {
        title: 'Status',
        dataIndex: 'status',        
        render: (status) => <Tag label={status.label} color={status.color}/>,
        sorter: (a, b) => a.status.label.localeCompare(b.status.label)
    },
    {
        title: 'Action',
        dataIndex: 'actino',
        render: (_, record) => (
          <Space size="small">
            <span className="material-symbols-outlined">edit</span>
          </Space>
        ),
    }
];

const reportData = [
    {
        key: '1',
        name: 'yokemay.mah',
        group: 'Schedule A',
        type: 'Administrator',
        email: 'yokemay@gmail.com',
        status: {label: 'Uploading', color: 'orange'}
    },
    {
        key: '2',
        name: 'yokemay.mah',
        group: 'Schedule A',
        type: 'Administrator',
        email: 'yokemay@gmail.com',
        status: {label: 'Uploading', color: 'orange'}
    },
    {
        key: '3',
        name: 'yokemay.mah',
        group: 'Schedule A',
        type: 'Administrator',
        email: 'yokemay@gmail.com',
        status: {label: 'Uploading', color: 'orange'}
    }
];

const Report = () => {

    return (
        <>
            <div className="media-page">
                <Card className='table-card'>
                    <div className='d-flex align-center j-c-space-between top-section'>
                        <p className='card-title'>Report</p>
                        <Button type='primary'><span class="material-symbols-outlined">add</span>Report</Button>
                    </div>
                    <Table
                        columns={reportColumns}
                        dataSource={reportData}
                        className='report-table'
                    />
                </Card>
            </div> 
        </>
    );
}

export default Report;
