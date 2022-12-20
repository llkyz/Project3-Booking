# SPPFY Calendar

A web application for [SPPFY](https://www.sppfy.com/) to manage scheduling. The calendar can handle customer bookings, holidays, staff off-days, and customer pickups. The app comes with both a calendar view for planning day-to-day operations, and a list view for ease of sifting through data.

Bookings from separate shopfronts are also aggregated and can be merged into the calendar.

## Usage

The app is hosted online at https://shy-gray-piranha-belt.cyclic.app/.

Users can register and login to view limited information on the calendar. Only users with additional access can view and edit full records.

## Technologies Used

- ExpressJS <picture><source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/llkyz/llkyz/icons/express/express-white-original.svg"><img height="30" width="30" src="https://cdn.jsdelivr.net/gh/llkyz/llkyz/icons/express/express-original.svg"></picture>
- MongoDB <picture><source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/llkyz/llkyz/icons/mongodb/mongodb-original.svg"><img height="30" width="30" src="https://cdn.jsdelivr.net/gh/llkyz/llkyz/icons/mongodb/mongodb-original.svg"></picture>
- ReactJS <picture><source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/llkyz/llkyz/icons/react/react-original.svg"><img height="30" width="30" src="https://cdn.jsdelivr.net/gh/llkyz/llkyz/icons/react/react-original.svg"></picture> 
- HTML5 <picture><source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/llkyz/llkyz/icons/html5/html5-white-original-wordmark.svg"><img height="30" width="30" src="https://cdn.jsdelivr.net/gh/llkyz/llkyz/icons/html5/html5-original-wordmark.svg"></picture>
- CSS3 <picture><source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/llkyz/llkyz/icons/css3/css3-white-original-wordmark.svg"><img height="30" width="30" src="https://cdn.jsdelivr.net/gh/llkyz/llkyz/icons/css3/css3-original-wordmark.svg"></picture>
- JavaScript <picture><source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/llkyz/llkyz/icons/javascript/javascript-original.svg"><img height="30" width="30" src="https://cdn.jsdelivr.net/gh/llkyz/llkyz/icons/javascript/javascript-original.svg"></picture>

## User Stories

As a business owner of a terrarium workshop, I want an app to help track customer bookings. I also want to combine the bookings from my multiple storefronts into a single calendar.

## Wireframe

## Layout

## Challenges

Getting the dateTimes of records to function properly proved to be a challenge. Although nothing seemed out of the ordinary during development, problems arise once the code is deployed onto the production servers. Since the servers are located in a different timezone, the server's local time would be in conflict with the user's local time, leading to the user inputting a certain timing but getting back an entirely different timing. This was eventually resolved by offsetting all the input timings, and working solely with UTC time. 

<hr>

## APIs Used

- [Shopify API Node.js](https://www.npmjs.com/package/shopify-api-node)
