import React from "react";
import {connect} from 'react-redux';
import * as actionTypesUser from "../../../store/action/settings.action";
import LoaderComponent from "../../../components/LoaderComponent";
import {USER_ID} from '../../../helpers/constants';
import {ArrayHelper} from "../../../helpers/arrayhelper";
import SettingApi from "../../../api/Setting.api";
import {ISURLVLIDATE} from "../../../vendor/datefns";
declare var $;
class SalesGuideFormComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {loader:false,salesGuideList:[], countryList :[], cityList:[] , stateList : [] ,'id':'',"name": "","salesCategoryId":'',"rating":'',"position":'',"webReference":'','images':'',
        'cityName':'','stateName':'','region':'','countryName':'' , 'cityId':'', 'stateId':'' , 'countryId':''};
    }
    componentDidMount()
    {
       
        this.dataTypeList();
         
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


        let salesGuideListData=this.props.salesGuideListData;
        if(salesGuideListData.length>0)
        {
            this.setState({salesGuideList:salesGuideListData})
        }
        else
        {
            this.setState({loader:true});
          let response= await SettingApi.GetSettingList('/api/SalesCategory/List');
        if(ArrayHelper.getValue(response,'isSuccess')== true)
        {
            this.setState({loader:false,salesGuideList:ArrayHelper.getValue(response,'salesCategories')});
            this.props.salesGuideListInfo(ArrayHelper.getValue(response,'salesCategories'));
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
        if(error=="" && this.state.name!='' && this.state.name.length<3)
                {
                     alert('Please provide atleast 3 character of name.')
                    error='yes';
                 }
        // else if(error=="" && this.state.city!='' && this.state.city.length<3)
        //          {
        //               alert('Please provide atleast 3 character of city.')
        //              error='yes';
        //           } 
        //           else if(error=="" && this.state.state!='' && this.state.state.length<3)
        //           {
        //                alert('Please provide atleast 3 character of state.')
        //               error='yes';
        //            }
        //            else if(error=="" && this.state.country!='' && this.state.country.length<3)
        //           {
        //                alert('Please provide atleast 3 character of state.')
        //               error='yes';
        //            } 
                   else if(error=="" && this.state.region!='' && this.state.region.length<3)
                  {
                       alert('Please provide atleast 3 character of region.')
                      error='yes';
                   } 
                   else if(error=="" && this.state.webReference!='' && ISURLVLIDATE(this.state.webReference)!=true)
                  {
                       alert('Please provide valid website.')
                      error='yes';
                   } 

            let name1 = this.state.cityList.filter((value)=>{
              if(value.cityId == this.state.cityId){
                return value
              }
              
            })
            let countryName = name1.map((item)=>{
              return item.countryName
            })
            let stateName = name1.map((item)=>{
              return item.stateName
            })
            let cityName = name1.map((item)=>{
              return item.cityName
            })
            this.setState({cityName : cityName.toString()})
            setTimeout(() => {
              
              console.log(this.state.cityName , 'cityname')
            }, 2000);
                

        if(error=="")   
        { 
        let formData={
          "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
          "salesGuide": {
            "id":(this.props.formType=='add')?0:parseInt(this.state.id),
            "name": this.state.name,
             "salesCategoryId": parseInt(this.state.salesCategoryId),
             "rating": parseInt(this.state.rating),
            "position": parseInt(this.state.position),
             "webReference": this.state.webReference,
            "cityName": this.state.countryId.length > 0 ? cityName.toString() : '' ,
              "stateName": this.state.countryId.length > 0 ? stateName.toString() :'',
              "countryName": this.state.countryId.length > 0 ? countryName.toString() :'',
              "cityId" : parseInt(this.state.cityId),
              "stateId": parseInt(this.state.stateId),
              "countryId" : parseInt(this.state.countryId),
             "images": this.state.images,
               "region": this.state.region
          }
        }
        this.setState({loader:true});
      if(this.props.formType=='add')
      {
       let response= await SettingApi.PostSettingList(formData,'/api/SalesGuide/Add');
       if(ArrayHelper.getValue(response,'isSuccess')==true)
       {
         this.setState({loader:false,'id':'',"name": "","salesCategoryId":'',"rating":'',"position":'',"webReference":'','images':'',
         'stateName':'','region':'','countryName':'','cityId':'','stateId' :'','countryId':'','message':"Sales Guide has been added",'messageType':'success'})
         setTimeout(()=>{
           this.props.getSalesGuideList(ArrayHelper.getValue(response,'salesGuides'));
            this.setState({"message":''});
            $(".close").click();
           },1000)
       }
       else
       {
         this.setState({loader:false,'message':ArrayHelper.getValue(response,'message'),'messageType':'error'})
       }
      }
      else if(this.props.formType=='update')
      {
       let response= await SettingApi.PostSettingList(formData,'/api/SalesGuide/Update');
       if(ArrayHelper.getValue(response,'isSuccess')==true)
       {
         this.setState({loader:false,'message':"Sales Guide has been Updated",'messageType':'success'})
         this.props.updatedSalesGuideList(ArrayHelper.getValue(response,'salesGuides')[0]);
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
            "id": ArrayHelper.getValue(this.props.selectedSalesGuide,'id'),    
            "name": ArrayHelper.getValue(this.props.selectedSalesGuide,'name'),
            "salesCategoryId": ArrayHelper.getValue(this.props.selectedSalesGuide,'salesCategoryId'),
            "rating": ArrayHelper.getValue(this.props.selectedSalesGuide,'rating'),
            "position": ArrayHelper.getValue(this.props.selectedSalesGuide,'position'),
            "salesRegionId": ArrayHelper.getValue(this.props.selectedSalesGuide,'salesRegionId'),
            "webReference": ArrayHelper.getValue(this.props.selectedSalesGuide,'webReference'),
            "cityId": ArrayHelper.getValue(this.props.selectedSalesGuide,'cityId'),
            "stateId": ArrayHelper.getValue(this.props.selectedSalesGuide,'stateId'),
            "countryId": ArrayHelper.getValue(this.props.selectedSalesGuide,'countryId'),
            "images": ArrayHelper.getValue(this.props.selectedSalesGuide,'images'),
            "region":ArrayHelper.getValue(this.props.selectedSalesGuide,'region')
            });
            },100);
    }
    render(){
        return(
            <React.Fragment>
                <LoaderComponent loader={this.state.loader}/>
                <form  method="post" onSubmit={this.submit}>
      <div className="row CreateTrip">
      {(this.state.message!='')?<p  className={`updateMessage ${(this.state.messageType=='success')?'message-green':'message-red'}`}>{this.state.message}</p>:''}
                          <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label"> Name </label>
                                    <input maxLength={50} required  type="text" className="form-control form-noradious" name="name" value={this.state.name} onChange={this.handleChange} placeholder="Enter Sales Guide Name"/>
                                  
                                </div>
                            </div>
                            <div className="col-md-6">
                                  <div className="mb-3">
                                      <label  className="form-label">Sales Category </label>
                                      <select required className="form-select form-noradious" name="salesCategoryId" value={this.state.salesCategoryId} onChange={this.handleChange} >
                                        
                                      <option value="">Select Category</option>
                                      {this.state.salesGuideList.map((item,key)=>{
                                        return(<option key={`agnecyTypeId-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'name')}</option>)
                                      })}
                                      </select>
                                  </div>
                              </div>
                              <div className="col-md-6">
                                  <div className="mb-3">
                                      <label  className="form-label">Rating </label>
                                      <select required className="form-select form-noradious" name="rating" value={this.state.rating} onChange={this.handleChange} >
                                        
                                      <option value="">Select Rating</option>
                                      <option value="1">1</option>
                                      <option value="2">2</option>
                                      <option value="3">3</option>
                                      <option value="4">4</option>
                                      <option value="5">5</option></select>
                                  </div>
                              </div>
                              <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label"> Position </label>
                                    <input maxLength={100} required  type="text" className="form-control form-noradious" name="position" value={this.state.position} onChange={this.handleChange} placeholder="Enter Position"/>
                                </div>
                            </div>
                              <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label"> Web Reference </label>
                                    <input maxLength={100}   type="text" className="form-control form-noradious" name="webReference" value={this.state.webReference} onChange={this.handleChange} placeholder="Enter Web Reference"/>
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
                                    <label  className="form-label"> Region </label>
                                    <input maxLength={50} required  type="text" className="form-control form-noradious" name="region" value={this.state.region} onChange={this.handleChange} placeholder="Enter Region"/>
                                  
                                </div>
                            </div>
                            {/* <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label"> Country </label>
                                    <input maxLength={50} required  type="text" className="form-control form-noradious" name="country" value={this.state.country} onChange={this.handleChange} placeholder="Enter Country"/>
                                  
                                </div>
                            </div> */}
                            
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
        salesGuideListData : state.settingsData.salesGuideList,
        countryListData : state.settingsData.countryList,
        cityListData : state.settingsData.cityList,
        stateListData : state.settingsData.stateList,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        salesGuideListInfo:(data)=>dispatch({type: actionTypesUser.SALES_CATEGORY_LIST,payload:data}),
        countryListInfo:(data)=>dispatch({type: actionTypesUser.COUNTRY_LIST,payload:data}),
        cityListInfo:(data)=>dispatch({type: actionTypesUser.CITY_LIST,payload:data}),
        stateListInfo:(data)=>dispatch({type: actionTypesUser.STATE_LIST,payload:data}),   
       
    }
};

export default  connect(mapStateToProps, mapDispatchToProps)(SalesGuideFormComponent);

