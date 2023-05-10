import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

import { LeapHostSdkFactory } from '@leapdev/leap-host';

////const sdk = LeapHostSdkFactory.getInstance();

//cleaner code, but not working yet

///await or async sdk.init('PJOYCRM8LHYMHXNV');
///then do the others later
//PJOYCRM8LHYMHXNV

// // if (!!sdk) {
// //   sdk.init().then(async () => {    
    
// //     //you can start calling APIs
// //     const accessToken = await sdk.getRefreshedAccessToken();
// //     const decodedToken = await sdk.getDecodedRefreshedAccessToken();
// //     console.log('Access Token: ' + accessToken);
// //     console.log('Decoded Token: ' + decodedToken.firmId + '; ' + decodedToken.userId + '; ' + decodedToken.staffId);


// //     console.log(sdk.leapContext);
// //     console.log('Matter Id: ' + sdk.leapContext.context.matterId); 
// //     console.log('App Session Id: ' + sdk.leapContext.hostInfo.appSessionId);    
// //     console.log('End');
    
// //     //console.log('Refresh Token: ' + getRefreshToken);
    
// //     //sdk.getRefreshedAccessToken()
// //     //sdk.getDecodedAccessToken()

// //   });
// // }

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      // <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>LEAP Host SDK - POC App v1.003</h1>
    <div class="card">
      <button id="counter" class="button" type="button"></button>
    </div>    
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

setupCounter(document.querySelector('#counter'))