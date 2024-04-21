import React, { useState, useEffect } from 'react';
import { Button, Card, Space, Modal, Select, Input, Checkbox, Collapse } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Tag from '../../components/tag';
import Table from '../../components/table';
import './user.scss';

const CheckboxGroup = Checkbox.Group;

const User = () => {
    
    const [filterShow, setFilterShow] = useState(false);
    const [checkedList, setCheckedList] = useState([]);
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

    const fileTypes = ['Active', 'Inactive', 'Expired', 'Suspended'];
    const checkAll = fileTypes.length === checkedList.length;
    const indeterminate = checkedList.length > 0 && checkedList.length < fileTypes.length;

    const editUser = (user) => {
        console.log('-------------------', user);
        setEditShow(true);
    }

    const fileTypeCheck = () => {
        return (
            <>
                <Checkbox indeterminate={indeterminate} onChange={onCheckAllTypes} checked={checkAll}>
                    All
                </Checkbox>
                <CheckboxGroup options={fileTypes} value={checkedList} onChange={onChangeFileType} />
            </>
        );
    }

    const onChangeFileType = (list) => {
        setCheckedList(list);
    };

    const onCheckAllTypes = (e) => {
        setCheckedList(e.target.checked ? fileTypes : []);
    };

    const resetFilter = () => {
        setCheckedList([]);
    }

    return (
        <>
            <div className="user-page">
                <Card className='table-card'>
                    <div className='d-flex align-center j-c-space-between top-section'>
                        <p className='card-title'>User</p>
                        <div className='d-flex align-center'>
                            <Input placeholder="search..." prefix={<SearchOutlined />}  className='search-input'/>
                            <Button className='view-mode-btn' type='primary' onClick={() => setEditShow(true)}>
                                <div className='d-flex align-center j-c-center'>
                                    <span className="material-symbols-outlined">add</span>User
                                </div>
                            </Button> 
                            <Button className='filter-btn' onClick={() => setFilterShow(true)}>
                                <div className='d-flex align-center'>
                                    <span className="material-symbols-outlined">tune</span><span>&nbsp;&nbsp;Filters</span>
                                </div>
                            </Button>
                        </div>
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
            
            <Modal
                title={
                    <div className='d-flex align-center j-c-space-between'>
                        <p>Filters</p>
                        <div className='reset-button' onClick={resetFilter}><span className="material-symbols-outlined">close</span><p>Reset</p></div>
                    </div>
                }
                centered
                open={filterShow}
                onCancel={() => setFilterShow(false)}
                footer={false}
                className='user-filter-modal'
            >
                <Collapse
                    items={[
                        {
                        key: '1',
                        label: 'File Type',
                        children: <>{fileTypeCheck()}</>,
                        }
                    ]}
                    defaultActiveKey={['1']}
                    expandIconPosition='end'
                    className='file-type-collapse'
                />
                <div className='d-flex align-center j-c-end'>
                    <Button className='modal-cancel-button' onClick={() => setFilterShow(false)}>Cancel</Button>
                    <Button 
                        type='primary' 
                        disabled={checkedList.length === 0} 
                        className={checkedList.length === 0 && 'ant-btn-disabled'} 
                        onClick={() => setFilterShow(false)}
                    >
                        Apply Filter
                    </Button>
                </div>
            </Modal>
        </>
    );
}

export default User;
