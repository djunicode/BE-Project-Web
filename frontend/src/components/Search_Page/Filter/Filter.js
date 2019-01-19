import React, {Component} from 'react';
import './Filter.css';

export default class Filter extends Component{
    render(){
        return(
            <>
            <div className="col-1"></div>
             <div className="col-2">
                Filter section
                <div className="select-domain"> 
                 <div className="dropdown">
                   <button type="button" className="btn btn-secondary dropdown-toggle" data-toggle="dropdown">
                     Select Domain
                   </button>
                   <div className="dropdown-menu">
                     <a className="dropdown-item" href="/">Link 1</a>
                     <a className="dropdown-item" href="/">Link 2</a>
                     <a className="dropdown-item" href="/">Link 3</a>
                   </div>
                 </div> 
                </div>
                
                <div className="select-batch">
                 <div className="dropdown">
                   <button type="button" className="btn btn-secondary dropdown-toggle" data-toggle="dropdown">
                     Select batch
                   </button>
                   <div className="dropdown-menu">
                     <a className="dropdown-item" href="/">Link 1</a>
                     <a className="dropdown-item" href="/">Link 2</a>
                     <a className="dropdown-item" href="/">Link 3</a>
                   </div>
                 </div> 
                </div>
                
                <div className="select-faculty">
                 <div className="dropdown">
                   <button type="button" className="btn btn-secondary dropdown-toggle" data-toggle="dropdown">
                     Select Faculty
                   </button>
                   <div className="dropdown-menu">
                     <a className="dropdown-item" href="/">Link 1</a>
                     <a className="dropdown-item" href="/">Link 2</a>
                     <a className="dropdown-item" href="/">Link 3</a>
                   </div>
                 </div> 
                </div>
                <div>VIEW</div>
                 <br/><br/>
                <div>
                
                    <label className="customcheck">In-house
                      <input type="checkbox" />
                      <span className="checkmark"></span>
                    </label>
                    <label className="customcheck">Out-house
                      <input type="checkbox"/>
                      <span className="checkmark"></span>
                    </label>
                    <label className="customcheck">Both
                      <input type="checkbox"/>
                      <span className="checkmark"></span>
                    </label>
                    
             </div>
               <br/><br/>
               <button type="submit" className="btn btn-primary active">Apply Filters</button>
             </div>
       
            </>
        );
    }
}