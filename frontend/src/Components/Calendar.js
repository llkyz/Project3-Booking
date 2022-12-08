import React, { useState } from "react";
import config from "../config";

export default function Calendar() {
  const [sophieData, setSophieData] = useState();
  const [shopifyData, setShopifyData] = useState();

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

  return (
    <>
      "Calendar"
      <div onClick={getSophieData}>Get Sophie Data</div>
      {sophieData ? JSON.stringify(sophieData) : ""}
      <div onClick={getShopifyData}>Get Shopify Data</div>
      {shopifyData ? JSON.stringify(shopifyData) : ""}
    </>
  );
}
