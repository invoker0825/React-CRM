import React, { useState, useEffect } from 'react';
import { Button, Card, Space, Select, Input, Row, Col, Modal, DatePicker, notification } from 'antd';
import { useNavigate } from "react-router-dom";
import { SearchOutlined } from '@ant-design/icons';
import Table from '../../components/table';
import axios from 'axios';
import './report.scss';

const reportColumns = [
    {
        title: 'Username',
        dataIndex: 'Name'
    },
    {
        title: 'Type',
        dataIndex: 'Type'
    },
    {
        title: 'Start Date',
        dataIndex: 'StartDate',
        render: (_, record) => (<p>{new Date(record.StartDate).toISOString().substring(0, 10)}</p>)
    },
    {
        title: 'End Date',
        dataIndex: 'EndDate',
        render: (_, record) => (<p>{new Date(record.EndDate).toISOString().substring(0, 10)}</p>)
    },
    {
        title: 'Created By',
        dataIndex: 'CreatedBy'
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

const Report = () => {

    const navigate = useNavigate();

    const [modalTitle, setModalTitle] = useState('');
    const [newShow, setNewShow] = useState(false);
    const [reportType, setReportType] = useState('');
    const [reportData, setReportData] = useState([]);
    const [newReport, setNewReport] = useState({Name: '', Type: '', StartDate: null, EndDate: null, CreatedBy: '', ModifiedBy: ''});
    const [currentUser, setCurrentUser] = useState();
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        setCurrentUser(JSON.parse(localStorage.getItem('loggedUser')));
        axios.get('http://localhost:5001/api/report')
        .then((res) => {
            if (res.status === 200) {
                setReportData(res.data);
            }
        }).catch((err) => {
            console.log('err-------------', err)
        });
    }, []);

    const createNewReport = () => {
        setModalTitle('Report Details');
        setReportType('');
        setNewReport({Name: '', Type: '', StartDate: null, EndDate: null, CreatedBy: currentUser.Email, ModifiedBy: currentUser.Email});
        setNewShow(true);
    }

    const saveReport =() => {
        newReport.StartDate = new Date(newReport.StartDate);
        newReport.EndDate = new Date(newReport.EndDate);
        if (newReport.Name !== '' && newReport.Type !== '' && newReport.StartDate !== null && newReport.EndDate !== null) {
            axios.post('http://localhost:5001/api/report/add', newReport)
            .then((res) => {
                if (res.status === 200) {
                    api.success({
                        message: 'Success',
                        description:
                          'The new report has been added successfully.',
                    });
                    setReportData(res.data)
                    setNewShow(false);
                }
            }).catch((err) => {
                console.log('err-------------', err)
            });
        } else {
            api.error({
                message: 'Error',
                description:
                  'Check for missing fields.',
            });
        }
        // setNewShow(false);
        // navigate(`/report/${reportType}`)
    }

    return (
        <>
            {contextHolder}
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
                <Input className='grey-input' placeholder='name...'  value={newReport.Name} onChange={(e) => setNewReport((prevState) => ({ ...prevState, Name: e.target.value }))}/>
                <Row justify='space-between'>
                    <Col span={11}>
                        <p className='select-label'>Start Date*</p>
                        <DatePicker format='DD-MM-YY' value={newReport.StartDate} onChange={(date) => setNewReport((prevState) => ({ ...prevState, StartDate: date }))}/>
                    </Col>
                    <Col span={11}>
                        <p className='select-label'>End Date*</p>
                        <DatePicker format='DD-MM-YY' value={newReport.EndDate} onChange={(date) => setNewReport((prevState) => ({ ...prevState, EndDate: date }))}/>
                    </Col>
                </Row>
                <p className='select-label'>Report Type</p>
                <Select
                    value={newReport.Type}
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
                    onChange={(e) => setNewReport((prevState) => ({ ...prevState, Type: e}))}
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
