import React, { useEffect, useState } from 'react';
import {Link, useNavigate} from "react-router-dom";
import './FashionImgList.css';
import Button from '@mui/material/Button';
const FashionImgList = () => {
  const [fashionImgs, setFashionImgs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFashionImgs = async () => {
      try {
        const response = await fetch('http://localhost:4000/list');
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
  
  return (
    <div className='show-list'>
      <h1>Latest Designs</h1>
      <Button variant="contained" onClick={() => navigate('/list/new')} size='large' className='add-btn'>Add New Post</Button>
      
      <hr /><br/>
      <div className="row row-cols-lg-4 row-cols-md-2 row-cols-sm-1">
        {fashionImgs.map((img) => (
          <div className="col-md-4 mb-4" key={img._id}>
            
            <div className="card" style={{ width: '24rem' }}>
              <Link to={`/list/${img._id}`}>
                <img src={img.image.url} className="card-img-top" alt={img.title} style={{ height: '24rem' }}/>
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
