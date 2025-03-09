import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DetailedVideoSidePane() {
    const [sidePane, setSidePane] = useState([]);

    useEffect(() => {
        axios.get('/api/video/getVideos').then(response => {
            if (response.data.success) {
                setSidePane(response.data.videos);
            } else {
                alert('Failed to retrieve videos');
            }
        });
    }, []);

    const sideVideoPane = sidePane.map((video, index) => {
        let minutes = Math.floor(video.duration / 60);
        let seconds = Math.floor(video.duration - minutes * 60);

        if (seconds < 10) {
            seconds = '0' + seconds;
        }

        return (
            <div key={video._id || index} style={{ display: 'flex', marginTop: '1rem', padding: '0 1rem' }}>
                <div style={{ width: '40%', marginRight: '1rem' }}>
                    <a href={`/video/${video._id}`} style={{ color: 'gray' }}>
                        <img
                            style={{ width: '100%', borderRadius: '10px' }}
                            src={`http://localhost:5000/${video.thumbnail}`}
                            alt="thumbnail"
                        />
                    </a>
                </div>

                <div style={{ width: '50%' }}>
                    <a href={`/video/${video._id}`} style={{ color: 'gray' }}>
                        <span style={{ fontSize: '1rem', color: 'white' }}>{video.title}</span>
                        <br />
                        <span style={{ color: 'white' }}>{video.writer.name}</span>
                        <br />
                        <span style={{ color: 'white' }}>{video.views} views</span>
                        <br />
                        <span style={{ color: 'white' }}>{minutes} : {seconds}</span>
                        <br />
                    </a>
                </div>
            </div>
        );
    });

    return (
        <div style={{
            marginTop: '3rem',
            marginRight: '2rem',
            padding: '1rem',
            backgroundColor: '#282828',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
        }}>
            {sideVideoPane}
        </div>
    );
}

export default DetailedVideoSidePane;