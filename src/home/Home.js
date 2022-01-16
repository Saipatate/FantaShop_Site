import First from './First'
import News from './News'
import Recruitment from './Recruitment'
import "../css/cooldown.css"
import { useEffect } from 'react'

const Home = ({ colors, fontSizes, externalLinks, isMobile }) => {
  useEffect(()=>{
    const script=document.createElement("script")
    script.innerHTML=`
    const days = document.getElementById('days');
    const hours = document.getElementById('hours');
    const minutes = document.getElementById('minutes');
    const seconds = document.getElementById('seconds');

    const currentYear = new Date().getFullYear();

    const newYearTime = new Date("January 1 "+(currentYear + 1)+" 00:00:00");

    function updateCountdown(){
        const currentTime = new Date();
        const diff = newYearTime - currentTime;

        const d = Math.floor(diff / 1000 / 60 / 60 / 24);
        const h = Math.floor(diff / 1000 / 60 / 60) % 24;
        const m = Math.floor(diff / 1000 / 60) % 60;
        const s = Math.floor(diff / 1000) % 60;

        days.innerHTML = d;
        hours.innerHTML = h < 10 ? '0' + h : h;
        minutes.innerHTML = m < 10 ? '0' + m : m;
        seconds.innerHTML = s < 10 ? '0' + s : s;
    }

    setInterval(updateCountdown, 1000);
    `
    script.async=true
    document.body.appendChild(script)
  },[])
  return (
    <>
      <First
        colors={colors}
        fontSizes={fontSizes}
        externalLinks={externalLinks}
        isMobile={isMobile}
      />
      <News colors={colors} fontSizes={fontSizes} isMobile={isMobile} />
      <div className="cooldown" style={{backgroundColor:colors.$background}}><h1>Prochaine Event Dans :</h1>

        <div id="countdown" class="countdown">
          <div class="time">
            <h2 id="days" style={{color:colors.$text}}></h2>
            <p style={{color:colors.$text}}>Jours</p>
          </div>

          <div class="time">
            <h2 id="hours" style={{color:colors.$text}}></h2>
            <p style={{color:colors.$text}}>heures</p>
          </div>

          <div class="time">
            <h2 id="minutes" style={{color:colors.$text}}></h2>
            <p style={{color:colors.$text}}>Minutes</p>
          </div>

          <div class="time">
            <h2 id="seconds" style={{color:colors.$text}}></h2>
            <p style={{color:colors.$text}}>Secondes</p>
          </div>
        </div>
      </div>
      <Recruitment colors={colors} fontSizes={fontSizes} isMobile={isMobile} />
    </>
  )
}

export default Home
