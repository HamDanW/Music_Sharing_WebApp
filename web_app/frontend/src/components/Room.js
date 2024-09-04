import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useParams and useNavigate
import { Grid, Button, Typography } from "@material-ui/core";
import CreateRoomPage from "./CreateRoomPage"
import MusicPlayer from "./MusicPlayer";

const Room = ({ leaveRoomCallback }) => {
  const { roomCode } = useParams(); // Access the room code from the URL parameters
  const navigate = useNavigate(); // Use useNavigate instead of history.push
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [song, setSong] = useState({})

  const intervalRef = useRef(null);

  const getRoomDetails = () => {
    fetch(`/api/get-room?code=${roomCode}`)
      .then((response) => {
        if (!response.ok) {
          leaveRoomCallback();
          navigate("/");
        }
        return response.json();
      })
      .then((data) => {
        setVotesToSkip(data.votes_to_skip);
        setGuestCanPause(data.guest_can_pause);
        setIsHost(data.is_host);
        if (data.is_host) {
          authenticateSpotify();
        }
      });
  };

  useEffect(() => {
    getRoomDetails();
  }, [roomCode, navigate, leaveRoomCallback]);

  const authenticateSpotify = () => {
    fetch('/spotify/is-authenticated')
      .then(response => response.json())
      .then(data => {
        setSpotifyAuthenticated(data.status);
        if (!data.status) {
          fetch('/spotify/get-auth-url')
            .then(response => response.json())
            .then(data => {
              window.location.replace(data.url);
            });
        }
      });
  };

  useEffect(() => {
    // Set interval to fetch current song every 1000 ms (1 second)
    intervalRef.current = setInterval(getCurrentSong, 1000);

    // Clean up function to clear the interval
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  const getCurrentSong = () => {
    fetch('/spotify/current-song')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text(); // Get the response as text first
    })
    .then((text) => {
      if (text.trim() === '') {
        return {}; // Handle empty response
      }
      return JSON.parse(text); // Parse text as JSON
    })
    .then((data) => {
      setSong(data);
      console.log(data);
    })
    .catch((error) => {
      console.error('There was a problem with the fetch operation:', error);
    });
  }

  const leaveButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-room", requestOptions).then(() => {
      leaveRoomCallback();
      navigate("/"); // Use navigate instead of history.push
    });
  };

  const renderSettingsButton = () => (
    <Grid item xs={12} align="center">
      <Button variant="contained" color="primary" onClick={() => {setShowSettings(true);}}>
        Settings
      </Button>
    </Grid>
  );

  const renderSettings = ()=>(
    <Grid container spacing={ 1 }>
      <Grid item xs={12} align="center">
        <CreateRoomPage 
          update={true} 
          votesToSkip={votesToSkip} 
          guestCanPause={guestCanPause}
          roomCode={roomCode}
          updateCallback={getRoomDetails}
        />
      </Grid>
      <Grid item xs={12} align="center">
      <Button
          variant="contained"
          color="secondary"
          onClick={()=> setShowSettings(false)}
        >
          Close
        </Button>
      </Grid>
    </Grid>
  )

  if (showSettings){
    return renderSettings();
  }
  return (
    <Grid container spacing={1} justifyContent="center">
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Code: {roomCode}
        </Typography>
      </Grid>
      <MusicPlayer {...song}/>
      {isHost ? renderSettingsButton() : null}
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="secondary"
          onClick={leaveButtonPressed}
        >
          Leave Room
        </Button>
      </Grid>
    </Grid>
  );
};

export default Room;
