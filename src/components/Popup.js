import styled, { keyframes } from 'styled-components'
import { Paragraph, Button2, BuyButton, Inliner, Subtitle } from '../components/Components'
import { v4 as uuidv4 } from 'uuid'
import { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const send = keyframes`
  0% {
    opacity: 0;
    left: 3px;
  }

  20% {
    opacity: 1;
  }

  80% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    left: calc(100% - 28px);
  }
`;

const Popup = ({ activeItem, colors, setIsBlured, quantity, type, user, setNotifications }) => {
  const { id, maxQuantity } = activeItem

  const [isAnimate, setIsAnimate] = useState(false)

  const [isError, setIsError] = useState(false)

  const [itemQuantity, setItemQuantity] = useState(1)

  const [rank, setRank] = useState()

  const [reduction, setReduction] = useState(0)

  const form = useRef()

  if(user && type == 'items') {
    fetch(process.env.REACT_APP_API_URL + 'shop/ranks').then(res => res.json()).then(res => {
      for(let r of res) {
        if(user.discord.roles.includes(r.discordID)) {
          if(rank) {
            if(rank.reduction < r.reduction) {
              setRank(r)
            }
          }else {
            setRank(r)
          }
        }
      }
    })
  }

  const handleReduction = (element) => {
    if(element.target.value && element.target.value != '') {
      fetch(process.env.REACT_APP_API_URL + "shop/reduction/" + element.target.value).then(data => data.json()).then(data => {
        setReduction(Number(data))
      })
    }    
  }

  const handleCancel = () => {
    setIsBlured(false)
  }

  const handleQuantity = e => {
    setItemQuantity(e.target.value)
  }

  const handleBuy = e => {
    e.preventDefault()

    setIsError(false)

    let btn = document.querySelector('.buyButton')

    let width = btn.offsetWidth;   

    let emptyFields = false
    const prevData = {
      pseudo: '',
      discord: '',
      quantity: 0,
      comment: '',
      code: '',
    }
    const fields = [].slice.call(form.current.querySelectorAll('.field'))
    fields.forEach(field => {
      if (field.value === '' || field.value > maxQuantity || field.value < 1) {
        if (field.name !== 'comment' && field.name !== 'code') emptyFields = true
      }
      prevData[field.name] = field.value
    })
    if (!emptyFields) {

      prevData['pseudo'] = user.discord.username
      prevData['discord'] = user.discord.username + "#" + user.discord.discriminator

      if(user.discord.discriminator == undefined) {
        setIsError(true)
        setTimeout(() => {
          setNotifications([{
            type: 'error',
            title: 'Impossible de charger votre profil, veuillez réessayer',
            date: new Date()
          }])
          setIsError(false)
          setIsBlured(false)
        }, 400)
        return
      }

      e.preventDefault()

      const uuid = uuidv4();

      console.log(
        `Data can be sent\nOrder number %c${uuid}`,
        'background: black; color: white; padding: 5px;'
      )

      setIsAnimate(true)
      setTimeout(() => {
        btn.children[0].style.transition = "opacity 0.3s";
        btn.children[0].style.opacity = "0";
  
        btn.style.width = width + "px";
  
        setTimeout(() => {
          btn.children[0].innerHTML = "Réussis";
          btn.style.background = colors.$green;
          btn.children[0].style.opacity = "1";
  
          setTimeout(() => {
            fetch(process.env.REACT_APP_API_URL + "shop/buy/" + type + "/" + id, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                user: {
                  username: prevData.pseudo,
                  discord: prevData.discord
                },
                command: {
                  quantity: prevData.quantity,
                  commentaire: prevData.comment,
                  uuid: uuid,
                  code: prevData.code
                }
              })
            }).then(res => res.json()).then(data => {
              window.location = `/success?data=${btoa(
                JSON.stringify(data)
              )}`
            })
          },400)
        },1400)
      },200) 
    }else {
      setIsError(true)
      setTimeout(() => {
        setIsError(false)
      }, 400)
    }
  }

  return (
    <Card isError={isError}>
      <Subtitle
        style={{ alignSelf: 'flex-start' }}
        fontSize="1.1em"
        fontWeight="600"
        color={colors.$darkPurple}>
        { activeItem.title}
      </Subtitle>
      <Paragraph fontSize="0.7em" color="gray">
          A partir de {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(activeItem.price)}
        </Paragraph>
      <br></br>
      <form ref={form}>
        {type == 'items' && (
          <Input isError={isError}>
          <Icon src={`${process.env.PUBLIC_URL}/images/cubes.svg`}></Icon>
          <input
            type="text"
            name="pseudo"
            placeholder="Pseudo en jeu"
            className="field"
            required
          />
        </Input>
        )}
        {type != 'items' && (
          <Input isError={isError}>
          <Icon src={`${process.env.PUBLIC_URL}/images/cubes.svg`}></Icon>
          <input
            type="text"
            name="pseudo"
            placeholder="Pseudo en jeu"
            className="field"
            required
          />
        </Input>
        )}
        <Input style={{ marginTop: '20px' }}>
          <Icon src={`${process.env.PUBLIC_URL}/images/user.svg`}></Icon>
          <input
            type="text"
            defaultValue={user.discord.username + "#" + user.discord.discriminator}
            name="discord"
            className="field"
            disabled
            required
            style={{cursor: 'not-allowed'}}
          />
        </Input>
        {quantity === 'true' && (
          <Input style={{ marginTop: '20px', width: '40%' }}>
            <input
              type="number"
              placeholder="Quantité"
              style={{ width: '100%' }}
              className="field"
              name="quantity"
              min="1"
              max={maxQuantity}
              defaultValue="1"
              required
              onChange={handleQuantity}
            />
          </Input>
        )}
        {quantity === 'false' && (
          <Input style={{ marginTop: '20px' }}>
            <Icon src={`${process.env.PUBLIC_URL}/images/tag.svg`}></Icon>
            <input
              type="text"
              defaultValue=""
              name="code"
              className="field"
              placeholder="Code de réduction"
              onChange={handleReduction}
            />
          </Input>
        )}
        <Paragraph
          color="black"
          fontSize="0.6em"
          style={{ marginTop: '20px', marginLeft: '10px' }}>
          Commentaires (facultatif)
        </Paragraph>
        <Input style={{ marginTop: '5px' }}>
          {(type == 'items') && 
          <textarea className="field" name="comment"></textarea>
          }
          {(type != 'items') && 
          <textarea className="field" name="comment" disabled style={{cursor: 'not-allowed'}}></textarea>
          }
        </Input>
        <Inliner style={{ marginTop: '20px', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button2 color={colors.$darkOrange} onClick={handleCancel} style={{
            opacity: isAnimate && '0',
            transition: 'opacity 0.6s',
          }}>
            Annuler
          </Button2>
          <Inliner style={{flexDirection: 'column', justifyContent: 'center', alignContent: 'center'}}>
            {(type == 'items' && rank) && 
              <Paragraph color={'grey'} style={{textDecoration: 'line-through', textAlign: 'center'}}><b>{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(activeItem.price * itemQuantity)}</b></Paragraph>
            }
            {(type == 'ranks' && reduction > 0) && 
              <Paragraph color={'grey'} style={{textDecoration: 'line-through', textAlign: 'center'}}><b>{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(activeItem.price * itemQuantity)}</b></Paragraph>
            }

            {(type == 'items') &&
              <Paragraph color={colors.$darkPurple} style={{textAlign: 'center'}}><b>{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(rank ? (activeItem.price * itemQuantity)/100*(100-rank.reduction) : (activeItem.price * itemQuantity))}</b></Paragraph>
              //<Paragraph color={colors.$darkOrange} style={{textAlign: 'center'}}><b>Les commandes sont actuellement désactivées</b></Paragraph>
            }

            {(type == 'ranks') &&
              <Paragraph color={colors.$darkPurple} style={{textAlign: 'center'}}><b>{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(reduction > 0 ? (activeItem.price * itemQuantity)/100*(100-reduction) : (activeItem.price * itemQuantity))}</b></Paragraph>
            }
            
            {(type == 'items' && rank) && 
              <Paragraph color={colors.$darkOrange} style={{textAlign: 'center', fontSize: '10px'}}><b>({rank.title})</b></Paragraph>
            }
          </Inliner>
          {type == 'items' && (
            <BuyButton
            color="white"
            onClick={e => handleBuy(e)} background={ isAnimate ? colors.$blue : colors.$darkOrange} className="buyButton">
            <span>Acheter</span>
            <SendAnimateImage src="/images/send.svg" style={{
              animationPlayState: isAnimate && 'running',
              animationDelay: '0.5s',
            }}></SendAnimateImage>
          </BuyButton>
          )}
          {type != 'items' && (
            <BuyButton
            color="white"
            onClick={e => handleBuy(e)} background={ isAnimate ? colors.$blue : colors.$darkOrange} className="buyButton">
            <span>Acheter</span>
            <SendAnimateImage src="/images/send.svg" style={{
              animationPlayState: isAnimate && 'running',
              animationDelay: '0.5s',
            }}></SendAnimateImage>
          </BuyButton>
          )}
        </Inliner>
      </form>
    </Card>
  )
}

const show = keyframes`
  from {
    opacity: 0;
    margin-top: 20px;
  }

  to {
    opacity: 1;
    margin-top: 0;
  }
`;

const shake = keyframes`
  0% {
    transform: translate(-50%, -50%);
  }

  25% {
    transform: translate(-51%, -50%);
  }

  50% {
    transform: translate(-49.5%, -50.7%);
  }
  
  75% {
    transform: translate(-50.2%, -48.7%);
  }

  100% {
    transform: translate(-50%, -50%);
  }
`;

const SendAnimateImage = styled.img`
  position: absolute;
  width: 25px;
  left: 3px;
  bottom: 0;
  top: 0;
  margin-top: auto;
  margin-bottom: auto;
  opacity: 0;
  transition: all .4s;
  animation: ${send} 1.2s ease-in-out forwards;
  animation-play-state: paused;
`

const Card = styled.div`
  border: ${props => props.isError && 'solid 1px #EE3939'};
  position: fixed;
  z-index: 1;
  width: 400px;
  background: white;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 30px;
  border-radius: 10px;

  opacity: 0;
  margin-top: 20px;

  animation: ${show} 0.3s ease-in-out forwards, ${shake} 0.4s ease-in-out infinite ${props => props.isError ? 'running' : 'paused'};

  @media (max-width: 768px) {
    width: 90%;
    min-width: 300px;
  }
`

const Icon = styled.img`
  width: 25px;
  height: 25px;
  margin-left: 10px;
  position: relative;
  padding-right: 10px;
  border-right: solid 1px #00000088;
`

const Input = styled.div`
  border: solid 1px ${props => props.isError ? '#EE3939' : 'black'};
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  align-items: center;
  transition: border .2s;

  & input {
    flex: 1;
    border: none;
    outline: none;
    padding: 10px;
  }

  & textarea {
    width: 100%;
    height: 200px;
    resize: vertical;
    border: none;
    outline: none;
    padding: 10px;
  }
`

export default Popup
