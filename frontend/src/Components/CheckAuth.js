import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function CheckAuth({ ProtectedComponent }) {
  const [authentication, setAuthentication] = useState({
    loading: true,
    redirect: false,
  });

  useEffect(() => {
    async function checkToken() {
      const response = await fetch(process.env.BACKEND_URL + "checktoken", {
        credentials: "include",
      });
      if (response.status == 200) {
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