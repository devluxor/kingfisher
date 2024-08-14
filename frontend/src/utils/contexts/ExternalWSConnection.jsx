import { createContext, useState } from 'react';

// Create new context
export const WSContext = createContext();

// Create Provider to wrap app
export const WSContextProvider = ({ children }) => {
  const [activeWSConnection, setActiveWSConnection] = useState();

  return (
    <WSContext.Provider value={{ activeWSConnection, setActiveWSConnection }}>{children}</WSContext.Provider>
  )
}