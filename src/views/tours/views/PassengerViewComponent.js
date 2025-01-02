import React from "react";
import {DISPLAYDATEFORMATE} from '../../../helpers/constants';
import {ArrayHelper} from '../../../helpers/arrayhelper';
import {formatDate} from "../../../vendor/datefns";
const ToursViewComponent = (props) => {
    return (<React.Fragment> 
         <div className="p-3 border mt-2 mb-2 boxAddPassanger">
                <span className="me-2 heading"> Passenger </span>
                <div className="table-responsive">
                <table className="table table-striped rounded border">
                            <tbody>
                                <tr>
                                <th>Passenger Name</th>
                                        <th>Contact Number</th>
                                        <th>DOB</th>
                                        <th>Email</th>
                                        <th>Passport Number</th>
                                        <th>Passenger Type</th>
                                </tr>
                                {props.PassengerData.map((item,key)=>{
                                   
                                            return( <tr key={`PassengerData-${key}`}>
                              <td>{ArrayHelper.getValue(item,'fName')} {ArrayHelper.getValue(item,'mName')} {ArrayHelper.getValue(item,'lName')}</td>
                                        <td>{ArrayHelper.getValue(item,'contactNo')}</td>
                                        <td>
                                            {(ArrayHelper.getValue(item,'dob')!='' && ArrayHelper.getValue(item,'dob')!='1900-01-01T00:00:00')?formatDate(ArrayHelper.getValue(item,'dob'),DISPLAYDATEFORMATE):''}
                                            
                                            </td>
                                        <td>{ArrayHelper.getValue(item,'email')}</td>
                                        <td>{ArrayHelper.getValue(item,'passportNo')}</td>
                                        <td>{ArrayHelper.getValue(item,'passengerType')}</td>
                                   
                                </tr>)
                                })}
                                
                               
                            </tbody>
                        </table>
                </div>
         </div>       
           
      </React.Fragment>)
}

export default ToursViewComponent;


