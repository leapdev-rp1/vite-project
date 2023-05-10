// Import the LEAP Host SDK
import { LeapHostSdkFactory } from '@leapdev/leap-host';
// Import the Axios client - we will use this for our API calls
import axios, {isCancel, AxiosError} from 'axios';

// Define a variable for the SDK 
const sdk = LeapHostSdkFactory.getInstance();
//await sdk.init();

let btnToken = document.getElementById("btnToken");
btnToken.addEventListener("click", getToken);

//best practice: initialize the SDK once
sdk.init();

//1. get the token and current matter ID and display it - working
async function getToken(){

  console.log('Hey, Im the matter ID: ' + sdk.leapContext.context.matterId);
  const tokenValue = await sdk.getRefreshedAccessToken();
  document.getElementById("txtToken").value = tokenValue;  
}

// function getToken(){  
//   sdk.init().then(async () => {     
//     console.log('Hey, Im the matter ID: ' + sdk.leapContext.context.matterId);
//     const tokenValue = (await sdk.getRefreshedAccessToken());  
//     document.getElementById("txtToken").value = tokenValue;
//   });
// }


//2. open a matter - works
let btnOpenMatter = document.getElementById("btnOpenMatter");
btnOpenMatter.addEventListener("click", openMatter);

function openMatter(){
  
      //opens a matter
      //Request example:
       const request = {
         "matterId": "8c857172-571e-564c-bc5a-7805cf76825c",
         "appSessionId": sdk.leapContext.hostInfo.appSessionId
       };
      
      sdk.matter.openMatter(request);   
}

// function openMatter(){
//   if (!!sdk) {
//     sdk.init().then(async () => {     
//       //opens a matter
//       //Request example:
//        const request = {
//          "matterId": "8c857172-571e-564c-bc5a-7805cf76825c",
//          "appSessionId": sdk.leapContext.hostInfo.appSessionId
//        };
      
//       sdk.matter.openMatter(request); 
//     });
//   }
// }

//3. create a card - doesn't usually work but works intermittently
let btnCreateCard = document.getElementById("btnCreateCard");
btnCreateCard.addEventListener("click", createCard);

async function createCard(){  

  try 
  {
    
    const createdCard = await sdk.card.createCard();
    console.log("Card created: " + createdCard);    
  }
  catch (err){
    console.log(err);
  }
  
}

//4. open a dialog box - works
let btnOpenDialogBox = document.getElementById("btnOpenDialogBox");
btnOpenDialogBox.addEventListener("click", openDialogBox);

async function openDialogBox(){
  const dialogRequest = {      
      "dialogType": "info",
      "icon": "info",
      "title": "Sample Info - Edited", 
      "confirmButtonText": "Confirm Info", 
      "cancelButtonText": "Cancel Info",
      "message": "This is my message - A21"
  };

    const openDialogValue = await sdk.system.openDialog(dialogRequest);      
    console.log("Dialog Request Value: " + openDialogValue);
}

//5. select a card & display card ID value - works
let btnSelectCard = document.getElementById("btnSelectCard");
btnSelectCard.addEventListener("click", selectCard);

async function selectCard(){
  const cardRequest = {      
    "appSessionId": sdk.system.appSessionId,
    "close": false,          
    "multiSelection": false,         
    "searchString": "Rocket",        
    "filter": "People"
  };
  
  const arrayOfCards = await sdk.card.selectCard(cardRequest);

  console.log("Card ID: " + arrayOfCards[0].cardId);
  console.log("Card Desc: " + arrayOfCards[0].description);
  console.log("Card Shortname: " + arrayOfCards[0].shortName);
  console.log("Card Type: " + arrayOfCards[0].type);

  document.getElementById("txtSelectedCard").value = arrayOfCards[0].cardId;
   
}

//6. call an API and get a single matter - works 
let btnGetSingleMatter = document.getElementById("btnGetSingleMatter");
btnGetSingleMatter.addEventListener("click", getSingleMatter);

// Define a variable for the API Gateway baseURL we will be using for API calls
const gateway_test = axios.create({
  baseURL: 'https://au-test.leap.services',
  timeout: 9999,
  headers: {'x-api-key': 'L6MSX9QxZt4nL7dY48RdI7UR9XNEHuaj77j4KUWz'}        
});

async function getSingleMatter(){  

    const singleMatterToken = await sdk.getRefreshedAccessToken();
    const response = await (gateway_test.get('/api/v1/matters/' + sdk.leapContext.context.matterId, { headers: {'Authorization': `Bearer ${singleMatterToken}` }}));
      console.log(response.data);
      console.log(response.status);        
}

//7. call an API and get all matters - works
let btnGetAllMatters = document.getElementById("btnGetAllMatters");
btnGetAllMatters.addEventListener("click", getAllMatters);

async function getAllMatters(){  

    const allMattersToken = await sdk.getRefreshedAccessToken();
    console.log("Token: " + allMattersToken);

    const response = await (gateway_test.get('/api/v3/matters', { headers: {'Authorization': `Bearer ${allMattersToken}` }}));      
      
      if (response.status == "200" || response.status == "201"){ 

        var table = "<table border=1>";
        // add a row for name and marks
        table += `<tr>
            <th>Name</th>
            <th colspan="2">Matter Details</th>
          </tr>`;
        // now add another row to show subject
        table += `<tr>
            <th>ID</th>
            <th>Status</th>
            <th>Description</th>            
          </tr>`;

        var tr = "";

        const myArray = response.data.matterList;

        for(var i = 0; i<myArray.length; i++){

          tr += "<tr>";
            tr += `<td>${myArray[i].matterId}</td>`;
            tr += `<td>${myArray[i].matterStatus}</td>`;
            tr += `<td>${myArray[i].firstDescription + ` ` + myArray[i].customDescription}</td>`;
          tr += "</tr>"          
        }  
        
        table += tr + "</table>";

        var allMattersDiv = document.getElementById('allMattersSection');
        allMattersDiv.innerHTML += table;        
      }
      else{
        console.log("Error: API Call did not return a success call"); 
      }
}

//8. create fee entries- works, but clarify with Andy if it doesn't return any ID or async values
let btnCreateFeeEntryRequest = document.getElementById("btnCreateFeeEntryRequest");
btnCreateFeeEntryRequest.addEventListener("click", createFeeEntryRequest);

async function createFeeEntryRequest(){

  const staffIdForFeeEntry = await sdk.getDecodedRefreshedAccessToken().staffId;
  
  console.log("Staff ID: " + staffIdForFeeEntry); 

  const createFeeEntryRequest = {
    //"matterId": "8c857172-571e-564c-bc5a-7805cf76825c",
    "matterId": sdk.leapContext.context.matterId, 
    "appSessionId": sdk.leapContext.hostInfo.appSessionId,        
    
    "taskCodeId": "c05c4eca-394d-45dc-97b3-3c29e4ff4329",
    "taxCodeId": "71e08981-c1be-4ead-88c9-eee1f5d3f32d",
    "quantity": 105,
    "amountEach": 200,
    "includeTax": false,
    "transactionDate": "2023-04-29",
    "billingDescription": "",
    "billingMode": "1",
    "memo": "This is my memo - A21",
    "staffId": staffIdForFeeEntry
  };      

  try{
    console.log("Creating fee entry request"); 
    sdk.accounting.createFeeEntry(createFeeEntryRequest);
    console.log("Finished creating fee entry request");
  }
  catch (err){
    console.log(err);
  }  
}

//9. invoice - works, but check with Andy
let btnCreateInvoiceRequest = document.getElementById("btnCreateInvoiceRequest");
btnCreateInvoiceRequest.addEventListener("click", createInvoiceRequest);

async function createInvoiceRequest(){  
      const invoiceRequest = {
        "invoiceTo": "John Naismith",
        "invoiceNumber": "Inv-001-SDKTest",
        "autoNumber": true,
        "transactionDate": "2023-04-15",
        "dueDate": "2023-04-29",
        "memo": "You have to pay me now",
        "status": 1, 
        "layoutId": ""
      };      

      try {
        const invoiceCreated = await sdk.accounting.createInvoice(invoiceRequest);
        console.log("Invoice Created Value is: " + invoiceCreated);


        if (invoiceCreated) {
          console.log("Invoice is created");
        }
        else {
          console.log("Invoice not created");
        }
      }
      catch(err){
        console.log(err);
      }
}
  