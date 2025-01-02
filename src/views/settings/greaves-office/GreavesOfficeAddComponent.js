import React from "react";
import LoaderComponent from "../../../components/LoaderComponent";
import {USER_ID} from '../../../helpers/constants';
import {ArrayHelper} from "../../../helpers/arrayhelper";
import SettingApi from "../../../api/Setting.api";

class GreavesOfficeAddComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {loader:false,"name": "","message":'',"messageType":''};
    }
    handleChange = (e) => {
        const name = e.target.name;
        let  value = e.target.value;  
            
        this.setState({ ...this.state, [name]: value });
        }
    submit = async(event: any) => {
        event.preventDefault();
        let error='';
        if(error=="" && this.state.name!='' && this.state.name.length<4)
                {
                     alert('Please provide atleast 4 character of name.')
                    error='yes';
                 }
                 if(error=="")   
        { 
      this.setState({loader:true})
      
        let formData={
          "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
          "greavesOffice": {
            "id": 0,
            "name": this.state.name
          }
        }
        let response= await SettingApi.PostSettingList(formData,'/api/GreavesOffice/Add');
        if(ArrayHelper.getValue(response,'isSuccess')==true)
        {
          this.setState({loader:false,'name':'','message':"Greaves Office has been added",'messageType':'success'})
           this.props.getGreavesOfficeList();
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
               
                <div className="modal fade" id="greavesOfficeAdd" data-bs-keyboard="false" data-bs-backdrop="static">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h3 className="modal-title" id="exampleModalLabel">Add Greaves Office</h3>
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
                                    <label  className="form-label">Greaves Office Name </label>
                                    <input maxLength={50} required  type="text" className="form-control form-noradious" name="name" value={this.state.name} onChange={this.handleChange} placeholder="Enter Greaves Office Name"/>
                                  
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




export default  GreavesOfficeAddComponent;

