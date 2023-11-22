import React, { useState } from 'react';
import { Button, Card, Space, Pagination, Select, Modal, Input, Row, Col } from 'antd';
import Tag from '../../components/tag';
import Table from '../../components/table';
import packImg from '../../assets/img/pack.png';
import watchImg from '../../assets/img/watch.png';
import './player.scss';

const Player = () => {

    const [viewMode, setViewMode] = useState('list');
    const [editShow, setEditShow] = useState(false);
    const [editPlayer, setEditPlayer] = useState();

    const playerColumns = [
        {
            title: 'Name',
            dataIndex: 'name'
        },
        {
            title: 'Screenshot',
            dataIndex: 'screenshot',
            render: (screenShot) => <img src={screenShot} alt='' />
        },
        {
            title: 'Schedule',
            dataIndex: 'schedule'
        },
        {
            title: 'Location',
            dataIndex: 'location'
        },
        {
            title: 'Pixel',
            dataIndex: 'pixel',
            sorter: (a, b) => a.pixel.localeCompare(b.pixel)
        },
        {
            title: 'IP / MAC',
            dataIndex: 'ip'
        },
        {
            title: 'Version #',
            dataIndex: 'version'
        },
        {
            title: 'Free Space',
            dataIndex: 'freeSpace'
        },
        {
            title: 'Last Active',
            dataIndex: 'lastActive',
            width: '120px'
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
                <span className="material-symbols-outlined" onClick={() => editPlayerData(record)}>edit</span>
              </Space>
            ),
        }
    ];
    
    const playerData = [
        {
            key: '1',
            name: 'SCH 1',
            screenshot: packImg,
            schedule: 'Schedule A',
            location: 'Kuala Lumpur',
            pixel: '800x600',
            ip: 'Landscape',
            version: '1.1.6.57',
            freeSpace: '96 / 111.3G',
            lastActive: '22/05/23 09:07:24',
            status: {label: 'Active', color: 'green'}
        },
        {
            key: '2',
            name: 'SCH 2',
            screenshot: watchImg,
            schedule: 'Schedule B',
            location: 'Petaling Jaya',
            pixel: '1920x1080',
            ip: 'Portrait',
            version: '1.1.6.57',
            freeSpace: '12.1/29.5G',
            lastActive: '22/05/23 09:07:24',
            status: {label: 'Active', color: 'green'}
        },
        {
            key: '3',
            name: 'SCH 1',
            screenshot: packImg,
            schedule: 'Schedule A',
            location: 'Kuala Lumpur',
            pixel: '800x600',
            ip: 'Landscape',
            version: '1.1.6.57',
            freeSpace: '96 / 111.3G',
            lastActive: '22/05/23 09:07:24',
            status: {label: 'Active', color: 'green'}
        },
        {
            key: '4',
            name: 'SCH 2',
            screenshot: watchImg,
            schedule: 'Schedule B',
            location: 'Petaling Jaya',
            pixel: '1920x1080',
            ip: 'Portrait',
            version: '1.1.6.57',
            freeSpace: '12.1/29.5G',
            lastActive: '22/05/23 09:07:24',
            status: {label: 'Active', color: 'green'}
        },
        {
            key: '5',
            name: 'SCH 1',
            screenshot: packImg,
            schedule: 'Schedule A',
            location: 'Kuala Lumpur',
            pixel: '800x600',
            ip: 'Landscape',
            version: '1.1.6.57',
            freeSpace: '96 / 111.3G',
            lastActive: '22/05/23 09:07:24',
            status: {label: 'Active', color: 'green'}
        },
        {
            key: '6',
            name: 'SCH 2',
            screenshot: watchImg,
            schedule: 'Schedule B',
            location: 'Petaling Jaya',
            pixel: '1920x1080',
            ip: 'Portrait',
            version: '1.1.6.57',
            freeSpace: '12.1/29.5G',
            lastActive: '22/05/23 09:07:24',
            status: {label: 'Active', color: 'green'}
        },
    ];

    const toggleViewMode = () => {
        viewMode === 'list' ? setViewMode('thumb') : setViewMode('list');
    }

    const showTotal = (total, range) => {
        return `Showing ${range[0]}-${range[1]} of ${total}`
    }

    const editPlayerData = (player) => {
        setEditPlayer(player);
        setEditShow(true);
    }

    return (
        <>
            <div className="player-page">
                <Card className='table-card'>
                    <div className='d-flex align-center j-c-space-between top-section'>
                        <p className='card-title'>Player</p>
                        <div className='d-flex align-center'>                        
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
                            <Button className='view-mode-btn' type='primary' onClick={toggleViewMode}>{viewMode === 'list' ? <div className='d-flex align-center j-c-center'><span class="material-symbols-outlined">grid_view</span>Thumb View</div> : <div className='d-flex align-center j-c-center'><span class="material-symbols-outlined">lists</span>List View</div>}</Button>    
                        </div>
                    </div>
                    {
                        viewMode === 'list' ? 
                        <Table
                            columns={playerColumns}
                            dataSource={playerData}
                            className='report-table'
                        />
                        : 
                        <div className='thumb-view'>
                            <div className='thumb-container'>
                                <div className='d-flex align-center flex-wrap'>
                                    {
                                        playerData.map(player => 
                                            <>
                                                <div className='w-20'>
                                                    <Card 
                                                        className='player-card'
                                                        style={{backgroundImage: 'url(' + player.screenshot + ')'}}
                                                    >
                                                    </Card>
                                                    <div className='d-flex align-center j-c-space-between'>
                                                        <p className='name'>{player.name}</p>
                                                        <div className='d-flex align-center'>
                                                            <span className="material-symbols-outlined" onClick={() => editPlayerData(player)}>edit</span>
                                                            <Tag label={player.status.label} color={player.status.color}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    }
                                </div>
                            </div>
                            <Pagination pageSize={10} total={playerData.length} showTotal={showTotal} />
                        </div>
                    }
                </Card>
            </div>
            
            <Modal
                title='Player Details'
                centered
                open={editShow}
                onCancel={() => setEditShow(false)}
                footer={false}
                className='edit-player-modal'
            >
                <p className='select-label'>Name</p>
                <Input className='grey-input' value={editPlayer?.name} />
                <Row justify='space-between'>
                    <Col span={11}>
                        <p className='select-label'>Group</p>
                        <Select
                            defaultValue='home'
                            options={[
                                {
                                    value: 'home',
                                    label: 'Home'
                                },
                                {
                                    value: 'home1',
                                    label: 'Home 1'
                                },
                                {
                                    value: 'home2',
                                    label: 'Home 2'
                                }
                            ]}
                        />
                    </Col>
                    <Col span={11}>
                        <p className='select-label'>Status</p>
                        <Select
                            defaultValue='enabled'
                            options={[
                                {
                                    value: 'enabled',
                                    label: 'Enabled'
                                },
                                {
                                    value: 'disabled',
                                    label: 'Disabled'
                                },
                                {
                                    value: 'active',
                                    label: 'Active'
                                }
                            ]}
                        />
                    </Col>
                </Row>
                <p className='select-label'>IP Address</p>
                <Input className='grey-input' placeholder='Month August' />
                <p className='select-label'>Display (Commercial display only)</p>
                <Select
                    defaultValue='lgvl5g'
                    options={[
                        {
                            value: 'lgvl5g',
                            label: 'LG VL5G Series'
                        }
                    ]}
                />
                <Button className='modal-cancel-button' onClick={() => setEditShow(false)}>Cancel</Button>
            </Modal>
        </>
    );
}

export default Player;
