import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { WSContextProvider } from './utils/contexts/ExternalWSConnection.jsx'

import './styles/reset.css'
import './styles/system.css'
import './styles/app.css'
import './styles/upper.css'
import './styles/middle.css'
import './styles/lower.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  import.meta.env.DEV ?   
    <WSContextProvider>
      <React.StrictMode><Router basename='/kingfisher'><App /></Router></React.StrictMode>
    </WSContextProvider>:
    <WSContextProvider>
      <Router basename='/kingfisher'><App /></Router>
    </WSContextProvider>
)

