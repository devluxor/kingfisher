import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  import.meta.env.DEV ?   
    <React.StrictMode><App /></React.StrictMode> :
    <App />
)

