import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { useNavigate } from 'react-router-dom';
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { Link } from "react-router-dom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const RoomJoinPage = () => {
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleTextFieldChange = (value) => {
    setRoomCode(value);
  };

  const handleEnterRoom = () => {
    // Add your logic here for what happens when "Enter Room" is clicked.
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({
        code: roomCode
      }),
    };

    fetch('/api/join-room', requestOptions).then((response)=> {
      if (response.ok){
        navigate(`/room/${roomCode}`);
      }else{
        setError("Room not found")
      }
    }).catch((error)=>{
      console.log(error);
    });
  };

  return (
    <Grid container spacing={1} align="center">
      <Grid item xs={12}>
        <Typography variant="h4" component="h4">
          Join a Room
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          error={Boolean(error)}
          label="Code"
          placeholder="Enter a Room Code"
          value={roomCode}
          onChange={(e) => handleTextFieldChange(e.target.value)}
          helperText={error}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleEnterRoom}>
          Enter Room
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="secondary" to="/" component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>
  );
};

export default RoomJoinPage;