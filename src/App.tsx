import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import "./Global.css"
import Map from "./pages/map/map.tsx"
import Home from "./pages/home/home.tsx"

import { useEffect } from 'react';



const pageTitles: Record<string, string> = {
  '/': 'Henning the Navigator | Home',
  '/map': 'Henning the Navigator | Map'
  
};

function TitleUpdater() {
  const location = useLocation();
  useEffect(() => {
    let title = 'UAlberta iGEM';// Set default title
    if (location.pathname in pageTitles) {// Update title based on current path if it exists in our mapping
      title = pageTitles[location.pathname];
    }
    document.title = title;
  }, [location]);
  return null;
}





function App() {

  
  return (
    
    <Router basename="/Henning-the-Navigator">
      <TitleUpdater />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<Map />} />

      </Routes>
    </Router>
  )
}

export default App
//do "npm run deploy" to redeploy