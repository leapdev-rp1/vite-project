// Import the LEAP Host SDK
import { LeapHostSdkFactory } from '@leapdev/leap-host';
// Import the Axios client - we will use this for our API calls
import axios, {isCancel, AxiosError} from 'axios';

// Define a variable for the SDK 
const sdk = LeapHostSdkFactory.getInstance();
//best practice: initialize the SDK once, in a central init code page of whatever framework they're using and then use the SDK all throughout their app
///TODO: put the client ID in the init function & mention backwards compatibility
sdk.init();

//------------helper functions: start -----
function getCurrentDateTime(){
  var currentdate = new Date();

  return currentdate.getDate() + "/"
  + (currentdate.getMonth()+1)  + "/" 
  + currentdate.getFullYear() + " @ "  
  + currentdate.getHours() + ":"  
  + currentdate.getMinutes() + ":" 
  + currentdate.getSeconds();
}

function getRandom(max) {
  'use strict';
  return Math.random() * max;
}

function generateSampleGUID(){
  'use strict';
  var id = '', i;

  for (i = 0; i < 36; i++) {
      if (i === 14) {
          id += '4';
      } else if (i === 19) {
          id += '89ab'.charAt(getRandom(4));
      } else if (i === 8 || i === 13 || i === 18 || i === 23) {
          id += '-';
      } else {
          id += '0123456789abcdef'.charAt(getRandom(16));
      }
  }
  return id;
}
//------------helper functions: end -----

//1. get the token and current matter ID and display it - working
let btnToken = document.getElementById("btnToken");
btnToken.addEventListener("click", getToken);

async function getToken(){

  console.log('Hey, Im the matter ID: ' + sdk.leapContext.context.matterId);
  const tokenValue = await sdk.getRefreshedAccessToken(); ////TODO: add comment details regarding TTL 
  ////document.getElementById("txtToken").value = tokenValue;  

  var divToken = document.getElementById('divToken');
  divToken.innerHTML = tokenValue;
}

//2. open a matter - works
let btnOpenMatter = document.getElementById("btnOpenMatter");
btnOpenMatter.addEventListener("click", openMatter);

function openMatter(){
  
      //opens a matter
      //Request example:
       const request = {
         "matterId": "8c857172-571e-564c-bc5a-7805cf76825c", ////generate/automate
         "appSessionId": sdk.leapContext.hostInfo.appSessionId
       };
      
      sdk.matter.openMatter(request);
}

//3. create a card - doesn't usually work but works intermittently
let btnCreateCard = document.getElementById("btnCreateCard");
btnCreateCard.addEventListener("click", createCard);

async function createCard(){  

  try 
  {    
    const createdCard = await sdk.card.createCard();
    
    var divCreatedCard = document.getElementById('divCreatedCard');
    divCreatedCard.innerHTML = "Card ID Created: " + createdCard.cardId;

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
      "message": "This is my message - " + getCurrentDateTime().toString()
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
    "searchString": "Rocket", ////generate/automate
    "filter": "People" ////generate/automate
  };
  
  const arrayOfCards = await sdk.card.selectCard(cardRequest);

  console.log("Card ID: " + arrayOfCards[0].cardId);
  console.log("Card Desc: " + arrayOfCards[0].description);
  console.log("Card Shortname: " + arrayOfCards[0].shortName);
  console.log("Card Type: " + arrayOfCards[0].type);

  var divSelectedCard = document.getElementById('divSelectedCard');
  divSelectedCard.innerHTML = arrayOfCards[0].cardId;
   
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
      
      if (response.status == "200" || response.status == "201"){ 

        const myObj = response.data;
        
         var singleMatterDiv = document.getElementById('singleMatterSection');
         singleMatterDiv.innerHTML 
           = "The matter details for matter ID " + myObj.matterId + " are: " +
             " Description = " + myObj.description.firstLong + 
             " State = " + myObj.state;
      }
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
            <th colspan="2">Matter Details - `+ getCurrentDateTime().toString() +`</th>
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
        allMattersDiv.innerHTML = table;        
      }
      else{
        console.log("Error: API Call did not return a success call"); 
      }
}

//8. create fee entries- works, but clarify with Andy if it doesn't return any ID or async values
let btnCreateFeeEntryRequest = document.getElementById("btnCreateFeeEntryRequest");
btnCreateFeeEntryRequest.addEventListener("click", createFeeEntryRequest);

async function createFeeEntryRequest(){

  const staffIdForFeeEntry = await sdk.getDecodedRefreshedAccessToken().staffId; ////TODO: add comment, add page to view details 
  
  console.log("Staff ID: " + staffIdForFeeEntry); 

  const createFeeEntryRequest = {
    //"matterId": "8c857172-571e-564c-bc5a-7805cf76825c",
    "matterId": sdk.leapContext.context.matterId, 
    "appSessionId": sdk.leapContext.hostInfo.appSessionId,        
    
    "taskCodeId": "c05c4eca-394d-45dc-97b3-3c29e4ff4329", ///needs to have valid task code ID
    "taxCodeId": "71e08981-c1be-4ead-88c9-eee1f5d3f32d", ///needs to have valid tax code ID
    "quantity": 105,
    "amountEach": 200,
    "includeTax": false,
    "transactionDate": "2023-04-29",
    "billingDescription": "",
    "billingMode": "1",
    "memo": "This is my memo - " + getCurrentDateTime().toString(),
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

//9. invoice - works
let btnCreateInvoiceRequest = document.getElementById("btnCreateInvoiceRequest");
btnCreateInvoiceRequest.addEventListener("click", createInvoiceRequest);

async function createInvoiceRequest(){  
      const invoiceRequest = {
        "invoiceTo": "John Naismith",
        "invoiceNumber": "Inv-001-SDKTest",
        "autoNumber": true,
        "transactionDate": "2023-04-15",
        "dueDate": "2023-04-29",
        "memo": "You have to pay me now - " + getCurrentDateTime().toString(),
        "status": 1, 
        "layoutId": ""
      };      

      try {
        const invoiceCreated = await sdk.accounting.createInvoice(invoiceRequest);
        
        var invoiceRequestDiv = document.getElementById('invoiceRequestDiv');
        invoiceRequestDiv.innerHTML = "Invoice Created: " + invoiceCreated + "/" + invoiceCreated.valueOf.toString();

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

//10. POST api/v1/fees - works!
let btnPostFees = document.getElementById("btnPostFees");
btnPostFees.addEventListener("click", postFees);

async function postFees(){  

  const postFeesToken = await sdk.getRefreshedAccessToken();
  console.log("Token: " + postFeesToken);

  ////var feeId = "9231313C-4BD0-D8D4-B5FB-883D29B1E349"; ////generate/automate
  var feeId = generateSampleGUID();  

  const response2= await gateway_test.post('/api/v2/fees',
      {
        "TransactionDate": "2023-05-10T16:31:00Z", ////generate/automate
        "BillingDescription": "Telephone call with Ms C J Mathie no 2: " + getCurrentDateTime().toString(),
        "Memo": "log",
        "RateId": "No",
        "RatePerHour": "",
        "incTax": "",
        "totalExTax": "0",
        "totalTax": "0",
        "totalIncTax": "0",
        "SecondsElapsed": "86",
        "SecondsPerUnit": 360,
        "FeeUnits": "1",
        "FeeHoursQuantity": "0.1",
        "Timed": "1",
        "FeeId": feeId,
        "MatterId": sdk.leapContext.context.matterId,
        "TaskCodeId": "8af7ec3d-6590-4700-9b1b-0ee989454276", ////generate/automate
        "TaxCodeId": "19c27283-5294-4cf3-aa7a-394c5edc7643", ////generate/automate
        "WorkDoneByStaffId": "c9970a0b-76dc-429f-a121-ea86ecff37e3", ////generate/automate
        "WarningAcknowledgments": [1001,1002]
      
    },
      {
        headers: {
          'Authorization': `Bearer ${postFeesToken}` 
        }
      })
      console.log(response2.status);
      console.log(response2.data);

      if (response2.status == "200" || response2.status == "201"){ 

        const myObj = response2.data;
        
          var postFeesDiv = document.getElementById('postFeesSection');
          postFeesDiv.innerHTML 
            = "The response for the POST API call for " + feeId + " are: " +
              " Message = " + myObj.Message;
      }
}