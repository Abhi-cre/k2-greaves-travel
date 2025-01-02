import React from "react";
import {ArrayHelper} from "../../../helpers/arrayhelper";
import FlightCityAutoComplete from "../../../components/FlightCityAutoComplete";
import {addsDays, subsDays,formatDate} from "../../../vendor/datefns";
import {DATEDURATION,MEALPLANLIST,parseCityDetails} from '../../../helpers/constants';
import "react-widgets/styles.css";
// import DropdownList from "react-widgets/DropdownList";
declare var $;

class VendorAddComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {loader:false,TourItineraryServiceData:[],serviceFeeList:[],'vendorList':[],'serviceList':[],creditCardFeesList:[0.0,0.5,1.0,1.5,2.0,2.5,3.0,3.5,4.0,4.5,5.0,5.5,6.0,6.5,7.0,7.5],selectedMealPlan:'',selectedServices:[]};
    }
    setCalucation()
{
 
    this.setState({
        TourItineraryServiceData:  this.props.TourItineraryServiceData.map((item: any, k: number) => { 
            let duartion=1;
            if(item['startDate']!='' && item['endDate']!='')
            { 
             duartion = DATEDURATION(item['startDate'],item['endDate']);
             if(item['vendorTypeId']==1)
             {
                duartion = parseInt(duartion)
             }
             else if(item['vendorTypeId']==4 || item['vendorTypeId']==5)
             {
                duartion = 1
             }
             else 
             {
                duartion = parseInt(duartion) +1
             }
            if(duartion==0)
            {
                duartion=1;
            }
             }
           
            if(duartion>0)
            {
                let cost = (duartion*item['unit']*parseFloat(item['rate'])).toFixed(2);
              
                let taxAmount=0.00;
                let greantCost=cost;
               

                item['serviceGSTPercentage']=this.props.serviceGSTPercentage;
                if(item['vendorTypeId']=='1')
                {
                 cost = cost*item['noofGuest'];
                
                 greantCost = cost;
                 let normalTax=0.00;
                 let mealTax=0.00;
                 let mealAmount=0.00;
                 if(greantCost<=7500)
                 {
                    normalTax= (greantCost*12)/100;
                 }
                 else
                 {
                    normalTax= (greantCost*18)/100;
                 }
                 if(item['mealPlan']!=this.state.selectedMealPlan && item['mealPlan']!='')
                 {
                  let selectedVendor = ArrayHelper.getValue(item,'vendorList',[]).filter((_it)=>_it.id==item['vendorId'])[0];
                   if(item['mealPlan']=='CP'    || item['mealPlan']=='CPAI')
                   {
                    mealAmount=ArrayHelper.getValue(selectedVendor,'breakFast')
                   }
                   else if(item['mealPlan']=='MAP(L)'  || item['mealPlan']=='MAP(L)AI')
                   {
                    mealAmount=(ArrayHelper.getValue(selectedVendor,'breakFast') + ArrayHelper.getValue(selectedVendor,'lunch'))
                   }
                   else if(item['mealPlan']=='MAP(D)' || item['mealPlan']=='MAP(D)AI')
                   {
                    mealAmount=(ArrayHelper.getValue(selectedVendor,'breakFast') + ArrayHelper.getValue(selectedVendor,'dinner'))
                   }
                   else if(item['mealPlan']=='AP'   || item['mealPlan']=='APAI')
                   {
                    mealAmount=(ArrayHelper.getValue(selectedVendor,'breakFast') + ArrayHelper.getValue(selectedVendor,'lunch') + ArrayHelper.getValue(selectedVendor,'dinner'))
                   }
                   else if(item['mealPlan']=='JP' || item['mealPlan']=='JPAI')
                   {
                    mealAmount=(ArrayHelper.getValue(selectedVendor,'breakFast') + ArrayHelper.getValue(selectedVendor,'lunch') + ArrayHelper.getValue(selectedVendor,'dinner') + ArrayHelper.getValue(selectedVendor,'jungleSafaris'))
                   }
                   mealAmount = mealAmount*item['noofGuest'];                 
                   mealAmount = mealAmount
                   if(item['mealPlan']=='EP' || item['mealPlan']=='CP' || item['mealPlan']=='MAP(L)' || item['mealPlan']=='MAP(D)' || item['mealPlan']=='AP' || item['mealPlan']=='JP')
                   {
                   mealTax = (mealAmount*18)/100;
                   }
                   else
                   {
                    mealTax = 0.00;
                   }
                 }
                  taxAmount = normalTax + mealTax;                
                 greantCost = cost + mealAmount;
                 item['taxAmount']=taxAmount;   
                             
                
                }
                else if(item['vendorTypeId']=='5' && item['origin']!=''  && item['destination']!='')
                {
                    if(parseCityDetails(item['origin']).countryCode.toLowerCase()==parseCityDetails(item['destination']).countryCode.toLowerCase())
                    {
                        item['serviceGSTPercentage']=0.9
                    }
                    else
                    {
                        item['serviceGSTPercentage']=1.8
                    }

                }
                
             
              
                item['cost']=(parseFloat(greantCost) + parseFloat(taxAmount));
                if(item['commissionType']=="byPercentage")
                {
                     let dividedBy = (100 - item['markupPercentage'])/100;
                      let serviceGTICommission= parseFloat(((greantCost/dividedBy) - greantCost)).toFixed(2);
                        item['serviceGTICommission'] = serviceGTICommission ; 
                        item['serviceGrossINR'] = (parseFloat(serviceGTICommission)   + parseFloat(item['cost'])).toFixed(2);;
                }
                else
                {
                    item['serviceGTICommission'] = item['markupAmount'] ; 
                    item['serviceGrossINR'] = (parseFloat(item['markupAmount']) + parseFloat(item['cost'])).toFixed(2);;  
                }
                    let serviceGTSAMOUNT= parseFloat((item['serviceGrossINR']*item['serviceGSTPercentage'])/100).toFixed(2);
                    item['serviceSellINR'] = (parseFloat(serviceGTSAMOUNT) + parseFloat(item['serviceGrossINR'])).toFixed(2);;
                    item['serviceNetUSD'] = (item['serviceSellINR']/this.props.fileUSDROE).toFixed(2) ; 
                 
                    if(item['commissionTypeUS']=="byPercentage")
                    {
                        let dividedBy = (100 - item['serviceUSDMarkupPercentage'])/100;
                        let serviceGTICommissionUS= parseFloat(((item['serviceNetUSD']/dividedBy) - item['serviceNetUSD']));
                         // let serviceGTICommissionUS= parseFloat((item['serviceNetUSD']*item['serviceUSDMarkupPercentage'])/100).toFixed(2);
                            item['serviceUSDMarkUpAmount'] = serviceGTICommissionUS ; 
                            item['serviceUSDCommission']=serviceGTICommissionUS.toFixed(2);
                            let serviceUSDClientDollar= (parseFloat(serviceGTICommissionUS) + parseFloat(item['serviceNetUSD'])) 
                            item['serviceUSDClientDollar'] = serviceUSDClientDollar
                    }
                    else
                    {
                        let serviceUSDClientDollar= (parseFloat(item['serviceUSDMarkUpAmount']) + parseFloat(item['serviceNetUSD'])) ;
                        
                        item['serviceUSDCommission']=item['serviceUSDMarkUpAmount'];
                        item['serviceUSDClientDollar'] = serviceUSDClientDollar;
                    }
                    if(item['creditCardFees']>0)
                    {
                        let dividedBy = (100 - item['creditCardFees'])/100;
                        let creditCardFees= parseFloat(((item['serviceUSDClientDollar']/dividedBy) - item['serviceUSDClientDollar']));
                        item['serviceUSDClientDollar']= item['serviceUSDClientDollar'] + creditCardFees;

                    }

                    item['serviceUSDClientDollar'] = (item['serviceUSDClientDollar']).toFixed(2);

                    // item['serviceUSDMarkupPercentage'] = item['markupPercentage']; 
                    // item['serviceUSDMarkUpAmount'] = (item['markupAmount']/this.props.fileUSDROE).toFixed(2) ; 
                    // item['serviceUSDCommission'] = (item['serviceGTICommission']/this.props.fileUSDROE).toFixed(2) ;
                    // item['serviceUSDClientDollar'] = (item['serviceGrossINR']/this.props.fileUSDROE).toFixed(2) ; 

                   
                  
            }
        
        
            return item

        })})

} 
handleItineraryServiceInput(index: number, key: string, value: any) {
       
    this.setState({
        TourItineraryServiceData:  this.props.TourItineraryServiceData.map((item: any, k: number) => {                
            if (index == k) {
                if(key=='serviceFeeList' && (item['startDate']=='' || item['endDate']==''))
                {
                    alert('Please select the date')
                   
                }
                else if(key=='rate')
                {
                   // item[key] = parseFloat(value).toFixed(2);
                   if(item['startDate']=='')
                   {
                    item[key] ='';
                    this.setState({selectedServices:[]})
                    alert('Please enter value start date')
                   }
                   else if(item['endDate']=='')
                   {
                    item[key] ='';
                    this.setState({selectedServices:[]})
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
                else if(key=='serviceNetUSD' || key=='noofGuest'  || key=='mealPlan'   || key=='origin'   || key=='destination')
                {
                    item[key] = value;
                    setTimeout(()=>{
                   
                    this.setCalucation()
                    },500)
                }
                else if(key=='serviceUSDMarkupPercentage')
                {
                  
                   if(item['serviceNetUSD']=='' || item['serviceNetUSD']==0)
                   {
                   
                    alert('Please enter value of  Net USD')
                   }               
                   else if(value<99.99)
                   {
                    item[key] = value;
                   
                    setTimeout(()=>{
                        this.setCalucation() 
                    },500)
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
                   
                    setTimeout(()=>{
                        this.setCalucation() 
                    },500)
                   }
                   
                   
                   
                }
                else if(key=='creditCardFees')
                {
                    item[key] = value;               
                    
                    setTimeout(()=>{
                        this.setCalucation() 
                    },500)
                }
                
                else if(key=='vendorTypeId')
                { 
                    item[key] = value;    
                    item['cityId'] = '0';
                    item['vendorId'] = '0';
                    item['serviceId'] = '0';
                    item['rate'] = 0.00;
                    item['unit'] = 1;
                    item['cost'] = 0.00;
                    item['taxAmount']=0.00;
                    item['noofGuest'] = 1;
                    item['mealPlan'] = '';
                    item['origin'] = '';
                    item['destination'] = '';
                    item['flightNo'] = '';
                    item['pnr'] = '';
                    item['markupPercentage'] = 0.00;
                    item['markupAmount'] = 0.00;
                    item['isShowOnItinerary'] = 0.00;
                    item['serviceGTICommission'] = 0.00;
                    item['serviceSellINR'] = 0.00;
                    item['serviceNetUSD'] = 0.00;
                    item['serviceUSDMarkupPercentage'] = 0.00;
                    item['serviceUSDCommission'] = 0.00;
                    item['serviceUSDClientDollar'] = 0.00;
                    item['creditCardFees'] = 0.00;
                    item['quoteType'] = '0';
                    item['commissionType'] = 'byPercentage';
                    item['commissionTypeUS'] = 'byPercentage';
                    item['serviceUSDMarkUpAmount'] = 0.00;
                    item['startDate'] = '';
                    item['endDate'] = '';
                    item['vendorList'] = [];
                    item['serviceList'] = [];   

                    this.setState({selectedServices:[],serviceFeeList:[]})
                    if(value==5)
                    {
                        let vendorList=this.props.vendorList;
                        vendorList=vendorList.filter((_item)=>_item.vendorTypeId==value);
                        item['vendorList'] = vendorList;
                    }
                 
                }
                else if(key=='cityId')
                {
                    if(item['vendorTypeId']!="")
                    {
                    item[key] = value;                  
                    let vendorList=this.props.vendorList;
                    vendorList=vendorList.filter((_item)=>_item.cityId==value && _item.vendorTypeId==item['vendorTypeId']);
                    item['vendorList'] = vendorList;
                    item['vendorId'] = '0';
                    item['serviceId'] = '0';
                    this.setState({serviceFeeList:[]})   
                    }
                    else
                    {
                        item[key] = ''; 
                           
                        alert("PLease select the vendor type")
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
                else if(key=='serviceFeesId')
                {
                    item['serviceFeesId'] = value;
                    let serviceFeeList= ArrayHelper.getValue(this.state.selectServiceData,'serviceFeeDetails',[]).filter((item)=>item.id==value);
                    item['rate'] = ArrayHelper.getValue(serviceFeeList,'[0].rate')
                    item['unit'] = 1;
                    item['cost'] = ArrayHelper.getValue(serviceFeeList,'[0].cost')
                    item['markupPercentage'] = ArrayHelper.getValue(serviceFeeList,'[0].markupPercentage')
                    item['markupAmount'] = ArrayHelper.getValue(serviceFeeList,'[0].markupAmount');
                    item['mealPlan'] = ArrayHelper.getValue(serviceFeeList,'[0].mealPlan');
                    this.setState({selectedMealPlan:ArrayHelper.getValue(serviceFeeList,'[0].mealPlan')})
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
                    this.setState({selectServiceData:ArrayHelper.getValue(serviceList,'[0]')})
                    $(".serviceFee").prop({'checked':false})
                }
                else if((key=='startDate'))
                        {
                             setTimeout(()=>{
                                this.setCalucation()
                            },500)
                      
                            item[key] = value;
            
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
                        else
                        {  item[key] = '';
                           alert('Please select start date')
                              
                        }
                    }                
                        
                    else if(key=='serviceGTICommission' || key=='serviceGrossINR'   || key=='serviceNetUSD'  || key=='serviceUSDCommission' || key=='serviceUSDClientDollar')
                    {
                     
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
            // if(error=="" && this.props.TourItineraryServiceData[0].serviceDescription=="")
            // {
            //     alert("Please enter the service Name.");
            //     error="yes"   
            // }
            if(error=="" && this.props.TourItineraryServiceData[0].startDate=="")
            {
                alert("Please provide Itinerary Service start date.");
                error="yes"   
            }
            if(error=="" && this.props.TourItineraryServiceData[0].endDate=="")
            {
                alert("Please provide Itinerary Service end date.");
                error="yes"   
            }
            if(error=="" && this.props.TourItineraryServiceData[0].cityId==""  && this.props.TourItineraryServiceData[0].vendorTypeId!="5")
            {
                alert("Please provide the city.");
                error="yes"   
            }
            if(error=="" && this.props.TourItineraryServiceData[0].vendorTypeId=="")
            {
                alert("Please provide the vendor type.");
                error="yes"   
            }
            if(error=="" && this.props.TourItineraryServiceData[0].vendorId=="")
            {
                alert("Please provide the vendor.");
                error="yes"   
            }
            if(error=="" && this.props.TourItineraryServiceData[0].serviceId=="")
            {
                alert("Please provide the service.");
                error="yes"   
            }
            if(error=="" && this.props.TourItineraryServiceData[0].rate=="")
            {
                alert("Please provide the rate.");
                error="yes"   
            }
            if(error=="" && this.props.TourItineraryServiceData[0].unit=="")
            {
                alert("Please provide the unit.");
                error="yes"   
            }
            if(error=="" && this.props.TourItineraryServiceData[0].cost=="")
            {
                alert("Please enter the cost.");
                error="yes"   
            }
            if(error=="" && this.props.TourItineraryServiceData[0].serviceGTICommission=="")
            {
                alert("Please provide the GTI Commission.");
                error="yes"   
            }
            if(error=="" && this.props.TourItineraryServiceData[0].serviceGrossINR=="")
            {
                alert("Please provide the GTI gross amount");
                error="yes"   
            }
            if(error=="" && this.props.TourItineraryServiceData[0].serviceGSTPercentage=="")
            {
                alert("Please provide the GTI GST Percentage");
                error="yes"   
            }
            if(error=="" && this.props.TourItineraryServiceData[0].serviceSellINR=="")
            {
                alert("Please provide the GTI shell amount.");
                error="yes";   
            } 
            if(error=="" && this.props.TourItineraryServiceData[0].isShowOnItinerary=="Yes" && this.props.TourItineraryServiceData[0].description=="")
            {
                alert("Please provide description.");
                error="yes";   
            }
            if(error=="" && this.props.TourItineraryServiceData[0].quoteType=="")
            {
                alert("Please provide the Quote Type.");
                error="yes";   
            } 
            if(error=="") 
            {
               this.props.postItinerarySerice(); 
             
            }
        } 
      componentWillReceiveProps()
      {
        this.showDate();
        setTimeout(()=>{
         this.showDate();
       
   
        if(ArrayHelper.getValue(this.props.TourItineraryServiceData,'[0].vendorTypeId')!=4)
        {
            this.setState({selectServiceData:this.props.serviceList.filter((_item)=>_item.id==ArrayHelper.getValue(this.props.TourItineraryServiceData,'[0].serviceId'))[0]})
            if(ArrayHelper.getValue(this.props.TourItineraryServiceData,'[0].vendorTypeId')==1)
            {
              setTimeout(()=>{
                let serviceFeeList= ArrayHelper.getValue(this.state.selectServiceData,'serviceFeeDetails',[]).filter((_item)=>_item.id==ArrayHelper.getValue(this.props.TourItineraryServiceData,'[0].serviceFeesId'));
              this.setState({selectedMealPlan:ArrayHelper.getValue(serviceFeeList,'[0].mealPlan')})
              },100)
            }
        }
        else
        {
          let serviceIdArray = ArrayHelper.getValue(this.props.TourItineraryServiceData,'[0].serviceId').split(',');
         
          if(serviceIdArray.length>0)
          {
            let selectedServices=[]
            for(let k=0;k<serviceIdArray.length;k++)
            {
            let serviceData = this.props.serviceList.filter((_item)=>_item.id==serviceIdArray[k])[0];
             
             selectedServices=selectedServices.concat({id:ArrayHelper.getValue(serviceData,'id'),rate:ArrayHelper.getValue(serviceData,'serviceFeeDetails[0].rate')});
            }
           
            this.setState({selectedServices:selectedServices})
          }
          
        }
    },1000)
      }
        componentDidMount()
        {
            this.showDate();
            setTimeout(()=>{
             this.showDate();
            },1000) 
         
           
            

        }
        showDate()
        {
            $(".serviveUpdateStartDate").datepicker({minDate:addsDays(this.props.tourStartDate,0),maxDate:subsDays(this.props.tourEndDate,0)})
            .on("change", (e: any) => {
             $(".serviceUpdateEndDate").datepicker("option", "minDate", addsDays(e.target.value,1));
              this.handleItineraryServiceInput(0, 'startDate', e.target.value)
            }); 
    
            $(".serviceUpdateEndDate").datepicker({minDate:addsDays(this.props.tourStartDate,0),maxDate:subsDays(this.props.tourEndDate,0)})
            .on("change", (e: any) => {
                $(".serviveUpdateStartDate").datepicker("option", "maxDate", subsDays(e.target.value,1));
                this.handleItineraryServiceInput(0, 'endDate', e.target.value)
            });
        }

        selectServiceList(e) 
{
   let selectedServices= this.state.selectedServices;
   let selectedServicesList=[];
   if(selectedServices.filter((item)=>item.id==e.id).length>0)
   {
    selectedServicesList=selectedServices.filter((item)=>item.id!=e.id);
   }
   else
   {
    selectedServicesList=selectedServices.concat({id:ArrayHelper.getValue(e,'id'),rate:ArrayHelper.getValue(e,'serviceFeeDetails[0].rate')});
   }
   let serviveId='';
   let rateAmount=0;
   if(selectedServicesList.length>0)
   {
    selectedServicesList.map((item,key)=>{
       
        if(key>0)
        {
            serviveId=serviveId+',';
        }
        rateAmount = rateAmount + parseInt(item.rate)
        serviveId=serviveId+item.id
    })
   }
  
   this.handleItineraryServiceInput(0, 'rate', rateAmount.toString());
   this.handleItineraryServiceInput(0, 'serviceId', serviveId);
   this.setState({selectedServices:selectedServicesList})
}

    render(){
        return(
            <React.Fragment>
               
                <div className="modal fade" id="itnerayServiceUpdate" data-bs-keyboard="false" data-bs-backdrop="static">
  <div className="modal-dialog modal-xl">
    <div className="modal-content">
      <div className="modal-header">
        <h3 className="modal-title" id="exampleModalLabel">Update Costing</h3>
        <button type="button" className="close"  data-bs-dismiss="modal"  aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
      {this.props.TourItineraryServiceData.map((item,key)=>{
                
                            return(<div key={`service-${key}`}>
                <div className="d-flex mb-4">
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
                            <div className="flex-fill p-1" id="htmlstartDate">
                                <label  className="form-label">Start Date Time</label>
                                <br/>
                                <input onClick={()=>this.showDate()} readOnly id="serviveUpdateStartDate" required type="text" placeholder="Enter Start Date" className="form-control form-control-sm serviveUpdateStartDate" name={`tours[${key}].startDate`}  value={formatDate(item.startDate)}/>
                               
                            </div>
                            <div className="flex-fill p-1" id="htmlendDate">
                                <label  className="form-label">End Date Time</label>
                                <br/>
                                <input onClick={()=>this.showDate()} readOnly id="serviceUpdateEndDate" required type="text" placeholder="Enter End Date" className="form-control form-control-sm serviceUpdateEndDate" name={`tours[${key}].endDate`}  value={formatDate(item.endDate)}/>
                              
                            </div>
                            {(item.vendorTypeId!=5)?<div className="flex-fill p-1" id="seviceHtmlcityId">
                                <label  className="form-label">City</label>
                              
                                   <select  className="form-select form-select-sm"                                            
                                             value={item.cityId}
                                             onChange={(event: any) => this.handleItineraryServiceInput(0, 'cityId', event.currentTarget.value)}
                                            >
                                                <option value="">Select City</option>
                                                {this.props.cityList.map((item,key)=>{
                                          return(<option key={`cityList-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'name')}</option>)
                                        })}
                                            </select>
                            </div>:''}
                           
                            <div className="flex-fill p-1" id="seviceHtmlvendorId">
                                <label  className="form-label">Vendor</label>
                                         
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
                            {(item.vendorTypeId!=4)?<div className="flex-fill p-1" id="seviceHtmlserviceId">
                                <label  className="form-label">Service</label>
                                         
                                   <select  className="form-select form-select-sm"                                            
                                             value={item.serviceId}
                                             onChange={(event: any) => this.handleItineraryServiceInput(0, 'serviceId', event.currentTarget.value)}
                                            >
                                                <option value="">Select Service</option>
                                                {ArrayHelper.getValue(item,'serviceList',[]).map((item,key)=>{
                                          return(<option key={`serviceList-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'name')}</option>)
                                        })}
                                            </select>
                            </div>:''}
                            {(ArrayHelper.getValue(this.state.selectServiceData,'serviceFeeDetails',[]).length>0 && item.vendorTypeId!=4)?<div className="flex-fill p-1" id="seviceHtmlserviceFeeId">
                                <label  className="form-label">Service Fee</label>
                                           
                                   <select  className="form-select form-select-sm"                                            
                                             value={item.serviceFeesId}
                                             onChange={(event: any) => this.handleItineraryServiceInput(key, 'serviceFeesId', event.currentTarget.value)}
                                            >
                                                <option value="">Select Service Fee</option>
                                                {ArrayHelper.getValue(this.state.selectServiceData,'serviceFeeDetails',[]).map((__tem,__key)=>{
                                          return(<option key={`serviceFeeList-${__key}`}  value={ArrayHelper.getValue(__tem,'id')}>{ArrayHelper.getValue(__tem,'description')}</option>)
                                        })}
                                            </select>
                            </div>:''}

                            {(item.vendorTypeId==5)?<div className="flex-fill p-1">
                                <label  className="form-label">Origin</label>
                                <FlightCityAutoComplete 
                              placeholder={"Enter Origin"}
                              value={item.origin}
                              name={`tours[${key}].origin`} 
                              className="from"
                              select={(event: any) => this.handleItineraryServiceInput(key, 'origin', event)}
                              handleUserInput={(event: any) =>this.handleItineraryServiceInput(key, 'origin', event.currentTarget.value)}
                              showHideLoder={(e)=>this.props.showHideLoder(e)}
                              emptyState={() => {
                                // this.setState({ 'to': '' }, () => { this.setCityVal('to','') })
                              }}
                            />
                                            {/* <input type="text" className="form-control form-control-sm" 
                                             id={`originld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${key}].origin`} 
                                             value={item.origin}
                                             onChange={(event: any) => this.handleItineraryServiceInput(key, 'origin', event.currentTarget.value)}
                                            placeholder="Enter Origin"/> */}
                            </div>:''}
                            {(item.vendorTypeId==5)?<div className="flex-fill p-1">
                                <label  className="form-label">Destination</label>
                                <FlightCityAutoComplete 
                              placeholder={"Enter Destination"}
                              value={item.destination}
                              name={`tours[${key}].destination`} 
                              className="from"
                              select={(event: any) => this.handleItineraryServiceInput(key, 'destination', event)}
                              handleUserInput={(event: any) =>this.handleItineraryServiceInput(key, 'destination', event.currentTarget.value)}
                              showHideLoder={(e)=>this.props.showHideLoder(e)}
                              emptyState={() => {
                                // this.setState({ 'to': '' }, () => { this.setCityVal('to','') })
                              }}
                            />
                            </div>:''}
                            {(item.vendorTypeId==5)?<div className="flex-fill p-1">
                                <label  className="form-label">Flight No</label>
                                            <input type="text" className="form-control form-control-sm" 
                                             id={`flightNold_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${key}].flightNo`} 
                                             value={item.flightNo}
                                             onChange={(event: any) => this.handleItineraryServiceInput(key, 'flightNo', event.currentTarget.value)}
                                            placeholder="Enter Flight No"/>
                            </div>:''}
                            {(item.vendorTypeId==5)?<div className="flex-fill p-1">
                                <label  className="form-label">PNR</label>
                                            <input type="text" className="form-control form-control-sm" 
                                             id={`pnrd_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${key}].pnr`} 
                                             value={item.pnr}
                                             onChange={(event: any) => this.handleItineraryServiceInput(key, 'pnr', event.currentTarget.value)}
                                            placeholder="Enter PNR"/>
                            </div>:''}    
                                                                                 
                </div>
                {(ArrayHelper.getValue(item,'serviceList',[]).length>0 && item.vendorTypeId==4 && item.vendorId!='0')?<div className="col-md-12 mb-2 ">
                                              <p className="widthFull"><label className="form-label width100">Service  List:</label> </p>
                                             <div className="serviceList-html">                                   
                                             {ArrayHelper.getValue(item,'serviceList',[]).map((__tem,__key)=>{
                                                return(<span   key={`serviceList-${__key}`}  className="form-label serviceListDisplay cursourPointer" onClick={() => this.selectServiceList(__tem)}>
                                                    {(this.state.selectedServices.filter((__it)=>__it.id==__tem.id).length>0)?<input checked value={__tem.id} className="serviceFee" type="checkbox" name="serviceList"  onClick={() => this.selectServiceList(__tem)}   />:<input value={__tem.id} className="serviceFee" type="checkbox" name="serviceList"  onClick={() => this.selectServiceList(__tem)}   />}  {ArrayHelper.getValue(__tem,'name')} ({ArrayHelper.getValue(__tem,'serviceFeeDetails[0].rate')})</span> )
                                             })}
                                             </div>
                                        </div>:''}
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
                            {(item.vendorTypeId==1)?<div className="flex-fill p-1">
                                <label  className="form-label">No. of Guest </label>
                                <input type="number" className="form-control form-control-sm" 
                                             id={`rateld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${key}].noofGuest`} 
                                             value={item.noofGuest}
                                             onChange={(event: any) => this.handleItineraryServiceInput(key, 'noofGuest', event.currentTarget.value)}
                                            placeholder="Enter No. of Guest"/>
                            </div>:''}
                            {(item.vendorTypeId==1)?<div className="flex-fill p-1">
                                <label  className="form-label">Meal Plan</label>
                                <select className="form-select form-select-sm"  id={`mealPlan_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${key}].mealPlan`} 
                                             value={item.mealPlan}
                                             onChange={(event: any) => this.handleItineraryServiceInput(key, 'mealPlan', event.currentTarget.value)}
                                              aria-label=".form-select-sm example">
                                                  <option value="">Select Meal Plan</option>
                                                  {MEALPLANLIST.map((item,key)=>{
                                                    return(<option key={`mealplan-${key}`} value={item}>{item}</option>) 
                                                  })}
                                            </select>
                              
                            </div>:''}
                            {(item.vendorTypeId==1)?<div className="flex-fill p-1">
                                <label  className="form-label">Tax Amount </label>
                                <input readOnly type="number" className="form-control form-control-sm" 
                                             id={`taxAmount_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${key}].taxAmount`} 
                                             value={item.taxAmount}
                                             onChange={(event: any) => this.handleItineraryServiceInput(key, 'taxAmount', event.currentTarget.value)}
                                            placeholder="Enter Tax Amount"/>
                            </div>:''}
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
                                <input type="number" className="form-control form-control-sm" readOnly
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
                                <label  className="form-label">GT US Markup  Type</label>
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
                                <label  className="form-label">GTI    Sales Amount ({this.props.currency})</label>
                                <input type="number" className="form-control form-control-sm" 
                                             id={`serviceNetUSDld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${key}].servserviceNetUSDiceId`} 
                                             value={item.serviceNetUSD}
                                             onChange={(event: any) => this.handleItineraryServiceInput(key, 'serviceNetUSD', event.currentTarget.value)}
                                            placeholder="Enter Service Net USD"/>
                            </div>
                            <div className={(item.commissionTypeUS=='byPercentage')?'flex-fill p-1 show':'flex-fill p-1 hide'}>
                                <label  className="form-label">GT US  Markup Percentage</label>
                                <input type="number" className="form-control form-control-sm" 
                                             id={`serviceUSDMarkupPercentageld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${key}].serviceUSDMarkupPercentage`} 
                                             value={item.serviceUSDMarkupPercentage}
                                             onChange={(event: any) => this.handleItineraryServiceInput(key, 'serviceUSDMarkupPercentage', event.currentTarget.value)}
                                            placeholder="Enter Service USD Markup Percentage"/>
                            </div>
                            <div className={(item.commissionTypeUS=='byAmount')?'flex-fill p-1 show':'flex-fill p-1 hide'}>
                                <label  className="form-label">GT US  Markup Amount ({this.props.currency})</label>
                                <input type="number" className="form-control form-control-sm" 
                                             id={`serviceUSDMarkUpAmountld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${key}].serviceUSDMarkUpAmount`} 
                                             value={item.serviceUSDMarkUpAmount}
                                             onChange={(event: any) => this.handleItineraryServiceInput(key, 'serviceUSDMarkUpAmount', event.currentTarget.value)}
                                            placeholder="Enter Service USD MarkUp Amount"/>
                            </div>
                            <div className="flex-fill p-1">
                                <label  className="form-label">GT US  Commission  ({this.props.currency})</label>
                                <input type="number" className="form-control form-control-sm" 
                                 name="serviceUSDCommission" 
                                 value={item.serviceUSDCommission} readOnly
                                 onChange={(event: any) => this.handleItineraryServiceInput(key, 'serviceUSDCommission', event.currentTarget.value)}
                                            placeholder="Enter Service USD Commission"/>
                            </div>
                            <div className="flex-fill p-1">
                                <label  className="form-label">Creadit Card fee</label>
                                <select className="form-select form-select-sm"  id={`creditCardFees_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${key}].creditCardFees`} 
                                             value={item.creditCardFees}
                                             onChange={(event: any) => this.handleItineraryServiceInput(key, 'creditCardFees', event.currentTarget.value)}
                                              aria-label=".form-select-sm example">
                                                {this.state.creditCardFeesList.map((__item:any,__key:any)=>{
                                                 return(<option value={__item} key={`creditCard-${__key}`}>{__item.toFixed(1)}</option>)
                                                })}
                                              
                                            </select>
                                
                            </div>
                            <div className="flex-fill p-1">
                                <label  className="form-label">GT US  Payable Amount Exclude  Tax ({this.props.currency})</label>
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
                <div className="d-flexs">
                            <div className="flex-fill p-1">
                                <label  className="form-label">Description</label>
                                <textarea type="text" className="form-control form-control-sm" 
                                             name="description" 
                                             value={item.description}
                                             onChange={(event: any) => this.handleItineraryServiceInput(key, 'description', event.currentTarget.value)}
                                            placeholder="Enter  Description"/>
                            </div>
                           </div>
                           <div className="d-flex mb-4">
                            <div className="flex-fill p-1 maxWwidth100">
                            <button  onClick={()=>this.submitItinerarySerice()} type="button" className="btn btn-sm btn-primary rounded mt-4">{(item.id==0)?<i className="fa-solid fa-plus"></i>:''}{(item.id!=0)?'Update':'Add'} </button>   
                            </div>                                                        
                </div>
                </div>)
                })}
              
               
     
      </div>
      
    </div>
  </div>
</div>
            </React.Fragment>
        )
    }
}  




export default  VendorAddComponent;

