import React from "react";
import {DISPLAYDATEFORMATE} from '../../../helpers/constants';
import {ArrayHelper} from '../../../helpers/arrayhelper';
import {formatDate} from "../../../vendor/datefns";
const VendorPaymentViewComponent = (props) => {
    return (<React.Fragment> 
         <div className="p-3 border mt-2 mb-2 boxAddPassanger">
                <span className="me-2 heading">Vendor Payment </span>
                <div className="table-responsive">
                <table className="table table-striped rounded border">
                            <tbody>
                                <tr>
                                <th>Vendor</th>
                                        <th>Transaction Id</th>
                                        <th>Amount</th>
                                        <th>Transaction Date</th>
                                        <th>Transaction Due Date</th>
                                        <th>Status</th>
                                </tr>
                                {props.VendorPaymentData.map((item,key)=>{
                                   
                                            return( <tr key={`VendorPaymentData-${key}`}>
                                       <td>{ArrayHelper.getValue(item,'vendorName')}</td>
                                        <td>{ArrayHelper.getValue(item,'transactionId')}</td>
                                        <td>{ArrayHelper.getValue(item,'amount')}</td>
                                        <td>
                                            {(ArrayHelper.getValue(item,'transactionDate')!='' && ArrayHelper.getValue(item,'transactionDate')!='1900-01-01T00:00:00')?formatDate(ArrayHelper.getValue(item,'transactionDate'),DISPLAYDATEFORMATE):''}
                                            
                                            </td>
                                            <td>
                                            {(ArrayHelper.getValue(item,'transactionDueDate')!='' && ArrayHelper.getValue(item,'transactionDueDate')!='1900-01-01T00:00:00')?formatDate(ArrayHelper.getValue(item,'transactionDueDate'),DISPLAYDATEFORMATE):''}
                                            
                                            </td>                                       
                                        <td>{ArrayHelper.getValue(item,'status')}</td>
                                   
                                </tr>)
                                })}
                                
                               
                            </tbody>
                        </table>
                </div>
         </div>       
           
      </React.Fragment>)
}

export default VendorPaymentViewComponent;


