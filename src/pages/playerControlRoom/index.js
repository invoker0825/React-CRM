import React, { useState, useEffect } from 'react';
import { Button, Card, Checkbox, Select, Modal, Input, Row, Col, Collapse, Upload } from 'antd';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
import { SearchOutlined } from '@ant-design/icons';
import packImg from '../../assets/img/pack.png';
import watchImg from '../../assets/img/watch.png';
import './playerControlRoom.scss';

const { Dragger } = Upload;
const CheckboxGroup = Checkbox.Group;

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
};

const PlayerControlRoom = () => {
    const navigate = useNavigate();

    const [selectedLayout, setSelectedLayout] = useState(0);
    const [filterShow, setFilterShow] = useState(false);
    const [checkedList, setCheckedList] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [showPreset, setShowPreset] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [xPos, setXPos] = useState(0);
    const [prevX, setPrevX] = useState(0);
    const [presetLayout, setPresetLayout] = useState();
    const [layoutData, setLayoutData] = useState([
        {name: 'Preset 1', h: 1, v: 1, shortcut: ''},
        {name: 'Preset 2', h: 2, v: 2, shortcut: ''},
        {name: 'Preset 3', h: 3, v: 2, shortcut: ''},
        {name: 'Preset 4', h: 2, v: 3, shortcut: ''},
        {name: 'Preset 5', h: 3, v: 3, shortcut: ''},
        {name: 'Preset 6', h: 4, v: 2, shortcut: ''},
        {name: 'Preset 7', h: 4, v: 3, shortcut: ''}
    ]);
    const [hotKey, setHotKey] = useState(false);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const fileTypes = ['Video', 'Picture', 'Stream', 'Powerpoint', 'Capture Card'];
    const checkAll = fileTypes.length === checkedList.length;
    const indeterminate = checkedList.length > 0 && checkedList.length < fileTypes.length;

    const imageList = [{src: watchImg, type: 'jpg'}, {src: packImg, type: 'png'}, {src: packImg, type: 'png'}, {src: packImg, type: 'png'}, {src: watchImg, type: 'jpg'}, {src: packImg, type: 'png'}, {src: watchImg, type: 'jpg'}, {src: packImg, type: 'png'}, {src: watchImg, type: 'jpg'},{src: watchImg, type: 'jpg'}, {src: packImg, type: 'png'}, {src: packImg, type: 'png'}, {src: packImg, type: 'png'}, {src: watchImg, type: 'jpg'}, {src: packImg, type: 'png'}, {src: watchImg, type: 'jpg'}, {src: packImg, type: 'png'}, {src: watchImg, type: 'jpg'}, {src: watchImg, type: 'jpg'}];
    
    const panelData = [
        {
            name: 'Panel 1',
            interval: 20,
            number: '0'
        },
        {
            name: 'Panel 2',
            interval: 30,
            number: '3'
        },
        {
            name: 'Panel 3',
            interval: 20,
            number: '5'
        },
        {
            name: 'Panel 4',
            interval: 30,
            number: '8'
        },
        {
            name: 'Panel 5',
            interval: 20,
            number: '2'
        }
    ];

    const handleKeyPress = (event) => {
        if (event.key.length === 1) {
            if (event.altKey) {
                let temp = [...layoutData];
                temp[presetLayout].shortcut = 'Alt + ' + event.key.toUpperCase();
                setLayoutData(temp);    
            } else if (event.ctrlKey) {
                let temp = [...layoutData];
                temp[presetLayout].shortcut = 'Ctrl + ' + event.key.toUpperCase();
                setLayoutData(temp);    
            } else if (event.shiftKey) {
                let temp = [...layoutData];
                temp[presetLayout].shortcut = 'Shift + ' + event.key.toUpperCase();
                setLayoutData(temp);    
            } else {
                let temp = [...layoutData];
                temp[presetLayout].shortcut = event.key.toUpperCase();
                setLayoutData(temp); 
            }
            setHotKey(false);
        }
    };
    
    useEffect(() => {
        if (hotKey === true) {
            document.addEventListener('keydown', handleKeyPress);
            return () => {
                document.removeEventListener('keydown', handleKeyPress);
            };
        }
    }, [hotKey]);

    useEffect(() => {
        let temp = new Array(panelData.length).fill([])
        setFileList(temp);
    }, [panelData.length]);

    const calc = (i, index) => {
        let minPadding = Math.min(10/layoutData[index].v, 10/layoutData[index].h);
        let temp = 'calc((100% - ' + minPadding*(i - 1) + 'px) / ' + i + ')';
        return i === 1 ? '100%' : temp;
    }

    const onClickLayout = (i) => {
        setSelectedLayout(i);
        let temp = new Array(layoutData[i].v * layoutData[i].h).fill(1);
        let tempFileList = [];
        temp.forEach((t, i) => {
            tempFileList.push({id: i.toString(), fileList: []});
        })
        setFileList(tempFileList);
    }

    const resetFilter = () => {
        setCheckedList([]);
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

    const onFileChange = (info, i) => {
        if (info.file.status === 'uploading') {
            let temp = [...fileList];
            temp[i] = info.fileList.map(file => ({...file}));
            setFileList(temp.map(files => files.map(file => ({...file}))));
        }
        if (info.file.status === 'done') {
            let temp = [...fileList];
            temp[i] = info.fileList.map(file => ({...file}));
            setFileList(temp.map(files => files.map(file => ({...file}))));
            setTimeout(() => {
                onDragEnd({destination: {index: 0}, source: {index: 0}}, i);                
            }, 100);
        }
    };

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

    const handleMouseMove = (event) => {
        setXPos(event.clientX);
    }

    const presetTagDown = () => {
        setPrevX(xPos);
    }

    const presetTagUp = () => {
        if(prevX > xPos) {
            if (!showMenu && !showPreset) {
                setShowPreset(true);
            } else if (showMenu) {
                setShowMenu(false);
            }
        }
        if(prevX < xPos) {
            if (!showMenu && !showPreset) {
                setShowMenu(true);
            } else if (showPreset) {
                setShowPreset(false);
            }
        }
    }

    const deleteLayout = (i) => {
        let temp = [...layoutData];
        temp.splice(i, 1);
        setLayoutData(temp);
    }

    const updateLayoutName = (e, index) => {
        let temp = [...layoutData];
        temp[index].name = e.target.value;
        setLayoutData(temp);
    }

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart({x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY});
    }
      
    const onTouchMove = (e) => setTouchEnd({x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY});
      
    const onTouchEnd = (e) => {
        if (!touchStart || !touchEnd) return
        const distanceX = touchStart.x - touchEnd.x;
        const distanceY = touchStart.y - touchEnd.y;
        if (Math.abs(distanceX) > 1.2 * Math.abs(distanceY)) {
            const isLeftSwipe = distanceX > 50;
            const isRightSwipe = distanceX < -50;
            if (isLeftSwipe || isRightSwipe) console.log('swipe', isLeftSwipe ? 'left' : 'right')
            if (isLeftSwipe) {
                if (!showMenu && !showPreset) {
                    setShowPreset(true);
                } else if (showMenu) {
                    setShowMenu(false);
                }
            } else {
                if (!showMenu && !showPreset) {
                    setShowMenu(true);
                } else if (showPreset) {
                    setShowPreset(false);
                }
            }
            return false;
        }
    }

    return (
        <>
            <div className='page-container'>
                <div className="control-player-page" onMouseMove={handleMouseMove} onMouseDown={presetTagDown} onMouseUp={presetTagUp} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} >
                    <div className='preset-panel-tag' onClick={() => {setShowPreset(true); setShowMenu(false)}}></div>
                    <div className='menu-tag' onClick={() => {setShowPreset(false); setShowMenu(true)}}></div>
                    <div className='d-flex align-center j-c-space-between top-section'>
                        <p className='page-title'>Control Room Panel</p>
                        <Button type='primary' className='custom-button'>Save as Preset</Button>
                        <a className='link-btn' href='/control/live'>Go LIVE Mode</a> 
                    </div>
                    <Card className='top-card'>
                        <Row gutter={10} justify={'space-between'} style={{height: '100%'}}>
                            <Col span={18} style={{height: '100%'}}>
                                <div className='panel-item'>
                                    {
                                        panelData.map((pData, pIndex) => 
                                            <Card>
                                                <Row gutter={10}>
                                                    <Col xl={5} lg={6} md={8} sm={8}>
                                                        <div className='img-placeholder thumb-placeholder'></div>
                                                        <div className='d-flex align-center j-c-space-between'>
                                                            <p className='panel-name'>{pData.name}</p>
                                                            <div className='d-flex align-center'>
                                                                <span className="material-symbols-outlined interval-icon">schedule</span>
                                                                <Select
                                                                    defaultValue={pData.interval}
                                                                    className='panel-tag'
                                                                    options={[
                                                                        {
                                                                            value: 10,
                                                                            label: '10s'
                                                                        },
                                                                        {
                                                                            value: 20,
                                                                            label: '20s'
                                                                        },
                                                                        {
                                                                            value: 30,
                                                                            label: '30s'
                                                                        }
                                                                    ]}
                                                                />
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col xl={19} lg={18} md={16} sm={16}>
                                                        <Dragger
                                                            name={pData.name}
                                                            multiple={true}
                                                            listType='picture-card'
                                                            action='https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188'
                                                            accept="image/png, image/jpeg"
                                                            onChange={(e) => onFileChange(e, pIndex)}
                                                            className='import-drag-file'
                                                            openFileDialogOnClick={false}
                                                            fileList={fileList[pIndex]}
                                                        >
                                                            <div className='file-view-section'>
                                                                <DragDropContext onDragEnd={(result) => onDragEnd(result, pIndex)} style={{overflow: 'hidden'}}>
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
                                                                                                    <div className='tag'>
                                                                                                        <p className='media-format'>Input 1</p>
                                                                                                    </div>
                                                                                                    <div className='bottom-tag'>
                                                                                                        <Select
                                                                                                            defaultValue={pData.interval}
                                                                                                            className='panel-tag'
                                                                                                            options={[
                                                                                                                {
                                                                                                                    value: 10,
                                                                                                                    label: '10s'
                                                                                                                },
                                                                                                                {
                                                                                                                    value: 20,
                                                                                                                    label: '20s'
                                                                                                                },
                                                                                                                {
                                                                                                                    value: 30,
                                                                                                                    label: '30s'
                                                                                                                }
                                                                                                            ]}
                                                                                                        />
                                                                                                    </div>
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
                                </div>
                            </Col>
                            <Col span={6} style={{height: '100%'}}>
                                <Card className='left-card'>
                                    <Row justify={'space-between'} align={'middle'}>
                                        <Col sm={12} md={16} lg={18} xl={12}>
                                            <p className='sub-title'>Media Library</p>
                                        </Col>
                                        <Col>
                                            <Button className='filter-btn' onClick={() => setFilterShow(true)}>
                                                <div className='d-flex align-center'>
                                                    <span className="material-symbols-outlined">tune</span><span>&nbsp;&nbsp;Filters</span>
                                                </div>
                                            </Button>
                                        </Col>
                                    </Row>
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
                                    <Row gutter={[10, 10]} className='image-row'>
                                        {
                                            imageList.map(image => 
                                                <Col md={24} lg={12} xl={8} style={{position: 'relative'}}>
                                                    <img src={image.src} className='img-placeholder' alt=''/>
                                                    <div className='tag'>
                                                        <p className='media-format'>Input 1</p>
                                                    </div>
                                                </Col>
                                            )
                                        }
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </Card>
                    <Card className='bottom-card'>
                        <div className='d-flex align-center' style={{width: '100%', height: '100%', overflowX: 'auto'}}>
                            {
                                layoutData.map((layout, index) => 
                                    <div className={'d-flex align-items j-c-space-between flex-column layout-item ' + (selectedLayout === index ? 'selected-layout-item' : '')} onClick={() => onClickLayout(index)}>
                                        {Array.from({ length: layout.v }).map((l, i) => 
                                            <div className='d-flex align-center j-c-space-between' style={{width: '100%', height: calc(layout.v, index)}}>
                                                {Array.from({ length: layout.h }).map((l, i) => 
                                                    <div className='layout-item-element' style={{width: calc(layout.h, index)}}></div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )
                            }
                        </div>
                    </Card>
                </div>
                
                <div className="preset-panel" style={{left: showPreset ? '100px' : '100vw'}} onMouseMove={handleMouseMove} onMouseDown={presetTagDown} onMouseUp={presetTagUp} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} >
                    <p className='title'>Double tap to activate the preset</p>
                    <Row gutter={[10, 10]} wrap>
                        {
                            layoutData.map((layout, index) =>
                                <Col xl={6} lg={8} md={12}>
                                    <div className={'preset-card ' + (index === presetLayout ? 'selected-preset-card' : '')} onClick={() => setPresetLayout(index)}>
                                        <div className='content'>
                                            <div className='preset-layout'>
                                                <div className='d-flex align-items j-c-space-between flex-column layout-item'>
                                                    {Array.from({ length: layout.v }).map((l, i) => 
                                                        <div className='d-flex align-center j-c-space-between' style={{width: '100%', height: calc(layout.v, index)}}>
                                                            {Array.from({ length: layout.h }).map((l, i) => 
                                                                <div className='layout-item-element' style={{width: calc(layout.h, index)}}></div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className='d-flex align-center j-c-space-between' style={{width: '100%'}}>
                                                <Input className='layout-name' bordered={false} value={layout.name} onChange={(e) => updateLayoutName(e, index)} disabled={index !== presetLayout} />
                                                <p className='layout-shortcut' onClick={() => {presetLayout === index ? setHotKey(true) : setHotKey(false)}}>{layout.shortcut !== '' ? layout.shortcut : 'Assign Shortcut'}</p>
                                            </div>
                                        </div>
                                        {index === presetLayout && <span className="material-symbols-outlined" onClick={() => deleteLayout(index)}>close</span>}
                                    </div>
                                </Col>
                            )
                        }
                    </Row>
                </div>

                <div className="menu-container" style={{left: showMenu ? '0px' : '-250px'}} onMouseMove={handleMouseMove} onMouseDown={presetTagDown} onMouseUp={presetTagUp} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} >
                    <p className='menu-title'>EUMEDIA CRS</p>
                    <div className='menu-item' onClick={() => navigate('/media')}>
                        <span class="material-symbols-outlined filled">subscriptions</span>
                        <p className='menu-item-title'>Media</p>
                    </div>
                    <div className='menu-item' onClick={() => navigate('/')}>
                        <span class="material-symbols-outlined">dashboard</span>
                        <p className='menu-item-title'>Layout</p>
                    </div>
                    <div className='menu-item' onClick={() => navigate('/control/live')}>
                        <span class="material-symbols-outlined">cast</span>
                        <p className='menu-item-title'>Live Mode</p>
                    </div>
                    <div className='menu-item' onClick={() => navigate('/control/play')}>
                        <span class="material-symbols-outlined filled">fast_forward</span>
                        <p className='menu-item-title'>Playback<br />Mode</p>
                    </div>
                    <div className='setting-container'>
                        <div className='menu-item setting-item' onClick={() => navigate('/settings')}>
                            <span class="material-symbols-outlined filled">settings</span>
                            <p className='menu-item-title'>Settings</p>
                        </div>
                    </div>
                </div>
            </div>

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

export default PlayerControlRoom;
