import React, { useState } from 'react'
import { Grid ,TextField, InputAdornment, makeStyles, Select, MenuItem, FormControl, FormControlLabel, Checkbox, Button, Radio, RadioGroup} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import queryString from 'query-string';
import styled from 'styled-components';
import ProjectList from './ProjectList';
import { Domains } from "../staticData";

const useStyles = makeStyles((theme) => ({
  searchBox:{
    width:'100%',
    padding:10
  },
  formControl: {
    marginTop: 8,
    marginBottom:8,
    minWidth: 200,
  },
  makeCenter : {
    display:'flex',
    justifyContent:'center'
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
const getOptionsForYear = () => {
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
  
  
  const classes = useStyles();

  const getTeachers = () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    fetch(`http://127.0.0.1:8000/api/teachers`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        setTeachers(result);
      })
      .catch(error => console.log('error', error));
  }
  const applyFilters = () => {
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
    fetch(`http://127.0.0.1:8000/api/projects?domain=${domain}&year_created=${year}&teacher__user__username=${faculty}&title=${currentSearchFilter?searchTerm:""}&is_inhouse=${houseParam}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('on filter',result);
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
      fetch(`http://127.0.0.1:8000/api/projects?domain=${domain}&year_created=${year}&teacher__user__username=${faculty}&title=${searchTerm}`, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log('on search',result);
          setProjects(result);
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
    console.log('params : ',params);
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    
    fetch(`http://127.0.0.1:8000/api/projects/?domain=${iniDomain}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        setProjects(result);
      })
      .catch(error => console.log('error', error));

    getTeachers();
  },[])
  return (
    <SearchContainer>
      <Grid container spacing={2}>
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
                  <MenuItem value="" disabled>
                    Domains
                  </MenuItem>
                  {Domains.map(domain => {
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
                  <MenuItem value="" disabled>
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
                  <MenuItem value="" disabled>
                    Faculty
                  </MenuItem>
                  {
                    teachers.map(teacher => {
                      return (
                        <MenuItem 
                          value={teacher.user.username}
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
            <Button variant="contained" color="primary" onClick={applyFilters} fullWidth>
              Apply Filters
            </Button>
          </Filters>
        </Grid>
        <Grid item md={9} xs={12}>
          <ProjectContent>
            <div>
              <TextField
                className={classes.searchBox}
                id="input-with-icon-textfield"
                placeholder="Search Student Name or Project Name.."
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
            <ProjectList projects={projects}/>
          </ProjectContent>
          
        </Grid>
      </Grid>
    </SearchContainer>
  )
}

export default Search
