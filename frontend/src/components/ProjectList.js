import React,{useState} from 'react'
import styled from 'styled-components'
import { Grid } from '@material-ui/core';

const ProjectContainer = styled.div`
  padding:8px;
  margin-top:10px;
  margin-bottom:10px;

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

const getTeacherName = (teachers,pk) => {
  let name="";
  if(teachers.length > 0) {
    let teacher = teachers.filter(val => val.pk==pk);
    name = teacher[0].user.first_name +" "+teacher[0].user.last_name;
  }
  return name;
}

function ProjectList(props) {
  const [projects, setprojects] = useState([]);
  
  React.useEffect(() => {
    setprojects(props.projects);
  },[props.projects]);
  
  return (
    <ProjectContainer>
      {
        projects.length?<>
          {
            projects.map(project => {
              return (
                <ProjectCard>
                  <div>
                    <ProjectCardDes>Project Name</ProjectCardDes>
                    <h5>{project.title}</h5>
                  </div>
                  <Grid container>
                    <Grid item md={3} xs={12}>
                      <ProjectCardDes>Domain</ProjectCardDes>
                      <ProjectCardDetail> {project.domain} </ProjectCardDetail>
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <ProjectCardDes>Guide</ProjectCardDes>
                      <ProjectCardDetail> {getTeacherName(props.teachers,project.teacher)} </ProjectCardDetail>
                    </Grid>
                    <Grid item md={3} xs={12}>
                      <ProjectCardDes>Year</ProjectCardDes>
                      <ProjectCardDetail> {project.year_created} </ProjectCardDetail>
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
                  </Grid>
                </ProjectCard>
              )
            })
          }
        </>:
        <div>
          No Projects Found
        </div>
      }
    </ProjectContainer>
  )
}

export default ProjectList
