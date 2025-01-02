import React from "react";
import LoaderComponent from "../../../components/LoaderComponent";
import {USER_ID} from '../../../helpers/constants';
import {ArrayHelper} from "../../../helpers/arrayhelper";
import SettingApi from "../../../api/Setting.api";

class VenderTypeAddComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {loader:false,"name": "","calculationType":0 ,"message":'',"messageType":''};
    }
    handleChange = (e) => {
        const name = e.target.name;
        let  value = e.target.value;   
             
        this.setState({ ...this.state, [name]: value });
        }
    submit = async(event: any) => {
        event.preventDefault();
        let error='';
        if(error=="" && this.state.name!='' && this.state.name.length<3)
        {
             alert('Please provide atleast 3 character of name.')
            error='yes';
         }
         if(error=="")   
{ 
      this.setState({loader:true})
      
        let formData={
          "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
          "vendorType": {
            "id": 0,
            "name": this.state.name,
            "calculationType":parseInt(this.state.calculationType)
          }
        }
        let response= await SettingApi.PostSettingList(formData,'/api/VendorType/Add');
        if(ArrayHelper.getValue(response,'isSuccess')==true)
        {
          this.setState({loader:false,'name':'','message':"Vendor Type has been added",'messageType':'success'})
           this.props.getVendorTypeList();
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
               
                <div className="modal fade" id="vendorTypeAdd" data-bs-keyboard="false" data-bs-backdrop="static">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h3 className="modal-title" id="exampleModalLabel">Add Vendor Type</h3>
        <button type="button" className="close"  data-bs-dismiss="modal"  aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
      <LoaderComponent loader={this.state.loader}/>
      <form  method="post" onSubmit={this.submit}>
      <div className="row CreateTrip">
      {(this.state.message!='')?<p  className={`updateMessage ${(this.state.messageType=='success')?'message-green':'message-red'}`}>{this.state.message}</p>:''}
      <div className="col-md-12">
                                <div className="mb-3">
                                    <label  className="form-label">Vendor Type Name </label>
                                    <input maxLength={50} required  type="text" className="form-control form-noradious" name="name" value={this.state.name} onChange={this.handleChange} placeholder="Enter Vendor Type Name"/>
                                  
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="mb-3">
                                    <label  className="form-label">Calculation Type </label>
                                    <select required className="form-select form-noradious" name="calculationType" value={this.state.calculationType} onChange={this.handleChange} >
                                        
                                        <option value="0">None</option>
                                        <option value="1">PerDay </option>
                                        <option value="2">PerNeight </option>
                                        </select>
                                  
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




export default  VenderTypeAddComponent;

