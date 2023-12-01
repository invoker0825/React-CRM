import React, { useState, useEffect } from 'react';
import { Button, Card, Space, Select, Modal, Input, Row, Col } from 'antd';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { SearchOutlined } from '@ant-design/icons';
import { Responsive, WidthProvider } from "react-grid-layout";
import Tag from '../../components/tag';
import Table from '../../components/table';
import packImg from '../../assets/img/pack.png';
import watchImg from '../../assets/img/watch.png';
import './layout.scss';

const ResponsiveGridLayout = WidthProvider(Responsive);

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const Layout = () => {

    const [editShow, setEditShow] = useState(false);
    const [VWShow, setVWShow] = useState(false);
    const [widthCount, setWidthCount] = useState(1);
    const [heightCount, setHeightCount] = useState(1);
    const [areaWidth, setAreaWidth] = useState('1920');
    const [areaHeight, setAreaHeight] = useState('1080');
    const [gridSize, setGridSize] = useState([0, 0])
    const [panelList, setPanelList] = useState([
        {
            name: 'Panel 1',
            w: 308,
            h: 288,
            x: 20,
            y: 20,
            icon: 'volume_mute'
        },
        {
            name: 'Panel 2',
            w: 30,
            h: 28,
            x: 34,
            y: 234,
            icon: 'volume_up'
        },
        {
            name: 'Panel 3',
            w: 123,
            h: 54,
            x: 123,
            y: 20,
            icon: 'volume_mute'
        },
        {
            name: 'Panel 4',
            w: 58,
            h: 92,
            x: 265,
            y: 123,
            icon: 'volume_mute'
        },
    ]);
    const [panelCount, setPanelCount] = useState(panelList.length);

    const layoutListColumns = [
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
            title: 'By User',
            dataIndex: 'user',
            render: (user) => <><p className='black-text'>{user.name}</p><p className='small-text'>{user.email}</p></>,
        },
        {
            title: 'Resolution (px)',
            dataIndex: 'resolution',
            sorter: (a, b) => a.resolution.localeCompare(b.resolution)
        },
        {
            title: 'Orientation',
            dataIndex: 'orientation'
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
                <span className="material-symbols-outlined" onClick={() => editLayoutListData()}>edit</span>
              </Space>
            ),
        }
    ];
    
    const layoutListData = [
        {
            key: '1',
            name: 'Layout 1',
            layout: packImg,
            resolution: '800x600',
            orientation: 'Landscape',
            user: {name: 'John Bushmill', email: 'Johnb@mail.com'},
            status: {label: 'Uploading', color: 'orange'}
        },
        {
            key: '2',
            name: 'Layout 2',
            layout: watchImg,
            resolution: '1920x1080',
            orientation: 'Portrait',
            user: {name: 'Ilham Budi A', email: 'ilahmbudi@mail.com'},
            status: {label: 'Processing', color: 'purple'}
        }
    ];

    useEffect(() => {
        if (1920 / parseInt(areaWidth) >= 1080 / parseInt(areaHeight)) {
            setGridSize([Math.floor(areaWidth * 612 / areaHeight), 612])
        } else {
            setGridSize([1089, Math.floor(areaHeight * 1089 / areaWidth)])
        }
    }, [areaWidth, areaHeight]);

    const onLayoutChange = (layout) => {
        let temp = [...panelList];
        temp.forEach(t => {
            const l = layout.filter(lo => lo.i === t.name)[0];
            t.x = Math.floor(l.x);
            t.y = l.y > gridSize[1] - l.h ? gridSize[1] - l.h : l.y;
            t.w = Math.floor(l.w);
            t.h = Math.floor(l.h);
        })
        setPanelList(temp);
    }

    const editLayoutListData = () => {
        setEditShow(true);
    }

    const generateVW = () => {
        let tempCount = panelCount;
        let temp = [...panelList];
        for (let i = 0; i < heightCount; i++) {
            for (let j = 0; j < widthCount; j++) {
                tempCount ++;         
                temp.push({name: `Panel ${tempCount}`, icon: 'volume_mute', w: 100, h: 100, x: 100*j, y: 100*i});
            }            
        }
        setVWShow(false);
        setPanelList(temp);
        setPanelCount(tempCount);
    }

    const onDragEnd = (result) => {
        if (!result.destination) {
          return;
        }
    
        const tempItems = reorder(
            panelList,
            result.source.index,
            result.destination.index
        );
        setPanelList(tempItems);
    }
    
    const addPanel = () => {
        let tempCount = panelCount + 1;
        let temp = [...panelList];
        temp.push({name: `Panel ${tempCount}`, icon: 'volume_mute', w: 100, h: 100, x: 0, y: 0});
        setPanelList(temp);
        setPanelCount(tempCount);
    }

    const removePanel = (i) => {
        let temp = [...panelList];
        temp.splice(i, 1);
        setPanelList(temp);
    }

    const changeOrientation = (e) => {
        console.log('-----------------', e)
        if (e === 'landscape') {
            setAreaHeight('1080');
            setAreaWidth('1920');
        } else {
            setAreaHeight('1080');
            setAreaWidth('600');
        }
    }

    const toggleIcon = (i) => {
        let temp = [...panelList];
        temp[i].icon === 'volume_up' ? temp[i].icon = 'volume_mute' : temp[i].icon = 'volume_up';
        setPanelList(temp);
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
        setEditShow(false);
    }

    return (
        <>
            <div className="layout-list-page">
                <Card className='table-card'>
                    <div className='d-flex align-center j-c-space-between top-section'>
                        <p className='card-title'>Layout List</p>
                        <div className='d-flex align-center'>
                            <Input placeholder="search..." prefix={<SearchOutlined />}  className='search-input'/>
                            <Button className='view-mode-btn' type='primary' onClick={() => setEditShow(true)}>
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
                            <Input className='grey-input' defaultValue='Layout 1' />
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
                        <Col span={2} style={{paddingRight: '30px'}}>
                            <p className='select-label'>Ratio</p>
                            <Input className='grey-input' defaultValue='16:9' />
                        </Col>
                        <Col span={2}>
                            <p className='select-label'>Width (px)</p>
                            <Input className='grey-input' defaultValue={areaWidth} onBlur={(e) => setAreaWidth(e.target.value)} />
                        </Col>
                        <Col span={2}>
                            <p className='select-label'>Height (px)</p>
                            <Input className='grey-input' defaultValue={areaHeight} onBlur={(e) => setAreaHeight(e.target.value)} />
                        </Col>
                    </Row>
                </Card>
                <Row gutter={10} className='layout-section'>
                    <Col span={18} className='left-section'>
                        <ResponsiveGridLayout
                            layout={panelList}
                            onLayoutChange={onLayoutChange}
                            onDragStop={onLayoutChange}
                            isResizable={true}
                            cols={{ lg: gridSize[0], md: gridSize[0], sm: gridSize[0], xs: gridSize[0], xxs: gridSize[0] }}
                            rowHeight={1}
                            autoSize={false}
                            margin={[0, 0]}
                            isBounded={false}
                            allowOverlap
                            style={{width: gridSize[0] + 'px', height: gridSize[1] + 'px'}}
                        >
                            {
                                panelList.map(panel => 
                                    <div className='panel-div' key={panel.name} data-grid={{ x: panel.x, y: panel.y, w: panel.w > gridSize[0] ? gridSize[0] : panel.w, h: panel.h > gridSize[1] ? gridSize[1] : panel.h, maxW: gridSize[0], maxH: gridSize[1], isResizable: true}}>
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
                                                {panelList.map((item, index) => (
                                                    <Draggable key={item.name} draggableId={item.name} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                            >
                                                                <div className='layout-drag-item'>
                                                                    <div className='d-flex align-center'>
                                                                        <span className="material-symbols-outlined" {...provided.dragHandleProps}>drag_indicator</span>
                                                                        <div style={{marginLeft: '10px'}}>
                                                                            <p className='layout-name'>{item.name}</p>
                                                                            <p className='layout-position'><span>W</span>{Math.floor(item.w*parseInt(areaWidth)/gridSize[0])} <span>H</span>{Math.floor(item.h*parseInt(areaHeight)/gridSize[1])} <span>X</span>{Math.ceil(item.x*parseInt(areaWidth)/gridSize[0])} <span>Y</span>{Math.ceil(item.y*parseInt(areaHeight)/gridSize[1])}</p>
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
                <Button className='modal-cancel-button' onClick={() => setEditShow(false)}>Cancel</Button>
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
