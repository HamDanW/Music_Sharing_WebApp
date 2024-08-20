import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import Button from "@material-ui/core/Button";
import { ButtonGroup } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import { RoomWrapper } from "./Room";

const HomePage = () => {
  const [roomCode, setRoomCode] = useState("");

  useEffect(() => {
    const fetchRoomCode = async () => {
      const response = await fetch("/api/user-in-room");
      const data = await response.json();
      setRoomCode(data.code);
    };

    fetchRoomCode();
  }, []);

  const renderHomePage = () => {
    <Grid container spacing={3}>
      <Grid item xs={12} align="center">
        <Typography variant="h3" compact="h3">
          House Party
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <ButtonGroup disableElevation variant="contained" color="primary">
          <Button color="primary" to="/join" component={Link}>
            Join a Room
          </Button>
          <Button color="secondary" to="/create" component={Link}>
            Create a Room
          </Button>
        </ButtonGroup>
      </Grid>
    </Grid>;
  };

  return (
    <Router>
      <Routes>
        <Route
          exact
          path="/"
          element={
            roomCode ? (
              <Navigate to={`/room/${roomCode}`} />
            ) : (
              renderHomePage()
            )
          }
        />
        <Route path="/join" element={<RoomJoinPage />} />
        <Route path="/create" element={<CreateRoomPage />} />
        <Route path="/room/:roomCode" element={<RoomWrapper />} />
      </Routes>
    </Router>
  );
};

export default HomePage;
