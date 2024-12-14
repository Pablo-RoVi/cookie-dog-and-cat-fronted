import React from "react";
import Routes from "../router/routes";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider} from "../context/authcontext";
function App() {

  return (
    <>
        <BrowserRouter>
          <AuthProvider>
            <Routes />
          </AuthProvider>
        </BrowserRouter>
    </>
  );
}

export default App;