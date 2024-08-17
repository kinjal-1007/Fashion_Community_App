import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import './FashionImgDetail.css';
import './rating.css';
import FlashMessage from '../FlashMsg/Flash';
const FashionImgDetail = () => {
  const { id } = useParams();
  const [fashionImg, setFashionImg] = useState(null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(1);
  const [currUserId, setCurrUserId] = useState(null);
  const [flashMessage, setFlashMessage] = useState(null);
  const navigate=useNavigate();
  useEffect(() => {
    // Retrieve and clear the flash message from localStorage
    const message = localStorage.getItem('flashMessage');
    if (message) {
        setFlashMessage(message);
        localStorage.removeItem('flashMessage');
    }
}, []);
  useEffect(() => {
    const fetchFashionImg = async () => {
      try {
        const response = await fetch(`http://localhost:4000/list/${id}`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setFashionImg(data.fashionImg);
        setCurrUserId(data.currUserId);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchFashionImg();
  }, [id]);
   
  const handleLike = async () => {
    setFashionImg(prevState => ({
      ...prevState,
      likes: prevState.likes + 1
    }));

    try {
      const response = await fetch(`http://localhost:4000/list/${id}/like`, {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      // setFashionImg(data);
      const fetchFashionImg = async () => {
        try {
          const response = await fetch(`http://localhost:4000/list/${id}`,{
            credentials: 'include'
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setFashionImg(data.fashionImg);
          setCurrUserId(data.currUserId);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchFashionImg();
    } catch (error) {
      console.error('Error liking image:', error);
      // Rollback in case of error
      setFashionImg(prevState => ({
        ...prevState,
        likes: prevState.likes - 1
      }));
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:4000/list/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.authenticated === false) {
          navigate('/login');
        } else {
          throw new Error('Network response was not ok');
        }
      }

      const data = await response.json();
      localStorage.setItem('flashMessage', data.message);
      console.log('Image deleted:', data);
      navigate('/list'); // Redirect to the list of images after deletion
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };
  const handleEdit = async () => {
    try {
      const response = await fetch('http://localhost:4000/list/check-auth', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-original-url': `/list/${id}/edit`
      }
      });
      const data = await response.json();
      if (data.authenticated) {
        navigate(`/list/${id}/edit`);
      } else {
        navigate('/login', { state: { from: `/list/${id}/edit` } });
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
    }
  };
  const handleCommentDelete = async (commentId) => {
    try {
      const response = await fetch(`http://localhost:4000/list/${id}/comments/${commentId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const updatedImg = await response.json();
      setFashionImg(updatedImg);
      const fetchFashionImg = async () => {
        try {
          const response = await fetch(`http://localhost:4000/list/${id}`,{
            credentials: 'include'
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setFashionImg(data.fashionImg);
          setCurrUserId(data.currUserId);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchFashionImg();
      
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      form.classList.add('was-validated');
      return;
    } else {
      form.classList.remove('was-validated');
    }

    const newComment = {
      comment,
      rating,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(`http://localhost:4000/list/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComment),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const updatedImg = await response.json();
      console.log('Updated fashionImg:', updatedImg);
      const fetchFashionImg = async () => {
        try {
          const response = await fetch(`http://localhost:4000/list/${id}`,{
            credentials: 'include'
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setFashionImg(data.fashionImg);
          setCurrUserId(data.currUserId);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchFashionImg();
      // setFashionImg(updatedImg);
      setComment('');
      setRating(1);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };
  const handleRatingChange = (e) => {
    setRating(Number(e.target.value));
  };
  useEffect(() => {
    // Initialize Bootstrap validation
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add('was-validated');
      }, false);
    });

    return () => {
      Array.from(forms).forEach(form => {
        form.removeEventListener('submit', () => {});
      });
    };
  }, []);

  if (!fashionImg) {
    return <div>Loading...</div>;
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  return (
<div className="fashion-img-detail">
  <FlashMessage message={flashMessage} type="success" />
      <div className="row">
        <div className="col-md-5 fashion-img-detail-left">
          <img src={fashionImg.image.url} alt={fashionImg.title} className="img-fluid" />
        </div>
        <div className="col-md-6 fashion-img-detail-right">
          <h1>{fashionImg.title}</h1>
          <div className='image-info'>
          <p>Posted by: {fashionImg.owner ? fashionImg.owner.username : 'User1'}</p>
          <p>Created At :  {formatDate(fashionImg.createdAt)}</p><br/>
          <p>{fashionImg.description}</p>
          <p>{fashionImg.hashtags.join(' ')}</p> 
          <p><i class="fa-solid fa-thumbs-up" onClick={handleLike}></i> {fashionImg.likes}</p>
          </div>
          {currUserId === fashionImg.owner._id && (
          <>
          <button className="btn btn-danger offset-1 delete-btn mt-2" onClick={handleDelete}>Delete this Post</button>
          <button className="btn btn-primary offset-1 edit-btn mt-2" onClick={handleEdit}>Edit this Post</button>
          </>
          )}
          <br/><br/><hr/><br/>
          <div className="comments-section mt-4 offset-1">
          <h4>Comments</h4><br/>
            <ul className="list-group" style={{listStyleType: 'none' }}>
              {fashionImg.comments.map((comment) => (
                <li key={comment._id}>
                <div className="card list-group-item">
                  <p className='card-title'>@{comment.author.username}</p>
                  <p className='card-text'>{comment.comment}</p>
                  {/* <p className='card-text'>Rating: {comment.rating} stars</p> */}
                  <p class="starability-result" data-rating={comment.rating}></p>  
                  {currUserId === comment.author._id && (
                  <button className='btn btn-sm btn-dark' onClick={() => handleCommentDelete(comment._id)}>Delete</button>
                  )}
                </div>
                </li>
              ))}
            </ul>
            {currUserId && (
            <form onSubmit={handleCommentSubmit} noValidate className="comment-form mt-4 needs-validation" >
              <div className="mb-3">
                <label htmlFor="comment" className="form-label comment-prompt">Add a Comment</label>
                <textarea 
                  id="comment" 
                  className="form-control"
                  value={comment} 
                  onChange={(e) => setComment(e.target.value)} 
                  required 
                />
                  <div className='valid-feedback'>Looks good!</div>
                  <div className="invalid-feedback">
                  Please enter a comment.
                    </div>
              </div>

                {/* <input 
                  type="range" 
                  id="rating" 
                  className="form-range" 
                  min="1" 
                  max="5" 
                  value={rating} 
                  onChange={(e) => setRating(e.target.value)} 
                /> */}
                <div className="mb-3">
                <label htmlFor="rating" className="form-label">Enter Rating</label>
                <fieldset class="starability-slot" id='rating'>
                <input type="radio" id="first-rate1" name="rating" value="1" onChange={handleRatingChange} checked={rating === 1} />
                <label for="first-rate1" title="Terrible">1 star</label>
                <input type="radio" id="first-rate2" name="rating" value="2" onChange={handleRatingChange} checked={rating === 2}/>
                <label for="first-rate2" title="Not good">2 stars</label>
                <input type="radio" id="first-rate3" name="rating" value="3" onChange={handleRatingChange} checked={rating === 3}/>
                <label for="first-rate3" title="Average">3 stars</label>
                <input type="radio" id="first-rate4" name="rating" value="4"onChange={handleRatingChange} checked={rating === 4}/>
                <label for="first-rate4" title="Very good">4 stars</label>
                <input type="radio" id="first-rate5" name="rating" value="5" onChange={handleRatingChange} checked={rating === 5} />
                <label for="first-rate5" title="Amazing">5 stars</label>
              </fieldset>
              </div>
              <button type="submit" className="btn btn-primary mt-2 mb-2">Submit Comment</button>
            </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FashionImgDetail;
