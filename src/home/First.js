import {
  Container,
  FadeIn,
  BigTitle,
  Subtitle,
  Button,
  Inliner,
} from '../components/Components'

import styled, {keyframes} from 'styled-components'
import { useEffect } from 'react'
import React, { useState } from "react";
import '../css/modal.css'

const First = ({ colors, fontSizes, externalLinks, isMobile }) => {

  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  if(modal) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }
  
  return (
    <Container center="vertically" isMobile={isMobile}>
      <div>
        <BigTitle
          color={colors.$text}
          underlineColors={[colors.$lightPurple, colors.$darkPurple]}
          fontSize={fontSizes.$bigText}
          fontWeight="700">FantaShop
        </BigTitle>
        <FadeIn>
        <Subtitle
          fontSize={fontSizes.$smallText}
          fontWeight="500"
          style={{ marginTop: '30px' }}>
          Le shop le plus innovant de Paladium
        </Subtitle>
        <Inliner gap="20px" style={{ marginTop: '50px', flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'initial', flexDirection: isMobile ? 'column' : 'row' }} wrap="true">
          <Button
            href="/shop"
            backgroundColors={[colors.$lightPurple, colors.$darkPurple]} style={{marginBottom: isMobile && '20px'}}>
            Boutique
          </Button>
          <Button
            href="/avis"
            backgroundColors={[colors.$lightPurple, colors.$darkPurple]} style={{marginBottom: isMobile && '20px'}}>
            Avis
          </Button>
          <Button color={colors.$text} onClick={toggleModal}>
            Nous rejoindre
            {modal && (
              <div className="modal">
                <div className="overlay"></div>
                <div className="modal-content">
                  <h2>Nous rejoindre</h2>
                  <div className="box-content">
                    <div className="box">
                      <img src={`${process.env.PUBLIC_URL}/images/fts_logo.png`} alt="fts_logo" />
                      <div className="desc">
                        <h4>FantaShop</h4>
                        <p>Discord officel du FantaShop</p>
                        <div className="btn">
                          <a href={externalLinks.discord} target="_blank">Rejoindre</a>
                        </div>
                      </div>
                    </div>
                    <div className="box">
                      <img src={`${process.env.PUBLIC_URL}/images/ftsupport.png`} alt="fts_support" />
                      <div className="desc">
                        <h4>FantaShop - Support</h4>
                        <p>Discord support/wiki du FantaShop</p>
                        <div className="btn">
                          <a href={externalLinks.discordSupport} target="_blank">Rejoindre</a>
                        </div>
                        </div>
                    </div>
                  </div>
                  <button className="close-modal">
                    Fermer
                  </button>
                </div>
              </div>
            )}
          </Button>
        </Inliner>
        </FadeIn>
      </div>
      {!isMobile && 
        <Picture src="/images/first.png"></Picture>
      }
    </Container>
  )
}

const Picture = styled.img`
  position: relative;
  width: 70%;
  z-index: -1000;
`

export default First
