
      import React,{ Component } from 'react';
import Jumbotron from "./Jumbotron"      
import ProjectForm from './ProjectForm'
import ProgressBar from './ProgressBar'
import "./ArtBoard.css";


export class Artboard extends Component {
  
  render() {
    return (
      <div> 

<Jumbotron />
      <div className="row">
        <div className="col" />
        <div className="col">
          <ProgressBar value="1" />
        </div>
      </div>
      <br /> <br/>
      <ProjectForm />

      </div>


      
    );
  }

}
export default Artboard;
