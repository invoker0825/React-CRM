import React, { useState, useEffect } from 'react';
import { Button, Card, Space, Select, Input, Row, Col, Modal, DatePicker, Tree, TimePicker, Checkbox, notification } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from 'axios';
import dayjs from 'dayjs';
import Tag from '../../components/tag';
import Table from '../../components/table';
import './schedule.scss';

const { RangePicker } = DatePicker;
const { Option } = Select;

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const Schedule = () => {

    const [newShow, setNewShow] = useState(false);
    const [detailShow, setDetailShow] = useState(false);
    const [play24, setPlay24] = useState(false);
    const [playForever, setPlayForever] = useState(false);
    const [playListTime, setPlayListTime] = useState({start: null, end: null});
    const [playListDuration, setPlayListDuration] = useState('Daily');
    const [api, contextHolder] = notification.useNotification();
    const [locationData, setLocationData] = useState([]);
    const [currentUser, setCurrentUser] = useState('');
    const [tags, setTags] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [scheduleData, setScheduleData] = useState([]);
    const [filteredScheduleData, setFilteredScheduleData] = useState([]);
    const [newScheduleData, setNewScheduleData] = useState([]);
    const [mode, setMode] = useState('');
    const [playListData, setPlayListData] = useState('');

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
            dataIndex: 'Name'
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
            dataIndex: 'CreatedBy',
            render: (CreatedBy) => <><p className='black-text'>{CreatedBy}</p><p className='small-text'>{CreatedBy}</p></>,
        },
        {
            title: 'Start - End Date',
            dataIndex: 'dateRange',        
            render: (_, record) => <p>{record.StartTime.split('T')[0].replaceAll('-', '/') + ' - ' + record.EndTime.split('T')[0].replaceAll('-', '/')}</p>,
        },
        {
            title: 'Start - End Time',
            dataIndex: 'timeRange',        
            render: (_, record) => <p>{record.StartTime.split('T')[1].split('.')[0] + ' - ' + record.EndTime.split('T')[1].split('.')[0]}</p>,
        },
        {
            title: 'Priority',
            dataIndex: 'Priority'
        },
        {
            title: 'Status',
            dataIndex: 'status',        
            // render: (status) => <Tag label={status.label} color={status.color}/>
        },
        {
            title: 'Action',
            dataIndex: 'actino',
            render: (_, record) => (
              <Space size="small">
                <span className="material-symbols-outlined" onClick={() => {setNewScheduleData(record); setNewShow(true); setMode('edit');}}>edit</span>
              </Space>
            ),
        }
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

    useEffect(() => {
        setCurrentUser(JSON.parse(localStorage.getItem('loggedUser')));
        axios.get('http://localhost:5001/api/playlist')
        .then((res) => {
            if (res.status === 200) {
                res.data.sort((a, b) => {
                    const nameA = a.Name.toUpperCase();
                    const nameB = b.Name.toUpperCase();
                    
                    if (nameA < nameB) {
                        return -1;
                    } else if (nameA > nameB) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                setPlayListData(res.data);
            }
        }).catch((err) => {
            console.log('err-------------', err)
        });
        
        axios.get('http://localhost:5001/api/location')
        .then((res) => {
            if (res.status === 200) {
                setLocationData(res.data);
                let tempLocatoin = res.data;

                axios.get('http://localhost:5001/api/tag')
                .then((tagRes) => {
                    if (tagRes.status === 200) {
                        setTags(tagRes.data);
        
                        axios.get('http://localhost:5001/api/schedule')
                        .then((res) => {
                            if (res.status === 200) {
                                let temp = [];
                                res.data.forEach(d => {
                                    let tempTags = [];
                                    let tempLocations = [];
                                    d.Tag.length > 0 && d.Tag.forEach(t => {
                                        tempTags.push('#' + tagRes.data.filter(tag => tag.ID === t)[0].Name);
                                    })
                                    d.Location.length > 0 && d.Location.forEach(l => {
                                        tempLocations.push(tempLocatoin.filter(location => location.ID === l)[0].Name);
                                    })
                                    temp.push({...d, tag: tempTags.join(' '), location: tempLocations.join(', ')});
                                })
                                let tempSchedules = [];
                                let tempName = [];
                                temp.forEach(t => {
                                    if (!tempName.includes(t.Name)) {
                                        let tempSchedule = [];
                                        temp.filter(te => te.Name === t.Name).forEach(f => {
                                            tempSchedule.push({PlaylistMasterID: f.PlaylistMasterID, Frequency: f.Frequency, Sequence: f.Sequence});
                                        })
                                        tempSchedule.sort((a, b) => a.Sequence - b.Sequence);
                                        tempSchedules.push({...t, Playlist: tempSchedule});
                                        tempName.push(t.Name);
                                    }
                                })
                                tempSchedules.sort((a, b) => {
                                    const nameA = a.Name.toUpperCase();
                                    const nameB = b.Name.toUpperCase();
                                  
                                    if (nameA < nameB) {
                                      return -1;
                                    } else if (nameA > nameB) {
                                      return 1;
                                    } else {
                                      return 0;
                                    }
                                });
                                console.log('======================>>>>>>>>>>>>>>>>>>>>>>', tempSchedules)
                                setScheduleData(tempSchedules);
                                setFilteredScheduleData(tempSchedules);
                                setSearchText('');
                            }
                        }).catch((err) => {
                            console.log('err-------------', err)
                        });
                    }
                }).catch((err) => {
                    console.log('err-------------', err)
                });
            }
        }).catch((err) => {
            console.log('err-------------', err)
        });
    }, []);

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

    const disabledHours = () => {
        const hours = [];    
        for (let i = 0; i < playListTime.start?.$H; i++) {
          hours.push(i);
        }    
        return hours;
    };

    const disabledMinutes = (selectedHour) => {
        const minutes = [];
        if (selectedHour === playListTime.start?.$H) {
            for (let i = 0; i < playListTime.start.$m; i++) {
            minutes.push(i);
            }
        }
        return minutes;
    };

    const disabledSeconds = (selectedHour, selectedMinute) => {
        const seconds = [];
        if (selectedHour === playListTime.start?.$H && selectedMinute === playListTime.start?.$m) {
            for (let i = 0; i <= playListTime.start.$s; i++) {
                seconds.push(i);
            }
        }
        return seconds;
    };

    const disabledTime = () => {
        return {disabledHours: disabledHours, disabledMinutes: disabledMinutes, disabledSeconds: disabledSeconds}
    }

    const changePlayListTime = (e, c) => {
        let temp = {...playListTime, [c]: e};
        setPlayListTime(temp);
    }

    const confirmSave = () => {
        Modal.confirm({
            title: 'Confirm',
            content: 'Are you sure you want to save?',
            onOk: saveSchedule,
            footer: (_, { OkBtn, CancelBtn }) => (
              <>
                <CancelBtn />
                <OkBtn/>
              </>
            ),
        });
    }

    const saveSchedule = () => {
        console.log('-----------------------', newScheduleData);
        // setNewShow(false);
    }

    const changeSearch = (e) => {
        setSearchText(e.target.value);
        let temp = [...scheduleData];
        setFilteredScheduleData(temp.filter(t => t.Name.toLowerCase().includes(e.target.value.toLowerCase())));
    }

    return (
        <>
            {contextHolder}
            <div className="schedule-page">
                <Card className='table-card'>
                    <div className='d-flex align-center j-c-space-between top-section'>
                        <p className='card-title'>Schedule</p>
                        <div className='d-flex align-center'>
                            <Input placeholder="search..." prefix={<SearchOutlined />} className='search-input' value={searchText} onChange={changeSearch}/>
                            <Button className='view-mode-btn' type='primary' onClick={() => {setNewScheduleData({Name: '', Priority: 1, Tag: [], StartTime: '', EndTime: '', CreatedBy: currentUser.Email, ModifiedBy: currentUser.Email, Playlist: [], LoopPlaylist: false, Location: []}); setNewShow(true); setMode('new');}}>
                                <div className='d-flex align-center j-c-center'>
                                    <span className="material-symbols-outlined">add</span>Schedule
                                </div>
                            </Button> 
                        </div>
                    </div>
                    <Table
                        columns={scheduleColumns}
                        dataSource={filteredScheduleData}
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
                                    <Input className='grey-input' value={newScheduleData.Name} onChange={(e) => setNewScheduleData((prevState) => ({ ...prevState, Name: e.target.value }))}/>
                                </Col>
                                <Col span={5}>
                                    <p className='select-label'>Priority</p>
                                    <Select
                                        value={newScheduleData.Priority ? newScheduleData.Priority : 1} 
                                        onChange={(e) => setNewScheduleData((prevState) => ({ ...prevState, Priority: e }))}
                                    >
                                        {
                                            new Array(20).fill(0).map((item, index) => {
                                                return <Option key={index + 1}>{index + 1}</Option>
                                            })
                                        }
                                    </Select>
                                </Col>
                            </Row>
                            <Row gutter={10}>
                                <Col span={5}>
                                    <p className='select-label'>Start Date*</p>
                                    <DatePicker disabled={playForever} />
                                </Col>
                                <Col span={5}>
                                    <p className='select-label'>End Date*</p>
                                    <DatePicker disabled={playForever} />
                                </Col>
                                <Col span={5}>
                                    <p className='select-label'>Start Time*</p>
                                    <TimePicker disabled={playForever} />
                                </Col>
                                <Col span={5}>
                                    <p className='select-label'>End Time*</p>
                                    <TimePicker disabled={playForever} />
                                </Col>
                            </Row>
                            <Row gutter={10}>
                                <Col span={6}>
                                    <Checkbox checked={playForever} onChange={() => setPlayForever(!playForever)}>Play Forever</Checkbox>
                                </Col>
                            </Row>
                            <Row gutter={10}>
                                <Col span={8}>
                                    <p className='select-label'>Loop Playlists (Sequential Mode)</p>
                                    <Select
                                        value={newScheduleData.LoopPlaylist ? newScheduleData.LoopPlaylist : false}
                                        onChange={(e) => setNewScheduleData((prevState) => ({ ...prevState, LoopPlaylist: e }))}
                                        options={[
                                            {
                                                value: true,
                                                label: 'Yes'
                                            },
                                            {
                                                value: false,
                                                label: 'No'
                                            }
                                        ]}
                                    />
                                </Col>
                            </Row>
                            <p className='select-label'>#Tag</p>
                            <Select
                                mode="tags"
                                value={newScheduleData.Tag}
                                onChange={(e) => setNewScheduleData((prevState) => ({ ...prevState, Tag: e }))}
                            >
                                {
                                    tags.map((item) => {
                                        return <Option defaultValue key={item.ID}>{item.Name}</Option>
                                    })
                                }
                            </Select>
                            <Button type='primary' className='add-button' onClick={() => setDetailShow(true)}><span className="material-symbols-outlined">add</span>Playlist</Button>
                            <div className='playlist-section'>
                                <DragDropContext onDragEnd={onDragEnd}>
                                    <Droppable droppableId="droppable">
                                        {(provided, snapshot) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                            >
                                                {newScheduleData.Playlist.length > 0 && newScheduleData.Playlist.map((item, index) => (
                                                    <Draggable key={item.PlaylistMasterID} draggableId={item.PlaylistMasterID} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                            >
                                                                <div className='playlist-drag-item'>
                                                                    <div className='d-flex align-center'>
                                                                        <span className="material-symbols-outlined" {...provided.dragHandleProps}>drag_indicator</span>
                                                                        <p className='playlist-name'>{JSON.parse(item.Frequency).playlists[0].Name}</p>
                                                                        <p className='playlist-time-range'>{JSON.parse(item.Frequency).start} to {JSON.parse(item.Frequency).end}</p>
                                                                        <p className='playlist-duration'><span>{JSON.parse(item.Frequency).occurrence}: </span>aaaa</p>
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
                <Button type='primary' className='save-button' onClick={confirmSave}>Save Schedule</Button>
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
                    <Col span={9}>
                        <p className='select-label'>Start Time*</p>
                        <TimePicker disabled={play24} value={play24 ? dayjs('00:00:00', 'HH:mm:ss') : playListTime?.start} onChange={(e) => changePlayListTime(e, 'start')}/>
                    </Col>
                    <Col span={9}>
                        <p className='select-label'>End Time*</p>
                        <TimePicker disabled={play24} value={play24 ? dayjs('23:59:59', 'HH:mm:ss') : playListTime?.end} onChange={(e) => changePlayListTime(e, 'end')} disabledTime={disabledTime}/>
                    </Col>
                    <Col span={6}>
                        <Checkbox className='hr-check' checked={play24} onChange={() => setPlay24(!play24)}>24 HR</Checkbox>
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
                </Row>
                <Row gutter={10}>
                    <Col span={8}>
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
