import React from "react";
import {connect} from 'react-redux';
import * as actionTypesUser from "../../../store/action/settings.action";
import GreavesStatusAddComponent from './GreavesStatusAddComponent';
import GreavesStatusUpdateComponent from './GreavesStatusUpdateComponent';
import SettingApi from "../../../api/Setting.api";
import {ArrayHelper} from "../../../helpers/arrayhelper";
import PaginationComponent from "../../../components/PaginationComponent";
import {USER_ID} from '../../../helpers/constants';
import LoaderComponent from "../../../components/LoaderComponent";
import ExcelDownloadButton from "../../../components/ExcelDownloadButton";
class ClientStatusComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loader:false,greavesStatusListAll:[],greavesStatusListFilter:[],greavesStatusList:[],selectedGreavesStatus:{},perPage:8,currentPage:1,keyword:''};
    }
    componentDidMount()
    {
     
     let greavesStatusListData=this.props.greavesStatusListData;
     if(greavesStatusListData.length>0)
     {
        let greavesStatusList=[];
        for (let i = 0; i < this.state.perPage; i++) {
            if (ArrayHelper.getValue(greavesStatusListData[i],'id')!='') {
                greavesStatusList.push(greavesStatusListData[i]);
            }
        }
        
        this.setState({greavesStatusListAll:greavesStatusListData,greavesStatusListFilter:greavesStatusListData,greavesStatusList:greavesStatusList});
     }
     else
     {
      this.getGreavesStatusList()
     }
     
    }
    getGreavesStatusList=async()=>
    {
        this.setState({loader:true});
      let response= await SettingApi.GetSettingList('/api/GreavesStatus/List');
        if(ArrayHelper.getValue(response,'isSuccess')== true)
        {
            
          let greavesStatusList = [];
         
          for (let i = 0; i < this.state.perPage; i++) {
              if (ArrayHelper.getValue(ArrayHelper.getValue(response,'greavesStatuses')[i],'id')!='') {
                greavesStatusList.push(ArrayHelper.getValue(response,'greavesStatuses')[i]);
              }
          }
          
          this.setState({loader:false,greavesStatusListAll:ArrayHelper.getValue(response,'greavesStatuses'),greavesStatusListFilter:ArrayHelper.getValue(response,'greavesStatuses'),greavesStatusList:greavesStatusList});
          this.props.greavesStatusListInfo(ArrayHelper.getValue(response,'greavesStatuses'));
        }
        else
        {
            this.setState({loader:false});  
        }
    }
    componentWillReceiveProps(nextProps) {
        if(this.state.greavesStatusListFilter.length>0)
        {
         const location = nextProps.params;
          if (location.page !== undefined && location.page !== this.state.currentPage) {
        
            let greavesStatusList = [];
            let numRecord=0;
            let i=0;        
              i = (location.page - 1) * this.state.perPage;
              numRecord=location.page * this.state.perPage;      
          
            for (i; i < numRecord ; i++) {
          if (ArrayHelper.getValue(this.state.greavesStatusListFilter[i],'id')!='') {
            greavesStatusList.push(this.state.greavesStatusListFilter[i]);
          }
        }
              this.setState({ currentPage: parseInt(location.page), greavesStatusList: greavesStatusList });
          } else {
              
            let greavesStatusList = [];
          
            for (let i=0; i < this.state.perPage; i++) {
          if (ArrayHelper.getValue(this.state.greavesStatusListFilter[i],'id')!='') {
            greavesStatusList.push(this.state.greavesStatusListFilter[i]);
          }
        }
       
              this.setState({ greavesStatusList: greavesStatusList, currentPage: 1 });
          }
        }
        else if(this.props.greavesStatusListData.length>0)
        {
          this.setState({ greavesStatusList: [], currentPage: 1 });
        }
        }
        updatedGreavesStatusList=async(str)=>
        {
            let greavesStatusListAll=this.state.greavesStatusListAll;
            greavesStatusListAll=greavesStatusListAll.map((item)=>{
                if(item.id==str.id)
                {
                    item  =str;
                    return item;
                }
                return item;
            })
            let greavesStatusList=this.state.greavesStatusList;
            greavesStatusList=greavesStatusList.map((item)=>{
                if(item.id==str.id)
                {
                    item  =str;
                    return item;
                }
                return item;
            })
            let greavesStatusListFilter=this.state.greavesStatusListFilter;
            greavesStatusListFilter=greavesStatusListFilter.map((item)=>{
                if(item.id==str.id)
                {
                    item  =str;
                    return item;
                }
                return item;
            })
              this.setState({greavesStatusListAll:greavesStatusListAll,greavesStatusListFilter:greavesStatusListFilter,greavesStatusList:greavesStatusList,selectedGreavesStatus:str});
              this.props.greavesStatusListInfo(greavesStatusListAll);
            
        }  
        GreavesStatusDelete=async(str)=>
        {
            if(window.confirm('Do you want to delete selected Greaves Status?'))
            {
                this.setState({loader:true})
      
                let formData={
                  "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
                  "greavesStatusId": parseInt(str)
                }
                let response= await SettingApi.PostSettingList(formData,'/api/GreavesStatus/Delete');
                if(ArrayHelper.getValue(response,'isSuccess')==true)
                {
            let greavesStatusListAll=this.state.greavesStatusListAll;
            greavesStatusListAll=greavesStatusListAll.filter((item)=>item.id!=str)
            let greavesStatusListFilter=this.state.greavesStatusListAll;
            greavesStatusListFilter=greavesStatusListFilter.filter((item)=>item.id!=str)
         
              this.setState({loader:false,greavesStatusListAll:greavesStatusListAll,greavesStatusListFilter:greavesStatusListFilter});
              this.props.greavesStatusListInfo(greavesStatusListAll);
              this.props.history("/settings/greaves-status"); 
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
            let greavesStatusListAll=this.state.greavesStatusListAll;
            if(this.state.keyword.trim()!='')
            {
                let greavesStatusListFilter=  greavesStatusListAll.filter((item)=>{
                    if(item.name.search(new RegExp(this.state.keyword.trim(), "i")) != -1 && this.state.keyword.trim()!='')
                    {
                      return item;
                    }
                });
                this.setState({greavesStatusListFilter:greavesStatusListFilter,currentPage:1});
      setTimeout(()=>{
        this.setState({loader:false})
        this.props.history("/settings/greaves-status"); 
      },10)
            }
            else
            {
              this.clearData();  
            }
        }
        clearData()
        {
            this.setState({loader:true,keyword:'',currentPage:1,greavesStatusListFilter:this.state.greavesStatusListAll})
            setTimeout(()=>{              
             this.setState({loader:false})
             this.props.history("/settings/greaves-status"); 
           },10)
        }
        handleChange = (e) => {
            const name = e.target.name;
            let  value = e.target.value;        
            this.setState({ ...this.state, [name]: value });
            } 

    render(){
        const { greavesStatusListFilter, greavesStatusListAll } = this.state;
        const dataToExport = greavesStatusListFilter.length > 0 ? greavesStatusListFilter : greavesStatusListAll;
        return(
          
            <React.Fragment>
                 <LoaderComponent loader={this.state.loader}/>
        <div className="tab-pane fade show active" id="AgencyType-tab-pane" role="tabpanel" aria-labelledby="AgencyType-tab" tabIndex="0">
                    <div className="p-4">
                    <div className="row mb-3">
                        <div className="col-md-2">
                    <br/>
                    <h5 className="">Greaves Status</h5>
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
                  <button data-bs-toggle="modal" data-bs-target="#greavesStatusAdd" className="btn btn-outlined me-1">
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
                               {(this.state.greavesStatusList.length>0)?<table className="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th>Sr. No</th>
                                            <th>Name</th>                                           
                                            <th colSpan="2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.greavesStatusList.map((item,key)=>{
                                            return( <tr key={`actionType-${key}`}>
                                                {/* <td>{key+1}</td> */}
                                                <td>{((this.state.currentPage -1)*this.state.perPage) + key+1}</td>

                                                <td>{ArrayHelper.getValue(item,'name')}</td>                                                
                                                <td>
                                                    <i data-bs-toggle="modal" data-bs-target="#greavesStatusUpdate" onClick={()=>{this.setState({selectedGreavesStatus:item})}}  className="fa fa-edit btn"  data-bs-placement="top" title="Edit"></i>
                                                </td>                                               
                                                <td>
                                                    <i onClick={()=>this.GreavesStatusDelete(ArrayHelper.getValue(item,'id'))} className="fa fa-trash btn" data-bs-toggle="tooltip" data-bs-placement="top" title="Trash"></i>
                                                </td>
                                            </tr>)
                                        })}
                                    </tbody>
                                </table>:
                                <p>No Record Found</p>}
                                {(this.state.greavesStatusListFilter.length > this.state.perPage) ?
                    <PaginationComponent
                        total={this.state.greavesStatusListFilter.length}
                        pageSize={this.state.perPage}
                        currentPage={this.state.currentPage} /> : ''
            }
                            </div>
                        </div>

                    </div>
                </div>
                <GreavesStatusAddComponent getGreavesStatusList={()=>this.getGreavesStatusList()}/>
                <GreavesStatusUpdateComponent updatedGreavesStatusList={(str)=>this.updatedGreavesStatusList(str)} selectedGreavesStatus={this.state.selectedGreavesStatus}/>
            </React.Fragment>
        )
    }
}  



const mapStateToProps = state => {
    return {
        greavesStatusListData : state.settingsData.greavesStatusList,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        greavesStatusListInfo:(data)=>dispatch({type: actionTypesUser.GREAVES_STATUS_LIST,payload:data}),
       
    }
};

export default  connect(mapStateToProps, mapDispatchToProps)(ClientStatusComponent);