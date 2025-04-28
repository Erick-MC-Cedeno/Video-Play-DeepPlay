import React, { useEffect, useState } from 'react';
import { List, Avatar, Row, Col } from 'antd';
import axios from 'axios';
import DetailedVideoSidePane from './Sections/DetailedVideoSidePane';
import SubscriberPane from './Sections/SubscriberPane';
import Comments from './Sections/Comments';
import LikeDislike from './Sections/LikeDislike';

function DetailedVideoPage(props) {
    const videoId = props.match.params.videoId;
    const [video, setVideo] = useState([]);
    const [commentLists, setCommentLists] = useState([]);

    useEffect(() => {
        const videoVariable = { videoId: props.match.params.videoId };
        axios.post('/api/video/getVideo', videoVariable).then(response => {
            if(response.data.success) {
                setVideo(response.data.video);
            } else {
                alert("Failed to get video info!");
            }
        });

        axios.post('/api/comment/getComments', videoVariable).then(response => {
            if(response.data.success) {
                setCommentLists(response.data.comments);
            } else {
                alert("Failed to get comment info!");
            }
        });
    }, [props.match.params.videoId]);

    const updateComment = (newComment) => {
        if (newComment === ""){
            alert("Comment cannot be empty!");
        } else {
            setCommentLists(commentLists.concat(newComment));
        }
    };

    if (video.writer) {
        return (
            <div style={{ backgroundColor: '#181818', minHeight: '100vh', color: 'white' }}>
                <Row>
                    <Col lg={18} xs={24}>
                        <div className="postPage" style={{ width: '100%', padding: '20px 40px' }}>
                            <video 
                                id={video.filePath} 
                                style={{ 
                                    width: '100%', 
                                    maxHeight: 'calc(100vh - 200px)', 
                                    objectFit: 'contain', 
                                    borderRadius: '20px', 
                                    display: 'block',
                                    margin: '0 auto',
                                    border: '5px solid black' 
                                }} 
                                src={`http://localhost:5000/${video.filePath}`} 
                                controls 
                                autoPlay
                            ></video>

                            <List.Item
                                actions={[
                                    <LikeDislike video videoId={videoId} userId={localStorage.getItem('userId')} />, 
                                    <SubscriberPane userTo={video.writer._id} userFrom={localStorage.getItem('userId')} />
                                ]}
                                style={{ marginTop: '20px' }}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={video.writer.image} />}
                                    title={
                                        <span style={{ fontSize: '1.5em', color:'white' }}>{video.title}</span>
                                    }
                                    description={
                                        <>
                                            <p style={{ margin: 0, fontSize: '1.2em', color:'white' }}>{video.views} views</p>
                                            <h5 style={{ color: 'rgb(179,179,179)', fontSize: '1.2em' }}>{video.description}</h5>
                                        </>
                                    }
                                />
                            </List.Item>

                            <Comments commentLists={commentLists} postId={video._id} refreshFunction={updateComment} />
                        </div>
                    </Col>
                    <Col lg={6} xs={24}>
                        <DetailedVideoSidePane />
                    </Col>
                </Row>
            </div>
        );
    } else {
        return (
            <div style={{ color: 'white' }}>Loading...</div>
        );
    }
}

export default DetailedVideoPage;
