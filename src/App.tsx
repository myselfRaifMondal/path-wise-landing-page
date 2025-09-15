import React from "react";
import LandingPage from "./LandingPage";

function App() {
  return <LandingPage />;
}

export default App;

// src/index.tsx (for Create React App)
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // Tailwind styles

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);