import React from "react";
import {DISPLAYDATEFORMATE} from '../../../helpers/constants';
import {ArrayHelper} from '../../../helpers/arrayhelper';
import {formatDate} from "../../../vendor/datefns";
const FlightViewComponent = (props) => {
    return (<React.Fragment> 
         <div className="p-3 border mt-2 mb-2 boxAddPassanger">
                <span className="me-2 heading">Payment </span>
                <div className="table-responsive">
                <table className="table table-striped rounded border">
                            <tbody>
                                <tr>
                                <th>Transaction Id</th>
                                        <th>Amount</th>
                                        <th>Payment Date</th>
                                        <th>Due Date</th>
                                        <th className="width400">Notes</th>
                                        <th>Payment  Type</th>
                                        <th>Payment  Mode</th>
                                        <th>Mode</th>  
                                </tr>
                                {props.PaymentData.map((item,key)=>{
                                   
                                            return( <tr key={`PaymentData-${key}`}>
                           <td>{ArrayHelper.getValue(item,'transactionId')}</td>
                                        <td>{ArrayHelper.getValue(item,'amount')}</td>
                                        <td>
                                            {(ArrayHelper.getValue(item,'paymentDate')!='' && ArrayHelper.getValue(item,'paymentDate')!='1900-01-01T00:00:00')?formatDate(ArrayHelper.getValue(item,'paymentDate'),DISPLAYDATEFORMATE):''}
                                            
                                            </td>
                                            <td>
                                            {(ArrayHelper.getValue(item,'dueDate')!='' && ArrayHelper.getValue(item,'dueDate')!='1900-01-01T00:00:00')?formatDate(ArrayHelper.getValue(item,'dueDate'),DISPLAYDATEFORMATE):''}
                                            
                                            </td>
                                        <td>{ArrayHelper.getValue(item,'notes')}</td>
                                        <td>{ArrayHelper.getValue(item,'paymentMethod')}</td>
                                        <td>{ArrayHelper.getValue(item,'paymentMode')}</td>
                                        <td>{ArrayHelper.getValue(item,'status')}</td>
                                   
                                </tr>)
                                })}
                                
                               
                            </tbody>
                        </table>
                </div>
         </div>       
           
      </React.Fragment>)
}

export default FlightViewComponent;


