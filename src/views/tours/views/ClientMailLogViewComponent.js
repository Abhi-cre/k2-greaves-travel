import React from "react";
import SettingApi from "../../../api/Setting.api";
import {ArrayHelper} from "../../../helpers/arrayhelper";
import MailDetailComponent from "./MailDetailComponent";
import MailComposeFormComponent from "./MailComposeFormComponent";
import MailLogListComponent from './MailLogListCompoent';
class ClientMailLogViewComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loader:false,mailLogModelList:[],selectedMailLogContent:{},mailType:'',displayType:'client'};
    }
    componentDidMount()
    {
        
        this.getMailLogList()
    }
    getMailLogList= async() => { 
        let data={
            "tourRecordId": ArrayHelper.getValue(this.props.toursData,'id')
        }
       let response= await SettingApi.PostSettingList(data,'/api/MailLog/GetaMailLogByTourRecordId');
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
                 <div  className={`border-box ${(this.props.selectedTab!='clientMailLog')?'hide':''}`}>
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
                 vendorList={this.props.vendorList}
                 mailType={this.state.mailType}
                  selectedMailLogContent={this.state.selectedMailLogContent}
                  displayType={this.state.displayType}
                 />
                                
                 </div>   
            </React.Fragment>
        )
    }
}  



export default  ClientMailLogViewComponent;