import React from "react";
import {connect} from 'react-redux';
import * as actionTypesUser from "../../../store/action/settings.action";
import LoaderComponent from "../../../components/LoaderComponent";
import {USER_ID,MEALPLANLIST} from '../../../helpers/constants';
import {ArrayHelper} from "../../../helpers/arrayhelper";
import SettingApi from "../../../api/Setting.api";
import {addsDays, subsDays,formatDate} from "../../../vendor/datefns";
declare var $;
class ServiceFormComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {loader:false,vendorTypeList:[],vendorList:[],'vendorTypeId':0,'id':'',"name": "","serviceType":'',"vendorId":'',"shortDescription":'',"fullDescription":'','voucherDescription':'',
        'images':'','startDate':'','endDate':'','serviceFeeDetails':[],'notes':''};
    }
    componentDidMount()
    {
       
        this.dataTypeList()

       this.displayDate();
    
    }
    displayDate()
    {
      
        $(".serviceStartDate").datepicker("refresh");
      
        $(".serviceStartDate").datepicker({minDate:"+0d"})
        .on("change", (e: any) => {
         $(".serviceEndDate").datepicker("option", "minDate", addsDays(e.target.value,1));
         
          this.setState({startDate:e.target.value})
        }); 

        $(".serviceEndDate").datepicker({minDate:"+0d"})
        .on("change", (e: any) => {
           
            $(".serviceStartDate").datepicker("option", "maxDate", subsDays(e.target.value,1));
            this.setState({endDate:e.target.value})
        });
    }
    dataTypeList=async()=>
    {
        let vendorTypeListData=this.props.vendorTypeListData;
        if(vendorTypeListData.length>0)
        {
            this.setState({vendorTypeList:vendorTypeListData})
        }
        else
        {
            this.setState({loader:true});
          let response= await SettingApi.GetSettingList('/api/VendorType/List');
        if(ArrayHelper.getValue(response,'isSuccess')== true)
        {
            this.setState({loader:false,vendorTypeList:ArrayHelper.getValue(response,'vendorTypes')});
          this.props.vendorTypeListInfo(ArrayHelper.getValue(response,'vendorTypes'));
        }
        }
        let vendorListData=this.props.vendorListData;
        if(vendorListData.length>0)
        {
            this.setState({vendorList:vendorListData})
        }
        else
        {
            this.setState({loader:true});
          let response= await SettingApi.GetSettingList('/api/Vendor/List');
        if(ArrayHelper.getValue(response,'isSuccess')== true)
        {
            this.setState({loader:false,vendorList:ArrayHelper.getValue(response,'vendors')});
          this.props.vendorListInfo(ArrayHelper.getValue(response,'vendors'));
        }
        }

       
    }
    handleChange = (e) => {
        const name = e.target.name;
        let  value = e.target.value; 
          
         this.displayDate();      
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
        else if(this.state.startDate=='' && error=='' && this.state.vendorTypeId!=1)
        {
            error='yes';
            alert('Please provide start date.');

        }
        else if(this.state.endDate=='' && error==''  && this.state.vendorTypeId!=1)
        {
            error='yes';
            alert('Please provide end date.');

        }
        if(error=='')
        {
       let serviceFeeDetails= this.state.serviceFeeDetails;
       serviceFeeDetails= serviceFeeDetails.map((item)=>{       
        item.rate=parseFloat(item.rate);
        item.weekdayRateSingle=parseFloat(item.weekdayRateSingle);
        item.weekdayRateDouble=parseFloat(item.weekdayRateDouble);
        item.weekendRateSingle=parseFloat(item.weekendRateSingle);
        item.weekendRateDouble=parseFloat(item.weekendRateDouble);
        item.cost=parseFloat(item.rate);
        item.markupPercentage=parseFloat(item.markupPercentage);
        item.markupAmount=parseFloat(item.markupAmount);
        item.breakFast=parseFloat(item.breakFast);
        item.lunch=parseFloat(item.lunch);
        item.dinner=parseFloat(item.dinner);
        if(item.isMandatoryLunch==1)
        {
            item.mandatoryLunch=parseFloat(item.mandatoryLunch);  
        }
        else
        {
            item.mandatoryLunch=0.00;    
        }
        if(item.isMandatoryDinner==1)
        {
            item.mandatoryDinner=parseFloat(item.mandatoryDinner);  
        }
        else
        {
            item.mandatoryDinner=0.00;    
        }
      
        item.extraAdult12Above=parseFloat(item.extraAdult12Above);
        item.extraAdultUpto12=parseFloat(item.extraAdultUpto12);
        item.jungleSafari=parseFloat(item.jungleSafari);
        item.startDate= (item.startDate!='')?formatDate(item.startDate,'yyyy-MM-dd'):formatDate(this.state.startDate,'yyyy-MM-dd');
        item.endDate= (item.endDate!='')?formatDate(item.endDate,'yyyy-MM-dd'):formatDate(this.state.endDate,'yyyy-MM-dd');
        item.isContractedRate=(item.isContractedRate==1)?true:false
        return item
       })
    
        let formData={
          "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
          "service": {
            "id":(this.props.formType=='add')?0:parseInt(this.state.id),
            "name": this.state.name,
             "vendorId": parseInt(this.state.vendorId),
             "vendorTypeId":parseInt(this.state.vendorTypeId),
            "serviceType": this.state.serviceType,
             "notes": this.state.notes,
             "shortDescription": this.state.shortDescription,
            "fullDescription": this.state.fullDescription,
              "voucherDescription": this.state.voucherDescription,
             "images":'',// this.state.images,
           "startDate":(this.state.startDate!='')?formatDate(this.state.startDate,'yyyy-MM-dd'):formatDate(serviceFeeDetails[0].startDate,'yyyy-MM-dd'),
               "endDate":(this.state.startDate!='')?formatDate(this.state.endDate,'yyyy-MM-dd'):formatDate(serviceFeeDetails[0].endDate,'yyyy-MM-dd'),
             "serviceFeeDetails":serviceFeeDetails
          }
        }
      
        this.setState({loader:true});
        let elmnt=""; 
        elmnt = document.getElementById("serviceMessage"+this.state.id);
        elmnt.scrollIntoView(false)
      if(this.props.formType=='add')
      {
       let response= await SettingApi.PostSettingList(formData,'/api/Service/Add');
       if(ArrayHelper.getValue(response,'isSuccess')==true)
       {
        $(".serviceStartDate").datepicker("option", "maxDate", addsDays(this.state.endDate,100000));
        $(".serviceEndDate").datepicker("option", "minDate", '+0d');
         this.setState({loader:false,'id':'',"name": "","serviceType":'',"vendorId":'',"shortDescription":'',"fullDescription":'','voucherDescription':'',
         'images':'','startDate':'','endDate':'','serviceFeeDetails':[],'message':"Service has been added",'messageType':'success'});
        
         setTimeout(()=>{
            this.setState({"message":''});
            this.displayDate();
            this.addServiceFeeDetails();
         },1000)
          this.props.getServiceList();
       }
       else
       {
         this.setState({loader:false,'message':ArrayHelper.getValue(response,'message'),'messageType':'error'})
       }
      }
      else if(this.props.formType=='update')
      {
       let response= await SettingApi.PostSettingList(formData,'/api/Service/Update');
       if(ArrayHelper.getValue(response,'isSuccess')==true)
       {
         this.setState({loader:false,'message':"Service has been Updated",'messageType':'success'})
         //this.props.updatedServiceList(ArrayHelper.getValue(response,'services')[0]);
         this.props.getServiceList();
         setTimeout(()=>{
          this.setState({"message":''});
          $(".close").click();
         },3000)
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
           if(ArrayHelper.getValue(this.props.selectedService,'id')!='')
           {
           let serviceFeeDetails= ArrayHelper.getValue(this.props.selectedService,'serviceFeeDetails',[])

           serviceFeeDetails=serviceFeeDetails.map((item)=>{
            if(item.mandatoryDinner!=0)
            {
                item.isMandatoryDinner=1 
            }
            else
            {
                item.isMandatoryDinner=0  
            }
            if(item.mandatoryLunch!=0)
            {
                item.isMandatoryLunch=1 
            }
            else
            {
                item.isMandatoryLunch=0  
            }
             return item;
           })
         
            this.setState({ 
            "id": ArrayHelper.getValue(this.props.selectedService,'id'),    
            "name": ArrayHelper.getValue(this.props.selectedService,'name'),
            "serviceType": ArrayHelper.getValue(this.props.selectedService,'serviceType'),
            'vendorTypeId':ArrayHelper.getValue(this.props.selectedService,'vendorTypeId'),
            "vendorId": ArrayHelper.getValue(this.props.selectedService,'vendorId'),
            "notes": ArrayHelper.getValue(this.props.selectedService,'notes'),
            "shortDescription": ArrayHelper.getValue(this.props.selectedService,'shortDescription'),
            "fullDescription": ArrayHelper.getValue(this.props.selectedService,'fullDescription'),
            "voucherDescription": ArrayHelper.getValue(this.props.selectedService,'voucherDescription'),
            "images": ArrayHelper.getValue(this.props.selectedService,'images'),
            "startDate":(ArrayHelper.getValue(serviceFeeDetails,'[0].startDate')!='' && ArrayHelper.getValue(serviceFeeDetails,'[0].startDate')!='0001-01-01T00:00:00')?formatDate(ArrayHelper.getValue(serviceFeeDetails,'[0].startDate')):'',
            "endDate":(ArrayHelper.getValue(serviceFeeDetails,'[0].endDate')!='' && ArrayHelper.getValue(serviceFeeDetails,'[0].endDate')!='0001-01-01T00:00:00')?formatDate(ArrayHelper.getValue(serviceFeeDetails,'[0].endDate')):'',
            "serviceFeeDetails": serviceFeeDetails
            });
        }
         
            if(ArrayHelper.getValue(this.props.selectedService,'serviceFeeDetails').length==0 && this.state.serviceFeeDetails.length==0)
            {
                this.addServiceFeeDetails()
            }
              
            },1000);

            
    }
    addServiceFeeDetails=async() => {
  
        let serviceFeeDetails=this.state.serviceFeeDetails;
        serviceFeeDetails=serviceFeeDetails.concat([{"id": 0,"serviceId": (ArrayHelper.getValue(this.props.selectedService,'id')!='')?parseInt(ArrayHelper.getValue(this.props.selectedService,'id')):0, "rate": 0,"weekdayRateSingle": 0,"weekdayRateDouble": 0,"weekendRateSingle": 0,"weekendRateDouble": 0,"description": "","cost": 0,"markupPercentage": 0,"markupAmount": 0,"currency": "INR","mealPlan": "",
        'breakFast':0,'lunch':0,'dinner':0,'isMandatoryLunch':0,'mandatoryLunch':0,'isMandatoryDinner':0,'mandatoryDinner':0,'extraAdult12Above':0,'extraAdultUpto12':0,'jungleSafari':0,'notes':'','isContractedRate':1,'startDate':'','endDate':''}]);
   
        this.setState({serviceFeeDetails:serviceFeeDetails})
        
    }
    handleserviceFeeInput(key,value,index)
    {
        this.setState({
            serviceFeeDetails: this.state.serviceFeeDetails.map((item: any, k: number) => {                
                if (key == k) {
                    if((index=='rate' || index=='weekdayRateSingle' || index=='weekdayRateDouble' || index=='weekendRateDouble' || index=='weekendRateSingle'  || index=='cost' || index=='markupPercentage' || index=='markupAmount' || index=='mandatoryDinner' || index=='mandatoryLunch') && value!='')
                    {
                        value = value.replace(/[^0-9''.]/ig, '');
                        //item[index] = parseFloat(value).toFixed(2);
                        if(value!='')
                        {
                            if(index=='markupPercentage')
                            {
                                if(parseFloat(value)<100)
                                {
                                    item[index] = value;
                                }
                              
                            }
                            else
                            {
                                item[index] = value;
                            }
                           
                        }
                       
                    }
                    else if(index=='notes')
                    { 
                       value = value.replace(/[^A-Z0-9-.,' '\n]/ig, '');
                       item[index] =value;
                   } 
                   else if(index=='mealPlan')
                    { 
                     
                       item[index] =value;
                   } 
                   else if(index=='isMandatoryLunch' && value==1)
                   {                     
                      item[index] =value;
                      item['mandatoryLunch'] ='';

                  }
                  else if(index=='isMandatoryLunch' && value==0)
                  {                     
                     item[index] =value;
                     item['mandatoryLunch'] ='0';

                 }
                 else if(index=='isMandatoryDinner' && value==1)
                   {                     
                      item[index] =value;
                      item['mandatoryDinner'] ='';

                  }
                  else if(index=='isMandatoryDinner' && value==0)
                  {                     
                     item[index] =value;
                     item['mandatoryDinner'] ='0';

                 }
                    else
                    {
                        value=value.replace('  ',' ').replace(/[^A-Z0-9.' '-]/ig, '');
                        item[index] =value;
                    }
                   
                    
                }
        
                return item;
            })
        });
    }
    deleteServiceFeeDetails(str)
    {
        let serviceFeeDetails=this.state.serviceFeeDetails;
        serviceFeeDetails  =serviceFeeDetails.filter((item,key)=>key!=str);
        this.setState({serviceFeeDetails:serviceFeeDetails})
    }
    handleTravelersInput(key: string, value: any) {
        if((key=='startDate'))
        {
       
         this.setState({startDate:value});
        }
        else if((key=='endDate'))
        {
            this.setState({endDate:value});
        }

       
        
         }
    render(){
        console.log('this.state.loader',this.state.loader)
        return(
            <React.Fragment>
                <LoaderComponent loader={this.state.loader}/>
                <form  method="post" onSubmit={this.submit}>
      <div className="row CreateTrip"  >
     <p id={`serviceMessage${this.state.id}`}  className={`updateMessage ${(this.state.messageType=='success')?'message-green':'message-red'}`}>{this.state.message}</p>
     <div className="col-md-4">
                                  <div className="mb-3">
                                      <label  className="form-label">Vendor Type</label>
                                      <select required className="form-select form-noradious" name="vendorTypeId" value={this.state.vendorTypeId} onChange={this.handleChange} >
                                        
                                      <option value="">Select Vendor Type</option>
                                      {this.state.vendorTypeList.map((item,key)=>{
                                        return(<option  key={`vendorTypeList-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'name')}</option>)
                                      })}
                                      </select>
                                  </div>
                              </div>
                              
                            {/* <div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label"> Service Type </label>
                                    <input required  type="text" className="form-control form-noradious" name="serviceType" value={this.state.serviceType} onChange={this.handleChange} placeholder="Enter Service Type"/>
                                  
                                </div>
                            </div> */}
                             
                              <div className="col-md-4">
                                  <div className="mb-3">
                                      <label  className="form-label">Vendor </label>
                                      <select required className="form-select form-noradious" name="vendorId" value={this.state.vendorId} onChange={this.handleChange} >
                                        
                                      <option value="">Select Vendor</option>
                                      {this.state.vendorList.filter((_item)=>_item.vendorTypeId==this.state.vendorTypeId).map((item,key)=>{
                                        return(<option  key={`greavesOfficeId-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'vendorName')}</option>)
                                      })}
                                      </select>
                                  </div>
                              </div> 
                              <div className="col-md-4">
                                <div className="mb-3">
                                    <label  className="form-label"> Name </label>
                                    <input maxLength={50} required  type="text" className="form-control form-noradious" name="name" value={this.state.name} onChange={this.handleChange} placeholder="Enter Service Name"/>
                                  
                                </div>
                            </div>
                              {(this.state.vendorTypeId!=1)?<div className="col-md-12">
                                <div className="mb-3">
                                    <label  className="form-label">  Notes </label>
                                    <textarea maxLength={250}   type="text" className="form-control form-noradious" name="notes" value={this.state.notes} onChange={this.handleChange} placeholder="Enter Notes"/>
                                </div>
                            </div>:''}
                           
                            
                            {(this.state.vendorTypeId!=1)?<div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label"> Start Date </label>
                                    <br/>
                               
                                          <input readOnly id="" required type="text" placeholder="Enter Start Date" className="serviceStartDate form-control" name="startDate" value={this.state.startDate}/>
                                   
                                  
                                </div>
                            </div>:''}
                            {(this.state.vendorTypeId!=1)?<div className="col-md-6">
                                <div className="mb-3">
                                    <label  className="form-label"> End Date </label>
                                    <br/>

                                           <input readOnly id="" required type="text" placeholder="Enter End Date" className="form-control serviceEndDate" name="endDate" value={this.state.endDate}/>
                                  
                                   
                                </div>
                            </div>:''}
                            <div className="col-md-12">
                                <div className="mb-3">
                                    <label  className="form-label"> Service Fee Details </label>
                                 <hr/>
                                </div>
                            </div>
                            {(this.state.serviceFeeDetails.length>0)?<div  className="col-md-12">
                            {this.state.serviceFeeDetails.map((item: any, key: number) => {
                                if(item.isContractedRate==true)
                                {
                                    item.isContractedRate=1;
                                }
                                else if(item.isContractedRate==false)
                                {
                                    item.isContractedRate=0;
                                }
                                return( <div key={`ans-${key}`} className="row">
                                
                                {(this.state.vendorTypeId!=4 && this.state.vendorTypeId!=1)?<div className="col-md-2">
                                    <div className="mb-3">
                                        <label  className="form-label">{(this.state.vendorTypeId==2)?'Vehicle Name':'Fee Name'} </label>
                                        <input maxLength={50} required  type="text"   className="form-control form-noradious" name="description" value={item.description} onChange={(event: any) => this.handleserviceFeeInput(key,  event.currentTarget.value,'description')} placeholder="Enter Fee Name"/>
                                      
                                    </div>
                                </div>:''}
                                {(this.state.vendorTypeId!=1)?<div className="col-md-1">
                                    <div className="mb-3">
                                        <label  className="form-label"> Rate </label>
                                        <input maxLength={10} required  type="text"   className="form-control form-noradious" name="rate" value={item.rate} onChange={(event: any) => this.handleserviceFeeInput(key,  event.currentTarget.value,'rate')} placeholder="Enter Rate"/>
                                      
                                    </div>
                                </div>:''}
                                {(this.state.vendorTypeId==1)?<div className="col-md-1">
                                    <div className="mb-3">
                                        <label  className="form-label"> Weekday Rate Single </label>
                                        <input maxLength={10} required  type="text"   className="form-control form-noradious" name="weekdayRateSingle" value={item.weekdayRateSingle} onChange={(event: any) => this.handleserviceFeeInput(key,  event.currentTarget.value,'weekdayRateSingle')} placeholder="Enter Rate"/>
                                      
                                    </div>
                                </div>:''}
                                {(this.state.vendorTypeId==1)?<div className="col-md-1">
                                    <div className="mb-3">
                                        <label  className="form-label"> Weekday Rate Double </label>
                                        <input maxLength={10} required  type="text"   className="form-control form-noradious" name="v" value={item.weekdayRateDouble} onChange={(event: any) => this.handleserviceFeeInput(key,  event.currentTarget.value,'weekdayRateDouble')} placeholder="Enter Rate"/>
                                      
                                    </div>
                                </div>:''}
                                {(this.state.vendorTypeId==1)?<div className="col-md-1">
                                    <div className="mb-3">
                                        <label  className="form-label"> Weekend Rate Single </label>
                                        <input maxLength={10} required  type="text"   className="form-control form-noradious" name="weekendRateSingle" value={item.weekendRateSingle} onChange={(event: any) => this.handleserviceFeeInput(key,  event.currentTarget.value,'weekendRateSingle')} placeholder="Enter Rate"/>
                                      
                                    </div>
                                </div>:''}
                                {(this.state.vendorTypeId==1)?<div className="col-md-1">
                                    <div className="mb-3">
                                        <label  className="form-label"> Weekend Rate Double </label>
                                        <input maxLength={10} required  type="text"   className="form-control form-noradious" name="weekendRateDouble" value={item.weekendRateDouble} onChange={(event: any) => this.handleserviceFeeInput(key,  event.currentTarget.value,'weekendRateDouble')} placeholder="Enter Rate"/>
                                      
                                    </div>
                                </div>:''}
                                {(this.state.vendorTypeId==1)?<div className="col-md-2">
                                <div className="mb-3">
                                    <label  className="form-label"> Start Date </label>
                                    <br/>
                               
                                          <input  required type="date" placeholder="Enter Start Date" className=" form-control" name="startDate" onChange={(event: any) => this.handleserviceFeeInput(key,  event.currentTarget.value,'startDate')}  value={(item.startDate!='')?formatDate(item.startDate,'yyyy-MM-dd'):''}/>
                                   
                                  
                                </div>
                            </div>:''}
                            {(this.state.vendorTypeId==1)?<div className="col-md-2">
                                <div className="mb-3">
                                    <label  className="form-label"> End Date </label>
                                    <br/>

                                           <input   required type="date"  placeholder="Enter End Date" className="form-control " name="endDate" onChange={(event: any) => this.handleserviceFeeInput(key,  event.currentTarget.value,'endDate')}  value={(item.endDate!='')?formatDate(item.endDate,'yyyy-MM-dd'):''}/>
                                  
                                   
                                </div>
                            </div>:''}
                                {/* <div className="col-md-1">
                                    <div className="mb-3">
                                        <label  className="form-label"> Cost </label>
                                        <input required  type="number" className="form-control form-noradious" name="cost" value={item.cost} onChange={(event: any) => this.handleserviceFeeInput(key,  event.currentTarget.value,'cost')} placeholder="Enter Cost"/>
                                      
                                    </div>
                                </div> */}
                                {/* {(this.state.vendorTypeId!=4)?<div className="col-md-2">
                                    <div className="mb-3">
                                        <label  className="form-label"> Markup Percentage </label>
                                        <input maxLength={5}  required  type="text" className="form-control form-noradious" name="markupPercentage" value={item.markupPercentage} onChange={(event: any) => this.handleserviceFeeInput(key,  event.currentTarget.value,'markupPercentage')} placeholder="Enter Markup Percentage"/>
                                      
                                    </div>
                                </div>:''} */}
                                {/* {(this.state.vendorTypeId!=4)?<div className="col-md-2">
                                    <div className="mb-3">
                                        <label  className="form-label"> Markup Amount </label>
                                        <input maxLength={10} required  type="text" className="form-control form-noradious" name="markupAmount" value={item.markupAmount} onChange={(event: any) => this.handleserviceFeeInput(key,  event.currentTarget.value,'markupAmount')} placeholder="Enter Markup Amount"/>
                                      
                                    </div>
                                </div>:''} */}
                                {(this.state.vendorTypeId==1)?<div className="col-md-1">
                                    <div className="mb-3">
                                        <label  className="form-label"> Break Fast (<span>&#8377;</span>) </label>
                                        <input maxLength={10} required  type="text" className="form-control form-noradious" name="breakFast" value={item.breakFast} onChange={(event: any) => this.handleserviceFeeInput(key,  event.currentTarget.value,'breakFast')} placeholder="Enter Break Fast amount"/>
                                      
                                    </div>
                                </div>:''}
                                {(this.state.vendorTypeId==1)?<div className="col-md-1">
                                    <div className="mb-3">
                                        <label  className="form-label"> Lunch (<span>&#8377;</span>) </label>
                                        <input maxLength={10} required  type="text" className="form-control form-noradious" name="lunch" value={item.lunch} onChange={(event: any) => this.handleserviceFeeInput(key,  event.currentTarget.value,'lunch')} placeholder="Enter Lunch amount"/>
                                      
                                    </div>
                                </div>:''}
                                {(this.state.vendorTypeId==1)?<div className="col-md-1">
                                    <div className="mb-3">
                                        <label  className="form-label"> Dinner (<span>&#8377;</span>) </label>
                                        <input maxLength={10} required  type="text" className="form-control form-noradious" name="dinner" value={item.dinner} onChange={(event: any) => this.handleserviceFeeInput(key,  event.currentTarget.value,'dinner')} placeholder="Enter Dinner amount"/>
                                      
                                    </div>
                                </div>:''}
                                {(this.state.vendorTypeId==1)?<div className="col-md-1">
                                    <div className="mb-3">
                                        <label  className="form-label"> Jungle Safari (<span>&#8377;</span>) </label>
                                        <input maxLength={10} required  type="text" className="form-control form-noradious" name="jungleSafari" value={item.jungleSafari} onChange={(event: any) => this.handleserviceFeeInput(key,  event.currentTarget.value,'jungleSafari')} placeholder="Enter Jungle Safari  amount"/>
                                      
                                    </div>
                                </div>:''}
                                {(this.state.vendorTypeId==1)?<div className="col-md-1">
                                    <div className="mb-3">
                                        <label  className="form-label"> Meal Plan </label>
                                        <select required className="form-select form-select-sm"  name="mealPlan" value={item.mealPlan} onChange={(event: any) => this.handleserviceFeeInput(key,  event.currentTarget.value,'mealPlan')}>
                                                  <option value="">Select Meal Plan</option>
                                                  {MEALPLANLIST.map((item,key)=>{
                                                    return(<option key={`mealplan-${key}`} value={item}>{item}</option>) 
                                                  })}
                                            </select>
                                      
                                    </div>
                                </div>:''}
                                {(this.state.vendorTypeId==1)?<div className="col-md-1">
                                    <div className="mb-3">
                                        <label  className="form-label">Is MD Lunch </label>
                                        <select required className="form-select form-select-sm"  name="isMandatoryLunch" value={item.isMandatoryLunch} onChange={(event: any) => this.handleserviceFeeInput(key,  event.currentTarget.value,'isMandatoryLunch')}>
                                                  <option value="0">No</option> 
                                                  <option value="1">Yes</option>                                                
                                            </select>
                                      
                                    </div>
                                </div>:''}
                                {(this.state.vendorTypeId==1 && item.isMandatoryLunch==1)?<div className="col-md-1">
                                    <div className="mb-3">
                                        <label  className="form-label">  MD Lunch (<span>&#8377;</span>)</label>
                                        <input maxLength={10} required  type="text" className="form-control form-noradious" name="mandatoryLunch" value={item.mandatoryLunch} onChange={(event: any) => this.handleserviceFeeInput(key,  event.currentTarget.value,'mandatoryLunch')} placeholder="Enter Mandatory Lunch  amount"/>
                                      
                                    </div>
                                </div>:''}
                                {(this.state.vendorTypeId==1)?<div className="col-md-1">
                                    <div className="mb-3">
                                        <label  className="form-label">Is MD Dinner </label>
                                        <select required className="form-select form-select-sm"  name="isMandatoryDinner" value={item.isMandatoryDinner} onChange={(event: any) => this.handleserviceFeeInput(key,  event.currentTarget.value,'isMandatoryDinner')}>
                                                  <option value="0">No</option> 
                                                  <option value="1">Yes</option>                                                
                                            </select>
                                      
                                    </div>
                                </div>:''}
                                {(this.state.vendorTypeId==1 && item.isMandatoryDinner)?<div className="col-md-1">
                                    <div className="mb-3">
                                        <label  className="form-label"> MD Dinner (<span>&#8377;</span>)</label>
                                        <input maxLength={10} required  type="text" className="form-control form-noradious" name="mandatoryDinner" value={item.mandatoryDinner} onChange={(event: any) => this.handleserviceFeeInput(key,  event.currentTarget.value,'mandatoryDinner')} placeholder="Enter Mandatory Dinner  amount"/>
                                       
                                    </div>
                                </div>:''}
                                {(this.state.vendorTypeId==1)?<div className="col-md-1">
                                    <div className="mb-3">
                                        <label  className="form-label"> Ext.  Adult(<span>&#8377;</span>) </label>
                                        <input maxLength={10} required  type="text" className="form-control form-noradious" name="extraAdult12Above" value={item.extraAdult12Above} onChange={(event: any) => this.handleserviceFeeInput(key,  event.currentTarget.value,'extraAdult12Above')} placeholder="Enter Extra Adult amount"/>
                                      
                                    </div>
                                </div>:''}
                                {(this.state.vendorTypeId==1)?<div className="col-md-1">
                                    <div className="mb-3">
                                        <label  className="form-label"> Ext.  Child(<span>&#8377;</span>) </label>
                                        <input maxLength={10} required  type="text" className="form-control form-noradious" name="extraAdultUpto12" value={item.extraAdultUpto12} onChange={(event: any) => this.handleserviceFeeInput(key,  event.currentTarget.value,'extraAdultUpto12')} placeholder="Enter Extra Child amount"/>
                                      
                                    </div>
                                </div>:''}
                                {(this.state.vendorTypeId==1)?<div className="col-md-1">
                                    <div className="mb-3">
                                        <label  className="form-label"> Contracted Rate </label>
                                        <select required className="form-select form-select-sm"  name="isContractedRate" value={item.isContractedRate} onChange={(event: any) => this.handleserviceFeeInput(key,  event.currentTarget.value,'isContractedRate')}>
                                                  <option value="0">No</option> 
                                                  <option value="1">Yes</option>                                                
                                            </select>
                                      
                                    </div>
                                </div>:''}
                                {/* {(this.state.vendorTypeId!=4)?<div className="col-md-1">
                                    <div className="mb-3">
                                        <label  className="form-label"> Currency </label>
                                        <input maxLength={3} required  type="text" className="form-control form-noradious" name="currency" value={item.currency} onChange={(event: any) => this.handleserviceFeeInput(key,  event.currentTarget.value,'currency')} placeholder="Enter Currency"/>
                                      
                                    </div>
                                </div>:''} */}
                                {(this.state.vendorTypeId==1)?<div className="col-md-6">
                                    <div className="mb-3">
                                        <label  className="form-label"> Notes </label>
                                        <textarea maxLength={250}   type="text" className="form-control form-noradious" name="notes" value={item.notes} onChange={(event: any) => this.handleserviceFeeInput(key,  event.currentTarget.value,'notes')} placeholder="Enter Notes"/>
                                        
                                      
                                    </div>
                                </div>:''}
                              
                                
                                {(this.state.vendorTypeId!=4)?<div className="col-md-1">
                                    <div className="mb-3">
                                    <label  className="form-label">  </label>
                                    <br/>
                                     {(this.state.serviceFeeDetails.length>1)?<a onClick={() => this.deleteServiceFeeDetails(key)} ><i className="fa-solid fa-square-minus fs-1 topSpace"></i></a>:""} {((this.state.serviceFeeDetails.length-1)==key)?<a   onClick={() => this.addServiceFeeDetails()}><i className="fa-solid fa-square-plus fs-1 topSpace"></i></a>:''} 
                                       
                                    </div>
                                </div>:''}
                                
                                </div>)
                                })}
                                </div>:''}
                            
                           
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
        vendorTypeListData : state.settingsData.vendorTypeList,
        vendorListData : state.settingsData.vendorList,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        vendorTypeListInfo:(data)=>dispatch({type: actionTypesUser.VENDOR_TYPE_LIST,payload:data}),
        vendorListInfo:(data)=>dispatch({type: actionTypesUser.VENDOR_LIST,payload:data}),
       
    }
};

export default  connect(mapStateToProps, mapDispatchToProps)(ServiceFormComponent);

