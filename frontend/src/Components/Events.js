import React, {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom";
import config from "../config";

export default function Events({loggedIn, setLoggedIn, accessLevel}) {
    const [eventData, setEventData] = useState()
    const navigate = useNavigate()

    useEffect(()=>{
        function checkLoggedIn() {
            if (!loggedIn) {
              navigate("/login");
            }
          }
        function checkAccess() {
            if (accessLevel !== "staff" && accessLevel !== "admin") {
                navigate("/login")
            }
        }
        checkLoggedIn()
        checkAccess()
        getBookingData()
        // eslint-disable-next-line
      },[accessLevel, loggedIn, navigate, setLoggedIn])

      async function getBookingData() {
        const res = await fetch(config.BACKEND_URL + "events/index", {
            method: "GET",
            credentials: "include",
          });
          let result = await res.json();
          console.log(`Response ${res.status}: ${result}`);
          if (res.status === 200) {
            setEventData(result)
          } else if (res.status === 401) {
            console.log(result)
            setLoggedIn(false)
          }
    }

    return (<h1>Events</h1>)
}