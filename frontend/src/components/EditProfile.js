import React,{useState} from 'react'
import { Grid, TextField, FormControl, InputLabel, MenuItem, Select, makeStyles, Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  changeButton:{
    float:'right',
    marginTop:20,
    marginBottom:20
  }
}));

function EditProfile() {
  const [firstName, setfirstName] = useState("Rohan");
  const [lastName, setLastName] = useState("Mistry");
  const [year, setYear] = useState("TE");
  const [email, setEmail] = useState("test@email.com");
  const classes = useStyles();

  const changeDetails = () => {

  }
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <TextField 
          id="userFirstName" 
          label="First Name" 
          fullWidth
          value={firstName}
          onChange={e => setfirstName(e.target.value)}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField 
            id="userLastName" 
            label="Last Name" 
            fullWidth
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            />
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField 
            id="userEmail" 
            label="Email" 
            fullWidth
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <FormControl className={classes.root}>
            <InputLabel id="demo-simple-year-label">Year</InputLabel>
            <Select
              labelId="demo-simple-year-label"
              id="demo-simple-year"
              value={year}
              fullWidth
              onChange={e => setYear(e.target.value)}
            >
              <MenuItem value={"FE"}>FE</MenuItem>
              <MenuItem value={"SE"}>SE</MenuItem>
              <MenuItem value={"TE"}>TE</MenuItem>
              <MenuItem value={"BE"}>BE</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <div>
        <Button 
          variant="contained" 
          color="primary"
          onClick={changeDetails}
          className={classes.changeButton}
        >
          Change
        </Button>
      </div>
    </div>
  )
}

export default EditProfile
