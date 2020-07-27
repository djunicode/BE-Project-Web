import React, { useState } from 'react'
import { Grid ,TextField, InputAdornment, makeStyles, Select, MenuItem, FormControl, FormControlLabel, Checkbox, Button, Radio, RadioGroup} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import queryString from 'query-string';
import styled from 'styled-components';
import ProjectList from './ProjectList';
import MainNav from './MainNav';
import { SERVER_URL } from '../config';

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
    justifyContent:'center'
  },
  filterButtons:{
    marginTop:10,
    marginBlock:10
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
export const getOptionsForYear = () => {
  let curr = new Date().getFullYear();
  let data = [];
  for(let i = curr;i>=2015;i--)
  {
    data.push(i);
  }
  return data;

}

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
  
  const classes = useStyles();

  const getTeachers = () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    fetch(`${SERVER_URL}/api/teachers`, requestOptions)
      .then(response => response.json())
      .then(result => {
        setTeachers(result);
      })
      .catch(error => console.log('error', error));
  }
  const applyFilters = () => {
    if(currentSearchFilter) {
      let x = false;
      if (house=="In-House") x=true; 
      const newProjects = projects.filter(project => {
        return (
          project.domain==domain ||
          project.year_created==year ||
          project.house==x ||
          project.teacher==faculty
        )
      });
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
    fetch(`${SERVER_URL}/api/projects?domain=${domain}&approved=True&year_created=${year}&teacher=${faculty}&is_inhouse=${houseParam}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        setProjects(result);
      })
      .catch(error => console.log('error', error));
  }
  const makeSearch = (event) => {
    var code = event.keyCode || event.which;
    if(code === 13) { 
      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      fetch(`${SERVER_URL}/api/search?generic=${searchTerm}`, requestOptions)
        .then(response => response.json())
        .then(result => {
          setProjects(result[1].projects);
        })
        .catch(error => console.log('error', error));
    } 
    
  }
  React.useEffect(() => {
    const url = props.location.search;
    const params = queryString.parse(url);
    let iniDomain="";
    if(params.query) {
      iniDomain = params.query;
      setdomain(iniDomain);
    }
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    
    fetch(`${SERVER_URL}/api/projects/?domain=${iniDomain}&approved=True`, requestOptions)
      .then(response => response.json())
      .then(result => {
        setProjects(result);
      })
      .catch(error => console.log('error', error));
    
    const getDomains = () => {
      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      fetch(`${SERVER_URL}/api/get_domains/`, requestOptions)
        .then(response => response.json())
        .then(result => { 
          setDomainOptions(result)
        })
        .catch(error => console.log('error', error));
    }
    getTeachers();
    getDomains();
  },[])
  return (<div>
    <MainNav/>
  
    <SearchContainer>
      <Grid container className={classes.fixHeight} >
        <Grid item md={3} xs={12} className={classes.makeCenter}>
          <Filters>
            <h6>Filters</h6>
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
                          value={teacher.pk}
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
              <Button variant="contained" color="primary" onClick={applyFilters} fullWidth>
                Apply Filters
              </Button>
            </div>
            
          </Filters>
        </Grid>
        <Grid item md={9} xs={12}>
          <ProjectContent>
            <div>
              <TextField
                className={classes.searchBox}
                id="input-with-icon-textfield"
                placeholder="Search Project Name.."
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
