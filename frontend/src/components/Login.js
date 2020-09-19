import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MainNav from './MainNav';
import { SERVER_URL } from '../config';
import { Toast } from '../commonFuncs';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  
  fixHeight:{
    minHeight:'90vh'
  },
}));

export default function Login(props) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError] = useState(null);
  const classes = useStyles();
  
  const signIn = () => {
    var myHeaders = new Headers();
    var formdata = new FormData();
    formdata.append("username", username);
    formdata.append("password", password);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch(`${SERVER_URL}/account_login`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if(!result.hasOwnProperty("Message")) {
          console.log('items',result);
          setError(null);
          localStorage.setItem('Token', result.Token);
          localStorage.setItem('Name', result.Name);
          localStorage.setItem('Username', result.Username);
          localStorage.setItem('id', result.id);
          localStorage.setItem('Designation', result.Designation);
          localStorage.setItem('Status', 'LoggedIn');
          if(result.Designation === 'Teacher'){
            localStorage.setItem('Subject',result.Subject);
            props.history.push("/teacher");
          }
          else{
            localStorage.setItem('githubId',result.github_id);
            localStorage.setItem('year',result.Year);
            localStorage.setItem('division',result.Division);
            props.history.push("/student")
          }
          
          Toast.fire({
            icon: 'success',
            title: 'Signed in successfully'
          })

        }
        else {
          setError(result.Message);
        }
      })
      .catch(error => console.log('error', error));
  }
  return (<div>
    <MainNav/>
  
    <Container component="main" maxWidth="xs" className={classes.fixHeight}>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            id="username"
            label="Username"
            name="username"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            label="Password"
            type="password"
            id="password"
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={signIn}
            className={classes.submit}
          >
            Sign In
          </Button>
          
        </form>
        {error && (
          <div style={{color:'red'}}>{error}</div>
        )}
      </div>
      
    </Container>
    </div>
  );
}