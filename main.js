import { LeapHostSdkFactory } from '@leapdev/leap-host'; // Import the LEAP Host SDK
import axios, {isCancel, AxiosError} from 'axios'; // Import the Axios client - we will use this for our API calls
import Grid from 'tui-grid'; //import toast grid

// Define a variable for the SDK
const sdk = LeapHostSdkFactory.getInstance();
//best practice: initialize the SDK once, in a central init code page of whatever framework they're using and then use the SDK all throughout their app
//sdk.init();
sdk.init("PJOYCRM8LHYMHXNV");
const SdkPocVersion = "SDK POC v1.007";
var constTaskCodeId = "";
var constTaxCodeId = "";

// Define a variable for the API Gateway baseURL we will be using for API calls
const gateway_test = axios.create({
  baseURL: 'https://au-test.leap.services',
  timeout: 9999,
  ////LEAP Dev Console Test
  ////universal API key
  headers: {'x-api-key': 'L6MSX9QxZt4nL7dY48RdI7UR9XNEHuaj77j4KUWz'} ////recommended to store this in something like AWS parameters as discussed w/ Andy
});

const gateway_backend = axios.create({
  baseURL: 'https://api-offexaccounting-test.leapaws.com.au',
  timeout: 9999,
  ////LEAP Dev - straight from the backend
  ////universal API key
  headers: {'x-api-key': 'L6MSX9QxZt4nL7dY48RdI7UR9XNEHuaj77j4KUWz'} ////recommended to store this in something like AWS parameters as discussed w/ Andy
});

////loads all matters and adds them to a dropdown
async function loadAllTaskCodes(){

  const getTaskCodeToken = await sdk.getRefreshedAccessToken();
  console.log("Token: " + getTaskCodeToken);

  const response = await (gateway_backend.get('/api/cloud/feetaskcode', { headers: {'Authorization': `Bearer ${getTaskCodeToken}` }}));

  if (response.status == "200" || response.status == "201"){

    const myTaskCode = response.data[0];

    constTaskCodeId = myTaskCode.TaskCodeGUID;
    constTaxCodeId = myTaskCode.TaxCodeGUID;
    
    console.log("Codes are: " + constTaskCodeId + " and " + constTaxCodeId);
  }
  else{
    console.log("Error: Task code API call did not return a success call");
  }

}

//------------helper functions: start -----
////just a helper function to display the current date/time for system updates or randomly generated text (to show that there's a change in status)
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

//1. get the token and current matter ID and display it
let btnToken = document.getElementById("btnToken");
btnToken.addEventListener("click", getToken);

async function getToken(){

  ////the getRefreshedAccessToken function checks if the access token will expire and has a mechanism to fetch a new one everytime it is called.
  ////for best practices, always call the getRefreshedAccessToken function instead of caching and assigning the token to a global or system-wide variable
  const tokenValue = await sdk.getRefreshedAccessToken();

  var divToken = document.getElementById('divToken');
  divToken.innerHTML = tokenValue;

  loadAllTaskCodes(); ///helper function to load all task codes/tax codes for other examples
}

////helper function to handle change event of select element
function handleSelectChange(event) {

  // if you want to support some really old IEs, add
  // event = event || window.event;
  var selectElement = event.target;

  var value = selectElement.value;
  // to support really old browsers, you may use
  // selectElement.value || selectElement.options[selectElement.selectedIndex].value;

  // do whatever you want with the value  
  openDialogBoxHelper("info", "info", SdkPocVersion, "The selected value is: " + value);  
}

//2. open a matter
function openMatterFunction(id){
  //opens a matter
  if (id == sdk.leapContext.context.matterId){    
    openDialogBoxHelper("info", "info", SdkPocVersion, "Matter is already open");  
  }
  else{
    const request = {
      ////note: you cannot open another matter window with the same context. you always have to choose a different matter ID to load for this SDK method
      "matterId": id, ////generate/automate
      "appSessionId": sdk.leapContext.hostInfo.appSessionId
    };
    sdk.matter.openMatter(request);
  }
}

let btnLoadAllMatters = document.getElementById("btnLoadAllMatters");
btnLoadAllMatters.addEventListener("click", loadAllMatters);

////loads all matters and adds them to a dropdown
async function loadAllMatters(){

  const allMattersToken = await sdk.getRefreshedAccessToken();
  console.log("Token: " + allMattersToken);

  const response = await (gateway_test.get('/api/v3/matters', { headers: {'Authorization': `Bearer ${allMattersToken}` }}));

  if (response.status == "200" || response.status == "201"){

    const myArray = response.data.matterList;

    var selectElement = document.getElementById('selectMatter');

    for(var i = 0; i<myArray.length; i++){

      selectElement.innerHTML += '<option value="' + myArray[i].matterId + '">'
        + myArray[i].matterId + ': ' + myArray[i].firstDescription + ' ' + myArray[i].customDescription + '</option>';
    }
  }
  else{
    console.log("Error: API Call did not return a success call");
  }

}

let btnChooseMatter = document.getElementById("btnChooseMatter");
btnChooseMatter.addEventListener("click", chooseMatter);

async function chooseMatter(){
  var selectElement = document.getElementById('selectMatter');

  openMatterFunction(selectElement.options[selectElement.selectedIndex].value);
}

//3. create a card
let btnCreateCard = document.getElementById("btnCreateCard");
btnCreateCard.addEventListener("click", createCard);

async function createCard(){

  try
  {
    ////creates a card & returns a createdCard object
    const createdCard = await sdk.card.createCard();

    var divCreatedCard = document.getElementById('divCreatedCard');
    divCreatedCard.innerHTML = "Card ID Created: " + createdCard.cardId;

  }
  catch (err){
    console.log(err);
  }

}

//4. open a dialog box
let btnOpenDialogBox = document.getElementById("btnOpenDialogBox");
btnOpenDialogBox.addEventListener("click", () => openDialogBoxHelper("info", "info", SdkPocVersion, "This message is displayed by LEAP SDK"), false);

async function openDialogBoxHelper(dialogTypeValue, iconValue, titleValue, messageValue){
  const dialogRequest = {
      "dialogType": dialogTypeValue,
      "icon": iconValue,
      "title": titleValue,
      // "confirmButtonText": "Confirm Info",
      // "cancelButtonText": "Cancel Info",
      "message": messageValue + " : " + getCurrentDateTime().toString()
  };

    const openDialogValue = await sdk.system.openDialog(dialogRequest);    
}

//5. select a card & display card ID value - works
let btnSelectCard = document.getElementById("btnSelectCard");
btnSelectCard.addEventListener("click", selectCard);

async function selectCard(){
  const cardRequest = {
    "appSessionId": sdk.system.appSessionId,
    "close": false,
    "multiSelection": false
    ////note: you can also add a default search string or filter category: MatterCards, Supplier, Company, Business or any tableIds
    ////"searchString": "Rocket",
    ////"filter": "People"
  };

  const arrayOfCards = await sdk.card.selectCard(cardRequest);

  var divSelectedCard = document.getElementById('divSelectedCard');
  divSelectedCard.innerHTML = arrayOfCards[0].cardId; ////you can also display the description, shortname or type of Card if available

}

//6. call an API and get a single matter
let btnGetSingleMatter = document.getElementById("btnGetSingleMatter");
btnGetSingleMatter.addEventListener("click", getSingleMatter);

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

//7. call an API and get all matters
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

        for(var i = 0; i < myArray.length; i++){

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

//8. create fee entries
let btnCreateFeeEntryRequest = document.getElementById("btnCreateFeeEntryRequest");
btnCreateFeeEntryRequest.addEventListener("click", createFeeEntryRequest);

async function createFeeEntryRequest(){ 

  ////note: returns the staff ID used by the current session
  const staffIdForFeeEntry = await sdk.getDecodedRefreshedAccessToken().staffId;

  // const createFeeEntryRequest = {
  //   "matterId": sdk.leapContext.context.matterId,
  //   "appSessionId": sdk.leapContext.hostInfo.appSessionId,

  //   "taskCodeId": constTaskCodeId, //"c05c4eca-394d-45dc-97b3-3c29e4ff4329", ///needs to have valid task code ID
  //   "taxCodeId": constTaxCodeId, //"71e08981-c1be-4ead-88c9-eee1f5d3f32d", ///needs to have valid tax code ID
  //   "quantity": 105,
  //   "amountEach": 200,
  //   "includeTax": false,
  //   "transactionDate": "2023-04-29",
  //   "billingDescription": "",
  //   "billingMode": "1", ////billingMode's possible values: NextInvoice = 0, LaterInvoice = 1, NotBillable = -1
  //   "memo": "This is my memo - " + getCurrentDateTime().toString(),
  //   "staffId": staffIdForFeeEntry
  // };

  const createFeeEntryRequest = {
    "matterId": sdk.leapContext.context.matterId,
    "appSessionId": sdk.leapContext.hostInfo.appSessionId    
  };

  try{    
    sdk.accounting.createFeeEntry(createFeeEntryRequest); //check time and fees afterward to verify that the fee has been created
    ////openDialogBoxHelper("info", "info", SdkPocVersion, "Finished creating fee entry request"); 
    
  }
  catch (err){
    openDialogBoxHelper("info", "info", SdkPocVersion, "Error: " + err);     
  }
}

//9. invoice
let btnCreateInvoiceRequest = document.getElementById("btnCreateInvoiceRequest");
btnCreateInvoiceRequest.addEventListener("click", createInvoiceRequest);

async function createInvoiceRequest(){
  var invNumber = "Inv-001-SDKTest";

  // const invoiceRequest = {
  //   "invoiceTo": "John Naismith",
  //   "invoiceNumber": invNumber,
  //   "autoNumber": true,
  //   "transactionDate": "2023-04-15",
  //   "dueDate": "2023-04-29",
  //   "memo": "You have to pay me now - " + getCurrentDateTime().toString(),
  //   "status": 1, ////note: Unapproved = 0, Approved = 1, PrintedOrSent = 3
  //   "layoutId": ""
  // };

  const invoiceRequest = {    
    "invoiceNumber": invNumber,
    "memo": "You have to pay me now - " + getCurrentDateTime().toString(),    
  };

  try {

    const invoiceCreated = await sdk.accounting.createInvoice(invoiceRequest);

    var invoiceRequestDiv = document.getElementById('invoiceRequestDiv');
    invoiceRequestDiv.innerHTML = "Invoice Created: " + invoiceCreated + "/" + invoiceCreated.valueOf.toString();

    ////note: createInvoice function should return a boolean value that will allow the developer to
    //// dictate logic of how the next action of their program should be based on the results of the function.
    //// however, as of 15-May, this is throwing an error (ie: not returning a boolean function) as discussed with Andy/Tom Tran.
    //// the invoice request still gets created, though.
    //// further investigation is ongoing.
    if (invoiceCreated) {      
      openDialogBoxHelper("info", "info", SdkPocVersion, "Invoice " + invNumber + " created!"); 
    }
    else {
      openDialogBoxHelper("info", "info", SdkPocVersion, "No invoice created");
    }
  }
  catch(err){
    openDialogBoxHelper("info", "info", SdkPocVersion, "Error: " + err);
  }
}

//10. POST api/v1/fees
let btnPostFees = document.getElementById("btnPostFees");
btnPostFees.addEventListener("click", postFees);

async function postFees(){

  const postFeesToken = await sdk.getRefreshedAccessToken();
  const staffIdForFee = await sdk.getDecodedRefreshedAccessToken().staffId;
  
  var feeId = generateSampleGUID();

  var txnDate = document.getElementById("txtPostFees_TxnDate").value;
  var billDesc = document.getElementById("txtPostFees_BillDesc").value;
  ////var  = document.getElementById("").value;
  var memo = document.getElementById("txtPostFees_Memo").value;
  var rateId = document.getElementById("txtPostFees_RateId").value;
  var ratePerHr = document.getElementById("txtPostFees_RatePerHour").value;
  var includeTax = document.getElementById("txtPostFees_IncTax").value;
  var totalExcludingTax = document.getElementById("txtPostFees_TotalExTax").value;
  var totalTax = document.getElementById("txtPostFees_TotalTax").value;
  var totalIncTax = document.getElementById("txtPostFees_TotalIncTax").value;
  var secondsElapsed = document.getElementById("txtPostFees_SecondsElapsed").value;
  var secondsPerUnit = document.getElementById("txtPostFees_SecondsPerUnit").value;
  var feeUnits = document.getElementById("txtPostFees_FeeUnits").value;
  var feeHrsQty = document.getElementById("txtPostFees_FeeHoursQuantity").value;
  var timed = document.getElementById("txtPostFees_Timed").value;

  const response= await gateway_test.post('/api/v2/fees',
      {
        "TransactionDate": txnDate, ////"2023-05-10T16:31:00Z", ////generate/automate
        "BillingDescription": billDesc + " : " + getCurrentDateTime().toString(),
        "Memo": memo, //"log",
        "RateId": rateId, //"No",
        "RatePerHour": ratePerHr, //"",
        "incTax": includeTax, //"",
        "totalExTax": totalExcludingTax, //"0",
        "totalTax": totalTax, //"0",
        "totalIncTax": totalIncTax, //"0",
        "SecondsElapsed": secondsElapsed, //"86",
        "SecondsPerUnit": secondsPerUnit, //360,
        "FeeUnits": feeUnits, //"1", should be 1
        "FeeHoursQuantity": feeHrsQty, //"0.1",
        "Timed": timed, //"1",
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
      });

      if (response.status == "200" || response.status == "201"){

        const myObj = response.data;

        openDialogBoxHelper("info", "info", SdkPocVersion, "Fee # " + feeId + " created!"); 

        var postFeesDiv = document.getElementById('postFeesSection');
        postFeesDiv.innerHTML
          = "The response for the POST API call for " + feeId + " are: " +
            " Message = " + myObj.Message + "/" + billDesc;
      }
}