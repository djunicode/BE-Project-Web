import React, { Component } from 'react';
import SearchBox from './Search_Page/SearchBox/SearchBox';
import Filter from './Search_Page/Filter/Filter';
import SearchResults from './Search_Page/SearchResults/SearchResults';
import MutipleSelect from './Search_Page/Filter/mutipleselect';


class Search extends Component {

  render() {
    return (
      <>
      <SearchBox/>
      <div className="row">
        <div className="col-3">
        <MutipleSelect/>
        <Filter/>
        </div>
        <div className="col-6">
            <SearchResults/>
            </div>
        </div>
      
      </>
    );
  }
}

export default Search
