import React,{useState} from 'react'
import { Grid, TextField, FormControl, InputLabel, MenuItem, Select, makeStyles, Button } from '@material-ui/core';
import { SERVER_URL } from '../config';
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

function TeacherEdit() {
  const [subject, setsubject] = useState(localStorage.getItem("Subject"));
  const classes = useStyles();
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");

  const changePass = () => {
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
        if (result.status === 400) {
          Toast.fire({
            icon: 'error',
            title: 'Invalid Credentials'
          })
          setNewPass("")
          setCurrentPass("")
        }
      }) 
  }

  const changeDetails = () => {
    const word = 'Token ';
    const token = word.concat(`${localStorage.getItem('Token')}`);
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `${token}`);
    var formdata = new FormData();
    formdata.append("subject",subject);
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
          localStorage.setItem('Subject',subject);
          window.location.reload(false);
        }
        
      })
  }
  return (
    <div>
      <Grid container spacing={4} className={classes.title}>
        <Grid md={12} xs={12}>
          <h6>Personal Details</h6>
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item md={12} xs={12}>
          <TextField 
          id="subject" 
          fullWidth
          value={subject}
          label="Subject"
          onChange={e => setsubject(e.target.value)}
          />
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
      <Grid container spacing={ 4 } className={classes.title}>
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
            value={currentPass}
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
            value={newPass}
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

export default TeacherEdit
