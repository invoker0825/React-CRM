import React, { useState } from 'react';
import { Button, Card, Space, Select, Modal, Input, Row, Col, Checkbox, Upload, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Tag from '../../components/tag';
import Table from '../../components/table';
import packImg from '../../assets/img/pack.png';
import watchImg from '../../assets/img/watch.png';
import './playlist.scss';

const { Dragger } = Upload;

const PlayList = () => {

    const [editShow, setEditShow] = useState(false);

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

    const imageList = [watchImg, packImg, packImg, packImg, watchImg, packImg, watchImg, packImg, watchImg, watchImg]

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

    const editPlayListData = () => {
        setEditShow(true);
    }

    const onFileChange = (info) => {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    const onFileDrop = (e) => {
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
                    <Col span={19} className='left-section'>
                        {
                            panelData.map(pData => 
                                <Card>
                                    <Row gutter={10}>
                                        <Col span={5}>
                                            <div className='img-placeholder thumb-placeholder'></div>
                                            <div className='d-flex align-center j-c-space-between'>
                                                <p className='panel-name'>{pData.name}</p>
                                                <div className='d-flex align-center'>
                                                    <p className='panel-tag'>{pData.duration}</p>
                                                    <p className='panel-tag'>{pData.number}</p>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={19}>
                                            <Dragger
                                                name="file"
                                                multiple={true}
                                                listType='picture-card'
                                                action='https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188'
                                                accept="image/png, image/jpeg"
                                                onChange={onFileChange}
                                                onDrop={onFileDrop}
                                                className='import-drag-file'
                                            >
                                                <p className="ant-upload-drag-icon">
                                                    <div><span className="material-symbols-outlined">imagesmode</span></div>
                                                </p>
                                                <p className="ant-upload-text">Drag and drop image here, or click add image</p>
                                            </Dragger>
                                        </Col>
                                    </Row>
                                </Card>                                
                            )
                        }
                    </Col>
                    <Col span={5}>
                        <Card className='right-card'>
                            <div className='d-flex align-center j-c-space-between'>
                                <p className='sub-title'>Media Library</p>
                                <Button className='filter-btn'>
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
                                        <Col span={12}>
                                            <img src={image} className='img-placeholder' alt=''/>
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
        </>
    );
}

export default PlayList;
