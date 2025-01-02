import React from "react";
import {ArrayHelper} from '../../../helpers/arrayhelper';
const MessagesViewComponent = (props) => {
    return (<React.Fragment> 
      <div className="modal fade" id={`selectedViewMailLogContent${props.displayType}`} data-bs-keyboard="false" data-bs-backdrop="static">
  <div className="modal-dialog modal-xl">
    <div className="modal-content">
      <div className="modal-header">
        <h3 className="modal-title" id="exampleModalLabel">{ArrayHelper.getValue(props.selectedMailLogContent,'subject')}</h3>
        <button type="button" className="close"  data-bs-dismiss="modal"  aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
     
      <div className="" dangerouslySetInnerHTML={{ __html: ArrayHelper.getValue(props.selectedMailLogContent,'bodyContent') }} />
     
      </div>
      
    </div>
  </div>
</div>  
      </React.Fragment>)
}

export default MessagesViewComponent;


