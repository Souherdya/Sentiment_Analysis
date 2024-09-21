import React from 'react'
import "./LandingPage.css"
import {useNavigate} from 'react-router-dom'



export default function LandingPage() {

   
    const navigate = useNavigate()

    function  handleRedirection(){
        navigate("/Export")
    }
  return (
    <div className='mainDiv'>
        <div className='png1'>
            <h1 className='heading1'> SENTIMENT ANALYSIS : </h1>
            <h1 className='heading2'>DECODE EMOTIONS IN TEXTS</h1>
            <h1 className='heading3'>WHAT DID YOU SAY!</h1>
            <p className='para1'>Our tool interprets user text to determine positive or negative emotions. It's essential for understanding customer feedback, enhancing experiences, and managing brand reputation.</p>
     
            <h2 className='heading4'></h2>
        <div className='png2'>

        <button className='getS' onClick={handleRedirection}>GET STARTED</button>
        </div>
        <div className='subdiv1'>
            <div className='pic-subdiv1'></div>
            <h1 className='subdiv-head'>WHY SENTIMENT 
            ANALYSIS IS NEEDED ?</h1>
            <p className='subdiv-1-p'>DIVING BEHIND EMOTIONS HELPING BUSSINESS MODELS THRIVE.</p>
            </div>
            
        <div className='subdiv2'>
            <div className='pic-subdiv2'></div>
            <h1 className='subdiv2-head'>MODEL USED : NATURAL LANGUAGE PROCESSING (NLP) </h1>
            <p className='subdiv-2-p'>DIVING BEHIND EMOTIONS HELPING BUSSINESS MODELS THRIVE.</p>
        </div>
        <div className='subdiv3'>
            <div className='pic-subdiv3'></div>
            <h1 className='subdiv-head'>HOW IT WORKS :  </h1>
            <p className='subdiv-3-p'>DIVING BEHIND EMOTIONS HELPING BUSSINESS MODELS THRIVE.</p>
        </div>
        </div>
    </div>
  )
}
