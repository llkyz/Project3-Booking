import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import config from "../config";

export default function CheckAuth({ ProtectedComponent }) {
  const [authentication, setAuthentication] = useState({
    loading: true,
    redirect: false,
  });

  useEffect(() => {
    async function checkToken() {
      const response = await fetch(config.BACKEND_URL + "checktoken", {
        credentials: "include",
      });
      if (response.status === 200) {
        setAuthentication({ ...authentication, loading: false });
      } else {
        setAuthentication({ loading: false, redirect: true });
      }
    }
    checkToken();
  }, []);

  return (
    <>
      {authentication.loading ? (
        ""
      ) : authentication.redirect ? (
        <Navigate to="/login" replace={true} />
      ) : (
        <ProtectedComponent />
      )}
    </>
  );
}
