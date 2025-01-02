import React from "react";
import { NavLink } from 'react-router-dom';
import {connect} from 'react-redux';
import * as actionTypes from '../../store/action/outLook.action';

import {ArrayHelper} from '../../helpers/arrayhelper';
import OutLookApi from '../../api/Outlook.api';
import LoaderComponent from '../../components/LoaderComponent';

class ForgetPasswordComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {loader:false,mailDetail:{},displayName:'Inbox'};
    }
    componentWillMount()
    {
       this.getEmailList();
    }
    getEmailList=async()=>
    {
    //     let dataValue={
    //         "mailCount": 20,
    //         "skipCount": 0
    //   }
      
      
      this.setState({loader:true });
    //   let response= await OutLookApi.GetMails(dataValue);
    //   console.log(response)
    //       if(ArrayHelper.getValue(response,'isSuccess')==true)
    // {

    // }
    let responseGetFolderList= await OutLookApi.GetFolderList();
     
          if(ArrayHelper.getValue(responseGetFolderList,'IsSuccess')==true)
    {
       
         let inboxData=ArrayHelper.getValue(responseGetFolderList,'MailFolders',[]).filter((item)=>item.displayName=='Inbox');
         let responseInboxList= await OutLookApi.FolderMails(ArrayHelper.getValue(inboxData,'[0].id'));
         if(ArrayHelper.getValue(responseInboxList,'IsSuccess')==true)
    {      this.props.selectedEmailLists(ArrayHelper.getValue(responseInboxList,'Mails')) 
         let folderList= ArrayHelper.getValue(responseGetFolderList,'MailFolders').filter((item)=>item.parentFolderId==ArrayHelper.getValue(inboxData,'[0].parentFolderId'))  
         folderList=folderList.map((item,key)=>{
            if(item.displayName=='Inbox')
            {
                item.displayOrder=0; 
                item.folderclassName="mailing icon-inbox";
                item.mailLists=ArrayHelper.getValue(responseInboxList,'Mails');   
            }
            else if(item.displayName=='Outbox')
            {
                item.displayOrder=1;  
                item.folderclassName="mailing icon-sent";
                item.mailLists=[]; 
            }
            else if(item.displayName=='Deleted Items')
            {
                item.displayOrder=3;  
                item.folderclassName="mailing icon-trash";
                item.mailLists=[];  
            }
            else if(item.displayName=='Drafts')
            {
                item.displayOrder=4;  
                item.folderclassName="mailing icon-draft";
                item.mailLists=[]; 
            }
            else if(item.displayName=='Archive')
            {
                item.displayOrder=5;  
                item.folderclassName="mailing icon-important";
                item.mailLists=[]; 
            }           
            else
            {
                item.displayOrder=key;
                item.folderclassName="mailing icon-important";
                item.mailLists=[];   
            }
            if(item.childFolderCount>0)
            {
                item.subFolder=ArrayHelper.getValue(responseGetFolderList,'MailFolders').filter((_item)=>_item.parentFolderId==item.id) ;    
            }
            return item;
         })  
         folderList = folderList.sort((a,b) => a.displayOrder - b.displayOrder)
        
         this.props.folderList(folderList)
         this.setState({loader:false });
         
        }
        }
    }
    selectedMail=async(e1,e2)=>
    {
     if(e1.hasAttachments==true) 
     {
        this.setState({loader:true});
        let responseattachmentList= await OutLookApi.MailAttachments(ArrayHelper.getValue(e1,'id'));
        //let responseattachmentList= await OutLookApi.MailAttachments('AAMkAGY5OGQ2YzVhLTBlNDMtNDE0MC04NTM3LWFjYWRiYWU1NzM2MABGAAAAAAARu6gEIsdlQoXzTlAWBQn2BwAqY-DhALdwTpTXQbzQp8-JAAAAAAEMAAAqY-DhALdwTpTXQbzQp8-JAAAu2BZqAAA=');
       
        if(ArrayHelper.getValue(responseattachmentList,'IsSuccess')==true)
   {
    e1= Object.assign({},e1,{attechmentLists:ArrayHelper.getValue(responseattachmentList,'Attachments')})
    this.setState({mailDetail:{
        mailData:e1,
        colorClass:e2,
        displayName:this.state.displayName
     },loader:false})

   }
     
    }
    else
    {
        this.setState({mailDetail:{
            mailData:e1,
            colorClass:e2,
            displayName:this.state.displayName
         }})  
    }
    }
    selecteFolder(e)
    {
      this.setState({displayName:e})
    }
    render(){
      
        return(
            <React.Fragment>
                 <LoaderComponent loader={this.state.loader}/> 
                 <form>
                    <div className="mb-4 form-floating">
                        <input type="text" className="form-control" id="floatingUser" placeholder="Email"/>
                        <label for="floatingUser">Email</label>
                    </div>
                    <div className="mb-5 text-end">
                     
                      <NavLink to="/user/login" className="text-theme-color">login  </NavLink>
                    </div>
                    <button type="submit" className="btn btn-primary w-100 btn-lg">Submit</button>
                </form>
            </React.Fragment>
        )
    }
}  


const mapStateToProps = state => {
    return {
        folderListsData : state.outLookData.folderLists,
        selectedEmailListsData : state.outLookData.selectedEmailLists,
    }
  };
  
  const mapDispatchToProps = dispatch => {
    return { 
        folderList : (dataval) => dispatch({type:actionTypes.FOLDER_LIST,payload:dataval}),
        selectedEmailLists : (dataval) => dispatch({type:actionTypes.SELECTED_EMAIL_LIST,payload:dataval})
    }
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(ForgetPasswordComponent);