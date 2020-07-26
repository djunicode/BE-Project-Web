import React, { useState } from "react";
import styled from "styled-components";
import { Grid, IconButton } from "@material-ui/core";
import DescriptionIcon from "@material-ui/icons/Description";
import ProjectPage from './ProjectPage';
import { makeStyles } from '@material-ui/core/styles';

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
    let teacher = teachers.filter((val) => val.pk == pk);
    name = teacher[0].user.first_name + " " + teacher[0].user.last_name;
  }
  return name;
};

function ProjectList(props) {
  const classes = useStyles();

  const [projects, setprojects] = useState([]);
  const [currentProj, setCurrentProj] = useState(null);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (project) => {
    setOpen(true);
    setCurrentProj(project)
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentProj(null);
  };

  React.useEffect(() => {
    setprojects(props.projects);
  }, [props.projects]);

  return (
    <React.Fragment>
      <ProjectContainer>
        {projects.length ? (
          <>
            {projects.map((project) => {
              return (
                <ProjectCard key={project.id}>
                  {open ? (
                    <ProjectPage project={currentProj} openFn={handleClickOpen} closeFn={handleClose} />
                  ) : null}
                    <div onClick={handleClickOpen.bind(this, project)}>
                      <Grid
                        container
                        className={classes.Container}
                      >
                        <Grid item md={9} xs={9}>
                          <ProjectCardDes>Project Name</ProjectCardDes>
                          <h5>{project.title}</h5>
                        </Grid>
                        <Grid item md={3} xs={3}>
                          <IconButton
                            target="_blank"
                            variant="contained"
                            color="primary"
                            href={project.document}
                          >
                            <DescriptionIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        className={classes.Container}
                      >
                        <Grid item md={12} xs={12}>
                          <ProjectCardDes>Description</ProjectCardDes>
                          <ProjectCardDetail>
                            {' '}
                            {project.description}{' '}
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
                            {' '}
                            {project.domain}{' '}
                          </ProjectCardDetail>
                        </Grid>
                        <Grid item md={3} xs={12}>
                          <ProjectCardDes>Guide</ProjectCardDes>
                          <ProjectCardDetail>
                            {' '}
                            {getTeacherName(
                              props.teachers,
                              project.teacher
                            )}{' '}
                          </ProjectCardDetail>
                        </Grid>
                        <Grid item md={3} xs={12}>
                          <ProjectCardDes>Year</ProjectCardDes>
                          <ProjectCardDetail>
                            {' '}
                            {project.year_created}{' '}
                          </ProjectCardDetail>
                        </Grid>
                        <Grid item md={3} xs={12}>
                          <ProjectCardDes>Group Members</ProjectCardDes>
                          <ProjectCardDetail>
                            {[0].map((dummy) => {
                              let cbs = '';
                              project.contributor.forEach((contri) => {
                                cbs += `${contri.name},`;
                              });
                              cbs = cbs.slice(0, -1);
                              return cbs;
                            })}
                          </ProjectCardDetail>
                        </Grid>
                      </Grid>
                    </div>
                </ProjectCard>
              );
            })}
          </>
        ) : (
          <div>No Projects Found</div>
        )}
      </ProjectContainer>
    </React.Fragment>
  );
}

export default ProjectList;
