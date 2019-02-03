import React, {Component} from 'react';
import './SearchBox.css';

export default class SearchBox extends Component{
    render(){
        return(
            <>
            <div className="row justify-content-center searchbox-placement" style={{height:70,width:800}}>
              <div className="search-box">
                 <input className="search-content" type="text" placeholder="Search project or student name " style={{height:65,width:684}}></input>
                 <button type="submit" className="search-button" ><i class="fa fa-search search-logo fa-3x" aria-hidden="true" style={{height:65,width:65}}></i></button>
              </div>
            </div>
            <div style={{marginTop:80,}}></div>
            </>
        );
    }
}