# Constellation
A full stack character managing website. Users can upload, edit, and delete their own characters and manage them from the creator dashboard. They can also view and favorite other's characters and manage them on a favorites dashboard. Admins can manage the site through the admin dashboard and explore page.

## Live Link: (WIP)

## Demo Video Link: (WIP)

## TEAM, CONTRIBUTIONS, AND PROOF OF COLLABORATION
- Izzy Carlson (Project Manager)
    - Authentication and Routing
    - Database Setup and Validation
    - User Profile
    - Notification System
    - Main UI Designer
    - Debugging
    - Deploy
- Landon Chapin
    - Search (Explore)
    - Character creation page
    - Favorites Page (Favorites Dashboard)
    - Home Page
    - UML

- Esperanza Paulino
    - Task


We communicated via Discord and managed a Google Document with weekly tasks and overall project goals.

## MOORE'S VISION TEMPLATE (PROBLEM STATEMENT AND TARGET USERS)
- FOR anybody who creates characters, such as indie game developers or artists
- WHO need a place to store and manage characters for any variety of reasons like managing a storyline
- Constellation is a place where user's can create, edit, and delete their own characters as well as explore and favorite others' characters
- THAT is free, easily accessible, has a simple user interface, and allows for getting inspiration from other artists’ or character designers’ work
- UNLIKE Campfire we will not have any hidden fees and unlike Toyhou.se we will not require an invite code to join
- OUR PRODUCT is an innovative and simple way of managing your characters

## TECH STACK
- Frontend
    - React + Vite
    - Tailwind CSS with DaisyUI Plugin
    - React Router and React Router Dom
    - React Icons
    - React Toastify
    - Firebase
    - Pusher-js
    - Pico colors
    - ImgBB
- Backend
    - Node.js + Express.js
    - Joi
    - Firebase Admin
    - Mongoose
    - Dotenv
    - Cors
    - Pusher
- Database
    - MongoDB Atlas

## USER ROLES
**Creator**
- Can post new characters, edit their existing characters, delete their existing characters
- View a dashboard of all their characters
- Favorite other user's characters and view a dashboard of their favorites

**Admin**
- View an admin dashboard where they can delete, disable, or renable users and see site statistics
- Delete characters if they deem them inappropriate

**Both Roles**
- View other user's profiles
- Edit and view their own profile
- View a character detail page with more details about a specific character
- Explore characters

## SYSTEM DESIGN
### ARCHITECTURE DIAGRAM (WIP)

### DATABASE SCHEMA
**Users**
- uid (from firebase)
- displayName
- username
- role
- bio
- favChars
- accountStatus
- pfp

**Characters**
- owner_uid
- name
- bio
- userIsCreator
- creator
- iconImg
- refImg
- vis
- exportable
- link
- tags

**Notifications**
- sender
- receiver
- read
- type
- notifBody

## API ENDPOINTS
**Users**
| Method | Endpoint              | Description                     |
|--------|-----------------------|---------------------------------|
| GET    | /users                | Get all users                   |
| GET    | /users/:uid           | Get a user from their uid       |
| GET    | /users/check-username | Returns username availability   |
| PATCH  | /users/:uid           | Patch a user based on their uid |
| POST   | /users                | Post a new user to the database |

**Characters**
| Method | Endpoint        | Description                          |
|--------|-----------------|--------------------------------------|
| GET    | /characters     | Get all characters                   |
| GET    | /characters/:id | Get a character from their id        |
| PATCH  | /characters/:id | Edit a character from their id       |
| POST   | /characters     | Post a new character to the database |
| DELETE | /character/:id  | Delete a character based on their id |

**Notifications (WIP)**

## FRONTEND ROUTES
**Public**
| Route   | Page    | Description                                                                                      |
|---------|---------|--------------------------------------------------------------------------------------------------|
| /       | Landing | Gives a brief description of Constellation and displays a sample selection of recent characters. |
| /login  | Login   | The login page, where users can login via email or Google                                        |
| /signup | Sign up | The sign up page, where users can sign up via email or Google                                    |
|/forgot-password | Forgot Password | Allow user to receieve an email to reset their password if they forgot it.       |
| /*      | Error   | 404 Not Found                                                                                    |
| /error  | Error   | Other errors handled dynamically                                                                 |

**Private**
| Route                | Page                   | Description                                             | Role Required For Access |
|----------------------|------------------------|---------------------------------------------------------|--------------------------|
| /explore             | Explore                | Search and filter characters                            | Any                      |
| /creator-dashboard   | Creator Dashboard      | Where a creator can view their existing characters      | Creator                  |
| /favorites-dashboard | Favorites              | Creator can view and manage their favorites             | Creator                  |
| /admin-dashboard     | Admin Dashboard        | Where the admin can delete, disable, or re-enable users | Admin                    |
| /characters/:_id     | Character Details Page | See more details about a specific character             | Any                      |
| /characters/create   | Character Creation     | Form to create a new character                          | Creator                  |
| /users/:uid          | User Profile           | See specific details about a user                       | Any                      |

**Disabled**
| Route     | Page     | Description                                           | Role Required For Access |
|-----------|----------|-------------------------------------------------------|--------------------------|
| /disabled | Disabled | Page user is rerouted to if their account is disabled | Any                      |


## NONFUNCTIONAL REQUIREMENTS
- Security
    - Joi was used to validate all `POST` and `PATCH` methods to ensure the request body matched the schema
    - Private routes are restricted to signed in users
    - `verifyFirebaseToken.js` middleware verifies the user's Firebase Token to ensure they are authenticated before performing any endpoint calls for endpoints that might have sensitive data (such as getting a user's profile data)
- Usability
    - Simple and intuitive UI design was maintained throughout the site, especially for displaying user profiles and character details
- Performance
    - Unnecessary database fetches were avoided by only fetching data once on the first load of a page
        - For example, the explore page only fetches character data once and the initial notification data is only fetched once and then live updates are handled by Pusher
- Reliability
    - Extra user info from the database is delayed by a few ms in order to ensure Firebase authentication happens properly. This prevents race conditions between Firebase and the MongoDB fetch

## UI
| Theme                   | Mode         |
|-------------------------|--------------|
| DaisyUI Modified "dark" | Prefers Dark |
| DaisyUI Nord            | Default      |

**Fonts**
- Headers
    - Sekuya [link](https://fonts.google.com/specimen/Sekuya?)
- Regular
    - Commissioner [link](https://fonts.google.com/specimen/Commissioner)

## KEY DESIGN DECISIONS
### STACK
**We chose to use the full MERN stack (MongoDB, Express, React, Node.js) with Firebase auth and Pusher for real time notifications.**
We chose to use Firebase as auth because...

#### TRADE OFFS AND CHALLENGES
**Live Updates**
- We opted **Pusher** over Server Sent Events (SSE) as a quicker development decision, since this project had a 3-week time constraint. Additionally, **Pusher** was chosen over WebSockets because live updates were only needed for notifications, which is a 1-way connection. We made this decision understanding that in the future, extra implementation may be needed in the future in the event this product expands. 

### Database Schema
(WIP)

## ASSETS
- [Site Icon](https://www.svgrepo.com/svg/156619/telescope)
