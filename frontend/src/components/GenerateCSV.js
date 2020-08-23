import React from 'react'
import { CSVLink} from "react-csv";

function GenerateCSV(props) {
  const headers = [
    { label: "Project Name", key: "title" },
    { label: "Domain", key: "domain" },
    { label: "Guide", key: "guide" },
    { label: "Year", key: "year" },
    { label: "Contributors", key: "contributors"}

  ];
  const csvData = props.projects.map(project => {
    let cbs = '';
    project.contributors.forEach((contri) => {
      cbs += `${contri.user.first_name} ${contri.user.last_name},`;
    });
    cbs = cbs.slice(0, -1);
    return {
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
