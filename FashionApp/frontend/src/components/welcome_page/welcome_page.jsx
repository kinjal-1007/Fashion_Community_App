import React, {useState} from 'react';
import './welcome_page.css';
import {Link} from 'react-router-dom';
import MultiStepPopup from '../multi_step_menu/multi_step_popup';

const WelcomePage=()=>{
    const [showPopup, setShowPopup] = useState(false);

    const handlePopupOpen = () => {
        setShowPopup(true);
    };

    const handlePopupClose = () => {
        setShowPopup(false);
    };
    return (
        <>
         <div className='landing'>
            <h1>Welcome to your own <span>FashionVerse!</span></h1>
            {/* <Link to="/design"> */}
            <button className='welcome-btn' onClick={handlePopupOpen}>Start Designing using AI</button>
            {/* </Link> */}
         </div>
         {showPopup && <MultiStepPopup onClose={handlePopupClose} />}
        </>
    );
}
export default WelcomePage;