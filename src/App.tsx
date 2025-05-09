import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./Global.css"
import Map from "./pages/map/map.tsx"

function App() {

  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Map />} />

      </Routes>
    </Router>
  )
}

export default App
