import React from "react";
import {ArrayHelper} from "../../../helpers/arrayhelper";
import {formatDate} from "../../../vendor/datefns";
import {DATEDURATION} from '../../../helpers/constants';
import DatePicker from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import $ from 'jquery'; 
class TourItineraryServiceFieldComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loader:false,tourItineraryService:[],serviceFeeList:[]};
    }
    handleItineraryServiceInput(travelKey:any,index: number, key: string, value: any) {
       
this.setState({
    tourItineraryService:  this.props.tourItineraryService.map((item: any, k: number) => {                
        if (index == k) {
            if(key=='rate' || key=='cost'  || key=='serviceGTICommission' || key=='serviceGrossINR'  || key=='serviceSellINR' || key=='serviceNetUSD'  || key=='serviceUSDCommission' || key=='serviceUSDClientDollar')
            {
               // item[key] = parseFloat(value).toFixed(2);
                item[key] = value;
            }
            else if(key=='markupPercentage')
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
               else if(value<99.99)
               {
                item[key] = value;
                let serviceGTICommission= parseFloat((item['cost']*value)/100).toFixed(2);
                    item['serviceGTICommission'] = serviceGTICommission ; 
                    item['serviceGrossINR'] = (parseFloat(serviceGTICommission) + parseFloat(item['cost'])).toFixed(2);; 
               }
               else
               {
                alert('Please enter value than 99.99')
                item[key] ='';
               }
               
            }
            else if(key=='unit')
            {
               // item[key] = parseFloat(value).toFixed(2);
               if(item['rate']=='' || item['rate']==0)
               {
                item[key] ='';
                alert('Please enter value rate')
               }
               else if(item['startDate']=='')
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
                item[key] = value;
                    let duartion = DATEDURATION(formatDate(item['startDate'],'yyyy-MM-dd'),formatDate(item['endDate'],'yyyy-MM-dd'));                   
                    item['cost'] = (duartion*value*parseFloat(item['rate'])).toFixed(2);; 
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
               }
               
               
            }
            else if(key=='serviceGSTPercentage')
            {
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
               }
               else
               {
                alert('Please enter value than 99.99')
                item[key]=''
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
            
            else if(key=='vendorTypeId')
            {
                item[key] = value;
                let vendorList=this.props.vendorList;
                vendorList=vendorList.filter((item)=>item.vendorTypeId==value)
                item['vendorList'] = vendorList;
            }
            else if(key=='vendorId')
            {
                item[key] = value;
                let serviceList=this.props.serviceList;
              
                serviceList=serviceList.filter((item)=>item.vendorId==value)
                item['serviceList'] = serviceList;
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
                    item['serviceGTICommission'] = ArrayHelper.getValue(serviceFeeList,'[0].markupAmount') ; 
                    item['serviceGrossINR'] = ArrayHelper.getValue(serviceFeeList,'[0].markupAmount') + ArrayHelper.getValue(serviceFeeList,'[0].markupAmount');
                }
                else
                {
                    let serviceGTICommission= (ArrayHelper.getValue(serviceFeeList,'[0].cost')*ArrayHelper.getValue(serviceFeeList,'[0].markupPercentage'))/100
                    item['commissionType']='byPercentage'; 
                    item['serviceGTICommission'] = serviceGTICommission ; 
                    item['serviceGrossINR'] = serviceGTICommission +ArrayHelper.getValue(serviceFeeList,'[0].cost'); 
                }
               
            
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
                        let valuedata= formatDate(ArrayHelper.getValue(value,'_d'),'MM/dd/yyyy hh:mm a');
                     
                        item[key] = valuedata;
        
                    }       
                    else if((key=='endDate') &&   ArrayHelper.getValue(value,'_d')!='')
                    {
                        let valuedata= formatDate(ArrayHelper.getValue(value,'_d'),'MM/dd/yyyy hh:mm a');

                    
                     item[key] = valuedata;
                     let tourStartDate=item['startDate'];
                     if(tourStartDate!='')
                     {
                      let tourStartDatetime= new Date(tourStartDate)
                      let tourEndDatetime= new Date(valuedata)
                      if(tourStartDatetime.getTime()>tourEndDatetime.getTime())
                      {
                         item[key] = '';
                         alert('Please select End Date Time is less than State Date Time')
                        
                      }
                     }
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
    render(){
        let inputProps={
            required: false,
            readOnly:true
        }
        return(
          
            <React.Fragment>
                <div className="accordion border-0 pt-3 p-4" id={`accordionSeviceExample-${this.props.ItenararyKey}`}>
               {this.props.tourItineraryService.map((item,key)=>{
                if(item.startDate=='1900-01-01T00:00:00')
                {
                    item.startDate='';
                }
                else if(item.startDate!='')
                {
                    item.startDate= formatDate(item.startDate,'MM/dd/yyyy hh:mm a');
                }
                if(item.endDate=='1900-01-01T00:00:00')
                {
                    item.endDate='';
                }
                else if(item.endDate!='')
                {
                    item.endDate= formatDate(item.endDate,'MM/dd/yyyy hh:mm a');
                }
                            return(<div className="accordion-item" key={`internaryService-${this.props.ItenararyKey}-${key}`}>
                            <h2 className="accordion-header" id={`headingInternaryService-${this.props.ItenararyKey}-${key}`}>
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapseInternaryService-${this.props.ItenararyKey}-${key}`} aria-expanded="false" aria-controls={`collapseInternaryService-${this.props.ItenararyKey}-${key}`}>
                                Itinerary Service {key+1}
                                    </button>
                            </h2>
                            <div id={`collapseInternaryService-${this.props.ItenararyKey}-${key}`} className="accordion-collapse collapse show" aria-labelledby={`headingInternaryService-${this.props.ItenararyKey}-${key}`} data-bs-parent={`#accordionSeviceExample-${this.props.ItenararyKey}`}>
                                <div className="accordion-body pb-0">
                                    <div className="row">
                                    <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Heading</label>
                                            <input   type="text" className="form-control form-control-sm" 
                                             id={`serviceDescriptionld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${this.props.ItenararyKey+'_'+key}].serviceDescription`} 
                                             value={item.serviceDescription}
                                             maxLength={200}
                                             onChange={(event: any) => this.handleItineraryServiceInput(this.props.ItenararyKey,key, 'serviceDescription', event.currentTarget.value)}
                                            placeholder="Enter Heading"/>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="stops" className="form-label"> Start Date Time:</label>
                                           
                                            <DatePicker  inputProps={inputProps}  
                                                name={`tours[${this.props.ItenararyKey+'_'+key}].startDate`}                                             
                                             value={item.startDate}
                                             onChange={(date:Date) => this.handleItineraryServiceInput(this.props.ItenararyKey,key, 'startDate', date)}
                                            placeholder="Enter  Start Date"   className="form-control formdate form-noradious"    />
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="stops" className="form-label"> End Date Time:</label>
                                           
                                            <DatePicker  inputProps={inputProps}  
                                                name={`tours[${this.props.ItenararyKey+'_'+key}].endDate`}                                             
                                             value={item.endDate}
                                             onChange={(date:Date) => this.handleItineraryServiceInput(this.props.ItenararyKey,key, 'endDate', date)}
                                            placeholder="Enter  End Date"   className="form-control formdate form-noradious"    />
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Vendor Type</label>                                           
                                             <select  className="form-select form-select-sm"  id={`vendorTypeIdld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${this.props.ItenararyKey+'_'+key}].vendorTypeId`} 
                                             value={item.vendorTypeId}
                                             onChange={(event: any) => this.handleItineraryServiceInput(this.props.ItenararyKey,key, 'vendorTypeId', event.currentTarget.value)}
                                              aria-label=".form-select-sm example">
                                                <option value="">Select Vendor Type</option>
                                                {this.props.vendorTypeList.map((item,key)=>{
                                          return(<option key={`vendorTypeList-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'name')}</option>)
                                        })}
                                            </select>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Vendor </label>                                           
                                             <select  className="form-select form-select-sm"  id={`vendorIdld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${this.props.ItenararyKey+'_'+key}].vendorId`} 
                                             value={item.vendorId}
                                             onChange={(event: any) => this.handleItineraryServiceInput(this.props.ItenararyKey,key, 'vendorId', event.currentTarget.value)}
                                              aria-label=".form-select-sm example">
                                                <option value="">Select Vendor</option>
                                                {ArrayHelper.getValue(item,'vendorList',[]).map((item,key)=>{
                                          return(<option key={`vendorList-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'vendorName')}</option>)
                                        })}
                                            </select>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Service</label>                                           
                                             <select  className="form-select form-select-sm"  id={`serviceIdld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${this.props.ItenararyKey+'_'+key}].serviceId`} 
                                             value={item.serviceId}
                                             onChange={(event: any) => this.handleItineraryServiceInput(this.props.ItenararyKey,key, 'serviceId', event.currentTarget.value)}
                                              aria-label=".form-select-sm example">
                                                <option value="">Select Service</option>
                                                {ArrayHelper.getValue(item,'serviceList',[]).map((item,key)=>{
                                          return(<option key={`serviceList-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'name')}</option>)
                                        })}
                                            </select>
                                        </div>
                                        {(this.state.serviceFeeList.length>0)?<div className="col-md-12 mb-3">
                                              <label className="form-label width100">Service Fee List:</label>                                       
                                             {this.state.serviceFeeList.map((__tem)=>{
                                                return(<p  className="form-label width100"><input className="serviceFee" type="radio" name="serviceFee" onClick={() => this.handleItineraryServiceInput(this.props.ItenararyKey,key, 'serviceFeeList',__tem.id)} /> {ArrayHelper.getValue(__tem,'description')}</p> )
                                             })}
                                        </div>:''}
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Markup  Type</label>                                            
                                             <select className="form-select form-select-sm"  id={`commissionTypeld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${this.props.ItenararyKey+'_'+key}].commissionType`} 
                                             value={item.commissionType}
                                             onChange={(event: any) => this.handleItineraryServiceInput(this.props.ItenararyKey,key, 'commissionType', event.currentTarget.value)}
                                              aria-label=".form-select-sm example">
                                                <option value="byPercentage">By Percentage</option>
                                                <option value="byAmount">By Amount</option>
                                            </select>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Rate</label>
                                            <input type="number" className="form-control form-control-sm" 
                                             id={`rateld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${this.props.ItenararyKey+'_'+key}].rate`} 
                                             value={item.rate}
                                             onChange={(event: any) => this.handleItineraryServiceInput(this.props.ItenararyKey,key, 'rate', event.currentTarget.value)}
                                            placeholder="Enter Rate"/>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Unit</label>
                                            <input type="number" className="form-control form-control-sm" 
                                             id={`rateld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${this.props.ItenararyKey+'_'+key}].unit`} 
                                             value={item.unit}
                                             onChange={(event: any) => this.handleItineraryServiceInput(this.props.ItenararyKey,key, 'unit', event.currentTarget.value)}
                                            placeholder="Enter Unit"/>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Cost</label>
                                            <input type="number" className="form-control form-control-sm" 
                                             id={`costld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${this.props.ItenararyKey+'_'+key}].cost`} 
                                             value={item.cost}
                                             onChange={(event: any) => this.handleItineraryServiceInput(this.props.ItenararyKey,key, 'cost', event.currentTarget.value)}
                                            placeholder="Enter Cost"/>
                                        </div>
                                        
                                        <div className={(item.commissionType=='byPercentage')?'col-md-3 mb-3 show':'col-md-3 mb-3 hide'}>
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Markup Percentage</label>
                                            <input type="number" className="form-control form-control-sm" 
                                             id={`markupPercentageld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${this.props.ItenararyKey+'_'+key}].markupPercentage`} 
                                             value={item.markupPercentage}
                                             onChange={(event: any) => this.handleItineraryServiceInput(this.props.ItenararyKey,key, 'markupPercentage', event.currentTarget.value)}
                                            placeholder="Enter Markup Percentage"/>
                                        </div>
                                        <div className={(item.commissionType=='byAmount')?'col-md-3 mb-3 show':'col-md-3 mb-3 hide'}>
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Markup Amount</label>
                                            <input type="number" className="form-control form-control-sm" 
                                             id={`markupAmountld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${this.props.ItenararyKey+'_'+key}].markupAmount`} 
                                             value={item.markupAmount}
                                             onChange={(event: any) => this.handleItineraryServiceInput(this.props.ItenararyKey,key, 'markupAmount', event.currentTarget.value)}
                                            placeholder="Enter Markup Amount"/>
                                        </div>
                                       
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">GTI Commission</label>
                                            <input type="number" className="form-control form-control-sm" 
                                             id={`serviceGTICommissionld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${this.props.ItenararyKey+'_'+key}].serviceGTICommission`} 
                                             value={item.serviceGTICommission}
                                             onChange={(event: any) => this.handleItineraryServiceInput(this.props.ItenararyKey,key, 'serviceGTICommission', event.currentTarget.value)}
                                            placeholder="Enter Service GTI Commission"/>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label"> GTI Gross (INR)</label>
                                            <input type="number" className="form-control form-control-sm" 
                                             id={`serviceGrossINRld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${this.props.ItenararyKey+'_'+key}].serviceGrossINR`} 
                                             value={item.serviceGrossINR}
                                             onChange={(event: any) => this.handleItineraryServiceInput(this.props.ItenararyKey,key, 'serviceGrossINR', event.currentTarget.value)}
                                            placeholder="Enter Service Gross INR<"/>
                                        </div>                                     
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">GTI GST Percentage</label>
                                            <input type="number" className="form-control form-control-sm" 
                                             id={`serviceGSTPercentageld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${this.props.ItenararyKey+'_'+key}].serviceGSTPercentage`} 
                                             value={item.serviceGSTPercentage}
                                             onChange={(event: any) => this.handleItineraryServiceInput(this.props.ItenararyKey,key, 'serviceGSTPercentage', event.currentTarget.value)}
                                            placeholder="Enter Service GST Percentage"/>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">GTI Sell (INR)</label>
                                            <input type="number" className="form-control form-control-sm" 
                                             id={`serviceSellINRld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${this.props.ItenararyKey+'_'+key}].serviceSellINR`} 
                                             value={item.serviceSellINR}
                                             onChange={(event: any) => this.handleItineraryServiceInput(this.props.ItenararyKey,key, 'serviceSellINR', event.currentTarget.value)}
                                            placeholder="Enter Service Sell INR"/>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">US Markup  Type</label>                                            
                                             <select className="form-select form-select-sm"  id={`commissionTypeUSld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${this.props.ItenararyKey+'_'+key}].commissionTypeUS`} 
                                             value={item.commissionTypeUS}
                                             onChange={(event: any) => this.handleItineraryServiceInput(this.props.ItenararyKey,key, 'commissionTypeUS', event.currentTarget.value)}
                                              aria-label=".form-select-sm example">
                                                <option value="byPercentage">By Percentage</option>
                                                <option value="byAmount">By Amount</option>
                                            </select>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">GTI US Sales Amount (USD)</label>
                                            <input type="number" className="form-control form-control-sm" 
                                             id={`serviceNetUSDld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${this.props.ItenararyKey+'_'+key}].servserviceNetUSDiceId`} 
                                             value={item.serviceNetUSD}
                                             onChange={(event: any) => this.handleItineraryServiceInput(this.props.ItenararyKey,key, 'serviceNetUSD', event.currentTarget.value)}
                                            placeholder="Enter Service Net USD"/>
                                        </div>
                                        <div className={(item.commissionTypeUS=='byPercentage')?'col-md-3 mb-3 show':'col-md-3 mb-3 hide'}>
                                            <label htmlFor="exampleFormControlInput1" className="form-label">GTI US Markup Percentage</label>
                                            <input type="number" className="form-control form-control-sm" 
                                             id={`serviceUSDMarkupPercentageld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${this.props.ItenararyKey+'_'+key}].serviceUSDMarkupPercentage`} 
                                             value={item.serviceUSDMarkupPercentage}
                                             onChange={(event: any) => this.handleItineraryServiceInput(this.props.ItenararyKey,key, 'serviceUSDMarkupPercentage', event.currentTarget.value)}
                                            placeholder="Enter Service USD Markup Percentage"/>
                                        </div>
                                        <div className={(item.commissionTypeUS=='byAmount')?'col-md-3 mb-3 show':'col-md-3 mb-3 hide'}>
                                            <label htmlFor="exampleFormControlInput1" className="form-label">GTI US Markup Amount</label>
                                            <input type="number" className="form-control form-control-sm" 
                                             id={`serviceUSDMarkUpAmountld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${this.props.ItenararyKey+'_'+key}].serviceUSDMarkUpAmount`} 
                                             value={item.serviceUSDCommission}
                                             onChange={(event: any) => this.handleItineraryServiceInput(this.props.ItenararyKey,key, 'serviceUSDMarkUpAmount', event.currentTarget.value)}
                                            placeholder="Enter Service USD MarkUp Amount"/>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">GTI US Commission</label>
                                            <input type="number" className="form-control form-control-sm" 
                                             id={`serviceUSDCommissionld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${this.props.ItenararyKey+'_'+key}].serviceUSDCommission`} 
                                             value={item.serviceUSDCommission}
                                             onChange={(event: any) => this.handleItineraryServiceInput(this.props.ItenararyKey,key, 'serviceUSDCommission', event.currentTarget.value)}
                                            placeholder="Enter Service USD Commission"/>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">GTI US Payable Amount Exclude  Tax (USD)</label>
                                            <input type="number" className="form-control form-control-sm" 
                                             id={`serviceUSDClientDollarld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${this.props.ItenararyKey+'_'+key}].serviceUSDClientDollar`} 
                                             value={item.serviceUSDClientDollar}
                                             onChange={(event: any) => this.handleItineraryServiceInput(this.props.ItenararyKey,key, 'serviceUSDClientDollar', event.currentTarget.value)}
                                            placeholder="Enter Service US DClient Dollar"/>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Quote Type</label>                                            
                                             <select className="form-select form-select-sm"  id={`quoteTypeld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${this.props.ItenararyKey+'_'+key}].quoteType`} 
                                             value={item.quoteType}
                                             onChange={(event: any) => this.handleItineraryServiceInput(this.props.ItenararyKey,key, 'quoteType', event.currentTarget.value)}
                                              aria-label=".form-select-sm example">
                                                <option value="">Select Quote Type</option>
                                                {this.props.quoteTypeList.map((item,key)=>{
                                          return(<option key={`quoteTypeList-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'name')}</option>)
                                        })}
                                            </select>
                                        </div>
                                        
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Show On Itinerary</label>

<br/>
{(item.isShowOnItinerary==true)?<input  className="" type="radio"
                      checked
                      
                      name={`tours[${this.props.ItenararyKey+'_'+key}].isShowOnItinerary`} 
                      value={item.isShowOnItinerary}
                        onChange={(event: any) => this.handleItineraryServiceInput(this.props.ItenararyKey,key, 'isShowOnItinerary', 'Yes')}
                        />:<input  className="" type="radio"
                      
                      
                        name={`tours[${this.props.ItenararyKey+'_'+key}].isShowOnItinerary`} 
                        value={item.isShowOnItinerary}
                          onChange={(event: any) => this.handleItineraryServiceInput(this.props.ItenararyKey,key, 'isShowOnItinerary', 'Yes')}
                          />} Yes &nbsp; &nbsp;   {(item.isShowOnItinerary==false)?<input   type="radio"
                      checked
                        name={`tours[${this.props.ItenararyKey+'_'+key}].isShowOnItinerary`} 
                        value={item.isShowOnItinerary}
                        onChange={(event: any) => this.handleItineraryServiceInput(this.props.ItenararyKey,key, 'isShowOnItinerary', 'No')}
                        />:<input   type="radio"
                      
                        name={`tours[${this.props.ItenararyKey+'_'+key}].isShowOnItinerary`} 
                        value={item.isShowOnItinerary}
                        onChange={(event: any) => this.handleItineraryServiceInput(this.props.ItenararyKey,key, 'isShowOnItinerary', 'No')}
                        />} No
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label"> Description</label>
                                            <textarea type="text" className="form-control form-control-sm" 
                                             id={`descriptionld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${this.props.ItenararyKey+'_'+key}].description`} 
                                             rows="3"
                                             value={item.description}
                                             onChange={(event: any) => this.handleItineraryServiceInput(this.props.ItenararyKey,key, 'description', event.currentTarget.value)}
                                            placeholder="Enter  Description"/>
                                        </div>
                                        
                                    </div>
                                   
                                </div>
                            </div>
                            {(key>0)?<div className="col-auto mt-4 txt-right text-danger cursourPointer" onClick={() => this.props.deleteItinerarySerice(key,item.id)}><button type="button" className="btn removeInternary rounded"><i className="fa-solid fa-trash"></i> Itinerary Service Remove</button></div>:''} 
                        </div>)
                        })}
                        <div className="col-auto txt-right mt-4">
                                            <button onClick={()=>this.props.addItinerarySerice()} type="button" className="btn addInternaryService rounded"><i className="fa-solid fa-plus"></i> Add Itinerary Service</button>
                                        </div>
                                        </div>
            </React.Fragment>
        )
    }
}  



export default  TourItineraryServiceFieldComponent;