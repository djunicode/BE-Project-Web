import React, { useState } from "react";
import styled from "styled-components";
import { Grid, IconButton } from "@material-ui/core";
import DescriptionIcon from "@material-ui/icons/Description";
import ReactPaginate from 'react-paginate';
import Pagination from "./Pagination";
import ProjectPage from './ProjectPage';
import { makeStyles } from '@material-ui/core/styles';
import { SERVER_URL } from "../config";
import '../../src/card.css';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles((theme) => ({
  Container: {
    paddingLeft: '4vh',
    marginTop: '1vh',
  },
  ContainerLast: {
    paddingLeft: '4vh',
    marginTop: '1vh',
    marginBottom: '1vh'
  }
}));

const ProjectContainer = styled.div`
  padding: 8px;
  margin-top: 10px;
  margin-bottom: 10px;
`;
const ProjectCard = styled.div`
  &:hover {
    background: white;
    border: 2px dashed #1d4cd2;
    outline: none;
    cursor: pointer;
    box-shadow: none;
  }
  overflow: hidden!important;
  z-index: 1;
  position: relative!important;
  transition: background 0.3s;
  transition-timing-function: ease;
  border: 1px solid #ded1d1;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0 8px 6px -6px #999;
  margin: 20px 0px;
`;
const ProjectCardDes = styled.div`
  font-size: 14px;
  color: #578bd8;
  font-weight: 600;
`;
const ProjectCardDetail = styled.div`
  font-size: 16px;
  color: #747474;
`;

const getTeacherName = (teachers, pk) => {
  let name = "";  
  if (teachers.length > 0) {  
    name = teachers[0].user.first_name + " " + teachers[0].user.last_name;
  }
  return name;
};

function ProjectList(props) {
  const classes = useStyles();
  const matches = useMediaQuery('(min-width:768px)');

  const [projects, setprojects] = useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const projectsPerPage = 10;
  
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

  if (localStorage.getItem('Token') != null) {
    fullScr = true
  }

  React.useEffect(() => {
    setprojects(props.projects);
  }, [props.projects]);

  // Get current projects
  const indexOfLastPost = currentPage * projectsPerPage;
  const indexOfFirstPost = indexOfLastPost - projectsPerPage;
  const slicedProjects = projects.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <React.Fragment>
      <ProjectContainer>
        {slicedProjects.length ? (
          <>
            {slicedProjects.map((project) => {
              return (
                <React.Fragment>               
                <ProjectCard key={project.id}>
                  {open ? (
                    <ProjectPage 
                      project={currentProj} 
                      openFn={handleClickOpen} 
                      closeFn={handleClose} 
                      screen={fullScr} 
                    />
                  ) : null}
                    <div onClick={handleClickOpen.bind(this, project)}>
                      <Grid
                        container
                        className={classes.Container}
                      >
                        <Grid item md={3} xs={9}>
                          <ProjectCardDes>Project Name</ProjectCardDes>
                          <h5>{project.title}</h5>
                        </Grid>
                        {(localStorage.getItem('Designation') === "Teacher")? (
                        <Grid item md={3} xs={3}>
                          <IconButton
                            target="_blank"
                            variant="contained"
                            color="primary"
                            href={ SERVER_URL+`${project.report}` }
                          >
                            <DescriptionIcon />
                          </IconButton>
                        </Grid>
                        ) : (
                            <Grid item md={ 3 } xs={ 3 }>
                            </Grid>
                        )}
                        <Grid item md={3} xs={3}>
                          { (project.awards && matches) ? (
                            <h6 className="ribbon">Awarded!</h6>
                          ) : null }
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        className={classes.Container}
                      >
                        <Grid item md={11} xs={12}>
                          <ProjectCardDes>Description</ProjectCardDes>
                          <ProjectCardDetail>
                            {project.description}
                          </ProjectCardDetail>
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        className={classes.ContainerLast}
                      >
                        <Grid item md={3} xs={12}>
                          <ProjectCardDes>Domain</ProjectCardDes>
                          <ProjectCardDetail>
                            {project.domain}
                          </ProjectCardDetail>
                        </Grid>
                        <Grid item md={3} xs={12}>
                          <ProjectCardDes>Guide</ProjectCardDes>
                          <ProjectCardDetail>
                          { project.teacher.user.first_name + " " + project.teacher.user.last_name }
                          </ProjectCardDetail>
                        </Grid>
                        <Grid item md={3} xs={12}>
                          <ProjectCardDes>Year</ProjectCardDes>
                          <ProjectCardDetail>
                            {project.year_created}
                          </ProjectCardDetail>
                        </Grid>
                        <Grid item md={3} xs={12}>
                          <ProjectCardDes>Group Members</ProjectCardDes>
                          <ProjectCardDetail>
                            {[0].map((dummy) => {
                              let cbs = '';
                              project.contributors.forEach((contri) => {
                                cbs += `${contri.user.first_name},`;
                              });
                              cbs = cbs.slice(0, -1);
                              return cbs;
                            })}
                          </ProjectCardDetail>
                        </Grid>
                      </Grid>
                    </div>
                </ProjectCard>
                </React.Fragment>
              );
            })}
            <Pagination
              paginate={(pageNumber) => {
                setCurrentPage(pageNumber.selected+1)
              }}
              projectLength={projects.length}
              projectsPerPage={projectsPerPage}
            />
          </>
        ) : (
          <div>No Projects Found</div>
        )}
      </ProjectContainer>
    </React.Fragment>
  );
}

export default ProjectList;
