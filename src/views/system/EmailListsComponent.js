import React from "react";
import {formatDate} from "../../vendor/datefns";
import OutLookApi from '../../api/Outlook.api';
import {ArrayHelper} from '../../helpers/arrayhelper';
import { set } from "date-fns";
class EmailListsComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {emailLists:[],selectedEmailLists:[],selectedId:''};
    }
    componentWillReceiveProps(nextProps) {
       
       
        this.setState({selectedEmailLists:nextProps.selectedEmailListsData})
        setTimeout(()=>{
            this.getPagingNamtion()
        })
    }
    componentDidMount()
    {
        this.setState({selectedEmailLists:this.props.selectedEmailListsData})
     
        setTimeout(()=>{
            this.getPagingNamtion()
        })
    }
    getPagingNamtion()
    {
      
        if(this.state.selectedEmailLists.length>0)
        {
            let emailLists = [];
            let start=(this.props.page -1)*this.props.mailCount;
            let end= start + this.props.mailCount
            for (let i=start; i < end; i++) {
          if (ArrayHelper.getValue(this.state.selectedEmailLists[i],'id')!='') {
            emailLists.push(this.state.selectedEmailLists[i]);
          }
        }
           this.setState({emailLists:emailLists})
        }
        else
        {
            this.setState({emailLists:[]})   
        }
    }
 dateValue(dd)
{
    let dateval = new Date(dd);      
        dateval = new Date(dateval);
        let startTime=dateval.getTime();
  let datevalcurrent = new Date();      
  datevalcurrent = new Date(datevalcurrent);
        let currentTime=datevalcurrent.getTime();
    let timeDiffrent= (currentTime - startTime)/3600000;
    if(timeDiffrent<24)
    {
        return 'Today';
    }
    else if(timeDiffrent<48)
    {
        return 'Yesterday';
    }
    else
    {
        return formatDate(dd,'MMM dd, yyyy')
    }
   
    

}
selectedMail(item,colorClass,e3)
{
    
    let emailLists=this.state.emailLists;
    if(item.isRead==false)
    {  this.props.increaseDescriseCount(1,'minus')
        OutLookApi.MarkRead([item.id])
    emailLists=emailLists.map((_item)=>{
      if(_item.id==item.id)
      {
        _item.isRead=true;
        return _item;
      }
      return _item;
    })
}
  this.setState({emailLists:emailLists,selectedId:item.id})
  this.props.selectedMail(item,colorClass,e3)
}

    render(){
    
        return(
            <React.Fragment>
             <div className="sidebar">
                <div className="emailList">
                    {/* <div className="card-body chat-fixed-search">
                        <fieldset className="form-group position-relative has-icon-left m-0 pb-1">
                            <input type="text" className="form-control" id="iconLeft4" placeholder="Search email"/>
                            <div className="form-control-position">
                                <i className="ft-search"></i>
                            </div>
                        </fieldset>
                    </div> */}
                    {(this.state.emailLists.length>0)?<div id="users-list" className="list-group ps-container ps-theme-dark ps-active-y"
                        data-ps-id="39411a08-40f0-819d-6b93-15c1dc0ab688">
                        <div className="users-list-padding media-list">
                            {this.state.emailLists.map((_item,key)=>{
                                let colorClass='';
                                if(key%7==0)
                                {
                                    colorClass='bg-info';  
                                }
                                else if(key%7==1)
                                {
                                    colorClass='bg-danger';  
                                }
                                else if(key%7==2)
                                {
                                    colorClass='bg-warning';  
                                }
                                else if(key%7==3)
                                {
                                    colorClass='bg-success';  
                                }                                
                                else if(key%7==4)
                                {
                                    colorClass='bg-secondary';  
                                }
                                else if(key%7==5)
                                {
                                    colorClass='bg-primary';  
                                }
                                else if(key%7==6)
                                {
                                    colorClass='bg-dark';  
                                }
                                let chechId='No';
                                if(this.props.selectedIdList.includes(_item.id)==true)
                                {
                                    chechId='Yes';
                                }
                                return(<div   key={`email-${key}`} className={`media ${(this.state.selectedId==_item.id)?'selected':''}`}>
                                     <a onClick={()=>this.props.selectedMailId(_item.id,chechId)}>
                                <div className="media-left pr-1">
                                    <span className="avatar avatar-md">
                                        <span className={`media-object rounded-circle text-circle ${colorClass} ${(this.props.selectedIdList.includes(_item.id)==true)?'checklist':''} `}>{(this.props.selectedIdList.includes(_item.id)==true)?<i className="fa-solid fa-circle-check"></i>:ArrayHelper.getValue(_item,'from.emailAddress.name').substring(0, 1)}</span>
                                    </span>
                                </div>
                                </a>
                                <a  onClick={()=>this.selectedMail(_item,colorClass,key)}>
                                <div className="media-body w-100">
                                    <h6 className={`list-group-item-heading text-bold-500 ${(ArrayHelper.getValue(_item,'isRead')==true)?'normalClass':''}`}>{ArrayHelper.getValue(_item,'from.emailAddress.name')}
                                        <span className="float-right">
                                            <span className={`font-small-2 primary me-3`}>{(ArrayHelper.getValue(_item,'receivedDateTime')!='')?this.dateValue(ArrayHelper.getValue(_item,'receivedDateTime')):''}</span>
                                            <span className="font-small-2 primary">{(ArrayHelper.getValue(_item,'receivedDateTime')!='')?formatDate(ArrayHelper.getValue(_item,'receivedDateTime'),'hh:mm a'):''}  {(ArrayHelper.getValue(_item,'importance')=='high')?<i className="fa-solid fa-exclamation text-danger"></i>:''}</span>
                                            {/* <br/>
                                            <span
                                                className="font-small-2 catg-labal filter-labal-work float-right">Work</span> */}
                                        </span>
                                    </h6>
                                    <p className={`list-group-item-text text-truncate mb-1 ${(ArrayHelper.getValue(_item,'isRead')==false)?'boldClass':''}`}>{(ArrayHelper.getValue(_item,'subject')!=null)?ArrayHelper.getValue(_item,'subject').substring(0, 30):''}{(ArrayHelper.getValue(_item,'subject')!=null)?((ArrayHelper.getValue(_item,'subject').length>30)?'...':''):''}</p>
                                    <p className="list-group-item-text mb-0 fs fs">{(ArrayHelper.getValue(_item,'bodyPreview')!=null)?ArrayHelper.getValue(_item,'bodyPreview').substring(0, 50):''}...
                                        
                                    </p>
                                    {(ArrayHelper.getValue(_item,'hasAttachments')==true)?<p className="list-group-item-text mb-0 mt-2 fs text-blue">
                                        <i className="fa-paperclip fa"></i>{(ArrayHelper.getValue(_item,'attechmentLists').length>0)?<spnan>{ArrayHelper.getValue(_item,'attechmentLists').length}</spnan>:''} Attachments
                                    </p>:''}
                                </div>
                                </a>
                            </div>)
                            })}
                           
                         

                        </div>
                        <div className="ps-scrollbar-x-rail" style={{'left': '0px','bottom':'3px'}}>
                            <div className="ps-scrollbar-x" tabIndex={0} style={{'left':'0px','width':'0px'}}></div>
                        </div>
                        <div className="ps-scrollbar-y-rail" style={{'top':'0px','height':'494px','right':'3px'}}>
                            <div className="ps-scrollbar-y" tabIndex={0} style={{'top':'0px','height':'158px'}}></div>
                        </div>
                    </div>:''}
                </div>
            </div>
            </React.Fragment>
        )
    }
}  



  export default  EmailListsComponent ;