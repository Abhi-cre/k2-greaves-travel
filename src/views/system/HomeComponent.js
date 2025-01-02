import React from "react";
import {connect} from 'react-redux';
import * as actionTypes from '../../store/action/outLook.action';
import {USER_ID} from '../../helpers/constants';
import {ArrayHelper} from '../../helpers/arrayhelper';
import OutLookApi from '../../api/Outlook.api';
import SettingApi from '../../api/Setting.api';
import LoaderComponent from '../../components/LoaderComponent';
import LeftNevigationBarComponent from './LeftNevigationBarComponent';
import TopNevigationBarFilterComponent from './TopNevigationBarFilterComponent';
import EmailListsComponent from './EmailListsComponent';
import EmailDetailComponent from './EmailDetailComponent';
import EmailFormComponent from './EmailFormComponent';
import AssignToToureComponent from './AssignToToureComponent';
class HomeComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {loader:false,mailDetail:{},folderId:'',displayName:'Inbox',emailKey:0,page:1,mailCount:50,displayNext:false,
        folderList:[],selectedEmailLists:[],selectedIdList:[],serachBy:'',ImportanceType:'Low',tourRecordList:[],tourRecordData:{}};
    }
    componentWillMount()
    {
       this.getFolderList();
    }
    getMailList=async(folderId)=>
    { 
        let dataMail={
            'folderId':folderId,
            'mailCount':this.state.mailCount,
            'skipCount':(this.state.page -1)*this.state.mailCount,
        }
        this.setState({loader:true });
        let responseInboxList= await OutLookApi.FolderMails(dataMail);
        
        if(ArrayHelper.getValue(responseInboxList,'IsSuccess')==true)
        { 
          this.setState({fetchMails:ArrayHelper.getValue(responseInboxList,'Mails'),displayNext:(ArrayHelper.getValue(responseInboxList,'Mails').length>=this.state.mailCount)?true:false})
         let folderList= this.state.folderList;
         let mailLists=ArrayHelper.getValue(responseInboxList,'Mails')
         if(this.state.page>1)
         {
         let selectedFolderData=folderList.filter((item)=>item.displayName==this.state.displayName)[0];
         let selectedMail=ArrayHelper.getValue(selectedFolderData,'mailLists',[]);
         mailLists= selectedMail.concat(ArrayHelper.getValue(responseInboxList,'Mails'))         
         }
         folderList=folderList.map((_item,key)=>{
            if(_item.id==folderId)
            {               
              //  _item.mailLists = this.state.selectedEmailListsData; 
                _item= Object.assign({},_item,{mailLists:mailLists})
                return _item;   
            }
            return _item;  
        })
       
            
          
            this.setState({loader:false,folderList:folderList,selectedEmailLists:mailLists,displayNext:(ArrayHelper.getValue(responseInboxList,'Mails').length>=this.state.mailCount)?true:false})
           
         
    }
    }
    getFolderList=async()=>
    {
   
      this.setState({loader:true });
   
    let responseGetFolderList= await OutLookApi.GetFolderList();
     
          if(ArrayHelper.getValue(responseGetFolderList,'IsSuccess')==true)
    {
        let folderList=ArrayHelper.getValue(responseGetFolderList,'MailFolders',[]);
        let inboxData=folderList.filter((item)=>item.displayName=='Inbox');
        folderList=folderList.map((item,key)=>{
            if(item.displayName=='Inbox')
            {
                item.displayOrder=0; 
                item.folderClass="mailing icon-inbox"; 
            }
            else if(item.displayName=='Outbox')
            {
                item.displayOrder=1;  
                item.folderClass="mailing icon-sent";
            }
            else if(item.displayName=='Deleted Items')
            {
                item.displayOrder=3;  
                item.folderClass="mailing icon-trash";
            }
            else if(item.displayName=='Drafts')
            {
                item.displayOrder=4;  
                item.folderClass="mailing icon-draft";
            }
            else if(item.displayName=='Archive')
            {
                item.displayOrder=5;  
                item.folderClass="mailing icon-important";
            }           
            else
            {
                item.displayOrder=(key+10);
                item.folderClass="mailing icon-folder";
            }
            return item;
         }) 
         folderList=  folderList.sort((a,b) => a.displayOrder - b.displayOrder);
         this.setState({folderList:folderList,folderId:ArrayHelper.getValue(inboxData,'[0].id') });
         //this.props.folderList(folderList)
         
        
         setTimeout(()=>{
           
            this.getMailList(ArrayHelper.getValue(inboxData,'[0].id'))
         },10)
        }
    }
    selectedMail=async(e1,e2,e3)=>
    { 
        this.props.showRightSide('email');
        this.setState({mailFormType:'compose'});
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
     },emailKey:e3,loader:false})
     setTimeout(()=>{
        this.getTourRecordData(ArrayHelper.getValue(e1,'id')) 
     },10)
   }
     
    }
    else
    {
        this.setState({mailDetail:{
            mailData:e1,
            colorClass:e2,
            displayName:this.state.displayName
         },emailKey:e3}) 
         setTimeout(()=>{
            this.getTourRecordData(ArrayHelper.getValue(e1,'id')) 
         },10)
         
    }

    

    }

    getTourRecordData=async(messageId)=>
    {
        this.setState({loader:true,tourRecordData:{}});
  
    let data={
     "messageId": messageId
 }
 
 let response= await SettingApi.PostSettingList(data,'/api/TourRecord/TourRecordByMessageId');
     if(ArrayHelper.getValue(response,'isSuccess')==true && ArrayHelper.getValue(response,'tourRecordMail',[]).length>0)
     {
         this.setState({loader:false,tourRecordData:ArrayHelper.getValue(response,'tourRecordMail[0]')});
       
     }
     else
     {
        this.setState({loader:false});  
        let mailDetail=ArrayHelper.getValue(this.state.mailDetail,'mailData.body.content').split('___K2GTBT___');   
        
        if(mailDetail.length>2)
        {
            this.setState({tourRecordData:{tourName:mailDetail[2],tourRecordId:mailDetail[1],id:mailDetail[3],vendorId:mailDetail[4]}})
        }
     }
    }
    selecteFolder(e)
    {
        this.props.showRightSide('email');
        if(e.displayName!=this.state.displayName)
        {
            this.setState({selectedIdList:[]})
        }
      this.setState({serachBy:'folders',emailKey:0,displayName:e.displayName,folderId:e.id,page:1,displayNext:(ArrayHelper.getValue(e,'mailLists',[])>0)?true:false,selectedEmailLists:ArrayHelper.getValue(e,'mailLists',[])})
      if(ArrayHelper.getValue(e,'mailLists',[])==0)
      {
        this.getMailList(ArrayHelper.getValue(e,'id'))
      }
      else
      {
       // this.props.selectedEmailLists(ArrayHelper.getValue(e,'mailLists',[])) 
       // this.props.history("/"); 
        this.setState({selectedEmailLists:ArrayHelper.getValue(e,'mailLists',[])})
      }
    }
    nextPrev(str)
    {  
        let numRecordEmail=this.state.selectedEmailLists.length;
        let numEmail= (str -1)*this.state.mailCount;
       
        this.setState({loader:true,page:str,emailKey:0});
        setTimeout(()=>{
           
            this.setState({loader:false});
        if( numEmail >= numRecordEmail && numRecordEmail>=this.state.mailCount)
        {
            this.getMailList(this.state.folderId)
        }
        },5)
       
        
    }
    increaseDescriseCount(str,str2)
    {
        let folderList= this.state.folderList;
        folderList=folderList.map((_item,key)=>{
           if(_item.displayName==this.state.displayName)
           { 
            let unreadItemCount=0;
            if(str2=='add')
            {
                 unreadItemCount= _item.unreadItemCount + str;
            }
            else
            {
                 unreadItemCount= _item.unreadItemCount - str;
            }
           
               _item= Object.assign({},_item,{unreadItemCount:unreadItemCount})
               return _item;   
           }
           return _item;  
       })
       //this.props.folderList(folderList)
       this.setState({folderList:folderList})
       //this.props.history("/"); 
    }
    selectedMailId(id,checkStaus)
{
    let selectedIdList=this.state.selectedIdList;
    if(checkStaus=='Yes')
    {
        selectedIdList=selectedIdList.filter((item)=>item!=id);
    }
    else
    {
        selectedIdList = selectedIdList.concat([id]);
    }
    this.setState({selectedIdList:selectedIdList})
    
}
/* For Delete Mail Function Start */
deleteMails=async(mailId='')=>
{
    let mailIdList=[]
    if(mailId!='')
    {
        mailIdList=[mailId]  
    }
    else
    {
        mailIdList=this.state.selectedIdList;  
    }
    if(this.state.displayName=='Deleted Items')
    {
    let responseInboxList= await OutLookApi.DeleteMail(mailId);
        console.log('responseInboxList',responseInboxList)
     this.setState({loader:true});  
    if(ArrayHelper.getValue(responseInboxList,'IsSuccess')==true)
    {
     
       this.setState({mailDetail:{},page:1,selectedEmailLists:[]})
        setTimeout(()=>{
            
            this.getMailList(this.state.folderId)
        },10)
    }
   }
   else
   {
    this.setState({mailDetail:{},page:1,selectedEmailLists:[]})
    this.moveMailToFolder('AQMkAGY5OGQ2YzVhLTBlNDMtNDE0MC04NTM3LWFjYWRiYWU1NzM2MAAuAAADEbuoBCLHZUKF805QFgUJ9gEAKmPw4QC3cE6U10G80KfPyQAAAgEKAAAA',mailId)
   }  
}
/* For Delete Mail Function Start */

/* For moveMailToFolder Function Start */
moveMailToFolder=async(DestinationId,mailId='')=>
{
    let mailIdList=[]
    if(mailId!='')
    {
        mailIdList=[mailId]  
    }
    else
    {
        mailIdList=this.state.selectedIdList;  
    }
    mailIdList.forEach(async(item,key)=>{
        let DataValue={
            "EmailId": item,
           "DestinationId": DestinationId
        }
        let responseInboxList= await OutLookApi.MoveMailToFolder(DataValue);
            console.log('responseInboxList',responseInboxList)
         this.setState({loader:true});  
        if(ArrayHelper.getValue(responseInboxList,'IsSuccess')==true)
        {
            //this.getMailList(ArrayHelper.getValue(e,'id'))
           // this.setState({mailDetail:{},page:1,selectedIdList:[],selectedEmailLists:[]})
            
        }

        if(key==(mailIdList.length-1))
        {
            setTimeout(()=>{
                this.setState({mailDetail:{},page:1,selectedIdList:[],selectedEmailLists:[],serachBy:'folders'})
                this.getMailList(this.state.folderId)
                this.getMailList(DestinationId)
            },10)
        }

    })
   
}
/* For copyMailToFolder Function Start */
copyMailToFolder=async(DestinationId,mailId='')=>
{
    let mailIdList=[]
    if(mailId!='')
    {
        mailIdList=[mailId]  
    }
    else
    {
        mailIdList=this.state.selectedIdList;  
    }
    mailIdList.forEach(async(item,key)=>{
        let DataValue={
            "EmailId": item,
           "DestinationId": DestinationId
        }
        let responseInboxList= await OutLookApi.CopyMailToFolder(DataValue);
            console.log('responseInboxList',responseInboxList)
         this.setState({loader:true});  
        if(ArrayHelper.getValue(responseInboxList,'IsSuccess')==true)
        {
            //this.getMailList(ArrayHelper.getValue(e,'id'))
           // this.setState({mailDetail:{},page:1,selectedIdList:[],selectedEmailLists:[]})
            
        }

        if(key==(mailIdList.length-1))
        {
            setTimeout(()=>{
                this.setState({mailDetail:{},page:1,selectedIdList:[],selectedEmailLists:[],serachBy:'folders'})
                this.getMailList(this.state.folderId)
                this.getMailList(DestinationId)
            },10)
        }

    })
   
}
searchingEmail=async(e1,e2)=>
{
    let urlLink='';
    if(e2=='SearchMailFromMailAddress')
    {
        urlLink='SearchFlaggedMail?emailAddress='+e1;
    }
    else if(e2=='SearchMailByContent')
    {
        urlLink='SearchMailByContent?content='+e1;
    }
    else if(e2=='SearchMailBySubject')
    {
        urlLink='SearchMailBySubject?subject='+e1;
    }
    else if(e2=='SearchMailHasAttachment')
    {
        urlLink='SearchMailHasAttachment?attachmentName='+e1+'&hasAttachment=true';
    }
    else if(e2=='SearchFlaggedMail')
    {
        urlLink='SearchFlaggedMail';
    }
    this.setState({loader:true,displayName:'',serachBy:e2});
    let responseSearching = await OutLookApi.SerachingMails(urlLink);
        
    if(ArrayHelper.getValue(responseSearching,'IsSuccess')==true)
    {
    this.setState({loader:false,serachBy:e2,selectedEmailLists:ArrayHelper.getValue(responseSearching,'Mails')});
    }
}
/* For Delete Mail Function Start */
/* For Mark Read Email Function Start */
MarkReadEmail =async()=>
{
  let selectedIdList =this.state.selectedIdList;
  if(selectedIdList.length>0)
  {
   this.setState({loader:true});
    let responseSearching = await OutLookApi.MarkRead(selectedIdList);
    if(ArrayHelper.getValue(responseSearching,'IsSuccess')==true || ArrayHelper.getValue(responseSearching,'IsSuccess')==false)
    {
        this.setState({loader:false,page:1,selectedIdList:[]});
        setTimeout(()=>{
           this.increaseDescriseCount(selectedIdList.length,'minus');
           this.getMailList(this.state.folderId)
        },10)
    }
  }
  else
  {
    alert('Select atleast  one email')
  }
}
/* For Mark Read Email Function Email */
/* For Mark Un Read Email Function Start */
MarkUnReadEmail =async()=>
{
  let selectedIdList =this.state.selectedIdList;
  if(selectedIdList.length>0)
  {
   this.setState({loader:true});
    let responseSearching = await OutLookApi.MarkUnread(selectedIdList);
    if(ArrayHelper.getValue(responseSearching,'IsSuccess')==true || ArrayHelper.getValue(responseSearching,'IsSuccess')==false)
    {
        this.setState({loader:false,page:1,selectedIdList:[]});
        setTimeout(()=>{
           this.increaseDescriseCount(selectedIdList.length,'add');
           this.getMailList(this.state.folderId)
        },10)
    }
  }
  else
  {
    alert('Select atleast  one email')
  }
}
/* For Mark Un Read Email Function Email */
/* For nextPrevEmail Function Start */
nextPrevEmail=async(e,e2)=>
{
   let selectedEmailListsAll= this.state.selectedEmailLists;
   let selectedEmailLists=await selectedEmailListsAll.filter((item,key)=>key==e)
   if(selectedEmailLists[0].isRead==false)
    {  this.increaseDescriseCount(1,'minus')
        OutLookApi.MarkRead([selectedEmailLists[0].id])
        selectedEmailListsAll=selectedEmailListsAll.map((_item,key)=>{
      if(key==e)
      {
        _item.isRead=true;
        return _item;
      }
      return _item;
    })
}
   console.log(selectedEmailLists[0],e)
   this.setState({selectedEmailLists:selectedEmailListsAll,mailDetail:{
    mailData:selectedEmailLists[0] ,
    colorClass:e2,
    displayName:this.state.displayName
 },emailKey:e}) 
}
/* For nextPrevEmail funtion End */
MailImportance(e='')
{
    if(e=='' && this.state.ImportanceType!='High')
    {
       this.setState({ImportanceType:'High'}) 
    }
    else
    {
       this.setState({ImportanceType:'Low'}) 
    }
}
/* For Mark Read Email Function Start */
getTourRecordList =async()=>
{
  
   this.setState({loader:true});
   let data={
    "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
    "tourRecord": 0,
}

let response= await SettingApi.PostSettingList(data,'/api/TourRecord/TourRecordOfNullMailId');
    if(ArrayHelper.getValue(response,'isSuccess')==true)
    {
        this.setState({loader:false,tourRecordList:ArrayHelper.getValue(response,'tourRecordMail')});
      
    }
  
}
/* For Mark Read Email Function Email */
ReplyMails(e)
{
if(e=='assignToToure') 
{
this.getTourRecordList()    
}   
this.props.showRightSide(e);    
}
    render(){
      
        return(
            <React.Fragment>
                 <LoaderComponent loader={this.state.loader}/> 
                 <LeftNevigationBarComponent
                 displayName={this.state.displayName}
                 getFolderList={()=>this.getFolderList()}
                 selecteFolder={(e)=>this.selecteFolder(e)} folderList={this.state.folderList} showLeftNav={this.props.showLeftNav} history={this.props.history}/>
                
        <div className={`page-content ${(this.props.showLeftNav!=true)?'removeSpace':''}`}>
         <TopNevigationBarFilterComponent
          MarkReadEmail={()=>this.MarkReadEmail()}
          MarkUnReadEmail={()=>this.MarkUnReadEmail()}
          copyMailToFolder={(e1,e2)=>this.copyMailToFolder(e1,e2)}
          moveMailToFolder={(e1,e2)=>this.moveMailToFolder(e1,e2)}
          serachBy={this.state.serachBy}
          folderList={this.state.folderList}
          displayName={this.state.displayName}
         searchingEmail={(e1,e2)=>this.searchingEmail(e1,e2)}
         nextPrev={(e)=>this.nextPrev(e)}
         history={this.props.history}
         page={this.state.page}
         displayNext={this.state.displayNext}
         MailImportance={()=>this.MailImportance()}
         
         />
            
            {/* <!--  Sidebar email list --> */}
            <EmailListsComponent selectedIdList={this.state.selectedIdList}
            selectedMailId={(e1,e2)=>this.selectedMailId(e1,e2)}
           
            increaseDescriseCount={(str,str2)=>this.increaseDescriseCount(str,str2)}
            page={this.state.page}
            mailCount={this.state.mailCount}
            selectedEmailListsData={this.state.selectedEmailLists}
            selectedMail={(e1,e2,e3)=>this.selectedMail(e1,e2,e3)}/>
           
            {/* <!--  Sidebar email list --> */}
            <EmailDetailComponent deleteMails={(mailId)=>this.deleteMails(mailId)}
             mailDetail={this.state.mailDetail}
             emailKey={this.state.emailKey}
             numberOfEmail={this.state.selectedEmailLists.length-1}
             nextPrevEmail={(e,e2)=>this.nextPrevEmail(e,e2)}
             ReplyMails={(e)=>this.ReplyMails(e)}
             disPlayRight={this.props.disPlayRight}
             tourRecordData={this.state.tourRecordData}
            
            />
            {(this.props.disPlayRight!='assignToToure')?<EmailFormComponent
            MailImportance={(e)=>this.MailImportance(e)}
            ImportanceType={this.state.ImportanceType}
            showRightSide={()=>this.props.showRightSide('email')}
            mailDetail={this.state.mailDetail}
            disPlayRight={this.props.disPlayRight}
            tourRecordData={this.state.tourRecordData}
            />:<AssignToToureComponent
            tourRecordList={this.state.tourRecordList}
            MailImportance={(e)=>this.MailImportance(e)}
            ImportanceType={this.state.ImportanceType}
            showRightSide={()=>this.props.showRightSide('email')}
            mailDetail={this.state.mailDetail}
            disPlayRight={this.props.disPlayRight}
            getTourRecordData={(e1)=>this.getTourRecordData(e1)}
            />}
           
        </div>
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(HomeComponent);