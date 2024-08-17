import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './FashionImgNew.css';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const FashionImgNew = () => {
    const [newImage, setNewImage] = useState({
        title: '',
        description: '',
        // image: '',
        hashtags: ''
      });
      const [validate,setValidate]=useState(false);
      const [file, setFile] = useState(null); 
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      setFile(files[0]);
    } else {
      setNewImage(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      const formData = new FormData();
      formData.append('title', newImage.title);
      formData.append('description', newImage.description);
      formData.append('image', file); // Append file
      formData.append('hashtags', newImage.hashtags);
    try {
      const response = await fetch(`${backendUrl}/list/new`, {
        method: 'POST',
        credentials: 'include',
        // headers: {
        //   'Content-Type': 'application/json',
        // },
        body: formData, //JSON.stringify(newImage),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Image saved:', data);
      if (data.success && data.success.length > 0) {
        localStorage.setItem('flashMessage', data.success[0]);
      }
      navigate('/list');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }};
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
  return (
    <div className='add-form-container'>
      <h1 className='offset-1'>Add New Fashion Image</h1>
      <form onSubmit={handleSubmit} noValidate className='add-form offset-1 needs-validation' encType="multipart/form-data">
        <div className='row'>
        <label className='form-label'>
          Title:<br/>
          <input type="text" name="title" value={newImage.title} onChange={handleChange} className='form-control' required />
          <div className="valid-feedback">
            Looks good!
          </div>
          <div className='invalid-feedback'>Please enter title!</div>
        </label>
        
        </div>
        <div className='row'>
        <label className='form-label'>
          Description:<br/>
          <input type="text" name="description" value={newImage.description}  className='form-control' onChange={handleChange} required />
          <div className="valid-feedback">
            Looks good!
          </div>
          <div className='invalid-feedback'>Please enter short description!</div>
        </label>
        
        </div>
        {/* <div className='row'>
        <label className='form-label'>
          Image URL:<br/>
          <input type="text" name="image" value={newImage.image}  className='form-control' onChange={handleChange} />
        </label></div> */}
        <div className='row'>
        <label className='form-label form-control-file'>
          Image URL:<br/>
          <input type="file" name="image" className='form-control ' onChange={handleChange} />
        </label></div>

        <div className='row'>
        <label className='form-label'>
          Hashtags (comma-separated):<br/>
          <input type="text" name="hashtags" value={newImage.hashtags}  className='form-control' onChange={handleChange} required />
          <div className="valid-feedback">
            Looks good!
          </div>
          <div className='invalid-feedback'>Please enter hashtags</div>
        </label>
        
        </div>
        <div className='row'>
        <button type="submit" className='btn btn-dark'>Submit</button></div>
      </form>
    </div>
  );
};

export default FashionImgNew;
