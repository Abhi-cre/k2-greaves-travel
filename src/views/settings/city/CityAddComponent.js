import React from "react";
import LoaderComponent from "../../../components/LoaderComponent";
import {USER_ID} from '../../../helpers/constants';
import {ArrayHelper} from "../../../helpers/arrayhelper";
import SettingApi from "../../../api/Setting.api";
declare var $;

class CittyAddComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {loader:false, "stateId":'' ,"cityId" : '' ,"countryId" : '' , cityList :[],"name": "","message":'',"messageType":''};
    }
    handleChange = (e) => {
        const name = e.target.name;
        let  value = e.target.value;  
              
        this.setState({ ...this.state, [name]: value });
        }
        componentWillMount(){
          setTimeout(() => {
            
            this.setState({cityList : this.props.cityListAll}) 
           
              
          }, 2000);
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
          "city": {
            "cityId": 0,
            "cityName": this.state.name,
            "stateId": parseInt(this.state.stateId),
            "stateName": "",
            "countryId": parseInt(this.state.countryId),
            "countryName": ""
          }
        }
        let response= await SettingApi.PostSettingList(formData,'/api/City/Add');
        if(ArrayHelper.getValue(response,'isSuccess')==true)
        {
          this.setState({loader:false,'name':'','message':"City has been added",'messageType':'success'})
           this.props.getCityList();
           setTimeout(()=>{
            this.setState({"message":''});
            $(".close").click();
           },1000)
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
               
                <div className="modal fade" id="cityAdd" data-bs-keyboard="false" data-bs-backdrop="static">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h3 className="modal-title" id="exampleModalLabel">Add City</h3>
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
                                    <label  className="form-label">Country </label>
                                    <select required className="form-select form-noradious" name="countryId" value={this.state.countryId} onChange={this.handleChange} >
                                        
                                      <option value="">Select Country</option>
                                      {this.props.countryList.map((item,key)=>{
                                        return(<option  key={`countryId-${key}`}  value={ArrayHelper.getValue(item,'countryId')}>{ArrayHelper.getValue(item,'countryName')}</option>)
                                      })}
                                      </select>
                                </div>
                            </div>
      <div className="col-md-12">
                                <div className="mb-3">
                                    <label  className="form-label">State Name </label>
                                    <select required className="form-select form-noradious" name="stateId" value={this.state.stateId} onChange={this.handleChange} >
                                        
                                      <option value="">Select State</option>
                                      {this.props.stateList.filter((_it)=>_it.countryId == this.state.countryId).map((item,key)=>{
                                        return(<option  key={`stateList-${key}`}  value={ArrayHelper.getValue(item,'stateId')}>{ArrayHelper.getValue(item,'stateName')}</option>)
                                      })}
                                      </select>
                                  
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="mb-3">
                                    <label  className="form-label">City Name </label>
                                    <input maxLength={50} required  type="text" className="form-control form-noradious" name="name" value={this.state.name} onChange={this.handleChange} placeholder="Enter City Name"/>
                                  
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




export default  CittyAddComponent;

