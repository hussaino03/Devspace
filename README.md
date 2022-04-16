<div id="top"></div>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability
*** Reference links are enclosed in brackets [ ] instead of parentheses ( )
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/hussaino03/Devspace">
    <img src="https://www.vhv.rs/dpng/d/53-534419_college-student-vector-png-transparent-png.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Virtual Classroom!</h3>

  <p align="center">
    A Virtual Classroom Designed To Optimize Learning Approaches!
    <br />
    <a href="https://github.com/hussaino03/Devspace"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/hussaino03/Devspace">View Demo</a>
    ·
    <a href="https://github.com/hussaino03/Devspace/issues">Report Bug</a>
    ·
    <a href="https://github.com/hussaino03/Devspace/issues">Request Feature</a>
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
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
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

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

* React.js
* Next.js
* HTML/CSS (Bootstrap)
* JavaScript
* Twilio 


<p align="right">(<a href="#top">back to top</a>)</p>


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

### `npm start`
### `npm run server:start`
### `npm run cient:start`

Runs the app in the development mode.\
Open [http://localhost:1234](http://localhost:1234) to view it in your browser.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

- [X] Integrate camera/mic option
- [X] Integrate a whiteboard
- [X] Integrate emojis
- [X] Integrate disable/enable option for both the video and microphone 



<p align="right">(<a href="#top">back to top</a>)</p>





<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>




<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

Use this space to list resources you find helpful and would like to give credit to. I've included a few of my favorites to kick things off!

* [GitHub README.md template](https://github.com/othneildrew/Best-README-Template)


<p align="right">(<a href="#top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/hussaino03/Devspace?color=%23&style=for-the-badge
[contributors-url]: https://github.com/hussaino03/Devspace/graphs/contributors
[issues-shield]: https://img.shields.io/github/issues/hussaino03/Devspace?style=for-the-badge
[issues-url]: https://github.com/hussaino03/Devspace/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/hussaino03/Devspace/blob/main/LICENSE.txt
[product-screenshot]: loginpage.png
