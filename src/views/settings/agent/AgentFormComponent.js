import React from "react";
import {connect} from 'react-redux';
import * as actionTypesUser from "../../../store/action/settings.action";
import LoaderComponent from "../../../components/LoaderComponent";
import {USER_ID,DATEFORMTEOFDATE} from '../../../helpers/constants';
import {ArrayHelper} from "../../../helpers/arrayhelper";
import SettingApi from "../../../api/Setting.api";
import {formatDate} from "../../../vendor/datefns";

declare var $;
class AgentFormComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {loader:false,agentTypeList:[],agencyList:[],contactChannelList:[], countryList :[], cityList:[] , stateList : [] ,'id':'',"agencyId":'',"agentTypeId":'',"agentContactChannelId":'',"courtesyTitle":'','fname':'','cityId' :'','stateId':'','countryId':'',
        'mname':'','lname':'','title':'','dob':'','address':'','cityName':'','stateName':'','zip':'','countryName':'','contactNo':'',"email":'',"specialties":'','logo':''};
    }
    componentDidMount()
    {
       
        this.dataTypeList()

        $(".agentDOB").datepicker({maxDate:"-18y",changeMonth: true, changeYear: true, yearRange: '1900:-18'})
        .on("change", (e: any) => {
           this.setState({dob:e.target.value})
        });   
    }

    dataTypeList=async()=>
    {

        let countryListData=this.props.countryListData;
        if(countryListData.length>0)
        {
            this.setState({countryList:countryListData})
        }
        else
        {
            this.setState({loader:true});
          let response= await SettingApi.GetSettingList('/api/City/CountryList');
        if(ArrayHelper.getValue(response,'isSuccess')== true)
        {
            this.setState({loader:false,countryList:ArrayHelper.getValue(response,'countries')});
          this.props.countryListInfo(ArrayHelper.getValue(response,'countries'));
        }
        }

        let cityListData=this.props.cityListData;
        if(cityListData.length>0)
        {
            this.setState({cityList:cityListData})
        }
        else
        {
            this.setState({loader:true});
          let response= await SettingApi.GetSettingList('/api/City/List');
        if(ArrayHelper.getValue(response,'isSuccess')== true)
        {
            this.setState({loader:false,cityList:ArrayHelper.getValue(response,'cities')});
          this.props.cityListInfo(ArrayHelper.getValue(response,'cities'));
        }
        }

        let stateListData=this.props.stateListData;
        if(stateListData.length>0)
        {
            this.setState({stateList:stateListData})
        }
        else
        {
            this.setState({loader:true});
            let responseSate= await SettingApi.GetSettingList('/api/State/List');
              if(ArrayHelper.getValue(responseSate,'isSuccess')== true)
              {
                this.setState({loader:false,stateList:ArrayHelper.getValue(responseSate,'states')})
                this.props.stateListInfo(ArrayHelper.getValue(responseSate,'states'));
              }
              else
              {
                this.setState({loader:false})
              }
        }


        let agentTypeListData=this.props.agentTypeListData;
        if(agentTypeListData.length>0)
        {
            this.setState({agentTypeList:agentTypeListData})
        }
        else
        {
            this.setState({loader:true});
          let response= await SettingApi.GetSettingList('/api/AgentType/List');
        if(ArrayHelper.getValue(response,'isSuccess')== true)
        {
            this.setState({loader:false,agentTypeList:ArrayHelper.getValue(response,'agentTypes')});
            this.props.agentTypeListInfo(ArrayHelper.getValue(response,'agentTypes'));
        }
        }

        let agencyListData=this.props.agencyListData;
        if(agencyListData.length>0)
        {
            this.setState({agencyList:agencyListData})
        }
        else
        {
            this.setState({loader:true});
            let response= await SettingApi.GetSettingList('/api/Agency/List');
        if(ArrayHelper.getValue(response,'isSuccess')== true)
        {
            this.setState({loader:false,agencyList:ArrayHelper.getValue(response,'agencies')});
            this.props.agencyListInfo(ArrayHelper.getValue(response,'agencies'));
        }
       }
       let contactChannelListData=this.props.contactChannelListData;
       if(contactChannelListData.length>0)
       {
           this.setState({contactChannelList:contactChannelListData})
       }
       else
       {
           this.setState({loader:true});
           let response= await SettingApi.GetSettingList('/api/ContactChannel/List');
       if(ArrayHelper.getValue(response,'isSuccess')== true)
       {
           this.setState({loader:false,contactChannelList:ArrayHelper.getValue(response,'contactChannels')});
           this.props.contactChannelListInfo(ArrayHelper.getValue(response,'contactChannels'));
       }
      }
    }
    handleChange = (e) => {
        const name = e.target.name;
        let  value = e.target.value;               
        this.setState({ ...this.state, [name]: value });
        }
    submit = async(event: any) => {
        event.preventDefault();
        let error='';
        if(error=="" && this.state.title!='' && this.state.title.length<2)
        {
            alert('Please provide atleast 2 character of title.')
            error='yes';
        }
        else if(error=="" && this.state.fname!='' && this.state.fname.length<3)
        {
            alert('Please provide atleast 3 character of first name.')
            error='yes';
        }
        else if(error=="" && this.state.lname!='' && this.state.lname.length<3)
        {
            alert('Please provide atleast 3 character of last name.')
            error='yes';
        }
        // else if(error=="" && this.state.cityName!='' && this.state.cityName.length<3)
        // {
        //     alert('Please provide atleast 3 character of city.')
        //     error='yes';
        // }
        // else if(error=="" && this.state.stateName!='' && this.state.stateName.length<3)
        // {
        //     alert('Please provide atleast 3 character of state.')
        //     error='yes';
        // }
        // else if(error=="" && this.state.country!='' && this.state.country.length<3)
        // {
        //     alert('Please provide atleast 3 character of country.')
        //     error='yes';
        // }
        // else if(error=="" && this.state.dob=='')
        // {
        //     alert('Please provide DOB of agent.')
        //     error='yes';
        // }
        else if(error=="" && this.state.contactNo!='' && this.state.contactNo.length<10)
        {
            alert('Please provide atleast 10 character of contact No.')
            error='yes';
        }
        else if(error=="" && this.state.zip!='' && this.state.zip.length<5)
        {
            alert('Please provide atleast 5 character of zip.')
            error='yes';
        }
       
        if(error=="")
        {
        let formData={
          "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
          "agent": {
            "id":(this.props.formType=='add')?0:parseInt(this.state.id),
            "agencyId": parseInt(this.state.agencyId),
            "agentTypeId": parseInt(this.state.agentTypeId),
            "agentContactChannelId": parseInt(this.state.agentContactChannelId),
            "courtesyTitle": this.state.courtesyTitle,
            "fname": this.state.fname, 
            "mname": this.state.mname, 
            "lname": this.state.lname, 
            "title": this.state.title, 
            "dob":(this.state.dob!='')?formatDate(this.state.dob,'yyyy-MM-dd'):'1753-01-01',         
             "address": this.state.address,
             "cityId":parseInt(this.state.cityId),
            "cityName": this.state.cityName,
            "stateId": parseInt(this.state.stateId),
              "stateName": this.state.stateName,
             "zip": this.state.zip,
             "countryId": parseInt(this.state.countryId),
           "countryName": this.state.countryName,
               "contactNo": this.state.contactNo,
             "email": this.state.email,
              "specialties": this.state.specialties,
              "logo": this.state.logo
          }
        }
        this.setState({loader:true});
        let elmnt=""; 
        elmnt = document.getElementById("agentMessage"+this.state.id);
        elmnt.scrollIntoView(false)
      if(this.props.formType=='add')
      {
       let response= await SettingApi.PostSettingList(formData,'/api/Agent/Add');
       if(ArrayHelper.getValue(response,'isSuccess')==true)
       {
         this.setState({loader:false,'id':'',"agencyId":'',"agentTypeId":'',"agentContactChannelId":'',"courtesyTitle":'','fname':'',
         'mname':'','lname':'','title':'','dob':'','address':'','cityId':'','stateId':'','countryId':'','cityName':'','stateName':'','zip':'','countryName':'','contactNo':'',"email":'',"specialties":'','logo':'','message':"Agent has been added",'messageType':'success'})
         setTimeout(() => {
            this.setState({"message":''});
            $(".close").click();
             this.props.getAgentList();
         }, 10);
       }
       else
       {
         this.setState({loader:false,'message':ArrayHelper.getValue(response,'message'),'messageType':'error'})
       }
      }
      else if(this.props.formType=='update')
      {
       let response= await SettingApi.PostSettingList(formData,'/api/Agent/Update');
       if(ArrayHelper.getValue(response,'isSuccess')==true)
       {
         this.setState({loader:false,'message':"Agent has been Updated",'messageType':'success'})
         this.props.updatedAgentList(ArrayHelper.getValue(response,'agents')[0]);
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
         
            this.setState({ 
            "id": ArrayHelper.getValue(this.props.selectedAgent,'id'),    
            "agencyId": ArrayHelper.getValue(this.props.selectedAgent,'agencyId'),
            "agentTypeId": ArrayHelper.getValue(this.props.selectedAgent,'agentTypeId'),
            "agentContactChannelId": ArrayHelper.getValue(this.props.selectedAgent,'agentContactChannelId'),
            "courtesyTitle": ArrayHelper.getValue(this.props.selectedAgent,'courtesyTitle'),
            "fname": ArrayHelper.getValue(this.props.selectedAgent,'fname'),
            "mname": ArrayHelper.getValue(this.props.selectedAgent,'mname'),
            "lname": ArrayHelper.getValue(this.props.selectedAgent,'lname'),
            "title": ArrayHelper.getValue(this.props.selectedAgent,'title'),
            "address": ArrayHelper.getValue(this.props.selectedAgent,'address'),
            "cityId": ArrayHelper.getValue(this.props.selectedAgent , 'cityId'),
            "stateId" : ArrayHelper.getValue(this.props.selectedAgent,'stateId'),
            "countryId" : ArrayHelper.getValue(this.props.selectedAgent , 'countryId'),
           
            "zip": ArrayHelper.getValue(this.props.selectedAgent,'zip'),
            "email":ArrayHelper.getValue(this.props.selectedAgent,'email'),
            "contactNo": ArrayHelper.getValue(this.props.selectedAgent,'contactNo'),
            "specialties": ArrayHelper.getValue(this.props.selectedAgent,'specialties'),
            "logo": ArrayHelper.getValue(this.props.selectedAgent,'logo'),
            "specialties": ArrayHelper.getValue(this.props.selectedAgent,'specialties'),
            "dob":(ArrayHelper.getValue(this.props.selectedAgent,'dob')!='' && ArrayHelper.getValue(this.props.selectedAgent,'dob')!='1753-01-01T00:00:00')?formatDate(ArrayHelper.getValue(this.props.selectedAgent,'dob'),'MM/dd/yyyy'):'',
            });
            },100);
    }
    handleTravelersInput(key: string, value: any) {
        if((key=='dob') &&   ArrayHelper.getValue(value,'_d')!='')
        {
         value= formatDate(value,'MM/dd/yyyy')
         this.setState({dob:value});
        }
       
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
  <p id={`agentMessage${this.state.id}`}  className={`updateMessage ${(this.state.messageType=='success')?'message-green':'message-red'}`}>{this.state.message}</p>
      <div className="col-md-3">
                                <div className="mb-3">
                                    <label  className="form-label"> Title </label>
                                    <input maxLength={5} required  type="text" className="form-control form-noradious" name="title" value={this.state.title} onChange={this.handleChange} placeholder="Enter Title"/>
                                </div>
                            </div>
      <div className="col-md-3">
                               
                                <div className="mb-3">
                                    <label  className="form-label"> First Name </label>
                                    <input maxLength={15} required  type="text" className="form-control form-noradious" name="fname" value={this.state.fname} onChange={this.handleChange} placeholder="Enter First Name"/>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="mb-3">
                                    <label  className="form-label"> Middle Name </label>
                                    <input maxLength={15}   type="text" className="form-control form-noradious" name="mname" value={this.state.mname} onChange={this.handleChange} placeholder="Enter Middle Name"/>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="mb-3">
                                    <label  className="form-label"> Last Name </label>
                                    <input maxLength={15} required  type="text" className="form-control form-noradious" name="lname" value={this.state.lname} onChange={this.handleChange} placeholder="Enter Last Name"/>
                                </div>
                            </div>
                            <div className="col-md-6">
                                  <div className="mb-3">
                                      <label  className="form-label">Agency</label>
                                      <select required className="form-select form-noradious" name="agencyId" value={this.state.agencyId} onChange={this.handleChange} >
                                        
                                      <option value="">Select Agency</option>
                                      {this.state.agencyList.map((item,key)=>{
                                        return(<option key={`agencyId-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'name')}</option>)
                                      })}
                                      </select>
                                  </div>
                              </div>
                              <div className="col-md-6">
                                  <div className="mb-3">
                                      <label  className="form-label">Agent Type</label>
                                      <select required className="form-select form-noradious" name="agentTypeId" value={this.state.agentTypeId} onChange={this.handleChange} >
                                        
                                      <option value="">Select Agent Type</option>
                                      {this.state.agentTypeList.map((item,key)=>{
                                        return(<option  key={`agentTypeId-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'name')}</option>)
                                      })}
                                      </select>
                                  </div>
                              </div> 
                              <div className="col-md-6">
                                  <div className="mb-3">
                                      <label  className="form-label">Contact Channel</label>
                                      <select required className="form-select form-noradious" name="agentContactChannelId" value={this.state.agentContactChannelId} onChange={this.handleChange} >
                                        
                                      <option value="">Select Contact Channel</option>
                                      {this.state.contactChannelList.map((item,key)=>{
                                        return(<option  key={`agentContactChannelId-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'name')}</option>)
                                      })}
                                      </select>
                                  </div>
                              </div> 
                              <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label"> Courtesy Title </label>
                                    <input maxLength={50} required  type="text" className="form-control form-noradious" name="courtesyTitle" value={this.state.courtesyTitle} onChange={this.handleChange} placeholder="Enter Courtesy Title"/>
                                </div>
                            </div>
                          
                            
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label">DOB </label>   
                                    
                                            <input readOnly id="" required type="text" placeholder="Enter DOB" className="agentDOB form-control" name="dob" value={this.state.dob}/>                              
                                    {/* <DatePicker timeFormat={false} inputProps={inputProps}   name="dob" value={this.state.dob} onChange={(date:Date) => this.handleTravelersInput('dob', date)} placeholder="Enter DOB" required  className="form-control formdate form-noradious"    /> */}
                                </div>
                            </div>
                           
                              
                            <div className="col-md-12">
                                <div className="mb-3">
                                    <label  className="form-label"> Address </label>
                                    <textarea maxLength={250}  required   className="form-control form-noradious" name="address" value={this.state.address} onChange={this.handleChange} placeholder="Enter Address"/>                                  
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label">Country </label>
                                    <select required className="form-select form-noradious" name="countryId" value={this.state.countryId} onChange={this.handleChange} >
                                        <option value="">Select Country</option>
                                        {this.state.countryList.map((item,key)=>{
                                          return(<option  key={`countryListData-${key}`}  value={ArrayHelper.getValue(item,'countryId')}>{ArrayHelper.getValue(item,'countryName')}</option>)
                                        })}
                                        </select>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label">State </label>
                                    <select required className="form-select form-noradious" name="stateId" value={this.state.stateId} onChange={this.handleChange} >
                                        
                                        <option value="">Select State</option>
                                        {this.state.stateList.filter((_it) => _it.countryId == this.state.countryId).map((item,key)=>{
                                          return(<option  key={`stateList-${key}`}  value={ArrayHelper.getValue(item,'stateId')}>{ArrayHelper.getValue(item,'stateName')}</option>)
                                        })}
                                        </select>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label">City </label>
                                    <select required className="form-select form-noradious" name="cityId" value={this.state.cityId} onChange={this.handleChange} >
                                        
                                      <option value="">Select City</option>
                                      {this.state.cityList.filter((_it)=>_it.stateId==this.state.stateId).map((item,key)=>{
                                        return(<option  key={`cityId-${key}`}  value={ArrayHelper.getValue(item,'cityId')}>{ArrayHelper.getValue(item,'cityName')}</option>)
                                      })}
                                      </select>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label"> Zip Code </label>
                                    <input maxLength={6}  required  type="text" className="form-control form-noradious" name="zip" value={this.state.zip} onChange={this.handleChange} placeholder="Enter Zip Code"/>
                                  
                                </div>
                            </div>
                           
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label"> Contact No </label>
                                    <input maxLength={20}  required  type="text" className="form-control form-noradious" name="contactNo" value={this.state.contactNo} onChange={this.handleChange} placeholder="Enter Contact No"/>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label"> Email </label>
                                    <input required  type="email" className="form-control form-noradious" name="email" value={this.state.email} onChange={this.handleChange} placeholder="Enter Email"/>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="mb-3">
                                    <label  className="form-label"> Specialties </label>
                                    <textarea maxLength={250}    type="text" className="form-control form-noradious" name="specialties" value={this.state.specialties} onChange={this.handleChange} placeholder="Enter Specialties"/>
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






const mapStateToProps = state => {
    return {
        agentTypeListData : state.settingsData.agentTypeList,
        agencyListData : state.settingsData.agencyList,
        contactChannelListData : state.settingsData.contactChannelList,
        countryListData : state.settingsData.countryList,
        cityListData : state.settingsData.cityList,
        stateListData : state.settingsData.stateList,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        agentTypeListInfo:(data)=>dispatch({type: actionTypesUser.AGENT_TYPE_LIST,payload:data}),
        agencyListInfo:(data)=>dispatch({type: actionTypesUser.AGENCY_LIST,payload:data}), 
        contactChannelListInfo:(data)=>dispatch({type: actionTypesUser.CONTACT_CHANNEL_LIST,payload:data}),   
        countryListInfo:(data)=>dispatch({type: actionTypesUser.COUNTRY_LIST,payload:data}),
        cityListInfo:(data)=>dispatch({type: actionTypesUser.CITY_LIST,payload:data}),
        stateListInfo:(data)=>dispatch({type: actionTypesUser.STATE_LIST,payload:data}),   
    }
};

export default  connect(mapStateToProps, mapDispatchToProps)(AgentFormComponent);

