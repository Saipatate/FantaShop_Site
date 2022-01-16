import { useState } from 'react'
import styled from 'styled-components'
import { Paragraph, Inliner } from './Components'

const SwitchTheme = ({ colors, setTheme, theme }) => {

  const [click, setClick] = useState(0)

  const handleChange = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
    setClick(click+1)
    if(click == 9) {
      setTheme('obscure')
      setClick(0)
    }
  }

  return (
    <Input color={colors.$text} theme={theme}>
      <Inliner style={{ alignItems: 'center' }}>
        <Paragraph
          color={colors.$text}
          fontSize="0.6em"
          style={{ marginRight: '10px' }}>
          {theme === 'obscure' ? 'Obscure' : theme === 'dark' ? 'Dark' : 'Light'}
        </Paragraph>
        <input
          id="switch"
          type="checkbox"
          onChange={handleChange}
          checked={theme === 'light' && true}
        />
        <label htmlFor="switch" color={colors.$text}></label>
      </Inliner>
    </Input>
  )
}

const Input = styled.div`
  position: fixed;
  bottom: 20px;
  right: 60px;
  z-index: 99;

  & input[type='checkbox'] {
    height: 0;
    width: 0;
    visibility: hidden;
  }

  & label {
    background: ${props => props.color};
    width: 50px;
    height: 26px;
    display: block;
    cursor: pointer;
    border-radius: 100px;
    position: relative;
    transition: background 0.4s;
  }

  & label::after {
    background: ${props => props.color};
    background: ${props => props.theme == 'obscure' && "url('/images/darth-vader.svg') center center no-repeat"};
    content: '';
    position: absolute;
    top: 3px;
    right: 3px;
    width: 20px;
    height: 20px;
    border-radius: ${props => props.theme == 'obscure' ? '0' : '30px'};
    filter: invert(1);
    transition: right 0.3s, filter 0.4s;
  }

  & input:checked + label::after {
    right: calc(100% - 24px);
  }
`

export default SwitchTheme
