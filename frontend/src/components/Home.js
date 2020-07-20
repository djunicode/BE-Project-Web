import React,{useState} from 'react'
import { Link } from 'react-router-dom'
import { Container, Grid, Typography, Paper } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';

const useStyles = makeStyles((theme) => ({
    cardStyle:{
      minHeight: 150,
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
      color: 'white',
      borderRadius: 5,
      wordBreak: 'break-word',
      background: 'salmon',
    }
  }));

const HomeContainer = styled.div`
  a:hover {
    text-decoration:none;
  }
  padding-top:20px;
  padding-bottom:20px;
  .styleHeader {
    text-align:center;
    margin:30px 0;
  }
`
function Home(props) {
  const classes = useStyles();
  const [DomainOptions, setDomainOptions] = useState([]);
  React.useEffect(() => {
    const getDomains = () => {
      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      fetch("http://127.0.0.1:8000/api/get_domains/", requestOptions)
        .then(response => response.json())
        .then(result => { 
          setDomainOptions(result)
        })
        .catch(error => console.log('error', error));
    }
    getDomains();
  },[])
  return (
    <HomeContainer>
      <Container maxWidth="md">
        <h1 class="styleHeader">Look Up the Archive</h1>
        <p class="styleHeader">Select the domain of the project you are loooking for</p>
        <Grid container spacing={3}>
          {DomainOptions.map(domain => {
            return (
              <Grid item md={3} xs={6}>
                <Link to={`/search?query=${domain}`}>
                  <Paper elevation={3} className={classes.cardStyle}>
                      <Typography align="center">
                        {domain}
                      </Typography>
                  </Paper>
                </Link>
              </Grid>
            )
          })}
        </Grid>
      </Container>
    </HomeContainer>
  )
}

export default Home
