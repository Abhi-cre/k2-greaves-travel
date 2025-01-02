import axios from 'axios';
import {APIURL,AUTHORIZED_TOKEN} from "../helpers/constants";
import {ArrayHelper} from '../helpers/arrayhelper';
import Observable from '../rxjs';
export default class OutLookApi {
    static GetMails = (data) => {
        return  axios.get(APIURL+"/api/Action/GetMails?mailCount="+data.mailCount+'&skipCount='+data.skipCount ,{
            headers:{
                'Content-Type':'application/json',
                Token:localStorage.getItem(AUTHORIZED_TOKEN)
            }
        }).then(res =>{ 
            return res.data
        }
            )

    }
    static GetFolderList = () => {
        return  axios.get(APIURL+"/api/Action/GetFolderList" ,{
            headers:{
                'Content-Type':'application/json',
                Token:localStorage.getItem(AUTHORIZED_TOKEN)
            }
        }).then(res =>{ 
            return res.data
        }
            )

    }
    static FolderMails = (data) => {  
      
            return axios.get(APIURL+"/api/Action/FolderMails?mailCount="+data.mailCount+'&skipCount='+data.skipCount+'&folderId='+data.folderId ,{
            headers:{
                'Content-Type':'application/json',
                Token:localStorage.getItem(AUTHORIZED_TOKEN)
            }
        }).then(res =>{ 
            //return res.data
            let response = {
                Mails : [],
                IsSuccess:false

            } 
            
            if(ArrayHelper.getValue(res.data,'IsSuccess')==true)
           {
            response.IsSuccess=true;
            if(ArrayHelper.getValue(res.data,'Mails').length>0){

                ArrayHelper.getValue(res.data,'Mails').forEach((mail:any)=>{
                    let mailData={
                        "id":ArrayHelper.getValue(mail,'id'),
                        "createdDateTime":ArrayHelper.getValue(mail,'createdDateTime'),
                        "lastModifiedDateTime":ArrayHelper.getValue(mail,'lastModifiedDateTime'),
                        "changeKey":ArrayHelper.getValue(mail,'changeKey'),
                        "receivedDateTime":ArrayHelper.getValue(mail,'receivedDateTime'),
                        "sentDateTime":ArrayHelper.getValue(mail,'sentDateTime'),
                        "hasAttachments":ArrayHelper.getValue(mail,'hasAttachments'),
                        "subject":ArrayHelper.getValue(mail,'subject'),
                        "bodyPreview":ArrayHelper.getValue(mail,'bodyPreview'),
                         "body":ArrayHelper.getValue(mail,'body'),
                        "isRead":ArrayHelper.getValue(mail,'isRead'),
                        "isDraft":ArrayHelper.getValue(mail,'isDraft'),
                        "sender":ArrayHelper.getValue(mail,'sender'),
                        "from":ArrayHelper.getValue(mail,'from'),
                        "toRecipients":ArrayHelper.getValue(mail,'toRecipients'),
                        "ccRecipients":ArrayHelper.getValue(mail,'ccRecipients'),
                        "bccRecipients":ArrayHelper.getValue(mail,'bccRecipients'),
                        "replyTo":ArrayHelper.getValue(mail,'replyTo'),
                        "attechmentLists":[]
                    }
                  
                    response.Mails.push(Object.assign({}, mailData));
           })    

            }
           }
          
           return response;
        }
            )
    
    }
    static GetMasterCategories = () => {
        return  axios.get(APIURL+"/api/Action/GetMasterCategories" ,{
            headers:{
                'Content-Type':'application/json',
                Token:localStorage.getItem(AUTHORIZED_TOKEN)
            }
        }).then(res =>{ 
            return res.data
        }
            )

    }
    static MailAttachments = (id) => {
        return  axios.get(APIURL+"/api/Action/MailAttachments?id="+id ,{
            headers:{
                'Content-Type':'application/json',
                Token:localStorage.getItem(AUTHORIZED_TOKEN)
            }
        }).then(res =>{ 
            return res.data
        }
            )

    }  
    static MarkRead = (data) => {
        return  axios.post(APIURL+"/api/Action/MarkRead",JSON.stringify(data),{
            headers:{
                'Content-Type':'application/json',
                Token:localStorage.getItem(AUTHORIZED_TOKEN)
            }
        }).then(res =>{ 
            return res.data
        }
            )

    }
    static MarkUnread = (data) => {
        return  axios.post(APIURL+"/api/Action/MarkUnread",JSON.stringify(data),{
            headers:{
                'Content-Type':'application/json',
                Token:localStorage.getItem(AUTHORIZED_TOKEN)
            }
        }).then(res =>{ 
            return res.data
        }
            )

    }
    static DeleteMail = (id) => {
        return  axios.get(APIURL+"/api/Action/DeleteMail?id="+id ,{
            headers:{
                'Content-Type':'application/json',
                Token:localStorage.getItem(AUTHORIZED_TOKEN)
            }
        }).then(res =>{ 
            return res.data
        }
            )

    } 
    static MoveMailToFolder = (data) => {
        return  axios.post(APIURL+"/api/Action/MoveMailToFolder",JSON.stringify(data),{
            headers:{
             
                'Content-Type':'application/json',
                Token:localStorage.getItem(AUTHORIZED_TOKEN)
            }
        }).then(res =>{ 
            return res.data
        }
            )

    }  
    static CopyMailToFolder = (data) => {
        return  axios.post(APIURL+"/api/Action/CopyMailToFolder",JSON.stringify(data),{
            headers:{
             
                'Content-Type':'application/json',
                Token:localStorage.getItem(AUTHORIZED_TOKEN)
            }
        }).then(res =>{ 
            return res.data
        }
            )

    }
    static CreateFolder = (folderName) => {
        return  axios.get(APIURL+"/api/Action/CreateFolder?folderName="+folderName,{
            headers:{
                'Content-Type':'application/json',
                Token:localStorage.getItem(AUTHORIZED_TOKEN)
            }
        }).then(res =>{ 
            return res.data
        }
            )

    }

    static SerachingMails = (linkUrl) => {
        return  axios.get(APIURL+"/api/Action/"+linkUrl,{
            headers:{
                'Content-Type':'application/json',
                Token:localStorage.getItem(AUTHORIZED_TOKEN)
            }
        }).then(res =>{ 
            return res.data
        }
            )

    }
static SendMail = (data) => {
        return  axios.post(APIURL+"/api/Action/SendMail",JSON.stringify(data),{
            headers:{
             
                'Content-Type':'application/json',
                Token:localStorage.getItem(AUTHORIZED_TOKEN)
            }
        }).then(res =>{ 
            return res.data
        }
            )

    }
    static CreateDraftMail = (data) => {
        return  axios.post(APIURL+"/api/Action/CreateDraftMail",JSON.stringify(data),{
            headers:{
             
                'Content-Type':'application/json',
                Token:localStorage.getItem(AUTHORIZED_TOKEN)
            }
        }).then(res =>{ 
            return res.data
        }
            )

    }
    static Reply = (data) => {
        return  axios.post(APIURL+"/api/Action/Reply",JSON.stringify(data),{
            headers:{
             
                'Content-Type':'application/json',
                Token:localStorage.getItem(AUTHORIZED_TOKEN)
            }
        }).then(res =>{ 
            return res.data
        }
            )

    } 
    
    static ReplyAll = (data) => {
        return  axios.post(APIURL+"/api/Action/ReplyAll",JSON.stringify(data),{
            headers:{
             
                'Content-Type':'application/json',
                Token:localStorage.getItem(AUTHORIZED_TOKEN)
            }
        }).then(res =>{ 
            return res.data
        }
            )

    }

    static ForwardMail = (data) => {
        return  axios.post(APIURL+"/api/Action/ForwardMail",JSON.stringify(data),{
            headers:{
             
                'Content-Type':'application/json',
                Token:localStorage.getItem(AUTHORIZED_TOKEN)
            }
        }).then(res =>{ 
            return res.data
        }
            )

    }
    static ForwardDraftMail = (data) => {
        return  axios.get(APIURL+"/api/Action/ForwardDraftMail?id="+data.id ,{
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