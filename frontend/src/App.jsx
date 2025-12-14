import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Analyze from "./pages/analyze.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/analyze" element={<Analyze />} />
        <Route path="*" element={<Navigate to="/analyze" replace />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
