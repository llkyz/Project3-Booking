import React, { useEffect } from "react";
import { useNavigate } from "react-router";

export default function Home({ loggedIn }) {
  const navigate = useNavigate();

  useEffect(() => {
    function checkLoggedIn() {
      if (loggedIn) {
        navigate("/calendar");
      }
    }
    checkLoggedIn();
  }, []);

  return (
    <h1>
      Welcome to Sppfy Calendar! To utilise the calendar app, please log in.
    </h1>
  );
}
