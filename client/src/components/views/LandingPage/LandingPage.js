import React, { useEffect, useState } from 'react';
import { Card, Avatar, Col, Row,  Input, Button } from 'antd';
import axios from 'axios';
import moment from 'moment';
const { Meta } = Card;

function LandingPage() {
    const [allVideos, setAllVideos] = useState([]);
    const [videos, setVideos] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        axios.get('api/video/getVideos').then(response => {
            if(response.data.success) {
                setAllVideos(response.data.videos);
                setVideos(response.data.videos);
            } else {
                alert("Failed to retrieve videos");
            }
        });
    }, []);

    const searchVideos = (value) => {
        if(value.trim() === "") {
            setVideos(allVideos);
            return;
        }
        const lowerValue = value.toLowerCase();
        const filtered = allVideos.filter(video => {
            const titleMatch = video.title && video.title.toLowerCase().includes(lowerValue);
            const keywordsMatch = video.keywords && video.keywords.some(keyword => keyword.toLowerCase() === lowerValue);
            return titleMatch || keywordsMatch;
        });
        setVideos(filtered);
    };

    const handleSearch = () => {
        searchVideos(searchTerm);
    };

    const renderCards = videos.map((video) => {
        let minutes = Math.floor(video.duration / 60);
        let seconds = Math.floor(video.duration - minutes * 60);
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        
        return (
            <Col key={video._id} lg={6} md={8} xs={24} style={{ paddingBottom: '25px' }}>
                <div style={{ position: "relative" }}>
                    <a href={`/video/${video._id}`}>
                        <img 
                            style={{ width: "100%", borderRadius: '10px' }} 
                            alt="thumbnail" 
                            src={`http://localhost:5000/${video.thumbnail}`} 
                        />
                        <div 
                            className="duration" 
                            style={{ 
                                bottom: 0, 
                                right: 0, 
                                position: 'absolute', 
                                margin: '4px', 
                                color: '#fff', 
                                backgroundColor: 'rgba(17,17,17,0.8)', 
                                opacity: 0.8, 
                                padding: '2px 4px', 
                                borderRadius: '2px', 
                                letterSpacing: '0.5px',
                                fontSize: '12px', 
                                fontWeight: '500', 
                                lineHeight: '12px'
                            }}
                        >
                            <span>{minutes} : {seconds}</span>
                        </div>
                    </a>
                </div>
                <br />
                <Meta 
                    avatar={<Avatar src={video.writer.image} />}
                    title={<h4 style={{ color: 'white' }}>{video.title}</h4>}
                    style={{ color: 'rgb(255,255,255)' }}
                />
                <span style={{ color: 'white' }}>{video.writer.name}</span>
                <br />
                <span style={{ marginLeft: '3rem', color: 'rgb(179,179,179)' }}>
                    {video.views} views - {moment(video.createdAt).fromNow()}
                </span>
            </Col>
        );
    });

    return (
        <div style={{ width: '85%', margin: '1rem auto', backgroundColor: '#181818', color: 'white' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                    <Input
                        placeholder="Buscar"
                        size="large"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: 400,
                            backgroundColor: '#1E1E1E',
                            borderRadius: '2px 0 0 2px',
                            color: 'white',
                            border: '1px solid #444',
                            borderRight: 'none'
                        }}
                    />
                    <Button
                        type="primary"
                        size="large"
                        onClick={handleSearch}
                        style={{
                            borderRadius: '0 2px 2px 0',
                            backgroundColor: '#282828',
                            border: '1px solid #444',
                            borderLeft: 'none'
                        }}
                    >
                        Buscar
                    </Button>
                </div>
            </div>
            <hr style={{ borderColor: 'rgb(40,40,40)' }}/>
            <Row gutter={16} style={{ paddingTop: '30px' }}>
                {renderCards}
            </Row>
        </div>
    );
}

export default LandingPage;