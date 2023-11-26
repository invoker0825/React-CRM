import React, { useState } from 'react';
import { Button, Card, Space, Select, Modal, Input, Row, Col } from 'antd';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { SearchOutlined } from '@ant-design/icons';
import Tag from '../../components/tag';
import Table from '../../components/table';
import packImg from '../../assets/img/pack.png';
import watchImg from '../../assets/img/watch.png';
import './layout.scss';

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
    const [panelList, setPanelList] = useState([
        {
            name: 'Panel 1',
            position: {
                w: '308.69',
                h: '288.4',
                x: '20',
                y: '20',
            },
            icon: 'volume_mute'
        },
        {
            name: 'Panel 2',
            icon: 'volume_up'
        },
        {
            name: 'Panel 3',
            icon: 'volume_mute'
        },
        {
            name: 'Panel 4',
            icon: 'volume_mute'
        },
    ]);

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

    const editLayoutListData = () => {
        setEditShow(true);
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
        let temp = [...panelList];
        temp.push({name: `Panel ${temp.length + 1}`, icon: 'volume_mute'});
        setPanelList(temp);
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
                            />
                        </Col>
                        <Col span={2} style={{paddingRight: '30px'}}>
                            <p className='select-label'>Ratio</p>
                            <Input className='grey-input' defaultValue='16:9' />
                        </Col>
                        <Col span={2}>
                            <p className='select-label'>Width (px)</p>
                            <Input className='grey-input' defaultValue='1920' />
                        </Col>
                        <Col span={2}>
                            <p className='select-label'>Height (px)</p>
                            <Input className='grey-input' defaultValue='1080' />
                        </Col>
                    </Row>
                </Card>
                <Row gutter={10}>
                    <Col span={18} className='left-section'>
                        <Card>
                            
                        </Card>
                    </Col>
                    <Col span={6}>
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
                                                                            {item.position && <p className='layout-position'><span>W</span>{item.position.w} <span>H</span>{item.position.h} <span>X</span>{item.position.x} <span>Y</span>{item.position.y}</p>}
                                                                        </div>
                                                                    </div>
                                                                    {item.icon && <span className="material-symbols-outlined" onClick={() => toggleIcon(index)}>{item.icon}</span>}
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
                <Button type='primary' onClick={() => setVWShow(false)}>OK</Button>
                <Button className='modal-cancel-button' onClick={() => setVWShow(false)}>Cancel</Button>
            </Modal>
        </>
    );
}

export default Layout;
