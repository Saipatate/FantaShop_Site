import styled from 'styled-components'
import { Button } from '../components/Components'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../css/modal.css'

const Navbar = ({ colors, externalLinks, accessToken }) => {
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= 768 ? true : false
  )
  const [menuIsOpen, setMenuIsOpen] = useState(isMobile ? false : true)

  const [user, setUser] = useState(undefined)

  window.addEventListener('scroll', () => {
    if (window.scrollY > 0) setScrolled(true)
    else setScrolled(false)
  })

  window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) setIsMobile(true)
    else setIsMobile(false)
  })

  const handleMenu = () => {
    setMenuIsOpen(!menuIsOpen)
  }

  window.addEventListener('load', () => {
    fetch("https://api.fantashop.fr/" + 'users/getuser/' + accessToken).then((res) => res.json()).then(data => {
      setUser(data)
    })
  })

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
    <Nav background={colors.$background} scrolled={scrolled}>
      <a href="/">
        <Logo
          src={`${process.env.PUBLIC_URL}/images/logo.png`}
          alt="fantashop logo"
          scrolled={scrolled}
          color={colors.$text}
        />
      </a>
      {isMobile && (
        <Burger
          color={colors.$text}
          onClick={handleMenu}
          menuIsOpen={menuIsOpen}>
          <span></span>
        </Burger>
      )}
      <BurgerMenu
        menuIsOpen={menuIsOpen}
        isMobile={isMobile}
        background={colors.$background}>
        <MiddleNav isMobile={isMobile}>
          <NavItem>
            <a href="/#recruitment">Recrutements</a>
          </NavItem>
          <NavItem>
            <a href="/#news">News</a>
          </NavItem>
          <NavItem>
            <a href="https://fantashop.fr/counter">Counter</a>
          </NavItem>
        </MiddleNav>
        <RightNav isMobile={isMobile}>
          <Button
            href="/shop"
            backgroundColors={[colors.$lightPurple, colors.$darkPurple]}>
            Boutique
          </Button>
          <Button color={colors.$text} target="_blank" onClick={toggleModal}>
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
          {(() => {
            if(user) {
              return (
                <a href="/profile"><Profile color={colors.$darkOrange} src={"https://cdn.discordapp.com/avatars/" + user.id + "/" + user.avatar + ".png"}></Profile></a>
              )
            }else {
              return (
                <Button color={colors.$text} href={ process.env.REACT_APP_API_URL + "login" }>
                  Se connecter
                </Button>
              )
            }
          })()}
        </RightNav>
      </BurgerMenu>
    </Nav>
  )
}

const Profile = styled.img`
  position: relative;
  width: 39px;
  height: 39px;
  border-radius: 50%;
  border: 2px solid ${props => props.color};
  cursor: pointer;
`


const Nav = styled.nav`
  background: ${props => props.background};
  height: ${props => (props.scrolled ? '70px' : '100px')};
  position: fixed;
  z-index: 999;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 3%;
  transition: height 0.4s;
`

const Logo = styled.img`
  width: ${props => (props.scrolled ? '50px' : '70px')};
  filter: ${props => props.color !== '#ffffff' && 'invert(1)'};
  transition: width 0.4s, filter 0.4s;
`

const MiddleNav = styled.ul`
  display: flex;
  list-style: none;
  align-items: center;
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    align-items: center;
    grid-gap: 40px;
  }
`

const RightNav = styled.div`
  display: flex;
  grid-gap: 20px;
  align-items: center;
  @media (max-width: 768px) {
    margin-top: 50px;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    row-gap: 30px;
  }
`

const NavItem = styled.li`
  margin: 20px;
  font-size: 1.2em;
  & a {
    color: gray;
    font-weight: 500;
    text-decoration: none;
    transition: color 0.4s;

    &:hover {
      color: #ccc;
    }
  }

  @media (max-width: 768px) {
    margin: 0;
  }
`

const BurgerMenu = styled.div`
  flex-direction: ${props => (props.isMobile ? 'column' : 'row')};
  position: ${props => (props.isMobile ? 'absolute' : 'relative')};
  width: ${props => (props.isMobile ? '100%' : '70%')};
  min-width: ${props => (props.isMobile ? 'unset' : '600px')};
  top: ${props => (props.isMobile ? '100%' : '0')};
  background: ${props => props.background};
  padding: ${props => (props.isMobile && props.menuIsOpen ? '30px' : '0')};
  max-height: ${props => (props.menuIsOpen ? '450px' : '0')};
  align-items: center;
  justify-content: space-between;
  display: flex;
  left: 0;
  overflow: hidden;
  transition: max-height 0.4s, padding 0.4s;
`

const Burger = styled.div`
  width: 30px;
  height: 30px;
  position: relative;
  cursor: pointer;

  & span {
    background: ${props =>
      props.color ? (props.menuIsOpen ? 'transparent' : props.color) : 'white'};
    position: absolute;
    width: 100%;
    height: 3px;
    top: 50%;
    transform: translateY(-50%);
    transition: background 0.4s;

    &::before {
      background: ${props => (props.color ? props.color : 'white')};
      transform: ${props => props.menuIsOpen && 'rotate(45deg)'};
      margin-top: ${props => (props.menuIsOpen ? '0' : '10px')};
      content: '';
      position: absolute;
      width: 100%;
      height: 3px;
      transition: transform 0.4s, margin 0.4s;
    }

    &::after {
      background: ${props => (props.color ? props.color : 'white')};
      transform: ${props => props.menuIsOpen && 'rotate(-45deg)'};
      margin-top: ${props => (props.menuIsOpen ? '0' : '-10px')};
      content: '';
      position: absolute;
      width: 100%;
      height: 3px;
      transition: transform 0.4s, margin 0.4s;
    }
  }
`

export default Navbar
