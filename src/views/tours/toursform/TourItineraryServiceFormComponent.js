import React from "react";
import {ArrayHelper} from "../../../helpers/arrayhelper";
import {DATEDURATION} from '../../../helpers/constants';
import "react-widgets/styles.css";
// import DropdownList from "react-widgets/DropdownList";
import $ from 'jquery';
class TourItineraryServiceFormComponent1111111111111 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loader:false,TourItineraryServiceData:[],serviceFeeList:[],selectedKey:'','vendorList':[],'serviceList':[]};
    }

// EditItenarySercice(item:any,selectedKey:any)  
// {
//    // this.props.deleteItinerarySerice(selectedKey,item.id)
//     inputPropsStart={
//         required: false,
//         readOnly: true,
//         value: item.startDate,
//     }
//     inputPropsEnd={
//         required: false,
//         readOnly: true,
//         value: item.endDate,
//     }
//     this.setState({'actionType':'edit',selectedKey:selectedKey});
   
//     this.props.TourItineraryServiceData[0].id=item.id;
//     this.props.TourItineraryServiceData[0].tourRecordId=item.tourRecordId;
//     this.props.TourItineraryServiceData[0].itineraryId=item.itineraryId;
    
//     this.props.TourItineraryServiceData[0].serviceDescription=item.serviceDescription;
//     this.props.TourItineraryServiceData[0].rate=item.rate;
//     this.props.TourItineraryServiceData[0].description=item.description;
//     this.props.TourItineraryServiceData[0].unit=item.unit;
//     this.props.TourItineraryServiceData[0].cost=item.cost;
//     this.props.TourItineraryServiceData[0].markupPercentage=item.markupPercentage;
//     this.props.TourItineraryServiceData[0].markupAmount=item.markupAmount;
//     this.props.TourItineraryServiceData[0].isShowOnItinerary=item.isShowOnItinerary;
//     this.props.TourItineraryServiceData[0].serviceGTICommission=item.serviceGTICommission;
//     this.props.TourItineraryServiceData[0].serviceGrossINR=item.serviceGrossINR;
//     this.props.TourItineraryServiceData[0].serviceGSTPercentage=item.serviceGSTPercentage;
//     this.props.TourItineraryServiceData[0].serviceSellINR=item.serviceSellINR;
//     this.props.TourItineraryServiceData[0].serviceNetUSD=item.serviceNetUSD;
//     this.props.TourItineraryServiceData[0].serviceUSDMarkupPercentage=item.serviceUSDMarkupPercentage;
//     this.props.TourItineraryServiceData[0].serviceUSDCommission=item.serviceUSDCommission;
//     this.props.TourItineraryServiceData[0].serviceUSDClientDollar=item.serviceUSDClientDollar;
//     this.props.TourItineraryServiceData[0].quoteType=item.quoteType;
//     this.props.TourItineraryServiceData[0].commissionType='byPercentage';
//     this.props.TourItineraryServiceData[0].commissionTypeUS='byPercentage';
//     this.props.TourItineraryServiceData[0].serviceUSDMarkUpAmount=item.serviceUSDMarkUpAmount;
//     this.props.TourItineraryServiceData[0].startDate=item.startDate;
//     this.props.TourItineraryServiceData[0].endDate=item.endDate;
//     this.props.TourItineraryServiceData[0].quoteType=item.quoteType;
//     let vendorList=this.props.vendorList;
//    vendorList=vendorList.filter((_item)=>item.vendorTypeId==_item.vendorTypeId && _item.cityId==item.cityId)
//   //  vendorList=vendorList.concat([{"id":0,"vendorName":"Select Vendor Type"}])
//     this.props.TourItineraryServiceData[0].vendorList=vendorList;
//     let serviceList=this.props.serviceList;
                  
//     serviceList=serviceList.filter((_item)=>_item.vendorId==item.vendorId)
//   // serviceList=serviceList.concat([{"id":0,"name":"Select Service"}])
//     this.props.TourItineraryServiceData[0].serviceList=serviceList;
//     this.props.TourItineraryServiceData[0].cityId=item.cityId;
//     this.props.TourItineraryServiceData[0].serviceId=item.serviceId;
//     this.props.TourItineraryServiceData[0].vendorId=item.vendorId;
//     this.props.TourItineraryServiceData[0].vendorTypeId=item.vendorTypeId;
    

// }
resetValue(key)
{
    setTimeout(()=>{
        this.setState({ ...this.state, [key]: '' });
       
    })
}
componentWillReceiveProps(nextProps)
{
  console.log('ssss',nextProps)
}
setCalucation()
{
 
    this.setState({
        TourItineraryServiceData:  this.props.TourItineraryServiceData.map((item: any, k: number) => { 
            if(item['startDate']!='' && item['endDate']!='')
            { 
            let duartion = DATEDURATION(item['startDate'],item['endDate']);
            if(duartion>0)
            {
                item['cost'] = (duartion*item['unit']*parseFloat(item['rate'])).toFixed(2);     
                if(item['commissionTypeUS']=="byPercentage")
                {
                      let serviceGTICommission= parseFloat((item['cost']*item['markupPercentage'])/100).toFixed(2);
                        item['serviceGTICommission'] = serviceGTICommission ; 
                        item['serviceGrossINR'] = (parseFloat(serviceGTICommission) + parseFloat(item['cost'])).toFixed(2);;
                }
                else
                {
                    item['serviceGTICommission'] = item['markupAmount'] ; 
                    item['serviceGrossINR'] = (parseFloat(item['markupAmount']) + parseFloat(item['cost'])).toFixed(2);;  
                }
                    let serviceGTSAMOUNT= parseFloat((item['serviceGrossINR']*item['markupAmount'])/100).toFixed(2);
                    item['serviceSellINR'] = (parseFloat(serviceGTSAMOUNT) + parseFloat(item['serviceGrossINR'])).toFixed(2);;
                    item['serviceNetUSD'] = (item['cost']/this.props.fileUSDROE).toFixed(2)  ; 
                    item['serviceUSDMarkupPercentage'] = item['markupPercentage']; 
                    item['serviceUSDMarkUpAmount'] = (item['markupAmount']/this.props.fileUSDROE).toFixed(2)  ; 
                    item['serviceUSDCommission'] = (item['serviceGTICommission']/this.props.fileUSDROE).toFixed(2)  ;
                    item['serviceUSDClientDollar'] = (item['serviceGrossINR']/this.props.fileUSDROE).toFixed(2)  ; 
            }
        }
            return item

        })})

} 
handleItineraryServiceInput(index: number, key: string, value: any) {
       
    this.setState({
        TourItineraryServiceData:  this.props.TourItineraryServiceData.map((item: any, k: number) => {                
            if (index == k) {
               
                if(key=='rate')
                {
                   // item[key] = parseFloat(value).toFixed(2);
                   if(item['startDate']=='')
                   {
                    item[key] ='';
                    alert('Please enter value start date')
                   }
                   else if(item['endDate']=='')
                   {
                    item[key] ='';
                    alert('Please enter value end date')
                   }
                   else
                   {
                    item[key] = value.slice(0, 6);
                    setTimeout(()=>{
                        this.setCalucation()
                    },500)
                   }
                   
                }
                else if(key=='unit')
                {
                    let duartion = DATEDURATION(item['startDate'],item['endDate']);
                   
                     if(item['rate']=='' || item['rate']==0)
                    {
                     item[key] ='';
                     alert('Please enter value rate')
                    }
                    else if(duartion<0)
                    {
                        item[key] ='';
                        alert('Please enter valid date')   
                    }
                    else
                    {
                        item[key] = value.slice(0, 3);
                        item['cost'] = (duartion*item[key]*parseFloat(item['rate'])).toFixed(2);; 
                        setTimeout(()=>{
                            this.setCalucation()
                        },500)
                    }
                   
                }
                else if(key=='cost')
                {
                   
                   
                     if(item['unit']=='' || item['unit']==0)
                    {
                     item[key] ='';
                     alert('Please enter unit')
                    }                   
                    else
                    {
                        item[key] = value.slice(0, 6);
                        setTimeout(()=>{
                            this.setCalucation()
                        },500)
                    }
                   
                }
                else if(key=='serviceGTICommission')
                {
                   
                   
                     if((item['markupPercentage']=='' || item['markupPercentage']==0) && item['commissionType']=="byPercentage")
                    {
                     item[key] ='';
                     alert('Please enter value of markup percentage')
                    }
                    else if((item['markupAmount']=='' || item['markupAmount']==0) && item['commissionType']=="byAmount")
                    {
                     item[key] ='';
                     alert('Please enter value of markup amount')
                    }                    
                    else
                    {
                        item[key] = value.slice(0, 6);
                        setTimeout(()=>{
                            this.setCalucation()
                        },500)
                    }
                   
                }
                else if(key=='serviceUSDCommission')
                {
                   
                   
                     if((item['serviceUSDMarkupPercentage']=='' || item['serviceUSDMarkupPercentage']==0) && item['commissionTypeUS']=="byPercentage")
                    {
                     item[key] ='';
                     alert('Please enter value of GTI US Markup Percentage')
                    }
                    else if((item['serviceUSDMarkUpAmount']=='' || item['serviceUSDMarkUpAmount']==0) && item['commissionTypeUS']=="byAmount")
                    {
                     item[key] ='';
                     alert('Please enter value of GTI US Markup Amount')
                    }                    
                    else
                    {
                        item[key] = value.slice(0, 6);
                    }
                   
                }
                else if(key=='serviceGrossINR')
                {
                   
                   
                     if((item['serviceGTICommission']=='' || item['serviceGTICommission']==0))
                    {
                     item[key] ='';
                     alert('Please enter value of GTI Commission')
                    }
                                       
                    else
                    {
                        item[key] = value.slice(0, 6);
                    }
                   
                }
               
                else if(key=='markupPercentage')
                {
                    item[key] = value.slice(0, 5);
                   // item[key] = parseFloat(value).toFixed(2);
                   if(item['rate']=='' || item['rate']==0)
                   {
                    item[key] ='';
                    alert('Please enter value rate')
                   }
                   else if(item['cost']=='' || item['cost']==0)
                   {
                    item[key] ='';
                    alert('Please enter value cost')
                   }
                   else if(value<99.99)
                   {
                    item[key] = value;
                    let serviceGTICommission= parseFloat((item['cost']*value)/100).toFixed(2);
                        item['serviceGTICommission'] = serviceGTICommission ; 
                        item['serviceGrossINR'] = (parseFloat(serviceGTICommission) + parseFloat(item['cost'])).toFixed(2);; 
                        setTimeout(()=>{
                            this.setCalucation()
                        },500)
                   }
                   else
                   {
                    alert('Please enter value than 99.99')
                    item[key] ='';
                   }
                   
                }
               
                else if(key=='markupAmount')
                {
                   // item[key] = parseFloat(value).toFixed(2);
                   if(item['rate']=='' || item['rate']==0)
                   {
                    item[key] ='';
                    alert('Please enter value rate')
                   }
                   else if(item['cost']=='' || item['cost']==0)
                   {
                    item[key] ='';
                    alert('Please enter value cost')
                   }
                   else 
                   {
                    item[key] = value;
                   
                        item['serviceGTICommission'] = value ; 
                        item['serviceGrossINR'] = (parseFloat(value) + parseFloat(item['cost'])).toFixed(2);; 
                        setTimeout(()=>{
                            this.setCalucation()
                        },500)
                   }
                   
                   
                }
                else if(key=='serviceGSTPercentage')
                {
                    item[key] = value.slice(0, 3);
                   // item[key] = parseFloat(value).toFixed(2);
                   if(item['serviceGrossINR']=='' || item['serviceGrossINR']==0)
                   {
                    item[key] ='';
                    alert('Please enter value Gross INR')
                   }               
                   else if(value<99.99)
                   {
                   
                    item[key] = value;
                    let serviceGTSAMOUNT= parseFloat((item['serviceGrossINR']*value)/100).toFixed(2);
                    item['serviceSellINR'] = (parseFloat(serviceGTSAMOUNT) + parseFloat(item['serviceGrossINR'])).toFixed(2);;
                    setTimeout(()=>{
                        this.setCalucation()
                    },500) 
                   }
                   else
                   {
                    alert('Please enter value than 99.99')
                    item[key]=''
                   }
                   
                   
                }
                else if(key=='serviceSellINR')
                {
                   
                   // item[key] = parseFloat(value).toFixed(2);
                   if(item['serviceGrossINR']=='' || item['serviceGrossINR']==0)
                   {
                    item[key] ='';
                    alert('Please enter value Gross INR')
                   } 
                   else if(item['serviceGSTPercentage']=='' || item['serviceGSTPercentage']==0)
                   {
                    item[key] ='';
                    alert('Please enter value GTI GST Percentage')
                   }                
                   else 
                   {
                    item[key] = value.slice(0, 6);
                    setTimeout(()=>{
                        this.setCalucation()
                    },500) 
                   }
                   
                   
                   
                }
                else if(key=='serviceUSDMarkupPercentage')
                {
                   // item[key] = parseFloat(value).toFixed(2);
                   if(item['serviceNetUSD']=='' || item['serviceNetUSD']==0)
                   {
                   
                    alert('Please enter value of  Net USD')
                   }               
                   else if(value<99.99)
                   {
                    item[key] = value;
                    let serviceGTSCommissionAmount= parseFloat((item['serviceNetUSD']*value)/100).toFixed(2);
                    item['serviceUSDCommission']=serviceGTSCommissionAmount
                    item['serviceUSDClientDollar'] = (parseFloat(serviceGTSCommissionAmount) + parseFloat(item['serviceNetUSD'])).toFixed(2);; 
                   }
                   else
                   {
                    alert('Please enter value than 99.99')
                    item[key] = '';
                   }
                   
                   
                }
                else if(key=='serviceUSDMarkUpAmount')
                {
                   // item[key] = parseFloat(value).toFixed(2);
                   if(item['serviceNetUSD']=='' || item['serviceNetUSD']==0)
                   {
                   
                    alert('Please enter value of  Net USD')
                   }               
                   else 
                   {
                    item[key] = value;               
                    item['serviceUSDCommission']=value
                    item['serviceUSDClientDollar'] = (parseFloat(value) + parseFloat(item['serviceNetUSD'])).toFixed(2);; 
                   }
                   
                   
                   
                }
                
                else if(key=='cityId')
                {
                    item[key] = value;    
                    item['vendorTypeId'] = '0';
                    item['vendorId'] = '0';
                    item['serviceId'] = '0';
                 
                }
                else if(key=='vendorTypeId')
                {
                    if(item['cityId']!="")
                    {
                    item[key] = value;                  
                    let vendorList=this.props.vendorList;
                    vendorList=vendorList.filter((_item)=>_item.vendorTypeId==value && _item.cityId==item['cityId']);
                    item['vendorList'] = vendorList;
                    item['vendorId'] = '0';
                    item['serviceId'] = '0';
                    this.setState({serviceFeeList:[]})   
                    }
                    else
                    {
                        item[key] = ''; 
                           
                        alert("PLease select the city name")
                    }
                }
                else if(key=='vendorId')
                {
                    item[key] = value;
                    let serviceList=this.props.serviceList;
                  
                    serviceList=serviceList.filter((_item)=>_item.vendorId==value)
                    item['serviceList'] = serviceList;
                    item['serviceId'] = '0';
                  
                }
                else if(key=='serviceFeeList')
                {
                  
                    let serviceFeeList=this.state.serviceFeeList.filter((item)=>item.id==value);
                    item['rate'] = ArrayHelper.getValue(serviceFeeList,'[0].rate')
                    item['unit'] = 1;
                    item['cost'] = ArrayHelper.getValue(serviceFeeList,'[0].cost')
                    item['markupPercentage'] = ArrayHelper.getValue(serviceFeeList,'[0].markupPercentage')
                    item['markupAmount'] = ArrayHelper.getValue(serviceFeeList,'[0].markupAmount')
                    if(ArrayHelper.getValue(serviceFeeList,'[0].markupPercentage')==0)
                    {
                        item['commissionType']='byAmount';
                        item['commissionTypeUS']='byAmount'; 
                        item['serviceGTICommission'] = ArrayHelper.getValue(serviceFeeList,'[0].markupAmount') ; 
                        item['serviceGrossINR'] = ArrayHelper.getValue(serviceFeeList,'[0].markupAmount') + ArrayHelper.getValue(serviceFeeList,'[0].markupAmount');
                    }
                    else
                    {
                        let serviceGTICommission= (ArrayHelper.getValue(serviceFeeList,'[0].cost')*ArrayHelper.getValue(serviceFeeList,'[0].markupPercentage'))/100
                        item['commissionType']='byPercentage'; 
                        item['commissionTypeUS']='byPercentage'; 
                        item['serviceGTICommission'] = serviceGTICommission ; 
                        item['serviceGrossINR'] = serviceGTICommission +ArrayHelper.getValue(serviceFeeList,'[0].cost'); 
                    }
                    setTimeout(()=>{
                        this.setCalucation()
                    },500)
                
                }
                else if(key=='serviceId')
                {
                    item[key] = value;
                    let serviceList=this.props.serviceList;
                  
                    serviceList=serviceList.filter((item)=>item.id==value)
                    this.setState({serviceFeeList:ArrayHelper.getValue(serviceList,'[0].serviceFeeDetails',[])})
                    //item['serviceList'] = serviceList;
                    $(".serviceFee").prop({'checked':false})
                }
                else if((key=='startDate') &&   ArrayHelper.getValue(value,'_d')!='')
                        {
                            item[key] = value;
                            setTimeout(()=>{
                                this.setCalucation()
                            },500)
                        
                            
                         
            
                        }       
                        else if((key=='endDate'))
                        {
                            if(item['startDate']!="")
                            {
                           
                  
                        
                           item[key] = value;
                           setTimeout(()=>{
                            this.setCalucation()
                        },500)
                        
                       
                    }                
                        
                    else if(key=='serviceGTICommission' || key=='serviceGrossINR'   || key=='serviceNetUSD'  || key=='serviceUSDCommission' || key=='serviceUSDClientDollar')
                    {
                       // item[key] = parseFloat(value).toFixed(2);
                        item[key] = value.slice(0, 6);
                    }       
                else
                {
                    item[key] = value;
                }
                
            }
          
            return item;
        })
    });
    }
   
        submitItinerarySerice()
        {
            let error="";
            if(error=="" && this.props.ItineraryData.name=="")
            {
                alert("Please enter the Itinerary Name.");
                error="yes"   
            }
            // if(error=="" && this.props.TourItineraryServiceData[0].serviceDescription=="")
            // {
            //     alert("Please enter the service Name.");
            //     error="yes"   
            // }
            if(error=="" && this.props.TourItineraryServiceData[0].startDate=="")
            {
                alert("Please enter the state date.");
                error="yes"   
            }
            if(error=="" && this.props.TourItineraryServiceData[0].endDate=="")
            {
                alert("Please enter the end date");
                error="yes"   
            }
            if(error=="" && this.props.TourItineraryServiceData[0].cityId=="")
            {
                alert("Please select the city.");
                error="yes"   
            }
            if(error=="" && this.props.TourItineraryServiceData[0].vendorTypeId=="")
            {
                alert("Please select the vendor type.");
                error="yes"   
            }
            if(error=="" && this.props.TourItineraryServiceData[0].vendorId=="")
            {
                alert("Please select the vendor.");
                error="yes"   
            }
            if(error=="" && this.props.TourItineraryServiceData[0].serviceId=="")
            {
                alert("Please select the service.");
                error="yes"   
            }
            if(error=="" && this.props.TourItineraryServiceData[0].rate=="")
            {
                alert("Please enter the rate.");
                error="yes"   
            }
            if(error=="" && this.props.TourItineraryServiceData[0].unit=="")
            {
                alert("Please enter the unit.");
                error="yes"   
            }
            if(error=="" && this.props.TourItineraryServiceData[0].cost=="")
            {
                alert("Please enter the cost.");
                error="yes"   
            }
            if(error=="" && this.props.TourItineraryServiceData[0].serviceGTICommission=="")
            {
                alert("Please enter the GTI Commission.");
                error="yes"   
            }
            if(error=="" && this.props.TourItineraryServiceData[0].serviceGrossINR=="")
            {
                alert("Please enter the GTI gross amount");
                error="yes"   
            }
            if(error=="" && this.props.TourItineraryServiceData[0].serviceGSTPercentage=="")
            {
                alert("Please enter the GTI GST Percentage");
                error="yes"   
            }
            if(error=="" && this.props.TourItineraryServiceData[0].serviceSellINR=="")
            {
                alert("Please enter the GTI shell amount.");
                error="yes";   
            } 
            if(error=="" && this.props.TourItineraryServiceData[0].isShowOnItinerary=="Yes" && this.props.TourItineraryServiceData[0].description=="")
            {
                alert("Please enter description.");
                error="yes";   
            }
            if(error=="" && this.props.TourItineraryServiceData[0].quoteType=="")
            {
                alert("Please select the Quote Type.");
                error="yes";   
            } 
            if(error=="") 
            {
               this.props.addItinerarySerice(); 
               this.setState({selectedKey:'',actionType:'add',serviceFeeList:[]})
               setTimeout(()=>{
                inputPropsStart={
                    required: false,
                    readOnly: true,
                    value:'',
                }
                inputPropsEnd={
                    required: false,
                    readOnly: true,
                    value:'',
                }
               
            },10)
            }
        } 
        resetItinerarySerice()
        {
            this.props.resetItinerarySerice(); 
            this.setState({selectedKey:'',actionType:'add',serviceFeeList:[]})
              
        }  
    render(){
        return(
          
            <React.Fragment>
                <div className="p-3 border mt-2 mb-2 boxAddPassanger whiteBackgound">
             
                <span className="me-2 heading">Itinerary Service</span>  <span className="txt-right floatright"><button  onClick={()=>this.resetItinerarySerice()} type="button" className="btn btn-sm btn-primary rounded">Reset</button></span>
                {this.props.TourItineraryServiceData.map((item,key)=>{
              
                            return(<div key={`service-${key}`}>
                <div className="d-flex mb-4">
                            {/* <div className="flex-fill p-1">
                                <label  className="form-label">Heading</label>
                                <input   type="text" className="form-control form-control-sm" 
                                             id={`serviceDescriptionld_${key}`}
                                             name={`tours[${key}].serviceDescription`} 
                                             value={item.serviceDescription}
                                             maxLength={200}
                                             onChange={(event: any) => this.handleItineraryServiceInput(key, 'serviceDescription', event.currentTarget.value)}
                                            placeholder="Enter Heading"/>
                            </div> */}
                            <div className="flex-fill p-1" id="htmlstartDate">
                                <label  className="form-label">Start Date Time</label>
                                <br/>
                                <DateTimePicker  placeholder="Enter Start Date"   format={DATEFORMTEOFDATE}   value={item.startDate}  name={`tours[${key}].startDate`} 
                                          
                                          onChange={(date:Date) => this.handleItineraryServiceInput(key, 'startDate', date)} />
                                {/* <DatePicker  inputProps={inputPropsStart}  
                                                name={`tours[${key}].startDate`} 
                                                timeFormat={false}                                            
                                             value={item.startDate}
                                             onChange={(date:Date) => this.handleItineraryServiceInput(key, 'startDate', date)}
                                            placeholder="Enter  Start Date"   className=" formdate form-noradious"    /> */}
                            </div>
                            <div className="flex-fill p-1" id="htmlendDate">
                                <label  className="form-label">End Date Time</label>
                                <br/>
                                <DateTimePicker minDate={new Date(item.startDate)}  placeholder="Enter End Date"   format={DATEFORMTEOFDATE}   value={item.endDate}  name={`tours[${key}].endDate`} 
                                          
                                          onChange={(date:Date) => this.handleItineraryServiceInput(key, 'endDate', date)} />
                                {/* <DatePicker  inputProps={inputPropsEnd}  
                                                name={`tours[${key}].endDate`}
                                                timeFormat={false}                                             
                                             value={item.endDate}
                                             onChange={(date:Date) => this.handleItineraryServiceInput(key, 'endDate', date)}
                                            placeholder="Enter  End Date"   className="form-control formdate form-noradious"    /> */}
                            </div>
                            <div className="flex-fill p-1" id="seviceHtmlcityId">
                                <label  className="form-label">City</label>
                              
                                            {/* <DropdownList filter
                                  data={this.props.cityList}
                                  placeholder="Select City"
                                  onChange={(event: any) => this.handleItineraryServiceInput(0, 'cityId', event.id)}
                                  defaultValue={item.cityId}
                                  dataKey='id'
                                  textField='name' /> */}
                                   <select  className="form-select form-select-sm"                                            
                                             value={item.cityId}
                                             onChange={(event: any) => this.handleItineraryServiceInput(0, 'cityId', event.currentTarget.value)}
                                            >
                                                <option value="">Select City</option>
                                                {this.props.cityList.map((item,key)=>{
                                          return(<option key={`cityList-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'name')}</option>)
                                        })}
                                            </select>
                            </div>
                            <div className="flex-fill p-1" id="seviceHtmlvendorTypeId">
                                <label  className="form-label">Vendor Type</label>
                               
                                            {/* <DropdownList filter
                                  data={this.props.vendorTypeList}
                                  placeholder="Select Vendor Type"
                                  onChange={(event: any) => this.handleItineraryServiceInput(0, 'vendorTypeId', event.id)}
                                  defaultValue={item.vendorTypeId}
                                  dataKey='id'
                                  textField='name' /> */}
                                  <select  className="form-select form-select-sm"                                            
                                             value={item.vendorTypeId}
                                             onChange={(event: any) => this.handleItineraryServiceInput(0, 'vendorTypeId', event.currentTarget.value)}
                                            >
                                                <option value="">Select Vendor Type</option>
                                                {this.props.vendorTypeList.map((item,key)=>{
                                          return(<option key={`vendorTypeList-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'name')}</option>)
                                        })}
                                            </select>
                            </div>
                            <div className="flex-fill p-1" id="seviceHtmlvendorId">
                                <label  className="form-label">Vendor</label>
                                            {/* <DropdownList filter
                                  data={ArrayHelper.getValue(item,'vendorList',[])}
                                  placeholder="Select Vendor Type"
                                  onChange={(event: any) => this.handleItineraryServiceInput(0, 'vendorId', event.id)}
                                  defaultValue={item.vendorId}
                                  dataKey='id'
                                  textField='vendorName' /> */}
                                   <select  className="form-select form-select-sm"                                            
                                             value={item.vendorId}
                                             onChange={(event: any) => this.handleItineraryServiceInput(0, 'vendorId', event.currentTarget.value)}
                                            >
                                                <option value="">Select Vendor</option>
                                                {ArrayHelper.getValue(item,'vendorList',[]).map((item,key)=>{
                                          return(<option key={`vendorList-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'vendorName')}</option>)
                                        })}
                                            </select>
                            </div>
                            <div className="flex-fill p-1" id="seviceHtmlserviceId">
                                <label  className="form-label">Service</label>
                                            {/* <DropdownList filter
                                  data={ArrayHelper.getValue(item,'serviceList',[])}
                                  placeholder="Select Service"
                                  onChange={(event: any) => this.handleItineraryServiceInput(0, 'serviceId', event.id)}
                                  defaultValue={item.serviceId}
                                  dataKey='id'
                                  textField='name' /> */}
                                   <select  className="form-select form-select-sm"                                            
                                             value={item.serviceId}
                                             onChange={(event: any) => this.handleItineraryServiceInput(0, 'serviceId', event.currentTarget.value)}
                                            >
                                                <option value="">Select Service</option>
                                                {ArrayHelper.getValue(item,'serviceList',[]).map((item,key)=>{
                                          return(<option key={`serviceList-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'name')}</option>)
                                        })}
                                            </select>
                            </div>
                                                                                 
                </div>
                {(this.state.serviceFeeList.length>0)?<div className="col-md-12 mb-2">
                                              <p className="widthFull"><label className="form-label width100">Service Fee List:</label> </p>
                                                                                
                                             {this.state.serviceFeeList.map((__tem,__key)=>{
                                                return(<p key={`serviceFeeList-${__key}`}  className="form-label widthFull"><input value={__tem.id} className="serviceFee" type="radio" name="serviceFee"  onClick={() => this.handleItineraryServiceInput(key, 'serviceFeeList',__tem.id)}   /> {ArrayHelper.getValue(__tem,'description')}</p> )
                                             })}
                                        </div>:''}
                <div className="d-flex mb-4">
                            <div className="flex-fill p-1">
                                <label  className="form-label">Markup  Type</label>
                                <select className="form-select form-select-sm"  id={`commissionTypeld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${key}].commissionType`} 
                                             value={item.commissionType}
                                             onChange={(event: any) => this.handleItineraryServiceInput(key, 'commissionType', event.currentTarget.value)}
                                              aria-label=".form-select-sm example">
                                                <option value="byPercentage">By Percentage</option>
                                                <option value="byAmount">By Amount</option>
                                            </select>
                            </div>
                            <div className="flex-fill p-1">
                                <label  className="form-label">Rate</label>
                                            <input type="number" className="form-control form-control-sm" 
                                             id={`rateld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${key}].rate`} 
                                             value={item.rate}
                                             onChange={(event: any) => this.handleItineraryServiceInput(key, 'rate', event.currentTarget.value)}
                                            placeholder="Enter Rate"/>
                            </div>
                            <div className="flex-fill p-1">
                                <label  className="form-label">Unit</label>
                                <input type="number" className="form-control form-control-sm" 
                                             id={`rateld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${key}].unit`} 
                                             value={item.unit}
                                             onChange={(event: any) => this.handleItineraryServiceInput(key, 'unit', event.currentTarget.value)}
                                            placeholder="Enter Unit"/>
                            </div>
                            <div className="flex-fill p-1">
                                <label  className="form-label">Cost</label>
                                <input type="number" className="form-control form-control-sm" readOnly
                                             id={`costld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${key}].cost`} 
                                             value={item.cost}
                                             onChange={(event: any) => this.handleItineraryServiceInput(key, 'cost', event.currentTarget.value)}
                                            placeholder="Enter Cost"/>
                            </div>
                            <div className={(item.commissionType=='byPercentage')?'flex-fill p-1 show':'flex-fill p-1 hide'}>
                                <label  className="form-label">Markup Percentage</label>
                                <input type="number" className="form-control form-control-sm" 
                                             id={`markupPercentageld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${key}].markupPercentage`} 
                                             value={item.markupPercentage}
                                             onChange={(event: any) => this.handleItineraryServiceInput(key, 'markupPercentage', event.currentTarget.value)}
                                            placeholder="Enter Markup Percentage"/>
                            </div>
                            <div className={(item.commissionType=='byAmount')?'flex-fill p-1 show':'flex-fill p-1 hide'}>
                                <label  className="form-label">Markup Amount</label>
                                <input type="number" className="form-control form-control-sm" 
                                             id={`markupAmountld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${key}].markupAmount`} 
                                             value={item.markupAmount}
                                             onChange={(event: any) => this.handleItineraryServiceInput(key, 'markupAmount', event.currentTarget.value)}
                                            placeholder="Enter Markup Amount"/>
                            </div>
                            <div className="flex-fill p-1">
                                <label  className="form-label">GTI Commission</label>
                                <input type="number" className="form-control form-control-sm" readOnly
                                             id={`serviceGTICommissionld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${key}].serviceGTICommission`} 
                                             value={item.serviceGTICommission}
                                             onChange={(event: any) => this.handleItineraryServiceInput(key, 'serviceGTICommission', event.currentTarget.value)}
                                            placeholder="Enter Service GTI Commission"/>
                            </div>
                            <div className="flex-fill p-1">
                                <label  className="form-label">GTI Gross (INR)</label>
                                <input type="number" className="form-control form-control-sm" 
                                             id={`serviceGrossINRld_${this.props.ItenararyKey}_${key}`} readOnly
                                             name={`tours[${key}].serviceGrossINR`} 
                                             value={item.serviceGrossINR}
                                             onChange={(event: any) => this.handleItineraryServiceInput(key, 'serviceGrossINR', event.currentTarget.value)}
                                            placeholder="Enter Service Gross INR<"/>
                            </div>
                            <div className="flex-fill p-1">
                                <label  className="form-label">GTI GST Percentage</label>
                                <input type="number" className="form-control form-control-sm" 
                                             id={`serviceGSTPercentageld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${key}].serviceGSTPercentage`} 
                                             value={item.serviceGSTPercentage}
                                             onChange={(event: any) => this.handleItineraryServiceInput(key, 'serviceGSTPercentage', event.currentTarget.value)}
                                            placeholder="Enter Service GST Percentage"/>
                            </div> 
                            <div className="flex-fill p-1">
                                <label  className="form-label">GTI Sell (INR)</label>
                                <input type="number" className="form-control form-control-sm" 
                                             id={`serviceSellINRld_${this.props.ItenararyKey}_${key}`} readOnly
                                             name={`tours[${key}].serviceSellINR`} 
                                             value={item.serviceSellINR}
                                             onChange={(event: any) => this.handleItineraryServiceInput(key, 'serviceSellINR', event.currentTarget.value)}
                                            placeholder="Enter Service Sell INR"/>
                            </div>  
                                                                                  
                </div>
                <div className="d-flex mb-4">
                            <div className="flex-fill p-1">
                                <label  className="form-label">Markup  Type</label>
                                <select className="form-select form-select-sm"  id={`commissionTypeUSld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${key}].commissionTypeUS`} 
                                             value={item.commissionTypeUS}
                                             onChange={(event: any) => this.handleItineraryServiceInput(key, 'commissionTypeUS', event.currentTarget.value)}
                                              aria-label=".form-select-sm example">
                                                <option value="byPercentage">By Percentage</option>
                                                <option value="byAmount">By Amount</option>
                                            </select>
                            </div>
                            <div className="flex-fill p-1">
                                <label  className="form-label">Sales Amount ({this.props.currency})</label>
                                <input type="number" className="form-control form-control-sm" 
                                             id={`serviceNetUSDld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${key}].servserviceNetUSDiceId`} 
                                             value={item.serviceNetUSD}
                                             onChange={(event: any) => this.handleItineraryServiceInput(key, 'serviceNetUSD', event.currentTarget.value)}
                                            placeholder="Enter Service Net USD"/>
                            </div>
                            <div className={(item.commissionTypeUS=='byPercentage')?'flex-fill p-1 show':'flex-fill p-1 hide'}>
                                <label  className="form-label">Markup Percentage</label>
                                <input type="number" className="form-control form-control-sm" 
                                             id={`serviceUSDMarkupPercentageld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${key}].serviceUSDMarkupPercentage`} 
                                             value={item.serviceUSDMarkupPercentage}
                                             onChange={(event: any) => this.handleItineraryServiceInput(key, 'serviceUSDMarkupPercentage', event.currentTarget.value)}
                                            placeholder="Enter Service USD Markup Percentage"/>
                            </div>
                            <div className={(item.commissionTypeUS=='byAmount')?'flex-fill p-1 show':'flex-fill p-1 hide'}>
                                <label  className="form-label"> Markup Amount ({this.props.currency})</label>
                                <input type="number" className="form-control form-control-sm" 
                                             id={`serviceUSDMarkUpAmountld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${key}].serviceUSDMarkUpAmount`} 
                                             value={item.serviceUSDMarkUpAmount}
                                             onChange={(event: any) => this.handleItineraryServiceInput(key, 'serviceUSDMarkUpAmount', event.currentTarget.value)}
                                            placeholder="Enter Service USD MarkUp Amount"/>
                            </div>
                            <div className="flex-fill p-1">
                                <label  className="form-label"> Commission ({this.props.currency}}</label>
                                <input type="number" className="form-control form-control-sm" 
                                 name="serviceUSDCommission" 
                                 value={item.serviceUSDCommission} readOnly
                                 onChange={(event: any) => this.handleItineraryServiceInput(key, 'serviceUSDCommission', event.currentTarget.value)}
                                            placeholder="Enter Service USD Commission"/>
                            </div>
                            <div className="flex-fill p-1">
                                <label  className="form-label">Payable Amount Exclude  Tax ({this.props.currency})</label>
                                <input type="number" className="form-control form-control-sm" 
                                             id={`serviceUSDClientDollarld_${this.props.ItenararyKey}_${key}`} readOnly
                                             name={`tours[${key}].serviceUSDClientDollar`} 
                                             value={item.serviceUSDClientDollar}
                                             onChange={(event: any) => this.handleItineraryServiceInput(key, 'serviceUSDClientDollar', event.currentTarget.value)}
                                            placeholder="Enter Service US DClient Dollar"/>
                            </div>
                            <div className="flex-fill p-1">
                                <label  className="form-label">Quote Type</label>
                                <select className="form-select form-select-sm"  id={`quoteTypeld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${key}].quoteType`} 
                                             value={item.quoteType}
                                             onChange={(event: any) => this.handleItineraryServiceInput(key, 'quoteType', event.currentTarget.value)}
                                              aria-label=".form-select-sm example">
                                                <option value="">Select Quote Type</option>
                                                {this.props.quoteTypeList.map((item,key)=>{
                                          return(<option key={`quoteTypeList-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'name')}</option>)
                                        })}
                                            </select>
                            </div>
                            <div className="flex-fill p-1">
                                <label  className="form-label">Show On Itinerary</label>
                                <br/>
                                {(item.isShowOnItinerary==true)?<input  className="" type="radio"
                      checked
                      
                      name={`tours[${key}].isShowOnItinerary`} 
                      value={item.isShowOnItinerary}
                        onChange={(event: any) => this.handleItineraryServiceInput(key, 'isShowOnItinerary', 'Yes')}
                        />:<input  className="" type="radio"
                      
                      
                        name={`tours[${key}].isShowOnItinerary`} 
                        value={item.isShowOnItinerary}
                          onChange={(event: any) => this.handleItineraryServiceInput(key, 'isShowOnItinerary', 'Yes')}
                          />} Yes &nbsp; &nbsp;   {(item.isShowOnItinerary==false)?<input   type="radio"
                      checked
                        name={`tours[${key}].isShowOnItinerary`} 
                        value={item.isShowOnItinerary}
                        onChange={(event: any) => this.handleItineraryServiceInput(key, 'isShowOnItinerary', 'No')}
                        />:<input   type="radio"
                      
                        name={`tours[${key}].isShowOnItinerary`} 
                        value={item.isShowOnItinerary}
                        onChange={(event: any) => this.handleItineraryServiceInput(key, 'isShowOnItinerary', 'No')}
                        />} No
                            </div>
                                                                                 
                </div>
                <div className="d-flex mb-4">
                            <div className="flex-fill p-1">
                                <label  className="form-label">Description</label>
                                <textarea type="text" className="form-control form-control-sm" 
                                             name="description" 
                                             value={item.description}
                                             onChange={(event: any) => this.handleItineraryServiceInput(key, 'description', event.currentTarget.value)}
                                            placeholder="Enter  Description"/>
                            </div>
                           
                            <div className="flex-fill p-1 maxWwidth100">
                            <button  onClick={()=>this.submitItinerarySerice()} type="button" className="btn btn-sm btn-primary rounded mt-4">{(item.id==0)?<i className="fa-solid fa-plus"></i>:''}{(item.id!=0)?'Update':'Add'} </button>   
                            </div>                                                        
                </div>
                </div>)
                })}
              
                </div>
               
            </React.Fragment>
        )
    }
}  



export default  TourItineraryServiceFormComponent;