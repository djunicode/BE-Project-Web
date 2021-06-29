import { Button, Grid, TextField } from '@material-ui/core';
import React, { useState } from 'react'
import { Toast } from '../commonFuncs';
import { SERVER_URL } from '../config';

const ChangePassword = (props) => {
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const classes = props.classes;

  const changePass = () => {
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
  return (
    <React.Fragment>
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
    </React.Fragment>
  )
}

export default ChangePassword
