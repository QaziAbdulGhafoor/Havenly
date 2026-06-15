# Havenly

A full-stack accommodation listing platform inspired by Airbnb, built from the ground up using Node.js, Express.js, MongoDB, and EJS. Havenly allows users to discover, list, and review accommodations with an interactive map, secure authentication, and a complete ownership system.

**Live Application:** https://havenly-production-eac8.up.railway.app

---

## Overview

Havenly is a production-deployed web application that demonstrates a complete full-stack architecture. The platform supports two types of users — hosts who create and manage listings, and guests who explore, review, and save their favourite properties. Every listing includes geolocation data rendered on an interactive map, allowing users to visualise property locations before booking.

---

## Features

- User registration, login, and logout with session persistence
- Authentication via Passport.js with local strategy
- Create, edit, and delete listings with image upload support
- Ownership validation — only the listing owner can modify or delete it
- Add and remove reviews with a star rating system
- Save and unsave listings to a personal favourites list
- Live map integration displaying the exact location of each listing
- Category-based filtering — House, Apartments, River Side, Mountains, Luxury
- Search functionality across listing titles and locations
- Flash messages for user feedback on all major actions
- Responsive design across desktop and mobile

---

## Technology Stack

**Backend**

- Node.js
- Express.js
- MongoDB with Mongoose ODM
- Passport.js — authentication middleware
- EJS — server-side templating engine
- Express Session — session management
- Connect Flash — flash messaging
- Multer — file upload handling

**Frontend**

- HTML5 and CSS3
- JavaScript ES6+
- Bootstrap 5
- Google Fonts — Playfair Display, Inter

**Database**

- MongoDB Atlas — cloud-hosted database

**Tools**

- Git and GitHub — version control
- Postman — API testing and development
- VS Code — development environment
- Railway — production deployment

---

## Project Structure

```
havenly/
├── controllers/
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
├── models/
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── routes/
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── views/
│   ├── layouts/
│   ├── listings/
│   ├── users/
│   └── partials/
├── public/
│   ├── css/
│   └── js/
├── middleware.js
├── app.js
└── .env
```

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- MongoDB Atlas account or local MongoDB installation
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/QaziAbdulGhafoor/Havenly.git
cd Havenly
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the root directory:

```env
MONGO_URL=your_mongodb_connection_string
SECRET=your_session_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

Start the development server:

```bash
node app.js
```

The application will be available at `http://localhost:3000`

---

## Key Implementation Details

### Authentication and Authorization

User authentication is handled through Passport.js using the LocalStrategy. Sessions are managed server-side with express-session. Protected routes use a custom middleware function that verifies the user's authentication status before granting access to sensitive operations such as creating listings or posting reviews.

### Ownership Control

Each listing stores a reference to the owner's user ID at the time of creation. Before allowing any edit or delete operation, a middleware function validates that the currently authenticated user matches the listing's owner. Unauthorized access attempts are redirected with an appropriate flash message.

### Geolocation and Mapping

Listing locations are geocoded on creation using the Nominatim API from OpenStreetMap and stored as GeoJSON coordinates in MongoDB. The detail page renders an interactive map using Mapbox GL JS, placing a pin at the listing's exact coordinates.

### MVC Architecture

The application follows the Model-View-Controller pattern. Business logic is separated into controller files, database schemas are defined in model files, and Express routers handle URL routing independently from the application logic.

---

## Deployment

The application is deployed on Railway with a live MongoDB Atlas database. Environment variables are configured through the Railway dashboard. The application is accessible globally at the URL listed above.

---

## Author

Qazi Abdul Ghafoor
Full Stack MERN Developer
Rahim Yar Khan, Pakistan

LinkedIn: https://www.linkedin.com/in/qazi-abdul-ghafoor-b023b2386
GitHub: https://github.com/QaziAbdulGhafoor

---

## License

This project is open source and available under the MIT License.
