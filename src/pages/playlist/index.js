import React, { useState, useEffect } from 'react';
import { Button, Card, Space, Select, Modal, Input, Row, Col, Checkbox, Upload, Collapse } from 'antd';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { SearchOutlined } from '@ant-design/icons';
import Tag from '../../components/tag';
import Table from '../../components/table';
import packImg from '../../assets/img/pack.png';
import watchImg from '../../assets/img/watch.png';
import './playlist.scss';

const { Dragger } = Upload;
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

const PlayList = () => {

    const [editShow, setEditShow] = useState(false);
    const [filterShow, setFilterShow] = useState(false);
    const [checkedList, setCheckedList] = useState([]);
    const [fileList, setFileList] = useState([]);

    const fileTypes = ['Video', 'Picture', 'Stream', 'Powerpoint', 'Capture Card'];
    const checkAll = fileTypes.length === checkedList.length;
    const indeterminate = checkedList.length > 0 && checkedList.length < fileTypes.length;

    const imageList = [{src: watchImg, type: 'jpg'}, {src: packImg, type: 'png'}, {src: packImg, type: 'png'}, {src: packImg, type: 'png'}, {src: watchImg, type: 'jpg'}, {src: packImg, type: 'png'}, {src: watchImg, type: 'jpg'}, {src: packImg, type: 'png'}, {src: watchImg, type: 'jpg'}, {src: watchImg, type: 'jpg'}]

    const playListColumns = [
        {
            title: 'Name',
            dataIndex: 'name'
        },
        {
            title: 'Layout',
            dataIndex: 'layout',
            render: (screenShot) => <img src={screenShot} alt='' />
        },
        {
            title: 'Duration',
            dataIndex: 'duration'
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
                <span className="material-symbols-outlined" onClick={() => editPlayListData()}>edit</span>
              </Space>
            ),
        }
    ];
    
    const playListData = [
        {
            key: '1',
            name: 'Playlist 1',
            layout: packImg,
            duration: '00:06:30',
            tag: '#Promo',
            user: {name: 'John Bushmill', email: 'Johnb@mail.com'},
            status: {label: 'Active', color: 'green'}
        },
        {
            key: '2',
            name: 'Playlist 2',
            layout: watchImg,
            duration: '00:05:00',
            tag: '#Promo #ABC',
            user: {name: 'Ilham Budi A', email: 'ilahmbudi@mail.com'},
            status: {label: 'Active', color: 'green'}
        }
    ];

    useEffect(() => {
        let temp = new Array(panelData.length).fill([])
        setFileList(temp);
    }, []);

    const editPlayListData = () => {
        setEditShow(true);
    }

    const onFileChange = (info, i) => {
        console.log(info.file.status)
        if (info.file.status === 'uploading') {
            let temp = [...fileList];
            temp[i] = info.fileList.map(file => ({...file, thumbUrl: ''}));
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
        setEditShow(false);
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

    return (
        <>
            <div className="playlist-page">
                <Card className='table-card'>
                    <div className='d-flex align-center j-c-space-between top-section'>
                        <p className='card-title'>Playlist</p>
                        <div className='d-flex align-center'>
                            <Input placeholder="search..." prefix={<SearchOutlined />}  className='search-input'/>
                            <Button className='view-mode-btn' type='primary' onClick={() => setEditShow(true)}>
                                <div className='d-flex align-center j-c-center'>
                                    <span className="material-symbols-outlined">add</span>Playlist
                                </div>
                            </Button> 
                        </div>
                    </div>
                    <Table
                        columns={playListColumns}
                        dataSource={playListData}
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
                            <Input className='grey-input' defaultValue='Playlist ABV' />
                        </Col>
                        <Col span={5}>
                            <p className='select-label'>Layout</p>
                            <Select
                                defaultValue='layout1'
                                options={[
                                    {
                                        value: 'layout1',
                                        label: 'Layout 1'
                                    },
                                    {
                                        value: 'layout2',
                                        label: 'Layout 2'
                                    },
                                    {
                                        value: 'layout3',
                                        label: 'Layout 3'
                                    }
                                ]}
                            />
                        </Col>
                        <Col span={11} offset={1}>
                            <Checkbox>Hide Locked Panel</Checkbox>
                        </Col>
                    </Row>
                    <p className='select-label'>#Tag</p>
                    <Input className='grey-input' defaultValue='#Promo #ABC' />
                </Card>
                <Row gutter={10}>
                    <Col span={18} className='left-section'>
                        {
                            panelData.map((pData, pIndex) => 
                                <Card>
                                    <Row gutter={10}>
                                        <Col span={4}>
                                            <div className='img-placeholder thumb-placeholder'></div>
                                            <div className='d-flex align-center j-c-space-between'>
                                                <p className='panel-name'>{pData.name}</p>
                                                <div className='d-flex align-center'>
                                                    <p className='panel-tag'>{pData.duration}</p>
                                                    <p className='panel-tag'>{pData.number}</p>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={20}>
                                            <Dragger
                                                name={pData.name}
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
                            <Input placeholder="search..." prefix={<SearchOutlined />}  className='search-input'/>
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
                                    imageList.map(image => 
                                        <Col span={8} style={{position: 'relative'}}>
                                            <img src={image.src} className='img-placeholder' alt=''/>
                                            <p className='media-format'>{image.type}</p>
                                        </Col>
                                    )
                                }
                            </Row>
                        </Card>
                    </Col>
                </Row>
                <Button type='primary' className='save-button' onClick={confirmSave}>Save Playlist</Button>
                <Button className='modal-cancel-button' onClick={() => setEditShow(false)}>Cancel</Button>
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

export default PlayList;
