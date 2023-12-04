import React from 'react';
import { Button, Card, DatePicker, Row, Col, Input } from 'antd';
import './meetingSettings.scss';

const MeetingSettings = () => {

    return (
        <>
            <div className="meeting-setting-page">
                <Card className='table-card'>
                    <div className='d-flex align-center j-c-space-between top-section'>
                        <p className='card-title'>Settings</p>
                    </div>
                    <Row gutter={10}>
                        <Col span={7}>
                            <Row gutter={10}>
                                <Col span={12}>
                                    <p className='select-label'>Working Hour (Start)</p>
                                    <DatePicker />
                                </Col>
                                <Col span={12}>
                                    <p className='select-label'>Working Hour (End)</p>
                                    <DatePicker />
                                </Col>
                                <Col span={12}>
                                    <p className='select-label'>Time Gap (Minutes)</p>
                                    <Input defaultValue={'30'} />
                                    <p className='select-label'>Max Booking Days</p>
                                    <Input defaultValue={'30'} />
                                    <Button type='primary'>Save</Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card>
            </div>            
        </>
    );
}

export default MeetingSettings;
