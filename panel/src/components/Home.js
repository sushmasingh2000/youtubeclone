import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    
    const fetchVideos = async () => {
      const res = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=react js&key=AIzaSyCSp-e53lYwjwxhvhTPalB7XClIp6UL_uo`
      );
      setVideos(res.data.items);
    };
    fetchVideos();
  }, []);

  return (
    <div>
      <h1>YouTube Clone</h1>
      <div className="grid grid-cols-4 justify-center gap-1">
        {videos.map((video) => (
          <div key={video.id.videoId} className="video-item">
            <Link to={`/video/${video.id.videoId}`}>
              <img
                src={video.snippet.thumbnails.high.url}
                alt={video.snippet.title}
                className="thumbnail"
              />
              <h3>{video.snippet.title}</h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
