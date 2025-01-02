import React from "react";
import {connect} from 'react-redux';
import * as actionTypesUser from "../../../store/action/settings.action";
import SalesGuideAddComponent from './SalesGuideAddComponent';
import SalesGuideUpdateComponent from './SalesGuideUpdateComponent';
import SalesGuideViewComponent from './SalesGuideViewComponent';
import SettingApi from "../../../api/Setting.api";
import {ArrayHelper} from "../../../helpers/arrayhelper";
import PaginationComponent from "../../../components/PaginationComponent";
import {USER_ID} from '../../../helpers/constants';
import LoaderComponent from "../../../components/LoaderComponent";
import ExcelDownloadButton from "../../../components/ExcelDownloadButton";
class SalesGuideComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loader:false,salesGuideListAll:[],salesGuideListFilter:[],salesGuideList:[],selectedSalesGuide:{},perPage:20,currentPage:1,'salesCategoryName':'','name':''};
    }
    componentDidMount()
    {
     
     let salesGuideListData=this.props.salesGuideListData;
     if(salesGuideListData.length>0)
     {
        let salesGuideList=[];
        for (let i = 0; i < this.state.perPage; i++) {
            if (ArrayHelper.getValue(salesGuideListData[i],'id')!='') {
                salesGuideList.push(salesGuideListData[i]);
            }
        }
        
        this.setState({salesGuideListAll:salesGuideListData,salesGuideListFilter:salesGuideListData,salesGuideList:salesGuideList});
     }
     else
     {
      this.getSalesGuideList()
     }
     
    }
    getSalesGuideList=async()=>
    {
        this.setState({loader:true});
      let response= await SettingApi.GetSettingList('/api/SalesGuide/List');
        if(ArrayHelper.getValue(response,'isSuccess')== true)
        {
            
          let salesGuideList = [];
         
          for (let i = 0; i < this.state.perPage; i++) {
              if (ArrayHelper.getValue(ArrayHelper.getValue(response,'salesGuides')[i],'id')!='') {
                salesGuideList.push(ArrayHelper.getValue(response,'salesGuides')[i]);
              }
          }
          
          this.setState({loader:false,salesGuideListAll:ArrayHelper.getValue(response,'salesGuides'),salesGuideListFilter:ArrayHelper.getValue(response,'salesGuides'),salesGuideList:salesGuideList});
          setTimeout(()=>{
            this.props.salesGuideListInfo(ArrayHelper.getValue(response,'salesGuides'));
          },10)
        }
        else
        {
            this.setState({loader:false});  
        }
    }
    componentWillReceiveProps(nextProps) {
        if(this.state.salesGuideListFilter.length>0)
        {
         const location = nextProps.params;
          if (location.page !== undefined && location.page !== this.state.currentPage) {
        
            let salesGuideList = [];
            let numRecord=0;
            let i=0;        
              i = (location.page - 1) * this.state.perPage;
              numRecord=location.page * this.state.perPage;      
          
            for (i; i < numRecord ; i++) {
          if (ArrayHelper.getValue(this.state.salesGuideListFilter[i],'id')!='') {
            salesGuideList.push(this.state.salesGuideListFilter[i]);
          }
        }
              this.setState({ currentPage: parseInt(location.page), salesGuideList: salesGuideList });
          } else {
              
            let salesGuideList = [];
          
            for (let i=0; i < this.state.perPage; i++) {
          if (ArrayHelper.getValue(this.state.salesGuideListFilter[i],'id')!='') {
            salesGuideList.push(this.state.salesGuideListFilter[i]);
          }
        }
       
              this.setState({ salesGuideList: salesGuideList, currentPage: 1 });
          }
        }
        else if(this.props.salesGuideListData.length>0)
        {
          this.setState({ salesGuideList: [], currentPage: 1 });
        }
        }
        updatedSalesGuideList=async(str)=>
        {
            let salesGuideListAll=this.state.salesGuideListAll;
            salesGuideListAll=salesGuideListAll.map((item)=>{
                if(item.id==str.id)
                {
                    item  =str;
                    return item;
                }
                return item;
            })
            let salesGuideList=this.state.salesGuideList;
            salesGuideList=salesGuideList.map((item)=>{
                if(item.id==str.id)
                {
                    item  =str;
                    return item;
                }
                return item;
            })
            let salesGuideListFilter=this.state.salesGuideListFilter;
            salesGuideListFilter=salesGuideListFilter.map((item)=>{
                if(item.id==str.id)
                {
                    item  =str;
                    return item;
                }
                return item;
            })
              this.setState({salesGuideListAll:salesGuideListAll,salesGuideListFilter:salesGuideListFilter,salesGuideList:salesGuideList,selectedSalesGuide:str});
              setTimeout(() => {
                
                  this.props.salesGuideListInfo(salesGuideListAll);
              }, 10);
            
        }  
        SalesGuideDelete=async(str)=>
        {
            if(window.confirm('Do you want to delete selected Sales Guide?'))
            {
                this.setState({loader:true})
      
                let formData={
                  "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
                  "salesGuideId": parseInt(str)
                }
                let response= await SettingApi.PostSettingList(formData,'/api/SalesGuide/Delete');
                if(ArrayHelper.getValue(response,'isSuccess')==true)
                {
            let salesGuideListAll=this.state.salesGuideListAll;
            salesGuideListAll=salesGuideListAll.filter((item)=>item.id!=str)
            let salesGuideListFilter=this.state.salesGuideListFilter;
            salesGuideListFilter=salesGuideListFilter.filter((item)=>item.id!=str)
         
              this.setState({loader:false,salesGuideListAll:salesGuideListAll,salesGuideListFilter:salesGuideListFilter});
              setTimeout(() => {
                
                  this.props.salesGuideListInfo(salesGuideListAll);
              }, 10);
              this.props.history("/settings/sales-guide"); 
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
            let salesGuideListAll=this.state.salesGuideListAll;
            
                let salesGuideListFilter=  salesGuideListAll.map((item)=>{
                    item.display=true;
                    if(item.name.search(new RegExp(this.state.name.trim(), "i")) == -1 && this.state.name.trim()!='')
                    {
                        item.display=false;
                    }
                    if(item.salesCategoryName.search(new RegExp(this.state.salesCategoryName.trim(), "i")) == -1 && this.state.salesCategoryName.trim()!='')
                    {
                        item.display=false;
                    }
                    return item;
                });
               
                let   salesGuideListFilter1=salesGuideListFilter.filter((item)=>item.display==true)
             
                this.setState({salesGuideListFilter:salesGuideListFilter1,currentPage:1});
      setTimeout(()=>{
        this.setState({loader:false})
        this.props.history("/settings/sales-guide"); 
      },10)
            
        }
        clearData()
        {
            this.setState({loader:true,name:'',salesCategoryName:'',currentPage:1,salesGuideListFilter:this.state.salesGuideListAll})
            setTimeout(()=>{              
             this.setState({loader:false})
             this.props.history("/settings/sales-guide"); 
           },10)
        }
        handleChange = (e) => {
            const name = e.target.name;
            let  value = e.target.value;        
            this.setState({ ...this.state, [name]: value });
            }

            // downloadExcel = () => {
            //     const { salesGuideListAll } = this.state;
            
            //     if (salesGuideListAll.length === 0) {
            //         alert("No data available to export!");
            //         return;
            //     }
            //     const formattedData = salesGuideListAll.map((city, index) => ({
            //         SrNo: index + 1,
            //         Name: city.name,
            //         Sale_Category: city.salesCategoryName,
            //         Rating: city.rating,
            //         Position:city.position

            //     }));
            //     const ws = XLSX.utils.json_to_sheet(formattedData);
            //     const wb = XLSX.utils.book_new();
            //     XLSX.utils.book_append_sheet(wb, ws, "City Data");

            //     XLSX.writeFile(wb, "Sale_Guide.xlsx");
            // }
            // downloadExcel = () => {
            //     const { salesGuideListFilter, salesGuideListAll } = this.state;
            //     const dataToExport = salesGuideListFilter.length > 0 ? salesGuideListFilter : salesGuideListAll;
            
            //     if (dataToExport.length === 0) {
            //         alert("No data available to export!");
            //         return;
            //     }
            
            //     const columns = [];
            //     const formattedData = dataToExport.map((city, index) => {
                  
            //         const formattedRow = {
            //         SrNo: index + 1,
            //         Name: city.name,
            //         Sale_Category: city.salesCategoryName,
            //         Rating: city.rating,
            //         Position:city.position,
            //         WebReference:city.webReference,
            //         City:city.city,
            //         State:city.state,
            //         Region:city.region,
            //         Country:city.countryName

            //         };
            
                   
            //         Object.keys(formattedRow).forEach((key) => {
            //             if (
            //                 formattedRow[key] !== undefined &&
            //                 formattedRow[key] !== null &&
            //                 formattedRow[key] !== ''
            //             ) {
            //                 if (!columns.includes(key)) {  
            //                     columns.push(key);
            //                 }
            //             }
            //         });
            
            //         return formattedRow;
            //     });
            
            //     const finalData = formattedData.filter((row) => {
            //         return columns.some((column) => row[column] !== undefined && row[column] !== null && row[column] !== '');
            //     });
            
            //     if (finalData.length === 0) {
            //         alert("No valid data available to export!");
            //         return;
            //     }
            
            //     const columnWidths = columns.map((column) => {
            //         let maxLength = column.length;
            //         console.log(maxLength,"maxLengthmaxLength");
                    
            //         finalData.forEach((row) => {
            //             const cellValue = row[column] ? row[column].toString() : '';
            //             maxLength = Math.max(maxLength, cellValue.length);
            //         });
            //         return { wpx: Math.max(maxLength * 10, 60) }; 
            //     });
            
    
            //     const ws = XLSX.utils.json_to_sheet(finalData, { header: columns });
            
      
            //     ws['!cols'] = columnWidths;
            
    
            //     const wb = XLSX.utils.book_new();
            //     XLSX.utils.book_append_sheet(wb, ws, "Agency Types");
            
    
            //     XLSX.writeFile(wb, "Sale_Guide.xlsx");
            // };
    render(){
        const { salesGuideListFilter, salesGuideListAll } = this.state;
        const dataToExport = salesGuideListFilter.length > 0 ? salesGuideListFilter : salesGuideListAll;
        return(
          
            <React.Fragment>
                  <LoaderComponent loader={this.state.loader}/>
        <div className="tab-pane fade show active" id="AgencyType-tab-pane" role="tabpanel" aria-labelledby="AgencyType-tab" tabIndex="0">
                    <div className="p-4">
                    <div className="row mb-3">
                        <div className="col-md-2">
                    <br/>
                    <h5 className="">Sales Guide</h5>
                    </div>
                    <div className="col-md-8">
                        <div className="row g-3 align-items-center">
                            <div className="col-sm-3">
                                    <label>Name </label>
                                <input type="text" name="name" value={this.state.name} onChange={this.handleChange} className="form-control"  placeholder="Name"/>
                            </div>
                            <div className="col-sm-3">
                                    <label>Sales Category </label>
                                <input type="text" name="salesCategoryName" value={this.state.salesCategoryName} onChange={this.handleChange} className="form-control"  placeholder="Sales Category"/>
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
                          <button data-bs-toggle="modal" data-bs-target="#salesGuideAdd" className="btn btn-outlined"> <i className="fa-sharp fa-solid fa-plus"></i> Add</button>
                    </div>
                    <div className="d-flex justify-content-start mb-3">
    <button onClick={this.downloadExcel} type="button" className="btn btn-outlined ms-2">
        <i className="fa-sharp fa-solid fa-download"></i> Download Excel
    </button>
</div> */}

<div className="d-flex align-items-center justify-content-end">
                  <a onClick={() => this.reloadWindow()}><img style={{ 'height': '40px' }} src="/images/reload.png" /></a>
                  <button data-bs-toggle="modal" data-bs-target="#salesGuideAdd" className="btn btn-outlined me-1">
                    <i className="fa-sharp fa-solid fa-plus"></i> Add
                  </button>
                  {/* <button onClick={this.downloadExcel} type="button" className="btn btn-outlined ms-1">
                    <i className="fa-sharp fa-solid fa-download"></i> Download Excel
                  </button> */}

<ExcelDownloadButton
  data={dataToExport}
  columns={['name','salesCategoryName','rating','position','webReference','city','state','region','countryName']} 
  fileName="ActionTypes.xlsx"
  sheetName="Action Types"
/>
                </div>

                </div>
                       
                        <div className="borderless-box">
                            <div className="table-responsive">
                               {(this.state.salesGuideList.length>0)?<table className="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th>Sr. No</th>                                          
                                            <th>Name</th>
                                            <th>Sales Category</th>  
                                            <th>Rating</th> 
                                            <th>Position</th>                                            
                                            <th colSpan="3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.salesGuideList.map((item,key)=>{
                                            return( <tr key={`sales-guide-${key}`}>
                                                {/* <td>{key+1}</td> */}
                                                <td>{((this.state.currentPage -1)*this.state.perPage) + key+1}</td>
                                               
                                                <td>{ArrayHelper.getValue(item,'name')}</td>   
                                                <td>{ArrayHelper.getValue(item,'salesCategoryName')}</td>  
                                                <td>{ArrayHelper.getValue(item,'rating')}</td> 
                                                <td>{ArrayHelper.getValue(item,'position')}</td>                                             
                                                <td>
                                                    <i data-bs-toggle="modal" data-bs-target="#salesGuideView" onClick={()=>{this.setState({selectedSalesGuide:item})}}  className="fa fa-eye btn"  data-bs-placement="top" title="Edit"></i>
                                                </td> 
                                                <td>
                                                    <i data-bs-toggle="modal" data-bs-target="#salesGuideUpdate" onClick={()=>{this.setState({selectedSalesGuide:item})}}  className="fa fa-edit btn"  data-bs-placement="top" title="Edit"></i>
                                                </td>                                              
                                                <td>
                                                    <i onClick={()=>this.SalesGuideDelete(ArrayHelper.getValue(item,'id'))} className="fa fa-trash btn" data-bs-toggle="tooltip" data-bs-placement="top" title="Trash"></i>
                                                </td>
                                            </tr>)
                                        })}
                                    </tbody>
                                </table>:
                                <p>No Record Found</p>}
                                {(this.state.salesGuideListFilter.length > this.state.perPage) ?
                    <PaginationComponent
                        total={this.state.salesGuideListFilter.length}
                        pageSize={this.state.perPage}
                        currentPage={this.state.currentPage} /> : ''
            }
                            </div>
                        </div>

                    </div>
                </div>
                <SalesGuideAddComponent getSalesGuideList={()=>this.getSalesGuideList()}/>
                <SalesGuideUpdateComponent updatedSalesGuideList={(str)=>this.updatedSalesGuideList(str)} selectedSalesGuide={this.state.selectedSalesGuide}/>
                <SalesGuideViewComponent  selectedSalesGuide={this.state.selectedSalesGuide}/>
            </React.Fragment>
        )
    }
}  



const mapStateToProps = state => {
    return {
        salesGuideListData : state.settingsData.salesGuideList,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        salesGuideListInfo:(data)=>dispatch({type: actionTypesUser.SALES_GUIDE_LIST,payload:data}),
       
    }
};

export default  connect(mapStateToProps, mapDispatchToProps)(SalesGuideComponent);