import React from "react";
import {DISPLAYDATEFORMATE} from '../../../helpers/constants';
import {ArrayHelper} from '../../../helpers/arrayhelper';
import {formatDate} from "../../../vendor/datefns";
const FlightViewComponent = (props) => {
    return (<React.Fragment> 
         <div className="p-3 border mt-2 mb-2 boxAddPassanger">
                <span className="me-2 heading">FLIGHT </span>
                <div className="table-responsive">
                <table className="table table-striped rounded border">
                            <tbody>
                                <tr>
                                <th>Air Line</th>
                                        <th>Departure Location</th>
                                        <th>Departure Date</th>
                                      
                                        <th>Arrival Location</th>
                                        <th>Arrival Date</th>
                                        <th>PNR</th> 
                                        <th>Confirmation Date</th>   
                                </tr>
                                {props.FlightData.map((item,key)=>{
                                   
                                            return( <tr key={`FlightData-${key}`}>
                            <td>{ArrayHelper.getValue(item,'airLineName')}</td>
                                        <td>{ArrayHelper.getValue(item,'departureLocation')}</td>
                                        <td>
                                            {(ArrayHelper.getValue(item,'departureDate')!='' && ArrayHelper.getValue(item,'departureDate')!='1900-01-01T00:00:00')?formatDate(ArrayHelper.getValue(item,'departureDate'),DISPLAYDATEFORMATE):''}
                                            
                                            </td>
                                            <td>{ArrayHelper.getValue(item,'arrivalLocation')}</td>
                                            <td>
                                            {(ArrayHelper.getValue(item,'arrivalDate')!='' && ArrayHelper.getValue(item,'arrivalDate')!='1900-01-01T00:00:00')?formatDate(ArrayHelper.getValue(item,'arrivalDate'),DISPLAYDATEFORMATE):''}
                                            
                                            </td>
                                            <td>{ArrayHelper.getValue(item,'pnr')}</td>
                                            <td>
                                            {(ArrayHelper.getValue(item,'confirmationDate')!='' && ArrayHelper.getValue(item,'confirmationDate')!='1900-01-01T00:00:00')?formatDate(ArrayHelper.getValue(item,'confirmationDate'),DISPLAYDATEFORMATE):''}
                                            
                                            </td>
                                   
                                </tr>)
                                })}
                                
                               
                            </tbody>
                        </table>
                </div>
         </div>       
           
      </React.Fragment>)
}

export default FlightViewComponent;


