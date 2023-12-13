import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Checkbox, Select, Modal, Input, Row, Col, Collapse, Upload } from 'antd';
import { useNavigate } from "react-router-dom";
import { SearchOutlined } from '@ant-design/icons';
import packImg from '../../assets/img/pack.png';
import watchImg from '../../assets/img/watch.png';
import './liveControlRoom.scss';

const { Dragger } = Upload;
const CheckboxGroup = Checkbox.Group;

const LiveControlRoom = () => {
    const navigate = useNavigate();

    const [selectedLayout, setSelectedLayout] = useState(0);
    const [panelList, setPanelList] = useState([{sound: 'volume_mute', fileList: [], name: 'panel 1', id: '0', order: 0}]);
    const [selectedPanel, setSelectedPanel] = useState();
    const [filterShow, setFilterShow] = useState(false);
    const [checkedList, setCheckedList] = useState([]);
    const [fileList, setFileList] = useState([{id: '0',fileList: []}]);
    const [detailPanel, setDetailPanel] = useState();
    const [isMouseDown, setMouseDown] = useState(false);
    const [isTouchDown, setTouchDown] = useState(false);
    const [flag, setFlag] = useState(false);
    const [delay, setDelay] = useState(false);
    const [sourcePanel, setSourcePanel] = useState();
    const [pressTimer, setPressTimer] = useState(null);
    const [lastTouchTime, setLastTouchTime] = useState(0);
    const [showPreset, setShowPreset] = useState(false);
    // const [showMenu, setShowMenu] = useState(false);
    // const [xPos, setXPos] = useState(0);
    // const [prevX, setPrevX] = useState(0);
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
    // const [touchStart, setTouchStart] = useState(null);
    // const [touchEnd, setTouchEnd] = useState(null);

    const fileTypes = ['Video', 'Picture', 'Stream', 'Powerpoint', 'Capture Card'];
    const checkAll = fileTypes.length === checkedList.length;
    const indeterminate = checkedList.length > 0 && checkedList.length < fileTypes.length;

    const imageList = [{src: watchImg, type: 'jpg'}, {src: packImg, type: 'png'}, {src: packImg, type: 'png'}, {src: packImg, type: 'png'}, {src: watchImg, type: 'jpg'}, {src: packImg, type: 'png'}, {src: watchImg, type: 'jpg'}, {src: packImg, type: 'png'}, {src: watchImg, type: 'jpg'},{src: watchImg, type: 'jpg'}, {src: packImg, type: 'png'}, {src: packImg, type: 'png'}, {src: packImg, type: 'png'}, {src: watchImg, type: 'jpg'}, {src: packImg, type: 'png'}, {src: watchImg, type: 'jpg'}, {src: packImg, type: 'png'}, {src: watchImg, type: 'jpg'}, {src: watchImg, type: 'jpg'}];

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

    const calc = (i, index) => {
        let minPadding = Math.min(10/layoutData[index].v, 10/layoutData[index].h);
        let temp = 'calc((100% - ' + minPadding*(i - 1) + 'px) / ' + i + ')';
        return i === 1 ? '100%' : temp;
    }

    const onClickLayout = (i) => {
        setShowPreset(false);
        if (i !== selectedLayout) {
            Modal.confirm({
                title: 'Confirm',
                content: 'Are you sure you want to change layout?',
                onOk: () => changeLayout(i),
                footer: (_, { OkBtn, CancelBtn }) => (
                    <>
                    <CancelBtn />
                    <OkBtn />
                    </>
                ),
            });
        }
    }

    const changeLayout = (i) => {
        setSelectedLayout(i);
        setSelectedPanel();
        let temp = new Array(layoutData[i].v * layoutData[i].h).fill(1);
        let tempPanelList = [];
        let tempFileList = [];
        temp.forEach((t, i) => {
            tempPanelList.push({sound: 'volume_mute', fileList: [], name: `Panel ${i + 1}`, id: i.toString(), order: i});
            tempFileList.push({id: i.toString(), fileList: []});
        })
        setPanelList(tempPanelList);
        setFileList(tempFileList);
    }

    const onFileChange = (info, id) => {
        if (info.file.status === 'uploading') {
            let temp = [...fileList];
            temp.filter(p => p.id === id)[0].fileList = info.fileList.map(file => ({...file}));
            setFileList(temp);
            setSelectedPanel(id);
        }
        if (info.file.status === 'done') {
            let temp = [...fileList];
            temp.filter(p => p.id === id)[0].fileList = info.fileList.map(file => ({...file}));
            setFileList(temp);
            setSelectedPanel(id);
            document.getElementsByClassName('selected-panel-item-element')[0].children[0].children[0].children[0].children[1].children[1].click();
            setTimeout(() => {
                document.getElementsByClassName('selected-panel-item-element')[0].children[0].children[0].children[0].children[1].children[1].click();                
            }, 100);
        }
    };

    const toggleIcon = (id) => {
        let temp = [...panelList];
        temp.filter(t => t.id === id)[0].sound === 'volume_up' ? temp.filter(t => t.id === id)[0].sound = 'volume_mute' : temp.filter(t => t.id === id)[0].sound = 'volume_up';
        setPanelList(temp);
    }

    const removeImg = (id) => {
        fileList.filter(f => f.id === id)[0].fileList = [];
        document.getElementsByClassName('selected-panel-item-element')[0].children[0].children[0].children[0].children[1].children[1].click();
        document.getElementsByClassName('selected-panel-item-element')[0].children[0].children[0].children[0].children[1].children[1].click();
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

    const onMouseDown = () => {
        if (delay) {
                setMouseDown(false);
                setTouchDown(false);
                setFlag(true);
                setDelay(false);
                setSourcePanel(selectedPanel);
        } else {
            setMouseDown(false);
            setTouchDown(false);
        }
    };

    const useInterval = (func, delay) => {
        const savedcallback = useRef();
        
        const tick = () => {
          savedcallback.current();
        }
      
        useEffect(() => {
          savedcallback.current = func;
        }, [func]);
      
        useEffect(() => {
          if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
          }
        }, [delay]);
    }

    useInterval(onMouseDown, isMouseDown ? 1500 : null);
    useInterval(onMouseDown, isTouchDown ? 100 : null);

     const onClickPanel = (id) => {
        if (delay) {
            if (id === sourcePanel) {
                setFlag(false);
            }
            if (flag) {
                let temp = [];
                panelList.forEach(p => {
                    if (p.id === id) {
                        temp.push({...panelList.filter(pl => pl.id === sourcePanel)[0]});
                    } else if (p.id === sourcePanel) {
                        temp.push({...panelList.filter(pl => pl.id === id)[0]});
                    } else {
                        temp.push(p);
                    }
                })
                setSelectedPanel();
                setPanelList(temp);
                setFlag(false);
            }
            setDelay(false);
        }
    }

    const handleContextMenu = (id) => {
        clearTimeout(pressTimer);
    
        const timer = setTimeout(() => {
          setSelectedPanel(id); 
          setDelay(true); 
          setTouchDown(true);
        }, 1500);
    
        setPressTimer(timer);
    };
    
    const handleTouchEnd = (c) => {
        clearTimeout(pressTimer);
        
        if (c === 'small') {
            const currentTime = new Date().getTime();
            const timeElapsed = currentTime - lastTouchTime;
        
            if (timeElapsed < 300) { 
                setDetailPanel(panelList.filter(p => p.id === selectedPanel)[0]);
            }
            setLastTouchTime(currentTime);
        } else {
            const currentTime = new Date().getTime();
            const timeElapsed = currentTime - lastTouchTime;
        
            if (timeElapsed < 300) { 
                setDetailPanel();
            }
            setLastTouchTime(currentTime);
        }
    };

    // const handleMouseMove = (event) => {
    //     setXPos(event.clientX);
    // }

    // const presetTagDown = () => {
    //     setPrevX(xPos);
    // }

    // const presetTagUp = () => {
    //     if(prevX > xPos) {
    //         if (!showMenu && !showPreset) {
    //             setShowPreset(true);
    //         } else if (showMenu) {
    //             setShowMenu(false);
    //         }
    //     }
    //     if(prevX < xPos) {
    //         if (!showMenu && !showPreset) {
    //             setShowMenu(true);
    //         } else if (showPreset) {
    //             setShowPreset(false);
    //         }
    //     }
    // }

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

    // const onTouchStart = (e) => {
    //     setTouchEnd(null);
    //     setTouchStart({x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY});
    // }
      
    // const onTouchMove = (e) => setTouchEnd({x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY});
      
    // const onTouchEnd = (e) => {
    //     if (!touchStart || !touchEnd) return
    //     const distanceX = touchStart.x - touchEnd.x;
    //     const distanceY = touchStart.y - touchEnd.y;
    //     if (Math.abs(distanceX) > 1.2 * Math.abs(distanceY)) {
    //         const isLeftSwipe = distanceX > 50;
    //         const isRightSwipe = distanceX < -50;
    //         if (isLeftSwipe || isRightSwipe) console.log('swipe', isLeftSwipe ? 'left' : 'right')
    //         if (isLeftSwipe) {
    //             if (!showMenu && !showPreset) {
    //                 setShowPreset(true);
    //             } else if (showMenu) {
    //                 setShowMenu(false);
    //             }
    //         } else {
    //             if (!showMenu && !showPreset) {
    //                 setShowMenu(true);
    //             } else if (showPreset) {
    //                 setShowPreset(false);
    //             }
    //         }
    //         return false;
    //     }
    // }

    const mouseWheel = (e) => {
        document.getElementsByClassName('bottom-section')[0].scrollLeft += e.deltaY;
    }

    const keyDown = (e) => {
        if (e.code === "Escape") setShowPreset(false);
    }

    return (
        <>
            <div className='page-container' onKeyDown={keyDown} tabIndex="0">
                <div className="control-live-page">
                    <div className='preset-panel-tag' onClick={() => setShowPreset(true)}>Presets</div>
                    {/* <div className='menu-tag' onClick={() => {setShowPreset(false); setShowMenu(true)}}></div> */}
                    <div className='d-flex align-center j-c-space-between top-section'>
                        <p className='page-title'>Control Room Panel<span>LIVE</span></p>
                        <Button type='primary' className='custom-button'>Save as Preset</Button>
                        <a className='link-btn' href='/control/play'>Go Playback Mode</a> 
                    </div>
                    <Card className='top-card'>
                        <Row justify={'space-between'} style={{height: '100%'}}>
                            <Col span={17} style={{height: '100%'}}>
                                <div className='panel-item d-flex align-center flex-wrap'>
                                    {
                                        detailPanel ? 
                                        <div className={`panel-item-element ${detailPanel.id === selectedPanel && 'selected-panel-item-element'}`} onDoubleClick={() => setDetailPanel()} onTouchEnd={() => handleTouchEnd('large')} onClick={() => onClickPanel(detailPanel.id)} style={{height: '100%', width: '100%'}}>
                                            <Dragger
                                                name={detailPanel.name}
                                                multiple={false}
                                                maxCount={1}
                                                listType='picture-card'
                                                action='https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188'
                                                accept="image/png, image/jpeg"
                                                className='import-drag-file'
                                                openFileDialogOnClick={false}
                                                fileList={fileList.filter(f => f.id === detailPanel.id)[0].fileList}
                                                onChange={(e) => onFileChange(e, detailPanel.id)}
                                            >
                                                {fileList.filter(f => f.id === detailPanel.id)[0].fileList.length > 0 && <img onDragStart={(e) => e.preventDefault()} src={fileList.filter(f => f.id === detailPanel.id)[0].fileList[0].thumbUrl} alt='' />}
                                                <span className="material-symbols-outlined sound-icon" onClick={() => toggleIcon(detailPanel.id)}>{detailPanel.sound}</span>
                                                <span className="material-symbols-outlined remove-icon" onClick={() => removeImg(detailPanel.id)}>close</span>
                                                {fileList.filter(f => f.id === detailPanel.id)[0].fileList.length > 0 &&<div className='tag'>
                                                    <p className='media-format'>Input 1</p>
                                                </div>}
                                            </Dragger>
                                        </div>
                                        :
                                        panelList.map((panel, index) => 
                                            <div className={`panel-item-element ${panel.id === selectedPanel && 'selected-panel-item-element'} ${panel.id !== selectedPanel && flag && 'target-panel-item-element'}`} onDoubleClick={() => setDetailPanel(panel)} onClick={() => onClickPanel(panel.id)} onMouseDown={() => {setSelectedPanel(panel.id); setDelay(true); setMouseDown(true);}} onTouchStart={() => handleContextMenu(panel.id)} onContextMenu={(e) => e.preventDefault()} onTouchEnd={() => handleTouchEnd('small')} style={{height: calc(layoutData[selectedLayout].v, selectedLayout), width: calc(layoutData[selectedLayout].h, selectedLayout)}}>
                                                <Dragger
                                                    name={panel.name}
                                                    multiple={false}
                                                    maxCount={1}
                                                    listType='picture-card'
                                                    action='https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188'
                                                    accept="image/png, image/jpeg"
                                                    className='import-drag-file'
                                                    openFileDialogOnClick={false}
                                                    fileList={fileList.filter(f => f.id === panel.id)[0].fileList}
                                                    onChange={(e) => onFileChange(e, panel.id)}
                                                >
                                                    {fileList.filter(f => f.id === panel.id)[0].fileList.length > 0 && <img onDragStart={(e) => e.preventDefault()} src={fileList.filter(f => f.id === panel.id)[0].fileList[0].thumbUrl} alt='' />}
                                                    <span className="material-symbols-outlined sound-icon" onClick={() => toggleIcon(panel.id)}>{panel.sound}</span>
                                                    <span className="material-symbols-outlined remove-icon" onClick={() => removeImg(panel.id)}>close</span>
                                                    {fileList.filter(f => f.id === panel.id)[0].fileList.length > 0 &&<div className='tag'>
                                                        <p className='media-format'>Input 1</p>
                                                    </div>}
                                                </Dragger>
                                            </div>
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
                        <div className='d-flex align-center bottom-section' style={{width: '100%', height: '100%', overflowX: 'auto'}} onWheel={mouseWheel}>
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

                <div className="preset-panel" style={{left: showPreset ? '0px' : '100vw'}}>
                    <p className='title'>Double tap to activate the preset</p>
                    <Row gutter={[10, 10]} wrap>
                        {
                            layoutData.map((layout, index) =>
                                <Col xl={6} lg={8} md={12}>
                                    <div className={'preset-card ' + (index === presetLayout ? 'selected-preset-card' : '')} onClick={() => setPresetLayout(index)} onDoubleClick={() => onClickLayout(index)}>
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
                                                <Input className='layout-name' bordered={false} value={layout.name} onChange={(e) => updateLayoutName(e, index)}  disabled={index !== presetLayout} />
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

                {/* <div className="menu-container" style={{left: showMenu ? '0px' : '-250px'}}>
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
                </div> */}
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

export default LiveControlRoom;
