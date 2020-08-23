import React,{useState} from 'react'
import styled from 'styled-components'
import { Grid, Button } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { SERVER_URL } from '../config';
import Upload from '../components/Upload';
import Pagination from './Pagination'
import Swal from 'sweetalert2';
import ProjectPage from './ProjectPage';
import ArrowBackOutlinedIcon from '@material-ui/icons/ArrowBackOutlined';

const ProjectContainer = styled.div`
  padding:8px;
  margin-top:20px;
  margin-bottom:20px;

`
const StatusButtons = styled.div`
  top: -14px;
  position: relative;
`
const ProjectCard = styled.div`
  border:1px solid #ded1d1;
  border-radius:5px;
  padding: 10px;
  box-shadow: 0 8px 6px -6px #999;
  margin: 20px 0px;
`
const ProjectCardDes = styled.div`
  font-size: 14px;
  color: #578BD8;
  font-weight:600;
`
const ProjectCardDetail = styled.div`
  font-size: 16px;
  color: #747474;
`
const Back = styled.div`
  display:flex;
  justify-content:flex-end;
`

function ProjectApproval(props) {
  const [projects, setprojects] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editProj, setEditProj] = useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const projectsPerPage = 3;

  React.useEffect(() => {
    setprojects(props.projects);
  },[props.projects]);

  // Get current projects
  const indexOfLastPost = currentPage * projectsPerPage;
  const indexOfFirstPost = indexOfLastPost - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstPost, indexOfLastPost);

  const editProject = (project) => {
    setEdit(true)
    setEditProj(project)
  }

  const [currentProj, setCurrentProj] = useState(null);
  const [open, setOpen] = React.useState(false);

  let fullScr = false

  const handleClickOpen = (project) => {
    setOpen(true);
    setCurrentProj(project)
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentProj(null);
  };

  const approveProject = (pk) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, accept it!'
    }).then((result) => {
      if (result.value) {
        const word = 'Token ';
        const token = word.concat(`${localStorage.getItem('Token')}`);
        var myHeaders = new Headers();
        myHeaders.append('Authorization', `${token}`);

        var formdata = new FormData();
        formdata.append("pk", pk);

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: formdata,
          redirect: 'follow'
        };

        fetch(`${SERVER_URL}/approve_project`, requestOptions)
          .then(response => response.json())
          .then(result => window.location.reload(false))
          .catch(error => console.log('error', error));
      }
    })

  }
  const deleteConfirm = (pk) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        rejectProject(pk);
      }
    })
  } 
  const rejectProject = (pk) => {
    const word = 'Token ';
    const token = word.concat(`${localStorage.getItem('Token')}`);
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `${token}`);
    var formdata = new FormData();
    formdata.append("pk", pk);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch(`${SERVER_URL}/delete_project`, requestOptions)
      .then(response => response.json())
      .then(result => window.location.reload(false))
      .catch(error => console.log('error', error));
  }

  
  return (
    <React.Fragment>
      {edit?<Back>
        <Button 
          variant="outlined" 
          color="primary"
          onClick={() => window.location.reload(false)} 
        >
          <ArrowBackOutlinedIcon/> My Uploads
        </Button>
        
      </Back>:<></>}
     
      {edit? <Upload editing={true} data={editProj} /> : (
        <ProjectContainer>
          {
            currentProjects.length ? <>
              {
                currentProjects.map(project => {
                  return (
                    <ProjectCard>
                      { open ? (
                        <ProjectPage
                          project={ currentProj }
                          openFn={ handleClickOpen }
                          closeFn={ handleClose }
                          screen={ fullScr }
                        />
                      ) : null }
                      <div>
                        <StatusButtons>
                          {
                            localStorage.getItem('Token') &&
                            <IconButton
                              id={ `${project.id}` }
                              aria-label="edit"
                              style={ { float: 'right' } }
                              onClick={ () => editProject(project) }
                            >
                              <EditOutlinedIcon />
                            </IconButton>
                          }
                          <IconButton
                            id={ `${project.id}` }
                            aria-label="reject"
                            style={ { float: 'right' } }
                            onClick={ () => deleteConfirm(project.id) }
                          >
                            <HighlightOffIcon />
                          </IconButton>
                          { !props.completed && (
                            <IconButton
                              style={ { float: 'right' } }
                              id={ `${project.id}` }
                              aria-label="approve"
                              onClick={ () => approveProject(project.id) }
                            >
                              <CheckCircleOutlineIcon />
                            </IconButton>
                          ) }
                        </StatusButtons>
                        <div onClick={ handleClickOpen.bind(this, project) }>
                          <ProjectCardDes>Project Name</ProjectCardDes>
                          <h5> { project.title } </h5>
                        </div>
                        <Grid spacing={1} container onClick={ handleClickOpen.bind(this, project) }>
                          <Grid item md={ 3 } xs={ 12 }>
                            <ProjectCardDes>Domain</ProjectCardDes>
                            <ProjectCardDetail> { project.domain } </ProjectCardDetail>
                          </Grid>
                          <Grid item md={ 3 } xs={ 12 } onClick={ handleClickOpen.bind(this, project) }>
                            <ProjectCardDes>Group Members</ProjectCardDes>
                            <ProjectCardDetail>
                              {
                                [0].map(dummy => {
                                  let cbs = '';
                                  project.contributors.forEach(contri => {
                                    cbs += `${contri.user.first_name},`
                                  })
                                  cbs = cbs.slice(0, -1);
                                  return cbs;
                                })
                              }
                            </ProjectCardDetail>
                          </Grid>
                          <Grid item md={ 2 } xs={ 12 } onClick={ handleClickOpen.bind(this, project) }>
                            <ProjectCardDes>Year</ProjectCardDes>
                            <ProjectCardDetail>
                              { project.year_created }
                            </ProjectCardDetail>
                          </Grid>
                          <Grid item md={2} xs={6} onClick={ handleClickOpen.bind(this, project) }>
                            <Button
                              target="_blank"
                              variant="outlined"
                              color="primary"
                              href={ `${SERVER_URL}${project.report}` }
                            >
                              Report
                            </Button>
                          </Grid>
                          <Grid item md={2} xs={6}>
                          <Button
                              target="_blank"
                              variant="outlined"
                              color="primary"
                              href={ `${SERVER_URL}${project.executable}` }
                            >
                              Executable
                            </Button>
                          </Grid>
                        </Grid>
                      </div>
                    </ProjectCard>
                  )
                })
              }
              <Pagination
                paginate={ (pageNumber) => {
                  setCurrentPage(pageNumber.selected + 1)
                } }
                projectLength={ projects.length }
                projectsPerPage={ projectsPerPage }
              />
            </> :
              <div>
                No Projects Found
        </div>
          }
        </ProjectContainer>
      )}
    </React.Fragment>
  )
}

export default ProjectApproval
