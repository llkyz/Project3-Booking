import React, { useState } from "react";
import config from "../config";
import CalendarGrid2 from "./CalendarGrid2";

export default function Calendar2({ loggedIn }) {
  const [sophieData, setSophieData] = useState();
  const [shopifyData, setShopifyData] = useState();

  async function submitEntry(
    data,
    index,
    dataInput,
    setdataInput,
    ignoreCheck
  ) {
    let formBody = {};
    for (let property in data) {
      formBody[property] = data[property];
    }
    if (ignoreCheck) {
      formBody.ignore = true;
    }

    const res = await fetch(config.BACKEND_URL + "booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formBody),
    });
    if (res.ok) {
      setdataInput(dataInput.filter((d, i) => i !== index));
    } else {
      console.log(await res.json());
    }
  }

  async function getSophieData() {
    const response = await fetch(config.BACKEND_URL + "fetch/sophie", {
      credentials: "include",
    });
    let data = await response.json();
    if (response.status === 200) {
      setSophieData(data);
    } else {
      console.log(data);
    }
  }

  async function getShopifyData() {
    const response = await fetch(config.BACKEND_URL + "fetch/shopify", {
      credentials: "include",
    });
    let data = await response.json();
    if (response.status === 200) {
      setShopifyData(data);
    } else {
      console.log(data);
    }
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
      {loggedIn ? (
        <>
          <CalendarGrid2 />
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
      ) : (
        ""
      )}
    </>
  );
}
