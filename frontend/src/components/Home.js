import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Grid, Typography, Paper } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import {Domains} from "../staticData";

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
  return (
    <HomeContainer>
      <Container maxWidth="md">
        <h1 class="styleHeader">Look Up the Archive</h1>
        <p class="styleHeader">Select the domain of the project you are loooking for</p>
        <Grid container spacing={3}>
          {Domains.map(domain => {
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
