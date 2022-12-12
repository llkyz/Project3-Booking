import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";

export default function Bookings({loggedIn, setLoggedIn, accessLevel}) {
    const navigate = useNavigate()
    const [bookingData, setBookingData] = useState()
    const [category, setCategory] = useState("open")

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
        async function getBookingData() {
            const res = await fetch(config.BACKEND_URL + "calendar/index", {
                method: "GET",
                credentials: "include",
              });
              let result = await res.json();
              console.log(`Response ${res.status}: ${result}`);
              if (res.status === 200) {
                setBookingData(result)
              } else {
                console.log(result)
              }
        }
        checkLoggedIn()
        checkAccess()
        getBookingData()
    },[])

    return(<><h1>Bookings</h1>
    <button style={{"display": "inline-block"}} onClick={()=>setCategory("open")}>Open</button>
    <button style={{"display": "inline-block"}} onClick={()=>setCategory("complete")}>Complete</button>
    <button style={{"display": "inline-block"}} onClick={()=>setCategory("all")}>All</button>
    <button style={{"display": "inline-block"}} onClick={()=>setCategory("ignored")}>Ignored</button>
    {bookingData ? <BookingList bookingData={bookingData} category={category}/> : ""}
    </>)
}

function BookingList({ bookingData, category }) {
    let myList = bookingData.map(data=>data)

    if (category === "all") {
        myList = myList.filter(data=> data.ignore === false)
    } else if (category === "open") {
        myList = myList.filter(data=> data.complete === false && data.ignore === false)
    } else if (category === "complete") {
        myList = myList.filter(data=> data.complete === true && data.ignore === false)
    } else if (category === "ignored") {
        myList = myList.filter(data=> data.ignore === true)
    }

    return(
        <>
        {myList.map((data) => <BookingEntry data={data}/>)}
        </>
    )
}

function BookingEntry({data}) {
    const [details, setDetails] = useState(false)

    function toggleDetails() {
        if (details) {
            setDetails(false)
        } else {
            setDetails(true)
        }
    }

    data.dateTime = new Date(data.dateTime)
    
    async function setComplete(condition) {
        let formBody = `id=${data._id}&complete=${condition}`

        const res = await fetch(config.BACKEND_URL + "calendar", {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
              },
            body: formBody,
          });
          let result = await res.json();
          console.log(`Response ${res.status}: ${result}`);
          if (res.status === 200) {
            console.log(result)
          }
    }

    async function setIgnore(condition) {
        let formBody = `id=${data._id}&ignore=${condition}`

        const res = await fetch(config.BACKEND_URL + "calendar", {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
              },
            body: formBody,
          });
          let result = await res.json();
          console.log(`Response ${res.status}: ${result}`);
          if (res.status === 200) {
            console.log(result)
          }
    }

    async function deleteEntry() {
        let formBody = `id=${data._id}`

        const res = await fetch(config.BACKEND_URL + "calendar", {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
              },
            body: formBody,
          });
          let result = await res.json();
          console.log(`Response ${res.status}: ${result}`);
          if (res.status === 200) {
            console.log(result)
          }
    }

    return (
        <div style={{border: "2px solid black"}}><div onClick={toggleDetails}>Show</div>
        <p>Customer: {data.customer} | Contact: {data.contact} | Date: {data.dateTime.toLocaleDateString('en-SG', {weekday:"short", year: "numeric", month: "short", day: "numeric"})} | Time: {data.dateTime.toLocaleTimeString('en-SG', {hour: '2-digit', minute:'2-digit'})}</p>
        {details ? <div><p>Price: {data.price} | Participants: {data.participants} | Origin: {data.origin} | ID: {data.id}</p>
        <button>Edit</button>
        {data.complete === false && data.ignore === false ? <button onClick={()=>setComplete(true)}>Add to Complete</button> : <button onClick={()=>setComplete(false)}>Set to Open</button>}
        {data.ignore === false ? <button onClick={()=>setIgnore(true)}>Add to Ignore</button> : <button onClick={()=>setIgnore(false)}>Remove from Ignore</button>}
        <button>Delete Entry</button>
        </div> : ""}
        </div>
    )
}