import React, {useState} from 'react';
import { Button, Card, Space, Select, Input, Row, Col, Modal, DatePicker, Tree, TimePicker, Checkbox } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Tag from '../../components/tag';
import Table from '../../components/table';
import './schedule.scss';

const { RangePicker } = DatePicker;

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const Schedule = () => {

    const [newShow, setNewShow] = useState(false);
    const [detailShow, setDetailShow] = useState(false);
    const [playListDuration, setPlayListDuration] = useState('Daily');
    const [playList, setPlayList] = useState([
        {
            id: 'Playlist 1',
            name: 'Playlist 1',
            timeRange: '09:00:00 to 17:00:00',
            duration: 'Daily',
            period: 'Everyday'
        },
        {
            id: 'Playlist 2',
            name: 'Playlist 2',
            timeRange: '09:00:00 to 17:00:00',
            duration: 'Weekly',
            period: 'Tues, Wed'
        },
        {
            id: 'Playlist 3',
            name: 'Playlist 3',
            timeRange: '09:00:00 to 17:00:00',
            duration: 'Monthly',
            period: '2 Days (3, 4th)'
        },
        {
            id: 'Playlist 4',
            name: 'Playlist 4',
            timeRange: '09:00:00 to 17:00:00',
            duration: 'Date',
            period: '22-5-2023 to 25-5-2023'
        },
    ]);

    const scheduleColumns = [
        {
            title: 'Name',
            dataIndex: 'name'
        },
        {
            title: 'Location',
            dataIndex: 'location'
        },
        {
            title: '#Tag',
            dataIndex: 'tag'
        },
        {
            title: 'By User',
            dataIndex: 'user',
            render: (user) => <><p className='black-text'>{user.name}</p><p className='small-text'>{user.email}</p></>,
        },
        {
            title: 'Start - End Date',
            dataIndex: 'dateRange',        
            render: (dateRange) => <p>{dateRange[0] + ' - ' + dateRange[1]}</p>,
        },
        {
            title: 'Start - End Time',
            dataIndex: 'timeRange',        
            render: (timeRange) => <p>{timeRange[0] + ' - ' + timeRange[1]}</p>,
        },
        {
            title: 'Priority',
            dataIndex: 'priority'
        },
        {
            title: 'Status',
            dataIndex: 'status',        
            render: (status) => <Tag label={status.label} color={status.color}/>
        },
        {
            title: 'Action',
            dataIndex: 'actino',
            render: (_, record) => (
              <Space size="small">
                <span className="material-symbols-outlined" onClick={() => editSchedule(record)}>edit</span>
              </Space>
            ),
        }
    ];
    
    const scheduleData = [
        {
            key: '1',
            name: 'Schedule 1',
            location: 'Ballroom',
            tag: '#Event #Sponsor',
            user: {name: 'John Bushmill', email: 'Johnb@mail.com'},
            dateRange: ['3/12/2023', '8/8/2024'],
            timeRange: ['6:00:00', '14:00:00'],
            priority: '10',
            status: {label: 'Active', color: 'green'}
        },
        {
            key: '2',
            name: 'Schedule 2',
            location: 'Mutiara',
            tag: '#GM',
            user: {name: 'Ilham Budi A', email: 'ilahmbudi@mail.com'},
            dateRange: ['3/8/2023', '8/8/2023'],
            timeRange: ['15:00:00', '19:00:00'],
            priority: '10',
            status: {label: 'Active', color: 'green'}
        },
    ];

    const locationsTree = [
        {
            title: 'Kuala Lumpur',
            key: '0-0'
        },
        {
            title: 'Pulau Pinang',
            key: '1-0'
        },
        {
            title: 'Johor Baharu',
            key: '2-0'
        },
        {
            title: 'Ipoh',
            key: '3-0'
        },
        {
            title: 'Selangor',
            key: '4-0',
            children: [
                {
                    title: 'Petaling Jaya',
                    key: '4-0-0'
                }, {
                    title: 'Puchong',
                    key: '4-0-1'
                }
            ]
        },
    ];

    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const days = new Array(32).fill(0);

    const editSchedule = (schedule) => {
        setNewShow(true);
    }

    const editPlayList = (pl) => {
        setPlayListDuration(pl.duration);
        setDetailShow(true);
    }

    const onDragEnd = (result) => {
        // dropped outside the list
        if (!result.destination) {
          return;
        }
    
        const tempItems = reorder(
            playList,
            result.source.index,
            result.destination.index
        );
        setPlayList(tempItems);
    }

    return (
        <>
            <div className="schedule-page">
                <Card className='table-card'>
                    <div className='d-flex align-center j-c-space-between top-section'>
                        <p className='card-title'>Schedule</p>
                    </div>
                    <Table
                        columns={scheduleColumns}
                        dataSource={scheduleData}
                    />
                </Card>
            </div> 
            
            <Modal
                title='Schedule'
                centered
                open={newShow}
                onCancel={() => setNewShow(false)}
                footer={false}
                className='create-schedule-modal'
            >   
                <Row gutter={10} justify='space-between'>
                    <Col span={16}>
                        <Card>
                            <p className='sub-title'>Schedule Details</p>
                            <Row gutter={10}>
                                <Col span={10}>
                                    <p className='select-label'>Name</p>
                                    <Input className='grey-input' placeholder='name...' />
                                </Col>
                                <Col span={5}>
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
                                <Col span={5}>
                                    <p className='select-label'>Priority</p>
                                    <Select
                                        options={[
                                            {
                                                value: '10',
                                                label: '10'
                                            },
                                            {
                                                value: '20',
                                                label: '20'
                                            },
                                            {
                                                value: '30',
                                                label: '30'
                                            }
                                        ]}
                                    />
                                </Col>
                            </Row>
                            <Row gutter={10}>
                                <Col span={10}>
                                    <Row justify='space-between' gutter={10}>
                                        <Col span={12}>
                                            <p className='select-label'>Start Date*</p>
                                            <DatePicker />
                                        </Col>
                                        <Col span={12}>
                                            <p className='select-label'>End Date*</p>
                                            <DatePicker />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row gutter={10}>
                                <Col span={8}>
                                    <p className='select-label'>Loop Playlists (Sequential Mode)</p>
                                    <Select
                                        options={[
                                            {
                                                value: 'Yes',
                                                label: 'Yes'
                                            },
                                            {
                                                value: 'No',
                                                label: 'No'
                                            }
                                        ]}
                                    />
                                </Col>
                            </Row>
                            <p className='select-label'>#Tag</p>
                            <Input className='grey-input' defaultValue='#Promo #ABC'/>
                            <Button type='primary' className='add-button' onClick={() => setDetailShow(true)}><span className="material-symbols-outlined">add</span>Playlist</Button>
                            <div className='playlist-section'>
                                <DragDropContext onDragEnd={onDragEnd}>
                                    <Droppable droppableId="droppable">
                                        {(provided, snapshot) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                            >
                                                {playList.map((item, index) => (
                                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                            >
                                                                <div className='playlist-drag-item'>
                                                                    <div className='d-flex align-center'>
                                                                        <span className="material-symbols-outlined" {...provided.dragHandleProps}>drag_indicator</span>
                                                                        <p className='playlist-name'>{item.name}</p>
                                                                        <p className='playlist-time-range'>{item.timeRange}</p>
                                                                        <p className='playlist-duration'><span>{item.duration}: </span>{item.period}</p>
                                                                    </div>
                                                                    <span className="material-symbols-outlined" onClick={() => editPlayList(item)}>edit</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </div>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <p className='sub-title'>Locations</p>
                            <Input placeholder="search..." prefix={<SearchOutlined />}  className='search-input'/>
                            <Tree
                                checkable
                                selectable={false}
                                defaultExpandAll
                                treeData={locationsTree}
                                className='location-tree'
                            />
                        </Card>
                    </Col>
                </Row>
                <Button type='primary' className='save-button' onClick={() => setNewShow(false)}>Save Schedule</Button>
                <Button className='modal-cancel-button' onClick={() => setNewShow(false)}>Cancel</Button>
            </Modal>
            
            
            <Modal
                title='Playlist Details'
                centered
                open={detailShow}
                onCancel={() => setDetailShow(false)}
                footer={false}
                className='create-schedule-modal playlist-modal'
            >
                <Row gutter={10}>
                    <Col span={12}>
                        <p className='select-label'>Playlist*</p>
                        <Select
                            placeholder='Select...'
                            options={[
                                {
                                    value: 'Playlist 1',
                                    label: 'Playlist 1'
                                },
                                {
                                    value: 'Playlist 2',
                                    label: 'Playlist 2'
                                },
                                {
                                    value: 'Playlist 3',
                                    label: 'Playlist 3'
                                }
                            ]}
                        />
                    </Col>
                </Row>
                <Row justify='space-between' gutter={10}>
                    <Col span={12}>
                        <p className='select-label'>Start Time*</p>
                        <TimePicker />
                    </Col>
                    <Col span={12}>
                        <p className='select-label'>End Time*</p>
                        <TimePicker />
                    </Col>
                </Row>
                <Row gutter={10}>
                    <Col span={11}>
                        <p className='select-label'>Playlist*</p>
                        <Select
                            value={playListDuration}
                            options={[
                                {
                                    value: 'Daily',
                                    label: 'Daily'
                                },
                                {
                                    value: 'Weekly',
                                    label: 'Weekly'
                                },
                                {
                                    value: 'Monthly',
                                    label: 'Monthly'
                                },
                                {
                                    value: 'Date',
                                    label: 'Date Selection'
                                }
                            ]}
                            onChange={(e) => setPlayListDuration(e)}
                        />
                    </Col>
                    <Col span={6}>
                        <p className='select-label'>Play once every</p>
                        <div className='d-flex align-center'>
                            <Select
                                defaultValue='1'
                                options={[
                                    {
                                        value: '1',
                                        label: '1'
                                    },
                                    {
                                        value: '2',
                                        label: '2'
                                    },
                                    {
                                        value: '3',
                                        label: '3'
                                    },
                                    {
                                        value: '4',
                                        label: '4'
                                    }
                                ]}
                            />
                            <p className='select-label' style={{marginBottom: '19px', marginLeft: '10px'}}>days</p>
                        </div>
                    </Col>
                </Row>
                {
                    playListDuration === 'Weekly' && <div>
                        {
                            weekDays.map(day => <Checkbox>{day}</Checkbox>)
                        }
                    </div>
                }
                {
                    playListDuration === 'Date' && <Row>
                        <Col span={12}>
                            <p className='select-label'>Select Date</p>
                            <RangePicker />
                        </Col>
                    </Row>
                }
                {
                    playListDuration === 'Monthly' && <div>
                        <Row>
                            <Col offset={7}>
                                <p className='select-label'>Days</p>
                            </Col>
                        </Row>
                        <Row justify='space-between'>
                            <Col span={6}>
                                {
                                    months.map(month => <Checkbox>{month}</Checkbox>)
                                }
                            </Col>
                            <Col span={17} offset={1}>
                                <div>
                                    <Row>
                                        {
                                            days.map((item, i) => <Col span={4} offset={i%5 !== 0 && 1}><Checkbox>{i < 31 ? i + 1 : 'Last'}</Checkbox></Col>)
                                        }
                                    </Row>
                                    <p className='text-center select-label' style={{margin: '9px 0'}}>OR, On</p>
                                    <Row>
                                        <Col span={4}><Checkbox>1st</Checkbox></Col>
                                        <Col span={4} offset={1}><Checkbox>2nd</Checkbox></Col>
                                        <Col span={4} offset={1}><Checkbox>3rd</Checkbox></Col>
                                        <Col span={4} offset={1}><Checkbox>4th</Checkbox></Col>
                                        <Col span={4} offset={1}><Checkbox>5th</Checkbox></Col>
                                    </Row>
                                    <p className='text-center select-label' style={{marginBottom: '15px'}}>+</p>
                                    <Row>
                                        {
                                            weekDays.map((day, i) => <Col span={5} offset={i%4 !== 0 && 1}><Checkbox>{day.slice(0, 3)}</Checkbox></Col>)
                                        }
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </div>
                }
                <Button type='primary' onClick={() => setDetailShow(false)}>OK</Button>
                <Button className='modal-cancel-button' onClick={() => setDetailShow(false)}>Cancel</Button>
            </Modal>
        </>
    );
}

export default Schedule;
