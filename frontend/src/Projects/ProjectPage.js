import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import styled from 'styled-components';
import { Grid, IconButton } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import SimpleDialog from './ContriDialog';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    height: '72px',
    backgroundColor: '#343a40!important',
  },
  title: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  mobile: {
    marginTop: theme.spacing(3),
  },
  closeButton: {
    position:'absolute',
    right:0
  },
  paper:{
    textAlign: 'center',
    padding: theme.spacing(2),
  },
  paperMain: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  paperMainMobile: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  paperCover:{
    textAlign:'center'
  },
  content: {
    paddingTop: "40px",
    paddingLeft: "10vw",
    paddingRight: "10vw"
  },
  contentMobile: {
    paddingTop: "40px",
    paddingLeft: "5vw",
    paddingRight: "5vw"
  },
  fields: {
    paddingLeft: '6vh',
    paddingTop: '2vh'
  },
  fieldsMobile: {
    paddingLeft: '5vw',
    paddingTop: '5vw'
  }
}));

const ProjectCardDes_modal = styled.div`
  font-size: 1.2em;
  color: #578bd8;
  font-weight: 600;
`;

const ProjectCardDetail_modal = styled.div`
  @media (max-width: 768px) {
    font-size: 2vh;
  }
  font-size: 3vh;
  color: #747474;
`;

export default function ProjectPage(props) {

  const classes = useStyles();
  const matches = useMediaQuery('(min-width:768px)');

    const [project, setProject] = React.useState(props.project);
    const [teacher, setTeacher] = React.useState(false);

    return (
      <React.Fragment>
        <Dialog
          maxWidth={'lg'}
          open={true}
          fullScreen={true}
          onClose={props.closeFn}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <AppBar className={ classes.appBar }>
            <Toolbar>
              <IconButton 
                edge="start" 
                color="inherit" 
                onClick={props.closeFn} 
                aria-label="close"
                className={classes.closeButton}
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={ classes.title }>
                <h4
                  style={ {
                    textAlign: 'center',
                    textTransform:'uppercase',
                    fontWeight: '400',
                  } }
                >
                  Project Details
                </h4>
            </Typography>
            </Toolbar>
          </AppBar>
          <DialogContent className={matches? classes.content : classes.contentMobile} >
            <Paper elevation={10} className={ classes.paperMain }>
            <Grid container>
              <Grid item md={ 12 } xs={ 12 }>
                <Paper className={ classes.paper } elevation={0}>
                  {matches? (
                      <h1>{ project.title }</h1>
                  ) : (
                      <h4>{ project.title }</h4>
                  )}
                </Paper>
              </Grid>
            </Grid>
            <Grid
              container
            >
              { (project.BE_project_id != "None") ? (
                  <Grid item md={1} xs={12}></Grid>
              ) : (
                  <Grid item md={2} xs={12}></Grid>
              )}
              {(project.BE_project_id !="None")? (
                  <Grid item md={ 2 } xs={12} className={ matches ? null : classes.mobile}>
                    <Paper className={ classes.paperCover } elevation={ 0 }>
                      <ProjectCardDes_modal>Group No</ProjectCardDes_modal>
                      <ProjectCardDetail_modal>
                        { project.BE_project_id }
                      </ProjectCardDetail_modal>
                    </Paper>
                  </Grid>
              ) : (null)}
                <Grid item md={ 2 } xs={ 6 } className={ matches ? null : classes.mobile }>
                  <Paper className={ classes.paperCover } elevation={ 0 }>
                    <ProjectCardDes_modal>Domain</ProjectCardDes_modal>
                    <ProjectCardDetail_modal>
                      { project.domain }
                    </ProjectCardDetail_modal>
                  </Paper>
                </Grid>
                <Grid item md={ 2 } xs={ 6 } className={ matches ? null : classes.mobile }>
                  <Paper className={ classes.paperCover } elevation={ 0 }>
                    <ProjectCardDes_modal>Year</ProjectCardDes_modal>
                    <ProjectCardDetail_modal>
                      { project.year_created }
                    </ProjectCardDetail_modal>
                  </Paper>
              </Grid>
                <Grid item md={ 2 } xs={ 6 } className={ matches ? null : classes.mobile }>
                  <Paper className={ classes.paperCover } elevation={ 0 }>
                    <ProjectCardDes_modal>Guide</ProjectCardDes_modal>
                    <ProjectCardDetail_modal>{ project.teacher.user.first_name + " " + project.teacher.user.last_name }</ProjectCardDetail_modal>
                  </Paper>
                </Grid>
                <Grid item md={ 2 } xs={ 6 } className={ matches ? null : classes.mobile }>
                <Paper className={ classes.paperCover } elevation={ 0 }>
                    <ProjectCardDes_modal>Type</ProjectCardDes_modal>
                    <ProjectCardDetail_modal>
                      { project.is_inhouse ? 'In-House' : 'Out-House' } Project
                </ProjectCardDetail_modal>
                </Paper>
              </Grid>
            </Grid>
              <Grid
                container
                style={{
                  marginTop: '5vh',
                }}
              >
                <Grid item md={ 12 } xs={ 12 }>
                  <Paper className={ classes.paperCover } elevation={ 0 }>
                    <ProjectCardDetail_modal>
                      <SimpleDialog details={ project.contributors }></SimpleDialog>
                    </ProjectCardDetail_modal>
                  </Paper>
                </Grid>
              </Grid>
            <Grid container style={ { paddingLeft: '2vh', marginTop: '10vh' } }>
              <Grid item md={ 12 } xs={ 12 }>
                  <Paper className={ matches? classes.paperMain : classes.paperMainMobile } elevation={ 0 }>
                    <ProjectCardDes_modal>Keywords</ProjectCardDes_modal>
                    <ProjectCardDetail_modal>
                      { project.description }
                    </ProjectCardDetail_modal>
                  </Paper>
              </Grid>
            </Grid>
            <Grid container style={{ paddingLeft: '2vh', marginTop: '5vh' }}>
              <Grid item md={12} xs={12}>
                  <Paper className={ matches ? classes.paperMain : classes.paperMainMobile }  elevation={ 0 }>
                    <ProjectCardDes_modal>Abstract</ProjectCardDes_modal>
                    <ProjectCardDetail_modal>
                      { project.abstract }
                    </ProjectCardDetail_modal>
                  </Paper>
              </Grid>
            </Grid>
            { project.demo_video &&
              <Grid container style={{ marginTop: '5vh' }}>
                <Grid item xs={ 12 } md={ 12 }>
                  <Paper className={ matches ? classes.paperMain : classes.paperMainMobile } elevation={ 0 }>
                    {matches? (
                      <React.Fragment>
                        <ProjectCardDes_modal style={ { marginBottom: 10, paddingLeft: '2vh' } }>
                          Demo
                      </ProjectCardDes_modal>
                        <iframe
                          width="100%"
                          height="500"
                          style={ { marginLeft: '2vh' } }
                          src={ `https://www.youtube.com/embed/${project.demo_video.replace("https://www.youtube.com/watch?v=", "")}` }
                        >
                        </iframe>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                          <ProjectCardDes_modal>
                            Demo
                          </ProjectCardDes_modal>
                          <iframe
                            width="100%"
                            height="200"
                            src={ `https://www.youtube.com/embed/${project.demo_video.replace("https://www.youtube.com/watch?v=", "")}` }
                          >
                          </iframe>
                      </React.Fragment>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            }
              <Grid
                container
                className={ matches ? classes.fields : classes.fieldsMobile }
              >
                <Grid item md={6} sm={ 12 } className={classes.mobile}>
                  <Paper elevation={0}>
                    <ProjectCardDes_modal>Github Link</ProjectCardDes_modal>
                    { project.github_repo ? (
                      <ProjectCardDetail_modal>
                        <a href={ project.github_repo } target="_blank" style={ matches ? { color: '#747474', fontSize: "20px" } : { color: '#747474', fontSize: "18px"}}>
                          { project.github_repo }
                        </a>
                      </ProjectCardDetail_modal>
                    ) : (
                        <ProjectCardDetail_modal>
                          { "NA" }
                        </ProjectCardDetail_modal>
                      ) }
                  </Paper>
                </Grid>
                <Grid item md={ 6 } sm={ 12 } className={ classes.mobile }>
                  <Paper elevation={0}>
                    <ProjectCardDes_modal>Journal Publication</ProjectCardDes_modal>
                    {project.journal? (
                      <ProjectCardDetail_modal>
                        <a href={ project.journal } target="_blank" style={ { color: '#747474', fontSize: "20px" } }>
                          { project.journal }
                        </a>
                      </ProjectCardDetail_modal>
                    ) : (
                        <ProjectCardDetail_modal>
                          {"NA"}
                        </ProjectCardDetail_modal>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            <Grid
              container
                className={ matches ? classes.fields : classes.fieldsMobile }
            >
              {!project.is_inhouse? (
                <React.Fragment>
                    <Grid item md={ 6 } sm={ 12 } xs={12} className={ classes.mobile }>
                      <Paper elevation={ 0 }>
                        <ProjectCardDes_modal>Company</ProjectCardDes_modal>
                        { project.company ? (
                          <ProjectCardDetail_modal>
                            { project.company }
                          </ProjectCardDetail_modal>
                        ) : (
                            <ProjectCardDetail_modal>
                              { "NA" }
                            </ProjectCardDetail_modal>
                          ) }
                      </Paper>
                    </Grid>
                    <Grid item md={ 6 } sm={ 12 } xs={12} className={ classes.mobile }>
                      <Paper elevation={ 0 }>
                        <ProjectCardDes_modal>Supervisor</ProjectCardDes_modal>
                        { project.supervisor ? (
                          <ProjectCardDetail_modal>
                            { project.supervisor }
                          </ProjectCardDetail_modal>
                        ) : (
                            <ProjectCardDetail_modal>
                              { "NA" }
                            </ProjectCardDetail_modal>
                          ) }
                      </Paper>
                    </Grid>
                </React.Fragment>
              ) : null}      
            </Grid>
              <Grid
                container
                className={ matches? classes.fields: classes.fieldsMobile }
              >
                <Grid item md={ 6 } sm={ 12 }>
                  <Paper elevation={ 0 }>
                    <ProjectCardDes_modal>Awards</ProjectCardDes_modal>
                    { project.awards ? (
                      <ProjectCardDetail_modal>
                        { project.awards }
                      </ProjectCardDetail_modal>
                    ) : (
                        <ProjectCardDetail_modal>
                          { "NA" }
                        </ProjectCardDetail_modal>
                      ) }
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </DialogContent>
          
        </Dialog>
      </React.Fragment>
    );
}
