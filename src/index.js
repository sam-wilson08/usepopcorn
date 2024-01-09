import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppFinal from './AppFinal.js';
// import CurrencyConverterApp from './CurrencyConverter';

import App4 from './App4';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App4/>
    {/* <StarRating defaultRating={3} maxRating={5} messages={["Terrible", "Bad", "Okay", "Good", "Amazing"]}/> */}
    {/* <Test/> */}
    
  </React.StrictMode>
);

function Test(){
const [movieRating, setMovieRating] = useState(0)

  return(
    <div>
    {/* <StarRating color="blue" onSetRating={setMovieRating} />
    <p>This movie is rated {movieRating} stars</p> */}
    {/* <TextApp/> */}
    </div>
  )
}