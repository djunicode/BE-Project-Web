import React from 'react'
import styled from 'styled-components'
import FavoriteIcon from '@material-ui/icons/Favorite';

const FooterContainer = styled.div`
  background:black;
  color:white;
  padding:10px;
`
const Owners = styled.div`
  display:flex;
  justify-content:center;
`
function Footer() {
  return (
    <FooterContainer>
      <Owners>
        Made with {' '} <FavoriteIcon style={{color:'red',width:20}}/> {' '}
        <a href="https://djunicode.in/">Unicode</a>
      </Owners>
        
    </FooterContainer>
  )
}

export default Footer
