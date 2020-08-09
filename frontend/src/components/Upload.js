import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {getOptionsForYear, getTeachers} from '../commonFuncs' 
import { FormControlLabel, 
  RadioGroup, 
  Radio,FormControl, 
  FormLabel, 
  Grid, 
  TextField, 
  MenuItem, 
  Select as MUISelect, 
  InputLabel, 
  Chip, 
  Avatar, 
  IconButton
} from '@material-ui/core';
import Select from 'react-select';
import styled from 'styled-components';
import MainNav from './MainNav';
import { SERVER_URL } from '../config';
import { getDomains } from '../commonFuncs';
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
  alignedRightButtons:{
    float:'right',
    padding:0
  }
}));

const FormNextBack = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top:20px;
  margin-bottom:20px;
`
const Description = styled.h6`
  padding-top:10px;
  padding-bottom:10px;
`
function getSteps() {
  return ['Enter Necessary Information', 'Enter Links'];
}

function Upload() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  const [house, setHouse] = React.useState('In-House');
  const [report, setReport] = useState(null);
  const [executableFile, setExecFile] = useState(null)
  const [title, setTitle] = useState("");
  const [domain, setdomain] = useState("");
  const [mentor, setmentor] = useState("");
  const [company, setCompany] = useState("");
  const [supervisor, setsupervisor] = useState("");
  const [description, setdescription] = useState("");
  const [date, setdate] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [contributorOpts, setcontributorOpts] = useState([]);
  const [errors, setErrors] = useState("");
  const [DomainOptions, setDomainOptions] = useState([]);
  const [gitLink,setGitLink] = useState("");
  const [publication,setPublication] = useState("");
  const [youtube,setYoutube] = useState("");
  const [abstract, setabstract] = useState("");
  const [awards, setawards] = useState("");

  React.useEffect(() => {
    const collect = async() => {
      const doms = await getDomains();
      setDomainOptions(doms);
      const teacherOpts = await getTeachers();
      setTeachers(teacherOpts);
      getContribitors();
    }
    collect();
  },[]);
  
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
        date=="" || mentor=="" || description=="" 
        
      )
      {
        return true;
      }
    }
    else if(house=="Out-House"){
      if(
        domain=="" || title==""||
        date=="" || description=="" ||
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
    console.log('contris',contributors);
    const word = 'Token ';
    const token = word.concat(`${localStorage.getItem('Token')}`);
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `${token}`);
    var formdata = new FormData();
    let projectData = {
      title,
      teacher:mentor,
      description,
      abstract,
      domain,
      github_repo:gitLink,
      demo_video:youtube,
      journal:publication,
      awards,
      report,
      executable:executableFile,
    };
    if(house=="In-House")
    {
      projectData.is_inhouse="True";
    }
    else
    {
      projectData.is_inhouse="False";
      projectData.company=company;
      projectData.supervisor=supervisor;
    }
    // formdata.append("project",JSON.stringify(project)); 
    // formdata.append("contributors",JSON.stringify(contributors));
    // formdata.append("report",report);
    // formdata.append("executable",executableFile);
    Object.keys(projectData).forEach(val => {
      formdata.append(`${val}`,projectData[val]);
    });
    formdata.append("contributors[]",contributors);
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };
    fetch(`${SERVER_URL}/create_project`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('submit',result);
      })
      .catch(error => console.log('error', error));
  }
  
  const getContribitors = () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    fetch(`${SERVER_URL}/contributors`,requestOptions)
      .then(response => response.json())
      .then(result => {
        setcontributorOpts(() => {
          return result.map(val => {
            return {
              value:val.user.id,
              label:`${val.user.first_name} ${val.user.last_name}`
            }
          }) 
        })
      })
  }
  const contributorsChange = (newValue,action) => {
    console.log('chnaged');
    setContributors(() => {
      return newValue?newValue.map(contri => {
        return contri.value;
      }):[]
    });
  }
  return (<div>
    <MainNav/>
  
  <Container maxWidth="md" className={classes.fixHeight}>
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
        <Grid item xs={12} md={12}>
          <Description>Add Contributors</Description>
          <Select 
            isMulti
            name="colors"
            options={contributorOpts}
            className="contri-select"
            classNamePrefix="selectors"
            onChange={contributorsChange}
          />
        </Grid>
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
            <MUISelect
              labelId="domain-label"
              id="domain"
              value={domain}
              onChange={(e) => setdomain(e.target.value)}
            >
              {DomainOptions.map(domain => {
                return (
                  <MenuItem 
                    value={domain}
                    key={domain}
                  >
                    {domain}
                  </MenuItem>
                )
              })}
              
            </MUISelect>
          </FormControl>
        </Grid>
          {house=='Out-House' && <>
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
            </>
          }
        <Grid item xs={12} md={6}>
          <FormControl className={classes.root}>
            <InputLabel id="demo-simple-select-label">Mentor</InputLabel>
            <MUISelect
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={mentor}
              onChange={(e) => setmentor(e.target.value)}
            >
              {teachers.map(teacher => {
                return (
                  <MenuItem 
                    value={teacher.user.id}
                    key={`teacher${teacher.user.id}`}
                  >
                    {teacher.user.first_name} {teacher.user.last_name}
                  </MenuItem>
                )
              })}
            </MUISelect>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl className={classes.root}>
            <InputLabel id="year-label">Year</InputLabel>
            <MUISelect
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
                      key={item}
                    >
                      {item}
                    </MenuItem>
                  )
                })
              }
            </MUISelect>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            id="description"
            multiline
            rows={2}
            inputProps={{
              maxLength:200
            }}
            placeholder="Description"
            fullWidth
            helperText={`${description.length}/200`}
            value={description}
            onChange={(e) => setdescription(e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            id="abstract"
            multiline
            rows={8}
            placeholder="Abstract"
            fullWidth
            value={abstract}
            onChange={(e) => setabstract(e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Description>Report</Description>
          <input type="file"
            id="report"
            name="report"
            onChange={(e) => setReport(e.target.files[0])}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Description>Executable File</Description>
          <input type="file"
            id="exec"
            name="exec"
            onChange={(e) => setExecFile(e.target.files[0])}
          />
        </Grid>
      </Grid>
    </div>:
    <div>
      <Grid container spacing={2}>
        
        <Grid item xs={12} md={6}>
          <TextField 
            label="Github Repository Link" 
            variant="outlined"
            id="github"
            name="github"
            value={gitLink}
            onChange={e => setGitLink(e.target.value)}
            fullWidth
            size="small" 
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField 
            label="YouTube Link" 
            variant="outlined"
            id="youtube"
            name="youtube"
            value={youtube}
            onChange={e => setYoutube(e.target.value)}
            fullWidth
            size="small" 
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField 
            label="Publication Link" 
            variant="outlined"
            id="publication"
            name="publication"
            value={publication}
            onChange={e => setPublication(e.target.value)}
            fullWidth
            size="small" 
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField 
            id="awards"
            multiline
            rows={2}
            variant="outlined"
            placeholder="Awards"
            fullWidth
            value={awards}
            onChange={(e) => setawards(e.target.value)}
          />
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
</div>
)
}

export default Upload
