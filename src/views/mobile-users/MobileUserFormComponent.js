import React from "react";
import LoaderComponent from "../../components/LoaderComponent";
import {USER_ID} from '../../helpers/constants';
import {ArrayHelper} from "../../helpers/arrayhelper";
import SettingApi from "../../api/Setting.api";
declare var $;
class MobileUserFormComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {loader:false,'travelerID':'',"firstName":'',"lastName":'',"email":'','password':'',
        'agencyCode':'1B6G-T','accountNumber':'','company':'','phone':'','wetu':''};
    }
    
    handleChange = (e) => {
        const name = e.target.name;
        let  value = e.target.value;
        this.setState({ ...this.state, [name]: value });
        }
    submit = async(event: any) => {
        event.preventDefault();
        let error='';
       if(error=="" && this.state.firstName!='' && this.state.firstName.length<3)
                {
                     alert('Please provide atleast 3 character of first name.')
                    error='yes';
                 }
                else if(error=="" && this.state.lastName!='' && this.state.lastName.length<3)
                {
                     alert('Please provide atleast 3 character of last name.')
                    error='yes';
                 }
                 else if(error=="" && this.state.company!='' && this.state.company.length<3)
                {
                     alert('Please provide atleast 3 character of company.')
                    error='yes';
                 }
                 else if(error=="" && this.state.phone!='' && this.state.phone.length<10)
                {
                     alert('Please provide atleast 10 character of phone.')
                    error='yes';
                 }
         if(error=="")
         {        
        let formData={
            "travelerID":(this.props.formType=='add')?"":this.state.travelerID,
            "firstName": this.state.firstName, 
            "lastName": this.state.lastName, 
            "email": this.state.email,
            "password": this.state.password, 
            "company": this.state.company,  
            "phone": this.state.phone, 
            "wetu": 'https://itin.greavesindia.com/Itinerary/Landing/'+this.state.wetu, 
          "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
         
        }
       
        this.setState({loader:true});
      if(this.props.formType=='add')
      {
       let response= await SettingApi.PostSettingList(formData,'/api/AppUser/Add');
       if(ArrayHelper.getValue(response,'isSuccess')==true)
       {
         this.setState({loader:false,'id':'',"action":'',"firstName":'',"lastName":'',"suffixName":'',"email":'','password':'',
         'agencyCode':'','accountNumber':'','company':'','phone':'','wetu':'','message':"Mobile User has been added",'messageType':'success'})
          this.props.getMobileUserList();
       }
       else
       {
         this.setState({loader:false,'message':ArrayHelper.getValue(response,'message'),'messageType':'error'})
       }
      }
      else if(this.props.formType=='update')
      {
       let response= await SettingApi.PostSettingList(formData,'/api/AppUser/Update');
       if(ArrayHelper.getValue(response,'isSuccess')==true)
       {
         this.setState({loader:false,'message':"Mobile User  has been Updated",'messageType':'success'})
         response= Object.assign({},response,{firstName:ArrayHelper.getValue(response,'name.first'),'lastName':ArrayHelper.getValue(response,'name.last'),wetuUrl:ArrayHelper.getValue(formData,'wetu')})
         this.props.updatedMobileUserList(response);
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
    }
    componentWillReceiveProps()
    {
        setTimeout(() => {
         console.log('this.props.selectedMobileUser',this.props.selectedMobileUser)
         if(ArrayHelper.getValue(this.props.selectedMobileUser,'travelerID')!='')
         {
            this.setState({ 
            "travelerID": ArrayHelper.getValue(this.props.selectedMobileUser,'travelerID'),   
            "firstName": ArrayHelper.getValue(this.props.selectedMobileUser,'firstName'),
            "lastName": ArrayHelper.getValue(this.props.selectedMobileUser,'lastName'),
            "email": ArrayHelper.getValue(this.props.selectedMobileUser,'email'),
            "agencyCode": ArrayHelper.getValue(this.props.selectedMobileUser,'agencyCode'),
            "company": ArrayHelper.getValue(this.props.selectedMobileUser,'company'),
            "phone": ArrayHelper.getValue(this.props.selectedMobileUser,'phone'),
            "wetu": ArrayHelper.getValue(this.props.selectedMobileUser,'wetu')
            });
        }
            },100);
    }
 
    render(){
        let inputProps={
            required: true,
        }
        return(
            <React.Fragment>
                <LoaderComponent loader={this.state.loader}/>
                <form  method="post" onSubmit={this.submit}>
      <div className="row CreateTrip">
      {(this.state.message!='')?<p  className={`updateMessage ${(this.state.messageType=='success')?'message-green':'message-red'}`}>{this.state.message}</p>:''}
      
      <div className="col-md-6">
                               
                                <div className="mb-3">
                                    <label  className="form-label"> First Name </label>
                                    <input maxLength={20} required  type="text" className="form-control form-noradious" name="firstName" value={this.state.firstName} onChange={this.handleChange} placeholder="Enter First Name"/>
                                </div>
                            </div>
                           
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label"> Last Name </label>
                                    <input maxLength={20} required  type="text" className="form-control form-noradious" name="lastName" value={this.state.lastName} onChange={this.handleChange} placeholder="Enter Last Name"/>
                                </div>
                            </div>
                            
                              <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label"> Email </label>
                                    <input required  type="email" className="form-control form-noradious" name="email" value={this.state.email} onChange={this.handleChange} placeholder="Enter Email"/>
                                </div>
                            </div>
                            
                            {/* <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label"> Agency Code </label>
                                    <input required  type="text" className="form-control form-noradious" name="agencyCode" value={this.state.agencyCode} onChange={this.handleChange} placeholder="Enter Agency Code"/>
                                </div>
                            </div> */}
                            {/* <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label"> Account Number </label>
                                    <input required  type="text" className="form-control form-noradious" name="accountNumber" value={this.state.accountNumber} onChange={this.handleChange} placeholder="Enter Account Number "/>
                                </div>
                            </div> */}
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label"> Company </label>
                                    <input maxLength={50} required  type="text" className="form-control form-noradious" name="company" value={this.state.company} onChange={this.handleChange} placeholder="Enter Company "/>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label"> Phone </label>
                                    <input maxLength={20} required  type="text" className="form-control form-noradious" name="phone" value={this.state.phone} onChange={this.handleChange} placeholder="Enter Phone "/>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label">WETU Id </label>
                                    <input required  type="text" className="form-control form-noradious" name="wetu" value={this.state.wetu} onChange={this.handleChange} placeholder="Enter WETU Id "/>
                                </div>
                            </div>
                            
                            <div className="col-md-12 text-end">
                            <div className="mb-3">
                                <button type="submit" className="btn btn-primary me-2">{(this.props.formType=='add')?'Submit':'Update'}</button>
                            </div> 
                            </div>                     
                       
                           
                        </div>
                        </form>
            </React.Fragment>
        )
    }
}  






export default MobileUserFormComponent

