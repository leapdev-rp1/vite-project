import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

import { LeapHostSdkFactory } from '@leapdev/leap-host';

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
    <!-- <img src="${viteLogo}" class="logo" alt="Vite logo" /> -->
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
    <!-- <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" /> --> 
    </a>
    <h1 >LEAP Host SDK - POC App v1.004</h1>
    <div class="card">
      <button id="counter" class="button" type="button"></button>
    </div>
    <!--
      <p class="read-the-docs">
        Click on the Vite logo to learn more
      </p>
    -->
  </div>`

setupCounter(document.querySelector('#counter'));