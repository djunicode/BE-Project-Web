import React,{useState} from 'react'
import { CSVLink} from "react-csv";

function GenerateCSV(props) {
  const [projects, setprojects] = useState([])
  const headers = [
    { label: "Group Number", key: "group_no" },
    { label: "Project Name", key: "title" },
    { label: "Domain", key: "domain" },
    { label: "Guide", key: "guide" },
    { label: "Year", key: "year" },
    { label: "Contributors", key: "contributors"}

  ];
  React.useEffect(() => {
    setprojects(props.projects)
  },[props.projects])
  const csvData = projects.map(project => {
    let cbs = '';
    project.contributors.forEach((contri) => {
      cbs += `${contri.user.first_name} ${contri.user.last_name},`;
    });
    cbs = cbs.slice(0, -1);
    return {
      group_no: project.BE_project_id,
      title:project.title,
      domain:project.domain,
      guide:`${project.teacher.user.first_name} ${project.teacher.user.last_name}`,
      year:project.year_created,
      contributors:cbs
    }
  })
  
  return (
    <React.Fragment>
      <CSVLink 
        data={csvData}
        headers={headers}  
      >
        Download CSV
      </CSVLink>
    </React.Fragment>
  )
}

export default GenerateCSV
