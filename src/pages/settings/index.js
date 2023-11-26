import React, { useState } from 'react';
import { Button, Card, Modal, Select, Input, Checkbox, Tabs, Col, Row, Upload } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Tag from '../../components/tag';
import Table from '../../components/table';
import './settings.scss';
const { TextArea } = Input;
const { Dragger } = Upload;

const User = () => {

    const [currentTab, setCurrentTab] = useState('general');
    const [editShow, setEditShow] = useState(false);

    const userColumns = [
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
        }
    ];
    
    const userData = [
        {
            key: '1',
            name: 'yokemay.mah',
            group: 'Schedule A',
            type: 'Administrator',
            email: 'yokemay@gmail.com',
            status: {label: 'Active', color: 'green'}
        },
        {
            key: '2',
            name: 'yokemay.mah',
            group: 'Schedule A',
            type: 'Administrator',
            email: 'yokemay@gmail.com',
            status: {label: 'Active', color: 'green'}
        }
    ];

    const cardItems = [
        {
            label: 'General',
            key: 'general'
        },
        {
            label: 'User',
            key: 'user'
        },
        {
            label: 'Maintenance',
            key: 'maintenance'
        },
        {
            label: 'Others',
            key: 'others'
        }
    ]

    return (
        <>
            <div className="settings-page">
                <Tabs
                    activeKey={currentTab}
                    type="card"
                    items={cardItems}
                    onChange={(e) => setCurrentTab(e)}
                />
                <Card className='setting-card'>
                    { currentTab === 'general' &&
                        <div className='general-card'>
                            <div className='d-flex align-center j-c-space-between top-section'>
                                <p className='card-title'>Company Details</p>
                            </div>
                            <Row style={{marginLeft: '25px'}}>
                                <Col span={7}>
                                    <p className='select-label'>Company Name</p>
                                    <Input className='grey-input' placeholder='Company Name...' />
                                    <p className='select-label'>Title</p>
                                    <Input className='grey-input' placeholder='Title...' />
                                    <p className='select-label'>Description</p>
                                    <TextArea
                                        maxLength={100}
                                        placeholder="Description..."
                                        style={{
                                            height: 120,
                                            resize: 'none',
                                        }}
                                    />
                                    <p className='select-label'>Logo (133 x 133px)</p>
                                    <Dragger
                                        name="file"
                                        multiple={false}
                                        listType="picture-card"
                                        action='https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188'
                                        accept="image/png, image/jpeg"
                                        className='import-drag-file'
                                    >
                                        <p className="ant-upload-drag-icon">
                                            <div><span className="material-symbols-outlined">imagesmode</span></div>
                                        </p>
                                        <p className="ant-upload-text">Drag and drop image here, or click add image</p>
                                        <button>Open Explorer</button>
                                    </Dragger>
                                </Col>
                            </Row>
                        </div>
                    }
                    { currentTab === 'user' &&
                        <>
                            <div className='d-flex align-center j-c-space-between top-section'>
                                <p className='card-title'>Settings</p>
                                <div className='d-flex align-center'>
                                    <Input placeholder="search..." prefix={<SearchOutlined />}  className='search-input'/>
                                    <Button className='view-mode-btn' type='primary' onClick={() => setEditShow(true)}>
                                        <div className='d-flex align-center j-c-center'>
                                            <span className="material-symbols-outlined">add</span>User
                                        </div>
                                    </Button> 
                                </div>
                            </div>
                            <Table
                                columns={userColumns}
                                dataSource={userData}
                            />
                        </>
                    }
                </Card>
            </div> 
            
            <Modal
                title='User'
                centered
                open={editShow}
                onCancel={() => setEditShow(false)}
                footer={false}
                className='edit-user-modal'
            >
                <div className='modal-content'>
                    <p className='title'>User Details</p>
                    <div className='d-flex align-center'>
                        <div className='w-31'>
                            <p className='select-label'>Name*</p>
                            <Input className='grey-input' />
                        </div>
                        <div className='w-22'>
                            <p className='select-label'>User Group</p>
                            <Select
                                defaultValue='group1'
                                options={[
                                    {
                                        value: 'group1',
                                        label: 'Group 1',
                                    },
                                    {
                                        value: 'group2',
                                        label: 'Group 2',
                                    },
                                    {
                                        value: 'group3',
                                        label: 'Group 3',
                                    }
                                ]}
                            />
                        </div>
                        <div className='w-22'>
                            <p className='select-label'>Status</p>
                            <Select
                                defaultValue='active'
                                options={[
                                    {
                                        value: 'active',
                                        label: 'Active',
                                    },
                                    {
                                        value: 'inactive',
                                        label: 'Inactive',
                                    }
                                ]}
                            />
                        </div>
                    </div>
                    <p className='select-label'>New Password</p>
                    <Input.Password className='w-31' />
                    <p className='select-label'>New Confirm Password</p>
                    <Input.Password className='w-31' />
                    <p className='select-label'>#Tag</p>
                    <Input className='grey-input w-54' />
                    <div className='sub-container'>
                        <p className='title'>Permission Settings</p>
                        <div className='d-flex'>
                            <div className='w-31'>
                                <p className='check-title'>Media Module</p>
                                <Checkbox>View Media</Checkbox>
                                <Checkbox>Edit Media</Checkbox>
                            </div>
                            <div className='w-31'>
                                <p className='check-title'>Location Module</p>
                                <Checkbox>View Location</Checkbox>
                                <Checkbox>Edit Location</Checkbox>
                            </div>
                            <div className='w-31'>
                                <p className='check-title'>User Module</p>
                                <Checkbox>View User</Checkbox>
                                <Checkbox>Edit User</Checkbox>
                            </div>
                            <div className='w-31'>
                                <p className='check-title'>Media Module</p>
                                <Checkbox>View Media</Checkbox>
                                <Checkbox>Edit Media</Checkbox>
                            </div>
                            <div className='w-31'>
                                <p className='check-title'>Location Module</p>
                                <Checkbox>View Location</Checkbox>
                                <Checkbox>Edit Location</Checkbox>
                            </div>
                            <div className='w-31'>
                                <p className='check-title'>User Module</p>
                                <Checkbox>View User</Checkbox>
                                <Checkbox>Edit User</Checkbox>
                            </div>
                            <div className='w-31'>
                                <p className='check-title'>Media Module</p>
                                <Checkbox>View Media</Checkbox>
                                <Checkbox>Edit Media</Checkbox>
                            </div>
                            <div className='w-31'>
                                <p className='check-title'>Location Module</p>
                                <Checkbox>View Location</Checkbox>
                                <Checkbox>Edit Location</Checkbox>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='d-flex align-center'>
                    <Button type='primary' onClick={() => setEditShow(false)}>Save User</Button>
                    <Button className='modal-cancel-button' onClick={() => setEditShow(false)}>Cancel</Button>
                </div>
            </Modal>
        </>
    );
}

export default User;
