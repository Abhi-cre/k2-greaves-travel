import React from "react";
import {connect} from 'react-redux';
import * as AppSettingsUser from "../../../store/action/settings.action";
import AppSettingAddComponent from './AppSettingAddComponent';
import AppSettingUpdateComponent from './AppSettingUpdateComponent';
import SettingApi from "../../../api/Setting.api";
import {ArrayHelper} from "../../../helpers/arrayhelper";
import PaginationComponent from "../../../components/PaginationComponent";
import {USER_ID} from '../../../helpers/constants';
import LoaderComponent from "../../../components/LoaderComponent";
class AppSettingComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loader:false,appSettingListAll:[],appSettingListFilter:[],appSettingList:[],selectedAppSetting:{},perPage:20,currentPage:1,keyword:''};
    }
    componentDidMount()
    {
     
     let appSettingListData=this.props.appSettingListData;
     if(appSettingListData.length>0)
     {
        let appSettingList=[];
        for (let i = 0; i < this.state.perPage; i++) {
            if (ArrayHelper.getValue(appSettingListData[i],'id')!='') {
                appSettingList.push(appSettingListData[i]);
            }
        }
        
        this.setState({appSettingListAll:appSettingListData,appSettingListFilter:appSettingListData,appSettingList:appSettingList});
     }
     else
     {
      this.getappSettingList()
     }
     
    }
    getappSettingList=async()=>
    {
        this.setState({loader:true});
      let response= await SettingApi.GetSettingList('/api/AppSetting/List');
        if(ArrayHelper.getValue(response,'isSuccess')== true)
        {
            
          let appSettingList = [];
         
          for (let i = 0; i < this.state.perPage; i++) {
              if (ArrayHelper.getValue(ArrayHelper.getValue(response,'appSettings')[i],'id')!='') {
                appSettingList.push(ArrayHelper.getValue(response,'appSettings')[i]);
              }
          }
          
          this.setState({loader:false,appSettingListAll:ArrayHelper.getValue(response,'appSettings'),appSettingListFilter:ArrayHelper.getValue(response,'appSettings'),appSettingList:appSettingList});
          this.props.appSettingListInfo(ArrayHelper.getValue(response,'appSettings'));
        }
        else
        {
            this.setState({loader:false});  
        }
    }
    componentWillReceiveProps(nextProps) {
        if(this.state.appSettingListFilter.length>0)
        {
         const location = nextProps.params;
          if (location.page !== undefined && location.page !== this.state.currentPage) {
        
            let appSettingList = [];
            let numRecord=0;
            let i=0;        
              i = (location.page - 1) * this.state.perPage;
              numRecord=location.page * this.state.perPage;      
          
            for (i; i < numRecord ; i++) {
          if (ArrayHelper.getValue(this.state.appSettingListFilter[i],'id')!='') {
            appSettingList.push(this.state.appSettingListFilter[i]);
          }
        }
              this.setState({ currentPage: parseInt(location.page), appSettingList: appSettingList });
          } else {
              
            let appSettingList = [];
          
            for (let i=0; i < this.state.perPage; i++) {
          if (ArrayHelper.getValue(this.state.appSettingListFilter[i],'id')!='') {
            appSettingList.push(this.state.appSettingListFilter[i]);
          }
        }
       
              this.setState({ appSettingList: appSettingList, currentPage: 1 });
          }
        }
        else if(this.props.appSettingListData.length>0)
        {
          this.setState({ appSettingList: [], currentPage: 1 });
        }
        }
        updatedappSettingList=async(str)=>
        {
            let appSettingListAll=this.state.appSettingListAll;
            appSettingListAll=appSettingListAll.map((item)=>{
                if(item.id==str.id)
                {
                    item  =str;
                    return item;
                }
                return item;
            })
            let appSettingList=this.state.appSettingList;
            appSettingList=appSettingList.map((item)=>{
                if(item.id==str.id)
                {
                    item  =str;
                    return item;
                }
                return item;
            })
            let appSettingListFilter=this.state.appSettingListFilter;
            appSettingListFilter=appSettingListFilter.map((item)=>{
                if(item.id==str.id)
                {
                    item  =str;
                    return item;
                }
                return item;
            })
              this.setState({appSettingListAll:appSettingListAll,appSettingListFilter:appSettingListFilter,appSettingList:appSettingList,selectedAppSetting:str});
              this.props.appSettingListInfo(appSettingListAll);
            
        }  
        AppSettingDelete=async(str)=>
        {
            if(window.confirm('Do you want to delete selected App Setting?'))
            {
                this.setState({loader:true})
      
                let formData={
                  "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
                  "AppSettingId": parseInt(str)
                }
                let response= await SettingApi.PostSettingList(formData,'/api/AppSetting/Delete');
                if(ArrayHelper.getValue(response,'isSuccess')==true)
                {
            let appSettingListAll=this.state.appSettingListAll;
            appSettingListAll=appSettingListAll.filter((item)=>item.id!=str)
            let appSettingListFilter=this.state.appSettingListFilter;
            appSettingListFilter=appSettingListFilter.filter((item)=>item.id!=str)
         
              this.setState({loader:false,appSettingListAll:appSettingListAll,appSettingListFilter:appSettingListFilter});
              this.props.appSettingListInfo(appSettingListAll);
              this.props.history("/settings/app-setting"); 
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
            let appSettingListAll=this.state.appSettingListAll;
            if(this.state.keyword.trim()!='')
            {
                let appSettingListFilter=  appSettingListAll.filter((item)=>{
                    if(item.settingName.search(new RegExp(this.state.keyword.trim(), "i")) != -1 && this.state.keyword.trim()!='')
                    {
                      return item;
                    }
                });
                this.setState({appSettingListFilter:appSettingListFilter,currentPage:1});
      setTimeout(()=>{
        this.setState({loader:false})
        this.props.history("/settings/app-setting"); 
      },10)
            }
            else
            {
              this.clearData();  
            }
        }
        clearData()
        {
            this.setState({loader:true,keyword:'',currentPage:1,appSettingListFilter:this.state.appSettingListAll})
            setTimeout(()=>{              
             this.setState({loader:false})
             this.props.history("/settings/app-setting"); 
           },10)
        }
        handleChange = (e) => {
            const name = e.target.name;
            let  value = e.target.value;        
            this.setState({ ...this.state, [name]: value });
            }   
    render(){
      
        return(
          
            <React.Fragment>
                  <LoaderComponent loader={this.state.loader}/>
        <div className="tab-pane fade show active" id="AgencyType-tab-pane" role="tabpanel" aria-labelledby="AgencyType-tab" tabIndex="0">
                    <div className="p-4">
                    <div className="row mb-3">
                        <div className="col-md-2">
                    <br/>
                    <h5 className="">App Setting</h5>
                    </div>
                    <div className="col-md-8">
                        <div className="row g-3 align-items-center">
                            <div className="col-sm-3">
                                    <label>	Setting Name </label>
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
                    <div className="col-md-2 text-end">
                    <br/>
                    <a  onClick={()=>this.reloadWindow()}><img style={{'height': '40px'}} src="/images/reload.png"/></a>     <button data-bs-toggle="modal" data-bs-target="#AppSettingAdd" className="btn btn-outlined"> <i className="fa-sharp fa-solid fa-plus"></i> Add </button>
                    </div>
                </div>
                       
                        <div className="borderless-box">
                            <div className="table-responsive">
                               {(this.state.appSettingList.length>0)?<table className="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th>Sr. No</th>
                                            <th>Setting Name</th>
                                            <th>Setting Value</th>                                           
                                            <th colSpan="2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.appSettingList.map((item,key)=>{
                                            return( <tr key={`AppSetting-${key}`}>
                                                <td>{key+1}</td>
                                                <td>{ArrayHelper.getValue(item,'settingName')}</td>
                                                <td>{ArrayHelper.getValue(item,'settingValue')}</td>                                                
                                                <td>
                                                    <i data-bs-toggle="modal" data-bs-target="#AppSettingUpdate" onClick={()=>{this.setState({selectedAppSetting:item})}}  className="fa fa-edit btn"  data-bs-placement="top" title="Edit"></i>
                                                </td>                                               
                                                <td>
                                                    <i onClick={()=>this.AppSettingDelete(ArrayHelper.getValue(item,'id'))} className="fa fa-trash btn" data-bs-toggle="tooltip" data-bs-placement="top" title="Trash"></i>
                                                </td>
                                            </tr>)
                                        })}
                                    </tbody>
                                </table>:
                                <p>No Record Found</p>}
                                {(this.state.appSettingListFilter.length > this.state.perPage) ?
                    <PaginationComponent
                        total={this.state.appSettingListFilter.length}
                        pageSize={this.state.perPage}
                        currentPage={this.state.currentPage} /> : ''
            }
                            </div>
                        </div>

                    </div>
                </div>
                <AppSettingAddComponent getappSettingList={()=>this.getappSettingList()}/>
                <AppSettingUpdateComponent updatedappSettingList={(str)=>this.updatedappSettingList(str)} selectedAppSetting={this.state.selectedAppSetting}/>
            </React.Fragment>
        )
    }
}  



const mapStateToProps = state => {
    return {
        appSettingListData : state.settingsData.appSettingList,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        appSettingListInfo:(data)=>dispatch({type: AppSettingsUser.APP_SETTING_LIST,payload:data}),
       
    }
};

export default  connect(mapStateToProps, mapDispatchToProps)(AppSettingComponent);