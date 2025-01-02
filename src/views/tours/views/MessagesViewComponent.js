import React from "react";
import {ArrayHelper} from '../../../helpers/arrayhelper';
const MessagesViewComponent = (props) => {
    return (<React.Fragment> 
       {(props.MessagesList.length>0)?<div className="accordion-item">
                                <h2 className="accordion-header" id="headingMessages">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseMessages" aria-expanded="false"
                                        aria-controls="collapsePassenger">
                                       Messages
                                    </button>
                                </h2>
                                <div id="collapseMessages" className="accordion-collapse collapse show" aria-labelledby="headingMessages" data-bs-parent="#accordionExample">
                                   
                                   
                                  <table className="table table-striped rounded border">
                            <tbody>
                                <tr>
                                    <th className="width200">Posted By </th>
                                    <th>Message</th>
                                </tr>
                                {props.MessagesList.map((item,key)=>{
                                   
                                            return( <tr key={`Messages-${key}`}>
                                    <td>{ArrayHelper.getValue(item,'notesFrom')}</td>
                                    <td>{ArrayHelper.getValue(item,'comments')}</td>
                                    
                                   
                                </tr>)
                                })}
                                
                               
                            </tbody>
                        </table>

                                </div>
                            </div>:''}    
      </React.Fragment>)
}

export default MessagesViewComponent;


