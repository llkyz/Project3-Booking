import React, {useState, useEffect} from "react";
import magnifyingGlass from "../Assets/search.svg"

export default function Searchbar({dataList, setDataList, setSearchQuery}) {
    const [sortQuery, setSortQuery] = useState("date-asc")

    useEffect(()=>{
        if (dataList) {
            if (sortQuery === "date-asc") {
                console.log("do ascending")
                let tempList = dataList.map(data=>data)
                tempList.sort((a, b) => {
                    let dateA = new Date(a.dateTime).getTime()
                    let dateB = new Date(b.dateTime).getTime()
                    if (dateA < dateB) return -1;
                    else return 1
                })
                console.log(tempList)
                setDataList(tempList)
            } else if (sortQuery === "date-dsc") {
                let tempList = dataList.map(data=>data)
                tempList.sort((a, b) => {
                    let dateA = new Date(a.dateTime).getTime()
                    let dateB = new Date(b.dateTime).getTime()
                    if (dateA > dateB) return -1;
                    else return 1
                })
                setDataList(tempList)
            }
        }
        //eslint-disable-next-line
    },[sortQuery])

    return(
        <div className="searchbar">
            <div className="search">
                <img className="magnifyingGlass" src={magnifyingGlass} alt="search"/>
                <input className="searchBox" type="text" onChange={(event)=>{
                    setSearchQuery(event.currentTarget.value)
                }}></input>
            </div>
            <div className="sort">
                <select
                    onChange={(event)=>{setSortQuery(event.currentTarget.value)}}
                    defaultValue="sort"
                    style={{fontSize: "1em"}}
                    dir="rtl"
                >
                    <option value="sort" disabled>Sort By</option>
                    <option value="date-asc">Date Ascending</option>
                    <option value="date-dsc">Date Descending</option>
                </select>
            </div>
        </div>
    )
}