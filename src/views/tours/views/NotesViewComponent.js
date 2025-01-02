import React from "react";
import {ArrayHelper} from '../../../helpers/arrayhelper';
const NotesViewComponent = (props) => {
    return (<React.Fragment> 
      {(props.NotesList.length>0)?<div className="accordion-item">
                                <h2 className="accordion-header" id="headingNotes">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseNotes" aria-expanded="false"
                                        aria-controls="collapsePassenger">
                                       Notes
                                    </button>
                                </h2>
                                <div id="collapseNotes" className="accordion-collapse collapse show" aria-labelledby="headingNotes" data-bs-parent="#accordionExample">
                                   
                                
                                  <table className="table table-striped rounded border">
                            <tbody>
                                <tr>
                                    <th className="width200">Posted By </th>
                                    <th>Notes</th>
                                </tr>
                                {props.NotesList.map((item,key)=>{
                                   
                                            return( <tr key={`Messages-${key}`}>
                                    <td>{ArrayHelper.getValue(item,'notesFrom')}</td>
                                    <td>{ArrayHelper.getValue(item,'notes')}</td>
                                    
                                   
                                </tr>)
                                })}
                                
                               
                            </tbody>
                        </table> 

                                </div>
                            </div>:''} 
      </React.Fragment>)
}

export default NotesViewComponent;


