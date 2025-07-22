import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./Global.css"
import Map from "./pages/map/map.tsx"

function App() {

  
  return (
    <Router basename="/Henning-the-Navigator">
      <Routes>
        <Route path="/" element={<Map />} />

      </Routes>
    </Router>
  )
}

export default App
//do "npm run deploy" to redeploy