import React, { useState } from 'react'
import { Grid, Paper, Tabs, Tab, makeStyles,Box,Typography, Button } from '@material-ui/core'
import PropTypes from 'prop-types';
import ProjectApproval from '../Projects/ProjectsApproval';
import MainNav from '../components/MainNav';
import { SERVER_URL } from '../config';
import Swal from 'sweetalert2'
import UserInfo from '../components/UserInfo';
import StudentEdit from './StudentEdit';

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
    background:'#e4e4e4',
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
function StudentDashboard(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [projects, setprojects] = useState([]);

  const studentData=[
    localStorage.getItem('Username'),
    localStorage.getItem('Name'),
    localStorage.getItem('year'),
    localStorage.getItem('division'),
    localStorage.getItem('githubId')
  ]

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const logout = () => {
    Swal.fire({
      title:'Confirm Logout',
      icon:'info',
      confirmButtonText:'Yes'
    }).then((result) => {
      if(result.value) {
        localStorage.clear();
        props.history.push("/login");
      }
    })
  }
  React.useEffect(() => {
    const getData = () => {
      const word = 'Token ';
      const token = word.concat(`${localStorage.getItem('Token')}`);
      var myHeaders = new Headers();
      myHeaders.append('Authorization', `${token}`);
      var requestOptions = {
        method: 'GET',
        headers:myHeaders,
        redirect: 'follow'
      };
      fetch(`${SERVER_URL}/my_projects`, requestOptions)
        .then(response => response.json())
        .then(result => {  
          setprojects(result);
        })
        .catch(error => console.log('error', error));
    };
    getData();
  },[])
  return (<div>
    <MainNav/>
    <div>
      <Grid container className={classes.fixHeight}>
        <Grid item md={3} xs={12} className={classes.userInfo}>
          <UserInfo
            userData={studentData}
          />
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
                <Tab label="Uploads" {...a11yProps(0)} />
                <Tab label="Settings"  {...a11yProps(1)} />
              </Tabs>
            </Paper>
          </div>
          <TabPanel value={value} index={0}>
            <ProjectApproval 
              projects={projects}
              completed={true}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <StudentEdit/>
          </TabPanel>
        </Grid>
      </Grid>
    </div>
  </div>
  )
}

export default StudentDashboard
