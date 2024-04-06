import { useState, useEffect } from "react";
import { AudioVisualizer } from 'react-audio-visualize';
import audiobufferToBlob from 'audiobuffer-to-blob';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DownloadIcon from '@mui/icons-material/Download';
import morseEncoder from './utils/morseEncoder';
import dot from "./assets/dot.mp3";
import dash from "./assets/dash.mp3";
import pause from "./assets/pause.mp3";
import longPause from "./assets/long_pause.mp3";
import "./App.css";

function App() {
    const [blob, setBlob] = useState();
    const [timePlayed, setTimePlayed] = useState(0);
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if(input && input.length > 0) {
            handleEncode();
        }
    }, [input])

    /**
     * joinAudioTracks - Joins multiple audio tracks into a single audio track.
     * @param {array} audioTracks 
     */
    async function joinAudioTracks(audioTracks) {
        let context = new (window.AudioContext || window.webkitAudioContext)();
        let buffers = [];
        setIsPlaying(true);

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

        // Convert the concatenated buffer to a blob to visualize waveform
        const blob = audiobufferToBlob(concatenatedBuffer);
        setBlob(blob);

        // Play the concatenated audio
        let source = context.createBufferSource();
        source.buffer = concatenatedBuffer;
        source.connect(context.destination);

        const progressInterval = setInterval(() => {
            setTimePlayed(source.context.currentTime);
        }, 10);

        // get time played
        source.onended = () => {
            setTimePlayed(source.context.currentTime);
            clearInterval(progressInterval);
            setIsPlaying(false);
        };

        source.start();
    }

    /**
     * composeTracks - Compose audio tracks for each Morse code character.
     * @param {string} morseCode
     * @returns {array}
     */
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

    /**
     * handlePlay - Handle play button click event.
     */
    const handlePlay = () => {
        if (!input || input.length === 0 || isPlaying) {
            return;
        }

        const out = morseEncoder(input);
        setOutput(out);

        let audioTracks = composeTracks(out);
        joinAudioTracks(audioTracks);
    };

    /**
     * handleEncode - Handle encode button click event.
     */
    const handleEncode = () => {
        setOutput(morseEncoder(input));
    }

    /**
     * handleExportTrack - Handle export audio track button click event.
     * Export the audio track as a WAV file.
     */
    const handleExportTrack = () => {
        if (!blob) {
            return;
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'morse-code.wav';
        a.click();
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
                    <PlayArrowIcon fontSize={"small"} />
                    Play audio
                </button>
                <button onClick={handleExportTrack}>
                    <DownloadIcon fontSize={"small"} />
                    Export audio
                </button>
            </div>

            <h2 className="output">{output}</h2>

            <div className="audioVisualizer">
                {blob && (
                    <AudioVisualizer
                        blob={blob}
                        width={window.innerWidth - 80}
                        height={80}
                        barWidth={3}
                        gap={1}
                        barColor={'#78e08f'}
                        barPlayedColor={'#38ada9'}
                        currentTime={timePlayed}
                    />
                )}
            </div>
        </>
    );
}

export default App;
