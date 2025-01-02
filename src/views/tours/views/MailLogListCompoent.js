import React from "react";
import {ArrayHelper} from '../../../helpers/arrayhelper';
const MailLogListComponent = (props) => {
    
    return (<React.Fragment> 
      <table className="table table-striped rounded border">
                            <tbody>
                                <tr>
                                    <th className="width50">S No.</th>
                                    <th className="width150">Mail Subject</th>
                                    <th className="width200">Mail Content</th>
                                    <th className="width200 txtCenter">Action</th>
                                   
                                </tr>
                                {(props.mailLogModelList.length>0)?props.mailLogModelList.map((item,key)=>{
                                    let bodyPreview=ArrayHelper.getValue(item,'bodyPreview').split('___K2GTBT___')
                                  
                                            return( <tr key={`mailLog-${key}`}>
                                    <td>{key+1}</td>
                                    {/* <td>{ArrayHelper.getValue(item,'serviceDescription')}</td> */}
                                    <td>{ArrayHelper.getValue(item,'subject').substring(0, 100)}{(ArrayHelper.getValue(item,'subject').length>100)?'...':''}</td>
                                    <td>{ArrayHelper.getValue(bodyPreview,'[0]').substring(0, 100)}{(ArrayHelper.getValue(bodyPreview,'[0]').length>100)?'...':''}</td>
                                    <td   className="txtCenter">
                                    <i data-bs-toggle="modal" data-bs-target={`#selectedViewMailLogContent${props.displayType}`} onClick={()=>props.viewMailDisplay(item,'')}  className="fa fa-eye btn text-primary" title="View"></i>
                                      <i data-bs-toggle="modal" data-bs-target={`#selectedMailComposeForm${props.displayType}`} onClick={()=>props.viewMailDisplay(item,'Reply')} className="fa fa-reply btn text-primary" title="Reply"></i>
                                      <i data-bs-toggle="modal" data-bs-target={`#selectedMailComposeForm${props.displayType}`} onClick={()=>props.viewMailDisplay(item,'Reply All')}  className="fa fa-reply-all btn text-primary" title="Reply All"></i>
                                      <i data-bs-toggle="modal" data-bs-target={`#selectedMailComposeForm${props.displayType}`}  onClick={()=>props.viewMailDisplay(item,'Forward')}  className="fa fa-share btn text-primary" title="Forward"></i>
                                    </td>                                    
                                </tr>)
                                }):<tr>  <td colSpan={4}>No record exits!</td></tr>}
                                </tbody>
                                </table>
      </React.Fragment>)
}

export default MailLogListComponent;


