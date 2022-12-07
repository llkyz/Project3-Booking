import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [expressData, setExpressData] = useState();

  useEffect(() => {
    async function callBackendAPI() {
      const response = await fetch("http://127.0.0.1:5000/fetch");
      let data = await response.json();
      if (response.status !== 200) {
        throw Error(data.message);
      }
      setExpressData(data);
    }
    callBackendAPI();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        {expressData ? <h1>{JSON.stringify(expressData)}</h1> : ""}
      </header>
    </div>
  );
}

export default App;
