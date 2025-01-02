import React from "react";
import {ArrayHelper} from '../../helpers/arrayhelper';
import OutLookApi from '../../api/Outlook.api';
import { Editor, EditorTools } from "@progress/kendo-react-editor";
//import { loadMessages, LocalizationProvider } from "@progress/kendo-react-intl";
import LoaderComponent from '../../components/LoaderComponent';
import '@progress/kendo-theme-default/dist/all.css';
//import '../../css/editor.css';
// import "../../css/theme.scss";

const {
    FindAndReplace,
    Pdf,
    Bold,
    Italic,
    Underline,
    AlignLeft,
    AlignRight,
    AlignCenter,
    Indent,
    Outdent,
    OrderedList,
    UnorderedList,
    Undo,
    Redo,
    Link,
    Unlink,
  } = EditorTools;
  
  const CustomPdf = props => (
    <Pdf
      {...props}
      savePdfOptions={{
        fileName: "React Rich Text Editor",
        paperSize: "A4",
        marign: "3cm",
      }}
    />
  );
class EmailFormComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {toEmail:'',
            ccEmail:'',
            bccEmail:'',
            subject:'',
            displayCcEmail:false,
            displayBccEmail:false,
           emailContent:'',
           loader:false,
           mailFormType:'compose',
           emailId:''};
    }
    handleChange = (e) => {
    
     const name = e.target.name;
     let  value = e.target.value;
     if(name=='toEmail' || name=='ccEmail' || name=='bccEmail')
     {
        value=value.replaceAll(' ',';')
        value=value.replaceAll(';;',';')
        value=value.replace(/[&\/\\#,+()!$~%'":*?<>{}^]/g, '')
     }
     this.setState({ ...this.state, [name]: value });   
    }
    handleChangeEditor = (e) => {
    
        this.setState({emailContent:e.html});  
       }
    displayBox(str)
    {
        if(str=='ccEmail')
        {
          this.setState({displayCcEmail:true});  
          setTimeout(()=>{
            this.ccEmailInput.focus();
          },10)
         
        }
        else if(str=='bccEmail')
        {
          this.setState({displayBccEmail:true});
          setTimeout(()=>{
            this.bccEmailInput.focus();
          },10)
        }

    }
    
    submit = async(event: any) => {
        event.preventDefault();
          
            let ToRecipients=this.state.toEmail.split(';');
            let CcRecipients=(this.state.ccEmail.trim()!='')?this.state.ccEmail.trim().split(';'):[];
            let BccRecipients=(this.state.bccEmail.trim()!='')?this.state.bccEmail.trim().split(';'):[];
            let  mailData= {}
             let response='';
             this.setState({ loader:true});
            let emailContent= this.state.emailContent;
            let subject= this.state.subject;
            let emailExtraContent='';
            if(this.state.mailFormType!='compose' && ArrayHelper.getValue(this.props.tourRecordData,'tourRecordId')!='')
          {
            let vendorTypeEmail =this.state.subject.split('/[ref: VEF');
            if(vendorTypeEmail.length<2)
            {
            subject=ArrayHelper.getValue(this.props.mailDetail,'mailData.subject').replace(' /'+ArrayHelper.getValue(this.props.tourRecordData,'tourRecordId'),'');
            subject=ArrayHelper.getValue(this.props.mailDetail,'mailData.subject').replace('/[ref: TEF'+ArrayHelper.getValue(this.props.tourRecordData,'id')+']','');
            emailExtraContent='<p style="color:#ffffff">___K2GTBT___'+ArrayHelper.getValue(this.props.tourRecordData,'tourRecordId')+'___K2GTBT___'+ArrayHelper.getValue(this.props.tourRecordData,'tourName')+'___K2GTBT___'+ArrayHelper.getValue(this.props.tourRecordData,'id')+'___</p>';
            subject = subject+' /'+ArrayHelper.getValue(this.props.tourRecordData,'tourRecordId')+'/[ref: TEF'+ArrayHelper.getValue(this.props.tourRecordData,'id')+']';
            }
            else
            {
              subject=ArrayHelper.getValue(this.props.mailDetail,'mailData.subject').replace(' /'+ArrayHelper.getValue(this.props.tourRecordData,'tourRecordId'),'');
              subject=ArrayHelper.getValue(this.props.mailDetail,'mailData.subject').replace('/[ref: VEF'+ArrayHelper.getValue(this.props.tourRecordData,'vendorId')+']','');
              emailExtraContent='<p style="color:#ffffff">___K2GTBT___'+ArrayHelper.getValue(this.props.tourRecordData,'tourRecordId')+'___K2GTBT___'+ArrayHelper.getValue(this.props.tourRecordData,'tourName')+'___K2GTBT___'+ArrayHelper.getValue(this.props.tourRecordData,'id')+'___</p>';
              subject = subject+' /'+ArrayHelper.getValue(this.props.tourRecordData,'tourRecordId')+'/[ref: VEF'+ArrayHelper.getValue(this.props.tourRecordData,'vendorId')+']';
            }
          }
            if(this.state.mailFormType=='compose')
          {
               mailData= {
                "Subject": subject,
                "BodyContent":emailContent,
                "ToRecipients":ToRecipients,
                "CcRecipients":CcRecipients,
                "BccRecipients":BccRecipients,
                "Importance": this.props.ImportanceType
                }
                response= await OutLookApi.SendMail(mailData);
          }      
          else if(this.state.mailFormType=='single')
          {
               mailData=  {
                "Comment": emailContent+emailExtraContent,
                "ToRecipients":ToRecipients,
                "Subject": subject,
                "CcRecipients":CcRecipients,
                "BccRecipients":BccRecipients,
                "Id": this.state.emailId
                }
                response= await OutLookApi.Reply(mailData);
          } 
          else if(this.state.mailFormType=='forward')
          {
               mailData=  {
                "Comment": emailContent+emailExtraContent,
                "ToRecipients":ToRecipients,
                "Subject": subject,
                "CcRecipients":CcRecipients,
                "BccRecipients":BccRecipients,
                "Id": this.state.emailId
                }
                response= await OutLookApi.ForwardMail(mailData);
          }  
          else if(this.state.mailFormType=='all')
          {
               mailData=  {
                "Comments": emailContent+emailExtraContent,
                "Subject": subject,
                "CcRecipients":CcRecipients,
                "BccRecipients":BccRecipients,       
                "Id": this.state.emailId
                }
                response= await OutLookApi.ReplyAll(mailData);
          }     
          
      if(ArrayHelper.getValue(response,'IsSuccess')==true || ArrayHelper.getValue(response,'IsSuccess')==false)
      {
         this.setState({
          loader:false,
          toEmail:'',
          ccEmail:'',
          bccEmail:'',
          subject:'',
          displayCcEmail:false,
          displayBccEmail:false,
         emailContent:''
          });
          this.props.MailImportance('Low');
          this.props.showRightSide();
      }
      
    
    } 
    componentWillReceiveProps(nextProps,oldProps) {
      
      if(nextProps.disPlayRight!=this.props.disPlayRight)
      {
       
          this.setState({displayCcEmail:false,displayBccEmail:false,
            mailFormType:nextProps.disPlayRight,emailId:ArrayHelper.getValue(nextProps.mailDetail,'mailData.id'),toEmail:ArrayHelper.getValue(nextProps.mailDetail,'mailData.from.emailAddress.address')})
        if(nextProps.disPlayRight=='forward' || nextProps.disPlayRight=='compose')
        {
          this.setState({toEmail:''})
        }

      }
       
     
  }  
  DiscardMail= async() => {
  
    this.setState({ loader:true})
    let ToRecipients=this.state.toEmail.split(' ; ');
            let CcRecipients=(this.state.ccEmail.trim()!='')?this.state.ccEmail.trim().split(' ; '):[];
            let BccRecipients=(this.state.bccEmail.trim()!='')?this.state.bccEmail.trim().split(' ; '):[];
   let mailData={};
   let response={};
  if(this.state.mailFormType=='forward')
          {
               mailData=  {
                
                "id": this.state.emailId
                }
                response= await OutLookApi.ForwardDraftMail(mailData);
          }
    else if(this.state.mailFormType=='compose')
          {
            mailData= {
              "Subject": this.state.subject,
              "BodyContent":this.state.emailContent,
              "ToRecipients":ToRecipients,
              "CcRecipients":CcRecipients,
              "BccRecipients":BccRecipients,
              "Importance": this.props.ImportanceType
              }
              response= await OutLookApi.CreateDraftMail(mailData);
          }      
    if(ArrayHelper.getValue(response,'IsSuccess')==true || ArrayHelper.getValue(response,'IsSuccess')==false)
    {
       this.setState({
        loader:false,
        toEmail:'',
        ccEmail:'',
        bccEmail:'',
        subject:'',
        displayCcEmail:true,
        displayBccEmail:true,
       emailContent:''
        });
        this.props.MailImportance('Low');
        this.props.showRightSide();
    }
  }
    render(){
     
        return(
            <React.Fragment>
               <LoaderComponent loader={this.state.loader}/> 
              <div className={`content-right ${(this.props.disPlayRight=='compose' || this.props.disPlayRight=='single'  || this.props.disPlayRight=='all'  || this.props.disPlayRight=='forward')?'show':'hide'} `}>
                <div className="email-details card">
                <form method="post" role="form" onSubmit={this.submit}>
                    <div className="emailReply d-flex justify-content-start ps-0">
                            <button type="submit" className="btn me-2"><i className="fa-regular fa-paper-plane"></i> Send</button>
                            {(this.props.disPlayRight=='compose' || this.props.disPlayRight=='forward')?<button onClick={()=>this.DiscardMail()}  type="button" className="btn me-1"><i className="fa-regular fa-trash-can"></i> Discard</button>:''}
                            {/* <div className="align-self-center me-1"><a href="#"><i className="fa-solid fa-paperclip"></i></a></div>
                            <div className="align-self-center me-1"><a href="#"><i className="fa-regular fa-image"></i></a></div>
                            <div className="align-self-center me-1"><a href="#"><i className="fa-solid fa-face-smile"></i></a></div> */}
                    </div>
                    <div className="mail-compose">
                        
                    <div className="form-group bordered-left-4 bordered-themeprimary">
                                <label htmlFor="to">To:</label>
                                {(this.state.mailFormType=='forward' || this.state.mailFormType=='compose')?<input required name="toEmail" onChange={this.handleChange} value={this.state.toEmail} type="text" className="form-control" id="to" tabIndex="1"/>:
                                <input readOnly name="toEmail" onChange={this.handleChange} value={this.state.toEmail} type="text" className="form-control" id="to" tabIndex="1"/>}
                                <div className="field-options">
                                    {(this.state.displayCcEmail==false)?<a  onClick={()=>this.displayBox('ccEmail')}>CC</a>:''}
                                    {(this.state.displayBccEmail==false)?<a  onClick={()=>this.displayBox('bccEmail')}>BCC</a>:''}
                                </div>
                            </div>
                            {(this.state.displayCcEmail==true)?<div className="form-group hidden bordered-left-4 bordered-themethirdcolor">
                                <label htmlFor="cc">CC:</label>
                                <input
                                 ref={(input) => { this.ccEmailInput = input; }} 
                                type="text" name="ccEmail" onChange={this.handleChange} value={this.state.ccEmail} className="form-control" id="cc" tabIndex="2"/>
                            </div>:''}
                            {(this.state.displayBccEmail==true)?<div className="form-group hidden bordered-left-4 bordered-themefourthcolor">
                                <label htmlFor="bcc">BCC:</label>
                                <input
                                 ref={(input) => { this.bccEmailInput = input; }} 
                                 type="text" name="bccEmail" onChange={this.handleChange} value={this.state.bccEmail} className="form-control" id="bcc" tabIndex="2"/>
                            </div>:''}
                            <div className="form-group bordered-left-4 bordered-themesecondary">
                                <label htmlFor="subject">Subject:</label>
                                {(this.state.mailFormType=='compose')?<input required type="text" onChange={this.handleChange} name="subject" value={this.state.subject} className="form-control" id="subject" tabIndex="1"/>:
                                <input readOnly type="text"  name="subject" value={ArrayHelper.getValue(this.props.mailDetail,'mailData.subject')} className="form-control" id="subject" tabIndex="1"/>}
                                <div className="field-options">
                                    {(this.props.ImportanceType=='High')?<a><i className="fa-solid fa-exclamation text-danger"></i></a>:''}
                                </div>
                            </div>
                            <div className="appEditor">
                            <Editor
                            value={this.state.emailContent}
          tools={[
            [Bold, Italic, Underline],
            [Undo, Redo],
            [Link, Unlink],
            [AlignLeft, AlignCenter, AlignRight],
            [OrderedList, UnorderedList, Indent, Outdent],
            [FindAndReplace, Pdf],
          ]}
          
          name="emailContent"
          onChange={this.handleChangeEditor}
        />
          
    </div>
                            
                            <div className="d-flex mailSend">
                                <button type="submit" className="btn btn-primary me-2">Send</button>
                                {(this.props.disPlayRight=='compose' || this.props.disPlayRight=='forward')?<button onClick={()=>this.DiscardMail()} type="button" className="btn btn-outlined me-4">Discard</button>:''}
                                {/* <div className="align-self-center me-4"><a href="#"><i className="fa-solid fa-paperclip"></i></a></div>
                                <div className="align-self-center me-4"><a href="#"><i className="fa-regular fa-image"></i></a></div>
                                <div className="align-self-center me-4"><a href="#"><i className="fa-solid fa-face-smile"></i></a></div> */}
                            </div>
                      
                       {(this.state.mailFormType!='compose')?<div className="list-group-item-text mb-0 fs" dangerouslySetInnerHTML={{ __html: ArrayHelper.getValue(this.props.mailDetail,'mailData.body.content') }} />:''}
                    </div>
                    </form>
                </div>
            </div>
            </React.Fragment>
        )
    }
}  


  
  export default  EmailFormComponent;