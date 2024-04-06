import { useState, useEffect } from "react";
import { AudioVisualizer } from 'react-audio-visualize';
import audiobufferToBlob from 'audiobuffer-to-blob';
import "./App.css";
import WaveForm from "./WaveForm";

import morseEncoder from './utils/morseEncoder';

import dot from "./assets/dot.mp3";
import dash from "./assets/dash.mp3";
import pause from "./assets/pause.mp3";
import longPause from "./assets/long_pause.mp3";

function App() {
    const [count, setCount] = useState(0);
    const [blob, setBlob] = useState();
    const [playing, setPlaying] = useState(false);
    const [timePlayed, setTimePlayed] = useState(0);
    const [analyzerData, setAnalyzerData] = useState(null);
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");

    useEffect(() => {
        if(input && input.length > 0) {
            handleEncode();
        }
    }, [input])


    async function joinAudioTracks(audioTracks) {
        let context = new (window.AudioContext || window.webkitAudioContext)();
        let buffers = [];
      
        // Load each audio track and decode it into audio buffer
        for (let track of audioTracks) {
          let buffer = await fetch(track)
            .then(response => response.arrayBuffer())
            .then(buffer => context.decodeAudioData(buffer));
          buffers.push(buffer);
        }
      
        // Calculate total duration and length of the concatenated buffer
        let totalDuration = buffers.reduce((acc, buffer) => acc + buffer.duration, 0);
        let totalLength = Math.ceil(totalDuration * context.sampleRate);
      
        // Create concatenated buffer with dynamically allocated memory
        let concatenatedBuffer = context.createBuffer(1, totalLength, context.sampleRate);
        let offset = 0;
      
        // Copy data from each buffer into the concatenated buffer
        buffers.forEach(buffer => {
          let channelData = buffer.getChannelData(0);
          concatenatedBuffer.getChannelData(0).set(channelData, offset);
          offset += channelData.length;
        });

        const blob = audiobufferToBlob(concatenatedBuffer);
        console.log("blob", blob);

        setBlob(blob);

        // Play the concatenated audio
        let source = context.createBufferSource();
        source.buffer = concatenatedBuffer;
        source.connect(context.destination);

        const progressInterval = setInterval(() => {
            setTimePlayed(source.context.currentTime);
        }, 10);

        setPlaying(true);

        // get time played
        source.onended = () => {
            setTimePlayed(source.context.currentTime);
            clearInterval(progressInterval);
            setPlaying(false);
        };

        source.start();
    }

      
      

    // Function to join audio tracks
    const joinAudioTracks_old = (audioTracks) => {
        let context = new (window.AudioContext || window.webkitAudioContext)();
        let buffers = [];

        // Load each audio track and decode it into audio buffer
        let promises = audioTracks.map((track) => {
            return fetch(track)
                .then((response) => response.arrayBuffer())
                .then((buffer) => context.decodeAudioData(buffer))
                .then((decodedBuffer) => {
                    buffers.push(decodedBuffer);
                });
        });

        // When all tracks are loaded and decoded
        Promise.all(promises).then(() => {
            let totalDuration = buffers.reduce(
                (acc, buffer) => acc + buffer.duration,
                0
            );

            console.log("totalDuration", totalDuration);

            // Concatenate audio buffers
            let concatenatedBuffer = context.createBuffer(
                1,
                context.sampleRate * totalDuration,
                context.sampleRate
            );

            console.log("concatenatedBuffer", concatenatedBuffer);
            let offset = 0;
            // ERROR: Uncaught (in promise) RangeError: offset is out of bounds at Float32Array.set (<anonymous>)
            buffers.forEach((buffer) => {
                console.log("buffer", buffer);
                console.log("offset", offset);
                concatenatedBuffer
                    .getChannelData(0)
                    .set(buffer.getChannelData(0), offset);
                offset += buffer.length;
            });

            console.log("buffers", buffers);

            const blob = audiobufferToBlob(concatenatedBuffer);
            console.log("blob", blob);

            setBlob(blob);


            // analyze the audio
            const analyzer = context.createAnalyser();
            analyzer.fftSize = 2048;
        
            const bufferLength = analyzer.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
          
            // Play the concatenated audio
            let source = context.createBufferSource();
            source.buffer = concatenatedBuffer;
            source.connect(context.destination);

            source.connect(analyzer);
            source.onended = () => {
                source.disconnect();
            };

            const progressInterval = setInterval(() => {
                setTimePlayed(source.context.currentTime);
            }, 10);

            setPlaying(true);

            // get time played
            source.onended = () => {
                setTimePlayed(source.context.currentTime);
                clearInterval(progressInterval);
                setPlaying(false);
            };

            source.start();
            
            setAnalyzerData({ analyzer, bufferLength, dataArray });
            
            console.log("source", source);
        });
    }

    const composeTracks = (morseCode) => {
        const tracks = [];
        const morseArray = morseCode.split(" ");
        morseArray.forEach((morse) => {
            const track = morse.split("").map((char) => {
                if (char === ".") {
                    return dot;
                } else if (char === "-") {
                    return dash;
                } else if (char === "/") {
                    return longPause;
                } else {
                    return pause;
                }
            });
            tracks.push(...track);
        });

        return tracks;
    };

    const handlePlay = () => {
        const out = morseEncoder(input);
        setOutput(out);

        console.log("out", out);

        const tracks = composeTracks(out);
        console.log("tracks", tracks);

        let audioTracks = tracks; // Paths to your audio tracks
        joinAudioTracks(audioTracks);
    };

    const handleEncode = () => {
        const out = morseEncoder(input);
        setOutput(out);

        console.log("out", out);
    }
    
    return (
        <>
            <h1>Morse code encoder</h1>
            <p className="note">
                Enter a text to encode into Morse code
            </p>

            <div className="card">
                <input
                    type="text"
                    className="inputField"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Your secret message here..."
                />

                <button onClick={handlePlay}>
                    Play audio
                </button>
            </div>

            <h2 className="output">{output}</h2>

            <br/>
            <br/>
            {/* <AudioVisualizer
                 ref={visualizerRef}
                 blob={blob}
                 width={500}
                 height={75}
                 barWidth={1}
                 gap={0}
                 barColor={'#f76565'}
             /> */}

            {blob && (
                
                <AudioVisualizer
                    blob={blob}
                    width={800}
                    height={80}
                    barWidth={3}
                    gap={1}
                    barColor={'#f76565'}
                    barPlayedColor={'#00BAFF'}
                    currentTime={timePlayed}
                />
            )}

            <br/>
            <br/>

            {/* {analyzerData && <WaveForm analyzerData={analyzerData} />} */}
            

        </>
    );
}

export default App;
