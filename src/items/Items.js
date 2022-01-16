import {
  Container,
  Title,
  Subtitle,
  Button,
  Inliner,
  Grid,
} from '../components/Components'
import styled, {keyframes} from 'styled-components'
import Item from '../components/Item'
import Popup from '../components/Popup'
import Filter from '../components/Filter'
import { useState, useEffect, useRef } from 'react'
import Notification from '../components/Notification'

const levenshtein = require('fast-levenshtein');

const Items = ({ colors, fontSizes, accessToken, isMobile }) => {
  const [items, setItems] = useState([])
  const [user, setUser] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [isBlured, setIsBlured] = useState(false)
  const [activeItem, setActiveItem] = useState()
  const [filterIsOpen, setFilterIsOpen] = useState(false)
  const [maxItemPrice, setMaxItemPrice] = useState(0)
  const [currentMaxPrice, setCurrentMaxPrice] = useState(0)

  const [notifications, setNotifications] = useState()

  const filter = useRef()
  const blur = 10

  
  const handleSearch = () => {
    if(!isBlured) {
      setFilteredItems(
        items.filter(
          item => 
            (item.aliases
              .toLowerCase()
              .includes(filter.current.value.toLowerCase()) &&
              parseFloat(item.price) * 1000 >= currentMaxPrice) ||
            (item.title
              .toLowerCase()
              .includes(filter.current.value.toLowerCase()) &&
              parseFloat(item.price) * 1000 >= currentMaxPrice)
          
        )
      )
    }
  }

  const handleFilter = () => {
    if(!isBlured) {
      setFilterIsOpen(!filterIsOpen)
    }
  }

  const focusPage = (e) => {
    if(e.target.tagName.toLowerCase() !== 'button') {
      setIsBlured(false)
    }
  }

  useEffect(() => {
    fetch(`https://api.fantashop.fr/shop/items`)
      .then(res => res.json())
      .then(items => {
        setItems(items)
        setFilteredItems(items)
      })

    fetch(`https://api.fantashop.fr/users/getdata/` + accessToken)
      .then(res => res.json())
      .then(user => {
        setUser(user)
      })
    
  }, [])

  useEffect(() => {}, [currentMaxPrice])


  window.addEventListener('load', () => {
    if(!accessToken) {
      window.location = "/shop"
    }
  })

  window.addEventListener('keydown', function(event){
    if(event == null || event.key == null || event == undefined || event.key == undefined) {
      return
    }
		if(event.key.toLowerCase() == 'escape') {
      setIsBlured(false)
      setFilterIsOpen(false)
    }
  })

  return (
    <>
      <Widget style={notifications && {animationPlayState: 'running'}}>
      {notifications && 
        notifications.length > 0 && 
        <Notification type={notifications[0].type} title={notifications[0].title} date={notifications[0].date}></Notification> 
      }
    </Widget>
      {isBlured && (
        <Popup
          activeItem={activeItem}
          setIsBlured={setIsBlured}
          colors={colors}
          quantity="true"
          type="items"
          user={user}
          setNotifications={setNotifications}
        />
      )}

      <Container
        center="vertically"
        isMobile={isMobile}
        style={{
          filter: isBlured && `blur(${blur}px)`,
          opacity: isBlured ? 0.3 : 1,
          transition: 'filter 0.4s',
        }} onClick={focusPage}>
        <div>
          <Title
            underlineColors={[colors.$lightPurple, colors.$darkPurple]}
            fontSize={fontSizes.$bigText}
            fontWeight="700"
            color={colors.$text}>
            Items
          </Title>
          <Subtitle
            fontSize={fontSizes.$smallText}
            fontWeight="500"
            style={{ marginTop: '30px' }}>
            Acheter des items parmis un large catalogue d’items
          </Subtitle>
          <Inliner gap="20px" style={{ marginTop: '50px', flexWrap: isMobile && 'wrap', justifyContent: isMobile && 'center' }} wrap="true">
            <Search color={colors.$darkPurple} textColor={colors.$text}>
              <input
                ref={filter}
                type="text"
                placeholder="Rechercher un item"
                onInput={handleSearch}
              />
            </Search>
            <Button color={colors.$text} onClick={handleFilter}>
              Filtrer
            </Button>
            {filterIsOpen && (
              <Filter
                maxItemPrice={maxItemPrice}
                colors={colors}
                setCurrentMaxPrice={setCurrentMaxPrice}
                currentMaxPrice={currentMaxPrice}
                handleSearch={handleSearch}
                isMobile={isMobile}
              />
            )}
          </Inliner>
        </div>
      </Container>
      <Grid
        columns="4"
        gap="40px"
        style={{
          filter: isBlured && `blur(${blur}px)`,
          opacity: isBlured ? 0.3 : 1,
          transition: 'filter 0.4s',
        }} onClick={focusPage}>
        {filteredItems.length === 0 && (
          <Subtitle fontSize={fontSizes.$smallText} fontWeight="500">
            Désolé, rien n'a été trouvé
          </Subtitle>
        )}
        {filteredItems.map(item => {
          parseFloat(item.price) * 1000 > maxItemPrice &&
            setMaxItemPrice(parseFloat(item.price) * 1000)
          return (
            <Item
              key={item.title + Math.random()}
              id={item.id}
              title={item.title}
              picture={`${process.env.PUBLIC_URL}${item.picture}`}
              price={item.price}
              setIsBlured={setIsBlured}
              colors={colors}
              enchantments={item.enchantments}
              maxQuantity={item.maxQuantity}
              setActiveItem={setActiveItem}
              page="items"
            />
          )
        })}
      </Grid>
    </>
  )
}

const Search = styled.div`
  min-width: 250px;
  width: 80%;
  & input {
    border: solid 1px ${props => (props.color ? props.color : 'white')};
    color: ${props => (props.textColor ? props.textColor : 'white')};
    background: transparent;
    width: 100%;
    padding: 11px 15px;
    outline: none;
    border-radius: 10px;
    transition: color 0.4s;
  }
`

const WidgetShow = keyframes`
  0% {
    opacity: 0;
    right: -100%;
  }

  30% {
    opacity: 1;
    right: 20px;
  }

  70% {
    opacity: 1;
    right: 20px;
  }

  100% {
    opacity: 0;
    right: -100%;
  }
`;

const WidgetOut = keyframes`
  from {
    opacity: 1;
    right: 20px;
  }

  to {
    opacity: 0;
    right: -100%;
  }
`;

const Widget = styled.div`

  position: fixed;
  opacity: 0;
  bottom: 20px;
  right: -150%;
  z-index: 999;

  animation: ${WidgetShow} 5s ease-in-out forwards paused;

`

export default Items
