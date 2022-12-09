import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";

export default function Calendar({ loggedIn }) {
  const [sophieData, setSophieData] = useState();
  const [shopifyData, setShopifyData] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    function checkLoggedIn() {
      if (!loggedIn) {
        navigate("/login");
      }
    }
    checkLoggedIn();
  }, [loggedIn, navigate]);

  async function submitEntry(
    data,
    index,
    dataInput,
    setdataInput,
    ignoreCheck
  ) {
    let formBody = [];
    for (let property in data) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(data[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    console.log(ignoreCheck);
    if (ignoreCheck) {
      formBody.push("ignore=true");
    }
    formBody = formBody.join("&");

    const res = await fetch(config.BACKEND_URL + "calendar", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      credentials: "include",
      body: formBody,
    });
    console.log(`Response ${res.status}: ${await res.json()}`);
    if (res.status === 200) {
      setdataInput(dataInput.filter((d, i) => i !== index));
    }
  }

  async function getSophieData() {
    const response = await fetch(config.BACKEND_URL + "fetch/sophie", {
      credentials: "include",
    });
    let data = await response.json();
    if (response.status !== 200) {
      throw Error(data.message);
    }
    setSophieData(data);
  }

  async function getShopifyData() {
    const response = await fetch(config.BACKEND_URL + "fetch/shopify", {
      credentials: "include",
    });
    let data = await response.json();
    if (response.status !== 200) {
      throw Error(data.message);
    }
    setShopifyData(data);
  }

  function ShowData({ dataInput, setDataInput }) {
    return dataInput.map((data, index) => {
      return (
        <div style={{ border: "2px solid black" }}>
          <p>Origin: {data.origin}</p>
          <p>ID: {data.id}</p>
          <p>Price: {data.price}</p>
          <p>Participants: {data.participants}</p>
          <p>dateTime: {data.dateTime}</p>
          <p>Name: {data.customer}</p>
          <p>Contact: {data.contact}</p>
          <button
            onClick={() =>
              submitEntry(data, index, dataInput, setDataInput, false)
            }
          >
            Add to Calendar
          </button>
          <button
            onClick={() =>
              submitEntry(data, index, dataInput, setDataInput, true)
            }
          >
            Add to Ignore List
          </button>
        </div>
      );
    });
  }

  return (
    <>
      "Calendar"
      <div onClick={getSophieData}>Get Sophie Data</div>
      {sophieData ? (
        <ShowData dataInput={sophieData} setDataInput={setSophieData} />
      ) : (
        ""
      )}
      <div onClick={getShopifyData}>Get Shopify Data</div>
      {shopifyData ? (
        <ShowData dataInput={shopifyData} setDataInput={setShopifyData} />
      ) : (
        ""
      )}
    </>
  );
}
