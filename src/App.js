import "./App.css";
import React, { useEffect, useState } from "react";
import GoogleLogin from "react-google-login";
import { loadGapiInsideDOM } from "gapi-script";

function App() {
  const [loginData, setLoginData] = useState(
    localStorage.getItem("loginData")
      ? JSON.parse(localStorage.getItem("loginData"))
      : null
  );

  const handleFailure = (result) => {
    //alert(result);
    console.log(result);
  };
  const handleLogin = async (googleData) => {
    const res = await fetch("http://localhost:8080/api/google/token/verify", {
      method: "POST",
      body: JSON.stringify({ token: googleData.tokenId }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    setLoginData(data);
    localStorage.setItem("loginData", JSON.stringify(data));
    console.log(data);
  };
  const handleLogout = () => {
    localStorage.removeItem("loginData");
    setLoginData(null);
  };

  useEffect(() => {
    (async () => {
      await loadGapiInsideDOM();
    })();
  });

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Google Login App</h1>
        <div>
          {loginData ? (
            <div>
              <h3>You logged in as {loginData.email}</h3>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
              buttonText="Log in with Google"
              onSuccess={handleLogin}
              onFailure={handleFailure}
              cookiePolicy={"single_host_origin"}
            ></GoogleLogin>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
