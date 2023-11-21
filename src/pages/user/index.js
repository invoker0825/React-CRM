import React, { useState } from 'react';
import { Button, Card, Space, Modal, Select, Input, Checkbox } from 'antd';
import Tag from '../../components/tag';
import Table from '../../components/table';
import './user.scss';

const User = () => {

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
        },
        {
            title: 'Action',
            dataIndex: 'actino',
            render: (_, record) => (
              <Space size="small">
                <span className="material-symbols-outlined" onClick={() => editUser(record)}>edit</span>
              </Space>
            ),
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

    const [editShow, setEditShow] = useState(false);

    const editUser = (user) => {
        console.log('-------------------', user);
        setEditShow(true);
    }

    return (
        <>
            <div className="user-page">
                <Card className='table-card'>
                    <div className='d-flex align-center j-c-space-between top-section'>
                        <p className='card-title'>User</p>
                    </div>
                    <Table
                        columns={userColumns}
                        dataSource={userData}
                    />
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
                    <div className='d-flex align-center j-c-space-between'>
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
                            <p className='select-label'>User Type</p>
                            <Select
                                defaultValue='administrator'
                                options={[
                                    {
                                        value: 'administrator',
                                        label: 'Administrator',
                                    },
                                    {
                                        value: 'user',
                                        label: 'User',
                                    },
                                    {
                                        value: 'guest',
                                        label: 'Guest',
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
