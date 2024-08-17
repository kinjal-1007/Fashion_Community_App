import React, { useEffect, useState } from 'react';
import {Link, useNavigate} from "react-router-dom";
import './FashionImgList.css';
import Button from '@mui/material/Button';
import FlashMessage from '../FlashMsg/Flash';
const FashionImgList = () => {
  const [fashionImgs, setFashionImgs] = useState([]);
  const [flashMessage, setFlashMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve and clear the flash message from localStorage
    const message = localStorage.getItem('flashMessage');
    if (message) {
        setFlashMessage(message);
        localStorage.removeItem('flashMessage');
    }
}, []);

  useEffect(() => {
    const fetchFashionImgs = async () => {
      try {
        const response = await fetch('http://localhost:4000/list', {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const sortedData = data.sort((a, b) => b.likes - a.likes);
        setFashionImgs(sortedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchFashionImgs();
  }, []);
  
  const handleAddNewPost = async () => {
    try {
        const response = await fetch('http://localhost:4000/list/check-auth', {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'X-original-url': '/list/new'
          }
        });
        const data = await response.json();
        if (data.authenticated) {
            navigate('/list/new');
        } else {
            navigate('/login', { state: { from: '/list/new' } });
        }
    } catch (error) {
        console.error('Error checking authentication:', error);
    }
};
  
  return (
    <div className='show-list'>
      <FlashMessage message={flashMessage} type="success" />
      <h1>Latest Designs</h1>
      <Button variant="contained" onClick={handleAddNewPost} size='large' className='add-btn'>Add New Post</Button>
      
      <hr /><br/>
      <div className="row row-cols-lg-4 row-cols-md-2 row-cols-sm-1">
        {fashionImgs.map((img) => (
          <div className="col-md-4 mb-4" key={img._id}>
            
            <div className="card" style={{ width: '20vw', height: '56vh' }}>
              <Link to={`/list/${img._id}`}>
                <img src={img.image.url} className="card-img-top" alt={img.title} style={{ height: '40vh' }}/>
                <h5 className="card-title">{img.title}</h5>
                <div className="card-img-overlay"></div>
              </Link>
              
              <div className="card-body">
                <div className='likes-comments'><p className="card-text"><i class="fa-solid fa-heart likes"></i>Likes: {img.likes}</p>
                <p className="card-text"><i class="fa-regular fa-comments"></i>Comments: {img.comments.length}</p> </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FashionImgList;
