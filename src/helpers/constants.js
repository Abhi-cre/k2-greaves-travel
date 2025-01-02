import { ceil } from "../lodash";

export const AUTHORIZED_TOKEN = '__authToken__';
export const USER_ID = '__user_id__';
export const USER_NAME = '__user_name__';
export const USER_EMAIL = '__user_email__';
export const DEPARTMENT_NAME = '__department_name__';
export const USER_TYPE_ID = '__user_type_id__';
export const USER_LOCAL_STORAGE_LOGOUT_TIME = '__logout_time__';
// export const ISSITESTATUS:any='live';
// export const APIURL='https://cloneroutlookapi.azurewebsites.net';// For live
// export const K2APIURL='https://livek2.azurewebsites.net';// For live
// export  const APITRAVELURL='https://gtltravelapi.azurewebsites.net'; // For  live
 export const ISSITESTATUS:any='test';
export const APIURL='https://cloneroutlookapi.azurewebsites.net';// For Sandbox
 export const K2APIURL='https://testk2api.azurewebsites.net';// For Sandbox
 export  const APITRAVELURL='https://testtravelapi.azurewebsites.net'; // For  Sandbox
export const DATEFORMTEOFDATE='dd/MM/y';// For Sandbox
export const DISPLAYDATEFORMATE='dd MMM yyyy';// For Sandbox
export const VENDORTYPEIDBYDATE='25';
export const ALLOWEDUSER = ["asingh@web-fares.com","pshrivastava@tl365.com","icambata@tl365.com","scambata@tl365.com","vkapur@greavestours.com","ssen@greavestours.com","yratra@greavestours.com","pjoshi@web-fares.com","smehra@greavestours.com","rthakur@web-fares.com","kwattal@greavestours.com","achauhan@greavestours.com","Smehra@greavestours.com","dsharma@greavestours.com","akishor@web-fares.com"]; 
export const DATEDURATION=(stateDate="",EndDate="")=>  
{ 
    if(stateDate!='' && EndDate!='' && stateDate!='1900-01-01T00:00:00' && EndDate!='1900-01-01T00:00:00') 
    {
                        let tourStartDatetime= new Date(stateDate)
                         let tourEndDatetime= new Date(EndDate)
                         let timeDiff = tourEndDatetime - tourStartDatetime;
                         let duration = ceil(timeDiff/86400000);
                         return duration;
    }
    else
    {
        return 1;
    }
}
export const MEALPLANLIST=['EP','EPAI','CP','CPAI','MAP(L)','MAP(L)AI','MAP(D)','MAP(D)AI','AP','APAI','JP','JPAI'];

export function parseCityDetails(city : string) {
    if(city!='' && city!=null && city!=undefined)
    {
    let cityCode = city.match(/\(([^)]+)\)/);
    return {
        cityName: city.substr(0,city.indexOf(' (')),
        cityCode: (cityCode) ? cityCode[1] : '',
        countryCode : city.substring(city.lastIndexOf(" ")).trim(),
        stateCode : city.substr(city.indexOf(', ')+2,city.indexOf(' -')-city.indexOf(', ')-2)
    }
}
else
{
    return {cityName:'',
    cityCode:'',
    countryCode :'',
    stateCode :''};
}
}

export const config ={
    appid:'a0966852-b2b1-4dab-9bad-bd2e92406dac',
    redirectUrl :'http://localhost:3000',
    scropes: [
        'user read'
    ],
    authority:"https://login.microsoftonline.com/796d2b31-0a6a-4258-9332-0ba263117204"
};

var CryptoJS = require("crypto-js");
const INCPKEY='520eab5710f04ee7';
//const INCPKEY='8080808080808080';
var KEYVAL = CryptoJS.enc.Utf8.parse(INCPKEY);
var IVVAL = CryptoJS.enc.Utf8.parse(INCPKEY);
export const ENYCRYPTVALUE=(e:any)=>
{
   return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(e), KEYVAL,  
{
keySize: 128 / 8,   
iv: IVVAL,  
mode: CryptoJS.mode.CBC,  
padding: CryptoJS.pad.Pkcs7 
}).toString(); 
}
export const DECRTIPTVALUE=(cipherText:any)=>  
{  
return CryptoJS.AES.decrypt(cipherText, KEYVAL,  
{
   keySize: 128 / 8,   
   iv: IVVAL,  
   mode: CryptoJS.mode.CBC,  
   padding: CryptoJS.pad.Pkcs7 
}).toString(CryptoJS.enc.Utf8);; 
}



