import React from "react";
import {connect} from 'react-redux';
import * as actionTypesUser from "../../../store/action/settings.action";
import LoaderComponent from "../../../components/LoaderComponent";
import {USER_ID} from '../../../helpers/constants';
import {ArrayHelper} from "../../../helpers/arrayhelper";
import SettingApi from "../../../api/Setting.api";
declare var $;
class QuestionnaireFormComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {loader:false,salesCategoryList:[],'id':'',"questions":'',"questionType":'',"answers":[""]};
    }
    componentDidMount()
    {
       
        this.dataTypeList()
    }

    dataTypeList=async()=>
    {
        let salesCategoryListData=this.props.salesCategoryListData;
        if(salesCategoryListData.length>0)
        {
            this.setState({salesCategoryList:salesCategoryListData})
        }
        else
        {
            this.setState({loader:false});
          let response= await SettingApi.GetSettingList('/api/Questionnaire/List');
        if(ArrayHelper.getValue(response,'isSuccess')== true)
        {
            this.setState({loader:false,salesCategoryList:ArrayHelper.getValue(response,'questionnaires')});
            this.props.questionnaireListInfo(ArrayHelper.getValue(response,'questionnaires'));
        }
        }

        
        
    }
    handleChange = (e) => {
        const name = e.target.name;
        let  value = e.target.value;        
        this.setState({ ...this.state, [name]: value });
        }
    submit = async(event: any) => {
        event.preventDefault();
        let formData={
          "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
          "questionnaire": {
            "id":(this.props.formType=='add')?0:parseInt(this.state.id),
            "questions": [this.state.questions],
             "questionType":this.state.questionType,
             "answers": this.state.answers
          }
        }
        this.setState({loader:true});
      if(this.props.formType=='add')
      {
       let response= await SettingApi.PostSettingList(formData,'/api/Questionnaire/Add');
       if(ArrayHelper.getValue(response,'isSuccess')==true)
       {
         this.setState({loader:false,'id':'',"questions":[],"questionType":'',"answers":[],'message':"Questionnaire has been added",'messageType':'success'})
          this.props.getQuestionnaireList();
       }
       else
       {
         this.setState({loader:false,'message':ArrayHelper.getValue(response,'message'),'messageType':'error'})
       }
      }
      else if(this.props.formType=='update')
      {
       let response= await SettingApi.PostSettingList(formData,'/api/Questionnaire/Update');
       if(ArrayHelper.getValue(response,'isSuccess')==true)
       {
         this.setState({loader:false,'message':"Questionnaire has been Updated",'messageType':'success'})
         this.props.updatedQuestionnaireList(ArrayHelper.getValue(response,'questionnaires')[0]);
         setTimeout(()=>{
          this.setState({"message":''});
          $(".close").click();
         },1000)
       }
       else
       {
         this.setState({loader:false,'message':ArrayHelper.getValue(response,'message'),'messageType':'error'})
       }
      }
    }
    componentWillReceiveProps()
    {
        setTimeout(() => {
         
            this.setState({ 
            "id": ArrayHelper.getValue(this.props.selectedQuestionnaire,'id'),    
            "questions": ArrayHelper.getValue(this.props.selectedQuestionnaire,'questions')[0],
            "questionType": ArrayHelper.getValue(this.props.selectedQuestionnaire,'questionType'),
            "answers": (ArrayHelper.getValue(this.props.selectedQuestionnaire,'answers').length>0)?ArrayHelper.getValue(this.props.selectedQuestionnaire,'answers'):['']
            });
            },100);
    }
    addAnswer()
    {
        let answers=this.state.answers;
        answers.push(' ');
        this.setState({answers:answers})
    }
    deleteAnswer(str)
    {
        let answers=this.state.answers;
        answers  =answers.filter((item,key)=>key!=str);
        this.setState({answers:answers})
    }
    handleAnsInput(key,value)
    {
        this.setState({
            answers: this.state.answers.map((item: any, k: number) => {                
                if (key == k) {
                    item = value;
                }
        
                return item;
            })
        }); 
    }
    render(){
        return(
            <React.Fragment>
                <LoaderComponent loader={this.state.loader}/>
                <form  method="post" onSubmit={this.submit}>
      <div className="row CreateTrip">
      {(this.state.message!='')?<p  className={`updateMessage ${(this.state.messageType=='success')?'message-green':'message-red'}`}>{this.state.message}</p>:''}
                                 <div className="col-md-12">
                                  <div className="mb-3">
                                      <label  className="form-label">Question Type </label>
                                      <select required className="form-select form-noradious" name="questionType" value={this.state.questionType} onChange={this.handleChange} >
                                        
                                      <option value="">Select Question Type</option>
                                      <option value="Single">Single</option>
                                      <option value="Multiple">Multiple</option>
                                      <option value="Input">Input</option>
                                      </select>
                                  </div>
                              </div>
                          <div className="col-md-12">
                                <div className="mb-3">
                                    <label  className="form-label"> Questions </label>
                                    <input required  type="text" className="form-control form-noradious" name="questions" value={this.state.questions} onChange={this.handleChange} placeholder="Enter Questionnaire Name"/>
                                  
                                </div>
                            </div>
                         
                              <div className={`col-md-12 ${(this.state.questionType!='Input')?'show':'hide'}`}>
                                {(this.state.answers.length>0)?<div className="mb-3">
                                    <label  className="form-label"> Answers </label>
                                    {this.state.answers.map((item: any, key: number) => {
                                        return(<div className="row" key={`ans-${key}`}><div className="col-md-10"> <input    type="text" className="form-control form-noradious" name="answers" value={item}   onChange={(event: any) => this.handleAnsInput(key,  event.currentTarget.value)}  placeholder="Enter Answer"/></div><div className="col-md-2">  {(key>0)?<a onClick={() => this.deleteAnswer(key)} ><i className="fa-solid fa-square-minus fs-1 topSpace"></i></a>: <a   onClick={() => this.addAnswer()}><i className="fa-solid fa-square-plus fs-1 topSpace"></i></a>}</div></div>)
                                    })}
                                   
                                </div>:''}
                            </div>
                            
                            
                            <div className="col-md-12 text-end">
                            <div className="mb-3">
                                <button type="submit" className="btn btn-primary me-2">{(this.props.formType=='add')?'Submit':'Update'}</button>
                            </div> 
                            </div>                     
                       
                           
                        </div>
                        </form>
            </React.Fragment>
        )
    }
}  






const mapStateToProps = state => {
    return {
        salesCategoryListData : state.settingsData.salesCategoryList,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        questionnaireListInfo:(data)=>dispatch({type: actionTypesUser.QUESTIONAIRE_LIST,payload:data}),
       
    }
};

export default  connect(mapStateToProps, mapDispatchToProps)(QuestionnaireFormComponent);

