import React from "react";
import {connect} from 'react-redux';
import * as actionTypesUser from "../../../store/action/settings.action";
import CityAddComponent from './CityAddComponent';
import CityUpdateComponent from './CityUpdateComponent';
import SettingApi from "../../../api/Setting.api";
import {ArrayHelper} from "../../../helpers/arrayhelper";
import PaginationComponent from "../../../components/PaginationComponent";
import {USER_ID} from '../../../helpers/constants';
import LoaderComponent from "../../../components/LoaderComponent";
import ExcelDownloadButton from "../../../components/ExcelDownloadButton";
class CityComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loader:false,stateList:[],cityListAll:[],cityListFilter:[],cityList:[],selectedCity:{},perPage:8,currentPage:1,keyword:'', countryList :[]};
    }
    componentDidMount()
    {
      
     let cityListData=this.props.cityListData;
     if(cityListData.length>0)
     {
        let cityList=[];
        for (let i = 0; i < this.state.perPage; i++) {
            if (ArrayHelper.getValue(cityListData[i],'cityId')!='') {
                cityList.push(cityListData[i]);
            }
        }
        
        this.setState({cityListAll:cityListData,cityListFilter:cityListData,cityList:cityList});
        
     }
     else
     {
      this.getCityList()
     }
     let stateListData=this.props.stateListData;
        if(stateListData.length>0)
        {
           this.setState({stateList:stateListData})
        }
        else
        {
           this.getStateList()
        }

        let countryListData=this.props.countryListData;
        if(countryListData.length>0)
        {
           this.setState({countryList:countryListData})
        }
        else
        {
           this.getCountryList()
        }
    }

    getCountryList=async()=>{
      this.setState({loader:true});
      let responseSate= await SettingApi.GetSettingList('/api/City/CountryList');
        if(ArrayHelper.getValue(responseSate,'isSuccess')== true)
        {
          this.setState({loader:false,countryList:ArrayHelper.getValue(responseSate,'countries')})
          this.props.countryListInfo(ArrayHelper.getValue(responseSate,'countries'));
        }
        else
        {
          this.setState({loader:false})
        }
    }
    getStateList=async()=>
    {
        this.setState({loader:true});
        let responseSate= await SettingApi.GetSettingList('/api/State/List');
          if(ArrayHelper.getValue(responseSate,'isSuccess')== true)
          {
            this.setState({loader:false,stateList:ArrayHelper.getValue(responseSate,'states')})
            this.props.stateListInfo(ArrayHelper.getValue(responseSate,'states'));
          }
          else
          {
            this.setState({loader:false})
          }
    }
    getCityList=async()=>
    {
       
        this.setState({loader:true});
      let response= await SettingApi.GetSettingList('/api/City/List');
        if(ArrayHelper.getValue(response,'isSuccess')== true)
        {
            
          let cityList = [];
         
          for (let i = 0; i < this.state.perPage; i++) {
              if (ArrayHelper.getValue(ArrayHelper.getValue(response,'cities')[i],'cityId')!='') {
                cityList.push(ArrayHelper.getValue(response,'cities')[i]);
              }
          }
          this.setState({loader:false,cityListAll:ArrayHelper.getValue(response,'cities'),cityListFilter:ArrayHelper.getValue(response,'cities'),cityList:cityList});
        
          setTimeout(()=>{
            this.props.cityListInfo(ArrayHelper.getValue(response,'cities'));
          },10)
        }
        else
        {
            this.setState({loader:false});  
        }

       
    }
    componentWillReceiveProps(nextProps) {
        if(this.state.cityListFilter.length>0)
        {
         const location = nextProps.params;
          if (location.page !== undefined && location.page !== this.state.currentPage) {
        
            let cityList = [];
            let numRecord=0;
            let i=0;        
              i = (location.page - 1) * this.state.perPage;
              numRecord=location.page * this.state.perPage;      
          
            for (i; i < numRecord ; i++) {
          if (ArrayHelper.getValue(this.state.cityListFilter[i],'cityId')!='') {
            cityList.push(this.state.cityListFilter[i]);
          }
        }
              this.setState({ currentPage: parseInt(location.page), cityList: cityList });
          } else {
              
            let cityList = [];
          
            for (let i=0; i < this.state.perPage; i++) {
          if (ArrayHelper.getValue(this.state.cityListFilter[i],'cityId')!='') {
            cityList.push(this.state.cityListFilter[i]);
          }
        }
       
              this.setState({ cityList: cityList, currentPage: 1 });
          }
        }
        else if(this.props.cityListData.length>0)
        {
          this.setState({ cityList: [], currentPage: 1 });
        }
        }
        updatedCityList=async(str)=>
        {
          let cityListAll=this.state.cityListAll;
            cityListAll=cityListAll.map((item)=>{
                if(item.cityId==str.cityId)
                {
                    item  =str;
                    return item;
                }
                if(item.stateId == str.stateId)
                {
                  item =str;
                  return item
                }
                
                return item;
            })
            let cityList=this.state.cityList;
            
            cityList=cityList.map((item)=>{
                if(item.cityId==str.cityId)
                {
                    item  =str;
                    return item;
                }
                return item;
            })
            let cityListFilter=this.state.cityListFilter;
            cityListFilter=cityListFilter.map((item)=>{
                if(item.cityId==str.cityId)
                {
                    item  =str;
                    return item;
                }
                return item;
            })
              this.setState({cityListAll:cityListAll,cityListFilter:cityListFilter,cityList:cityList,selectedCity:str});
              setTimeout(() => {
                
                this.props.cityListInfo(cityListAll);
              }, 10);
            
        }  
        cityDelete=async(str)=>
        {
            if(window.confirm('Do you want to delete selected City?'))
            {
                this.setState({loader:true})
      
                let formData={
                  "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
                  "cityId": parseInt(str)
                }
                let response= await SettingApi.PostSettingList(formData,'/api/City/Delete');
                if(ArrayHelper.getValue(response,'isSuccess')==true)
                {
            let cityListAll=this.state.cityListAll;
            cityListAll=cityListAll.filter((item)=>item.cityId!=str)
            let cityListFilter=this.state.cityListFilter;
            cityListFilter=cityListFilter.filter((item)=>item.cityId!=str)

              this.setState({loader:false,cityListAll:cityListAll,cityListFilter:cityListFilter});
              setTimeout(() => {
                
                this.props.cityListInfo(cityListAll);
              }, 10);
              this.props.history("/settings/city"); 
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
            let cityListAll=this.state.cityListAll;
            if(this.state.keyword.trim()!='')
            {
                let cityListFilter=  cityListAll.filter((item)=>{
                    if(item.cityName.search(new RegExp(this.state.keyword.trim(), "i")) != -1 && this.state.keyword.trim()!='' )
                    {
                      return item;
                    }
                    if(item.stateName.search(new RegExp(this.state.keyword.trim(), "i")) != -1 && this.state.keyword.trim()!='' )
                    {
                      return item;
                    }
                    if(item.countryName.search(new RegExp(this.state.keyword.trim() , "i")) != -1 && this.state.keyword.trim() !=''){
                      return item;
                    }
                });
                this.setState({cityListFilter:cityListFilter,currentPage:1});
      setTimeout(()=>{
        this.setState({loader:false})
        this.props.history("/settings/city"); 
      },10)
            }
            else
            {
              this.clearData();  
            }
        }
        clearData()
        {
            this.setState({loader:true,keyword:'',currentPage:1,cityListFilter:this.state.cityListAll})
            setTimeout(()=>{              
             this.setState({loader:false})
             this.props.history("/settings/city"); 
           },10)
        }
        handleChange = (e) => {
            const name = e.target.name;
            let  value = e.target.value;        
            this.setState({ ...this.state, [name]: value });
            }

    render(){
      const { cityListFilter, cityListAll } = this.state;
      const dataToExport = cityListFilter.length > 0 ? cityListFilter : cityListAll;
        return(
          
            <React.Fragment>
                 <LoaderComponent loader={this.state.loader}/>
        <div className="tab-pane fade show active" id="AgencyType-tab-pane" role="tabpanel" aria-labelledby="AgencyType-tab" tabIndex="0">
                    <div className="p-4">
                    <div className="row mb-3">
                        <div className="col-md-2">
                    <br/>
                    <h5 className="">City</h5>
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
                    {/* <div className="col-md-2 text-end">
                    <br/>
                    <a  onClick={()=>this.reloadWindow()}><img style={{'height': '40px'}} src="/images/reload.png"/></a>     
                     <button data-bs-toggle="modal" data-bs-target="#cityAdd" className="btn btn-outlined"> <i className="fa-sharp fa-solid fa-plus"></i> Add</button>
                    </div>
                    <div className="d-flex justify-content-start mb-3">
    <button onClick={this.downloadExcel} type="button" className="btn btn-outlined ms-2">
        <i className="fa-sharp fa-solid fa-download"></i> Download Excel
    </button>
</div> */}

<div className="d-flex align-items-center justify-content-end">
                  <a onClick={() => this.reloadWindow()}><img style={{ 'height': '40px' }} src="/images/reload.png" /></a>
                  <button data-bs-toggle="modal" data-bs-target="#cityAdd" className="btn btn-outlined me-1">
                    <i className="fa-sharp fa-solid fa-plus"></i> Add
                  </button>
                  {/* <button onClick={this.downloadExcel} type="button" className="btn btn-outlined ms-1">
                    <i className="fa-sharp fa-solid fa-download"></i> Download Excel
                  </button> */}
                                                      <ExcelDownloadButton
  data={dataToExport}
  columns={['countryName','stateName','cityName']} 
  fileName="ActionTypes.xlsx"
  sheetName="Action Types"
/>
                </div>



                </div>
                        
                        <div className="borderless-box">
                            <div className="table-responsive">
                               {(this.state.cityList.length>0)?<table className="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th>Sr. No</th>
                                            <th>Country Name</th>
                                            <th>State Name</th>
                                            <th>City Name</th>                                           
                                            <th colSpan="2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.cityList.map((item,key)=>{
                                            return( <tr key={`actionType-${key}`}>
                                                {/* <td>{key+1}</td> */}
                                                <td>{((this.state.currentPage -1)*this.state.perPage) + key+1}</td>
                                                <td>{ArrayHelper.getValue(item , 'countryName')}</td>
                                                <td>{ArrayHelper.getValue(item,'stateName')}</td>
                                                <td>{ArrayHelper.getValue(item,'cityName')}</td>                                                
                                                <td>
                                                    <i data-bs-toggle="modal" data-bs-target="#cityUpdate" onClick={()=>{this.setState({selectedCity:item})}}  className="fa fa-edit btn"  data-bs-placement="top" title="Edit"></i>
                                                </td>                                               
                                                <td>
                                                    <i onClick={()=>this.cityDelete(ArrayHelper.getValue(item,'cityId'))} className="fa fa-trash btn" data-bs-toggle="tooltip" data-bs-placement="top" title="Trash"></i>
                                                </td>
                                            </tr>)
                                        })}
                                    </tbody>
                                </table>:
                                <p>No Record Found</p>}
                                {(this.state.cityListFilter.length > this.state.perPage) ?
                    <PaginationComponent
                        total={this.state.cityListFilter.length}
                        pageSize={this.state.perPage}
                        currentPage={this.state.currentPage} /> : ''
            }
                            </div>
                        </div>

                    </div>
                </div>
                <CityAddComponent getCityList={()=>this.getCityList()} cityListAll={this.state.cityListAll} stateList={this.state.stateList} countryList={this.state.countryList} selectedCity={this.state.selectedCity} />
                <CityUpdateComponent updatedCityList={(str)=>this.updatedCityList(str)} stateList={this.state.stateList} selectedCity={this.state.selectedCity} countryList={this.state.countryList} />
            </React.Fragment>
        )
    }
}  



const mapStateToProps = state => {
    return {
        cityListData : state.settingsData.cityList,
        stateListData : state.settingsData.stateList,
        countryListData : state.settingsData.countryList
    }
};

const mapDispatchToProps = dispatch => {
    return {
        cityListInfo:(data)=>dispatch({type: actionTypesUser.CITY_LIST,payload:data}),
        stateListInfo:(data)=>dispatch({type: actionTypesUser.STATE_LIST,payload:data}),
        countryListInfo:(data)=>dispatch({type: actionTypesUser.COUNTRY_LIST,payload:data}),

       
    }
};

export default  connect(mapStateToProps, mapDispatchToProps)(CityComponent);