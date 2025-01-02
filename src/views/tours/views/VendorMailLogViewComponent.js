import React from "react";
import SettingApi from "../../../api/Setting.api";
import {ArrayHelper} from "../../../helpers/arrayhelper";
import MailDetailComponent from "./MailDetailComponent";
import MailComposeFormComponent from './MailComposeFormComponent';
import MailLogListComponent from './MailLogListCompoent';

class VendorMailLogViewComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loader:false,mailLogModelList:[],selectedMailLogContent:{},mailType:'',displayType:'vendor'};
    }
    componentDidMount()
    {
        
        this.getMailLogList()
    }
    getMailLogList= async() => { 
        let data={
            "tourRecordId": ArrayHelper.getValue(this.props.toursData,'id')
        }
       let response= await SettingApi.PostSettingList(data,'/api/MailLog/GetVendorLogByTourId');
       if(ArrayHelper.getValue(response,'isSuccess')==true)
       {
          this.setState({mailLogModelList:ArrayHelper.getValue(response,'mailLogModel')})
       }
    }
    viewMailDisplay(e1,e2)
    {
        this.setState({selectedMailLogContent:e1,mailType:e2})  
    }
    render(){
      
        return(
          
            <React.Fragment>
                 <div  className={`border-box ${(this.props.selectedTab!='vendorMailLog')?'hide':''}`}>
                 <div className="col" onClick={()=>{this.setState({selectedMailLogContent:{},mailType:'Compose'})}}>
                            <button type="button" data-bs-toggle="modal" data-bs-target={`#selectedMailComposeForm${this.state.displayType}`} className="btn btn-primary ps-4 pe-4 ComposeWidth">
                                <i className="fa-solid fa-pen-to-square"></i> Compose</button>
                        </div>
                        <br/>
                        <MailLogListComponent mailLogModelList={this.state.mailLogModelList} 
                 displayType={this.state.displayType}
                 viewMailDisplay={(e1,e2)=>this.viewMailDisplay(e1,e2)}
                  /> 

                                <MailDetailComponent 
                  selectedMailLogContent={this.state.selectedMailLogContent}
                  displayType={this.state.displayType}
                 />
                   <MailComposeFormComponent 
                     toursData={this.props.toursData}
                    displayType={this.state.displayType}
                 vendorList={this.props.vendorList}
                 mailType={this.state.mailType}
                  selectedMailLogContent={this.state.selectedMailLogContent}
                 />             
                 </div>   
            </React.Fragment>
        )
    }
}  



export default  VendorMailLogViewComponent;