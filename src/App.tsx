// import logo from './logo.svg';
import './App.css';
import './tailwind.css'
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

function getLogo() {
    return '1'
    // if (window.chrome) {
    //   return window.chrome.runtime.getURL(logo);
    // }
  
    // return logo;
  }
  
  function App() {
    return (
      <div className="App rotate-90">
        <header className="App-header">
          <img src={getLogo()} className="App-logo" alt="logo" />
          <p>Hello, World!</p>
          <p>I'm a Content Script in a Chrome Extension!</p>
        </header>
      </div>
    );
  }
  
  export default App;
  