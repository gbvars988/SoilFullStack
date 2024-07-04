import React from "react";
import { useNavigate } from "react-router-dom";
import Vegetables from "../../Assets/veggies-bg.jpg";

import "./home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-colour">
      <div className="main-container">
        <div className="main-container-left">
          <h1>Australia's Best Organic Food</h1>
          <h2> Your one stop destination for all your Organic needs.</h2>
        </div>
        <div className="main-container-divider"></div>
        <div className="main-container-right">
          <img src={Vegetables} alt="Vegetables" />
        </div>
      </div>
    </div>
  );
}

export default Home;
