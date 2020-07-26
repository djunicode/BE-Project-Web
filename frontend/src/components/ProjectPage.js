import React from 'react';
import Button from '@material-ui/core/Button';
import { dummy_text } from '../config';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import styled from 'styled-components';
import { Grid, IconButton } from '@material-ui/core';
import DescriptionIcon from '@material-ui/icons/Description';

const ProjectCardDes_modal = styled.div`
  font-size: 1.4em;
  color: #578bd8;
  font-weight: 600;
`;

const ProjectCardDetail_modal = styled.div`
  font-size: 2vh;
  color: #747474;
`;

export default function ProjectPage(props) {
    const [project, setProject] = React.useState(props.project);

    return (
      <React.Fragment>
          <Dialog
            maxWidth={'lg'}
            open={true}
            onClose={props.closeFn}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              <h4
                style={{
                  textAlign: 'center',
                  color: '#578bd8',
                  fontSize: '35px',
                  fontWeight: '600',
                }}
              >
                {'Project Details'}
              </h4>
            </DialogTitle>
            <DialogContent>
              <Grid container style={{ paddingLeft: '2vh', marginTop: '5vh' }}>
                <Grid item md={9} xs={9}>
                  <ProjectCardDes_modal>Project Name</ProjectCardDes_modal>
                  <h4>{project.title}</h4>
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
              <Grid container style={{ paddingLeft: '2vh', marginTop: '5vh' }}>
                <Grid item md={12} xs={12}>
                  <ProjectCardDes_modal>Description</ProjectCardDes_modal>
                  <ProjectCardDetail_modal>
                    {dummy_text}
                    {dummy_text}
                    {dummy_text}
                    {dummy_text}
                    {dummy_text}
                    {dummy_text}
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
                <Grid item md={3} xs={12}>
                  <ProjectCardDes_modal>Domain</ProjectCardDes_modal>
                  <ProjectCardDetail_modal>
                    {' '}
                    {project.domain}{' '}
                  </ProjectCardDetail_modal>
                </Grid>
                <Grid item md={3} xs={12}>
                  <ProjectCardDes_modal>Guide</ProjectCardDes_modal>
                  <ProjectCardDetail_modal> Teacher</ProjectCardDetail_modal>
                </Grid>
                <Grid item md={3} xs={12}>
                  <ProjectCardDes_modal>Year</ProjectCardDes_modal>
                  <ProjectCardDetail_modal>
                    {' '}
                    {project.year_created}{' '}
                  </ProjectCardDetail_modal>
                </Grid>
                <Grid item md={3} xs={12}>
                  <ProjectCardDes_modal>Group Members</ProjectCardDes_modal>
                  <ProjectCardDetail_modal>
                    {[0].map((dummy) => {
                      let cbs = '';
                      project.contributor.forEach((contri) => {
                        cbs += `${contri.name},`;
                      });
                      cbs = cbs.slice(0, -1);
                      return cbs;
                    })}
                  </ProjectCardDetail_modal>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={props.closeFn} color="primary" autoFocus>
                CLOSE
              </Button>
            </DialogActions>
          </Dialog>
      </React.Fragment>
    );
}