import React, {Component} from 'react';
import './Filter.css';

export default class Filter extends Component{
    render(){
        return(
            <>
            
             <div className="col-2"  style={{height:530,width:270 ,margin:55,font:15 }}>
                FILTER BY
                <div className="select-domain" style={{height:50,width:245}}> 
                 <div className="dropdown">
                   <button type="button" className="btn btn-secondary dropdown-toggle" data-toggle="dropdown" style={{height:50,width:245}}>
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
                   <button type="button" className="btn btn-secondary dropdown-toggle" data-toggle="dropdown" style={{height:50,width:245}}>
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
                   <button type="button" className="btn btn-secondary dropdown-toggle" data-toggle="dropdown" style={{height:50,width:245}}>
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
                
                    <label className="customcheck">In-house Projects
                      <input type="checkbox" />
                      <span className="checkmark"></span>
                    </label>
                    <label className="customcheck">Out-house Projects
                      <input type="checkbox"/>
                      <span className="checkmark"></span>
                    </label>
                    <label className="customcheck">Both
                      <input type="checkbox"/>
                      <span className="checkmark"></span>
                    </label>
                    
             </div>
               <br/><br/>
               <button type="submit" className="btn btn-primary active"style={{height:50, width:250, fontSize:15}}>Apply Filters</button>
             </div>
       
            </>
        );
    }
}