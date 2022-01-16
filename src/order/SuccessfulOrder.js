import {
  Container,
  Title,
  Button,
  Inliner,
  Subtitle,
} from '../components/Components'
import styled from 'styled-components'

const SuccessfulOrder = ({ colors, fontSizes, isMobile, accessToken }) => {

  async function handleNotification() {
    let permission = await Notification.requestPermission()
    if(permission === 'granted') {
      const registration = await navigator.serviceWorker.register('./js/sw.js')

      const vapidPublicKey = process.env.REACT_APP_PUSH_PUBLIC_KEY;
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
      
      let subscription = await registration.pushManager.getSubscription()

      if(!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey
        });
      }

      fetch(`https://api.fantashop.fr/notifications/subscribe/${accessToken}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
      })
    }
  }

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
   
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
   
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  return (
    <Container center="vertically" isMobile={isMobile}>
      <div>
        <Inliner style={{ alignItems: 'center' }}>
          <Icon
            src={`${process.env.PUBLIC_URL}/images/success.svg`}
            alt="successful order"
          />
          <Title
            color={colors.$text}
            fontSize={fontSizes.$bigText}
            fontWeight="700"
            style={{ marginLeft: '20px' }}>
            Merci,
          </Title>
        </Inliner>
        <Subtitle
          fontSize={fontSizes.$smallText}
          fontWeight="500"
          style={{ marginTop: '10px' }}>
          Votre commande a bien été prise en compte. Le suivis se passera sur discord.
        </Subtitle>
        <Subtitle
          fontSize={fontSizes.$smallText}
          fontWeight="500"
          style={{ marginTop: '10px' }}>
        </Subtitle>
        <Inliner gap="20px" style={{ marginTop: '50px' }}>
          <Button
            href="/"
            backgroundColors={[colors.$lightPurple, colors.$darkPurple]}>
            Retourner à l'accueil
          </Button>
          <Button
            href="/shop"
            color={colors.$text}>
            Retourner à la boutique
          </Button>
          { Notification.permission !== 'granted' && 
            <Button
              onClick={handleNotification}
              color={colors.$text}>
              Activer les notifications
            </Button>
          }
        </Inliner>
      </div>
    </Container>
  )
}

const Icon = styled.img`
  width: 70px;
  height: 70px;
`

export default SuccessfulOrder
