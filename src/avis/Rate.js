import {
    ContainerRate,
    Title,
    Subtitle,
    Button,
    Inliner,
  } from '../components/Components'

import { useEffect, useState } from 'react'
import '../css/rate.css'

  
import styled from  'styled-components'
  
  const Rate = ({ colors, fontSizes, accessToken, isMobile }) => {


    const [user, setUser] = useState(undefined)

    const [rates, setRates] = useState(undefined)

    const [rate, setRate] = useState(undefined)

    const [blured, setBlured] = useState(false)

    const [slide, setSlide] = useState(false)

    const [slideX, setSlideX] = useState(0)

    const [rateValue, setRateValue] = useState(1)

    

    window.addEventListener('keydown', function(event){
        if(event == null || event.key == null || event == undefined || event.key == undefined) {
            return
        }
        if(event.key.toLowerCase() == 'escape') {
            setBlured(false)
        }
    })

    function handleClick() {
        setBlured(true)
    }

    function handleSliderClick(e) {
        setSlide(true)
        if(slideX == 0) {
            setSlideX(e.clientX)
        }
    }

    function handleSliderUnClick(e) {
        setSlide(false)

        
        let slider = document.querySelector('.slider')
        let sliderSelect = document.querySelector('.sliderSelect')

        let width = slider.offsetWidth;

        let diff = (e.clientX - slideX);

        if(diff < 0) {
            diff = 0;
        }
        if(diff > width - sliderSelect.offsetWidth) {
            diff = width - sliderSelect.offsetWidth;
        }

        let pourcent = diff/(width - sliderSelect.offsetWidth)*100

        if(pourcent > 100) {
            pourcent = 100;
        }

        if(pourcent < 0) {
            pourcent = 0
        }

        let state = Math.round(pourcent/25)

        const v = (state+1 <= 0 ? 1 : state+1 > 5 ? 5 : state+1)

        setRateValue(v)

        pourcent = state*25;
        
        document.querySelector('.sliderIcon').src = '/images/rate/post/' + (state+1 <= 0 ? 1 : state+1 > 5 ? 5 : state+1) + '.svg'
        slider.style.background = 'linear-gradient(90deg, #FF7070 0%, #FF5A5A ' + pourcent + '%, #C4C4C4 0%, #C4C4C4 100%)'
        sliderSelect.style.left = (width - sliderSelect.offsetWidth)/100*pourcent + 'px'
    }

    function handleMoveSlider(e) {
        if(slide) {
            let slider = document.querySelector('.slider')
            let sliderSelect = document.querySelector('.sliderSelect')

            let width = slider.offsetWidth;

            let diff = (e.clientX - slideX);

            if(diff < 0) {
                diff = 0;
            }
            if(diff > width - sliderSelect.offsetWidth) {
                diff = width - sliderSelect.offsetWidth;
            }

            let pourcent = diff/width*100

            let state = Math.round(pourcent/25)

            document.querySelector('.sliderIcon').src = '/images/rate/post/' + (state+1 <= 0 ? 1 : state+1 > 5 ? 5 : state+1) + '.svg'

            slider.style.background = 'linear-gradient(90deg, #FF7070 0%, #FF5A5A ' + pourcent + '%, #C4C4C4 0%, #C4C4C4 100%)'

            sliderSelect.style.left = diff + 'px'
        }
    }

    function handleSend(e) {
        e.target.style.display = 'none'
        const title = document.querySelector('.title')
        const content = document.querySelector('.content')

        if(title.value == '' || content.value == '') {
            e.target.style.display = 'block'
            return
        }

        if(accessToken) {
            fetch(process.env.REACT_APP_API_URL + "rate/post/" + accessToken, {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  title: title.value,
                  content: content.value,
                  rate: rateValue
                })
            }).then(res => res.json()).then(data => {
                setBlured(false)
                fetch("https://api.fantashop.fr/" + 'rate/list').then((res) => res.json()).then(data => {
                    let rs = data.reverse()
        
                    setRates(rs)
        
                    let c = 0;
        
                    for(let r of data) {
                        c+=r.rate.rate
                    }
        
                    setRate(c/data.length)
                    e.target.style.display = 'block'
                })
            }).catch(err => {
                e.target.style.display = 'block'
            })
        }
    }

    window.addEventListener('load', () => {
        setRateValue(1)
        fetch("https://api.fantashop.fr/" + 'users/getuser/' + accessToken).then((res) => res.json()).then(data => {
          setUser(data)
        })
        fetch("https://api.fantashop.fr/" + 'rate/list').then((res) => res.json()).then(data => {
            let rs = data.reverse()

            setRates(rs)

            let c = 0;

            for(let r of data) {
                c+=r.rate.rate
            }

            setRate(c/data.length)
        })
      })

    return (
      <>
        {(blured && accessToken) && (
            <Popup>
                <PopupTitle>Donne nous une note</PopupTitle>
                <SliderParent onMouseMove={handleMoveSlider} onMouseUp={handleSliderUnClick}>
                    <SliderIcon className="sliderIcon" src="/images/rate/post/1.svg"></SliderIcon>
                    <Slider className="slider">
                        <SliderSelect slide={slide} onMouseDown={handleSliderClick} onMouseUp={handleSliderUnClick} className="sliderSelect"></SliderSelect>
                        <SliderLevels>
                            <SliderLevel></SliderLevel>
                            <SliderLevel></SliderLevel>
                            <SliderLevel></SliderLevel>
                        </SliderLevels>
                    </Slider>
                </SliderParent>
                <Form>
                    <Input>
                        <input maxLength='50' required type="text" name="title" className="title" placeholder="Votre titre"></input>
                    </Input>
                    <Input style={{marginTop: '10px'}}>
                        <textarea maxLength='200' required className="content" name="content" placeholder="Exprimez-vous !"></textarea>
                    </Input>
                    <div>
                        <RateButton onClick={handleSend} style={{display: 'block', margin: '0 auto', marginTop: '10px'}}>Envoyer !</RateButton>
                    </div>
                </Form>
            </Popup>
        )}
        <ContainerRate className='container-rate' center="vertically" isMobile={isMobile} style={{justifyContent:'space-between', width: '100%', filter: blured && 'blur(10px)', transition: 'all .5s'}}>
            <div>
            <Title
                underlineColors={[colors.$lightPurple, colors.$darkPurple]}
                fontSize={fontSizes.$bigText}
                fontWeight="700"
                color={colors.$text}>
                Votre avis
            </Title>
            <Subtitle
                fontSize={fontSizes.$smallText}
                fontWeight="500"
                style={{ marginTop: '30px' }}>
                Votre avis compte pour nous !
            </Subtitle>
            <Inliner gap="20px" style={{ marginTop: '50px', flexWrap: isMobile && 'wrap', justifyContent: isMobile && 'center', flexDirection: isMobile && 'column' }}>
                <Button
                    href="/"
                    backgroundColors={[colors.$lightPurple, colors.$darkPurple]} style={{marginBottom: isMobile && '20px'}}>
                    Retourner à l'accueil
                </Button>
            </Inliner>
            </div>
            <div>
                <RateBox>
                    <RateContainer>
                        <RateHeader>
                            <RateHeaderTitle>Général</RateHeaderTitle>
                            {rate && (
                                <RateHeaderContent>
                                    <RateHeaderIcons>
                                        <RateHeaderIcon src={rate >= 1 ? "/images/rate/solid.svg" : "/images/rate/empty.svg"}></RateHeaderIcon>
                                        <RateHeaderIcon src={rate >= 2 ? "/images/rate/solid.svg" : "/images/rate/empty.svg"}></RateHeaderIcon>
                                        <RateHeaderIcon src={rate >= 3 ? "/images/rate/solid.svg" : "/images/rate/empty.svg"}></RateHeaderIcon>
                                        <RateHeaderIcon src={rate >= 4 ? "/images/rate/solid.svg" : "/images/rate/empty.svg"}></RateHeaderIcon>
                                        <RateHeaderIcon src={rate >= 5 ? "/images/rate/solid.svg" : "/images/rate/empty.svg"}></RateHeaderIcon>
                                    </RateHeaderIcons>
                                    <RateHeaderValue>{rate.toFixed(1)} ({rates.length} avis)</RateHeaderValue>
                                </RateHeaderContent>
                            )}
                        </RateHeader>

                        <RateRates>
                        {rates && rates.map((r) =>
                            
                            <RateCategories key={r.uuid}>
                                <RateCategory>
                                    <RateCategoryHeader>
                                        <RateCategoryAuthorImage src={r.user && "https://cdn.discordapp.com/avatars/" + r.user.id + "/" + r.user.avatar + ".png"}></RateCategoryAuthorImage>
                                        <RateCategoryContent>
                                            <RateCategoryContentDatas>
                                                <RateCategoryTitle>{r.rate.title}</RateCategoryTitle>
                                                <RateCategoryIcons>
                                                    <RateCategoryIcon src={r.rate.rate >= 1 ? "/images/rate/solid_purple.svg" : "/images/rate/empty_purple.svg"}></RateCategoryIcon>
                                                    <RateCategoryIcon src={r.rate.rate >= 2 ? "/images/rate/solid_purple.svg" : "/images/rate/empty_purple.svg"}></RateCategoryIcon>
                                                    <RateCategoryIcon src={r.rate.rate >= 3 ? "/images/rate/solid_purple.svg" : "/images/rate/empty_purple.svg"}></RateCategoryIcon>
                                                    <RateCategoryIcon src={r.rate.rate >= 4 ? "/images/rate/solid_purple.svg" : "/images/rate/empty_purple.svg"}></RateCategoryIcon>
                                                    <RateCategoryIcon src={r.rate.rate >= 5 ? "/images/rate/solid_purple.svg" : "/images/rate/empty_purple.svg"}></RateCategoryIcon>
                                                </RateCategoryIcons>
                                            </RateCategoryContentDatas>
                                            <RateCategoryAuthor>{r.user.username} <RateCategoryDate>(le {r.dateString})</RateCategoryDate></RateCategoryAuthor>
                                        </RateCategoryContent>
                                    </RateCategoryHeader>
                                    <RateCategoryDescription>
                                        <RateCategoryDescriptionText>{r.rate.content}</RateCategoryDescriptionText>
                                    </RateCategoryDescription>
                                    { /* <RateCategoryReadMore>Lire la suite</RateCategoryReadMore> */ }
                                </RateCategory>
                            </RateCategories>
                        )}
                        </RateRates>
                            
                        <RateButtonBox>
                            {accessToken ? (
                                <RateButton onClick={handleClick}>Mettre un avis</RateButton>
                            ) : (
                                <RateButton href={ process.env.REACT_APP_API_URL + "login" }>Se connecter</RateButton>
                            )}
                        </RateButtonBox>
                    </RateContainer>
                </RateBox>
            </div>
        </ContainerRate>
      </>
    )
  }

  const Popup = styled.div`{
    position: fixed;
    width: 45%;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background: white;
    border-radius: 15px;
    height: fit-content;
    z-index: 10;
    padding: 20px;
  }`

  const PopupTitle = styled.h1`{
    font-size: 20px;
    color: #FF7070;
    font-weight: 600;
  }`

  const SliderParent = styled.div`{
    display: flex;
    justify-content: space-between;
  }`

  const SliderIcon = styled.img`{
    padding: 20px;
    width: 100px;
  }`

  const Slider = styled.div`{
    position: relative;
    height: 10px;
    width: 100%;
    margin: 0 auto;
    margin-top: 40px;
    background: linear-gradient(90deg, #FF7070 0%, #FF5A5A 0%, #C4C4C4 0%, #C4C4C4 100%);
    border-radius: 5px;
  }`

  const SliderLevels = styled.div`{
    position: absolute;
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    left: 0;
    top: 30px;
  }`

  const SliderLevel = styled.div`{
    width: 1px;
    height: 10px;
    background: #C4C4C4;
  }`

  const SliderSelect = styled.div`{
    position: absolute;
    left: 0;
    top: -5px;
    width: 20px;
    height: 20px;
    border-radius: 30px;
    border: 3px solid white;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
    background: ${props => (!props.slide ? '#7876DF' : '#FF7070')};
    cursor: pointer;
  }`

  const Form = styled.div`{
    
  }`

  const Input = styled.div`
    border: solid 1px #E8E8E8;
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

    & input:placeholder {
        color: #E8E8E8;
    }

    & textarea {
        width: 100%;
        height: 200px;
        resize: vertical;
        border: none;
        outline: none;
        padding: 10px;
    }

    & textarea:placeholder {
        color: #E8E8E8;
    }
  }`

  const RateBox = styled.div`{
    display: flex;
    align-items: center;
    justify-content: center;
  }`

  const RateContainer = styled.div`{
    border-radius: 4px;
    position: relative;
    width: 550px;
    max-width: 90%;
    background: #313A42;
    padding: 20px 30px;

    @media (max-width: 520px) {
      width: 100%;
      padding: 0 3%;
    }
  }`

  const RateHeader = styled.div`{
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;
  }`

  const RateHeaderTitle = styled.h1`{
    color: #D0D1EA;
  }`

  const RateHeaderContent = styled.div`{
    display: flex;
    align-items: center;
  }`

  const RateHeaderIcons = styled.div`{
    display: flex;
    align-items: center;
    justify-content: center;
  }`

  const RateHeaderIcon = styled.img`{

  }`

  const RateHeaderValue = styled.p`{
    margin-left: 10px;
    color: #B1B1B1;
    font-size: 12px;
  }`

  const RateRates = styled.div`{
    overflow-y: scroll;
    max-height: 400px;
  }`

  const RateCategories = styled.div`{
    margin-top: 20px;
  }`

  const RateCategory = styled.div`{
    border-top: solid 1px #283138;
    display: block;
    align-items: center;
    padding: 8px 0px;
  }`

  const RateCategoryHeader = styled.div`{
    display: flex;
    align-items: center;
  }`

  const RateCategoryAuthorImage = styled.img`{
    width: 40px;
    border-radius: 100%;
  }`

  const RateCategoryContent = styled.div`{
    margin-left: 10px;
    width: 100%;
  }`

  const RateCategoryContentDatas = styled.div`{
    position: relative;
    display: flex;
    width: 100%;
  }`

  const RateCategoryTitle = styled.h4`{
    font-size: 15px;
    font-weight: 400;
    color: #fff;
    text-overflow: ellipsis;
    width: 90%;
    white-space: nowrap;
    overflow: hidden;
  }`

  const RateCategoryIcons = styled.div`{
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 5%;
  }`

  const RateCategoryIcon = styled.img`{
    width: 20px;
  }`

  const RateCategoryAuthor = styled.p`{
    position: relative;
    font-size: 10px;
    color: #fff;
  }`

  const RateCategoryDate = styled.span`{

  }`

  const RateCategoryDescription = styled.div`{
    font-size: 12px;
    color: #C0C0C0;
    margin-top: 10px;
  }`

  const RateCategoryDescriptionText = styled.p`{

  }`

  const RateCategoryReadMore = styled.a`{
    font-size: 10px;
    color: #7848FF;
    text-decoration: none;
  }`

  const RateButtonBox = styled.div`{
    float: right;
    margin-top: 20px;
  }`

  const RateButton = styled.a`{
    display: block;
    width: fit-content;
    background: #7848FF;
    color: #fff;
    padding: 3px 10px;
    border-radius: 3px;
    border: none;
    cursor: pointer;
    font-weight: 600;
    font-size: 18px;
    text-decoration: none;
  }`

export default Rate