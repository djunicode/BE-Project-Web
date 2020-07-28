import React,{useState} from 'react'
import styled from 'styled-components'
import { Grid, Button } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { SERVER_URL } from '../config';
import Pagination from './Pagination'
import Swal from 'sweetalert2'

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

function ProjectApproval(props) {
  const [projects, setprojects] = useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [projectsPerPage] = React.useState(2);

  React.useEffect(() => {
    setprojects(props.projects);
  },[props.projects]);

  // Get current projects
  const indexOfLastPost = currentPage * projectsPerPage;
  const indexOfFirstPost = indexOfLastPost - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstPost, indexOfLastPost);

  const approveProject = (pk) => {
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

    fetch(`${SERVER_URL}/api/Approve_project`, requestOptions)
      .then(response => response.text())
      .then(result => window.location.reload(false))
      .catch(error => console.log('error', error));

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

    fetch(`${SERVER_URL}/api/Delete_Project`, requestOptions)
      .then(response => response.json())
      .then(result => window.location.reload(false))
      .catch(error => console.log('error', error));
  }
  return (
    <ProjectContainer>
      {
        currentProjects.length?<>
          {
            currentProjects.map(project => {
              return (
                <ProjectCard>
                  <StatusButtons>
                    {
                      localStorage.getItem('Token') &&
                      <IconButton 
                      id={`${project.id}`}
                      aria-label="edit"
                      style={{float:'right'}}
                    >
                      <EditOutlinedIcon/>
                    </IconButton>
                    }
                    <IconButton 
                      id={`${project.id}`}
                      aria-label="reject"
                      style={{float:'right'}}
                      onClick={() => deleteConfirm(project.id)}
                    >
                      <HighlightOffIcon/>
                    </IconButton>
                    {!props.completed && (
                      <IconButton
                      style={{float:'right'}}
                      id={`${project.id}`}
                      aria-label="approve"
                      onClick={() => approveProject(project.id)} 
                      >
                        <CheckCircleOutlineIcon/>
                      </IconButton>
                    )}
                  </StatusButtons>
                  <div>
                    <ProjectCardDes>Project Name</ProjectCardDes>
                    <h5> {project.title} </h5>
                  </div>
                  <Grid container>
                    <Grid item md={3} xs={12}>
                      <ProjectCardDes>Domain</ProjectCardDes>
                      <ProjectCardDetail> {project.domain} </ProjectCardDetail>
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <ProjectCardDes>Group Members</ProjectCardDes>
                      <ProjectCardDetail>
                        {
                          [0].map(dummy => {
                            let cbs='';
                            project.contributor.forEach(contri => {
                              cbs+=`${contri.name},`
                            })
                            cbs = cbs.slice(0,-1);
                            return cbs;
                          })
                        }
                      </ProjectCardDetail>
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <ProjectCardDes>Year</ProjectCardDes>
                      <ProjectCardDetail>
                        {project.year_created}
                      </ProjectCardDetail>
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <Button 
                      target="_blank" 
                      variant="contained" 
                      color="primary" 
                      href={project.document}
                      
                      >
                        Download
                      </Button>
                    </Grid>
                  </Grid>
                </ProjectCard>
              )
            })
          }
          <Pagination
            paginate={(pageNumber) => {
              setCurrentPage(pageNumber.selected+1)
            }}
            projectLength={projects.length}
            projectsPerPage={projectsPerPage}
          /> 
        </>:
        <div>
          No Projects Found
        </div>
      }
       
    </ProjectContainer>
  )
}

export default ProjectApproval
