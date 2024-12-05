import React from "react";
import Navbar from "../../app/components/navbar";
import "../../app/static/styles/index.css";
import Agent from "../../app/api/agent";

const HomePage = () => {

  const userList = async () => {
    console.log(process.env.REACT_APP_API_URL);
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1>Home Page</h1>
            <button onClick={userList}>List Users</button>
          </div>
        </div>
      </div>
    </div>
  );    
}

export default HomePage;