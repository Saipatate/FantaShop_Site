import { Subtitle, Paragraph, Button2, Inliner } from './Components'
import styled from 'styled-components'

const Item = ({
  id,
  title,
  picture,
  price,
  colors,
  setIsBlured,
  setActiveItem,
  maxQuantity,
  enchantments,
  more,
  page
}) => {
  const handleBuy = () => {
    setIsBlured(true)
    setActiveItem({
      id,
      title,
      price,
      maxQuantity,
    })
  }

  const handleMore = (e) => {
    window.open(e.target.dataset['url'])
  }

  return (
    <Card>
      <CardContent>
        <Enchantments>
          {enchantments &&
            enchantments.map(enchantment => {
              return (
                <Enchantment key={enchantment} color={colors.$darkOrange}>
                  {enchantment}
                </Enchantment>
              )
            })}
        </Enchantments>
        <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>
          <Subtitle
            fontSize="1.1em"
            fontWeight="600"
            color={colors.$darkPurple}>
            {title}
          </Subtitle>
          {more && (
            <Button2
              color={colors.$darkOrange}
              style={{fontSize: '10px'}}
              onClick={handleMore}
              data-url={more}>
              En savoir plus
            </Button2>
          )}
        </div>
        <Picture src={picture} alt={title} page={page} />
      </CardContent>
      <Footer>
        <Button2
          color="white"
          background={colors.$darkOrange}
          onClick={handleBuy}>
          Acheter
        </Button2>
        <Paragraph fontSize="0.7em" color="gray">
          A partir de {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price)} Q. max :{maxQuantity}
        </Paragraph>
      </Footer>
    </Card>
  )
}

const Card = styled.div`
  background: white;
  border-radius: 5px;
  border: solid 1px #00000044;
  height: fit-content;
`

const CardContent = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`

const Picture = styled.img`
  margin-top: 80px;
  width: 100%;
  height: ${props => props.page === 'grades' && '150px'};
  object-fit: cover;
  image-rendering: pixelated;
`

const Footer = styled.footer`
  border-top: solid 1px #00000044;
  display: flex;
  margin-top: 30px;
  justify-content: space-between;
  align-items: flex-end;
  padding: 15px;
`

const Enchantments = styled.ul`
  position: absolute;
  list-style: none;
  right: 15px;
  top: 15px;
  display: flex;
  flex-direction: column;
  text-align:right;
  grid-gap: 1px;
`

const Enchantment = styled.li`
  color: gray;
  letter-spacing: 2px;
  font-weight: 700;

  &::first-letter {
    color: ${props => (props.color ? props.color : 'white')};
  }
`

export default Item
