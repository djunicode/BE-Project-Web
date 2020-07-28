import React, { useState } from 'react'
import { Grid, Paper, Tabs, Tab, makeStyles,Box,Typography, Button } from '@material-ui/core'
import PropTypes from 'prop-types';
import ProjectApproval from './ProjectsApproval';
import MainNav from './MainNav';
import { SERVER_URL } from '../config';
import Swal from 'sweetalert2'
import EditProfile from './EditProfile';
import UserInfo from './UserInfo';

const DummyStudentProject = [{
  approved: false,
  company: "none",
  description: "extra info...",
  contributor:[{name:"Test1"},{name:"Test2"}],
  document: "http://127.0.0.1:8000/media/60004180085_ostl-undertaking.pdf",
  domain: "Cryptography",
  id: 456856,
  is_inhouse: true,
  supervisor: "none",
  teacher: 354546,
  title: "Test student project,dummy detail,delete will not work",
  year_created: 2020,

}];

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
  const [projects, setprojects] = useState([]);

  const studentData=[
    "Username",
    "SapId",
    "Name",
    "Department",
    "Year",
    "Email"
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
        //remove from localstorage acc to student data
      }
    })
  }
  React.useEffect(() => {
    const getData = () => {
      //set projects from endpoint
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
                <Tab label="Edit Info"  {...a11yProps(1)} />
              </Tabs>
            </Paper>
          </div>
          <TabPanel value={value} index={0}>
            <ProjectApproval 
              projects={DummyStudentProject}
              completed={true}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <EditProfile/>
          </TabPanel>
        </Grid>
      </Grid>
    </div>
  </div>
  )
}

export default TeacherDashboard
