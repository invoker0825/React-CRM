import React, { useState } from 'react';
import { Button, Card, Space, Pagination, Select, Modal, Input, Row, Col, Checkbox, Badge, Menu, Collapse } from 'antd';
import { SearchOutlined, AppstoreOutlined } from '@ant-design/icons';
import Tag from '../../components/tag';
import ContextMenu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Table from '../../components/table';
import packImg from '../../assets/img/pack.png';
import watchImg from '../../assets/img/watch.png';
import './player.scss';

const CheckboxGroup = Checkbox.Group;

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}

const Player = () => {

    const [viewMode, setViewMode] = useState('list');
    const [editShow, setEditShow] = useState(false);
    const [editPlayer, setEditPlayer] = useState();
    const [displaySelect, setDisplaySelect] = useState('');
    const [cardContextMenu, setCardContextMenu] = useState(null);
    const [menuContextMenu, setMenuContextMenu] = useState(null);
    const [moveToShow, setMoveToShow] = useState(false);
    const [filterShow, setFilterShow] = useState(false);
    const [checkedList, setCheckedList] = useState([]);

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
            title: 'Platform',
            dataIndex: 'platform',
            render: (platform) => <Tag label={platform} color={getPlatformColor(platform)}/>
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
            render: (status) => <div className='d-flex align-center status-icons'>
                <span class="material-symbols-outlined">cloud_upload</span>
                <span class="material-symbols-outlined">wifi</span>
                <span class="material-symbols-outlined">check_circle</span>
            </div>,
            sorter: (a, b) => a.status.label.localeCompare(b.status.label)
        },
        {
            title: 'Action',
            dataIndex: 'actino',
            render: (_, record) => (
              <Space size={3}>
                <span className="material-symbols-outlined" onClick={() => editPlayerData(record)}>edit</span>
                <span className="material-symbols-outlined power-icon" onClick={() => editPlayerData(record)}>power_settings_new</span>
                {record.platform === 'Windows' && <span className="material-symbols-outlined filled-icon" onClick={() => editPlayerData(record)}>settings</span>}
                <span className="material-symbols-outlined filled-icon grey-icon" onClick={() => editPlayerData(record)}>delete</span>
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
            status: {label: 'Active', color: 'green'},
            platform: 'Windows'
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
            status: {label: 'Active', color: 'green'},
            platform: 'Android'
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
            status: {label: 'Active', color: 'green'},
            platform: 'webOS'
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
            status: {label: 'Active', color: 'green'},
            platform: 'Tizen'
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
            status: {label: 'Active', color: 'green'},
            platform: 'Linux'
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
            status: {label: 'Active', color: 'green'},
            platform: 'Tizen'
        },
        {
            key: '7',
            name: 'SCH 1',
            screenshot: packImg,
            schedule: 'Schedule A',
            location: 'Kuala Lumpur',
            pixel: '800x600',
            ip: 'Landscape',
            version: '1.1.6.57',
            freeSpace: '96 / 111.3G',
            lastActive: '22/05/23 09:07:24',
            status: {label: 'Active', color: 'green'},
            platform: 'Windows'
        },
        {
            key: '8',
            name: 'SCH 2',
            screenshot: watchImg,
            schedule: 'Schedule B',
            location: 'Petaling Jaya',
            pixel: '1920x1080',
            ip: 'Portrait',
            version: '1.1.6.57',
            freeSpace: '12.1/29.5G',
            lastActive: '22/05/23 09:07:24',
            status: {label: 'Active', color: 'green'},
            platform: 'Android'
        },
        {
            key: '9',
            name: 'SCH 1',
            screenshot: packImg,
            schedule: 'Schedule A',
            location: 'Kuala Lumpur',
            pixel: '800x600',
            ip: 'Landscape',
            version: '1.1.6.57',
            freeSpace: '96 / 111.3G',
            lastActive: '22/05/23 09:07:24',
            status: {label: 'Active', color: 'green'},
            platform: 'Windows'
        },
        {
            key: '10',
            name: 'SCH 2',
            screenshot: watchImg,
            schedule: 'Schedule B',
            location: 'Petaling Jaya',
            pixel: '1920x1080',
            ip: 'Portrait',
            version: '1.1.6.57',
            freeSpace: '12.1/29.5G',
            lastActive: '22/05/23 09:07:24',
            status: {label: 'Active', color: 'green'},
            platform: 'Windows'
        },
        {
            key: '11',
            name: 'SCH 1',
            screenshot: packImg,
            schedule: 'Schedule A',
            location: 'Kuala Lumpur',
            pixel: '800x600',
            ip: 'Landscape',
            version: '1.1.6.57',
            freeSpace: '96 / 111.3G',
            lastActive: '22/05/23 09:07:24',
            status: {label: 'Active', color: 'green'},
            platform: 'Windows'
        },
        {
            key: '12',
            name: 'SCH 2',
            screenshot: watchImg,
            schedule: 'Schedule B',
            location: 'Petaling Jaya',
            pixel: '1920x1080',
            ip: 'Portrait',
            version: '1.1.6.57',
            freeSpace: '12.1/29.5G',
            lastActive: '22/05/23 09:07:24',
            status: {label: 'Active', color: 'green'},
            platform: 'Windows'
        },
        {
            key: '13',
            name: 'SCH 1',
            screenshot: packImg,
            schedule: 'Schedule A',
            location: 'Kuala Lumpur',
            pixel: '800x600',
            ip: 'Landscape',
            version: '1.1.6.57',
            freeSpace: '96 / 111.3G',
            lastActive: '22/05/23 09:07:24',
            status: {label: 'Active', color: 'green'},
            platform: 'Windows'
        },
        {
            key: '14',
            name: 'SCH 2',
            screenshot: watchImg,
            schedule: 'Schedule B',
            location: 'Petaling Jaya',
            pixel: '1920x1080',
            ip: 'Portrait',
            version: '1.1.6.57',
            freeSpace: '12.1/29.5G',
            lastActive: '22/05/23 09:07:24',
            status: {label: 'Active', color: 'green'},
            platform: 'Windows'
        },
        {
            key: '15',
            name: 'SCH 1',
            screenshot: packImg,
            schedule: 'Schedule A',
            location: 'Kuala Lumpur',
            pixel: '800x600',
            ip: 'Landscape',
            version: '1.1.6.57',
            freeSpace: '96 / 111.3G',
            lastActive: '22/05/23 09:07:24',
            status: {label: 'Active', color: 'green'},
            platform: 'Windows'
        },
        {
            key: '16',
            name: 'SCH 2',
            screenshot: watchImg,
            schedule: 'Schedule B',
            location: 'Petaling Jaya',
            pixel: '1920x1080',
            ip: 'Portrait',
            version: '1.1.6.57',
            freeSpace: '12.1/29.5G',
            lastActive: '22/05/23 09:07:24',
            status: {label: 'Active', color: 'green'},
            platform: 'Windows'
        },
        {
            key: '17',
            name: 'SCH 1',
            screenshot: packImg,
            schedule: 'Schedule A',
            location: 'Kuala Lumpur',
            pixel: '800x600',
            ip: 'Landscape',
            version: '1.1.6.57',
            freeSpace: '96 / 111.3G',
            lastActive: '22/05/23 09:07:24',
            status: {label: 'Active', color: 'green'},
            platform: 'Windows'
        },
        {
            key: '18',
            name: 'SCH 2',
            screenshot: watchImg,
            schedule: 'Schedule B',
            location: 'Petaling Jaya',
            pixel: '1920x1080',
            ip: 'Portrait',
            version: '1.1.6.57',
            freeSpace: '12.1/29.5G',
            lastActive: '22/05/23 09:07:24',
            status: {label: 'Active', color: 'green'},
            platform: 'Windows'
        },
    ];

    const items = [
        getItem('Folder', 'sub1', <AppstoreOutlined />, [
            getItem('Sub Folder', '1'),
            getItem('Sub Folder', '2'),
        ]),
        getItem(<div className='d-flex align-center j-c-space-between'><p>Menu</p><Badge count={13} /></div>, 'sub2', <AppstoreOutlined />),
        getItem(<div className='d-flex align-center j-c-space-between pr-20'><p>Menu</p><Badge count={5} /></div>, 'sub4', <AppstoreOutlined />, [
            getItem('Sub Menu 1', '9'),
            getItem('Sub Menu 2', '10')
        ]),
    ];

    const fileTypes = ['Online', 'Offline', 'Windows', 'webOS', 'Android', 'Tizen', 'Enabled', 'Disabled'];
    const checkAll = fileTypes.length === checkedList.length;
    const indeterminate = checkedList.length > 0 && checkedList.length < fileTypes.length;

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

    const onClickMenu = (e) => {
      console.log('click------------------ ', e);
    };

    const handleCardContextMenu = (event) => {
        event.preventDefault();
        setCardContextMenu(
            cardContextMenu === null
            ? {
                mouseX: event.clientX + 2,
                mouseY: event.clientY - 6,
              }
            : 
              null,
        );
    };

    const handleMenuContextMenu = (event) => {
        event.preventDefault();
        setMenuContextMenu(
            menuContextMenu === null
            ? {
                mouseX: event.clientX + 2,
                mouseY: event.clientY - 6,
              }
            : 
              null,
        );
    };
    
    const closeContext = () => {
        setCardContextMenu(null);
        setMenuContextMenu(null);
    };

    const getPlatformColor = (platform) => {
        if (platform === 'Windows') {
            return 'blue';
        } else if (platform === 'Android') {
            return 'green';
        } else if (platform === 'webOS') {
            return 'orange'
        } else if (platform === 'Tizen') {
            return 'grey';
        } else {
            return 'black';
        }
    }

    const resetFilter = () => {
        setCheckedList([]);
    }

    return (
        <>
            <div className="player-page">
                <Card className='table-card'>
                    <div className='d-flex align-center j-c-space-between top-section'>
                        <p className='card-title'>Player</p>
                        <div className='d-flex align-center'>
                            <Input placeholder="search..." prefix={<SearchOutlined />}  className='search-input'/>       
                            { viewMode !== 'list' && <Select
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
                            />}
                            <Button className='filter-btn' onClick={() => setFilterShow(true)}>
                                <div className='d-flex align-center'>
                                    <span className="material-symbols-outlined">tune</span><span>&nbsp;&nbsp;Filters</span>
                                </div>
                            </Button>
                            <Button className='view-mode-btn' type='primary' onClick={toggleViewMode}>{viewMode === 'list' ? <div className='d-flex align-center j-c-center'><span className="material-symbols-outlined">grid_view</span>Thumb View</div> : <div className='d-flex align-center j-c-center'><span className="material-symbols-outlined">lists</span>List View</div>}</Button>    
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
                                <Row className='border-row'>
                                    <Col span={4} style={{paddingLeft: '20px'}}>
                                        <p className='sub-title'>Location</p>
                                        <div onContextMenu={handleMenuContextMenu} style={{ cursor: 'context-menu' }}>
                                            <Menu
                                                onClick={onClickMenu}
                                                style={{
                                                    width: 256,
                                                }}
                                                defaultOpenKeys={['sub1']}
                                                items={items}
                                                mode="inline"
                                                className='media-filter-menu'
                                                selectable={false}
                                            />
                                            <ContextMenu
                                                open={menuContextMenu !== null}
                                                onClose={closeContext}
                                                anchorReference="anchorPosition"
                                                anchorPosition={
                                                    menuContextMenu !== null
                                                    ? { top: menuContextMenu.mouseY, left: menuContextMenu.mouseX }
                                                    : undefined
                                                }
                                                className='context-menu'
                                            >
                                                <MenuItem onClick={closeContext}>New Folder</MenuItem>
                                                <MenuItem onClick={closeContext}>Rename</MenuItem>
                                                <MenuItem onClick={closeContext}>Delete</MenuItem>
                                            </ContextMenu>
                                        </div>
                                    </Col>
                                    <Col span={19} offset={1} style={{height: '100%'}}>
                                        <p className='sub-title'>All Location</p>
                                        <Row gutter={[10, 10]} style={{height: 'calc(100% - 38px)', overflowY: 'auto', paddingRight: '10px'}}>
                                            {
                                                playerData.length > 0 && playerData.map(player => 
                                                    <>
                                                        <Col span={4}>
                                                            <div onContextMenu={handleCardContextMenu} style={{ cursor: 'context-menu' }}>
                                                                <Card 
                                                                    className='player-card'
                                                                    style={{backgroundImage: 'url(' + player.screenshot + ')'}}
                                                                >
                                                                    <Checkbox style={{marginLeft: '5px'}}></Checkbox>
                                                                    <Tag label={player.platform} color={getPlatformColor(player.platform)}/>
                                                                </Card>
                                                                <ContextMenu
                                                                    open={cardContextMenu !== null}
                                                                    onClose={closeContext}
                                                                    anchorReference="anchorPosition"
                                                                    anchorPosition={
                                                                        cardContextMenu !== null
                                                                        ? { top: cardContextMenu.mouseY, left: cardContextMenu.mouseX }
                                                                        : undefined
                                                                    }
                                                                    className='context-menu'
                                                                >
                                                                    <MenuItem onClick={closeContext}>Rename</MenuItem>
                                                                    <MenuItem onClick={() => {closeContext(); setMoveToShow(true);}}>Move to</MenuItem>
                                                                    <MenuItem onClick={closeContext}>Download</MenuItem>
                                                                    <MenuItem onClick={closeContext}>Settings</MenuItem>
                                                                    <MenuItem onClick={closeContext}>Delete</MenuItem>
                                                                </ContextMenu>
                                                            </div>
                                                            <div className='d-flex align-center j-c-space-between'>
                                                                <p className='name'>{player.name}</p>
                                                                <div className='d-flex align-center'>
                                                                    <span className="material-symbols-outlined" onClick={() => editPlayerData(player)}>edit</span>
                                                                    <div className='d-flex align-center status-icons'>
                                                                        <span class="material-symbols-outlined">cloud_upload</span>
                                                                        <span class="material-symbols-outlined">wifi</span>
                                                                        <span class="material-symbols-outlined">check_circle</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </>
                                                )
                                            }
                                        </Row>
                                    </Col>
                                </Row>
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
                <p className='select-label'>#Tag</p>
                <Input className='grey-input' />
                <p className='select-label'>Display (Commercial display only)</p>
                <Select
                    value={displaySelect}
                    options={[
                        {
                            value: '',
                            label: ''
                        },
                        {
                            value: 'lgvl5g',
                            label: 'LG VL5G Series'
                        }
                    ]}
                    onChange={(e) => setDisplaySelect(e)}
                />
                {
                    displaySelect !== '' &&
                    <Row gutter={10}>
                        <Col span={12}>
                            <p className='select-label'>Check Interval (Seconds)</p>
                            <Select
                                options={[
                                    {
                                        value: '',
                                        label: ''
                                    }
                                ]}
                            />
                        </Col>
                        <Col span={12}></Col>
                        <Col span={12}>
                            <p className='select-label'>Default Brightness (0-100)</p>
                            <Select
                                options={[
                                    {
                                        value: '',
                                        label: ''
                                    }
                                ]}
                            />
                        </Col>
                        <Col span={12}>
                            <p className='select-label'>Default Contrast (0-100)</p>
                            <Select
                                options={[
                                    {
                                        value: '',
                                        label: ''
                                    }
                                ]}
                            />
                        </Col>
                        <Col span={12}>
                            <p className='select-label'>Default Input</p>
                            <Select
                                options={[
                                    {
                                        value: '',
                                        label: ''
                                    }
                                ]}
                            />
                        </Col>
                        <Col span={12}>
                            <p className='select-label'>Default Volume (0-100)</p>
                            <Select
                                options={[
                                    {
                                        value: '',
                                        label: ''
                                    }
                                ]}
                            />
                        </Col>
                        <Col span={12}>
                            <p className='select-label'>Power On Timer</p>
                            <Select
                                options={[
                                    {
                                        value: '',
                                        label: ''
                                    }
                                ]}
                            />
                        </Col>
                        <Col span={12}>
                            <p className='select-label'>Power Off Timer</p>
                            <Select
                                options={[
                                    {
                                        value: '',
                                        label: ''
                                    }
                                ]}
                            />
                        </Col>
                        <Col span={24}>
                            <p className='select-label'>Power On Days</p> 
                        </Col>
                        <Col span={6} className='text-left'>
                            <Checkbox>Monday</Checkbox>
                        </Col>
                        <Col span={6} className='text-left'>
                            <Checkbox>Tuesday</Checkbox>
                        </Col>
                        <Col span={6} className='text-left'>
                            <Checkbox>Wednesday</Checkbox>
                        </Col>
                        <Col span={6} className='text-left'>
                            <Checkbox>Thursday</Checkbox>
                        </Col>
                        <Col span={6} className='text-left'>
                            <Checkbox>Friday</Checkbox>
                        </Col>
                        <Col span={6} className='text-left'>
                            <Checkbox>Saturday</Checkbox>
                        </Col>
                        <Col span={6} className='text-left'>
                            <Checkbox>Sunday</Checkbox>
                        </Col>
                    </Row>
                }
                <Button type='primary' onClick={() => setEditShow(false)}>Save</Button>
                <Button className='modal-cancel-button' onClick={() => setEditShow(false)}>Cancel</Button>
            </Modal>
            
            <Modal
                title='Move To'
                centered
                open={moveToShow}
                onCancel={() => setMoveToShow(false)}
                footer={false}
                className='edit-player-modal'
            >
                <p className='select-label'>Group</p>
                <Select
                    defaultValue='group1'
                    options={[
                        {
                            value: 'group1',
                            label: 'group 1'
                        },
                        {
                            value: 'group2',
                            label: 'group 2'
                        },
                        {
                            value: 'group3',
                            label: 'group 3'
                        }
                    ]}
                />
                <Button type='primary' onClick={() => setMoveToShow(false)}>Save</Button>
                <Button className='modal-cancel-button' onClick={() => setMoveToShow(false)}>Cancel</Button>
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
                className='filter-modal'
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

export default Player;
