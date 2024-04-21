import React, { useState, useEffect } from 'react';
import { Button, Card, Space, Select, Modal, Input, Row, Col, Checkbox, Upload, Collapse, notification } from 'antd';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from 'axios';
import { SearchOutlined } from '@ant-design/icons';
import Tag from '../../components/tag';
import Table from '../../components/table';
import packImg from '../../assets/img/pack.png';
import watchImg from '../../assets/img/watch.png';
import './playlist.scss';

const { Dragger } = Upload;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

const panelData = [
    {
        name: 'Panel 1',
        duration: '00:06:00',
        number: '0'
    },
    {
        name: 'Panel 2',
        duration: '00:02:00',
        number: '3'
    },
    {
        name: 'Panel 3',
        duration: '00:06:00',
        number: '5'
    },
    {
        name: 'Panel 4',
        duration: '00:02:00',
        number: '8'
    },
    {
        name: 'Panel 5',
        duration: '00:06:00',
        number: '2'
    }
]

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
const colors = ['#ff80ed', '#065535', '#ff0000', '#ffd700', '#00ffff', '#0000ff', '#bada55', '#00ff00'];

const PlayList = () => {

    const [editShow, setEditShow] = useState(false);
    const [filterShow, setFilterShow] = useState(false);
    const [checkedList, setCheckedList] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [playListData, setPlayListData] = useState([]);
    const [filteredPlayListData, setFilteredPlayListData] = useState([]);
    const [newPlayList, setNewPlayList] = useState({Name: '', Tag: [], CreatedBy: '', ModifiedBy: '', Duration: 0});
    const [currentUser, setCurrentUser] = useState();
    const [mediaFilterData, setMediaFilterData] = useState([]);
    const [mediaData, setMediaData] = useState([]);
    const [api, contextHolder] = notification.useNotification();
    const [tags, setTags] = useState([]);
    const [mode, setMode] = useState('new');
    const [searchModalText, setSearchModalText] = useState('');
    const [searchText, setSearchText] = useState('');
    const [layoutData, setLayoutData] = useState([]);

    const fileTypes = [
        {
            label: 'Video',
            value: 1
        },
        {
            label: 'Picture',
            value: 2
        },
        {
            label: 'Stream',
            value: 6
        },
        {
            label: 'Powerpoint',
            value: 3
        },
        {
            label: 'Capture Card',
            value: 5
        }
    ];
    const checkAll = fileTypes.length === checkedList.length;
    const indeterminate = checkedList.length > 0 && checkedList.length < fileTypes.length;

    const imageList = [{src: watchImg, type: 'jpg'}, {src: packImg, type: 'png'}, {src: packImg, type: 'png'}, {src: packImg, type: 'png'}, {src: watchImg, type: 'jpg'}, {src: packImg, type: 'png'}, {src: watchImg, type: 'jpg'}, {src: packImg, type: 'png'}, {src: watchImg, type: 'jpg'}, {src: watchImg, type: 'jpg'}]

    const playListColumns = [
        {
            title: 'Name',
            dataIndex: 'Name',
            width: '300px'
        },
        {
            title: 'Layout',
            dataIndex: 'layout',
            render: (layout) => (
                layout ? <div className='table-layout' style={{width: `${layout.resolution.Width * 49.5 / layout.resolution.Height}px`}}>
                    {
                        layout.details.map((detail, i) => 
                            <div style={{width: `${detail.Width * 49.5 / layout.resolution.Height}px`, height: `${detail.Height * 49.5 / layout.resolution.Height}px`, left: `${detail.X * 49.5 / layout.resolution.Height}px`, top: `${detail.Y * 49.5 / layout.resolution.Height}px`, backgroundColor: `${colors[i]}`, position: 'absolute'}}></div>
                        )
                    }
                </div> : <></>
            )
        },
        {
            title: 'Duration',
            dataIndex: 'Duration'
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
            title: 'Status',
            dataIndex: 'Status',        
            render: (Status) => <>{Status === 1 ? <Tag label='Active' color='green'/> : <Tag label='Inactive' color='red'/>}</>,
            sorter: (a, b) => a.Status - b.Status,
        },
        {
            title: 'Action',
            dataIndex: 'actino',
            render: (_, record) => (
              <Space size="small">
                <span className="material-symbols-outlined" onClick={() => editPlayListData(record)}>edit</span>
              </Space>
            ),
        }
    ];

    useEffect(() => {
        setCurrentUser(JSON.parse(localStorage.getItem('loggedUser')));
        
        axios.get('http://localhost:5001/api/layout')
        .then((res) => {
            if (res.status === 200) {
                res.data.forEach(d => {
                    d.details.sort((a, b) => a.Panel - b.Panel);
                });
                setLayoutData(res.data);
                let tempLayout = res.data;

                axios.get('http://localhost:5001/api/tag')
                .then((tagRes) => {
                    if (tagRes.status === 200) {
                        setTags(tagRes.data);
        
                        axios.get('http://localhost:5001/api/playlist')
                        .then((res) => {
                            if (res.status === 200) {
                                let temp = [];
                                console.log('=============', tagRes.data)
                                res.data.forEach(d => {
                                    let tempTags = [];
                                    d.Tag.forEach(t => {
                                        tempTags.push('#' + tagRes.data.filter(tag => tag.ID === t)[0].Name);
                                    })
                                    temp.push({...d, tag: tempTags.join(' '), layout: tempLayout.filter(l => l.ID === d.LayoutMasterID)[0]});
                                })
                                temp.sort((a, b) => {
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
                                setPlayListData(temp);
                                setFilteredPlayListData(temp);
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
        
        axios.get('http://localhost:5001/api/media')
        .then((res) => {
            if (res.status === 200) {
                setMediaData(res.data);
                setMediaFilterData(res.data);
            }
        }).catch((err) => {
            console.log('err-------------', err)
        });

        let temp = new Array(panelData.length).fill([])
        setFileList(temp);
    }, []);

    const editPlayListData = (r) => {
        setMode('edit');
        setNewPlayList(r);
        setEditShow(true);
    }

    const onFileChange = (info, i) => {
        console.log(info.file.status)
        if (info.file.status === 'uploading') {
            let temp = [...fileList];
            temp[i] = info.fileList.map(file => ({...file}));
            console.log('-------------', temp)
            setFileList(temp.map(files => files.map(file => ({...file}))));
        }
        if (info.file.status === 'done') {
            let temp = [...fileList];
            temp[i] = info.fileList.map(file => ({...file}));
            console.log('================', temp)
            setFileList(temp.map(files => files.map(file => ({...file}))));
        }
    };

    const onDrop = (e) => {
    }

    const confirmSave = () => {
        Modal.confirm({
            title: 'Confirm',
            content: 'Are you sure you want to save?',
            onOk: savePlayList,
            footer: (_, { OkBtn, CancelBtn }) => (
              <>
                <CancelBtn />
                <OkBtn/>
              </>
            ),
        });
    }

    const savePlayList = () => {
        console.log('=========================', newPlayList)
        if (newPlayList.Name !== '') {
            if (mode === 'new') {
                axios.post('http://localhost:5001/api/playlist/add', newPlayList)
                .then((res) => {
                    if (res.status === 200) {
                        api.success({
                            message: 'Success',
                            description:
                            'The new report has been added successfully.',
                        });
                        setEditShow(false);

                        

                        axios.get('http://localhost:5001/api/tag')
                        .then((tagRes) => {
                            if (tagRes.status === 200) {
                                setTags(tagRes.data);
                                axios.get('http://localhost:5001/api/playlist')
                                .then((res) => {
                                    if (res.status === 200) {
                                        let temp = [];
                                        res.data.forEach(d => {
                                            let tempTags = [];
                                            d.Tag.forEach(t => {
                                                tempTags.push('#' + tagRes.data.filter(tag => tag.ID === t)[0].Name);
                                            })
                                            temp.push({...d, tag: tempTags.join(' '), layout: layoutData.filter(l => l.ID === d.LayoutMasterID)[0]});
                                        })
                                        temp.sort((a, b) => {
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
                                        setPlayListData(temp);
                                        setFilteredPlayListData(temp);
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
            } else {
                axios.post('http://localhost:5001/api/playlist/delete', newPlayList)
                .then((res) => {
                    if (res.status === 200) {
                        console.log('deleteres----------------', res)
                        axios.post('http://localhost:5001/api/playlist/add', newPlayList)
                        .then((res) => {
                            if (res.status === 200) {
                                api.success({
                                    message: 'Success',
                                    description:
                                    'The new report has been updated successfully.',
                                });
                                setEditShow(false);

                                axios.get('http://localhost:5001/api/tag')
                                .then((tagRes) => {
                                    if (tagRes.status === 200) {
                                        setTags(tagRes.data);
                                        axios.get('http://localhost:5001/api/playlist')
                                        .then((res) => {
                                            if (res.status === 200) {
                                                let temp = [];
                                                res.data.forEach(d => {
                                                    let tempTags = [];
                                                    d.Tag.forEach(t => {
                                                        tempTags.push('#' + tagRes.data.filter(tag => tag.ID === t)[0].Name);
                                                    })
                                                    temp.push({...d, tag: tempTags.join(' '), layout: layoutData.filter(l => l.ID === d.LayoutMasterID)[0]});
                                                })
                                                temp.sort((a, b) => {
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
                                                setPlayListData(temp);
                                                setFilteredPlayListData(temp);
                                                setSearchText('');
                                            }
                                        }).catch((err) => {
                                            console.log('err-------------', err)
                                        });
                                    }
                                }).catch((err) => {
                                    console.log('err-------------', err)
                                });
                            } else {
                                console.log('addres----------------', res)

                            }
                        }).catch((err) => {
                            console.log('err-------------', err)
                        });
                    }
                }).catch((err) => {
                    console.log('err-------------', err)
                });
            }
        } else {
            api.error({
                message: 'Error',
                description:
                  'Check for missing fields.',
            });
        }
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
        setCheckedList(e.target.checked ? fileTypes.map(type => {return type.value}) : []);
    };

    const resetFilter = () => {
        setCheckedList([]);
    }

    const onDragEnd = (result, i) => {
        if (!result.destination) {
          return;
        }
    
        const tempItems = reorder(
            fileList[i],
            result.source.index,
            result.destination.index
        );
        let temp = [...fileList]
        temp[i] = tempItems
        setFileList(temp);
    }

    const removeFile = (pIndex, i) => {
        let temp = [...fileList];
        temp[pIndex].splice(i, 1);
        setFileList(temp);
    }

    const applyFilter = () => {
        let temp = mediaData.filter(m => checkedList.includes(m.TypeID));
        searchModalText !== '' ? setMediaFilterData([...temp.filter(t => t.Filename.toLowerCase().includes(searchModalText.toLowerCase()))]) : setMediaFilterData([...temp]);
        setFilterShow(false);
    }

    const changeModalSearch = (e) => {
        setSearchModalText(e.target.value);
        let temp = checkedList.length > 0 ? mediaData.filter(m => checkedList.includes(m.TypeID)) : [...mediaData];
        e.target.value !== '' ? setMediaFilterData([...temp.filter(t => t.Filename.toLowerCase().includes(e.target.value.toLowerCase()))]) : setMediaFilterData([...temp]);
    }

    const changeSearch = (e) => {
        setSearchText(e.target.value);
        let temp = [...playListData];
        e.target.value !== '' ? setFilteredPlayListData([...temp.filter(t => t.Name.toLowerCase().includes(e.target.value.toLowerCase()))]) : setFilteredPlayListData([...temp]);
    }

    return (
        <>
            {contextHolder}
            <div className="playlist-page">
                <Card className='table-card'>
                    <div className='d-flex align-center j-c-space-between top-section'>
                        <p className='card-title'>Playlist</p>
                        <div className='d-flex align-center'>
                            <Input placeholder="search..." prefix={<SearchOutlined />} className='search-input' value={searchText} onChange={changeSearch}/>
                            <Button className='view-mode-btn' type='primary' onClick={() => {setNewPlayList({Name: '', Tag: [], CreatedBy: currentUser.Email, ModifiedBy: currentUser.Email, Duration: 0}); setEditShow(true); setMode('new');}}>
                                <div className='d-flex align-center j-c-center'>
                                    <span className="material-symbols-outlined">add</span>Playlist
                                </div>
                            </Button> 
                        </div>
                    </div>
                    <Table
                        columns={playListColumns}
                        dataSource={filteredPlayListData}
                    />
                </Card>
            </div>
            
            <Modal
                title='Playlist'
                centered
                open={editShow}
                onCancel={() => setEditShow(false)}
                footer={false}
                className='edit-playlist-modal'
            >
                <Card style={{marginBottom: '17px'}}>
                    <p className='sub-title'>Playlist Details</p>
                    <Row gutter={10} align='bottom'>
                        <Col span={4}>
                            <p className='select-label'>Name</p>
                            <Input className='grey-input' value={newPlayList.Name} onChange={(e) => setNewPlayList((prevState) => ({ ...prevState, Name: e.target.value }))}/>
                        </Col>
                        <Col span={5}>
                            <p className='select-label'>Layout</p>
                            <Select
                                value={newPlayList.layout ? newPlayList.layout.ID : ''} 
                                onChange={(e) => setNewPlayList((prevState) => ({ ...prevState, layout: layoutData.filter(l => l.ID === e)[0] }))}
                            >
                                {
                                    layoutData.map((item) => {
                                        return <Option defaultValue key={item.ID}>{item.Name}</Option>
                                    })
                                }
                            </Select>
                        </Col>
                        <Col span={11} offset={1}>
                            <Checkbox>Hide Locked Panel</Checkbox>
                        </Col>
                    </Row>
                    <p className='select-label'>#Tag</p>
                    <Select
                        mode="tags"
                        value={newPlayList.Tag}
                        onChange={(e) => setNewPlayList((prevState) => ({ ...prevState, Tag: e }))}
                    >
                        {
                            tags.map((item) => {
                                return <Option defaultValue key={item.ID}>{item.Name}</Option>
                            })
                        }
                    </Select>
                </Card>
                <Row gutter={10}>
                    <Col span={18} className='left-section'>
                        {
                            newPlayList.layout && newPlayList.layout.details.map((pData, pIndex) => 
                                <Card>
                                    <Row gutter={10}>
                                        <Col span={4}>
                                            <div style={{width: '100%', textAlign: 'center'}}>
                                                <div className='img-placeholder thumb-placeholder' style={{width: `${newPlayList.layout.resolution.Width * 90 / newPlayList.layout.resolution.Height}px`}}>
                                                    <div style={{width: `${pData.Width * 90 / newPlayList.layout.resolution.Height}px`, height: `${pData.Height * 90 / newPlayList.layout.resolution.Height}px`, left: `${pData.X * 90 / newPlayList.layout.resolution.Height}px`, top: `${pData.Y * 90 / newPlayList.layout.resolution.Height}px`, backgroundColor: '#999', position: 'absolute'}}></div>
                                                </div>
                                            </div>
                                            <div className='d-flex align-center j-c-space-between'>
                                                <p className='panel-name'>Panel {pData.PanelName}</p>
                                                <div className='d-flex align-center'>
                                                    <p className='panel-tag'>00:00:06</p>
                                                    <p className='panel-tag'>{pData.PanelName}</p>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={20}>
                                            <Dragger
                                                name={pData.PanelName}
                                                multiple={true}
                                                listType='picture-card'
                                                action='https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188'
                                                accept="image/png, image/jpeg"
                                                onChange={(e) => onFileChange(e, pIndex)}
                                                onDrop={onDrop}
                                                className='import-drag-file'
                                                openFileDialogOnClick={false}
                                                fileList={fileList[pIndex]}
                                            >
                                                <p className="ant-upload-drag-icon">
                                                    <div><span className="material-symbols-outlined">imagesmode</span></div>
                                                </p>
                                                <p className="ant-upload-text">Drag and drop media here</p>
                                                <div className='file-view-section'>
                                                    <DragDropContext onDragEnd={(result) => onDragEnd(result, pIndex)}>
                                                        <Droppable droppableId="droppable" direction='horizontal'>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    {...provided.droppableProps}
                                                                    ref={provided.innerRef}
                                                                    style={{display: 'flex'}}
                                                                >
                                                                    {fileList[pIndex]?.length > 0 && fileList[pIndex]?.map((item, index) => (
                                                                        <Draggable key={item.uid} draggableId={item.uid} index={index}>
                                                                            {(provided, snapshot) => (
                                                                                <div
                                                                                    ref={provided.innerRef}
                                                                                    {...provided.draggableProps}
                                                                                    {...provided.dragHandleProps}
                                                                                >
                                                                                    <div className='preview-item'>
                                                                                        <img src={item.thumbUrl} alt='' />
                                                                                        <div className='overlay'>
                                                                                            <span className="material-symbols-outlined" onClick={() => removeFile(pIndex, index)}>delete</span>
                                                                                        </div>
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
                                            </Dragger>
                                        </Col>
                                    </Row>
                                </Card>                                
                            )
                        }
                    </Col>
                    <Col span={6}>
                        <Card className='right-card'>
                            <div className='d-flex align-center j-c-space-between'>
                                <p className='sub-title'>Media Library</p>
                                <Button className='filter-btn' onClick={() => setFilterShow(true)}>
                                    <div className='d-flex align-center'>
                                        <span className="material-symbols-outlined">tune</span><span>&nbsp;&nbsp;Filters</span>
                                    </div>
                                </Button>
                            </div>
                            <Input placeholder="search..." prefix={<SearchOutlined />} className='search-input' value={searchModalText} onChange={changeModalSearch}/>
                            <Select
                                defaultValue='folder1'
                                options={[
                                    {
                                        value: 'folder1',
                                        label: 'Folder 1'
                                    },
                                    {
                                        value: 'folder2',
                                        label: 'Folder 2'
                                    },
                                    {
                                        value: 'folder3',
                                        label: 'Folder 3'
                                    }
                                ]}
                            />
                            <Row gutter={[10, 10]}>
                                {
                                    mediaFilterData.map(image => 
                                        <Col span={8} style={{position: 'relative'}}>
                                            <img src={`http://localhost:5001/uploads/img/${image.ID}.png`} className='img-placeholder' alt={image.FileName}/>
                                            <p className='media-format'>{image.Ext.split('.')[1]}</p>
                                        </Col>
                                    )
                                }
                            </Row>
                        </Card>
                    </Col>
                </Row>
                <Button type='primary' className='save-button' onClick={confirmSave}>Save Playlist</Button>
                <Button className='modal-cancel-button' onClick={() => {setEditShow(false); setNewPlayList({Name: '', Tag: [], CreatedBy: currentUser.Email, ModifiedBy: currentUser.Email, Duration: 0});}}>Cancel</Button>
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
                        onClick={applyFilter}
                    >
                        Apply Filter
                    </Button>
                </div>
            </Modal>
        </>
    );
}

export default PlayList;
