import { useState } from 'react';
import { Button, Card, Space, Input, Menu, Badge, Row, Col, Checkbox, Modal, Upload, message } from 'antd';
import { SearchOutlined, AppstoreOutlined } from '@ant-design/icons';
import Tag from '../../components/tag';
import Table from '../../components/table';
import packImg from '../../assets/img/pack.png';
import watchImg from '../../assets/img/watch.png';
import './media.scss';

const { Dragger } = Upload;

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
  }

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

const mediaColumns = [
    {
        title: 'Name',
        dataIndex: 'name',
        width: '150px'
    },
    {
        title: 'Screenshot',
        dataIndex: 'screenshot',
        render: (screenShot) => <img src={screenShot} alt='' />,
        width: '170px',
        sorter: (a, b) => a.screenshot - b.screenshot,
    },
    {
        title: 'Date/Time',
        dataIndex: 'date',
        width: '200px',
        sorter: (a, b) => a.date.localeCompare(b.date),
    },
    {
        title: 'By User',
        dataIndex: 'user',
        render: (user) => <><p className='black-text'>{user.name}</p><p className='small-text'>{user.email}</p></>,
        width: '180px'
    },
    {
        title: 'Resolution (px)',
        dataIndex: 'resolution',
        width: '175px',
        sorter: (a, b) => a.resolution.localeCompare(b.resolution),
    },
    {
        title: 'File Type',
        dataIndex: 'fileType',
        width: '140px',
        render: (fileType) => <p>{fileType.toUpperCase()}</p>,
    },
    {
        title: 'Status',
        dataIndex: 'status',        
        render: (status) => <Tag label={status.label} color={status.color}/>,
        width: '145px',
        sorter: (a, b) => a.status.label.localeCompare(b.status.label),
    },
    {
        title: 'Action',
        dataIndex: 'actino',
        render: (_, record) => (
          <Space size="small">
            <span className="material-symbols-outlined">visibility</span>
            <span className="material-symbols-outlined">edit</span>
          </Space>
        ),
    }
];

const mediaData = [
    {
        key: '1',
        name: 'BP-backdrop',
        screenshot: packImg,
        date: '1 min ago',
        user: {name: 'John Bushmill', email: 'Johnb@mail.com'},
        resolution: '800x600',
        fileType: 'ppt',
        status: {label: 'Uploading', color: 'orange'},
    },
    {
        key: '2',
        name: 'Powerpoint',
        screenshot: watchImg,
        date: '1 min ago',
        user: {name: 'Ilham Budi A', email: 'ilahmbudi@mail.com'},
        resolution: '1920x1080',
        fileType: 'jpg',
        status: {label: 'Processing', color: 'purple'},
    }
];

const mediaFilterData = [
    {
        name: 'BP-backdrop 1',
        duration: 10,
        resolution: '1920x1080',
        user: 'Arnold',
        date: ' 8/8/2023',
        screenshot: packImg
    },
    {
        name: 'BP-backdrop 2',
        duration: 15,
        resolution: '1920x1080',
        user: 'Arnold',
        date: ' 9/9/2023',
        screenshot: packImg
    },
    {
        name: 'BP-backdrop 3',
        duration: 43,
        resolution: '1920x1080',
        user: 'Arnold',
        date: ' 10/10/2023',
        screenshot: packImg
    },
    {
        name: 'BP-backdrop',
        duration: 23,
        resolution: '1920x1080',
        user: 'Arnold',
        date: ' 11/11/2023',
        screenshot: watchImg
    }
]

const Media = () => {

    const [importModalShow, setImportModalShow] = useState(false);
    const [webPageShow, setWebPageShow] = useState(false);
    const [rssShow, setRssShow] = useState(false);
    const [filelist, setFileList] = useState();

    const onClickMenu = (e) => {
      console.log('click------------------ ', e);
    };

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
        console.log('Dropped files', e.dataTransfer.files);
    }

    return (
        <>
            <div className="media-page">
                <Card className='table-card'>
                    <div className='d-flex align-center j-c-space-between top-section'>
                        <p className='card-title'>Recent Media</p>
                    </div>
                    <Table
                        columns={mediaColumns}
                        dataSource={mediaData}
                    />
                </Card>
                <Card className='table-card'>
                    <div className='d-flex align-center j-c-space-between top-section'>
                        <p className='card-title'>Media Library</p>
                        <div className='d-flex align-center'>
                            <Input placeholder="search..." prefix={<SearchOutlined />}  className='search-input'/>
                            <Button className='filter-btn'>
                                <div className='d-flex align-center'>
                                    <span className="material-symbols-outlined">tune</span><span>&nbsp;&nbsp;Filters</span>
                                </div>
                            </Button>
                        </div>
                    </div>
                    <div className='d-flex'>
                        <div className='filter-board'>
                            <Button type='primary'>+ New Folder</Button>
                            <Button type='primary' onClick={() => setImportModalShow(true)}>Import Media</Button>
                            <Button type='primary' onClick={() => setWebPageShow(true)}>+ Webpage</Button>
                            <Button type='primary' onClick={() => setRssShow(true)}>+ RSS/Ticker</Button>
                            <Button type='primary'>+ Stream Feed</Button>
                            <Button type='primary'>+ Capture Card Feed</Button>
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
                        </div>
                        <div className='result-board'>
                            <Row justify="start">
                                {
                                    mediaFilterData.map(media => 
                                        <Col span={5}>
                                            <Card 
                                                className='filter-media-card'
                                                style={{backgroundImage: 'url(' + media.screenshot + ')'}}
                                            >
                                                <Checkbox className='card-check'/>
                                                <span className="material-symbols-outlined">edit</span>
                                            </Card>
                                            <div className='d-flex align-center j-c-space-between'>
                                                <p>{media.name}</p>
                                                <p>{media.duration}sec</p>
                                            </div>
                                            <p className='grey-text'>{media.resolution}px</p>
                                            <p className='grey-text'>Imported by {media.user} on {media.date}</p>
                                        </Col>
                                    )
                                }
                                
                            </Row>
                        </div>
                    </div>
                </Card>
            </div> 

            <Modal
                title="Media"
                centered
                open={importModalShow}
                onCancel={() => setImportModalShow(false)}
                footer={false}
                className='import-modal'
            >
                <Dragger
                    name="file"
                    multiple={false}
                    listType="text"
                    action='https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188'
                    fileList={filelist}
                    accept="image/png, image/jpeg"
                    onChange={onFileChange}
                    onDrop={onFileDrop}
                    onRemove={()=> setFileList([])}
                    beforeUpload={(file) => {
                      setFileList([file]);
                      return false;
                    }}
                    className='import-drag-file'
                >
                    <p className="ant-upload-drag-icon">
                        <div><span class="material-symbols-outlined">imagesmode</span></div>
                    </p>
                    <p className="ant-upload-text">Drag and drop image here, or click add image</p>
                    <button>Open Explorer</button>
                </Dragger>
                <Button className='modal-cancel-button' onClick={() => setImportModalShow(false)}>Cancel</Button>
            </Modal>

            <Modal
                title="webpage"
                centered
                open={webPageShow}
                onCancel={() => setWebPageShow(false)}
                footer={false}
                className='webpage-modal'
            >
                <p className='label'>URL</p>
                <Input placeholder="Type URL here" className='url-input'/>
                <Button className='modal-cancel-button' onClick={() => setWebPageShow(false)}>Cancel</Button>
            </Modal>
            
            <Modal
                title="webpage"
                centered
                open={rssShow}
                onCancel={() => setRssShow(false)}
                footer={false}
                className='rss-modal'
            >
                <p className='label'>URL</p>
                <Input placeholder="Type URL here" className='url-input'/>
                <p className='label'>Output</p>
                <Input placeholder="Sample Output Here" className='url-input rss-input'/>
                <Button className='modal-cancel-button' onClick={() => setRssShow(false)}>Cancel</Button>
            </Modal>
        </>
    );
}

export default Media;
