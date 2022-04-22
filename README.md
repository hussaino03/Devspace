
<div id="top"></div>

[![Contributors][contributors-shield]][contributors-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br>
<div align="center">
  <a href="https://github.com/hussaino03/Devspace">
    <img src="https://www.vhv.rs/dpng/d/53-534419_college-student-vector-png-transparent-png.png" alt="Logo" width="80" height="80">
  </a>
  <h1 align="center">Virtual Classroom!</h1>

  <p align="center">
    A Virtual Classroom Designed To Optimize Learning Approaches!
    <br>
    <br>
    <a href="https://github.com/hussaino03/Devspace"><strong>Explore the docs »</strong></a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <br>
  <br>
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
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
**HeroHacks II Winner (Most Creative Use Of Twilio)**
![image](https://user-images.githubusercontent.com/67332652/163739019-b3284e49-dd45-4082-bd35-c1486a9a101f.png)

## Domain Name

Our project's domain name is "studywith.tech"

## Inspiration

The inspiration for our project came from the fact that due to the implementation of remote learning, teachers all over the world had to interact with and teach their students virtually. Today, two major platforms namely Google Meet and Zoom dominate the virtual learning industry. However both platforms have shortcomings. Google Meet for example lacks the functionality of a built in collaborative whiteboard or annotation while a teacher is presenting. Zoom on the other hand has these functionalities but lacks the ease of access of google meet via a web browser. Our app aims to strike a combination of the features of Zoom and ease of access of Google Meet.

## What it does

Virtual-Classroom is a web conferencing app that allows teachers to connect with their students and share their learning materials via either screen-sharing or using a collaborative whiteboard. The use of a collaborative whiteboard makes it easier for teachers to supplement their learning material and for students to better explain their difficulties and interact with teachers.

## How We built it

Virtual-Classroom is a React app built using Twilio's programmable video and conversations SDK. The collaborative whiteboard functionality is implemented using the Data Track API.

## Most Creative use of Twilio

We use Twilio's Video SDK for JavaScript to enable users to stream data from their mic and camera via "tracks", these tracks can then be subscribed to by other users thus enabling sharing of video and audio. For low latency sharing of data between users required in the chat and reactions menu, we used Twilio's DataTrack API which is used to share reactions, chat messages as well as whiteboard pointer data. This allows for the users to react to other users, send them messages as well as work on a collaborative whiteboard.

### Features:
* Interactive environment to learn (video calling and microphone option)
* Whitebord (learning tool)
* Reactions (emojis)
* Screenshare ability 
* Chatbox 
* Multiple Individuals can join at once 

### Built With

* React.js
* HTML
* CSS
* JavaScript
* Twilio 
* Firebase

<!-- GETTING STARTED -->
# Getting Started

<!-- PREREQUISITES -->
## Prerequisites
* Install Desktop development with c++ workload on Visual studio
* Git CLI

## Installation
* `git clone https://github.com/hussaino03/Devspace`
* In project directory run `npm install`
* Run `npm start`

## Available Scripts

In the project directory, you can run:

`npm install`

This will install all the required modules

`npm start`

This will start the server

Runs the app in the development mode.

Open [http://localhost:1234](http://localhost:1234) to view it in your browser.

<!-- ROADMAP -->
## Roadmap

- [✅] Integrate camera/mic option
- [✅] Integrate a whiteboard
- [✅] Integrate emojis
- [✅] Integrate disable/enable option for both the video and microphone 

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [GitHub README.md template](https://github.com/othneildrew/Best-README-Template)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/hussaino03/Devspace?color=%23&style=for-the-badge
[contributors-url]: https://github.com/hussaino03/Devspace/graphs/contributors
[issues-shield]: https://img.shields.io/github/issues/hussaino03/Devspace?style=for-the-badge
[issues-url]: https://github.com/hussaino03/Devspace/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/hussaino03/Devspace/blob/main/LICENSE.txt
[product-screenshot]: loginpage.png
