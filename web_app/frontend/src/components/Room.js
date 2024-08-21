import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useParams and useNavigate
import { Grid, Button, Typography } from "@material-ui/core";

const Room = ({ leaveRoomCallback }) => {
  const { roomCode } = useParams(); // Access the room code from the URL parameters
  const navigate = useNavigate(); // Use useNavigate instead of history.push
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    const getRoomDetails = () => {
      fetch("/api/get-room?code=" + roomCode)
        .then((response) => {
          if (!response.ok) {
            leaveRoomCallback();
            navigate("/"); // Use navigate instead of history.push
          }
          return response.json();
        })
        .then((data) => {
          setVotesToSkip(data.votes_to_skip);
          setGuestCanPause(data.guest_can_pause);
          setIsHost(data.is_host);
        });
    };

    getRoomDetails();
  }, [roomCode, navigate, leaveRoomCallback]);

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

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Code: {roomCode}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Votes: {votesToSkip}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Guest Can Pause: {guestCanPause.toString()}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Host: {isHost.toString()}
        </Typography>
      </Grid>
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
