import React from "react";
import {connect} from 'react-redux';
import * as actionTypesUser from "../../../store/action/settings.action";
import AirLineAddComponent from './AirLineAddComponent';
import AirLineUpdateComponent from './AirLineUpdateComponent';
import SettingApi from "../../../api/Setting.api";
import {ArrayHelper} from "../../../helpers/arrayhelper";
import PaginationComponent from "../../../components/PaginationComponent";
import {USER_ID} from '../../../helpers/constants';
import LoaderComponent from "../../../components/LoaderComponent";
import ExcelDownloadButton from "../../../components/ExcelDownloadButton";
class AirLineComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loader:false,airLineListAll:[],airLineListFilter:[],airLineList:[],selectedAirLine:{},perPage:8,currentPage:1,'code':'','name':''};
    }
    componentDidMount()
    {
     
     let airLineListData=this.props.airLineListData;
     if(airLineListData.length>0)
     {
        let airLineList=[];
        for (let i = 0; i < this.state.perPage; i++) {
            if (ArrayHelper.getValue(airLineListData[i],'id')!='') {
                airLineList.push(airLineListData[i]);
            }
        }
        
        this.setState({airLineListAll:airLineListData,airLineListFilter:airLineListData,airLineList:airLineList});
     }
     else
     {
      this.getAirLineList()
     }
     
    }
    getAirLineList=async()=>
    {
        this.setState({loader:true});
      let response= await SettingApi.GetSettingList('/api/AirLine/List');
        if(ArrayHelper.getValue(response,'isSuccess')== true)
        {
            
          let airLineList = [];
         
          for (let i = 0; i < this.state.perPage; i++) {
              if (ArrayHelper.getValue(ArrayHelper.getValue(response,'airLines')[i],'id')!='') {
                airLineList.push(ArrayHelper.getValue(response,'airLines')[i]);
              }
          }
          
          this.setState({loader:false,airLineListAll:ArrayHelper.getValue(response,'airLines'),airLineListFilter:ArrayHelper.getValue(response,'airLines'),airLineList:airLineList});
          this.props.airLineListInfo(ArrayHelper.getValue(response,'airLines'));
        }
        else
        {
            this.setState({loader:false});  
        }
    }
    componentWillReceiveProps(nextProps) {
        if(this.state.airLineListFilter.length>0)
        {
         const location = nextProps.params;
          if (location.page !== undefined && location.page !== this.state.currentPage) {
        
            let airLineList = [];
            let numRecord=0;
            let i=0;        
              i = (location.page - 1) * this.state.perPage;
              numRecord=location.page * this.state.perPage;      
          
            for (i; i < numRecord ; i++) {
          if (ArrayHelper.getValue(this.state.airLineListFilter[i],'id')!='') {
            airLineList.push(this.state.airLineListFilter[i]);
          }
        }
              this.setState({ currentPage: parseInt(location.page), airLineList: airLineList });
          } else {
              
            let airLineList = [];
          
            for (let i=0; i < this.state.perPage; i++) {
          if (ArrayHelper.getValue(this.state.airLineListFilter[i],'id')!='') {
            airLineList.push(this.state.airLineListFilter[i]);
          }
        }
       
              this.setState({ airLineList: airLineList, currentPage: 1 });
          }
        }
        else if(this.props.airLineListData.length>0)
        {
          this.setState({ airLineList: [], currentPage: 1 });
        }
        }
        updatedAirLineList=async(str)=>
        {
            let airLineListAll=this.state.airLineListAll;
            airLineListAll=airLineListAll.map((item)=>{
                if(item.id==str.id)
                {
                    item  =str;
                    return item;
                }
                return item;
            })
            let airLineList=this.state.airLineList;
            airLineList=airLineList.map((item)=>{
                if(item.id==str.id)
                {
                    item  =str;
                    return item;
                }
                return item;
            })
            let airLineListFilter=this.state.airLineListFilter;
            airLineListFilter=airLineListFilter.map((item)=>{
                if(item.id==str.id)
                {
                    item  =str;
                    return item;
                }
                return item;
            })
              this.setState({airLineListAll:airLineListAll,airLineListFilter:airLineListFilter,airLineList:airLineList,selectedAirLine:str});
              this.props.airLineListInfo(airLineListAll);
            
        }  
        AirLineDelete=async(str)=>
        {
            if(window.confirm('Do you want to delete selected Air Line?'))
            {
                this.setState({loader:true})
      
                let formData={
                  "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
                  "airLineId": parseInt(str)
                }
                let response= await SettingApi.PostSettingList(formData,'/api/AirLine/Delete');
                if(ArrayHelper.getValue(response,'isSuccess')==true)
                {
            let airLineListAll=this.state.airLineListAll;
            airLineListAll=airLineListAll.filter((item)=>item.id!=str)
            let airLineListFilter=this.state.airLineListFilter;
            airLineListFilter=airLineListFilter.filter((item)=>item.id!=str)
         
              this.setState({loader:false,airLineListAll:airLineListAll,airLineListFilter:airLineListFilter});
              this.props.airLineListInfo(airLineListAll);
              this.props.history("/settings/air-line"); 
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
            let airLineListAll=this.state.airLineListAll;
            
                let airLineListFilter=  airLineListAll.map((item)=>{
                    item.display=true;
                    if(item.name.search(new RegExp(this.state.name.trim(), "i")) == -1 && this.state.name.trim()!='')
                    {
                        item.display=false;
                    }
                    if(item.code.search(new RegExp(this.state.code.trim(), "i")) == -1 && this.state.code.trim()!='')
                    {
                        item.display=false;
                    }
                    return item;
                });
               
                let   airLineListFilter1=airLineListFilter.filter((item)=>item.display==true)
             
                this.setState({airLineListFilter:airLineListFilter1,currentPage:1});
      setTimeout(()=>{
        this.setState({loader:false})
        this.props.history("/settings/air-line"); 
      },10)
            
        }
        clearData()
        {
            this.setState({loader:true,name:'',code:'',currentPage:1,airLineListFilter:this.state.airLineListAll})
            setTimeout(()=>{              
             this.setState({loader:false})
             this.props.history("/settings/air-line"); 
           },10)
        }
        handleChange = (e) => {
            const name = e.target.name;
            let  value = e.target.value;        
            this.setState({ ...this.state, [name]: value });
            }

          
    render(){
        const { airLineListFilter, airLineListAll } = this.state;
        const dataToExport = airLineListFilter.length > 0 ? airLineListFilter : airLineListAll;
        return(
          
            <React.Fragment>
                  <LoaderComponent loader={this.state.loader}/>
        <div className="tab-pane fade show active" id="AgencyType-tab-pane" role="tabpanel" aria-labelledby="AgencyType-tab" tabIndex="0">
                    <div className="p-4">
                    <div className="row mb-3">
                        <div className="col-md-2">
                    <br/>
                    <h5 className="">Air Line</h5>
                    </div>
                    <div className="col-md-8">
                        <div className="row g-3 align-items-center">
                            <div className="col-sm-3">
                                    <label>Name </label>
                                <input type="text" name="name" value={this.state.name} onChange={this.handleChange} className="form-control"  placeholder="Name"/>
                            </div>
                            <div className="col-sm-3">
                                    <label>Code </label>
                                <input type="text" name="code" value={this.state.code} onChange={this.handleChange} className="form-control"  placeholder="Code"/>
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
                  <button data-bs-toggle="modal" data-bs-target="#airLineAdd" className="btn btn-outlined me-1">
                    <i className="fa-sharp fa-solid fa-plus"></i> Add
                  </button>
                                    <ExcelDownloadButton
  data={dataToExport}
  columns={['name','code']} 
  fileName="ActionTypes.xlsx"
  sheetName="Action Types"
/>
                </div>


                </div>
                        <div className="borderless-box">
                            <div className="table-responsive">
                               {(this.state.airLineList.length>0)?<table className="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th>Sr. No</th>
                                            <th>Name</th>
                                            <th>Code</th>                                             
                                            <th colSpan="2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.airLineList.map((item,key)=>{
                                            return( <tr key={`actionType-${key}`}>
                                                {/* <td>{key+1}</td> */}
                                                <td>{((this.state.currentPage -1)*this.state.perPage) + key+1}</td>

                                                <td>{ArrayHelper.getValue(item,'name')}</td>   
                                                <td>{ArrayHelper.getValue(item,'code')}</td>                                              
                                                <td>
                                                    <i data-bs-toggle="modal" data-bs-target="#airLineUpdate" onClick={()=>{this.setState({selectedAirLine:item})}}  className="fa fa-edit btn"  data-bs-placement="top" title="Edit"></i>
                                                </td>                                               
                                                <td>
                                                    <i onClick={()=>this.AirLineDelete(ArrayHelper.getValue(item,'id'))} className="fa fa-trash btn" data-bs-toggle="tooltip" data-bs-placement="top" title="Trash"></i>
                                                </td>
                                            </tr>)
                                        })}
                                    </tbody>
                                </table>:
                                <p>No Record Found</p>}
                                {(this.state.airLineListFilter.length > this.state.perPage) ?
                    <PaginationComponent
                        total={this.state.airLineListFilter.length}
                        pageSize={this.state.perPage}
                        currentPage={this.state.currentPage} /> : ''
            }
                            </div>
                        </div>

                    </div>
                </div>
                <AirLineAddComponent getAirLineList={()=>this.getAirLineList()}/>
                <AirLineUpdateComponent updatedAirLineList={(str)=>this.updatedAirLineList(str)} selectedAirLine={this.state.selectedAirLine}/>
            </React.Fragment>
        )
    }
}  



const mapStateToProps = state => {
    return {
        airLineListData : state.settingsData.airLineList,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        airLineListInfo:(data)=>dispatch({type: actionTypesUser.AIR_LINE_LIST,payload:data}),
       
    }
};

export default  connect(mapStateToProps, mapDispatchToProps)(AirLineComponent);