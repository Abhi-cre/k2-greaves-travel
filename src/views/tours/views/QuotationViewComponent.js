import React from "react";
import {ArrayHelper} from "../../../helpers/arrayhelper";
    const QuotationViewComponent = (props) => {
        let totalCost=0;
          let totalServiceGTICommission=0;
          let totalServiceGrossINR=0;
          let totalserviceGSTAmount=0;
          let totalserviceSellINR=0;
          let totalserviceNetUSD=0;
          let totalserviceUSDCommission=0;
          let totalCreditCardFees=0;
          let totalserviceUSDClientDollar=0;
          let totalCommissionAmount=0;
        return(
          
            <React.Fragment>
                <div className={`border-box ${(props.selectedTab!='Quotation')?'hide':''}`}>
                   <h2 className="pb-3">{ArrayHelper.getValue(props.TourItinerarySelected,'name')}</h2>
                   {(ArrayHelper.getValue(props,'quotationList').length>0 && ArrayHelper.getValue(props.TourItinerarySelected,'tourItineraryService').length>0)?<table className="table table-striped rounded border">
                            <tbody>
                                <tr>
                                    <th className="width50">S No.</th>
                                    <th  className="width200">Quote Type</th>                                    
                                  
                                    <th className="txt-right width250">Cost</th>
                                    {/* <th>Show On Itinerary</th> */}
                                    {/* <th>Commission</th> */}
                                    <th className="txt-right width250"> GTI Commission</th>
                                    <th className="txt-right width250"> GTI Gross (INR)</th>
                                    <th className="txt-right width250"> GST </th>
                                    <th  className="txtCenter width250">  GTI Sell (INR)</th>
                                    <th className="txtCenter width250"> GTI    Sales Amount ({props.currency})</th>
                                    {/* <th>Service USD Markup Percentage</th> */}
                                    <th className="txtCenter width250"> GT US  Commission ({props.currency})</th>
                                    <th className="txtCenter width250"> Credit Card Fees</th>
                                    <th className="txtCenter width250"> GT US  Payable Amount({props.currency})</th>
                                    <th className="txtCenter width250"> Agent Commission({props.currency})</th>
                                </tr>
                                {ArrayHelper.getValue(props,'quotationList').map((item,key)=>{
                                     let tourItineraryServiceFilter= ArrayHelper.getValue(props.TourItinerarySelected,'tourItineraryService',[]).filter((_item)=>_item.quoteType==item.quoteType);
                                     let Cost =0;
                                     let serviceGTICommission =0;
                                     let serviceGrossINR=0;
                                     let serviceGSTAmount=0;
                                     let serviceSellINR=0;
                                     let serviceNetUSD=0;
                                     let serviceUSDCommission=0;
                                     let serviceUSDClientDollar=0;
                                     let agentCommissionValue=0;
                                     tourItineraryServiceFilter.map((_item)=>{
                                        Cost  = Cost + ArrayHelper.getValue(_item,'cost');
                                        serviceGTICommission  = serviceGTICommission + ArrayHelper.getValue(_item,'serviceGTICommission');
                                        serviceGrossINR  = serviceGrossINR + ArrayHelper.getValue(_item,'serviceGrossINR');
                                        serviceGSTAmount = serviceGSTAmount + (ArrayHelper.getValue(_item,'serviceGSTPercentage')*ArrayHelper.getValue(_item,'serviceGrossINR'))/100
                                        serviceSellINR  = serviceSellINR + ArrayHelper.getValue(_item,'serviceSellINR');
                                        serviceNetUSD  = serviceNetUSD + ArrayHelper.getValue(_item,'serviceNetUSD');
                                        serviceUSDCommission  = serviceUSDCommission + ArrayHelper.getValue(_item,'serviceUSDCommission');
                                        serviceUSDClientDollar  = serviceUSDClientDollar + ArrayHelper.getValue(_item,'serviceUSDClientDollar');
                                        agentCommissionValue  = agentCommissionValue + ArrayHelper.getValue(_item,'agentCommissionValue');
                                    })

                                     totalCost = totalCost + Cost;
                                     totalServiceGTICommission = totalServiceGTICommission + serviceGTICommission;
                                     totalServiceGrossINR = totalServiceGrossINR + serviceGrossINR;
                                     totalserviceGSTAmount = totalserviceGSTAmount + serviceGSTAmount;
                                     totalserviceSellINR = totalserviceSellINR + serviceSellINR;
                                     totalserviceNetUSD = totalserviceNetUSD + serviceNetUSD;
                                     totalserviceUSDCommission = totalserviceUSDCommission + serviceUSDCommission;
                                     totalserviceUSDClientDollar = totalserviceUSDClientDollar + serviceUSDClientDollar;
                                     totalCommissionAmount = totalCommissionAmount + agentCommissionValue;
                                     let CreditCardFees=0;
                                     CreditCardFees = serviceUSDClientDollar - (serviceNetUSD+serviceUSDCommission);
                                     totalCreditCardFees = totalCreditCardFees + CreditCardFees;
                                            return( <tr key={`quotationList-${key}`}>
                                    <td>{key+1}</td>
                                    <td>{ArrayHelper.getValue(item,'quoteTypeName')}</td>   
                                    <td className="txt-right">{Number(Cost).toFixed(2)}</td> 
                                    <td className="txt-right">{Number(serviceGTICommission).toFixed(2)}</td> 
                                    <td className="txt-right">{Number(serviceGrossINR).toFixed(2)}</td> 
                                    <td className="txt-right">{Number(serviceGSTAmount).toFixed(2)}</td> 
                                    <td className="txt-right">{Number(serviceSellINR).toFixed(2)}</td>
                                    <td className="txt-right">{Number(serviceNetUSD).toFixed(2)}</td>
                                    <td className="txt-right">{Number(serviceUSDCommission).toFixed(2)}</td>
                                    <td className="txt-right">{Number(CreditCardFees).toFixed(2)}</td>
                                    <td className="txt-right">{Number(serviceUSDClientDollar).toFixed(2)}</td>                                  
                                    <td className="txt-right">{Number(agentCommissionValue).toFixed(2)}</td>
                                </tr>)
                                })}
                                 <tr>
                                   <th className="txt-right" colSpan={2}>Total (Round Off)</th>
                                    <th className="txt-right">{Number(totalCost).toFixed(0)}</th>
                                    <th className="txt-right">{Number(totalServiceGTICommission).toFixed(0)}</th>
                                    <th className="txt-right">{Number(totalServiceGrossINR).toFixed(0)}</th>
                                    <th className="txt-right">{Number(totalserviceGSTAmount).toFixed(0)}</th>
                                    <th className="txt-right">{Number(totalserviceSellINR).toFixed(0)}</th>
                                    <th className="txt-right">{Number(totalserviceNetUSD).toFixed(0)}</th>
                                    <th className="txt-right">{Number(totalserviceUSDCommission).toFixed(0)}</th>
                                    <th className="txt-right">{Number(totalCreditCardFees).toFixed(0)}</th>
                                    <th className="txt-right">{Number(totalserviceUSDClientDollar).toFixed(0)}</th>
                                    <th className="txt-right">{Number(totalCommissionAmount).toFixed(0)}</th>
                                </tr>
                                {(props.perPersonCost.length>0)?<tr>
                                <th  colSpan={9}></th>
                                    <th  colSpan={3}>
                                    <table className="table table-striped border">
                                    <tbody>
                                      
                                        {props.perPersonCost.map((_item:any,key:any)=>{
                                    return(<tr key={`perPersonCost${key}`}><td className="txt-right">Per person cost for {ArrayHelper.getValue(_item,'noofGuest') + ArrayHelper.getValue(_item,'noofAdult')} :</td> <td className="txt-right">{Number(ArrayHelper.getValue(_item,'totalPerPersonCost')).toFixed(0)}</td></tr>)
                                    })}
                                    </tbody>
                                    </table>
                                    </th> 
                                   
                                   
                                </tr>:''}
                            </tbody>
                        </table>:
                                <p>No Record Found</p>}
                </div>
            </React.Fragment>
        )
    }
  



export default QuotationViewComponent;