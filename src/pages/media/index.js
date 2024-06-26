import React, { useState, useEffect } from 'react';
import { Button, Card, Input, Menu, Badge, Row, Col, Checkbox, Modal, Upload, message, Collapse, Select, Breadcrumb, DatePicker, Popover } from 'antd';
import { SearchOutlined, AppstoreOutlined } from '@ant-design/icons';
import ContextMenu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import './media.scss';

const { Dragger } = Upload;
const CheckboxGroup = Checkbox.Group;
const { RangePicker } = DatePicker;

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}

// var mediaFilterData = [
//     {
//         name: 'BP-backdrop 1',
//         duration: 10,
//         resolution: '1920x1080',
//         user: 'Arnold',
//         date: ' 8/8/2023',
//         screenshot: packImg,
//         format: 'jpg'
//     },
//     {
//         name: 'BP-backdrop 2',
//         duration: 15,
//         resolution: '1920x1080',
//         user: 'Arnold',
//         date: ' 9/9/2023',
//         screenshot: packImg,
//         format: 'jpg'
//     },
//     {
//         name: 'BP-backdrop 3',
//         duration: 43,
//         resolution: '1920x1080',
//         user: 'Arnold',
//         date: ' 10/10/2023',
//         screenshot: packImg,
//         format: 'png'
//     },
//     {
//         name: 'BP-backdrop',
//         duration: 23,
//         resolution: '1920x1080',
//         user: 'Arnold',
//         date: ' 11/11/2023',
//         screenshot: watchImg,
//         format: 'jpg'
//     },
//     {
//         name: 'BP-backdrop 1',
//         duration: 10,
//         resolution: '1920x1080',
//         user: 'Arnold',
//         date: ' 8/8/2023',
//         screenshot: packImg,
//         format: 'png'
//     },
//     {
//         name: 'BP-backdrop 2',
//         duration: 15,
//         resolution: '1920x1080',
//         user: 'Arnold',
//         date: ' 9/9/2023',
//         screenshot: packImg,
//         format: 'png'
//     },
//     {
//         name: 'BP-backdrop 3',
//         duration: 43,
//         resolution: '1920x1080',
//         user: 'Arnold',
//         date: ' 10/10/2023',
//         screenshot: packImg,
//         format: 'jpg'
//     }
// ]

const Media = () => {

    const [cardContextMenu, setCardContextMenu] = useState(null);
    const [menuContextMenu, setMenuContextMenu] = useState(null);
    const [importModalShow, setImportModalShow] = useState(false);
    const [webPageShow, setWebPageShow] = useState(false);
    const [rssShow, setRssShow] = useState(false);
    const [editShow, setEditShow] = useState(false);
    const [filterShow, setFilterShow] = useState(false);
    const [filelist, setFileList] = useState();
    const [checkedList, setCheckedList] = useState([]);
    const [editMedia, setEditMedia] = useState();
    const [importMenuOpen, setImportMenuOpen] = useState(false);
    const [moveToShow, setMoveToShow] = useState(false);
    const [mediaFilterData, setMediaFilterData] = useState([]);
    const [mediaData, setMediaData] = useState([]);
    const [items, setItems] =useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [currentCategory, setCurrentCategory] = useState('');

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

    useEffect(() => {
        axios.get('http://localhost:5001/api/media')
        .then((mediaRes) => {
            if (mediaRes.status === 200) {
                console.log('=============', mediaRes.data)
                setMediaFilterData(mediaRes.data);
                setMediaData(mediaRes.data);
                axios.get('http://localhost:5001/api/category')
                .then((res) => {
                    if (res.status === 200) {
                        setCategoryData(res.data);
                        const result = [];
                        let number = 1;
                        
                        for (const obj of res.data) {
                            if (obj.Parent === '00000000-0000-0000-0000-000000000000') {
                                let tempObj = res.data.filter(r => r.Parent === obj.ID);
                                let tempChild = [];
                                if (tempObj.length > 0) {
                                    tempObj.forEach(t => {
                                        const temp = mediaRes.data.filter(m => m.CategoryID === t.ID)
                                        tempChild.push(getItem(<div className='d-flex align-center j-c-space-between' onClick={() => selectCategory(t.ID)}><p>{t.Category}</p><Badge count={temp.length} /></div>, t.ID));
                                        number ++;
                                    });
                                    const temp = mediaRes.data.filter(m => m.CategoryID === obj.ID)
                                    result.push(getItem(<div className='d-flex align-center j-c-space-between pr-20' onClick={() => selectCategory(obj.ID)}><p>{obj.Category}</p><Badge count={temp.length} /></div>, obj.ID, <AppstoreOutlined />, [...tempChild]));
                                    number ++;
                                } else {
                                    const temp = mediaRes.data.filter(m => m.CategoryID === obj.ID)
                                    result.push(getItem(<div className='d-flex align-center j-c-space-between' onClick={() => selectCategory(obj.ID)}><p>{obj.Category}</p><Badge count={temp.length} /></div>, obj.ID, <AppstoreOutlined />));
                                    number ++;
                                }
                            }
                        }
                        setItems(result);
                    }
                }).catch((err) => {
                    console.log('err-------------', err)
                });
            }
        }).catch((err) => {
            console.log('err-------------', err)
        });
    }, []);

    const convertDateFormat = (dateString) => {
        const date = new Date(dateString);

        const month = date.getMonth() + 1; // Months are zero-based, so we add 1
        const day = date.getDate();
        const year = date.getFullYear();

        const formattedDate = `${month}/${day}/${year}`;
        return formattedDate;
    }

    const convertLongString = (str) => {
        const truncatedString = str.length > 15 ? str.substring(0, 15) + "..." : str;
        return truncatedString;
    }

    const onClickMenu = (e) => {
      console.log('click------------------ ', e);
    };

    const onChangeFileType = (list) => {
        setCheckedList(list);
    };

    const onCheckAllTypes = (e) => {
        setCheckedList(e.target.checked ? fileTypes.map(type => {return type.value}) : []);
    };

    const resetFilter = () => {
        setCheckedList([]);
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
        console.log('Dropped files', e.dataTransfer.files);
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

    const editMediaData = (media) => {
        setEditMedia(media);
        setEditShow(true);
    }

    const changeDuration = (duration) => {
        setEditMedia({...editMedia, duration: duration})
    }

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

    const applyFilter = () => {
        let temp = mediaData.filter(m => checkedList.includes(m.TypeID));
        setMediaFilterData(temp);
        setFilterShow(false);
    }

    const selectCategory = (id) => {
        console.log('----------->>>>>>>>>>>>>>>>>>', id)
        setCurrentCategory(id);
    }

    return (
        <div>
            <div className="media-page">
                <Card className='table-card'>
                    <div className='d-flex align-center j-c-space-between top-section'>
                        <p className='card-title'>Media Library</p>
                        <div className='d-flex align-center'>
                            <Input placeholder="search..." prefix={<SearchOutlined />}  className='search-input'/>
                            <Button className='filter-btn' onClick={() => setFilterShow(true)}>
                                <div className='d-flex align-center'>
                                    <span className="material-symbols-outlined">tune</span><span>&nbsp;&nbsp;Filters</span>
                                </div>
                            </Button>
                        </div>
                    </div>
                    <div className='d-flex'>
                        <div className='filter-board'>
                            <Popover 
                                content={
                                    (<div>
                                        <Button type='primary' onClick={() => {setWebPageShow(true); setImportMenuOpen(false)}}>+ Webpage</Button>
                                        <Button type='primary' onClick={() => {setRssShow(true); setImportMenuOpen(false)}}>+ RSS/Ticker</Button>
                                        <Button type='primary' onClick={() => setImportMenuOpen(false)}>+ Stream Feed</Button>
                                        <Button type='primary' onClick={() => setImportMenuOpen(false)}>+ Capture Card Feed</Button>
                                        <Button type='primary' onClick={() => {setImportMenuOpen(false); setImportModalShow(true);}}>+ Video/Image</Button>
                                    </div>)
                                } 
                                title="" 
                                trigger="click" 
                                placement='bottom'
                                open={importMenuOpen}
                                onOpenChange={(e) => setImportMenuOpen(e)}
                            >
                                <Button type='primary' onClick={() => setImportMenuOpen(!importMenuOpen)}>Import Media</Button>
                                {/* <Button type='primary' onClick={() => setImportModalShow(true)}>Import Media</Button> */}
                            </Popover>
                            
                            <div onContextMenu={handleMenuContextMenu} style={{ cursor: 'context-menu' }}>
                                <Menu
                                    style={{
                                        width: 256,
                                    }}
                                    items={items}
                                    mode="inline"
                                    className='media-filter-menu'
                                    selectable={true}
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
                        </div>
                        <div className='result-board'>
                            <Breadcrumb
                                separator=">"
                                items={[
                                    {
                                        title: 'Home',
                                    },
                                    {
                                        title: 'Sub Folder',
                                        href: '',
                                    },
                                    {
                                        title: 'Sub Folder 1'
                                    }
                                ]}
                            />
                            <Row justify="start" gutter={[10, 10]}>
                                {
                                    mediaFilterData.map((media, index) => 
                                        <Col span={4} key={index}>
                                            <div onContextMenu={handleCardContextMenu} style={{ cursor: 'context-menu' }}>
                                                <Card
                                                    className='filter-media-card'
                                                    style={{backgroundImage: `url(http://localhost:5001/uploads/img/${media.ID}.png)`}}
                                                >
                                                    <Checkbox className='card-check'/>
                                                    <p className='media-format'>{media.Ext.split('.')[1]}</p>
                                                    <span className="material-symbols-outlined" onClick={() => editMediaData(media)}>edit</span>
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
                                                    <MenuItem onClick={() => {closeContext(); editMediaData(media);}}>Settings</MenuItem>
                                                    <MenuItem onClick={closeContext}>Delete</MenuItem>
                                                </ContextMenu>
                                            </div>
                                            <div className='d-flex align-center j-c-space-between'>
                                                <p>{convertLongString(media.Description)}</p>
                                                <p>{media.TotalDuration}sec</p>
                                            </div>
                                            <p className='grey-text'>{media.Width}x{media.Height}px</p>
                                            <p className='grey-text'>Imported by {media.CreatedBy} on {convertDateFormat(media.CreatedOn)}</p>
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
                        <div><span className="material-symbols-outlined">imagesmode</span></div>
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
                title="Add RSS/Ticker"
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
            
            <Modal
                title={editMedia?.name}
                centered
                open={editShow}
                onCancel={() => setEditShow(false)}
                footer={false}
                className='edit-modal'
            >
                <p className='select-label'>Duration (Seconds)</p>
                <Select
                    value={editMedia?.duration}
                    options={[
                        {
                            value: 10,
                            label: '10',
                        },
                        {
                            value: 20,
                            label: '20',
                        },
                        {
                            value: 30,
                            label: '30',
                        }
                    ]}
                    onChange={changeDuration}
                />
                <p className='select-label'>Media Tags</p>
                <Select
                    mode='multiple'
                    options={[
                        {
                            value: 'watch',
                            label: 'Watch',
                        },
                        {
                            value: 'gadget',
                            label: 'Gadget',
                        }
                    ]}
                />
                <p className='select-label'>Start-End Date</p>
                <RangePicker />
                <p className='select-label'>Author/Provider</p>
                <Select />
                <Button className='modal-cancel-button' onClick={() => setEditShow(false)}>Cancel</Button>
            </Modal>
            
            <Modal
                title='Move To'
                centered
                open={moveToShow}
                onCancel={() => setMoveToShow(false)}
                footer={false}
                className='edit-modal move-to-modal'
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
        </div>
    );
}

export default Media;
