import React from "react";
import UserPage from "../../features/user/userpage";
import Routes from "../router/routes";
import { BrowserRouter } from "react-router-dom";

function App() {

  return (
    <>
      <BrowserRouter>
          <Routes />
      </BrowserRouter>
    </>
  );
}

export default App;