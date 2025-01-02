import React from "react";
import {ArrayHelper} from "../../../helpers/arrayhelper";
import {DISPLAYDATEFORMATE} from "../../../helpers/constants";
import {formatDate} from "../../../vendor/datefns";
declare var $;
class VendorPaymentFieldFormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {PaymentData:[],'selectedKey':'default','id':0,"tourId":0,"vendorId":0,'transactionId':'','amount':'','transactionDate':'','status':'','transactionDueDate':'','actionType':'add'};
    }
    
    handlePassengerInput(key: string, value: any) {
        if((key=='paymentDate'))
                    {      
                                      
                     this.setState({paymentDate:value});                 
        
                    }
        }
        handleChange = (e) => {
            
            const name = e.target.name;
            let  value = e.target.value; 
            if(name=='transactionId')
             { 
                 value = value.replace(/[^A-Z0-9,'']/ig, '');
              }
              else if(name=='amount')
             { 
                 value = value.replace(/[^0-9,'']/ig, '');
              }
            this.setState({ ...this.state, [name]: value });
            } 
            addVendorPayment()
            {
                let error='';  
                if(error=="" && this.state.vendorId=='')
                {
                     alert('Please provide value of vendor.')
                    error='yes';
                 }
                else if(error=="" && this.state.amount=='')
                {
                     alert('Please provide value of amount.')
                    error='yes';
                 }
                 else if(error=="" && this.state.transactionId!='' && this.state.transactionId.length<4)
                 {
                      alert('Please provide atleast 4 character of transaction Id.')
                     error='yes';
                  }
                if(error=="")
                {
                if(this.state.actionType=='add')
                {
                    this.props.addVendorPayment({'id':0,"tourId":0,'transactionId':this.state.transactionId,'amount':this.state.amount,'transactionDate':this.state.transactionDate,'transactionDueDate':this.state.transactionDueDate,'status':this.state.status,'vendorId':this.state.vendorId}) 
                }
                else
                {
                    if(this.state.selectedKey!='default' && this.state.id==0)
                    {
                      this.props.deleteVendorPayment(this.state.selectedKey,0)
                    }
                    setTimeout(()=>{
                    this.props.addVendorPayment({'id':this.state.id,"tourId":this.state.tourId,'transactionId':this.state.transactionId,'amount':this.state.amount,'transactionDate':this.state.transactionDate,'transactionDueDate':this.state.transactionDueDate,'status':this.state.status,'vendorId':this.state.vendorId}) 
                },10)
                }    
               
               setTimeout(()=>{
               
               this.setState({selectedKey:'default','id':'',"tourId":0,"vendorId":0,'transactionId':'','amount':'','transactionDate':'','status':'','transactionDueDate':'','actionType':'add'});
              
               },20)
                }
               
            }  
            EditVendorPayment(item:any,selectedKey:any)  
            {
                
                this.setState({selectedKey:selectedKey,'id':item.id,"transactionId":item.transactionId,'amount':item.amount,'transactionDate':item.transactionDate,'transactionDueDate':item.transactionDueDate,'status':item.status,'vendorId':item.vendorId,'actionType':'edit'})   
                if(item.id==0)
                {
                //    this.props.deletePayment(selectedKey,item.id)
                }
               
           
            } 
            componentDidMount()
            {               
                $("#transactionDate").datepicker({minDate:"+0d"})
                .on("change", (e: any) => {
                   this.setState({transactionDate:e.target.value})
                }); 
                $("#transactionDueDate").datepicker({minDate:"+0d"})
                .on("change", (e: any) => {
                   this.setState({transactionDueDate:e.target.value})
                });                
            } 
            resetValue()
            {
                this.setState({selectedKey:'default','id':'',"tourId":0,'transactionId':'','amount':'','paymentDate':'','status':'','notes':'','paymentMethod':'','paymentMode':'','actionType':'add'});
            }         
    render(){
      
        return(
          
            <React.Fragment>
                <div className="maininfo">
                <span className="me-2 heading">Add Vendor Payment</span>
                <div className="d-flex mb-4">
                           <div className="flex-fill p-1">
                                <label  className="form-label">Vendor List</label>
                                <select name="vendorId"  className="form-select form-control-sm"                                            
                                             value={this.state.vendorId}
                                             onChange={this.handleChange}
                                            >
                                                <option value="">Select Vendor</option>
                                                {this.props.vendorList.map((item,key)=>{
                                          return(<option key={`vendorList-${key}`}  value={ArrayHelper.getValue(item,'id')}>{ArrayHelper.getValue(item,'vendorName')}</option>)
                                        })}
                                            </select>
                            </div>
                            <div className="flex-fill p-1">
                                <label  className="form-label">Transaction Id</label>
                                <input  maxLength={20}  type="text" className="form-control form-control-sm" name="transactionId" 
                                            value={this.state.transactionId}
                                            onChange={this.handleChange}
                                            placeholder="Enter Transaction Id"/>
                            </div>
                            <div className="flex-fill p-1">
                                <label  className="form-label">Amount</label>
                                <input  maxLength={10}  type="text" className="form-control form-control-sm" name="amount" 
                                 value={this.state.amount}
                                          onChange={this.handleChange}
                                            placeholder="Enter Amount"/>
                            </div>
                            <div className="flex-fill p-1">
                                <label  className="form-label">Transaction Date</label>
                                <br/>
                                <input  id="transactionDate" readOnly type="text" placeholder="Enter Transaction Date" className="form-control form-control-sm" name="transactionDate" value={formatDate(this.state.transactionDate)}/>
                               
                            </div>
                            <div className="flex-fill p-1">
                                <label  className="form-label">Transaction Due Date</label>
                                <br/>
                                <input  id="transactionDueDate" readOnly type="text" placeholder="Enter Transaction Due Date" className="form-control form-control-sm" name="transactionDueDate" value={formatDate(this.state.transactionDueDate)}/>
                               
                            </div>
                            
                            <div className="flex-fill p-1">
                                <label  className="form-label">Status</label>
                                <select   value={this.state.status}  name="status"  onChange={this.handleChange} className="form-select form-select-sm">
                                             <option value="">Select</option>
                                             <option value="Pending">Pending</option>
                                             <option value="Done">Done</option>
                                         </select>
                            </div>
                           
                          
                            <div className="flex-fill p-1">
                                    <button  onClick={()=>this.addVendorPayment()} type="button" className="btn btn-sm btn-primary rounded mt-4">{(this.state.actionType=='add')?<i className="fa-solid fa-plus"></i>:''}{(this.state.actionType=='edit')?'Update':'Add'} </button> {(this.state.actionType=='edit')?<button  onClick={()=>this.resetValue()} type="button" className="btn btn-sm btn-outlined rounded mt-4">Reset</button>:''}
                                </div>
                        </div>
                        {(this.props.VendorPaymentList.length>0 || this.props.VendorPaymentData.length>0)?<div className="table-responsive">
                            <table className="table table-striped rounded border mb-0">
                                <tbody>
                                    <tr>
                                    <th>Vendor</th>
                                        <th>Transaction Id</th>
                                        <th>Amount</th>
                                        <th>Transaction Date</th>
                                        <th>Transaction Due Date</th>
                                        <th>Status</th>
                                        <th className="maxWwidth100">Action</th>
                                    </tr>
                                    {this.props.VendorPaymentList.map((item,key)=>{
                                    return(<tr key={`VendorPaymentList-${key}`} className={(this.state.selectedKey==key && this.state.actionType=='edit')?'backgroundtr':''}>
                                        <td>{ArrayHelper.getValue(item,'vendorName')}</td>
                                        <td>{ArrayHelper.getValue(item,'transactionId')}</td>
                                        <td>{ArrayHelper.getValue(item,'amount')}</td>
                                        <td>
                                            {(ArrayHelper.getValue(item,'transactionDate')!='' && ArrayHelper.getValue(item,'transactionDate')!='1900-01-01T00:00:00')?formatDate(ArrayHelper.getValue(item,'transactionDate'),DISPLAYDATEFORMATE):''}
                                            
                                            </td>
                                            <td>
                                            {(ArrayHelper.getValue(item,'transactionDueDate')!='' && ArrayHelper.getValue(item,'transactionDueDate')!='1900-01-01T00:00:00')?formatDate(ArrayHelper.getValue(item,'transactionDueDate'),DISPLAYDATEFORMATE):''}
                                            
                                            </td>                                       
                                        <td>{ArrayHelper.getValue(item,'status')}</td>
                                        <td> <i onClick={()=>this.EditVendorPayment(item,key)} className="fa fa-edit btn text-primary" title="Edit"></i> <i className="fa fa-trash btn text-danger" onClick={()=>this.props.deleteVendorPayment(key,item.id)} title="Remove"></i></td>
                                    </tr>)
                                    })}
                                    {this.props.VendorPaymentData.map((item,key)=>{
                                    return(<tr key={`PaymentData-${key}`} className={(this.state.selectedKey==key && this.state.actionType=='edit')?'backgroundtr':''}>
                                       <td>{ArrayHelper.getValue(item,'vendorName')}</td>
                                        <td>{ArrayHelper.getValue(item,'transactionId')}</td>
                                        <td>{ArrayHelper.getValue(item,'amount')}</td>
                                        <td>
                                            {(ArrayHelper.getValue(item,'transactionDate')!='' && ArrayHelper.getValue(item,'transactionDate')!='1900-01-01T00:00:00')?formatDate(ArrayHelper.getValue(item,'transactionDate'),DISPLAYDATEFORMATE):''}
                                            
                                            </td>
                                            <td>
                                            {(ArrayHelper.getValue(item,'transactionDueDate')!='' && ArrayHelper.getValue(item,'transactionDueDate')!='1900-01-01T00:00:00')?formatDate(ArrayHelper.getValue(item,'transactionDueDate'),DISPLAYDATEFORMATE):''}
                                            
                                            </td>     
                                        <td> <i onClick={()=>this.EditVendorPayment(item,key)}  className="fa fa-edit btn text-primary" title="Edit"></i> <i className="fa fa-trash btn text-danger" onClick={()=>this.props.deleteVendorPayment(key,item.id)}></i></td>
                                    </tr>)
                                    })}
                                </tbody>
                            </table>
                        </div>:''}
                            </div>
            </React.Fragment>
        )
    }
}  



export default  VendorPaymentFieldFormComponent;