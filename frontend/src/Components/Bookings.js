import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";

export default function Bookings({loggedIn, setLoggedIn, accessLevel}) {
    const navigate = useNavigate()
    const [bookingData, setBookingData] = useState()
    const [newBooking, setNewBooking] = useState(false)
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
        checkLoggedIn()
        checkAccess()
        getBookingData()
        // eslint-disable-next-line
      },[accessLevel, loggedIn, navigate, setLoggedIn])
      
      async function getBookingData() {
          const res = await fetch(config.BACKEND_URL + "booking/index", {
              method: "GET",
              credentials: "include",
            });
            let result = await res.json();
            console.log(`Response ${res.status}: ${result}`);
            if (res.status === 200) {
              setBookingData(result)
            } else if (res.status === 401) {
              console.log(result)
              setLoggedIn(false)
            }
      }

    return(<><h1>Bookings</h1>
    <div><button onClick={()=>setNewBooking(true)}>Create new booking</button></div>
    <button onClick={()=>setCategory("open")}>Open</button>
    <button onClick={()=>setCategory("complete")}>Complete</button>
    <button onClick={()=>setCategory("all")}>All</button>
    <button onClick={()=>setCategory("ignored")}>Ignored</button>
    {bookingData ? <BookingList bookingData={bookingData} category={category} getBookingData={getBookingData}/> : ""}
    {newBooking ? <NewBooking setNewBooking={setNewBooking} getBookingData={getBookingData}/> : ""}
    </>)
}

function NewBooking({setNewBooking, getBookingData}) {
  const [errorMesssage, setErrorMessage] = useState()

  let myDate = new Date()
  let year = myDate.getFullYear()
  let month = (myDate.getMonth() + 1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
  let day = myDate.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
  let defaultDateTime = year + "-" + month + "-" + day + "T00:00"

  async function createBooking(event) {
    event.preventDefault()
    if (!event.target.form[0].value) {
      setErrorMessage("Customer name is required")
    } else {
      let formBody = {}
      formBody.customer = event.target.form[0].value
      if (event.target.form[1].value) {
        formBody.contact = event.target.form[1].value
      }
      formBody.dateTime = event.target.form[2].value
      if (event.target.form[3].value) {
        formBody.price = event.target.form[3].value
      }
      if (event.target.form[4].value) {
        formBody.participants = event.target.form[4].value
      }
      formBody.origin = "manual"
      if (event.target.form[6].value) {
        formBody.id = event.target.form[6].value
      }
      formBody.complete = event.target.form[7].checked
      formBody.ignore = event.target.form[8].checked
      const res = await fetch(config.BACKEND_URL + "booking", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify(formBody),
      });
      if (res.status === 200) {
        getBookingData()
        setErrorMessage(false)
        setNewBooking(false)
      }
    }
  }

  return (
    <>
    <div onClick={()=>setNewBooking(false)} style={{backgroundColor: "grey", position: "fixed", height: "100%", width: "100%", top: 0, left: 0, opacity: 0.5, zIndex: 10}}/>
    <div style={{backgroundColor: "white", position: "fixed", height: "60%", width: "500px", zIndex: 20, top: 0, bottom: 0, left: 0, right: 0, margin: "auto", textAlign: "center"}}>
      <h1>New Booking</h1>
      {errorMesssage ? <h4>{errorMesssage}</h4> : ""}
      <form>
        <div>
        <label htmlFor="customer">Customer* : </label>
        <input type="text" name="customer"/>
        </div>
        <div>
        <label htmlFor="contact">Contact : </label>
        <input type="text" name="contact"/>
        </div>
        <div>
        <label htmlFor="date">Date / Time: </label>
        <input type="datetime-local" name="date" defaultValue={defaultDateTime}/>
        </div>
        <div>
        <label htmlFor="price">Price: </label>
        <input type="number" name="price"/>
        </div>
        <div>
        <label htmlFor="participants">Participants: </label>
        <input type="number" name="participants"/>
        </div>
        <div>
        <label htmlFor="origin">Origin: </label>
        <input type="text" name="origin" defaultValue="Manual" disabled/>
        </div>
        <div>
        <label htmlFor="id">ID: </label>
        <input type="number" name="id"/>
        </div>
        <div>
        <label htmlFor="complete">Complete: </label>
        <input type="checkbox" name="complete"/>
        </div>
        <div>
        <label htmlFor="ignore">Ignore: </label>
        <input type="checkbox" name="ignore"/>
        </div>
        <input type="submit" value="Submit" onClick={(event)=>createBooking(event)}/>
      </form>
      <button onClick={()=>setNewBooking(false)}>Cancel</button></div>
      </>
  )
}

function BookingList({ bookingData, category, getBookingData }) {
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
        {myList.map((data) => <BookingEntry data={data} getBookingData={getBookingData}/>)}
        </>
    )
}

function BookingEntry({data, getBookingData}) {
    const [showDetails, setShowDetails] = useState(false)
    const [showDelete, setShowDelete] = useState(false)
    const [showEdit, setShowEdit] = useState(false)

    function toggleDetails() {
        if (showDetails) {
          setShowDetails(false)
        } else {
          setShowDetails(true)
        }
    }

    data.dateTime = new Date(data.dateTime)
    
    async function setComplete(condition) {
        let formBody = `_id=${data._id}&complete=${condition}`

        const res = await fetch(config.BACKEND_URL + "booking", {
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
            getBookingData()
            setShowDelete(false)
            setShowDetails(false)
          }
    }

    async function setIgnore(condition) {
        let formBody = `_id=${data._id}&ignore=${condition}`

        const res = await fetch(config.BACKEND_URL + "booking", {
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
            getBookingData()
            setShowDelete(false)
            setShowDetails(false)
          }
    }

    async function deleteEntry() {
        let formBody = `_id=${data._id}`

        const res = await fetch(config.BACKEND_URL + "booking", {
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
            getBookingData()
            setShowDelete(false)
            setShowDetails(false)
          }
    }

    return (
        <div style={{border: "2px solid black"}}><div onClick={toggleDetails}>Show</div>
        <p>Customer: {data.customer} | Contact: {data.contact} | Date: {data.dateTime.toLocaleDateString('en-SG', {weekday:"short", year: "numeric", month: "short", day: "numeric"})} | Time: {data.dateTime.toLocaleTimeString('en-SG', {hour: '2-digit', minute:'2-digit'})}</p>
        {showDetails ? <div><p>Price: {data.price} | Participants: {data.participants} | Origin: {data.origin} | ID: {data.id}</p>
        <button onClick={()=>setShowEdit(true)}>Edit</button>
        {data.complete === false && data.ignore === false ? <button onClick={()=>setComplete(true)}>Add to Complete</button> : <button onClick={()=>setComplete(false)}>Set to Open</button>}
        {data.ignore === false ? <button onClick={()=>setIgnore(true)}>Add to Ignore</button> : <button onClick={()=>setIgnore(false)}>Remove from Ignore</button>}
        <button onClick={()=>setShowDelete(true)}>Delete Entry</button>
        {showDelete ? <div>
          <p>Really delete this entry?</p>
          <button onClick={deleteEntry}>Confirm</button>
          <button onClick={()=>setShowDelete(false)}>Cancel</button>
        </div>: ""}
        </div> : ""}
        {showEdit ? <EditModal data={data} getBookingData={getBookingData} setShowEdit={setShowEdit}/> : ""}
        </div>
    )
}

function EditModal({data, getBookingData, setShowEdit}) {

  async function submitEdit(event) {
    event.preventDefault()
    let formBody = []
    if (event.target.form[0].value) {
      formBody.push(`customer=${event.target.form[0].value}`)
    }
    if (event.target.form[1].value) {
      formBody.push(`contact=${event.target.form[1].value}`)
    }
    if (event.target.form[2].value) {
      formBody.push(`dateTime=${encodeURIComponent(new Date(event.target.form[2].value))}`)
    }
    if (event.target.form[3].value) {
      formBody.push(`price=${event.target.form[3].value}`)
    }
    if (event.target.form[4].value) {
      formBody.push(`participants=${event.target.form[4].value}`)
    }
    if (event.target.form[5].value) {
      formBody.push(`origin=${event.target.form[5].value}`)
    }
    if (event.target.form[6].value) {
      formBody.push(`id=${event.target.form[6].value}`)
    }
    formBody.push(`complete=${event.target.form[7].checked}`)
    formBody.push(`ignore=${event.target.form[8].checked}`)
    formBody.push(`_id=${data._id}`)
    formBody = formBody.join("&")

    const res = await fetch(config.BACKEND_URL + "booking", {
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
      getBookingData()
      setShowEdit(false)
    }
  }

  let dateTime = new Date(data.dateTime)
  let year = dateTime.getFullYear()
  let month = (dateTime.getMonth() + 1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
  let day = dateTime.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
  let hour = dateTime.getHours().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
  let minute = dateTime.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
  let defaultDateTime = year + "-" + month + "-" + day + "T" + hour + ":" + minute

  return (<>
    <div onClick={()=>setShowEdit(false)} style={{backgroundColor: "grey", position: "fixed", height: "100%", width: "100%", top: 0, left: 0, opacity: 0.5, zIndex: 10}}/>
    <div style={{backgroundColor: "white", position: "fixed", height: "60%", width: "500px", zIndex: 20, top: 0, bottom: 0, left: 0, right: 0, margin: "auto", textAlign: "center"}}>
      <h1>Edit Booking</h1>
      <form>
        <div>
        <label htmlFor="customer">Customer: </label>
        <input type="text" name="customer" placeholder={data.customer}/>
        </div>
        <div>
        <label htmlFor="contact">Contact: </label>
        <input type="text" name="contact" placeholder={data.contact}/>
        </div>
        <div>
        <label htmlFor="date">Date / Time: </label>
        <input type="datetime-local" name="date" defaultValue={defaultDateTime}/>
        </div>
        <div>
        <label htmlFor="price">Price: </label>
        <input type="number" name="price" placeholder={data.price}/>
        </div>
        <div>
        <label htmlFor="participants">Participants: </label>
        <input type="number" name="participants" placeholder={data.participants}/>
        </div>
        <div>
        <label htmlFor="origin">Origin: </label>
        <input type="text" name="origin" placeholder={data.origin}/>
        </div>
        <div>
        <label htmlFor="id">ID: </label>
        <input type="number" name="id" placeholder={data.id}/>
        </div>
        <div>
        <label htmlFor="complete">Complete: </label>
        <input type="checkbox" name="complete" defaultChecked={data.complete ?? ""}/>
        </div>
        <div>
        <label htmlFor="ignore">Ignore: </label>
        <input type="checkbox" name="ignore" defaultChecked={data.ignore ?? ""}/>
        </div>
        <input type="submit" value="Submit" onClick={(event)=>submitEdit(event)}/>
      </form>
      <button onClick={()=>setShowEdit(false)}>Cancel</button>
    </div>
  </>
  )
}