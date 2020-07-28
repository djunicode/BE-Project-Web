import React from 'react'
import ReactPaginate from 'react-paginate';
function Pagination(props) {
    
  return (
    <div>
      <ReactPaginate
        previousLabel={'<'}
        nextLabel={'>'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={Math.ceil(props.projectLength/props.projectsPerPage)}
        marginPagesDisplayed={1}
        pageRangeDisplayed={3}
        onPageChange={props.paginate}
        containerClassName={'pagination'}
        subContainerClassName={'pages pagination'}
        pageClassName={'pageNoBox'}
        pageLinkClassName={'pageNoBoxLink'}
        previousClassName={'previousBox'}
        nextClassName={'nextBox'}
        previousLinkClassName={'previousBoxLink'}
        nextLinkClassName={'nextBoxLink'}
        activeClassName={'pageActive'}
      />
    </div>
  )
}

export default Pagination
