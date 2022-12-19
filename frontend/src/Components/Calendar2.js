import React, { useEffect, useState, useRef } from "react";
import config from "../config";
import CalendarGrid2 from "./CalendarGrid2";

export default function Calendar2({ loggedIn, accessLevel }) {
  const [sophieData, setSophieData] = useState();
  const [shopifyData, setShopifyData] = useState();
  const [externalDetails, setExternalDetails] = useState("");
  const sophieRef = useRef();
  const shopifyRef = useRef();

  useEffect(() => {
    async function getData() {
      await getSophieData();
      await getShopifyData();
    }
    if (accessLevel === "staff" || accessLevel === "admin") {
      getData();
    }
    //eslint-ignore-next-line
  }, [accessLevel]);

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

  async function toggleSophie() {
    if (externalDetails === "sophie") {
      setExternalDetails("");
    } else {
      setExternalDetails("sophie");
    }
  }

  async function toggleShopify() {
    if (externalDetails === "shopify") {
      setExternalDetails("");
    } else {
      setExternalDetails("shopify");
    }
  }

  function ExternalDataButtons() {
    return (
      <div className="externalDataContainer">
            <div
              className="externalData"
              ref={sophieRef}
              onClick={toggleSophie}
            >
              <div className="externalDataHeader">Sophie</div>
              {sophieData ? (
                <div
                  className="externalDataEntry"
                  style={{
                    backgroundColor: sophieData.length !== 0 ? "red" : "",
                    color: sophieData.length !== 0 ? "white" : "",
                  }}
                >
                  {sophieData.length}
                </div>
              ) : (
                <div className="externalDataLoading">
                  <div className="loading" />
                </div>
              )}
            </div>
            <div
              className="externalData"
              ref={shopifyRef}
              onClick={toggleShopify}
            >
              <div className="externalDataHeader">Shopify</div>
              {shopifyData ? (
                <div
                  className="externalDataEntry"
                  style={{
                    backgroundColor: shopifyData.length !== 0 ? "red" : "",
                    color: shopifyData.length !== 0 ? "white" : "",
                  }}
                >
                  {shopifyData.length}
                </div>
              ) : (
                <div className="externalDataLoading">
                  <div className="loading" />
                </div>
              )}
            </div>
          </div>
    )
  }

  return (
    <>
      {loggedIn ? (
        <>
          <h1>Calendar</h1>
          {accessLevel === "staff" || accessLevel === "admin" ? <ExternalDataButtons/> : ""}
          <div className="calendar">
            {externalDetails === "sophie" ? (
              <ExternalDetails
                externalData={sophieData}
                setExternalData={setSophieData}
                sophieRef={sophieRef}
                shopifyRef={shopifyRef}
                source={"sophie"}
                setExternalDetails={setExternalDetails}
              />
            ) : externalDetails === "shopify" ? (
              <ExternalDetails
                externalData={shopifyData}
                setExternalData={setShopifyData}
                sophieRef={sophieRef}
                shopifyRef={shopifyRef}
                source={"shopify"}
                setExternalDetails={setExternalDetails}
              />
            ) : (
              ""
            )}
            <CalendarGrid2 accessLevel={accessLevel}/>
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
}

function ExternalDetails({
  externalData,
  setExternalData,
  sophieRef,
  shopifyRef,
  source,
  setExternalDetails,
}) {
  const detailRef = useRef();
  useOutsideClick(detailRef, setExternalDetails, sophieRef, shopifyRef);

  return (
    <div className="externalDetails" ref={detailRef}>
      <h2>
        {source[0].toUpperCase() + source.substring(1, source.length)} Bookings
      </h2>
      {externalData ? (
        externalData.length === 0 ? (
          <h4>No new bookings</h4>
        ) : (
          externalData.map((data, index) => (
            <ExternalDetailEntry
              key={index}
              data={data}
              index={index}
              externalData={externalData}
              setExternalData={setExternalData}
            />
          ))
        )
      ) : (
        <h4>Retrieving data...</h4>
      )}
    </div>
  );
}

function ExternalDetailEntry({ data, index, externalData, setExternalData }) {
  const [errorMessage, setErrorMessage] = useState();

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
    console.log(`Response ${res.status}: ${await res.json()}`);
    if (res.status === 200) {
      setdataInput(dataInput.filter((d, i) => i !== index));
    } else {
      setErrorMessage(`Error, unable to process: Response ${res.status}`);
    }
  }

  data.dateTime = new Date(data.dateTime);

  return (
    <div className="externalEntry">
      {errorMessage ? (
        <h4 style={{ margin: "0px 0px 10px 0px" }}>{errorMessage}</h4>
      ) : (
        ""
      )}
      <div className="entryTextGrid" style={{ marginBottom: "10px" }}>
        <div className="entryTextGrid" style={{ marginRight: "10px" }}>
          <div className="label">Name</div>
          <div className="entryTextItem">{data.customer}</div>
          <div className="label">Contact</div>
          <div className="entryTextItem">{data.contact}</div>
          <div className="label">Participants</div>
          <div className="entryTextItem">{data.participants}</div>
        </div>
        <div className="entryTextGrid">
          <div className="label">Date</div>
          <div className="entryTextItem">
            {data.dateTime.toLocaleDateString("en-SG", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
          <div className="label">Time</div>
          <div className="entryTextItem">
            {data.dateTime.toLocaleTimeString("en-SG", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div className="label">Price</div>
          <div className="entryTextItem">${data.price}</div>
        </div>
      </div>
      <button
        onClick={() =>
          submitEntry(data, index, externalData, setExternalData, false)
        }
      >
        Add
      </button>
      <button
        onClick={() =>
          submitEntry(data, index, externalData, setExternalData, true)
        }
      >
        Ignore
      </button>
    </div>
  );
}

function useOutsideClick(detailRef, setExternalDetails, sophieRef, shopifyRef) {
  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        detailRef.current &&
        !(
          detailRef.current.contains(event.target) ||
          sophieRef.current.contains(event.target) ||
          shopifyRef.current.contains(event.target)
        )
      ) {
        setExternalDetails("");
      }
    }
    document.addEventListener("mouseup", handleOutsideClick);
    return () => {
      document.removeEventListener("mouseup", handleOutsideClick);
    };
  }, [detailRef, setExternalDetails, sophieRef, shopifyRef]);
}
