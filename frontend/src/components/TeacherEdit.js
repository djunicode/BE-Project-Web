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

function TeacherEdit() {
  const [subject, setsubject] = useState(localStorage.getItem("Subject"));
  const classes = useStyles();

  const changeDetails = (props) => {
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
      <Grid container spacing={2}>
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
    </div>
  )
}

export default TeacherEdit
