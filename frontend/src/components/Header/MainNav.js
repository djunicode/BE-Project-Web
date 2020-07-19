import React from 'react'
import {Navbar,Nav,Button} from 'react-bootstrap'

function MainNav() {
    return (
        <React.Fragment>
            <Navbar sticky="top" variant="dark" bg="dark" expand="lg" >
                <Navbar.Brand href="/" >DJ ARCHIVE</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav" >
                    <Nav className="ml-auto mr-auto">
                        <Nav.Link className="navLink" href={`/search`}><div className="linksOnSmall">Browse</div></Nav.Link>
                        <Nav.Link className="navLink" href="/upload"><div className="linksOnSmall">Upload</div></Nav.Link>
                    </Nav>
                    <Nav className="ml-auto" style={{display:'contents'}}>
                        <Nav.Link href="/login" className="BottomButton" >
                            <Button  variant="primary">Log in</Button>{' '}
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </React.Fragment>
    )
}

export default MainNav