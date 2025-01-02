import React from "react";
import LoaderComponent from "../../../components/LoaderComponent";
import {USER_ID} from '../../../helpers/constants';
import {ArrayHelper} from "../../../helpers/arrayhelper";
import SettingApi from "../../../api/Setting.api";

class AppSettingAddComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {loader:false,"settingName": "","settingValue": "","message":'',"messageType":''};
    }
    handleChange = (e) => {
        const name = e.target.name;
        let  value = e.target.value; 
             
        this.setState({ ...this.state, [name]: value });
        }
    submit = async(event: any) => {
        event.preventDefault();
        let error='';
        if(error=="" && this.state.settingName!='' && this.state.settingName.length<3)
        {
             alert('Please provide atleast 3 character of Setting Name.')
            error='yes';
         }
         if(error=="")   
         { 
      this.setState({loader:true})
      
        let formData={
          "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
          "appSetting": {
            "id": 0,
            "settingName": this.state.settingName,
            "settingValue": this.state.settingValue
          }
        }
        let response= await SettingApi.PostSettingList(formData,'/api/AppSetting/Add');
        if(ArrayHelper.getValue(response,'isSuccess')==true)
        {
          this.setState({loader:false,'settingName':'','settingValue':'','message':"App Setting has been added",'messageType':'success'})
           this.props.getappSettingList();
        }
        else
        {
          this.setState({loader:false,'message':ArrayHelper.getValue(response,'message'),'messageType':'error'})
        }
      }
    }

    render(){
        return(
            <React.Fragment>
               
                <div className="modal fade" id="AppSettingAdd" data-bs-keyboard="false" data-bs-backdrop="static">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h3 className="modal-title" id="exampleModalLabel">Add App Setting</h3>
        <button type="button" className="close"  data-bs-dismiss="modal"  aria-label="Close">
        <i class="fa-solid fa-xmark"></i>   </button>
      </div>
      <div className="modal-body">
      <LoaderComponent loader={this.state.loader}/>
      <form  method="post" onSubmit={this.submit}>
      <div className="row CreateTrip">
      {(this.state.message!='')?<p  className={`updateMessage ${(this.state.messageType=='success')?'message-green':'message-red'}`}>{this.state.message}</p>:''}
      <div className="col-md-12">
                                <div className="mb-3">
                                    <label  className="form-label">Setting Name </label>
                                    <input maxLength={20} required  type="text" className="form-control form-noradious" name="settingName" value={this.state.settingName} onChange={this.handleChange} placeholder="Enter Setting Name"/>
                                  
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="mb-3">
                                    <label  className="form-label">Setting Value </label>
                                    <input maxLength={10} required  type="text" className="form-control form-noradious" name="settingValue" value={this.state.settingValue} onChange={this.handleChange} placeholder="Enter Setting Value"/>
                                  
                                </div>
                            </div>
                            <div className="col-md-12 text-end">
                            <div className="mb-3">
                                <button type="submit" className="btn btn-primary me-2">Submit</button>
                            </div> 
                            </div>                     
                       
                           
                        </div>
                        </form>
      </div>
      
    </div>
  </div>
</div>
            </React.Fragment>
        )
    }
}  




export default  AppSettingAddComponent;

