import React from "react";
import {connect} from 'react-redux';
import * as actionTypesUser from "../../../store/action/settings.action";
import DepartmentAddComponent from './DepartmentAddComponent';
import DepartmentUpdateComponent from './DepartmentUpdateComponent';
import SettingApi from "../../../api/Setting.api";
import {ArrayHelper} from "../../../helpers/arrayhelper";
import PaginationComponent from "../../../components/PaginationComponent";
import {USER_ID} from '../../../helpers/constants';
import LoaderComponent from "../../../components/LoaderComponent";
import ExcelDownloadButton from "../../../components/ExcelDownloadButton";
class DepartmentComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loader:false,departmentListAll:[],departmentListFilter:[],departmentList:[],selectedDepartment:{},perPage:20,currentPage:1,keyword:''};
    }
    componentDidMount()
    {
     
     let departmentListData=this.props.departmentListData;
     if(departmentListData.length>0)
     {
        let departmentList=[];
        for (let i = 0; i < this.state.perPage; i++) {
            if (ArrayHelper.getValue(departmentListData[i],'id')!='') {
                departmentList.push(departmentListData[i]);
            }
        }
        
        this.setState({departmentListAll:departmentListData,departmentListFilter:departmentListData,departmentList:departmentList});
     }
     else
     {
      this.getDepartmentList()
     }
     
    }
    getDepartmentList=async()=>
    {
        this.setState({loader:true});
      let response= await SettingApi.GetSettingList('/api/Department/List');
        if(ArrayHelper.getValue(response,'isSuccess')== true)
        {
            
          let departmentList = [];
         
          for (let i = 0; i < this.state.perPage; i++) {
              if (ArrayHelper.getValue(ArrayHelper.getValue(response,'departments')[i],'id')!='') {
                departmentList.push(ArrayHelper.getValue(response,'departments')[i]);
              }
          }
          
          this.setState({loader:false,departmentListAll:ArrayHelper.getValue(response,'departments'),departmentListFilter:ArrayHelper.getValue(response,'departments'),departmentList:departmentList});
          this.props.departmentListInfo(ArrayHelper.getValue(response,'departments'));
        }
        else
        {
            this.setState({loader:false});  
        }
    }
    componentWillReceiveProps(nextProps) {
        if(this.state.departmentListFilter.length>0)
        {
         const location = nextProps.params;
          if (location.page !== undefined && location.page !== this.state.currentPage) {
        
            let departmentList = [];
            let numRecord=0;
            let i=0;        
              i = (location.page - 1) * this.state.perPage;
              numRecord=location.page * this.state.perPage;      
          
            for (i; i < numRecord ; i++) {
          if (ArrayHelper.getValue(this.state.departmentListFilter[i],'id')!='') {
            departmentList.push(this.state.departmentListFilter[i]);
          }
        }
              this.setState({ currentPage: parseInt(location.page), departmentList: departmentList });
          } else {
              
            let departmentList = [];
          
            for (let i=0; i < this.state.perPage; i++) {
          if (ArrayHelper.getValue(this.state.departmentListFilter[i],'id')!='') {
            departmentList.push(this.state.departmentListFilter[i]);
          }
        }
       
              this.setState({ departmentList: departmentList, currentPage: 1 });
          }
        }
        else if(this.props.departmentListData.length>0)
        {
          this.setState({ departmentList: [], currentPage: 1 });
        }
        }
        updatedDepartmentList=async(str)=>
        {
            let departmentListAll=this.state.departmentListAll;
            departmentListAll=departmentListAll.map((item)=>{
                if(item.id==str.id)
                {
                    item  =str;
                    return item;
                }
                return item;
            })
            let departmentList=this.state.departmentList;
            departmentList=departmentList.map((item)=>{
                if(item.id==str.id)
                {
                    item  =str;
                    return item;
                }
                return item;
            })
            let departmentListFilter=this.state.departmentListFilter;
            departmentListFilter=departmentListFilter.map((item)=>{
                if(item.id==str.id)
                {
                    item  =str;
                    return item;
                }
                return item;
            })
              this.setState({departmentListAll:departmentListAll,departmentListFilter:departmentListFilter,departmentList:departmentList,selectedDepartment:str});
              this.props.departmentListInfo(departmentListAll);
            
        }  
        ContactStatusDelete=async(str)=>
        {
            if(window.confirm('Do you want to delete selected Department?'))
            {
                this.setState({loader:true})
      
                let formData={
                  "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
                  "channelId": parseInt(str)
                }
                let response= await SettingApi.PostSettingList(formData,'/api/Department/Delete');
                if(ArrayHelper.getValue(response,'isSuccess')==true)
                {
            let departmentListAll=this.state.departmentListAll;
            departmentListAll=departmentListAll.filter((item)=>item.id!=str)

            let departmentListFilter=this.state.departmentListAll;
            departmentListFilter=departmentListFilter.filter((item)=>item.id!=str)
         
              this.setState({loader:false,departmentListAll:departmentListAll,departmentListFilter:departmentListFilter});
              this.props.departmentListInfo(departmentListAll);
              this.props.history("/settings/department"); 
                }
            }   
            
        }
        reloadWindow()
        {
          window.location.reload(); 
        }  
        filterData()
        {
            this.setState({loader:true})
            let departmentListAll=this.state.departmentListAll;
            if(this.state.keyword.trim()!='')
            {
                let departmentListFilter=  departmentListAll.filter((item)=>{
                    if(item.name.search(new RegExp(this.state.keyword.trim(), "i")) != -1 && this.state.keyword.trim()!='')
                    {
                      return item;
                    }
                });
                this.setState({departmentListFilter:departmentListFilter,currentPage:1});
      setTimeout(()=>{
        this.setState({loader:false})
        this.props.history("/settings/department"); 
      },10)
            }
            else
            {
              this.clearData();  
            }
        }
        clearData()
        {
            this.setState({loader:true,keyword:'',currentPage:1,departmentListFilter:this.state.departmentListAll})
            setTimeout(()=>{              
             this.setState({loader:false})
             this.props.history("/settings/department"); 
           },10)
        }
        handleChange = (e) => {
            const name = e.target.name;
            let  value = e.target.value;        
            this.setState({ ...this.state, [name]: value });
            } 

    render(){
        const { departmentListFilter, departmentListAll } = this.state;
        const dataToExport = departmentListFilter.length > 0 ? departmentListFilter : departmentListAll;
        return(
          
            <React.Fragment>
                 <LoaderComponent loader={this.state.loader}/>
        <div className="tab-pane fade show active" id="AgencyType-tab-pane" role="tabpanel" aria-labelledby="AgencyType-tab" tabIndex="0">
                    <div className="p-4">
                    <div className="row mb-3">
                        <div className="col-md-2">
                    <br/>
                    <h5 className="">Department</h5>
                    </div>
                    <div className="col-md-8">
                        <div className="row g-3 align-items-center">
                            <div className="col-sm-3">
                                    <label>Search </label>
                                <input type="text" name="keyword" value={this.state.keyword} onChange={this.handleChange} className="form-control"  placeholder=""/>
                            </div>
                           
                            <div className="col-sm-1 pt-4">
                              <button onClick={()=>this.filterData()} type="button" className="btn btn-sm btn-secondary rounded">Submit</button>
                            </div>
                            <div className="col-sm-1 pt-4">
                                <button onClick={()=>this.clearData()} type="button" className="btn btn-sm btn-secondary rounded">Clear</button>
                            </div>
                        </div>
                    </div>


<div className="d-flex align-items-center justify-content-end">
                  <a onClick={() => this.reloadWindow()}><img style={{ 'height': '40px' }} src="/images/reload.png" /></a>
                  <button data-bs-toggle="modal" data-bs-target="#departmentAdd" className="btn btn-outlined me-1">
                    <i className="fa-sharp fa-solid fa-plus"></i> Add
                  </button>

<ExcelDownloadButton
  data={dataToExport}
  columns={['name']} 
  fileName="ActionTypes.xlsx"
  sheetName="Action Types"
/>
                </div>

                </div>
                       
                        <div className="borderless-box">
                            <div className="table-responsive">
                               {(this.state.departmentList.length>0)?<table className="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th>Sr. No</th>
                                            <th>Name</th>                                           
                                            <th colSpan="2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.departmentList.map((item,key)=>{
                                            return( <tr key={`actionType-${key}`}>
                                                {/* <td>{key+1}</td> */}
                                                <td>{((this.state.currentPage -1)*this.state.perPage) + key+1}</td>

                                                <td>{ArrayHelper.getValue(item,'name')}</td>                                                
                                                <td>
                                                    <i data-bs-toggle="modal" data-bs-target="#departmentUpdate" onClick={()=>{this.setState({selectedDepartment:item})}}  className="fa fa-edit btn"  data-bs-placement="top" title="Edit"></i>
                                                </td>                                               
                                                <td>
                                                    <i onClick={()=>this.ContactStatusDelete(ArrayHelper.getValue(item,'id'))} className="fa fa-trash btn" data-bs-toggle="tooltip" data-bs-placement="top" title="Trash"></i>
                                                </td>
                                            </tr>)
                                        })}
                                    </tbody>
                                </table>:
                                <p>No Record Found</p>}
                                {(this.state.departmentListFilter.length > this.state.perPage) ?
                    <PaginationComponent
                        total={this.state.departmentListFilter.length}
                        pageSize={this.state.perPage}
                        currentPage={this.state.currentPage} /> : ''
            }
                            </div>
                        </div>

                    </div>
                </div>
                <DepartmentAddComponent getDepartmentList={()=>this.getDepartmentList()}/>
                <DepartmentUpdateComponent updatedDepartmentList={(str)=>this.updatedDepartmentList(str)} selectedDepartment={this.state.selectedDepartment}/>
            </React.Fragment>
        )
    }
}  



const mapStateToProps = state => {
    return {
        departmentListData : state.settingsData.departmentList,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        departmentListInfo:(data)=>dispatch({type: actionTypesUser.DEPARTMENT_LIST,payload:data}),
       
    }
};

export default  connect(mapStateToProps, mapDispatchToProps)(DepartmentComponent);