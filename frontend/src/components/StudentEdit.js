import React,{useState} from 'react'
import { Grid, TextField, FormControl, InputLabel, MenuItem, Select, makeStyles, Button } from '@material-ui/core';
import { SERVER_URL } from '../config';

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

function StudentEdit() {
  const [githubId, setgithubId] = useState(
    localStorage.getItem("githubId")?
    localStorage.getItem("githubId"):
    ""
  );
  const [division, setdivision] = useState(localStorage.getItem("division"));
  const [year, setYear] = useState(localStorage.getItem("year"));
  const classes = useStyles();

  React.useEffect(() => {

  })
  const changeDetails = (props) => {
    const word = 'Token ';
    const token = word.concat(`${localStorage.getItem('Token')}`);
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `${token}`);
    var formdata = new FormData();
    formdata.append("github_id",githubId);
    formdata.append("year",year);
    formdata.append("division",division);
    
    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: formdata,
      redirect:'follow'
    }
    fetch(`${SERVER_URL}/update_user`,requestOptions)
      .then(response => response.json())
      .then(result => {
        //
      })
  }
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item md={12} xs={12}>
          <TextField 
          id="githubId" 
          fullWidth
          value={githubId}
          label="Github Id"
          onChange={e => setgithubId(e.target.value)}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField 
            id="division" 
            label="Division" 
            fullWidth
            value={division}
            onChange={e => setdivision(e.target.value)}
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

export default StudentEdit
