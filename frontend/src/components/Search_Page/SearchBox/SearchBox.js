import React, {Component} from 'react';
import './SearchBox.css';

export default class SearchBox extends Component{
    render(){
        return(
            <>
            <div className="row justify-content-center searchbox-placement">
              <div className="search-box">
                 <input className="search-content" type="text" placeholder="Search project/student name "></input>
                 <button type="submit" className="search-button"><i class="fa fa-search search-logo" aria-hidden="true"></i></button>
              </div>
            </div>
            <div style={{marginTop:80,}}></div>
            </>
        );
    }
}