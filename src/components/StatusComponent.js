import { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import Notification from './Notification'
import { Inliner } from './Components'

const StatusComponent = ({name, colors, url}) => {

  const [performance, setPerformance] = useState(0)
  const [ping, setPing] = useState(0)


  useEffect(() => {
    const interval = setInterval(() => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      const start = new Date()
      try {
        fetch(url, { signal: controller.signal })
        .then(res => res.json())
        .then(res => {
          const end = new Date()
          if(res != undefined) {
            setPerformance(res)
            setPing(Number(res) + Number(end - start))
          }
        }).catch(err => {
          setPing(-1)
        })
      } catch (error) {
        setPing(-1)
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <StatusBox ping={(Number(ping)+Number(performance))/2} color={colors.$backgroundLight}>
      <StatusName color={colors.$text}>{name}</StatusName>
      <Inliner style={{flexDirection: 'column'}}>
        <StatusPing ping={performance}>{performance >= 0 ? (performance + 'ms') : 'Down'}</StatusPing>
        <StatusPing ping={ping}>{ping >= 0 ? (ping + 'ms') : 'Down'}</StatusPing>
      </Inliner>
    </StatusBox>
  )
}

const StatusBox = styled.div`
  padding: 10px;
  background: ${props => props.color && props.color};
  border: 1px solid ${props => props.ping < 0 ? '#FF5A5A' : props.ping < 300 ? '#13FFB8' : props.ping < 500 ? '#F38F18' : '#FF5A5A'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all .4s;
`

const StatusName = styled.h2`
  color: ${props => props.color && props.color};
`

const StatusPing = styled.label`
  color: ${props => props.ping < 0 ? '#FF5A5A' : props.ping < 300 ? '#13FFB8' : props.ping < 500 ? '#F38F18' : '#FF5A5A'};
  transition: all .4s;
`

export default StatusComponent
