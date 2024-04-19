<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/kovarjan/react-morse-code/blob/master/README.md">
    <img src="https://morsecode-encoder.earc.eu/morse-icon.svg" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">React Morse code encoder</h3>

  <p align="center">
    A simple Morse code encoder with audio output
    <br />
    <a href="https://morsecode-encoder.earc.eu/"><strong>View Demo »</strong></a>
    <br />
    <br />
    <a href="https://github.com/kovarjan/react-morse-code">Fork Project</a>
    ·
    <a href="https://github.com/kovarjan/react-morse-code/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
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
    <li><a href="#documentation">Documentation</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>


<!-- ABOUT THE PROJECT -->
## About The Project

[![MorseCode encoder preview][product-screenshot-preview]](https://morsecode-encoder.earc.eu/docs/img/AppWithExample.png)

### Built With
[![React][React.js]][React-url]
[![Vite][Vite.dev]][Vite-url]

This is a simple Morse code encoder with audio output. It is a single page application built with React and Vite. The project showcases the use of joining audio tracts in js / React and the use of the Web Audio API. With export to vaw file all in browser.

<!-- GETTING STARTED -->
## Getting Started

To run the app locally, follow these simple steps.

### Prerequisites

You need to have Node.js and npm installed. You can download it [here](https://nodejs.org/).
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/kovarjan/react-morse-code
    ```
2. Install NPM packages
    ```sh
    npm install
    ```
3. Start the development server
    ```sh
    npm run dev
    ```
4. Open the browser and navigate to url from command output

<!-- USAGE EXAMPLES -->
## Usage

App can be used to encode text to Morse code and play it back as audio. It can also export the audio to a .wav file. It's a simple tech demo of the Web Audio API and React.

[![MorseCode encoder preview][product-screenshot]](https://morsecode-encoder.earc.eu/docs/img/AppWithExample.png)

<!-- DOCUMENTATION -->
## Documentation

The documentation of function of [react-morse-code](https://github.com/kovarjan/react-morse-code)

### App.jsx
----
#### handleEncode()
Function is run by useEffect hook when the text changes. It encodes the text to Morse code and sets the state of the encoded text. Using function morseEncoder(input) from utils/morseEncoder.js.

#### handlePlay()
Function is run when the play button is clicked. It plays the Morse code as audio. Using function morseEncoder(input), composeTracks(morseCode) and joinAudioTracks(audioTracks).
It creates morse code version of the text, then creates array of audio tracks for each character in the morse code in order. Then it joins the audio tracks into one audio track. It then plays the audio track.

#### composeTracks(morseCode)
Function takes the morse code and creates an array of audio tracks for each character in the morse code. It then loops through the morse code and creates an audio track for each character. It then returns the array of audio tracks (filenames).

#### joinAudioTracks(audioTracks)
Function takes an array of audio tracks and joins them into one audio track. It uses the Web Audio API to create a new audio context and a new audio track. It then loops through the audio tracks and adds them to the new audio track. Last it plays the complete audio track.

#### handleExport()
Function is run when the export button is clicked. It exports the Morse code as audio to a .wav file. Using function audio blob create by joinAudioTracks(audioTracks) function.

#### \<AudioVisualizer\>
Component that visualizes the audio track from audio blob. It uses the Web Audio API to create an audio context and an analyser node. It then draws the audio waveform. Played position is updated by setInterval in joinAudioTracks(audioTracks) function every 10ms.

### utils/morseEncoder.js
----
#### morseEncoder(input)
Function takes a string input and encodes it to Morse code. It uses a switch statement to encode each character to Morse code. It then returns the Morse code as a string.

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->
## Contact

Jan Kovar - [LinkedIn](https://www.linkedin.com/in/jan-kov%C3%A1%C5%99-133b7217a/) - [GitHub](https://github.com/kovarjan)


<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/kovarjan/react-morse-code.svg?style=for-the-badge
[contributors-url]: https://github.com/kovarjan/react-morse-code/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/kovarjan/react-morse-code.svg?style=for-the-badge
[forks-url]: https://github.com/kovarjan/react-morse-code/network/members
[stars-shield]: https://img.shields.io/github/stars/kovarjan/react-morse-code.svg?style=for-the-badge
[stars-url]: https://github.com/kovarjan/react-morse-code/stargazers
[issues-shield]: https://img.shields.io/github/issues/kovarjan/react-morse-code.svg?style=for-the-badge
[issues-url]: https://github.com/kovarjan/react-morse-code/issues
[license-shield]: https://img.shields.io/github/license/kovarjan/react-morse-code.svg?style=for-the-badge
[license-url]: https://github.com/kovarjan/react-morse-code/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/jan-kov%C3%A1%C5%99-133b7217a/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vite.dev]: https://img.shields.io/badge/Vite-20232A?style=for-the-badge&logo=vite&logoColor=61DAFB
[Vite-url]: https://vitejs.dev/
[product-screenshot]: https://morsecode-encoder.earc.eu/docs/img/AppPreview.png
[product-screenshot-preview]: https://morsecode-encoder.earc.eu/docs/img/AppWithExample.png
