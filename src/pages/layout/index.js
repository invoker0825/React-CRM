import React, { useState, useEffect } from 'react';
import { Button, Card, Space, Select, Modal, Input, Row, Col, notification } from 'antd';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { SearchOutlined } from '@ant-design/icons';
import { Responsive, WidthProvider } from "react-grid-layout";
import axios from 'axios';
import Table from '../../components/table';
import './layout.scss';

const ResponsiveGridLayout = WidthProvider(Responsive);

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
const colors = ['#ff80ed', '#065535', '#ff0000', '#ffd700', '#00ffff', '#0000ff', '#bada55', '#00ff00'];

const Layout = () => {

    const [currentUser, setCurrentUser] = useState();
    const [editShow, setEditShow] = useState(false);
    const [VWShow, setVWShow] = useState(false);
    const [widthCount, setWidthCount] = useState(1);
    const [heightCount, setHeightCount] = useState(1);
    const [tempAreaWidth, setTempAreaWidth] = useState('1920');
    const [tempAreaHeight, setTempAreaHeight] = useState('1080');
    const [gridSize, setGridSize] = useState([0, 0]);
    const [activePanel, setActivePanel] = useState('');
    const [ratio, setRatio] = useState('16:9');
    const [realRatio, setRealRatio] = useState(0);
    const [orientation, setOrientation] = useState('landscape');
    const [layoutListData, setLayoutListData] = useState([]);
    const [layoutData, setLayoutData] = useState([]);
    const [newLayout, setNewLayout] = useState({Name: '', CreatedBy: '', ModifiedBy: '', resolution: {Width: 1920, Height: 1080}, details: [{PanelName: '0', Width: 1920, Height: 1080, X:0, Y:0, icon: 'volume_mute'}]});
    const [mode, setMode] = useState('new');
    const [searchText, setSearchText] = useState('');
    const [api, contextHolder] = notification.useNotification();

    const layoutListColumns = [
        {
            title: 'Name',
            dataIndex: 'Name'
        },
        {
            title: 'Layout',
            dataIndex: 'layout',
            render: (_, record) => <>
                <div className='table-layout' style={{width: `${record.resolution.Width * 49.5 / record.resolution.Height}px`}}>
                    {
                        record.details.map((detail, i) => 
                            <div style={{width: `${detail.Width * 49.5 / record.resolution.Height}px`, height: `${detail.Height * 49.5 / record.resolution.Height}px`, left: `${detail.X * 49.5 / record.resolution.Height}px`, top: `${detail.Y * 49.5 / record.resolution.Height}px`, backgroundColor: `${colors[i]}`, position: 'absolute'}}></div>
                        )
                    }
                </div>
            </>
        },
        {
            title: 'By User',
            dataIndex: 'CreatedBy',
            render: (CreatedBy) => <><p className='black-text'>{CreatedBy}</p><p className='small-text'>{CreatedBy}</p></>,
        },
        {
            title: 'Resolution (px)',
            dataIndex: 'resolution',
            render: (resolution) => <p>{resolution.Name}</p>,
            sorter: (a, b) => a.resolution.Name.localeCompare(b.resolution)
        },
        {
            title: 'Orientation',
            dataIndex: 'orientation',
            render: (_, record) => (
                <p>{record.resolution.Width > record.resolution.Height ? 'Landscape' : 'Portrait'}</p>
            ),
        },
        {
            title: 'Action',
            dataIndex: 'actino',
            render: (_, record) => (
              <Space size="small">
                <span className="material-symbols-outlined" onClick={() => editLayoutListData(record)}>edit</span>
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
                    d.details.forEach(detail => {
                        detail.icon = 'volume_mute';
                    })
                })
                setSearchText('');
                setLayoutListData(res.data);
                setLayoutData(res.data);
            }
        }).catch((err) => {
            console.log('err-------------', err)
        });
    }, []);

    useEffect(() => {
        if (1920 / parseInt(newLayout.resolution.Width) >= 1080 / parseInt(newLayout.resolution.Height)) {
            setGridSize([Math.floor(newLayout.resolution.Width * 612 / newLayout.resolution.Height), 612]);
            setRealRatio(612 / newLayout.resolution.Height);
        } else {
            setGridSize([1089, Math.floor(newLayout.resolution.Height * 1089 / newLayout.resolution.Width)]);
            setRealRatio(1089 / newLayout.resolution.Width);
        }
    }, [tempAreaWidth, tempAreaHeight]);

    const onLayoutChange = (layout) => {
        let temp = {...newLayout};
        temp.details.forEach(t => {
            const l = layout.filter(lo => lo.i === t.PanelName)[0];
            t.X = Math.floor(l.x);
            t.Y = l.y > gridSize[1] - l.h ? gridSize[1] - l.h : l.y;
            t.Width = Math.floor(l.w);
            t.Height = Math.floor(l.h);
        })
        setNewLayout(temp);
        setActivePanel('');
    }

    const editLayoutListData = (layout) => {
        let temp = {ID: layout.ID, Name: layout.Name, CreatedBy: currentUser.Email, ModifiedBy: currentUser.Email, resolution: {ID: layout.resolution.ID, Width: layout.resolution.Width, Height: layout.resolution.Height}, child: {...layout.child}, details: []};
        layout.details.forEach(detail => {
            if (1920 / parseInt(layout.resolution.Width) >= 1080 / parseInt(layout.resolution.Height)) {
                setRealRatio(612 / layout.resolution.Height);
                temp.details.push({...detail, Width: detail.Width * 612 / layout.resolution.Height, Height: detail.Height * 612 / layout.resolution.Height, X: detail.X * 612 / layout.resolution.Height, Y: detail.Y * 612 / layout.resolution.Height});
            } else {
                setRealRatio(1089 / layout.resolution.Width);
                temp.details.push({...detail, Width: detail.Width * 1089 / layout.resolution.Width, Height: detail.Height * 1089 / layout.resolution.Width, X: detail.X * 1089 / layout.resolution.Width, Y: detail.Y * 1089 / layout.resolution.Width});
            }
        })
        setNewLayout(temp)
        setTempAreaWidth(layout.resolution.Width);
        setTempAreaHeight(layout.resolution.Height);
        setMode('edit');
        setEditShow(true);
    }

    const generateVW = () => {
        let tempCount = newLayout.details.length;
        let temp = {...newLayout};
        for (let i = 0; i < heightCount; i++) {
            for (let j = 0; j < widthCount; j++) {
                tempCount ++;
                temp.details.push({PanelName: `${tempCount}`, icon: 'volume_mute', Width: 100, Height: 100, X: 100*j, Y: 100*i});
            }            
        }
        setVWShow(false);
        setNewLayout(temp);
    }

    const onDragEnd = (result) => {
        if (!result.destination) {
          return;
        }
    
        const tempItems = reorder(
            newLayout.details,
            result.source.index,
            result.destination.index
        );

        let temp = {...newLayout};
        temp.details = tempItems;
        setNewLayout(temp);
    }
    
    const addPanel = () => {
        let tempCount = newLayout.details.length;
        let temp = {...newLayout};
        temp.details.push({PanelName: `${tempCount}`, icon: 'volume_mute', Width: 100, Height: 100, X: 0, Y: 0});
        setNewLayout(temp);
    }

    const removePanel = (i) => {
        let temp = {...newLayout};
        temp.details.splice(i, 1);
        setNewLayout(temp);
    }

    const changeOrientation = (e) => {
        setOrientation(e);
        let temp = {...newLayout};
        let tempWidth = temp.resolution.Width;
        setTempAreaWidth(temp.resolution.Height);
        setTempAreaHeight(tempWidth);
        temp.resolution.Width = temp.resolution.Height;
        temp.resolution.Height = tempWidth;
        setNewLayout(temp);
    }

    const changeRatio = (e) => {
        setRatio(e);
        if (e !== 'custom') {
            if (orientation === 'landscape') {
                let temp = {...newLayout};
                temp.resolution.Height = Math.floor(temp.resolution.Width * parseInt(e.split(':')[1]) / parseInt(e.split(':')[0]));
                setTempAreaHeight(Math.floor(temp.resolution.Width * parseInt(e.split(':')[1]) / parseInt(e.split(':')[0])));
                setNewLayout(temp);
            } else {
                let temp = {...newLayout};
                temp.resolution.Height = Math.floor(temp.resolution.Width * parseInt(e.split(':')[0]) / parseInt(e.split(':')[1]));
                setTempAreaHeight(Math.floor(temp.resolution.Width * parseInt(e.split(':')[0]) / parseInt(e.split(':')[1])));
                setNewLayout(temp);
            }
        }
    }

    const updateResolution = (e, c) => {
        let temp = {...newLayout};
        if(orientation === 'landscape') {
            if (c === "Width") {
                temp.resolution.Width = parseInt(e.target.value);
                temp.resolution.Height = Math.floor(e.target.value * parseInt(ratio.split(':')[1]) / parseInt(ratio.split(':')[0]));
                setTempAreaHeight(Math.floor(e.target.value * parseInt(ratio.split(':')[1]) / parseInt(ratio.split(':')[0])));
            } else {
                temp.resolution.Height = parseInt(e.target.value);
                temp.resolution.Width = Math.floor(e.target.value * parseInt(ratio.split(':')[0]) / parseInt(ratio.split(':')[1]));
                setTempAreaWidth(Math.floor(e.target.value * parseInt(ratio.split(':')[0]) / parseInt(ratio.split(':')[1])));
            }
        } else {
            if (c === "Width") {
                temp.resolution.Width = parseInt(e.target.value);
                temp.resolution.Height = Math.floor(e.target.value * parseInt(ratio.split(':')[0]) / parseInt(ratio.split(':')[1]));
                setTempAreaHeight(Math.floor(e.target.value * parseInt(ratio.split(':')[0]) / parseInt(ratio.split(':')[1])));
            } else {
                temp.resolution.Height = parseInt(e.target.value);
                temp.resolution.Width = Math.floor(e.target.value * parseInt(ratio.split(':')[1]) / parseInt(ratio.split(':')[0]));
                setTempAreaWidth(Math.floor(e.target.value * parseInt(ratio.split(':')[1]) / parseInt(ratio.split(':')[0])));
            }
        }
        setNewLayout(temp);
    }

    const toggleIcon = (i) => {
        let temp = {...newLayout};
        temp.details[i].icon === 'volume_up' ? temp.details[i].icon = 'volume_mute' : temp.details[i].icon = 'volume_up';
        setNewLayout(temp);
    }

    const confirmSave = () => {
        Modal.confirm({
            title: 'Confirm',
            content: 'Are you sure you want to save?',
            onOk: saveLayout,
            footer: (_, { OkBtn, CancelBtn }) => (
              <>
                <CancelBtn />
                <OkBtn/>
              </>
            ),
        });
    }

    const saveLayout = () => {
        let temp = {...newLayout};
        temp.details.forEach(detail => {
            detail.Width = Math.floor(detail.Width*parseInt(temp.resolution.Width)/gridSize[0]);
            detail.Height = Math.floor(detail.Height*parseInt(temp.resolution.Height)/gridSize[1]);
            detail.X = Math.ceil(detail.X*parseInt(temp.resolution.Width)/gridSize[0]);
            detail.Y = Math.ceil(detail.Y*parseInt(temp.resolution.Height)/gridSize[1]);
        })
        if (temp.Name !== '' && temp.resolution.Height > 0 && temp.resolution.Width > 0) {
            if (mode === 'new') {
                axios.post('http://localhost:5001/api/layout/add', temp)
                .then((res) => {
                    if (res.status === 200) {
                        api.success({
                            message: 'Success',
                            description:
                            'The new report has been added successfully.',
                        });
                        setEditShow(false);
                        
                        res.data.forEach(d => {
                            d.details.sort((a, b) => a.Panel - b.Panel);
                            d.details.forEach(detail => {
                                detail.icon = 'volume_mute';
                            })
                        })
                        setSearchText('');
                        setLayoutListData(res.data);
                        setLayoutData(res.data);
                    }
                }).catch((err) => {
                    console.log('err-------------', err)
                });
            } else {
                axios.post('http://localhost:5001/api/layout/update', temp)
                .then((res) => {
                    if (res.status === 200) {
                        api.success({
                            message: 'Success',
                            description:
                            'The layout has been updated successfully.',
                        });
                        setEditShow(false);
                        
                        res.data.forEach(d => {
                            d.details.sort((a, b) => a.Panel - b.Panel);
                            d.details.forEach(detail => {
                                detail.icon = 'volume_mute';
                            })
                        })
                        setSearchText('');
                        setLayoutListData(res.data);
                        setLayoutData(res.data);
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

    const changeSearch = (e) => {
        setSearchText(e.target.value);
        let temp = [...layoutData];
        e.target.value !== '' ? setLayoutListData([...temp.filter(t => t.Name.toLowerCase().includes(e.target.value.toLowerCase()))]) : setLayoutListData([...temp]);
    }

    return (
        <>
            {contextHolder}
            <div className="layout-list-page">
                <Card className='table-card'>
                    <div className='d-flex align-center j-c-space-between top-section'>
                        <p className='card-title'>Layout List</p>
                        <div className='d-flex align-center'>
                            <Input placeholder="search..." prefix={<SearchOutlined />} className='search-input' value={searchText} onChange={changeSearch}/>
                            <Button className='view-mode-btn' type='primary' onClick={() => {setNewLayout({Name: '', CreatedBy: currentUser.Email, ModifiedBy: currentUser.Email, resolution: {Width: 1920, Height: 1080}, details: [{PanelName: '0', Width: 1920, Height: 1080, X:0, Y:0, icon: 'volume_mute'}]}); setEditShow(true); setMode('new');}}>
                                <div className='d-flex align-center j-c-center'>
                                    <span className="material-symbols-outlined">add</span>Layout
                                </div>
                            </Button> 
                        </div>
                    </div>
                    <Table
                        columns={layoutListColumns}
                        dataSource={layoutListData}
                    />
                </Card>
            </div>
            
            <Modal
                title='Layout'
                centered
                open={editShow}
                onCancel={() => setEditShow(false)}
                footer={false}
                className='edit-layoutlist-modal'
            >
                <Card style={{marginBottom: '17px'}}>
                    <p className='sub-title'>Details</p>
                    <Row gutter={10} align='bottom'>
                        <Col span={4}>
                            <p className='select-label'>Name</p>
                            <Input className='grey-input' value={newLayout.Name} onChange={(e) => setNewLayout((prevState) => ({ ...prevState, Name: e.target.value }))}/>
                        </Col>
                        <Col span={3}>
                            <p className='select-label'>Orientation</p>
                            <Select
                                defaultValue='landscape'
                                options={[
                                    {
                                        value: 'landscape',
                                        label: 'Landscape'
                                    },
                                    {
                                        value: 'portrait',
                                        label: 'Portrait'
                                    }
                                ]}
                                onChange={(e) => changeOrientation(e)}
                            />
                        </Col>
                        <Col span={3} style={{paddingRight: '30px'}}>
                            <p className='select-label'>Ratio</p>
                            <Select
                                defaultValue='16:9'
                                options={[
                                    {
                                        value: '16:9',
                                        label: '16:9'
                                    },
                                    {
                                        value: '4:3',
                                        label: '4:3'
                                    },
                                    {
                                        value: '8:5',
                                        label: '8:5'
                                    },
                                    {
                                        value: 'custom',
                                        label: 'custom'
                                    },
                                ]}
                                onChange={(e) => changeRatio(e)}
                            />
                        </Col>
                        <Col span={2}>
                            <p className='select-label'>Width (px)</p>
                            <Input className='grey-input' value={tempAreaWidth} onChange={(e) => setTempAreaWidth(e.target.value)} onBlur={(e) => updateResolution(e, 'Width')} />

                        </Col>
                        <Col span={2}>
                            <p className='select-label'>Height (px)</p>
                            <Input className='grey-input'  value={tempAreaHeight} onChange={(e) => setTempAreaHeight(e.target.value)} onBlur={(e) => updateResolution(e, 'Height')} />
                        </Col>
                    </Row>
                </Card>
                <Row gutter={10} className='layout-section'>
                    <Col span={18} className='left-section'>
                        <ResponsiveGridLayout
                            layout={newLayout.details}
                            onLayoutChange={onLayoutChange}
                            onDragStop={onLayoutChange}
                            isResizable={true}
                            cols={{ lg: gridSize[0], md: gridSize[0], sm: gridSize[0], xs: gridSize[0], xxs: gridSize[0] }}
                            rowHeight={1}
                            autoSize={false}
                            margin={[0, 0]}
                            isBounded={false}
                            allowOverlap
                            onResizeStart={(ls, l) => setActivePanel(l.i)}
                            onResizeEnd={() => setActivePanel('')}
                            onDragStart={(ls, l) => setActivePanel(l.i)}
                            style={{width: gridSize[0] + 'px', height: gridSize[1] + 'px'}}
                        >
                            {
                                newLayout.details.map(panel => 
                                    <div className='panel-div' key={panel.PanelName} onMouseDown={() => console.log('------------------')} data-grid={{ x: panel.X, y: panel.Y, w: panel.Width > gridSize[0] ? gridSize[0] : panel.Width, h: panel.Height > gridSize[1] ? gridSize[1] : panel.Height, maxW: gridSize[0], maxH: gridSize[1], isResizable: true}}>
                                    </div>
                                )
                            }
                        </ResponsiveGridLayout>
                    </Col>
                    <Col span={6} className='right-section'>
                        <Card className='right-card'>
                            <p className='sub-title'>Layout Toolbar</p>
                            <Row gutter={10}>
                                <Col span={9}>
                                    <Button type='primary' onClick={addPanel}><span className="material-symbols-outlined">add</span>Panel</Button>
                                </Col>
                                <Col span={15}>
                                    <Button type='primary' onClick={()=> setVWShow(true)}>VW Generator</Button>
                                </Col>
                            </Row>
                            <div className='drag-section'>
                                <DragDropContext onDragEnd={onDragEnd}>
                                    <Droppable droppableId="droppable">
                                        {(provided, snapshot) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                            >
                                                {newLayout.details.map((item, index) => (
                                                    <Draggable key={item.PanelName} draggableId={item.PanelName} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                            >
                                                                <div className={activePanel === item.PanelName ? 'layout-drag-item active-layout-drag-item' : 'layout-drag-item'}>
                                                                    <div className='d-flex align-center'>
                                                                        <span className="material-symbols-outlined" {...provided.dragHandleProps}>drag_indicator</span>
                                                                        <div style={{marginLeft: '10px'}}>
                                                                            <p className='layout-name'>Panel {item.PanelName}</p>
                                                                            <p className='layout-position'><span>W</span>{Math.floor(item.Width/realRatio)} <span>H</span>{Math.floor(item.Height/realRatio)} <span>X</span>{Math.ceil(item.X/realRatio)} <span>Y</span>{Math.ceil(item.Y/realRatio)}</p>

                                                                        </div>
                                                                    </div>
                                                                    <div className='d-flex align-center'>
                                                                        {item.icon && <span className="material-symbols-outlined" onClick={() => toggleIcon(index)}>{item.icon}</span>}
                                                                        <span className="material-symbols-outlined delete-btn" onClick={() => removePanel(index)}>delete</span>
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
                        </Card>
                    </Col>
                </Row>
                <Button type='primary' className='save-button' onClick={confirmSave}>Save Layout</Button>
                <Button className='modal-cancel-button' onClick={() => {setEditShow(false);}}>Cancel</Button>
            </Modal>

            <Modal
                title='VW Generator'
                centered
                open={VWShow}
                onCancel={() => setVWShow(false)}
                footer={false}
                className='edit-layoutlist-modal VW-modal'
            >
                <Row gutter={10}>
                    <Col span={12}>
                        <p className='select-label'>Width</p>
                        <Select
                            value={widthCount}
                            options={[
                                {
                                    value: 1,
                                    label: '1'
                                },
                                {
                                    value: 2,
                                    label: '2'
                                },
                                {
                                    value: 3,
                                    label: '3'
                                },
                                {
                                    value: 4,
                                    label: '4'
                                }
                            ]}
                            onChange={(e) => setWidthCount(e)}
                        />
                    </Col>
                    <Col span={12}>
                        <p className='select-label'>Height</p>
                        <Select
                            value={heightCount}
                            options={[
                                {
                                    value: 1,
                                    label: '1'
                                },
                                {
                                    value: 2,
                                    label: '2'
                                },
                                {
                                    value: 3,
                                    label: '3'
                                },
                                {
                                    value: 4,
                                    label: '4'
                                }
                            ]}
                            onChange={(e) => setHeightCount(e)}
                        />
                    </Col>
                </Row>
                <Row style={{height: '200px'}}>
                    {[...Array(widthCount * heightCount)].map(() => 
                        <Col span={24/widthCount} style={{height: `${100/heightCount}%`}}>
                            <Card className='VW-card'></Card>
                        </Col>
                    )}
                </Row>
                <Button type='primary' onClick={generateVW}>OK</Button>
                <Button className='modal-cancel-button' onClick={() => setVWShow(false)}>Cancel</Button>
            </Modal>
        </>
    );
}

export default Layout;
