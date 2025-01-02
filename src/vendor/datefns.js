//import {LOGIN_TIME_NAME} from "../helpers/constants";
import {ceil} from "../lodash";
import {format} from "date-fns";
import {addDays} from "date-fns/addDays/index";
import {subDays} from "date-fns/subDays/index";
//const addDay = require('date-fns/add_days');
//const addMonth = require('date-fns/add_months');
//const subDay = require('date-fns/sub_days');
//import {parse} from "date-fns/parse";
//export  {format , parse};
// export function isValidLogin(){
//     let loginTime = localStorage.getItem(LOGIN_TIME_NAME);
   
//     if(loginTime){
//        // let loginValidDate = addHours(loginTime , 72);
        
//        // return isFuture(loginValidDate);
//         return true
//     }else {
//         return false;
//     }
// }
//export  {format , addDays,subDays};
export function formatDate(date , form= 'MM/dd/yyyy'){
    if(date!='')
    {
        return format(new Date(date) , form);
    }
    else
    {
        return('')
    }
   
}
export function addsDays(date  , days){
    let dateData = new Date(date)
    dateData.setDate(dateData.getDate() + days)  
    return (new Date(dateData))
}
export function subsDays(date, days){
    let dateData = new Date(date)
    dateData.setDate(dateData.getDate() - days)  
    return (new Date(dateData))
}
export function getDayValue(date){
    let  myDate = new Date(date);
    let weekday=new Array(7)
 weekday[0]="Sun";
weekday[1]="Mon";
weekday[2]="Tue";
weekday[3]="Wed";
weekday[4]="Thu";
weekday[5]="Fri";
weekday[6]="Sat";
    return weekday[myDate.getDay()];
}

export function getMonthValue(date){
    let  myDate = new Date(date);
    let monthval=new Array(12)
    monthval[0]="January";
    monthval[1]="February";
    monthval[2]="March";
    monthval[3]="April";
    monthval[4]="May";
    monthval[5]="June";
    monthval[6]="July";
    monthval[7]="August";
    monthval[8]="September";
    monthval[9]="October";
    monthval[10]="November";
    monthval[11]="December";
    return monthval[myDate.getMonth()];
}
export function DATEDIFFRENCE(str:any)
{
    if(str!="")
    {
        let dateval = new Date();
        let currentTime=dateval.getTime();
        let dateSelected = new Date(str);
        let selectedTime=dateSelected.getTime();
        let diffrence=ceil((currentTime-selectedTime)/(365*24*60*60*1000));
        return diffrence;

    }
    else
    {
        return 0;
    }

}
export function GETDATETIME(str)
{
    if(str!="")
    {
     
        let dateSelected = new Date(str);
        let selectedTime=dateSelected.getTime();
        console.log('ss',str,selectedTime)
        return selectedTime;

    }
    else
    {
        return 0;
    } 
}
export function ISURLVLIDATE(str:any)
{
   let regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        if (regexp.test(str))
        {
          return true;
        }
        else
        {
          return false;
        }

}


