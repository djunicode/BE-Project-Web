import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { dummy_text } from '../config';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import styled from 'styled-components';
import { Grid, IconButton } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import DescriptionIcon from '@material-ui/icons/Description';
import SimpleDialog from './ContriDialog';

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
  closeButton: {
    backgroundColor: '#343a40!important',
  },
  closeButtonText: {
    color: '#fff'
  }
}));

const ProjectCardDes_modal = styled.div`
  font-size: 1.2em;
  color: #578bd8;
  font-weight: 600;
`;

const ProjectCardDetail_modal = styled.div`
  font-size: 2vh;
  color: #747474;
`;

export default function ProjectPage(props) {

  const classes = useStyles();

    const [project, setProject] = React.useState(props.project);
    const [teacher, setTeacher] = React.useState(false);

    return (
      <React.Fragment>
        {console.log(props.screen)}
        <Dialog
          maxWidth={'lg'}
          open={true}
          fullScreen={props.screen}
          onClose={props.closeFn}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <AppBar className={ classes.appBar }>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={props.closeFn} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={ classes.title }>
                <h4
                  style={ {
                    textAlign: 'center',
                    fontSize: '40px',
                    fontWeight: '400',
                  } }
                >
                  { 'Project Details' }
                </h4>
            </Typography>
            </Toolbar>
          </AppBar>
          <DialogContent>
            <Grid container style={{ paddingLeft: '2vh', marginTop: '5vh' }}>
              <Grid item md={12} xs={12}>
                <ProjectCardDes_modal>Project Name</ProjectCardDes_modal>
                <h4>{project.title}</h4>
              </Grid>
            </Grid>
            <Grid
              container
              style={{
                paddingLeft: '2vh',
                marginTop: '5vh',
                marginBottom: '5vh',
              }}
            >
              <Grid item md={4} xs={12} style={{ marginTop: '20px' }}>
                <ProjectCardDes_modal>Domain</ProjectCardDes_modal>
                <ProjectCardDetail_modal>
                  {project.domain}
                </ProjectCardDetail_modal>
              </Grid>
              <Grid item md={4} xs={12} style={{ marginTop: '20px' }}>
                <ProjectCardDes_modal>Guide</ProjectCardDes_modal>
                <ProjectCardDetail_modal>{ project.teacher.user.first_name + " " + project.teacher.user.last_name}</ProjectCardDetail_modal>
              </Grid>
              <Grid item md={4} xs={12} style={{ marginTop: '20px' }}>
                <ProjectCardDes_modal>Year</ProjectCardDes_modal>
                <ProjectCardDetail_modal>
                  {project.year_created}
                </ProjectCardDetail_modal>
              </Grid>
            </Grid>
            <Grid container style={{ paddingLeft: '2vh', marginTop: '5vh' }}>
              <Grid item md={12} xs={12}>
                <ProjectCardDes_modal>Abstract</ProjectCardDes_modal>
                <ProjectCardDetail_modal>
                  {dummy_text}
                  {dummy_text}
                </ProjectCardDetail_modal>
                <h7
                  style={{
                    textAlign: 'center',
                    color: '#578bd8',
                    fontSize: '2vh',
                  }}
                >
                  {
                    'Please contact the contributor or teacher for more details...'
                  }
                </h7>
              </Grid>
            </Grid>
            <Grid
              container
              style={{
                paddingLeft: '2vh',
                marginTop: '5vh',
                marginBottom: '5vh',
              }}
            >
              <Grid item md={12} xs={12}>
                <ProjectCardDes_modal>Contributors</ProjectCardDes_modal>
                <ProjectCardDetail_modal>
                  <SimpleDialog details={project.contributors}></SimpleDialog>
                </ProjectCardDetail_modal>
              </Grid>
            </Grid>
            <Grid
              container
              style={{
                paddingLeft: '2vh',
                marginTop: '5vh',
                marginBottom: '5vh',
              }}
            >
              <Grid item md={12} xs={12}>
                <ProjectCardDes_modal>Journal Publication</ProjectCardDes_modal>
                <ProjectCardDetail_modal>
                  {project.journal}
                </ProjectCardDetail_modal>
              </Grid>
            </Grid>
            <Grid
              container
              style={{
                paddingLeft: '2vh',
                marginTop: '5vh',
                marginBottom: '5vh',
              }}
            >
              <Grid item md={12} xs={12}>
                <ProjectCardDes_modal>Winning Project</ProjectCardDes_modal>
                <ProjectCardDetail_modal>
                  {project.awards}
                </ProjectCardDetail_modal>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions className = {classes.closeButton} >
            <Button onClick={ props.closeFn } varient="outlined" className={ classes.closeButtonText } autoFocus>
              CLOSE
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
}
