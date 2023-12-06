import React, { useState, useEffect } from 'react';
import { Button, Card, Checkbox, Select, Modal, Input, Row, Col, Collapse, Upload } from 'antd';
import { ListManager } from "react-beautiful-dnd-grid";
import { SearchOutlined } from '@ant-design/icons';
import packImg from '../../assets/img/pack.png';
import watchImg from '../../assets/img/watch.png';
import './liveControlRoom.scss';

const { Dragger } = Upload;
const CheckboxGroup = Checkbox.Group;

const LiveControlRoom = () => {

    const [selectedLayout, setSelectedLayout] = useState(0);
    const [panelList, setPanelList] = useState([{sound: 'volume_mute', fileList: [], name: 'panel 1', id: '0', order: 0}]);
    const [selectedPanel, setSelectedPanel] = useState();
    const [totalWidth, setTotalWidth] = useState(0);
    const [totalHeight, setTotalHeight] = useState(0);
    const [filterShow, setFilterShow] = useState(false);
    const [checkedList, setCheckedList] = useState([]);
    const [fileList, setFileList] = useState([{id: '0',fileList: []}]);

    const fileTypes = ['Video', 'Picture', 'Stream', 'Powerpoint', 'Capture Card'];
    const checkAll = fileTypes.length === checkedList.length;
    const indeterminate = checkedList.length > 0 && checkedList.length < fileTypes.length;

    const imageList = [{src: watchImg, type: 'jpg'}, {src: packImg, type: 'png'}, {src: packImg, type: 'png'}, {src: packImg, type: 'png'}, {src: watchImg, type: 'jpg'}, {src: packImg, type: 'png'}, {src: watchImg, type: 'jpg'}, {src: packImg, type: 'png'}, {src: watchImg, type: 'jpg'},{src: watchImg, type: 'jpg'}, {src: packImg, type: 'png'}, {src: packImg, type: 'png'}, {src: packImg, type: 'png'}, {src: watchImg, type: 'jpg'}, {src: packImg, type: 'png'}, {src: watchImg, type: 'jpg'}, {src: packImg, type: 'png'}, {src: watchImg, type: 'jpg'}, {src: watchImg, type: 'jpg'}];

    const layoutData = [
        {h: 1, v: 1},
        {h: 2, v: 2},
        {h: 3, v: 2},
        {h: 2, v: 3},
        {h: 3, v: 3},
        {h: 4, v: 2},
        {h: 4, v: 3}
    ];

    useEffect(() => {
        const desc_object = document.getElementsByClassName("panel-item");
        if (desc_object) {
            setTotalWidth(document.getElementsByClassName('panel-item')[0]?.clientWidth);
            setTotalHeight(document.getElementsByClassName('panel-item')[0]?.clientHeight);
        }      
    }, [totalWidth])

    const calc = (i, index) => {
        let minPadding = Math.min(10/layoutData[index].v, 10/layoutData[index].h);
        let temp = 'calc((100% - ' + minPadding*(i - 1) + 'px) / ' + i + ')';
        return i === 1 ? '100%' : temp;
    }

    const calcWidth = (i, index) => {
        let minPadding = Math.min(10/layoutData[index].v, 10/layoutData[index].h);
        let temp = (totalWidth - minPadding*(i - 1)) / i + 'px';
        return temp;
    }

    const calcHeight = (i, index) => {
        let minPadding = Math.min(10/layoutData[index].v, 10/layoutData[index].h);
        let temp = (totalHeight - minPadding*(i - 1)) / i + 'px';
        return temp;
    }

    const onClickLayout = (i) => {
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
    
    const sortList = () => {
        setPanelList([...panelList.slice().sort((first, second) => first.order - second.order)])
    }    

    const reorderList = (sourceIndex, destinationIndex) => {
        if (destinationIndex === sourceIndex) {
            return;
        }
        const list = panelList;
        if (destinationIndex === 0) {
            list[sourceIndex].order = list[0].order - 1;
            sortList();
            return;
        }
        if (destinationIndex === list.length - 1) {
            list[sourceIndex].order = list[list.length - 1].order + 1;
            sortList();
            return;
        }
        if (destinationIndex < sourceIndex) {
            list[sourceIndex].order = (list[destinationIndex].order + list[destinationIndex - 1].order) / 2;
            sortList();
            return;
        }
        list[sourceIndex].order = (list[destinationIndex].order + list[destinationIndex + 1].order) / 2;
        sortList();
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
    
    const ListElement = (item) => {
        return <div className={"panel-item-element " + (selectedPanel === item.id ? 'selected-panel-item-element' : '')} onClick={() => setSelectedPanel(item.id)} style={{width: calcWidth(layoutData[selectedLayout].h, selectedLayout), height: calcHeight(layoutData[selectedLayout].v, selectedLayout)}}>
            <Dragger
                name={item.name}
                multiple={false}
                maxCount={1}
                listType='picture-card'
                action='https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188'
                accept="image/png, image/jpeg"
                className='import-drag-file'
                openFileDialogOnClick={false}
                fileList={fileList.filter(f => f.id === item.id)[0].fileList}
                onChange={(e) => onFileChange(e, item.id)}
            >
                {fileList.filter(f => f.id === item.id)[0].fileList.length > 0 && <img src={fileList.filter(f => f.id === item.id)[0].fileList[0].thumbUrl} alt='' />}
                <span className="material-symbols-outlined sound-icon" onClick={() => toggleIcon(item.id)}>{item.sound}</span>
                <span className="material-symbols-outlined remove-icon" onClick={() => removeImg(item.id)}>close</span>
                {fileList.filter(f => f.id === item.id)[0].fileList.length > 0 &&<div className='tag'>
                    <p className='media-format'>Input 1</p>
                </div>}
            </Dragger>
        </div>;
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

    return (
        <>
            <div className="control-live-page">
                <div className='d-flex align-center j-c-space-between top-section'>
                    <p className='page-title'>Control Room Panel<span>LIVE</span></p>
                    <Button type='primary' className='custom-button'>Save as Preset</Button>
                    <a className='link-btn' href='/control/play'>Go Playback Mode</a> 
                </div>
                <Card className='top-card'>
                    <Row justify={'space-between'} style={{height: '100%'}}>
                        <Col span={17}>
                            <div className='panel-item'>
                                <ListManager
                                    items={panelList}
                                    direction="horizontal"
                                    maxItems={layoutData[selectedLayout].h}
                                    render={item => (ListElement(item))}
                                    onDragEnd={reorderList}
                                />
                            </div>
                        </Col>
                        <Col span={6}>
                            <Card className='left-card'>
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
