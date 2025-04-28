import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

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
      <div key={video._id || index} className="video-wrapper">
        <div className="video-thumbnail">
          <a href={`/video/${video._id}`} style={{ color: 'gray' }}>
            <img
              src={`http://localhost:5000/${video.thumbnail}`}
              alt="thumbnail"
            />
          </a>
        </div>
        <div className="video-details">
          <a href={`/video/${video._id}`} style={{ color: 'gray', textDecoration: 'none' }}>
          <div className="video-title" style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#fff', marginBottom: '0.5rem' }} >{video.title} </div>
          <div className="video-writer">{video.writer.name}</div>
            <div className="video-stats">
              {video.views} views • {moment(video.createdAt).fromNow()}
            </div>
            <div className="video-duration">
              {minutes} : {seconds}
            </div>
          </a>
        </div>
      </div>
    );
  });

  return (
    <>
      <style>{`
        .side-pane-container {
          margin-top: 3rem;
          margin-right: 3rem;
          padding: 1rem;
          max-height: 80vh;
          overflow-y: auto;
          scrollbar-width: none;  /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }
        .side-pane-container::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
        .video-wrapper {
          display: flex;
          align-items: center;
          margin-top: 0.4rem;
          padding: 0.2rem 0;
        }
        .video-thumbnail {
          width: 50%; /* Anteriormente era 40% */
          margin-right: 1rem;
        }
        .video-thumbnail img {
          width: 100%;
          border-radius: 8px;
        }
        .video-details {
          width: 50%;
          overflow: hidden;
        }
        .video-title {
          font-size: 0.9rem;
          color: white;
          font-weight: bold;
          margin-bottom: 0.1rem;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .video-writer,
        .video-stats,
        .video-duration {
          font-size: 0.8rem;
          color: #bbb;
          margin-bottom: 0.1rem;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        /* Media query para pantallas pequeñas */
        @media (max-width: 600px) {
          .video-wrapper {
            flex-direction: column;
            align-items: flex-start;
          }
          .video-thumbnail {
            width: 100%;
            margin-right: 0;
            margin-bottom: 0.5rem;
          }
          .video-details {
            width: 100%;
          }
          .video-title {
            font-size: 0.8rem;
          }
          .video-writer,
          .video-stats,
          .video-duration {
            font-size: 0.7rem;
          }
        }
      `}</style>
      <div className="side-pane-container">
        {sideVideoPane}
      </div>
    </>
  );
}

export default DetailedVideoSidePane;