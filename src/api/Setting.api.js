import axios from 'axios';
import {K2APIURL,AUTHORIZED_TOKEN,APITRAVELURL} from "../helpers/constants";
import {ArrayHelper} from '../helpers/arrayhelper';
export default class SettingApi {
    static GetSettingList = (path) => {
        return  axios.get(K2APIURL+path,{
            headers:{
                'Content-Type':'application/json',
                Token:localStorage.getItem(AUTHORIZED_TOKEN)
            }
        }).then(res =>{ 
            
            console.log(localStorage.getItem(AUTHORIZED_TOKEN),"localStorage.getItem(AUTHORIZED_TOKEN)localStorage.getItem(AUTHORIZED_TOKEN)");
            
            return res.data
        }
            )

    }
    static PostSettingList = (data,path) => {
        return  axios.post(K2APIURL+path,JSON.stringify(data),{
            headers:{
                'Content-Type':'application/json',
                Token:localStorage.getItem(AUTHORIZED_TOKEN)
            }
        }).then(res =>{ 
           
            
            return res.data
        }
            )

    }
    static PostTaveleList = (data,path) => {    
        return  axios.post(APITRAVELURL+path,JSON.stringify(data),{
            headers:{
                'Content-Type':'application/json',
                Token:localStorage.getItem(AUTHORIZED_TOKEN)
            }
        }).then(res =>{ 
            return res.data
        }
            )

    }
    
   
}