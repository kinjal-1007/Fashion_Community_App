import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditFashionImg = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    hashtags: '',
    image: null,
    existingImageUrl: '',
    existingImageFilename: '',
  });

  useEffect(() => {
    const fetchFashionImg = async () => {
      try {
        const response = await fetch(`http://localhost:4000/list/${id}/edit`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setFormData({
          title: data.title,
          description: data.description,
          hashtags: data.hashtags.join(', '),
          image: null, // Image will not be populated here
          existingImageUrl: data.imageUrl,
          existingImageFilename: data.imageFilename,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchFashionImg();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formDataObj.append('title', formData.title);
    formDataObj.append('description', formData.description);
    formDataObj.append('hashtags', formData.hashtags);
    if (formData.image) {
        formDataObj.append('image', formData.image);
      } else {
        formDataObj.append('existingImageFilename', formData.existingImageFilename);
      }

    try {
      const response = await fetch(`http://localhost:4000/list/${id}`, {
        method: 'PUT',
        body: formDataObj,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      navigate(`/list/${id}`); // Redirect back to the detail view
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  return (
    <div className='add-form-container'>
    <h1 className='offset-1 mb-3'>Edit Post</h1>
    <form onSubmit={handleSubmit} noValidate className='add-form offset-1 needs-validation' encType="multipart/form-data">
      <div className="row">
        <label htmlFor="title" className='form-label'>Title:
        <input
          type="text"
          id="title"
          name="title"
          className="form-control"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
        <div className="valid-feedback">
            Looks good!
          </div>
        <div className='invalid-feedback'>Please enter title!</div>
        </label>
      </div>
      <div className="row">
        <label htmlFor="description" className='form-label'>Description:
        <input
          id="description"
          name="description"
          className="form-control"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
        <div className="valid-feedback">
            Looks good!
          </div>
        <div className='invalid-feedback'>Please enter short description!</div>
        </label>
      </div>
      <div className="row">
        <label htmlFor="image" className='form-label'>Upload Image:
        {formData.existingImageUrl && (
          <div>
            <img src={formData.existingImageUrl} alt="Current" style={{ maxWidth: '200px' }}/>
          </div>
        )}
        <input
          type="file"
          id="image"
          name="image"
          className="form-control mt-3"
          onChange={handleFileChange}
        />
        </label>
      </div>
      <div className="row">
        <label htmlFor="hashtags" className='form-label'>Hashtags:
        <input
          type="text"
          id="hashtags"
          name="hashtags"
          className="form-control"
          value={formData.hashtags}
          onChange={handleInputChange}
        />
        <div className="valid-feedback">
            Looks good!
          </div>
        <div className='invalid-feedback'>Please enter hashtags</div>
        </label>
      </div>
      <div className='row'>
      <button type="submit" className="btn btn-primary mb-2">Update</button></div>
    </form>
    </div>
  );
};

export default EditFashionImg;
