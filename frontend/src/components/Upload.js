import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import DescriptionIcon from '@material-ui/icons/Description';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { useHistory } from 'react-router-dom';
import {getOptionsForYear, getTeachers} from '../commonFuncs' 
import { FormControlLabel, 
  RadioGroup, 
  Radio,FormControl, 
  FormLabel, 
  Grid, 
  IconButton,
  TextField, 
  MenuItem, 
  Select as MUISelect, 
  InputLabel, 
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

export const youtubeValid = /^(https\:\/\/)(www\.youtube\.com\/watch\?v=).+$/;
export const githubValid = /^(https\:\/\/)(github\.com\/).+$/;

const youtubeCheck = (url) => {
  if(url=="") {
    return false
  }
  else if(!youtubeValid.test(url)){
    return true;
  }
  else {
    return false;
  }
}
export const githubCheck = (url) => {
  if(url=="") {
    return false
  }
  else if(!githubValid.test(url)){
    return true;
  }
  else {
    return false;
  }
}

function Upload(props) {
  const classes = useStyles();
  let history = useHistory();
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
    if(props.editing){
      setGitLink(props.data.github_repo);
      setYoutube(props.data.demo_video);
      setPublication(props.data.journal);
      setawards(props.data.awards)
    }
  },[]);
  
  const handleNext = () => {
    setErrors("");
    if((activeStep+1)==2)
    {
      if(props.editing){
        submitEditData();
      }
      else{
        if (!checkErrors()) {
          submitData();
        } else {
          setErrors(
            'Please enter required inputs in proper format and atleast two contributors'
          );
          return;
        }
      }
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const checkErrors = () => {
    if(house=="In-House") {
      if(
        domain=="" || title==""||
        date=="" || mentor=="" || description=="" ||
        abstract == "" || report==null
        || youtubeCheck(youtube) || githubCheck(gitLink) ||
        contributors.length<2
      )
      {
        return true;
      }
    }
    else if(house=="Out-House"){
      if(
        domain=="" || title==""||
        date=="" || mentor=="" || description=="" ||
        abstract =="" ||
        supervisor=="" || company==""
        || report==null 
        || youtubeCheck(youtube) || githubCheck(gitLink) ||
        contributors.length<2
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

  const submitEditData = () => {
    const word = 'Token ';
    const token = word.concat(`${localStorage.getItem('Token')}`);
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `${token}`);
    var formdata = new FormData();
    let projectData = {
      github_repo: gitLink,
      demo_video: youtube,
      journal: publication,
      awards: awards
    };
    formdata.append('github_repo', gitLink);
    formdata.append('demo_video', youtube);
    formdata.append('journal', publication);
    formdata.append('awards', awards);
    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };
    fetch(`${SERVER_URL}/update_project/${props.data.id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log('updated', result);
        history.push("/search")
      })
      .catch((error) => console.log('error', error));
  }

  const submitData = () => {
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
      year_created:date,
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
    Object.keys(projectData).forEach(val => {
      formdata.append(`${val}`,projectData[val]);
    });
    contributors.map(val => {
      formdata.append("contributors[]",val);
    })
    
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
    setContributors(() => {
      return newValue?newValue.map(contri => {
        return contri.value;
      }):[]
    });
  }

  const showContri = () => {
    var allContri = ""
    props.data.contributors.forEach((contri) => {
      allContri = allContri + contri.user.first_name + ' ' + contri.user.last_name + '; ';
    })
    return allContri
};
  
  return (
    <div>
      {props.editing === true ? null : <MainNav />}

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
          {activeStep == 0 ? (
            <div>
              <div>
                {props.editing ? (
                  <Grid container>
                    <Grid
                      item
                      xs={12}
                      md={2}
                      className={classes.verticalCenter}
                    >
                      <FormLabel component="legend">Project Type : </FormLabel>
                    </Grid>
                    <Grid item xs={12} md={10}>
                      <FormControl component="fieldset">
                        <RadioGroup
                          row
                          aria-label="house"
                          name="house"
                          value={house}
                          onChange={(e) => setHouse(e.target.value)}
                        >
                          <FormControlLabel
                            value="In-House"
                            control={<Radio />}
                            label="In-House"
                          />
                          <FormControlLabel
                            value="Out-House"
                            control={<Radio />}
                            label="Out-House"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                  </Grid>
                ) : null}
              </div>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  {props.editing ? (
                    <TextField
                      fullWidth
                      id="contributors"
                      label="*Contributors"
                      InputProps={{
                        readOnly: props.editing,
                      }}
                      defaultValue={showContri()}
                    />
                  ) : (
                    <React.Fragment>
                      <Description>*Add Contributors</Description>
                      <Select
                        isMulti
                        name="colors"
                        options={contributorOpts}
                        className="contri-select"
                        classNamePrefix="selectors"
                        onChange={contributorsChange}
                      />
                    </React.Fragment>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  {console.log(props.data)}
                  <TextField
                    fullWidth
                    id="title"
                    label="*Title"
                    InputProps={{
                      readOnly: props.editing,
                    }}
                    defaultValue={props.editing ? props.data.title : title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  {props.editing ? (
                    <TextField
                      fullWidth
                      id="title"
                      label="*Domain"
                      InputProps={{
                        readOnly: props.editing,
                      }}
                      defaultValue={props.data.domain}
                    />
                  ) : (
                    <React.Fragment>
                      <FormControl className={classes.root}>
                        <InputLabel id="domain-label">*Domain</InputLabel>
                        <MUISelect
                          labelId="domain-label"
                          id="domain"
                          value={domain}
                          onChange={(e) => setdomain(e.target.value)}
                        >
                          {DomainOptions.map((domain) => {
                            return (
                              <MenuItem value={domain} key={domain}>
                                {domain}
                              </MenuItem>
                            );
                          })}
                        </MUISelect>
                      </FormControl>
                    </React.Fragment>
                  )}
                </Grid>
                {house == 'Out-House' && (
                  <>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        id="company"
                        label="*Company"
                        InputProps={{
                          readOnly: props.editing,
                        }}
                        defaultValue={
                          props.editing ? props.data.company : company
                        }
                        onChange={(e) => setCompany(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        id="supervisor"
                        label="*Supervisor"
                        InputProps={{
                          readOnly: props.editing,
                        }}
                        defaultValue={
                          props.editing ? props.data.supervisor : supervisor
                        }
                        onChange={(e) => setsupervisor(e.target.value)}
                      />
                    </Grid>
                  </>
                )}
                <Grid item xs={12} md={6}>
                  {props.editing ? (
                    <TextField
                      fullWidth
                      id="mentor"
                      label="*Mentor"
                      InputProps={{
                        readOnly: props.editing,
                      }}
                      defaultValue={
                        props.data.teacher.user.first_name +
                        ' ' +
                        props.data.teacher.user.last_name
                      }
                    />
                  ) : (
                    <FormControl className={classes.root}>
                      <InputLabel id="demo-simple-select-label">
                        *Mentor
                      </InputLabel>
                      <MUISelect
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={mentor}
                        onChange={(e) => setmentor(e.target.value)}
                      >
                        {teachers.map((teacher) => {
                          return (
                            <MenuItem
                              value={teacher.user.id}
                              key={`teacher${teacher.user.id}`}
                            >
                              {teacher.user.first_name} {teacher.user.last_name}
                            </MenuItem>
                          );
                        })}
                      </MUISelect>
                    </FormControl>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  {props.editing ? (
                    <TextField
                      fullWidth
                      id="title"
                      label="*Year"
                      InputProps={{
                        readOnly: props.editing,
                      }}
                      defaultValue={props.data.year_created}
                    />
                  ) : (
                    <FormControl className={classes.root}>
                      <InputLabel id="year-label">*Year</InputLabel>
                      <MUISelect
                        labelId="year-label"
                        id="year"
                        value={date}
                        onChange={(e) => setdate(e.target.value)}
                      >
                        {Array.from(getOptionsForYear()).map((item) => {
                          return (
                            <MenuItem value={item} key={item}>
                              {item}
                            </MenuItem>
                          );
                        })}
                      </MUISelect>
                    </FormControl>
                  )}
                </Grid>
                <Grid item xs={12} md={12}>
                  <TextField
                    id="description"
                    multiline
                    rows={2}
                    inputProps={{
                      maxLength: 200,
                    }}
                    placeholder="*Description"
                    label={props.editing ? 'Description' : null}
                    fullWidth
                    InputProps={{
                      readOnly: props.editing,
                    }}
                    helperText={`${description.length}/200`}
                    value={props.editing ? props.data.description : description}
                    onChange={(e) => setdescription(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <TextField
                    id="abstract"
                    multiline
                    rows={8}
                    placeholder="*Abstract"
                    label={props.editing ? 'Abstract' : null}
                    fullWidth
                    InputProps={{
                      readOnly: props.editing,
                    }}
                    value={props.editing ? props.data.abstract : abstract}
                    onChange={(e) => setabstract(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Description>*Report</Description>
                  {props.editing ? (
                    <IconButton
                      target="_blank"
                      variant="contained"
                      color="primary"
                      href={SERVER_URL + `${props.data.report}`}
                    >
                      <DescriptionIcon />
                    </IconButton>
                  ) : (
                    <input
                      type="file"
                      id="report"
                      name="report"
                      onChange={(e) => setReport(e.target.files[0])}
                    />
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Description>Executable File</Description>
                  {props.editing ? (
                    <IconButton
                      target="_blank"
                      variant="contained"
                      color="primary"
                      href={SERVER_URL + `${props.data.executable}`}
                    >
                      <DescriptionIcon />
                    </IconButton>
                  ) : (
                    <input
                      type="file"
                      id="exec"
                      name="exec"
                      onChange={(e) => setExecFile(e.target.files[0])}
                    />
                  )}
                </Grid>
                <Grid item xs={12} md={12}>
                  <div className="alert alert-warning" role="alert">
                    <div>* Required Fields</div>
                    <div>This fields will not be editable later !</div>
                  </div>
                </Grid>
              </Grid>
            </div>
          ) : (
            <div>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Github Repository Link"
                    variant="outlined"
                    id="github"
                    name="github"
                    placeholder={props.editing ? props.data.github_repo : null}
                    value={gitLink}
                    onChange={(e) => setGitLink(e.target.value)}
                    fullWidth
                    helperText="Format : https://github.com/project-name-prefixes"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="YouTube Link"
                    variant="outlined"
                    id="youtube"
                    name="youtube"
                    defaultValue={props.editing ? props.data.demo_video : null}
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                    fullWidth
                    helperText="Format: https://www.youtube.com/watch?v=video-id"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <TextField
                    label="Publication Link"
                    variant="outlined"
                    id="publication"
                    name="publication"
                    placeholder={props.editing ? props.data.journal : null}
                    value={publication}
                    onChange={(e) => setPublication(e.target.value)}
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
              <div>
                {errors !== '' ? (
                  <div className="alert alert-danger mt-3 mb-3" role="alert">
                    {errors} !
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
          )}
        </div>
        <FormNextBack>
          {activeStep === steps.length ? (
            <div>
              <Typography className={classes.instructions}>
                All steps completed
              </Typography>
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
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                >
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </div>
          )}
        </FormNextBack>
      </Container>
    </div>
  );
}

export default Upload
