import React, { Component } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink } from 'reactstrap';


class NavBar extends Component {

  state = {
    isOpen: false
  }

  toggle=()=> {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <>
      <style>
        {
          `.bg-dark {
              background-color: black !important;
            }
            .navbar {
              font-size: 2rem;
              font-weight: 500;
              margin: 0;
              padding: 0.6rem 0.9rem;
              }
            
            `
        }
      </style>
      <div>
        <Navbar color="dark" dark expand="md">
          <NavbarBrand href="/" className="navbar-brand">DJ ARCHIVE</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/search">Search</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/upload">Upload</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
      </>
    );
  }
}

export default NavBar;
