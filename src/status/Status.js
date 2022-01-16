import {
  Container,
  Title,
  Button,
  Inliner,
  Subtitle,
} from '../components/Components'

import StatusComponent from '../components/StatusComponent'

import styled from 'styled-components'

const Status = ({ colors, fontSizes, isMobile, accessToken }) => {

  return (
    <Container center="vertically" isMobile={isMobile}>
      <Inliner rowGap="170px" gap="95px" style={{ marginTop: '138px', flexWrap: 'wrap', justifyContent: 'space-around', flexDirection: isMobile && 'column' }}>
        <div>
          <Inliner style={{ alignItems: 'center' }}>
            <Title
              color={colors.$text}
              fontSize={fontSizes.$bigText}
              fontWeight="700"
              underlineColors={[colors.$lightPurple, colors.$darkPurple]}
              style={{ marginLeft: '20px' }}>
              Status
            </Title>
          </Inliner>
          <Subtitle
            fontSize={fontSizes.$smallText}
            fontWeight="500"
            style={{ marginTop: '10px' }}>
            Le status de l’API.
          </Subtitle>
          <Inliner gap="20px" style={{ marginTop: '50px' }}>
            <Button
              href="/"
              backgroundColors={[colors.$lightPurple, colors.$darkPurple]}>
              Retourner à l'accueil
            </Button>
          </Inliner>
        </div>
        <div>
          <Inliner gap="20px" style={{ marginTop: '50px', flexDirection: 'column', width: '50vw' }}>
            <StatusComponent name="Shop" colors={colors} url="https://api.fantashop.fr/uptime/shop"></StatusComponent>
            <StatusComponent name="Discord" colors={colors} url="https://api.fantashop.fr/uptime/discord"></StatusComponent>
            {accessToken && 
              <StatusComponent name="User" colors={colors} url={"https://api.fantashop.fr/uptime/user/" + accessToken}></StatusComponent>
            }
          </Inliner>
        </div>
      </Inliner>
    </Container>
  )
}

export default Status
