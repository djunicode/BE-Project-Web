import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import DescriptionIcon from '@material-ui/icons/Description';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Checkbox from '@material-ui/core/Checkbox'
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
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

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 4000,
  timerProgressBar: true,
});


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
  const teacherPresent = localStorage.getItem('Designation')=='Teacher'?true:false;
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
  const [projectClass, setProjectClass] = useState("")
  const [contributors, setContributors] = useState(
    teacherPresent?null:
    [
      { 
        value:Number(localStorage.getItem('id')),
        label:localStorage.getItem('Name'),
        isFixed:true
      }
    ]
  );
  const [contributorOpts, setcontributorOpts] = useState([]);
  const [errors, setErrors] = useState("");
  const [DomainOptions, setDomainOptions] = useState([]);
  const [gitLink,setGitLink] = useState("");
  const [publication,setPublication] = useState("");
  const [youtube,setYoutube] = useState("");
  const [abstract, setabstract] = useState("");
  const [awards, setawards] = useState("");
  const [finalYear,setFinalYear] = useState(false);
  const [groupNo, setGroupNo] = useState(null);

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
      setawards(props.data.awards);
      setHouse(props.data.is_inhouse?"In-House":"Out-House");
      setFinalYear(props.data.is_BE_project);
      setGroupNo(props.data.BE_project_id)
    }
  },[]);
  
  const handleNext = () => {
    setErrors("");
    if((activeStep+1)==2)
    {
      if(props.editing){
        if(!checkEditError()) {
          submitEditData();
        }
        else {
          setErrors(
            'Please enter youtube and github fields in proper format'
          );
          return;
        }
        
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
        abstract == "" || report==null ||
        projectClass==""
        || youtubeCheck(youtube) || githubCheck(gitLink) ||
        (contributors?(contributors.length<2)?true:false:true) ||
        (finalYear?groupNo?false:true:false)
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
        || report==null ||
        projectClass=="" 
        || youtubeCheck(youtube) || githubCheck(gitLink) ||
        (contributors?(contributors.length<2)?true:false:true) ||
        (finalYear?groupNo?false:true:false)
      )
      {
        return true;
      }
    }
    return false;
  }
  const checkEditError = () => {
    if(youtubeCheck(youtube) || githubCheck(gitLink) ) {
      return true;
    }
    return false;
  }
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const submitEditData = () => {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,update it!'
    }).then((result) => {
      if (result.value) {
       const word = 'Token ';
       const token = word.concat(`${localStorage.getItem('Token')}`);
       var myHeaders = new Headers();
       myHeaders.append('Authorization', `${token}`);
       var formdata = new FormData();
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
           window.location.reload(false);
           Toast.fire({
             icon: 'success',
             title: 'Details changed successfully',
           });
         })
         .catch((error) => console.log('error', error)); 
      }
      else{
        handleBack();
      }
    })
  }

  const submitData = () => {
    Swal.fire({
      title: 'Project uploaded',
      text: "Please wait for the teacher incharge to accept your project",
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Okay!'
    }).then((result) => {
      if (result.value) {
        const word = 'Token ';
        const token = word.concat(`${localStorage.getItem('Token')}`);
        var myHeaders = new Headers();
        myHeaders.append('Authorization', `${token}`);
        var formdata = new FormData();
        let projectData = {
          title,
          teacher: mentor,
          description,
          abstract,
          year_created: date,
          domain,
          github_repo: gitLink,
          demo_video: youtube,
          journal: publication,
          awards,
          report,
          executable: executableFile,
          contributor_year:projectClass,
          is_BE_project:finalYear?"True":"False",
          BE_project_id:`${date}_${groupNo}`
        };
        if (house == 'In-House') {
          projectData.is_inhouse = 'True';
        } else {
          projectData.is_inhouse = 'False';
          projectData.company = company;
          projectData.supervisor = supervisor;
        }
        Object.keys(projectData).forEach((val) => {
          formdata.append(`${val}`, projectData[val]);
        });
        contributors.forEach((val) => {
          formdata.append('contributors[]', val.value);
        });

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: formdata,
          redirect: 'follow',
        };
        fetch(`${SERVER_URL}/create_project`, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            Toast.fire({
              icon: 'success',
              title: 'Project submitted successfully',
            });
            history.push('/search');
            console.log('submit', result);
          })
          .catch((error) => console.log('error', error));
      }
      else{
        history.push('/search');
      }
    })
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
              label:`${val.user.first_name} ${val.user.last_name}`,
              isFixed:teacherPresent?false:val.user.id==localStorage.getItem('id')?true:false
            }
          }).filter(user => !user.isFixed) 
        })
      })
  }
  const contributorsChange = (newValue,{action,removedValue}) => {
    switch (action) {
      case 'remove-value':
      case 'pop-value':
        if (removedValue.isFixed) {
          return;
        }
        break;
      case 'clear':
        newValue = teacherPresent?newValue:[
          { 
            value:Number(localStorage.getItem('id')),
            label:localStorage.getItem('Name'),
            isFixed:true
          }
        ];
        break;
    }
    setContributors(newValue);
  }

  const styles = {
    multiValue: (base, state) => {
      return state.data.isFixed ? { ...base, backgroundColor: 'gray' } : base;
    },
    multiValueLabel: (base, state) => {
      return state.data.isFixed
        ? { ...base, fontWeight: 'bold', color: 'white', paddingRight: 6 }
        : base;
    },
    multiValueRemove: (base, state) => {
      return state.data.isFixed ? { ...base, display: 'none' } : base;
    },
  };  

  const showContri = () => {
    var allContri = ""
    props.data.contributors.forEach((contri) => {
      allContri = allContri + contri.user.first_name + ' ' + contri.user.last_name + '; ';
    });
    allContri = allContri.slice(0,-2);
    return allContri;
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
                          disabled={props.editing?props.data.is_inhouse?false:true:false}
                          value="In-House"
                          control={<Radio />}
                          label="In-House"
                        />
                        <FormControlLabel
                          disabled={props.editing?props.data.is_inhouse?true:false:false}
                          value="Out-House"
                          control={<Radio />}
                          label="Out-House"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>
              </div>
              
              <Grid container spacing={2}>
                <Grid container item xs={12} md={12}>
                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        disabled={props.editing?true:false}
                        control={
                          <Checkbox
                            checked={finalYear}
                            onChange={() => setFinalYear(!finalYear)}
                            name="finalYear"
                            color="primary"
                          />
                        }
                        label="Final Year Project"
                      />
                    </Grid>
                    {
                      finalYear?props.editing?<Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          id="projectUnique"
                          label="Identification ID"
                          InputProps={{
                            readOnly: props.editing,
                          }}
                          defaultValue={groupNo}
                        />
                      </Grid>:
                      <Grid item xs={12} md={6}>
                        <TextField
                          id="project-id"
                          label="Project Id"
                          type="number"
                          fullWidth
                          size="small"
                          value={groupNo}
                          onChange={(e) => setGroupNo(e.target.value)}
                          variant="outlined"
                        />
                      </Grid>:<></>
                    }
                </Grid>
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
                        name="projectMembers"
                        value={contributors}
                        styles={styles}
                        options={contributorOpts}
                        className="contri-select"
                        classNamePrefix="selectors"
                        onChange={contributorsChange}
                        isClearable={
                          teacherPresent?true:
                          contributors.some(v => !v.isFixed)
                        }
                      />
                    </React.Fragment>
                  )}
                </Grid>
                <Grid item xs={12} md={12} >
                {props.editing ? (
                    <TextField
                      fullWidth
                      id="projectClass"
                      label="*Class"
                      InputProps={{
                        readOnly: props.editing,
                      }}
                      defaultValue={props.data.contributor_year}
                    />
                  ):<React.Fragment>
                      <FormControl className={classes.root}>
                        <InputLabel id="project-class-label">*Project Class</InputLabel>
                        <MUISelect
                          labelId="project-class-label"
                          id="projectclass"
                          value={projectClass}
                          onChange={(e) => setProjectClass(e.target.value)}
                        >
                          {['FE','SE','TE','BE'].map((pc) => {
                            return (
                              <MenuItem value={pc} key={`class${pc}`}>
                                {pc}
                              </MenuItem>
                            );
                          })}
                        </MUISelect>
                      </FormControl>
                  </React.Fragment>
                  }  
                </Grid>
                <Grid item xs={12} md={6}>
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
                      id="domain"
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
                      id="year"
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
                    placeholder="*Keywords"
                    label={props.editing ? 'Keywords' : null}
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
                    <div>
                      <label htmlFor="report">
                        <Button
                          variant="contained"
                          color="default"
                          startIcon={<CloudUploadIcon />}
                          component="span"
                        >
                          Upload
                        </Button>
    
                      </label>
                      <input
                        type="file"
                        id="report"
                        name="report"
                        style={{display:'none'}}
                        onChange={(e) => setReport(e.target.files[0])}
                      />
                      <div>
                        {report?report.name:'No file Chosen'}
                      </div>
                    </div>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Description>Executable File</Description>
                  {props.editing ? (<>
                    <IconButton
                      target="_blank"
                      variant="contained"
                      color="primary"
                      href={props.data.executable?SERVER_URL + `${props.data.executable}`:null}
                    >
                      <DescriptionIcon />
                     
                    </IconButton>
                     {!props.data.executable && 'No file Available'}
                  </>) : (
                    <div>
                      <label htmlFor="exec">
                        <Button
                          variant="contained"
                          color="default"
                          startIcon={<CloudUploadIcon />}
                          component="span"
                        >
                          Upload
                        </Button>
    
                      </label>
                      <input
                        type="file"
                        id="exec"
                        name="exec"
                        style={{display:'none'}}
                        onChange={(e) => setExecFile(e.target.files[0])}
                      />
                      <div>
                        {executableFile?executableFile.name:'No file Chosen'}
                      </div>
                    </div>
                    
                  )}
                </Grid>
                <Grid item xs={12} md={12} style={props.editing?{display:'none'}:{dispay:'block'}}>
                  <div className="alert alert-warning" role="alert">
                  <div>
                    * Required Fields
                  </div>
                  <div>
                    All the fields in step 1 will not be editable after creating the project !
                  </div>
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
                    label={props.editing ? 'Awards' : null}
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
