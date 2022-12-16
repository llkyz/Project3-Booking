import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import sppfyLogo from "../Assets/sppfy_logo.png";

export default function Home({ loggedIn }) {
  const navigate = useNavigate();

  useEffect(() => {
    function checkLoggedIn() {
      if (loggedIn) {
        navigate("/calendar");
      }
    }
    checkLoggedIn();
  }, [loggedIn, navigate]);

  return (
    <>
      <img src={sppfyLogo} alt="logo" style={{ marginTop: "100px" }} />
      <h1 style={{ marginTop: "100px", marginBottom: "100px" }}>
        Welcome to SPPFY Calendar! Please log in to use the calendar app.
      </h1>
    </>
  );
}
