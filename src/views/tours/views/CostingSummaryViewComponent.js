import React from "react";
import {ArrayHelper} from '../../../helpers/arrayhelper';
const CostingSummaryViewComponent = (props) => {
    let totalCost=0;
    let totalServiceGTICommission=0;
    let totalServiceGrossINR=0;
    let totalserviceGSTAmount=0;
    let totalserviceSellINR=0;
    let totalserviceNetUSD=0;
    let totalserviceUSDCommission=0;
    let totalserviceUSDClientDollar=0;
    if(ArrayHelper.getValue(props.TourItineraryMaster,'tourItineraryService').length>0){
        ArrayHelper.getValue(props.TourItineraryMaster,'tourItineraryService').map((item)=>{
            totalCost = totalCost + ArrayHelper.getValue(item,'cost');                
            totalServiceGTICommission = totalServiceGTICommission + ArrayHelper.getValue(item,'serviceGTICommission');
            totalServiceGrossINR = totalServiceGrossINR + ArrayHelper.getValue(item,'serviceGrossINR');
            totalserviceGSTAmount = totalserviceGSTAmount + (ArrayHelper.getValue(item,'serviceGSTPercentage')*ArrayHelper.getValue(item,'serviceGrossINR'))/100
            totalserviceSellINR = totalserviceSellINR +  ArrayHelper.getValue(item,'serviceSellINR');
            totalserviceNetUSD = totalserviceNetUSD + ArrayHelper.getValue(item,'serviceNetUSD');
            totalserviceUSDCommission = totalserviceUSDCommission +  ArrayHelper.getValue(item,'serviceUSDCommission');
            totalserviceUSDClientDollar = totalserviceUSDClientDollar + ArrayHelper.getValue(item,'serviceUSDClientDollar');
        })

      }
    return (<React.Fragment> 
      <div className="accordion-item">
                                <h2 className="accordion-header" id="headingCosting">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCosting" aria-expanded="false"
                                        aria-controls="collapseFive">
                                        Costing Summary
                                    </button>
                                </h2>
                                <div id="collapseCosting" className="accordion-collapse collapse show" aria-labelledby="headingCosting" data-bs-parent="#accordionExample">
                                    <div className="accordion-body pb-3 row">
                                        <div className="col-md-2 mb-3">
                                            <label htmlFor="stops" className="form-label">Cost</label>
                                            <p>{totalCost.toFixed(2)}</p>
                                        </div>
                                        <div className="col-md-2 mb-3">
                                            <label htmlFor="stops" className="form-label">GTI Commission</label>
                                            <p>{totalServiceGTICommission.toFixed(2)}</p>
                                        </div>
                                        <div className="col-md-2 mb-3">
                                            <label htmlFor="stops" className="form-label">GTI Gross (INR)</label>
                                            <p>{totalServiceGrossINR.toFixed(2)}</p>
                                        </div>
                                        <div className="col-md-2 mb-3">
                                            <label htmlFor="stops" className="form-label">GST</label>
                                            <p>{totalserviceGSTAmount.toFixed(2)}</p>
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="stops" className="form-label">GTI Sell (INR)</label>
                                            <p>{totalserviceSellINR.toFixed(2)}</p>
                                        </div>
                                        <div className="col-md-2 mb-3">
                                            <label htmlFor="stops" className="form-label">GTI US Sales Amount (USD)</label>
                                            <p>{totalserviceNetUSD.toFixed(2)}</p>
                                        </div>
                                        <div className="col-md-2 mb-3">
                                            <label htmlFor="stops" className="form-label">GTI US Commission</label>
                                            <p>{totalserviceUSDCommission.toFixed(2)}</p>
                                        </div>
                                        <div className="col-md-2 mb-3">
                                            <label htmlFor="stops" className="form-label">GTI US Payable Amount Exclude  Tax (USD)</label>
                                            <p>{totalserviceUSDClientDollar.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
      </React.Fragment>)
}

export default CostingSummaryViewComponent;


