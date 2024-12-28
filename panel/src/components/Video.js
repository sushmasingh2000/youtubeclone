import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Video = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      const res = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${id}&key=AIzaSyCSp-e53lYwjwxhvhTPalB7XClIp6UL_uo`
      );
      setVideo(res.data.items[0]);
    };
    fetchVideo();
  }, [id]);

  if (!video) return <div>Loading...</div>;

  return (
    <div>
      <h1>{video.snippet.title}</h1>
      <iframe
        width="100%"
        height="400"
        src={`https://www.youtube.com/embed/${id}`}
        title={video.snippet.title}
        frameBorder="0"
        allowFullScreen
      ></iframe>
      <div>
        <h2>Description:</h2>
        <p>{video.snippet.description}</p>
      </div>
    </div>
  );
};

export default Video;
