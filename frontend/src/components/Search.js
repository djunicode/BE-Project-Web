import React, { useState } from 'react'
import { Grid ,
  TextField,
  InputAdornment, 
  makeStyles, 
  Select, 
  MenuItem, 
  FormControl, 
  FormControlLabel, 
  Checkbox, 
  Button, 
  Radio, 
  RadioGroup
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import FilterListIcon from '@material-ui/icons/FilterList';
import queryString from 'query-string';
import styled from 'styled-components';
import ProjectList from '../Projects/ProjectList';
import MainNav from './MainNav';
import { SERVER_URL } from '../config';
import { getOptionsForYear, getTeachers,getDomains } from '../commonFuncs';
import GenerateCSV from './GenerateCSV';
import GetAppIcon from '@material-ui/icons/GetApp';

const useStyles = makeStyles((theme) => ({
  searchBox:{
    width:'100%',
    padding:10
  },
  formControl: {
    marginTop: 8,
    marginBottom:8,
    width: 200,
  },
  fixHeight:{
    minHeight:'90vh'
  },
  makeCenter : {
    display:'flex',
    justifyContent:'center',
    backgroundColor: '#F5F5F5'
  },
  filterButtons:{
    marginTop:10,
    marginBottom:10,
    color:'white'
  },
  downloadCSV:{
    background:'#39960a',
    color:'white',
    '& a':{
      textDecoration:'none',
      color:'white'
    },
    '&:hover':{
      background:'#2f770a',
      color:'white',
    }
  }
}));
const ProjectContent = styled.div`
  margin-top:30px;
  padding: 15px;
`
const Filters = styled.div`
margin-top:30px;
`
const SearchContainer = styled.div`

`

function Search(props) {
  const [domain, setdomain] = useState("");
  const [year, setyear] = useState("");
  const [faculty, setfaculty] = useState("");
  const [house, setHouse] = useState("");
  const [searchTerm, setsearchTerm] = useState("");
  const [projects,setProjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [currentSearchFilter, setcurrentSearchFilter] = useState(false);
  const [DomainOptions, setDomainOptions] = useState([]);
  const [finalYearProj, setFinalYearProj] = useState("False");
  const [projectClass, setProjectClass] = useState("");
  const [awarded, setawarded] = useState(false);
  const classes = useStyles();

  const applyFilters = () => {
    if(currentSearchFilter) {
      let x = false;
      if (house=="In-House") x=true; 
      let newProjects = projects.filter(project => {
        return (
          project.domain==domain ||
          project.year_created==year ||
          project.is_inhouse==x ||
          project.teacher.user.id==faculty ||
          project.contributor_year==projectClass ||
          project.is_BE_project==finalYearProj
        )
      });
      if(awarded) {
        newProjects = newProjects.filter(proj => proj.awards!="" || proj.awards!="None")
      }
      setProjects(newProjects);
      return;
    }
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    let houseParam="";
    if(house=="In-House") {
      houseParam="True";
    }
    else if(house=="Out-House"){
      houseParam="False";
    }
    fetch(`${SERVER_URL}/browse_projects?domain=${domain}&approved=True&year_created=${year}&teacher__user__id=${faculty}&is_inhouse=${houseParam}&is_BE_project=${finalYearProj=="False"?"":finalYearProj}&contributor_year=${projectClass}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        let projectsRecv = result;
        if(awarded) {
          projectsRecv = projectsRecv.filter(proj => proj.awards!="None" && proj.awards!="")
        }
        setProjects(projectsRecv);
      })
      .catch(error => console.log('error', error));
  }

  const makeSearch = (event) => {
    var code = event.keyCode || event.which;
    if(code === 13) { 
      var myHeaders = new Headers();
      if (localStorage.getItem("Token") !== null) {
        var token = localStorage.getItem('Token');
        var finalToken = "Token " + token;

        myHeaders.append("Authorization", finalToken);
      }
      var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders
      };
      fetch(`${SERVER_URL}/search/${searchTerm}`, requestOptions)
        .then(response => response.json())
        .then(result => {
          setProjects(result);
        })
        .catch(error => console.log('error', error));
    }
    
  }

  const clearFilters = () => {
    setdomain("");
    setyear("");
    setfaculty("");
    setHouse("");
    setProjectClass("");
    setFinalYearProj("False");
    setcurrentSearchFilter(false);
    setawarded(false);
    setsearchTerm("");
    var myHeaders = new Headers();
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders
    };
    
    fetch(`${SERVER_URL}/browse_projects?approved=True`, requestOptions)
      .then(response => response.json())
      .then(result => {
        setProjects(result);
      })
      .catch(error => console.log('error', error));
  }

  React.useEffect(() => {
    const url = props.location.search;
    const params = queryString.parse(url);
    let iniDomain="";
    if(params.query) {
      iniDomain = params.query;
      setdomain(iniDomain);
    }

    var myHeaders = new Headers();

    if(localStorage.getItem("Token") !== null) {
      var token = localStorage.getItem('Token');
      var finalToken = "Token " + token;

      myHeaders.append("Authorization", finalToken);
    }

    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders
    };
    
    fetch(`${SERVER_URL}/browse_projects?domain=${iniDomain}&approved=True`, requestOptions)
      .then(response => response.json())
      .then(result => {
        setProjects(result);
      })
      .catch(error => console.log('error', error));
    
    const collect = async() => {
      const doms = await getDomains();
      setDomainOptions(doms);
      const teacherOpts = await getTeachers();
      setTeachers(teacherOpts);
    }
    collect();
  },[])
  return (<div>
    <MainNav/>
  
    <SearchContainer>
      <Grid container className={classes.fixHeight} >
        <Grid item md={3} xs={12} className={classes.makeCenter}>
          <Filters>         
            <div>
              <Grid container>
                <Grid item md={6} xs={6}>
                  <h6><FilterListIcon/> Filters</h6>
                </Grid>
                <Grid item md={4} xs={4}>
                  <Button
                    variant="contained"
                    color="default"
                    size="small"
                    onClick={clearFilters}
                    startIcon={<ClearIcon />}
                  >
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </div>
            <div>
              <FormControl variant="outlined" className={classes.formControl} >
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  displayEmpty
                  className={classes.selectEmpty}
                  value={domain}
                  onChange={(e) => setdomain(e.target.value)}
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  <MenuItem value="" >
                    Domains
                  </MenuItem>
                  {DomainOptions.map(domain => {
                    return (
                      <MenuItem 
                        value={domain}
                      >
                        {domain}
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </div>
            <div>
              <FormControl variant="outlined" className={classes.formControl} >
                <Select
                  labelId="demo-simple-select-year-label"
                  id="demo-simple-select-year"
                  displayEmpty
                  className={classes.selectEmpty}
                  value={year}
                  onChange={(e) => setyear(e.target.value)}
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  <MenuItem value="" >
                    Year
                  </MenuItem>
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
            </div>
            <div>
              <FormControl variant="outlined" className={classes.formControl} >
                <Select
                  labelId="demo-simple-select-faculty-label"
                  id="demo-simple-select-faculty"
                  displayEmpty
                  className={classes.selectEmpty}
                  value={faculty}
                  onChange={(e) => setfaculty(e.target.value)}
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  <MenuItem value="">
                    Faculty
                  </MenuItem>
                  {
                    teachers.map(teacher => {
                      return (
                        <MenuItem 
                          value={teacher.user.id}
                          key={`faculty${teacher.user.id}`}
                        >
                          {teacher.user.first_name} {teacher.user.last_name}
                        </MenuItem>
                      )
                    })
                  }             
                </Select>
              </FormControl>
            </div>
            <div>
              <FormControl variant="outlined" className={classes.formControl} >
                <Select
                  id="project-class-filter"
                  displayEmpty
                  value={projectClass}
                  onChange={(e) => setProjectClass(e.target.value)}
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  <MenuItem value="">
                    Class
                  </MenuItem>
                  {
                    ['FE','SE','TE','BE'].map(pc => {
                      return (
                        <MenuItem 
                          value={pc}
                          key={`class${pc}`}
                        >
                          {pc}
                        </MenuItem>
                      )
                    })
                  }             
                </Select>
              </FormControl>
            </div>
            <div>
              <FormControl component="fieldset">
                <RadioGroup aria-label="house"
                name="house" 
                value={house} 
                onChange={(e) => setHouse(e.target.value)}
                >
                  <FormControlLabel value="In-House" control={<Radio />} label="In-House" />
                  <FormControlLabel value="Out-House" control={<Radio />} label="Out-House" />
                </RadioGroup>
              </FormControl>
            </div>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={ awarded }
                    onChange={ (e) => setawarded(!awarded) }
                    name="awardedTrue"
                    color="primary"
                  />
                }
                label="Awarded"
              />
            </div>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={ (finalYearProj=="True")? true: false }
                    onChange={ (e) => {
                      if(finalYearProj=="True"){
                        setFinalYearProj("False")
                      }
                      else{
                        setFinalYearProj("True")
                      }
                    } }
                    name="finalYearTrue"
                    color="primary"
                  />
                }
                label="Final Year Project"
              />
            </div>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={currentSearchFilter}
                    onChange={(e) => setcurrentSearchFilter(!currentSearchFilter)}
                    name="currentSearchFilter"
                    color="primary"
                  />
                }
                label="Apply on Current Search"
              />
            </div>
            <div className={classes.filterButtons}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={applyFilters} 
                fullWidth
              >
                Apply
              </Button>
            </div>
            {(localStorage.getItem("Designation")==="Teacher")? (
              <div className={ classes.filterButtons }>
                <Button
                  variant="contained"
                  className={ `${classes.downloadCSV}` }
                  startIcon={ <GetAppIcon /> }
                  fullWidth
                >
                  <GenerateCSV projects={ projects } />
                </Button>
              </div>
            ) : null}
          </Filters>
        </Grid>
        <Grid item md={9} xs={12} style={{backgroundColor:'#fdfdfd'}}>
          <ProjectContent>
            <div>
              <TextField
                className={classes.searchBox}
                id="input-with-icon-textfield"
                placeholder="Search Project.."
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setsearchTerm(e.target.value)}
                onKeyUp={makeSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon/>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <ProjectList 
            projects={projects}
            teachers={teachers}
            />
          </ProjectContent>
          
        </Grid>
      </Grid>
    </SearchContainer>
    </div>
  )
}

export default Search
