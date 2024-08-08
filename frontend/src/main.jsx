import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {BrowserRouter as Router } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  import.meta.env.DEV ?   
    <React.StrictMode><Router><App /></Router></React.StrictMode> :
    <Router><App /></Router>
)

