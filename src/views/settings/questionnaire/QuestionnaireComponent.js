import React from "react";
import {connect} from 'react-redux';
import * as actionTypesUser from "../../../store/action/settings.action";
import QuestionnaireAddComponent from './QuestionnaireAddComponent';
import QuestionnaireUpdateComponent from './QuestionnaireUpdateComponent';
import QuestionnaireViewComponent from './QuestionnaireViewComponent';
import SettingApi from "../../../api/Setting.api";
import {ArrayHelper} from "../../../helpers/arrayhelper";
import PaginationComponent from "../../../components/PaginationComponent";
import {USER_ID} from '../../../helpers/constants';
import LoaderComponent from "../../../components/LoaderComponent";
class QuestionnaireComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loader:false,questionnaireListAll:[],questionnaireList:[],selectedQuestionnaire:{},perPage:20,currentPage:1};
    }
    componentDidMount()
    {
     
     let questionnaireListData=this.props.questionnaireListData;
     if(questionnaireListData.length>0)
     {
        let questionnaireList=[];
        for (let i = 0; i < this.state.perPage; i++) {
            if (ArrayHelper.getValue(questionnaireListData[i],'id')!='') {
                questionnaireList.push(questionnaireListData[i]);
            }
        }
        
        this.setState({questionnaireListAll:questionnaireListData,questionnaireList:questionnaireList});
     }
     else
     {
      this.getQuestionnaireList()
     }
     
    }
    getQuestionnaireList=async()=>
    {
        this.setState({loader:true});
      let response= await SettingApi.GetSettingList('/api/Questionnaire/List');
        if(ArrayHelper.getValue(response,'isSuccess')== true)
        {
            
          let questionnaireList = [];
         
          for (let i = 0; i < this.state.perPage; i++) {
              if (ArrayHelper.getValue(ArrayHelper.getValue(response,'questionnaires')[i],'id')!='') {
                questionnaireList.push(ArrayHelper.getValue(response,'questionnaires')[i]);
              }
          }
          
          this.setState({loader:false,questionnaireListAll:ArrayHelper.getValue(response,'questionnaires'),questionnaireList:questionnaireList});
          this.props.questionnaireListInfo(ArrayHelper.getValue(response,'questionnaires'));
        }
        else
        {
            this.setState({loader:false});  
        }
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.questionnaireListData.length>0)
        {
         const location = nextProps.params;
          if (location.page !== undefined && location.page !== this.state.currentPage) {
        
            let questionnaireList = [];
            let numRecord=0;
            let i=0;        
              i = (location.page - 1) * this.state.perPage;
              numRecord=location.page * this.state.perPage;      
          
            for (i; i < numRecord ; i++) {
          if (ArrayHelper.getValue(nextProps.questionnaireListData[i],'id')!='') {
            questionnaireList.push(nextProps.questionnaireListData[i]);
          }
        }
              this.setState({ currentPage: parseInt(location.page), questionnaireList: questionnaireList });
          } else {
              
            let questionnaireList = [];
          
            for (let i=0; i < this.state.perPage; i++) {
          if (ArrayHelper.getValue(nextProps.questionnaireListData[i],'id')!='') {
            questionnaireList.push(nextProps.questionnaireListData[i]);
          }
        }
       
              this.setState({ questionnaireList: questionnaireList, currentPage: 1 });
          }
        }
        else
        {
          this.setState({ questionnaireList: [], currentPage: 1 });
        }
        }
        updatedQuestionnaireList=async(str)=>
        {
            let questionnaireListAll=this.state.questionnaireListAll;
            questionnaireListAll=questionnaireListAll.map((item)=>{
                if(item.id==str.id)
                {
                    item  =str;
                    return item;
                }
                return item;
            })
            let questionnaireList=this.state.questionnaireList;
            questionnaireList=questionnaireList.map((item)=>{
                if(item.id==str.id)
                {
                    item  =str;
                    return item;
                }
                return item;
            })
              this.setState({questionnaireListAll:questionnaireListAll,questionnaireList:questionnaireList,selectedQuestionnaire:str});
              this.props.questionnaireListInfo(questionnaireListAll);
            
        }  
        SalesGuideDelete=async(str)=>
        {
            if(window.confirm('Do you want to delete selected Questionnaire?'))
            {
                this.setState({loader:true})
      
                let formData={
                  "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
                  "questionnaireId": parseInt(str)
                }
                let response= await SettingApi.PostSettingList(formData,'/api/Questionnaire/Delete');
                if(ArrayHelper.getValue(response,'isSuccess')==true)
                {
            let questionnaireListAll=this.state.questionnaireListAll;
            questionnaireListAll=questionnaireListAll.filter((item)=>item.id!=str)
         
              this.setState({loader:false,questionnaireListAll:questionnaireListAll});
              this.props.questionnaireListInfo(questionnaireListAll);
              this.props.history("/settings/questionnaire"); 
                }
            }   
            
        }  
    render(){
      
        return(
          
            <React.Fragment>
                  <LoaderComponent loader={this.state.loader}/>
        <div className="tab-pane fade show active" id="AgencyType-tab-pane" role="tabpanel" aria-labelledby="AgencyType-tab" tabIndex="0">
                    <div className="p-4">
                        <div className="w-100 d-sm-inline-flex align-items-center justify-content-start">
                            <div className="w-25 py-2">
                                <h5 className="">Questionnaire</h5>
                            </div>
                            <div className="w-75 d-sm-inline-flex align-items-center justify-content-end">
                                <div className="w-auto p-2">
                                  
                                    <button data-bs-toggle="modal" data-bs-target="#questionnaireAdd" className="btn btn-outlined"> <i className="fa-sharp fa-solid fa-plus"></i> Add</button>
                                </div>
                            </div>
                        </div>
                        <div className="borderless-box">
                            <div className="table-responsive">
                               {(this.state.questionnaireList.length>0)?<table className="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th>Sr. No</th>                                          
                                            <th>Question Type</th>
                                            <th>Question</th>                                                                                      
                                            <th colSpan="3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.questionnaireList.map((item,key)=>{
                                            return( <tr key={`sales-guide-${key}`}>
                                                <td>{key+1}</td>
                                               
                                                <td>{ArrayHelper.getValue(item,'questionType')}</td>   
                                                <td>{ArrayHelper.getValue(item,'questions')}</td>                                              
                                                <td>
                                                    <i data-bs-toggle="modal" data-bs-target="#questionnaireView" onClick={()=>{this.setState({selectedQuestionnaire:item})}}  className="fa fa-eye btn"  data-bs-placement="top" title="Edit"></i>
                                                </td> 
                                                <td>
                                                    <i data-bs-toggle="modal" data-bs-target="#questionnaireUpdate" onClick={()=>{this.setState({selectedQuestionnaire:item})}}  className="fa fa-edit btn"  data-bs-placement="top" title="Edit"></i>
                                                </td>                                              
                                                <td>
                                                    <i onClick={()=>this.SalesGuideDelete(ArrayHelper.getValue(item,'id'))} className="fa fa-trash btn" data-bs-toggle="tooltip" data-bs-placement="top" title="Trash"></i>
                                                </td>
                                            </tr>)
                                        })}
                                    </tbody>
                                </table>:
                                <p>No Record Found</p>}
                                {(this.state.questionnaireListAll.length > this.state.perPage) ?
                    <PaginationComponent
                        total={this.state.questionnaireListAll.length}
                        pageSize={this.state.perPage}
                        currentPage={this.state.currentPage} /> : ''
            }
                            </div>
                        </div>

                    </div>
                </div>
                <QuestionnaireAddComponent getQuestionnaireList={()=>this.getQuestionnaireList()}/>
                <QuestionnaireUpdateComponent updatedQuestionnaireList={(str)=>this.updatedQuestionnaireList(str)} selectedQuestionnaire={this.state.selectedQuestionnaire}/>
                <QuestionnaireViewComponent  selectedQuestionnaire={this.state.selectedQuestionnaire}/>
            </React.Fragment>
        )
    }
}  



const mapStateToProps = state => {
    return {
        questionnaireListData : state.settingsData.questionnaireList,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        questionnaireListInfo:(data)=>dispatch({type: actionTypesUser.QUESTIONAIRE_LIST,payload:data}),
       
    }
};

export default  connect(mapStateToProps, mapDispatchToProps)(QuestionnaireComponent);