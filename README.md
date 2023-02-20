<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/afrmounir/online_shop">
    <!-- <img src="public/images/logo.png" alt="Logo" width="80" height="80"> -->
  </a>

  <h3 align="center">REST API for a social network</h3>

  <p align="center">
    Social network app where users can share posts in a wall.
    <br />
    <br />
    <a href="https://github.com/afrmounir/social_network_REST_API">
    <br />
    <strong>Explore the docs »</strong></a>
    <br />
    <br />
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About the project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

Development of an REST API from scratch.

Features:

- Routing / Endpoints
- Using Express.js
- Database communication with NoSQL (MongoDB) and Mongoose
- File Up and Download
- Update posts in realtime with websocket (Socket.io)
- Using the Model-View-Controller (MVC) Pattern
- Compression
- User Authentication and Authorization with JSON Web Tokens (JWTs)
- Validating User Input (on the Server)
- Data Pagination (on the Server)
- Test of principals features with Chai, Mocha and Sinon

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- Express
- Mongodb
- Mongoose
- Socket.io
- Bcryptjs
- Jsonwebtoken
- Multer
- Express-validator
- Dotenv
- Chai
- Mocha
- Sinon

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

- Node 16.16.0
- A MongoDB database

### Installation

1. Clone the repo
   ```sh
   git clone git@github.com:afrmounir/social_network_REST_API.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create a .env file at the root and set the followings environment variables:
   ```
   MONGODB_KEY=""
   SESSION_SECRET="longstringvalue"
   ```
4. Run the project
   ```sh
   npm start
   ```
5. Follow the instruction from https://github.com/afrmounir/social_network_React to launch the front end 

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ROADMAP -->

## Roadmap

- [x] Planning the API
- [x] App structure (navigation, adding, storing, editing and deleting posts)
- [x] Implement routing / endpoints
- [x] Working with MongoDb and Mongoose
- [x] Handling authentication and authorization with JSON Web Tokens (JWTs)
- [x] Adding server side validation
- [x] Adding error Handling
- [x] Handling file upload and download
- [x] Adding Pagination
- [x] Tests
- [ ] Deploying

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[product-screenshot]: public/images/capture.gif

