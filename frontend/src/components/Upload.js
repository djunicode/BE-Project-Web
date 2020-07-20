import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {getOptionsForYear} from './Search' 
import { FormControlLabel, RadioGroup, Radio,FormControl, FormLabel, Grid, TextField, MenuItem, Select, InputLabel, Chip, Avatar } from '@material-ui/core';

import styled from 'styled-components';
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  verticalCenter:{
    display: 'flex',
    alignItems: 'center'
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  fixHeight:{
    minHeight:'90vh'
  },
}));

const FormNextBack = styled.div`
  float:right;
  margin-top:20px;
  margin-bottom:20px;
`
function getSteps() {
  return ['Enter Information', 'Enter Contributors'];
}

function Upload() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  const [house, setHouse] = React.useState('In-House');
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [domain, setdomain] = useState("");
  const [mentor, setmentor] = useState("");
  const [company, setCompany] = useState("");
  const [supervisor, setsupervisor] = useState("");
  const [description, setdescription] = useState("");
  const [date, setdate] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [errors, setErrors] = useState("");
  const [contriName, setcontriName] = useState("");
  const [contriLastName, setcontriLastName] = useState("");
  const [contriEmail, setcontriEmail] = useState("");
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
  },[]);
  const addContributor = () => {
    setContributors(prev => {
      return [
        ...prev,
        {
          name:contriName,
          last_name:contriLastName,
          email:contriEmail
        }
      ]
    });
    setcontriName("");
    setcontriLastName("");
    setcontriEmail("");
  }
  
  const handleNext = () => {
    setErrors("");
    if((activeStep+1)==2)
    {
      if(!checkErrors())
      {
        submitData();
      }
      else {
        setErrors("Please enter all inputs and atleast two contributors");
        return;
      }
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const checkErrors = () => {
    if(house=="In-House") {
      if(
        domain=="" || title==""||
        date=="" || mentor=="" ||
        file==null || description=="" ||
        contributors.length<2 
      )
      {
        return true;
      }
    }
    else if(house=="Out-House"){
      if(
        domain=="" || title==""||
        date=="" || mentor=="" ||
        file==null || description=="" ||
        contributors.length<2 || 
        supervisor=="" || company==""
      )
      {
        return true;
      }
    }
    return false;
  }
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const submitData = () => {
    var myHeaders = new Headers();
    var formdata = new FormData();
    let project = {
      title,
      teacher:mentor,
      year_created:date,
      description,
      approved:false,
      domain
    };
    if(house=="In-House")
    {
      project.is_inhouse=true;
    }
    else
    {
      project.is_inhouse=false;
      project.company=company;
      project.supervisor=supervisor;
    }
    formdata.append("project",JSON.stringify(project)); 
    formdata.append("contributors",JSON.stringify(contributors));
    formdata.append("document",file);
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };
    fetch("http://localhost:8000/api/create_project", requestOptions)
      .then(response => response.json())
      .then(result => {
        //
      })
      .catch(error => console.log('error', error));
  }
  const getTeachers = () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    fetch(`http://127.0.0.1:8000/api/teachers`, requestOptions)
      .then(response => response.json())
      .then(result => {
        setTeachers(result);
      })
      .catch(error => console.log('error', error));
  }
  const handleDeleteContributor = (i) => {
    const newContributors =  contributors.filter((val,index) => {
      return index!=i;
    });
    setContributors(newContributors);
  }
  React.useEffect(() => {
    getTeachers();
  },[])
  return (<Container maxWidth="md" className={classes.fixHeight}>
  <div className={classes.root}>
    <Stepper activeStep={activeStep} alternativeLabel>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
    
  </div>
  <div>
    {activeStep==0?
    <div>
      <div>
        <Grid container>
          <Grid item xs={12} md={2} className={classes.verticalCenter}>
            <FormLabel component="legend">Project Type : </FormLabel>
          </Grid>
          <Grid item xs={12} md={10} >
            <FormControl component="fieldset">
              <RadioGroup row aria-label="house"
               name="house" 
               value={house} 
               onChange={(e) => setHouse(e.target.value)}
              >
                <FormControlLabel value="In-House" control={<Radio />} label="In-House" />
                <FormControlLabel value="Out-House" control={<Radio />} label="Out-House" />
              </RadioGroup>
          </FormControl>
          </Grid>
        </Grid>
      </div>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth 
          id="title" 
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)} 
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl className={classes.root}>
            <InputLabel id="domain-label">Domain</InputLabel>
            <Select
              labelId="domain-label"
              id="domain"
              value={domain}
              onChange={(e) => setdomain(e.target.value)}
            >
              {DomainOptions.map(domain => {
                return (
                  <MenuItem value={domain}>{domain}</MenuItem>
                )
              })}
              
            </Select>
          </FormControl>
        </Grid>
          {house=='Out-House'?<>
            <Grid item xs={12} md={6}>
              <TextField 
              fullWidth 
              id="company" 
              label="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)} 
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField 
              fullWidth 
              id="supervisor" 
              label="Supervisor" 
              value={supervisor}
              onChange={(e) => setsupervisor(e.target.value)} 
              />
            </Grid>
            </>:
            <Grid item xs={12} md={12}>
              <FormControl className={classes.root}>
                <InputLabel id="demo-simple-select-label">Mentor</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={mentor}
                  onChange={(e) => setmentor(e.target.value)}
                >
                  {teachers.map(teacher => {
                    return (
                      <MenuItem 
                        value={teacher.pk}
                      >
                        {teacher.user.first_name} {teacher.user.last_name}
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </Grid>
          }
        
        <Grid item xs={12} md={12}>
          <TextField
            id="outlined-multiline-static"
            multiline
            rows={5}
            placeholder="Description"
            fullWidth
            value={description}
            className="inputs"
            onChange={(e) => setdescription(e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl className={classes.root}>
            <InputLabel id="year-label">Year</InputLabel>
            <Select
              labelId="year-label"
              id="year"
              value={date}
              onChange={(e) => setdate(e.target.value)}
            >
              {
                Array.from(getOptionsForYear()).map(item => {
                  return (
                    <MenuItem 
                      value={item}
                    >
                      {item}
                    </MenuItem>
                  )
                })
              }
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          
          <input type="file"
            style={{marginTop:20}}
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Grid>
      </Grid>
    </div>:
    <div>
      <div>
        {
          contributors.map((contri,index) => {
            return(
              <Chip
                variant="default"
                size="medium"
                style={{margin:10}}
                avatar={<Avatar>{contri.name.toUpperCase()[0]}{contri.last_name.toUpperCase()[0]}</Avatar>}
                label={contri.name+" "+contri.last_name}
                onDelete={() => handleDeleteContributor(index)}
              />
            )
          })
        }
      
      </div>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth id="contriName" label="Name"
          value={contriName}
          onChange={e => setcontriName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth id="contriLastName" label="Last Name" 
          value={contriLastName}
          onChange={e => setcontriLastName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField fullWidth id="contriEmail" label="Email" 
          value={contriEmail}
          onChange={e => setcontriEmail(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Button 
          style={{float:'right'}}
          variant="contained" 
          color="primary"
          onClick={addContributor}
          >
            Add Contributor
          </Button>
        </Grid>
      </Grid>
      <div style={{color:'red'}}>
        {
          errors!==""?errors:""
        }
      </div>
    </div>  
  }
  </div>
  <FormNextBack>
      {activeStep === steps.length ? (
        <div>
          <Typography className={classes.instructions}>All steps completed</Typography>
          {/* <Button onClick={handleReset}>Reset</Button> */}
        </div>
      ) : (
        <div>
          <div>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              className={classes.backButton}
            >
              Back
            </Button>
            <Button variant="contained" color="primary" onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </div>
        </div>
      )}
    </FormNextBack>
</Container>
)
}

export default Upload
