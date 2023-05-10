import { LeapHostSdkFactory } from '@leapdev/leap-host';
import axios, {isCancel, AxiosError} from 'axios';

const sdk = LeapHostSdkFactory.getInstance();

export function setupCounter(element) {
  let counter = 0
  const setCounter = (count) => {
    counter = count
    element.innerHTML = `count = ${counter}`
  }
  element.addEventListener('click', () => setCounter(counter + 1))
  setCounter(0)

  if (!!sdk) {
    sdk.init().then(async () => {     
      console.log('Hey, Im the matter ID: ' + sdk.leapContext.context.matterId);      

      const tokenValue = (await sdk.getRefreshedAccessToken());
      console.log("Auth Token: " + tokenValue);

      //openMatter(request: OpenMatterRequest): void;

      // //opens a matter
      // //Request example:
      // const request = {
      //   "matterId": "8c857172-571e-564c-bc5a-7805cf76825c",
      //   "appSessionId": sdk.leapContext.hostInfo.appSessionId
      // };
      
      // sdk.matter.openMatter(request); 
      
      //----------------------------------------------
      ////opens the card UI, then allows user to create from it. 
      // sdk.card.createCard().then(() => {

      //    console.log("Card created" + );         

      //});

      const cardId = (await sdk.card.createCard()).cardId;
      console.log("Card created: " + cardId);

      // //-------------------fees: Doesn't work yet
      // const createFeeEntryRequest = {
      //   "matterId": "8c857172-571e-564c-bc5a-7805cf76825c",
      //   "appSessionId": sdk.leapContext.hostInfo.appSessionId,        
        
      //   "taskCodeId": "c05c4eca-394d-45dc-97b3-3c29e4ff4329",
      //   "taxCodeId": "71e08981-c1be-4ead-88c9-eee1f5d3f32d",
      //   "quantity": 105,
      //   "amountEach": 200,
      //   "includeTax": false,
      //   "transactionDate": "05-05-2023",
      //   "billingDescription": "",
      //   "billingMode": "1",
      //   "memo": "This is my memo",
      //   "staffId": sdk.getDecodedRefreshedAccessToken().staffId
      // };      

      // console.log("Creating fee entry request"); 
      // sdk.accounting.createFeeEntry(createFeeEntryRequest);
      // console.log("Finished creating fee entry request");

      // //----------------------------invoices: Opens a new invoice window, but when I save, it doesn't finish the async call. Ask Andy
      // const invoiceRequest = {
      //   "invoiceTo": "John Naismith",
      //   "invoiceNumber": "Inv-001-SDKTest",
      //   "autoNumber": true,
      //   "transactionDate": "4-5-2023",
      //   "dueDate": "4-5-2024",
      //   "memo": "This is my memo",
      //   "status": 1, 
      //   "layoutId": ""
      // };      

      // const invoiceCreated = (await sdk.accounting.createInvoice(invoiceRequest));
      
      // if (invoiceCreated) {
      //   console.log("Invoice is created");
      // }
      // else {
      //   console.log("Invoice not created");
      // }

      ////---------------open dialog to display message (works)
      // const dialogRequest = {      
      //     "dialogType": "info",
      //     "icon": "info",
      //     "title": "Sample Info - Edited", 
      //     "confirmButtonText": "Confirm Info", 
      //     "cancelButtonText": "Cancel Info",
      //     "message": "This is my message"
      // };

      // const openDialogValue = (await sdk.system.openDialog(dialogRequest));      
      // console.log("Dialog Request Value: " + openDialogValue);

      // const openDialogValue = (await sdk.system.openDialog(dialogRequest)).valueOf.toString();      
      // console.log("Open Dialog Value: " + openDialogValue);

      ////-------------------------select card from a list (Works)
      // const cardRequest = {      
      //   "appSessionId": sdk.system.appSessionId,
      //   "close": false,          
      //   "multiSelection": false,         
      //   "searchString": "Rocket",        
      //   "filter": "People"
      // };

      // const arrayOfCards = await (sdk.card.selectCard(cardRequest));

      // console.log("Card ID: " + arrayOfCards[0].cardId);
      // console.log("Card Desc: " + arrayOfCards[0].description);
      // console.log("Card Shortname: " + arrayOfCards[0].shortName);
      // console.log("Card Type: " + arrayOfCards[0].type);


      ////-----------------call an API
      // const gateway_test = axios.create({
      //   baseURL: 'https://au-test.leap.services',
      //   timeout: 9999,s
      //   headers: {'x-api-key': 'L6MSX9QxZt4nL7dY48RdI7UR9XNEHuaj77j4KUWz'}        
      // });

      // // const response= await gateway_test.get('/api/v3/matters',{ headers: {'Authorization': `Bearer ${tokenValue}` }})
      // //   console.log(response.data);
      // //   console.log(response.status);
      // //   console.log(response.statusText)
      // //   console.log(response.headers);
      // //   console.log(response.config);

      // const response = await gateway_test.get('/api/v1/matters/' + sdk.leapContext.context.matterId, { headers: {'Authorization': `Bearer ${tokenValue}` }});
      // console.log(response.data);
      // console.log(response.status);

    });
  }

}

// import { LeapHostSdkFactory } from '@leapdev/leap-host';

// const sdk = LeapHostSdkFactory.getInstance();
// const matterIdMessage = ''; 

// if (!!sdk) {
//   sdk.init().then(async () => { 
//     console.log('Hey, Im the matterID: ' + leapContext.console.matterId);
//     matterIdMessage = sdk.leapContext.context.matterId;   
//   });
// }

// export function openMatter(element) {
//   element.addEventListener('click', function(e){
//     //element.innerHTML = `This is from the OpenMatter JS file`; 
//     element.innerHTML = 'Matter Id: ' + matterIdMessage; 
//   })    
// }
