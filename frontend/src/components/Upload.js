import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@material-ui/icons/RemoveCircleOutlineOutlined';
import {getOptionsForYear} from './Search' 
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
  const [linksList, setlinksList] = useState([{ description: "", url: "" }]);
  const [highlights, sethighlights] = useState([{description:""}]);
  const options = [
    { value: 'Rohan', label: 'Rohan' },
    { value: 'Jash', label: 'Jash' },
    { value: 'Rashmil', label: 'Rashmil' }
  ]

  // handle input change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...linksList];
    list[index][name] = value;
    setlinksList(list);
  };
 
  // handle click event of the Remove button
  const handleRemoveClick = index => {
    const list = [...linksList];
    list.splice(index, 1);
    setlinksList(list);
  };
 
  // handle click event of the Add button
  const handleAddClick = () => {
    setlinksList([...linksList, { description: "", url: "" }]);
  };

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
      if(!checkErrors)
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
        date=="" ||
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
                  <MenuItem value={domain}>{domain}</MenuItem>
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
        <Grid item xs={12} md={12}>
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
                    value={teacher.pk}
                  >
                    {teacher.user.first_name} {teacher.user.last_name}
                  </MenuItem>
                )
              })}
            </MUISelect>
          </FormControl>
        </Grid>
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
                    >
                      {item}
                    </MenuItem>
                  )
                })
              }
            </MUISelect>
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
      <div style={{margin:'10px 0'}}>
        <Description>Add Contributors</Description>
        <Select 
          isMulti
          name="colors"
          options={options}
          className="contri-select"
          classNamePrefix="selectors"
        />
      </div>
      <div style={{margin:'10px 0'}}>
        <Description>Links</Description>
        {linksList.map((x, i) => {
        return (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField 
              id={`link${i}`} 
              label="Description" 
              variant="outlined"
              name="description"
              value={x.description}
              onChange={e => handleInputChange(e, i)}
              fullWidth
              size="small" 
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField 
              id={`description${i}`} 
              label="URL" 
              variant="outlined"
              name="url"
              value={x.url}
              onChange={e => handleInputChange(e, i)}
              fullWidth 
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={12} >
            {linksList.length - 1 === i &&
              <IconButton 
              className={classes.alignedRightButtons}
              onClick={handleAddClick}
              >
                <AddCircleOutlineOutlinedIcon/>
              </IconButton>
            } 
            {linksList.length !== 1 &&
              <IconButton 
              id={`removeLink${i}`}
              className={classes.alignedRightButtons}
              onClick={() => handleRemoveClick(i)}
              >
                <RemoveCircleOutlineOutlinedIcon/>
              </IconButton>
            }
          </Grid>
        </Grid>
        )})}
      </div>
      <div style={{margin:'10px 0'}}>
        <Description>Highlights</Description>
        {
          highlights.map((x,i) => {
            return (
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  <TextField 
                    id={`award${i}`} 
                    label="Description" 
                    variant="outlined"
                    name="description"
                    value={x.description}
                    onChange={e => {
                      let { name, value } = e.target;
                      let list = [...highlights];
                      list[i][name] = value;
                      sethighlights(list);
                    }}
                    fullWidth
                    size="small" 
                  />
                </Grid>
                <Grid item xs={12} md={12} >
                  {highlights.length - 1 === i &&
                    <IconButton 
                    className={classes.alignedRightButtons}
                    onClick={() => {
                      sethighlights([...highlights, { description: ""}]);
                    }}
                    >
                      <AddCircleOutlineOutlinedIcon/>
                    </IconButton>
                  } 
                  {highlights.length !== 1 &&
                    <IconButton 
                    id={`removeHighlight${i}`}
                    className={classes.alignedRightButtons}
                    onClick={() => {
                      let list = [...highlights];
                      list.splice(i, 1);
                      sethighlights(list);
                    }}
                    >
                      <RemoveCircleOutlineOutlinedIcon/>
                    </IconButton>
                  }
                </Grid>
              </Grid>
            )
          })
        }
      </div>
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
