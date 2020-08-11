import React,{useState} from 'react'
import { Grid, TextField, FormControl, InputLabel, MenuItem, Select, makeStyles, Button } from '@material-ui/core';
import { SERVER_URL } from '../config';
import { githubValid } from './Upload';
import Swal from 'sweetalert2';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  changeButton:{
    float:'right',
    marginTop:20,
    marginBottom:20
  },
  title: {
    marginTop: "20px",
    textAlign:'center'
  }
}));

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 4000,
  timerProgressBar: true,
})

function StudentEdit() {
  const [githubId, setgithubId] = useState(
    localStorage.getItem("githubId")?
    localStorage.getItem("githubId"):
    ""
  );
  const [division, setdivision] = useState(localStorage.getItem("division"));
  const [year, setYear] = useState(localStorage.getItem("year"));
  const [error, seterror] = useState(null);
  const classes = useStyles();
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");

  const changePass = (props) => {
    console.log(currentPass, newPass)
    const word = 'Token ';
    const token = word.concat(`${localStorage.getItem('Token')}`);
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `${token}`);
    var formdata = new FormData();
    formdata.append("current_password", currentPass);
    formdata.append("new_password", newPass);
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    }
    fetch(`${SERVER_URL}/change_password`, requestOptions)
      .then(result => {
        console.log(result)
        if (result.status === 204) {
          Toast.fire({
            icon: 'success',
            title: 'Password changed successfully'
          })
          setNewPass("")
          setCurrentPass("")
        }
        if(result.status === 400){
          Toast.fire({
            icon: 'error',
            title: 'Invalid Credentials'
          })
          setNewPass("")
          setCurrentPass("")
        }
      })  
  }

  const checkError = (url) => {
    if(githubValid.test(url)) {
      return false;
    }
    else {
      return true;
    }
  }
  const changeDetails = () => {
    if(!checkError(githubId)) {
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
          if(result.Message === 'Successfully updated User') {
            localStorage.setItem('year',year);
            localStorage.setItem('division',division);
            localStorage.setItem('githubId',githubId);
            window.location.reload(false);
          }
        })
    } else {
      seterror("Enter proper github id");
    }
    
    
  }
  return (
    <div>
      <Grid container spacing={4} className={classes.title} >
        <Grid md={12} xs={12}>
          <h6>Personal Details</h6>
        </Grid>
      </Grid>
      <Grid container spacing={4}>
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
          <FormControl className={classes.root}>
            <InputLabel id="demo-simple-div-label">Division</InputLabel>
            <Select
              labelId="demo-simple-div-label"
              id="demo-simple-div"
              value={division}
              fullWidth
              onChange={e => setdivision(e.target.value)}
            >
              <MenuItem value={"A"}>A</MenuItem>
              <MenuItem value={"B"}>B</MenuItem>
            </Select>
          </FormControl>
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
        <Grid item xs={12} md={12}>
          {error && (
            <div className="alert alert-danger mt-3 mb-3" role="alert">
              {error} !
            </div>
          )}
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
      <Grid container spacing={4} className={classes.title} >
        <Grid md={12} xs={12}>
          <h6>Change Password</h6>
        </Grid>
      </Grid>
      <Grid container spacing={ 4 }>
        <Grid item md={ 12 } xs={ 12 }>
          <TextField
            id="currentPass"
            fullWidth
            type="password"
            value={ currentPass }
            label="Current Password"
            onChange={ e => setCurrentPass(e.target.value) }
          />
        </Grid>
      </Grid>
      <Grid container spacing={ 4 }>
        <Grid item md={ 12 } xs={ 12 }>
          <TextField
            id="newPass"
            fullWidth
            type="password"
            value={ newPass }
            label="New Password"
            onChange={ e => setNewPass(e.target.value) }
          />
        </Grid>
      </Grid>
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={ changePass }
          className={ classes.changeButton }
        >
          Change
        </Button>
      </div>
    </div>
  )
}

export default StudentEdit
