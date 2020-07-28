import React from 'react'
import { Container, Typography, Avatar, makeStyles } from '@material-ui/core'

const useStyles = makeStyles({
  avatarStyle:{
    height:90,
    width:90
  },
  makeCenter: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 20,
  },
  InfoMargins:{
    paddingTop:10,
    paddingBottom:10
  }
});

function UserInfo(props) {
  const classes = useStyles();

  React.useEffect(() => {

  },[])
  
  return (
    <React.Fragment>
      <Container maxWidth="sm" className={classes.makeCenter}>
        <Avatar className={ classes.avatarStyle }  />
      </Container>
      {
        props.userData.map(val => {
          return (
            <Typography
              component="h3"
              variant="h6"
              align="center"
              className={classes.InfoMargins}
            >
              {val}
            </Typography>
          )
        })
      }
    </React.Fragment>
  )
}

export default UserInfo
