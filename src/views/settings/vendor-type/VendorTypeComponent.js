import React from "react";
import {connect} from 'react-redux';
import * as actionTypesUser from "../../../store/action/settings.action";
import VenderTypeAddComponent from './VenderTypeAddComponent';
import VenderTypeUpdateComponent from './VenderTypeUpdateComponent';
import SettingApi from "../../../api/Setting.api";
import {ArrayHelper} from "../../../helpers/arrayhelper";
import PaginationComponent from "../../../components/PaginationComponent";
import {USER_ID} from '../../../helpers/constants';
import LoaderComponent from "../../../components/LoaderComponent";
import * as XLSX from 'xlsx';
class VendorTypeComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loader:false,vendorTypeListAll:[],vendorTypeListFilter:[],vendorTypeList:[],selectedVendorType:{},perPage:8,currentPage:1,keyword:''};
    }
    componentDidMount()
    {
     
     let vendorTypeListData=this.props.vendorTypeListData;
     if(vendorTypeListData.length>0)
     {
        let vendorTypeList=[];
        for (let i = 0; i < this.state.perPage; i++) {
            if (ArrayHelper.getValue(vendorTypeListData[i],'id')!='') {
                vendorTypeList.push(vendorTypeListData[i]);
            }
        }
        
        this.setState({vendorTypeListAll:vendorTypeListData,vendorTypeListFilter:vendorTypeListData,vendorTypeList:vendorTypeList});
     }
     else
     {
      this.getVendorTypeList()
     }
     
    }
    getVendorTypeList=async()=>
    {
        this.setState({loader:true});
      let response= await SettingApi.GetSettingList('/api/VendorType/List');
        if(ArrayHelper.getValue(response,'isSuccess')== true)
        {
            
          let vendorTypeList = [];
         
          for (let i = 0; i < this.state.perPage; i++) {
              if (ArrayHelper.getValue(ArrayHelper.getValue(response,'vendorTypes')[i],'id')!='') {
                vendorTypeList.push(ArrayHelper.getValue(response,'vendorTypes')[i]);
              }
          }
          
          this.setState({loader:false,vendorTypeListAll:ArrayHelper.getValue(response,'vendorTypes'),vendorTypeListFilter:ArrayHelper.getValue(response,'vendorTypes'),vendorTypeList:vendorTypeList});
          this.props.vendorTypeListInfo(ArrayHelper.getValue(response,'vendorTypes'));
        }
        else
        {
            this.setState({loader:false});  
        }
    }
    componentWillReceiveProps(nextProps) {
        if(this.state.vendorTypeListFilter.length>0)
        {
         const location = nextProps.params;
          if (location.page !== undefined && location.page !== this.state.currentPage) {
        
            let vendorTypeList = [];
            let numRecord=0;
            let i=0;        
              i = (location.page - 1) * this.state.perPage;
              numRecord=location.page * this.state.perPage;      
          
            for (i; i < numRecord ; i++) {
          if (ArrayHelper.getValue(this.state.vendorTypeListFilter[i],'id')!='') {
            vendorTypeList.push(this.state.vendorTypeListFilter[i]);
          }
        }
              this.setState({ currentPage: parseInt(location.page), vendorTypeList: vendorTypeList });
          } else {
              
            let vendorTypeList = [];
          
            for (let i=0; i < this.state.perPage; i++) {
          if (ArrayHelper.getValue(this.state.vendorTypeListFilter[i],'id')!='') {
            vendorTypeList.push(this.state.vendorTypeListFilter[i]);
          }
        }
       
              this.setState({ vendorTypeList: vendorTypeList, currentPage: 1 });
          }
        }
        else if(this.props.vendorTypeListData.length>0)
        {
          this.setState({ vendorTypeList: [], currentPage: 1 });
        }
        }
        updatedVendorypeList=async(str)=>
        {
            let vendorTypeListAll=this.state.vendorTypeListAll;
            vendorTypeListAll=vendorTypeListAll.map((item)=>{
                if(item.id==str.id)
                {
                    item  =str;
                    return item;
                }
                return item;
            })
            let vendorTypeList=this.state.vendorTypeList;
            vendorTypeList=vendorTypeList.map((item)=>{
                if(item.id==str.id)
                {
                    item  =str;
                    return item;
                }
                return item;
            })
            let vendorTypeListFilter=this.state.vendorTypeListFilter;
            vendorTypeListFilter=vendorTypeListFilter.map((item)=>{
                if(item.id==str.id)
                {
                    item  =str;
                    return item;
                }
                return item;
            })
              this.setState({vendorTypeListAll:vendorTypeListAll,vendorTypeListFilter:vendorTypeListFilter,vendorTypeList:vendorTypeList,selectedVendorType:str});
              this.props.vendorTypeListInfo(vendorTypeListAll);
            
        }  
        VendorTypeDelete=async(str)=>
        {
            if(window.confirm('Do you want to delete selected Vendor Type?'))
            {
                this.setState({loader:true})
      
                let formData={
                  "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
                  "vendorTypeId": parseInt(str)
                }
                let response= await SettingApi.PostSettingList(formData,'/api/VendorType/Delete');
                if(ArrayHelper.getValue(response,'isSuccess')==true)
                {
            let vendorTypeListAll=this.state.vendorTypeListAll;
            vendorTypeListAll=vendorTypeListAll.filter((item)=>item.id!=str)
            let vendorTypeListFilter=this.state.vendorTypeListFilter;
            vendorTypeListFilter=vendorTypeListFilter.filter((item)=>item.id!=str)
         
              this.setState({loader:false,vendorTypeListAll:vendorTypeListAll,vendorTypeListFilter:vendorTypeListFilter});
              this.props.vendorTypeListInfo(vendorTypeListAll);
              this.props.history("/settings/vendor-type"); 
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
            let vendorTypeListAll=this.state.vendorTypeListAll;
            if(this.state.keyword.trim()!='')
            {
                let vendorTypeListFilter=  vendorTypeListAll.filter((item)=>{
                    if(item.name.search(new RegExp(this.state.keyword.trim(), "i")) != -1 && this.state.keyword.trim()!='')
                    {
                      return item;
                    }
                });
                this.setState({vendorTypeListFilter:vendorTypeListFilter,currentPage:1});
      setTimeout(()=>{
        this.setState({loader:false})
        this.props.history("/settings/vendor-type"); 
      },10)
            }
            else
            {
              this.clearData();  
            }
        }
        clearData()
        {
            this.setState({loader:true,keyword:'',currentPage:1,vendorTypeListFilter:this.state.vendorTypeListAll})
            setTimeout(()=>{              
             this.setState({loader:false})
             this.props.history("/settings/vendor-type"); 
           },10)
        }
        handleChange = (e) => {
            const name = e.target.name;
            let  value = e.target.value;        
            this.setState({ ...this.state, [name]: value });
            }

            downloadExcel = () => {
                const { vendorTypeListFilter, vendorTypeListAll } = this.state;
                const dataToExport = vendorTypeListFilter.length > 0 ? vendorTypeListFilter : vendorTypeListAll;
            
                if (dataToExport.length === 0) {
                    alert("No data available to export!");
                    return;
                }

                
            
                const columns = [];
                const formattedData = dataToExport.map((city, index) => {
                    let calculationTypeName = 'None'; 
                    if (city.calculationType === 1) {
                        calculationTypeName = 'PerDay';
                    } else if (city.calculationType === 2) {
                        calculationTypeName = 'PerNight';
                    }
                    const formattedRow = {
                    SrNo: index + 1,
                    Name: city.name,
                    Calculation_Type: calculationTypeName
                    };
            
                   
                    Object.keys(formattedRow).forEach((key) => {
                        if (
                            formattedRow[key] !== undefined &&
                            formattedRow[key] !== null &&
                            formattedRow[key] !== ''
                        ) {
                            if (!columns.includes(key)) {  
                                columns.push(key);
                            }
                        }
                    });
            
                    return formattedRow;
                });
            
                const finalData = formattedData.filter((row) => {
                    return columns.some((column) => row[column] !== undefined && row[column] !== null && row[column] !== '');
                });
            
                if (finalData.length === 0) {
                    alert("No valid data available to export!");
                    return;
                }
            
                const columnWidths = columns.map((column) => {
                    let maxLength = column.length;
                    console.log(maxLength,"maxLengthmaxLength");
                    
                    finalData.forEach((row) => {
                        const cellValue = row[column] ? row[column].toString() : '';
                        maxLength = Math.max(maxLength, cellValue.length);
                    });
                    return { wpx: Math.max(maxLength * 10, 60) }; 
                });
            
    
                const ws = XLSX.utils.json_to_sheet(finalData, { header: columns });
            
      
                ws['!cols'] = columnWidths;
            
    
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Agency Types");
            
    
                XLSX.writeFile(wb, "Vendor_Type.xlsx");
            };
            
    render(){
      
        return(
          
            <React.Fragment>
                 <LoaderComponent loader={this.state.loader}/>
        <div className="tab-pane fade show active" id="AgencyType-tab-pane" role="tabpanel" aria-labelledby="AgencyType-tab" tabIndex="0">
                    <div className="p-4">
                    <div className="row mb-3">
                        <div className="col-md-2">
                    <br/>
                    <h5 className="">Vendor Type</h5>
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
                        <button data-bs-toggle="modal" data-bs-target="#vendorTypeAdd" className="btn btn-outlined"> <i className="fa-sharp fa-solid fa-plus"></i> Add</button>
                    </div>
                    <div className="d-flex justify-content-start mb-3">
    <button onClick={this.downloadExcel} type="button" className="btn btn-outlined ms-2">
        <i className="fa-sharp fa-solid fa-download"></i> Download Excel
    </button>
</div> */}

<div className="d-flex align-items-center justify-content-end">
                  <a onClick={() => this.reloadWindow()}><img style={{ 'height': '40px' }} src="/images/reload.png" /></a>
                  <button data-bs-toggle="modal" data-bs-target="#vendorTypeAdd" className="btn btn-outlined me-1">
                    <i className="fa-sharp fa-solid fa-plus"></i> Add
                  </button>
                  <button onClick={this.downloadExcel} type="button" className="btn btn-outlined ms-1">
                    <i className="fa-sharp fa-solid fa-download"></i> Download Excel
                  </button>
                </div>

                </div>
                      
                        <div className="borderless-box">
                            <div className="table-responsive">
                               {(this.state.vendorTypeList.length>0)?<table className="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th>Sr. No</th>
                                            <th>Name</th>  
                                            <th>Calculation Type</th>                                           
                                            <th colSpan="2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.vendorTypeList.map((item,key)=>{
                                            let calculationTypeName='None';
                                            if(ArrayHelper.getValue(item,'calculationType')==1)
                                            {
                                                calculationTypeName='PerDay';
                                            }
                                            else if(ArrayHelper.getValue(item,'calculationType')==2)
                                            {
                                                calculationTypeName='PerNeight';
                                            }
                                            return( <tr key={`actionType-${key}`}>
                                                {/* <td>{key+1}</td> */}
                                                <td>{((this.state.currentPage -1)*this.state.perPage) + key+1}</td>

                                                <td>{ArrayHelper.getValue(item,'name')}</td> 
                                                <td>{calculationTypeName}</td>                                                
                                                <td>
                                                    <i data-bs-toggle="modal" data-bs-target="#vendorTypeUpdate" onClick={()=>{this.setState({selectedVendorType:item})}}  className="fa fa-edit btn"  data-bs-placement="top" title="Edit"></i>
                                                </td>                                               
                                                <td>
                                                    <i onClick={()=>this.VendorTypeDelete(ArrayHelper.getValue(item,'id'))} className="fa fa-trash btn" data-bs-toggle="tooltip" data-bs-placement="top" title="Trash"></i>
                                                </td>
                                            </tr>)
                                        })}
                                    </tbody>
                                </table>:
                                <p>No Record Found</p>}
                                {(this.state.vendorTypeListAll.length > this.state.perPage) ?
                    <PaginationComponent
                        total={this.state.vendorTypeListAll.length}
                        pageSize={this.state.perPage}
                        currentPage={this.state.currentPage} /> : ''
            }
                            </div>
                        </div>

                    </div>
                </div>
                <VenderTypeAddComponent getVendorTypeList={()=>this.getVendorTypeList()}/>
                <VenderTypeUpdateComponent updatedVendorypeList={(str)=>this.updatedVendorypeList(str)} selectedVendorType={this.state.selectedVendorType}/>
            </React.Fragment>
        )
    }
}  



const mapStateToProps = state => {
    return {
        vendorTypeListData : state.settingsData.vendorTypeList,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        vendorTypeListInfo:(data)=>dispatch({type: actionTypesUser.VENDOR_TYPE_LIST,payload:data}),
       
    }
};

export default  connect(mapStateToProps, mapDispatchToProps)(VendorTypeComponent);