import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './image_generator.css';
import Default from '../assets/images.jpg';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons'
const ImageGenerator=()=>{
  const [imageUrls, setImageUrls] = useState(["/", "/", "/"]);
  const [imageBlobs, setImageBlobs] = useState([null, null, null]);

  const [fileName, setFileName] = useState('generated-image.png');
  const [isLoading, setIsLoading] = useState(false);
  let inputRef=useRef(null);
  const token=import.meta.env.VITE_API_KEY;

  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const prompt = params.get('prompt');
    if (prompt && inputRef.current) {
        inputRef.current.value = prompt;
    }
}, [location]);
const fetchImage = async (prompt) => {
  const data = { "inputs": prompt };
  
  const response = await fetch(
    "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) {
    const errorDetails = await response.json();
    console.error("Failed to fetch image", response.statusText, errorDetails);
    return null;
  }

  const blob = await response.blob();
  const imageUrl = URL.createObjectURL(blob);

  return { imageUrl, blob };
};
  const imageGenerator= async ()=>{
    if (!inputRef.current || inputRef.current.value === "") {
      console.error("Input ref is null or empty");
      return;
    }
    const prompt = inputRef.current.value;
    setIsLoading(true);
    try {
      const results = [];
      for (let i = 0; i < 3; i++) {
        const result = await fetchImage(`${prompt} ${Math.random().toString(36).substring(7)}`);
        results.push(result);
        await new Promise(resolve => setTimeout(resolve, 500)); // Adding a delay of 500ms
      }

      const urls = results.map(result => result?.imageUrl || "/");
      const blobs = results.map(result => result?.blob || null);

      setImageUrls(urls);
      setImageBlobs(blobs);

    }  catch(error) {
      console.error("Error fetching image", error);
    }
    finally{
      setIsLoading(false);
    }
  };
  const downloadImage = (blob) => {
    if (!blob) {
      console.error("No image to download");
      return;
    }
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `image.png`;
    link.click();
  };
    return (
        <>
          <div className="image-generator" id='image-generator'>
            <div className="header">Generate your <span>AI Fashion</span> Design</div>
            <div className="img-loading">
            {isLoading ? (
            <div className="loading-message">AI is creating images for you...</div>
          ) : (
            imageUrls.some(url => url !== "/") ? (
              imageUrls.map((url, index) => (
                <div key={index} className="image-container">
                  <div className="image">
                    <img src={url} alt={`Generated ${index + 1}`} />
                  </div>
                  {url !== "/" && (
                    <div className="download-icon" onClick={() => downloadImage(imageBlobs[index])}>
                    <FontAwesomeIcon className='i' icon={faFileArrowDown} />
                  </div>
                  )}
                </div>
              ))
            ) : (
              <div className="prompt-message">
                Change the generated prompt to include additional details, and then click on Generate.
              </div>
            )
          )}

            </div>
            <div className="prompt">
              <div className="search-container">
            <textarea ref={inputRef} id='search' className="search" placeholder='Enter design prompt'></textarea>
               </div>
              <div className='generate-btn' onClick={imageGenerator}>Generate</div>
            </div>
            {/* {imageUrls.some(url => url !== "/") && (
          <div className='download'>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter file name"
              className='download-box'
            />
          </div>
        )} */}
          </div>
        </>
    );
};

export default ImageGenerator;