import React from "react";
import {ArrayHelper} from "../../../helpers/arrayhelper";
import {DISPLAYDATEFORMATE} from "../../../helpers/constants";
import {formatDate} from "../../../vendor/datefns";
declare var $;
class PaymentFieldFormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {PaymentData:[],'selectedKey':'default','id':0,"tourId":0,'transactionId':'','amount':'','paymentDate':'','dueDate':'','status':'','paymentMethod':'','paymentMode':'','actionType':'add'};
    }
    
    handlePassengerInput(key: string, value: any) {
        if((key=='paymentDate'))
                    {      
                                      
                     this.setState({paymentDate:value});                 
        
                    }
                    else if((key=='dueDate'))
                    {      
                                      
                     this.setState({dueDate:value});                 
        
                    }
        }
        handleChange = (e) => {
            
            const name = e.target.name;
            let  value = e.target.value; 
           
            this.setState({ ...this.state, [name]: value });
            } 
            addPayment()
            {
                let error='';  
                if(error=="" && this.state.amount=='')
                {
                     alert('Please provide value of amount.')
                    error='yes';
                 }
                 else if(error=="" && this.state.transactionId!='' && this.state.transactionId.length<4)
                 {
                      alert('Please provide atleast 4 character of transaction Id.')
                     error='yes';
                  }
                  else if(error=="" && this.state.notes!='' && this.state.notes.length<10)
                 {
                      alert('Please provide atleast 10 character of notes.')
                     error='yes';
                  }
                  else if(error=="" && this.state.paymentMode!='' && this.state.paymentMode.length<4)
                 {
                      alert('Please provide atleast 4 character of payment mode.')
                     error='yes';
                  }
                if(error=='')
                {
                if(this.state.actionType=='add')
                {
                    this.props.addPayment({'id':0,"tourId":0,'transactionId':this.state.transactionId,'amount':this.state.amount,'paymentDate':this.state.paymentDate,'dueDate':this.state.dueDate,'status':this.state.status,'notes':this.state.notes,'paymentMethod':this.state.paymentMethod,'paymentMode':this.state.paymentMode}) 
                }
                else
                {
                    if(this.state.selectedKey!='default' && this.state.id==0)
                    {
                      this.props.deletePayment(this.state.selectedKey,0)
                    }
                    setTimeout(()=>{
                    this.props.addPayment({'id':this.state.id,"tourId":this.state.tourId,'transactionId':this.state.transactionId,'amount':this.state.amount,'paymentDate':this.state.paymentDate,'dueDate':this.state.dueDate,'status':this.state.status,'notes':this.state.notes,'paymentMethod':this.state.paymentMethod,'paymentMode':this.state.paymentMode}) 
                },10)
                }    
               
               setTimeout(()=>{
               
               this.setState({selectedKey:'default','id':'',"tourId":0,'transactionId':'','amount':'','paymentDate':'','dueDate':'','status':'','notes':'','paymentMethod':'','paymentMode':'','actionType':'add'});
              
               },20)
                }
               
            }  
            EditPayment(item:any,selectedKey:any)  
            {
                
                this.setState({selectedKey:selectedKey,'id':item.id,"transactionId":item.transactionId,'amount':item.amount,'paymentDate':item.paymentDate,'status':item.status,'notes':item.notes,'paymentMethod':item.paymentMethod,'paymentMode':item.paymentMode,'passengerType':item.passengerType,'actionType':'edit'})   
                if(item.id==0)
                {
                //    this.props.deletePayment(selectedKey,item.id)
                }
               
           
            } 
            componentDidMount()
            {               
                $("#paymentDate").datepicker({minDate:"+0d"})
                .on("change", (e: any) => {
                   this.setState({paymentDate:e.target.value})
                });  
                
                $("#dueDate").datepicker({minDate:"+0d"})
                .on("change", (e: any) => {
                   this.setState({dueDate:e.target.value})
                }); 
            } 
            resetValue()
            {
                this.setState({selectedKey:'default','id':'',"tourId":0,'transactionId':'','amount':'','paymentDate':'','dueDate':'','status':'','notes':'','paymentMethod':'','paymentMode':'','actionType':'add'});
            }         
    render(){
      
        return(
          
            <React.Fragment>
                <div className="maininfo">
                <span className="me-2 heading">Add Payment</span>
                <div className="d-flex mb-4">
                            <div className="flex-fill p-1 maxWwidth100">
                                <label  className="form-label">Transaction Id</label>
                                <input maxLength={20}  type="text" className="form-control form-control-sm" name="transactionId" 
                                            value={this.state.transactionId}
                                            onChange={this.handleChange}
                                            placeholder="Enter Transaction Id"/>
                            </div>
                            <div className="flex-fill p-1 maxWwidth100">
                                <label  className="form-label">Amount</label>
                                <input  maxLength={10}  type="text" className="form-control form-control-sm" name="amount" 
                                 value={this.state.amount}
                                          onChange={this.handleChange}
                                            placeholder="Enter Amount"/>
                            </div>
                            <div className="flex-fill p-1 maxWwidth100">
                                <label  className="form-label">Payment Date</label>
                                <br/>
                                <input  id="paymentDate" readOnly type="text" placeholder="Enter Payment Date" className="form-control form-control-sm" name="paymentDate" value={formatDate(this.state.paymentDate)}/>
                               
                            </div>
                            <div className="flex-fill p-1 maxWwidth100">
                                <label  className="form-label">Due Date</label>
                                <br/>
                                <input  id="dueDate" readOnly type="text" placeholder="Enter Due Date" className="form-control form-control-sm" name="dueDate" value={formatDate(this.state.dueDate)}/>
                               
                            </div>
                            <div className="flex-fill p-1">
                                <label  className="form-label">Notes</label>
                                <input  type="text" className="form-control form-control-sm" name="notes" 
                                          maxLength={250}
                                            value={this.state.notes}
                                            onChange={this.handleChange}
                                            placeholder="Enter Notes"/>
                            </div>
                            <div className="flex-fill p-1 maxWwidth100">
                                <label  className="form-label">Payment Type</label>
                              
<select   value={this.state.paymentMethod}  name="paymentMethod"  onChange={this.handleChange} className="form-select form-select-sm">
                                            <option value="">Select</option>
                                             <option value="Deposit">Deposit</option>
                                             <option value="Supplement">Supplement</option>
                                             <option value="Final Payment">Final Payment</option>
                                         </select>
                            </div>
                           
                            <div className="flex-fill p-1 maxWwidth100">
                                <label  className="form-label">Payment Mode</label>
                                <input maxLength={20}   type="email" className="form-control form-control-sm" name="paymentMode" 
                                            value={this.state.paymentMode}
                                            onChange={this.handleChange}
                                            placeholder="Enter Payment Mode"/>
                            </div>
                            <div className="flex-fill p-1 maxWwidth100">
                                <label  className="form-label">Status</label>
                                <select   value={this.state.status}  name="status"  onChange={this.handleChange} className="form-select form-select-sm">
                                             <option value="">Select</option>
                                             <option value="Pending">Pending</option>
                                             <option value="Done">Done</option>
                                         </select>
                            </div>
                           
                          
                            <div className="flex-fill p-1">
                                    <button  onClick={()=>this.addPayment()} type="button" className="btn btn-sm btn-primary rounded mt-4">{(this.state.actionType=='add')?<i className="fa-solid fa-plus"></i>:''}{(this.state.actionType=='edit')?'Update':'Add'} </button> {(this.state.actionType=='edit')?<button  onClick={()=>this.resetValue()} type="button" className="btn btn-sm btn-outlined rounded mt-4">Reset</button>:''}
                                </div>
                        </div>
                        {(this.props.PaymentList.length>0 || this.props.PaymentData.length>0)?<div className="table-responsive">
                            <table className="table table-striped rounded border mb-0">
                                <tbody>
                                    <tr>
                                        <th>Transaction Id</th>
                                        <th>Amount</th>
                                        <th>Payment Date</th>
                                        <th>Due Date</th>
                                        <th className="width400">Notes</th>
                                        <th>Payment  Type</th>
                                        <th>Payment  Mode</th>
                                        <th>Mode</th>
                                        <th className="maxWwidth100">Action</th>
                                    </tr>
                                    {this.props.PaymentList.map((item,key)=>{
                                    return(<tr key={`PaymentList-${key}`} className={(this.state.selectedKey==key && this.state.actionType=='edit')?'backgroundtr':''}>
                                        <td>{ArrayHelper.getValue(item,'transactionId')}</td>
                                        <td>{ArrayHelper.getValue(item,'amount')}</td>
                                        <td>
                                            {(ArrayHelper.getValue(item,'paymentDate')!='' && ArrayHelper.getValue(item,'paymentDate')!='1900-01-01T00:00:00')?formatDate(ArrayHelper.getValue(item,'paymentDate'),DISPLAYDATEFORMATE):''}
                                            
                                            </td>
                                            <td>
                                            {(ArrayHelper.getValue(item,'dueDate')!='' && ArrayHelper.getValue(item,'dueDate')!='1900-01-01T00:00:00')?formatDate(ArrayHelper.getValue(item,'dueDate'),DISPLAYDATEFORMATE):''}
                                            
                                            </td>
                                        <td>{ArrayHelper.getValue(item,'notes')}</td>
                                        <td>{ArrayHelper.getValue(item,'paymentMethod')}</td>
                                        <td>{ArrayHelper.getValue(item,'paymentMode')}</td>
                                        <td>{ArrayHelper.getValue(item,'status')}</td>
                                        <td> <i onClick={()=>this.EditPayment(item,key)} className="fa fa-edit btn text-primary" title="Edit"></i> <i className="fa fa-trash btn text-danger" onClick={()=>this.props.deletePayment(key,item.id)} title="Remove"></i></td>
                                    </tr>)
                                    })}
                                    {this.props.PaymentData.map((item,key)=>{
                                    return(<tr key={`PaymentData-${key}`} className={(this.state.selectedKey==key && this.state.actionType=='edit')?'backgroundtr':''}>
                                        <td>{ArrayHelper.getValue(item,'transactionId')}</td>
                                        <td>{ArrayHelper.getValue(item,'amount')}</td>
                                        <td>
                                            {(ArrayHelper.getValue(item,'paymentDate')!='')?formatDate(ArrayHelper.getValue(item,'paymentDate'),DISPLAYDATEFORMATE):''}
                                            
                                            </td>
                                        <td>{ArrayHelper.getValue(item,'notes')}</td>
                                        <td>{ArrayHelper.getValue(item,'paymentMethod')}</td>
                                        <td>{ArrayHelper.getValue(item,'paymentMode')}</td>
                                        <td>{ArrayHelper.getValue(item,'status')}</td>
                                        <td> <i onClick={()=>this.EditPayment(item,key)}  className="fa fa-edit btn text-primary" title="Edit"></i> <i className="fa fa-trash btn text-danger" onClick={()=>this.props.deletePayment(key,item.id)}></i></td>
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



export default  PaymentFieldFormComponent;