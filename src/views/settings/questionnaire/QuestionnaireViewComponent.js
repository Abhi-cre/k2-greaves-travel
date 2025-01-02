import React from "react";
import {ArrayHelper} from "../../../helpers/arrayhelper";
const QuestionnaireViewComponent = (props) => {
   
        return(
            <React.Fragment>
               
                <div className="modal fade" id="questionnaireView" data-bs-keyboard="false" data-bs-backdrop="static">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h3 className="modal-title" id="exampleModalLabel">View Questionnaire</h3>
        <button type="button" className="close"  data-bs-dismiss="modal"  aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
      <div className="borderless-box">
      <div className="table-responsive">
      <table className="table table-bordered table-striped">
      <tbody>
      <tr> <td><strong>Question Type :</strong> {ArrayHelper.getValue(props.selectedQuestionnaire,'questionType')}</td>  </tr>
      <tr> <td>  <strong>Questions :</strong> {ArrayHelper.getValue(props.selectedQuestionnaire,'questions')[0]}</td>  </tr>
      {(ArrayHelper.getValue(props.selectedQuestionnaire,'answers').length>0)?<tr> <td>  <strong>Answers:</strong> {ArrayHelper.getValue(props.selectedQuestionnaire,'answers').map((item,key)=>{
        return(<p key={`ans-${key}`}>{key+1}. {item}</p>)
      })}</td>  </tr>:''}
      
      </tbody>
      </table>
      </div> 
      </div> 
        
      </div>
      
    </div>
  </div>
</div>
            </React.Fragment>
        )
    
}  




export default  QuestionnaireViewComponent;

