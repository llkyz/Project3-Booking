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

### Home Page

By default, the user needs to be logged in to use any aspect of the app. Hence, the home page simply prompts the user to either log in or register. Once the user is logged in, returning to the home page will redirect the user to the calendar page.

![home](https://user-images.githubusercontent.com/115427253/208719356-9b8943eb-16c6-456c-a5ae-f3ce8a9bac4d.jpg)
---
  
### Login Page

Run-of-the-mill login page with a link to the register page for new users.
  
![login](https://user-images.githubusercontent.com/115427253/208719498-343b3420-bcfb-4679-880c-565f65613639.jpg)
---
  
### Register Page

Requirements of at least 3 characters for a username, and at least 8 characters, 1 lowercase letter, 1 uppercase letter, and 1 number for a password. The character requirements are checked using Regex tests.

![register](https://user-images.githubusercontent.com/115427253/208719534-30e95bd2-32e8-474c-9d5f-66b5c3993e01.jpg)
---

### Calendar Page

The main bulk of the app. Regular users can view the number of records for every day, but they're not allowed to see detailed information, nor create or edit new records. For staff and admin users, alongside full access to records, they are also able to access data from external shopfronts and push them into the calendar.

![calendar](https://user-images.githubusercontent.com/115427253/208719596-1d6d139c-3ed4-42a9-a0bb-2431ad6c46be.jpg)
---

### Sub-category Page (Bookings, Holidays, Offdays, Pickups)

Displays sub-category records in list view. Staff and admin can create new records here, and also sort through records based on name, title, or date.

![sub-category](https://user-images.githubusercontent.com/115427253/208719633-81f45aa4-b086-4f98-8a2d-fb0dfaed9d03.jpg)
---

### Profile Page

A page that any user can access to see their own username and access level. Users can also change their password here. New passwords are also subject to the requirements of at least 8 characters, 1 lowercase letter, 1 uppercase letter, and 1 number.

![profile](https://user-images.githubusercontent.com/115427253/208719749-4cd1d6b1-0023-4c17-8dad-120ba033d5db.jpg)
---

### User List Page

The admin page for managing user information. Users with admin access can access a list of all users, with their usernames and access level. Passwords are protected and will not be shown. Admins can modify user access levels, or delete a user entirely. 

![user-list](https://user-images.githubusercontent.com/115427253/208719661-d44e0222-925e-4b4d-9df8-34116940c98a.jpg)
---

## Challenges

Getting the dateTimes of records to function properly proved to be a challenge. Although nothing seemed out of the ordinary during development, problems arise once the code is deployed onto the production servers. Since the servers are located in a different timezone, the server's local time would be in conflict with the user's local time, leading to the user inputting a certain timing but getting back an entirely different timing. This was eventually resolved by offsetting all the input timings, and working solely with UTC time. 

<hr>

## APIs Used

- [Shopify API Node.js](https://www.npmjs.com/package/shopify-api-node)
