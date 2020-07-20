import React, { useState } from 'react'
import { Grid, Paper, Tabs, Tab, makeStyles,Box,Typography, Container, Avatar, Button } from '@material-ui/core'
import PropTypes from 'prop-types';
import ProjectApproval from './ProjectsApproval';
import ProjectList from './ProjectList';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    background:'#f7f7f7'
  },
  avatarStyle:{
    height:90,
    width:90
  },
  makeCenter: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 20,
  },
  userInfo : {
    background:'#e4e4e4'
  },
  fixHeight:{
    minHeight:'90vh'
  },
  InfoMargins:{
    paddingTop:10,
    paddingBottom:10
  }
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
function TeacherDashboard(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [approved,setApproved] = useState([]);
  const [pending,setPending] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const logout = () => {
    const r = window.confirm("Do you really want to logout?")
    if(r == true){
      localStorage.setItem('Token', null);
      localStorage.setItem('Status', 'LoggedOut');
      localStorage.removeItem('Name');
      localStorage.removeItem('Username');
      localStorage.removeItem('id');
      localStorage.removeItem('Subject');
      props.history.push("/login");
    }
  }
  React.useEffect(() => {
    const getData = () => {
      var pk = localStorage.getItem("id");
      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      fetch(`http://127.0.0.1:8000/api/teachers/${pk}`, requestOptions)
        .then(response => response.json())
        .then(result => {  
          const projects = result.project;
          const approved_proj = projects.filter(project => {
            return project.approved==true
          });
          const pending_proj = projects.filter(project => {
            return project.approved==false
          });
          setApproved(approved_proj);
          setPending(pending_proj);
        })
        .catch(error => console.log('error', error));
    };
    getData();
  },[])
  return (
    <div>
      <Grid container className={classes.fixHeight}>
        <Grid item md={3} xs={12} className={classes.userInfo}>
          <Container maxWidth="sm" className={classes.makeCenter}>
            <Avatar className={ classes.avatarStyle }  />
          </Container>
          <Typography align="center" 
          component="h2" 
          variant="h6" 
          className={classes.InfoMargins}
          >
            {localStorage.getItem('Username')}
          </Typography>
          <Typography
            component="h3"
            variant="h6"
            align="center"
            className={classes.InfoMargins}
          >
            {localStorage.getItem('Name')}
          </Typography>
          <Typography
            component="h3"
            variant="h6"
            align="center"
            className={classes.InfoMargins}
          >
            {localStorage.getItem('Subject')}
          </Typography>
          <Typography
            align="center"
            className={classes.InfoMargins}
          >
            <Button
            variant="contained"
            color="primary"
            id="logout"
            onClick={() => logout()}
            >
              Logout
            </Button>
          </Typography>
          
        </Grid>
        <Grid item md={9} xs={12} >
          <div>
            <Paper className={classes.root} >
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                centered
              >
                <Tab label="Pending" {...a11yProps(0)} />
                <Tab label="Approved"  {...a11yProps(1)} />
              </Tabs>
            </Paper>
          </div>
          <TabPanel value={value} index={0}>
            <ProjectApproval 
              projects={pending}
              completed={false}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <ProjectApproval
              projects={approved}
              completed={true}
            />
          </TabPanel>
        </Grid>
      </Grid>
    </div>
  )
}

export default TeacherDashboard
