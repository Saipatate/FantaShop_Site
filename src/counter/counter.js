import {
  Container,
  Title,
  Subtitle,
  Button,
  Inliner,
  Grid,
} from '../components/Components'
import styled, { keyframes } from 'styled-components'
import Item from '../components/Item'
import Popup from '../components/Popup'
import Filter from '../components/Filter'
import { useState, useEffect, useRef } from 'react'
import Notification from '../components/Notification'
import "./style.css";

const Counter = ({ colors, fontSizes, accessToken, isMobile }) => {

  const [Site_members, SetSitemembers] = useState(0)
  fetch(`https://api.fantashop.fr/site/count/`)
      .then(res => res.json())
      .then(user => {
        SetSitemembers(user)
      })
  const [Discord_members, SetDiscordmembers] = useState(0)
  fetch(`https://api.fantashop.fr/discord/count/`)
      .then(res => res.json())
      .then(user => {
        SetDiscordmembers(user)
      })



  return (
    <div class="container">
      <div class="top">
        <h1 style={{backgroundColor: colors.$text}}>{Discord_members}</h1>
        <p>Membres Discord</p>
      </div>
      <span></span>
      <div class="bottom">
        <h1 style={{backgroundColor: colors.$text}}>{Site_members}</h1>
        <p>Comptes Inscrits</p>
      </div>
    </div>
  )
}

export default Counter
