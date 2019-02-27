import React,{ Component } from 'react';
import { Jumbotron, Button,Container,Row,Col,InputGroup,InputGroupAddon,Input } from 'reactstrap';
import "./ArtBoard.css";


export class ArtBoard extends Component {
  
  render() {
    return (
      <div> 
        <Jumbotron>
          <center>
          <div id="jumbotron-container"> 
              <h1 className="display-3">Upload in-house as well as out-house projects</h1>            
            <div>
              <p  className="lead mx-auto">
                <Button color="primary" className="rnd-btn" size="lg">In House</Button>
                <Button color="primary" className="rnd-btn1" size="lg">Out House</Button>
              </p>
            </div>
          </div>
          </center>
        </Jumbotron>
        
      <div>
      <Container>
        <Row>
          <Col>
        
            <div className="click">
                 <input className="Add-content" type="text" placeholder="Click to add files" style={{height:65,width:300}}></input>
                 <button type="submit" className="add-button" ><i class="fas fa-plus plus-logo fa-2x" aria-hidden="true" style={{height:65,width:65}}></i></button>
              </div>
             
              
          </Col>
        </Row>
      </Container>
      
        Name of the project:<br></br>
        <input type="text" name="Name of the project"></input>
        <br></br>
        Contributers name:<br></br>
        <input type="text" name="Contributers name">
        </input>
      
      
      </div>
      </div>


      
    );
  }

}
export default ArtBoard;
