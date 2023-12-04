import React, {useState} from 'react';
import { Button, Card, Space, Select, Input, Row, Col, Modal, DatePicker } from 'antd';
import { useNavigate } from "react-router-dom";
import { SearchOutlined } from '@ant-design/icons';
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

    const navigate = useNavigate();

    const [modalTitle, setModalTitle] = useState('');
    const [newShow, setNewShow] = useState(false);
    const [reportType, setReportType] = useState('');

    const createNewReport = () => {
        setModalTitle('Report Details');
        setReportType('');
        setNewShow(true);
    }

    const changeReportType = (e) => {
        setReportType(e);
    }

    const saveReport =() => {
        setNewShow(false);
        navigate(`/report/${reportType}`)
    }

    return (
        <>
            <div className="report-page">
                <Card className='table-card'>
                    <div className='d-flex align-center j-c-space-between top-section'>
                        <p className='card-title'>Report</p>
                        <div className='d-flex align-center'>
                            <Input placeholder="search..." prefix={<SearchOutlined />}  className='search-input'/>
                            <Button className='view-mode-btn' type='primary' onClick={createNewReport}>
                                <div className='d-flex align-center j-c-center'>
                                    <span className="material-symbols-outlined">add</span>Report
                                </div>
                            </Button> 
                        </div>
                    </div>
                    <Table
                        columns={reportColumns}
                        dataSource={reportData}
                        className='report-table'
                    />
                </Card>
            </div> 
            
            <Modal
                title={modalTitle}
                centered
                open={newShow}
                onCancel={() => setNewShow(false)}
                footer={false}
                className='create-report-modal'
            >
                <p className='select-label'>Name</p>
                <Input className='grey-input' placeholder='name...' />
                <Row justify='space-between'>
                    <Col span={11}>
                        <p className='select-label'>Start Date*</p>
                        <DatePicker />
                    </Col>
                    <Col span={11}>
                        <p className='select-label'>End Date*</p>
                        <DatePicker />
                    </Col>
                </Row>
                <p className='select-label'>Report Type</p>
                <Select
                    value={reportType}
                    options={[
                        {
                            value: 'user',
                            label: 'User'
                        },
                        {
                            value: 'media',
                            label: 'Media'
                        },
                        {
                            value: 'playback',
                            label: 'Playback'
                        }
                    ]}
                    onChange={changeReportType}
                />
                <p className='select-label'>Report Type</p>
                <Select
                    mode='multiple'
                    options={[
                        {
                            value: 'Ali',
                            label: 'Ali'
                        },
                        {
                            value: 'Muthu',
                            label: 'Muthu'
                        },
                        {
                            value: 'Ah Kau',
                            label: 'Ah Kau'
                        }
                    ]}
                    disabled={reportType === ''}
                />
                <p className='select-label'>All Schedules</p>
                <Select
                    mode='multiple'
                    options={[
                        {
                            value: 'Schedule 1',
                            label: 'Schedule 1'
                        },
                        {
                            value: 'Schedule 2',
                            label: 'Schedule 2'
                        },
                        {
                            value: 'Schedule 3',
                            label: 'Schedule 3'
                        },
                        {
                            value: 'Schedule 4',
                            label: 'Schedule 4'
                        },
                    ]}
                    disabled={reportType === '' || reportType === 'user'}
                />
                <Button type='primary' onClick={saveReport}>Ok</Button>
                <Button className='modal-cancel-button' onClick={() => setNewShow(false)}>Cancel</Button>
            </Modal>
        </>
    );
}

export default Report;
