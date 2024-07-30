import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './multi_step_popup.css';
import ImageGenerator from './../image_generator.jsx';
import Male from '../../assets/male_model.png';
import Female from '../../assets/female_model.png';
import Button from '@mui/material/Button';
import Tshirt from '../../assets/tshirt.png';
import Hoodie from '../../assets/hoodie.png';
import Gown from '../../assets/gown.png';
import Shirt from '../../assets/shirt.png';
import Suit from '../../assets/suit.png';
import Saree from '../../assets/saree.png';
import Crop from '../../assets/crop_top.png';
import Jeans from '../../assets/jeans.png';
import Pant from '../../assets/pant.png';
import Room from '../../assets/room.jpg';
import Garden from '../../assets/garden.jpg';
import Beach from '../../assets/beach.jpg';
import Hallway from '../../assets/hallway.jpg';

const MultiStepPopup = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [gender, setGender] = useState('');
    const [clothing, setClothing] = useState('');
    const [color, setColor] = useState('');
    const [fabric, setFabric] = useState('');
    const [pattern, setPattern] = useState('');
    const [location, setLocation] = useState('');
    const [prompt, setPrompt] = useState('');
    const navigate=useNavigate();

    const handleNext = () => {
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleGenerate = () => {
        const generatedPrompt = `Full image of a ${gender} model wearing ${color}-coloured, ${fabric} ${clothing} with ${pattern} pattern, standing in a ${location}.`;
        setPrompt(generatedPrompt);
        navigate(`/imageAI/generate?prompt=${encodeURIComponent(generatedPrompt)}`);
    };
    const handleSuggestionClick = (suggestion, setter) => {
        setter(suggestion);
    };
    return (
        <div className="popup">
            <div className="popup-inner">
                {step === 1 && (
                    <div className="step">
                        <h2>Select Gender</h2>
                        <div className="options">
                            <div className={`option ${gender === 'male' ? 'selected' : ''}`} onClick={() => setGender('male')}>
                                <img src={Male} alt="Male" />
                                <p>Male</p>
                            </div>
                            <div className={`option ${gender === 'female' ? 'selected' : ''}`} onClick={() => setGender('female')}>
                                <img src={Female} alt="Female" />
                                <p>Female</p>
                            </div>
                        </div>
                        <Button variant="contained" onClick={handleNext} id='next-btn' size='large'>Next</Button>
                    </div>
                )}
                {step === 2 && (
                    <div className="step">
                        <h2>Select Clothing</h2>
                        <div className="options">
                            <div className={`option ${clothing === 'hoodie' ? 'selected' : ''}`} onClick={() => setClothing('hoodie')}>
                                <img src={Hoodie} alt="Hoodie" />
                                <p>Hoodie</p>
                            </div>
                            <div className={`option ${clothing === 'tshirt' ? 'selected' : ''}`} onClick={() => setClothing('tshirt')}>
                                <img src={Tshirt} alt="Tshirt" />
                                <p>Tshirt</p>
                            </div>
                            <div className={`option ${clothing === 'gown' ? 'selected' : ''}`} onClick={() => setClothing('gown')}>
                                <img src={Gown} alt="Gown" />
                                <p>Gown</p>
                            </div>
                            <div className={`option ${clothing === 'shirt' ? 'selected' : ''}`} onClick={() => setClothing('shirt')}>
                                <img src={Shirt} alt="Shirt" />
                                <p>Shirt</p>
                            </div>
                            <div className={`option ${clothing === 'crop top' ? 'selected' : ''}`} onClick={() => setClothing('crop top')}>
                                <img src={Crop} alt="Crop Top" />
                                <p>Crop Top</p>
                            </div>
                            <div className={`option ${clothing === 'suit' ? 'selected' : ''}`} onClick={() => setClothing('suit')}>
                                <img src={Suit} alt="Suit" />
                                <p>Suit</p>
                            </div>
                            <div className={`option ${clothing === 'saree' ? 'selected' : ''}`} onClick={() => setClothing('saree')}>
                                <img src={Saree} alt="Saree" />
                                <p>Saree</p>
                            </div>
                            <div className={`option ${clothing === 'jeans' ? 'selected' : ''}`} onClick={() => setClothing('jeans')}>
                                <img src={Jeans} alt="Jeans" />
                                <p>Jeans</p>
                            </div>
                            <div className={`option ${clothing === 'pant' ? 'selected' : ''}`} onClick={() => setClothing('pant')}>
                                <img src={Pant} alt="Pant" />
                                <p>Pant</p>
                            </div>
                        </div>
                        <Button variant="outlined" onClick={handleBack} id='back-btn' size='large'>Back</Button>
                        <Button variant="contained" onClick={handleNext} id='next-btn' size='large'>Next</Button>
                    </div>
                )}
                {step === 3 && (
                    <div className="step">
                        <h2>Select Color, Fabric, and Pattern</h2>
                        <div className="inputs">
                            <label htmlFor="color">Enter colour of your choice:</label>
                            <input id='color' type="text" placeholder="Color" value={color} onChange={(e) => setColor(e.target.value)} />
                            <div className="suggestions"> Try these: 
                                <div className="suggestion" onClick={() => handleSuggestionClick('chocolate brown', setColor)}>chocolate brown</div>
                                <div className="suggestion" onClick={() => handleSuggestionClick('orange', setColor)}>orange</div>
                                <div className="suggestion" onClick={() => handleSuggestionClick('burgundy', setColor)}>burgundy</div>
                                <div className="suggestion" onClick={() => handleSuggestionClick('olive green', setColor)}>olive green</div>
                            </div>
                            <label htmlFor="fabric">Enter type of fabric: </label>
                            <input id='fabric' type="text" placeholder="Fabric" value={fabric} onChange={(e) => setFabric(e.target.value)} />
                            <div className="suggestions">Try these: 
                                <div className="suggestion" onClick={() => handleSuggestionClick('silk', setFabric)}>silk</div>
                                <div className="suggestion" onClick={() => handleSuggestionClick('rayon', setFabric)}>rayon</div>
                                <div className="suggestion" onClick={() => handleSuggestionClick('cotton', setFabric)}>cotton</div>
                            </div>
                            <label htmlFor="pattern">Enter any pattern:</label>
                            <input id='pattern' type="text" placeholder="Pattern" value={pattern} onChange={(e) => setPattern(e.target.value)} />
                            <div className="suggestions">Try these: 
                                <div className="suggestion" onClick={() => handleSuggestionClick('striped', setPattern)}>striped</div>
                                <div className="suggestion" onClick={() => handleSuggestionClick('floral', setPattern)}>floral</div>
                                <div className="suggestion" onClick={() => handleSuggestionClick('plain', setPattern)}>plain</div>
                            </div>
                        </div>
                        <Button variant="outlined" onClick={handleBack} id='back-btn' size='large'>Back</Button>
                        <Button variant="contained" onClick={handleNext} id='next-btn' size='large'>Next</Button>                  
                        </div>
                )}
                 {step === 4 && (
                    <div className="step step-4">
                        <h2>Select Setting/Location</h2>
                        <div className="options">
                            <div className={`option ${location === 'big room' ? 'selected' : ''}`} onClick={() => setLocation('big room')}>
                                <img src={Room} alt="Room" className='location-img'/>
                                <p>Room</p>
                            </div>
                            <div className={`option ${location === 'garden' ? 'selected' : ''}`} onClick={() => setLocation('garden')}>
                                <img src={Garden} alt="garden" className='location-img'/>
                                <p>Garden</p>
                            </div>
                            <div className={`option ${location === 'beach' ? 'selected' : ''}`} onClick={() => setLocation('beach')}>
                                <img src={Beach} alt="beach" className='location-img'/>
                                <p>Beach</p>
                            </div>
                            <div className={`option ${location === 'hallway' ? 'selected' : ''}`} onClick={() => setLocation('hallway')}>
                                <img src={Hallway} alt="hallway" className='location-img'/>
                                <p>Hallway</p>
                            </div>
                            </div>
                        <Button variant="outlined" onClick={handleBack} id='back-btn' size='large'>Back</Button>
                        <Button variant="contained" color='success' onClick={handleGenerate} id='next-btn' size='large'>Go!</Button>

                    </div>
                 )}

                {prompt && (
                    <ImageGenerator prompt={prompt} />
                )}
                <Button variant="contained" size="large" color="error" id='close-btn' onClick={onClose}>Close</Button>
            </div>
        </div>
    );
}

export default MultiStepPopup;
