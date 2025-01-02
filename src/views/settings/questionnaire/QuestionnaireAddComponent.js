import React from "react";
import QuestionnaireFormComponent from './QuestionnaireFormComponent';
class QuestionnaireAddComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {loader:false,"name": "","code":'',"message":'',"messageType":''};
    }
    render(){
        return(
            <React.Fragment>
               
                <div className="modal fade" id="questionnaireAdd" data-bs-keyboard="false" data-bs-backdrop="static">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h3 className="modal-title" id="exampleModalLabel">Add Questionnaire</h3>
        <button type="button" className="close"  data-bs-dismiss="modal"  aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
      <QuestionnaireFormComponent formType="add" getQuestionnaireList={this.props.getQuestionnaireList} selectedSalesGuide={this.props.selectedSalesGuide}/>
     
      </div>
      
    </div>
  </div>
</div>
            </React.Fragment>
        )
    }
}  




export default  QuestionnaireAddComponent;

