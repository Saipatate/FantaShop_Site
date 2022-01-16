import Navbar from './partials/Navbar'
import Home from './home/Home'
import Shop from './shop/Shop'
import Items from './items/Items'
import Counter from './counter/counter'
import Grades from './grades/Grades'
import Login from './login/Login'
import SuccessfulOrder from './order/SuccessfulOrder'
import PageNotFound from './404/PageNotFound'
import Maintenance from './maintenance/Maintenance'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import SwitchTheme from './components/SwitchTheme'
import useLocalStorage from './hooks/useLocalStorage'
import Footer from './components/Footer'
import Profile from './profile/Profile'
import Status from './status/Status'
import NotificationsWidget from './components/NotificationsWidget'
import Rate from './avis/Rate'

const App = () => {
  const [theme, setTheme] = useLocalStorage('theme', 'dark')
  const [access_token, setAccessToken] = useLocalStorage('access_token', undefined)
  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= 768 ? true : false
  )

  const [isMaintenance, setIsMaintenance] = useState(false)

  window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) setIsMobile(true)
    else setIsMobile(false)
  })

  window.addEventListener('load', () => {
    fetch(`https://api.fantashop.fr/users/getdata/${access_token}`)
      .then(res => res.json())
      .then(u => {
        if(u.badges.includes('787236239446507520')) {
          setIsMaintenance(false)
          console.log("isMaintenance: " + isMaintenance + " [BYPASS]");
        }else {
          console.log("isMaintenance: " + isMaintenance);
        }
      })
  })

  const token = useState(
    new URLSearchParams(window.location.search).get('data') !== undefined ? atob(new URLSearchParams(window.location.search).get('data')) : undefined
  )


  const colors = {
    $text: theme === 'dark' || theme === 'obscure' ? '#ffffff' : '#04090E',
    $textDark: theme === 'obscure' ? '#000000' : theme === 'dark' ? '#04090E' : '#ffffff',
    $background: theme === 'obscure' ? '#000000' : theme === 'dark' ? '#04090E' : '#ffffff',
    $backgroundLight: theme === 'dark' ? '#0C1B29' : '#ffffff',
    $lightPurple: '#C548FF',
    $darkPurple: '#7848FF',
    $darkOrange: '#FF7070',
    $green: '#54d98c',
    $blue: '#3498db'
  }

  const fontSizes = {
    $bigText: isMobile ? '50px' : '80px',
    $mediumText: isMobile ? '25px' : '40px',
    $smallText: isMobile ? '1em' : '1.5em',
  }

  const externalLinks = {
    discord: 'https://discord.gg/wc9tvUfx4q',
    discordSupport: 'https://discord.gg/hB4JSerXhz',
    instagram: 'https://www.instagram.com/fantashop_v5/',
    twitter: 'https://twitter.com/FantashopP',
  }

  useEffect(() => {
    document.body.style.background = colors.$background
  }, [colors.$background])

  return (
    <div style={{overflowX: 'hidden'}}>
      <SwitchTheme colors={colors} setTheme={setTheme} theme={theme} />
      <Navbar colors={colors} externalLinks={externalLinks} accessToken={access_token} />
      <Router base={process.env.PUBLIC_URL}>
        <Switch>
          {isMaintenance  && (
            <Route>
              <Maintenance
                colors={colors}
                fontSizes={fontSizes}
                externalLinks={externalLinks}
              />
            </Route>
          )}
          <Route path="/" exact>
            <Home
              colors={colors}
              fontSizes={fontSizes}
              externalLinks={externalLinks}
              isMobile={isMobile}
            />
          </Route>
          <Route path="/shop" exact>
            <Shop colors={colors} fontSizes={fontSizes} accessToken={access_token} isMobile={isMobile} />
          </Route>
          <Route path="/items" exact>
            <Items colors={colors} fontSizes={fontSizes} accessToken={access_token} isMobile={isMobile} />
          </Route>
          <Route path="/grades" exact>
            <Grades colors={colors} fontSizes={fontSizes} accessToken={access_token} isMobile={isMobile} />
          </Route>
          <Route path="/success" exact>
            <SuccessfulOrder colors={colors} fontSizes={fontSizes} isMobile={isMobile} accessToken={access_token} />
          </Route>
          <Route path="/login" exact>
            <Login colors={colors} fontSizes={fontSizes} setAccessToken={setAccessToken} token={token} isMobile={isMobile}/>
          </Route>
          <Route path="/profile" exact>
            <Profile colors={colors} fontSizes={fontSizes} accessToken={access_token} isMobile={isMobile} />
          </Route>
          <Route path="/status" exact>
            <Status colors={colors} fontSizes={fontSizes} accessToken={access_token} isMobile={isMobile} />
          </Route>
          <Route path="/avis" exact>
            <Rate colors={colors} fontSizes={fontSizes} accessToken={access_token} isMobile={isMobile} />
          </Route>
          <Route path="/counter" exact>
            <Counter colors={colors} fontSizes={fontSizes} accessToken={access_token} isMobile={isMobile} />
          </Route>
          <Route>
            <PageNotFound colors={colors} fontSizes={fontSizes} isMobile={isMobile} />
          </Route>
        </Switch>
      </Router>
      <NotificationsWidget accessToken={access_token}></NotificationsWidget>
      <Footer colors={colors} fontSizes={fontSizes} />
    </div>
  )
}

export default App
