import React from "react";
import {ArrayHelper} from "../../../helpers/arrayhelper";
import {DISPLAYDATEFORMATE} from "../../../helpers/constants";
import {formatDate,DATEDIFFRENCE} from "../../../vendor/datefns";
declare var $;
class PassengerFieldFormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {PassengerData:[],'selectedKey':'default','id':0,"tourId":0,'fName':'','mName':'','lName':'','contactNo':'','email':'','passportNo':'','passengerType':'','dob':'','actionType':'add'};
    }
   
    handlePassengerInput(key: string, value: any) {
        this.setState({dob:value})
        }
        handleChange = (e) => {
            
            const name = e.target.name;
            let  value = e.target.value;
          
            this.setState({ ...this.state, [name]: value });
            } 
            addPassenger()
            {
                let error='';  
                let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; 
                 if(error=="" && this.state.contactNo!='' && this.state.contactNo.length<10)
                 {
                     alert('Please provide atleast 10 character of contact No.')
                     error='yes';
                 }
                 else if(error=="" && this.state.passportNo!='' && this.state.passportNo.length<8)
                 {
                     alert('Please provide atleast 8 character of passport No.')
                     error='yes';
                 }
                 else if(error=="" && this.state.email!='' && this.state.email.match(mailformat)==null)
                 {
                     alert('Please provide valid email address.')
                     error='yes';
                 }
                 else if(error=="" && this.state.passengerType=='')
                 {
                      alert('Please provide value of passenger type .')
                     error='yes';
                  }
                  else if(error=="" && this.state.passengerType!='' && this.state.dob!='')
                 {
                    if(this.state.passengerType=='Adult' &&   DATEDIFFRENCE(this.state.dob)<12)
                    {
                      alert('Please provide valid date of birth of Adult.')
                     error='yes';
                    }
                    else if(this.state.passengerType=='Child' &&(DATEDIFFRENCE(this.state.dob)>12 || DATEDIFFRENCE(this.state.dob)<2))
                    {
                      alert('Please provide valid date of birth of Child.')
                     error='yes';
                    }
                    else if(this.state.passengerType=='Infant'  && DATEDIFFRENCE(this.state.dob)>2)
                    {
                      alert('Please provide valid date of birth of Infant.')
                     error='yes';
                    }
                  }
                 
                if(error=='')
                {                    
                if((this.props.PassengerList.length>=this.props.noOfPax  ||  this.props.PassengerData.length >=this.props.noOfPax) && this.state.actionType=='add') 
                { 
                    alert('You can not enter passgener info more than PAX Number')
                }
                else
                {
                if(this.state.actionType=='add')
                {
                    this.props.addPassenger({'id':0,"tourId":0,'fName':this.state.fName,'mName':this.state.mName,'lName':this.state.lName,'contactNo':this.state.contactNo,'dob':this.state.dob,'email':this.state.email,'passportNo':this.state.passportNo,'passengerType':this.state.passengerType}) 
                }
                else
                {
                    if(this.state.selectedKey!='default' && this.state.id==0)
                    {
                      this.props.deletePassenger(this.state.selectedKey,0)
                    }
                    setTimeout(()=>{
                        this.props.addPassenger({'id':this.state.id,"tourId":this.state.tourId,'fName':this.state.fName,'mName':this.state.mName,'lName':this.state.lName,'contactNo':this.state.contactNo,'dob':this.state.dob,'email':this.state.email,'passportNo':this.state.passportNo,'passengerType':this.state.passengerType}) 
                    },10)
                  
                   
                }    
               
               setTimeout(()=>{
                
               this.setState({selectedKey:'default','id':'',"tourId":0,'fName':'','mName':'','lName':'','contactNo':'','email':'','passportNo':'','passengerType':'','dob':'','actionType':'add'});
              
               },20)
            }
             
               
              
                }
                
            }  
            EditPassenger(item:any,selectedKey:any)  
            {
               
                this.setState({selectedKey:selectedKey,'id':item.id,"tourId":item.tourId,'fName':item.fName,'mName':item.mName,'lName':item.lName,'contactNo':item.contactNo,'email':item.email,'passportNo':item.passportNo,'passengerType':item.passengerType,'dob':(ArrayHelper.getValue(item,'dob')!='' && ArrayHelper.getValue(item,'dob')!='1900-01-01T00:00:00')?ArrayHelper.getValue(item,'dob'):''
                ,'actionType':'edit'})   
              
            } 
            componentDidMount()
            {               
                $("#passengerDOB").datepicker({maxDate:"+0d",changeMonth: true, changeYear: true, yearRange: '1900:+0'})
                .on("change", (e: any) => {
                   this.setState({dob:e.target.value})
                });                 
            }
            componentWillReceiveProps()
            {
               setTimeout(()=>{
                if(this.props.PassengerList.length==0 &&  this.props.PassengerData.length==0) 
                { 
                  let traveler_name=  this.props.traveler_name.split(' ');
                
                  if(traveler_name.length==1)
                  {
                    this.setState({fName:traveler_name[0]})
                  }
                  else if(traveler_name.length==2)
                  {
                    this.setState({fName:traveler_name[0],lName:traveler_name[1]})
                  }
                  else if(traveler_name.length>2)
                  {
                    let lName=this.props.traveler_name.replace(traveler_name[0],'');
                    lName=lName.replace(' '+traveler_name[1],'');
                    this.setState({fName:traveler_name[0],mName:traveler_name[1],lName:lName})
                  }
                  this.setState({contactNo:this.props.traveler_cell,email:this.props.traveler_email})
                }
                else
                {
                   // this.setState({fName:'',mName:'',lName:'',contactNo:'',email:''})
                }
               },5)
                
                
            }  
            resetValue()
            {
                this.setState({selectedKey:'default','id':'',"tourId":0,'fName':'','mName':'','lName':'','contactNo':'','email':'','passportNo':'','passengerType':'','dob':'','actionType':'add'}); 
            }   
    render(){
        
        return(
          
            <React.Fragment>
                <div className="maininfo">
                <span className="me-2 heading">Add Passenger </span>
                <div className="d-flex mb-4">
                            <div className="flex-fill p-1 maxWwidth100">
                                <label  className="form-label">First Name</label>
                                <input maxLength={50}  type="text" className="form-control form-control-sm" name="fName" 
                                            value={this.state.fName}
                                            onChange={this.handleChange}
                                            placeholder="Enter First Name"/>
                            </div>
                            <div className="flex-fill p-1 maxWwidth100">
                                <label  className="form-label">Middle Name</label>
                                <input maxLength={50}  type="text" className="form-control form-control-sm" name="mName" 
                                 value={this.state.mName}
                                          onChange={this.handleChange}
                                            placeholder="Enter Middle Name"/>
                            </div>
                            <div className="flex-fill p-1 maxWwidth100">
                                <label  className="form-label">Last Name</label>
                                <input maxLength={50}  type="text" className="form-control form-control-sm" name="lName" 
                                            value={this.state.lName}
                                            onChange={this.handleChange}
                                            placeholder="Enter Last Name"/>
                            </div>
                            <div className="flex-fill p-1 maxWwidth100">
                                <label  className="form-label">Contact Number</label>
                                <input maxLength={20}  type="text" className="form-control form-control-sm" name="contactNo" 
                                            value={this.state.contactNo}
                                            onChange={this.handleChange}
                                            placeholder="Enter Contact No"/>
                            </div>
                            <div className="flex-fill p-1 ">
                                <label  className="form-label">DOB</label>
                                <br/>
                                <input  id="passengerDOB" readOnly type="text" placeholder="Enter DOB" className="form-control form-control-sm" name="dob" value={formatDate(this.state.dob)}/>
                               
                            </div>
                            <div className="flex-fill p-1">
                                <label  className="form-label">Email</label>
                                <input maxLength={150}  type="email" className="form-control form-control-sm" name="email" 
                                            value={this.state.email}
                                            onChange={this.handleChange}
                                            placeholder="Enter Email"/>
                            </div>
                            <div className="flex-fill p-1">
                                <label  className="form-label">Passport No</label>
                                <input maxLength={15}  type="text" className="form-control form-control-sm" name="passportNo" 
                                           value={this.state.passportNo}
                                            onChange={this.handleChange}
                                            placeholder="Enter Passport No"/>
                            </div>
                            <div className="flex-fill p-1">
                                <label  className="form-label">Passenger Type</label>
                                <select   value={this.state.passengerType}  name="passengerType"  onChange={this.handleChange} className="form-select form-select-sm" aria-label=".form-select-sm example">
                                             <option value="">Select</option>
                                             <option value="Adult">Adult</option>
                                             <option value="Child">Child</option>
                                             <option value="Infant">Infant</option>
                                         </select>
                            </div>
                           
                          
                            <div className="flex-fill p-1">
                                    <button  onClick={()=>this.addPassenger()} type="button" className="btn btn-sm btn-primary rounded mt-4">{(this.state.actionType=='add')?<i className="fa-solid fa-plus"></i>:''}{(this.state.actionType=='edit')?'Update':'Add'} </button> {(this.state.actionType=='edit')?<button  onClick={()=>this.resetValue()} type="button" className="btn btn-sm btn-outlined rounded mt-4">Reset</button>:''}
                                </div>
                        </div>
                        {(this.props.PassengerList.length>0 || this.props.PassengerData.length>0)?
                        <div className="table-responsive">
                            <table className="table table-striped rounded border mb-0">
                                <tbody>
                                    <tr>
                                        <th>Passenger Name</th>
                                        <th>Contact Number</th>
                                        <th>DOB</th>
                                        <th>Email</th>
                                        <th>Passport Number</th>
                                        <th>Passenger Type</th>
                                        <th className="maxWwidth100">Action</th>
                                    </tr>
                                    {this.props.PassengerList.map((item,key)=>{
                                    return(<tr key={`passenger-${key}`} className={(this.state.selectedKey==key && this.state.actionType=='edit')?'backgroundtr':''}>
                                        <td>{ArrayHelper.getValue(item,'fName')} {ArrayHelper.getValue(item,'mName')} {ArrayHelper.getValue(item,'lName')}</td>
                                        <td>{ArrayHelper.getValue(item,'contactNo')}</td>
                                        <td>
                                            {(ArrayHelper.getValue(item,'dob')!='' && ArrayHelper.getValue(item,'dob')!='1900-01-01T00:00:00')?formatDate(ArrayHelper.getValue(item,'dob'),DISPLAYDATEFORMATE):''}
                                            
                                            </td>
                                        <td>{ArrayHelper.getValue(item,'email')}</td>
                                        <td>{ArrayHelper.getValue(item,'passportNo')}</td>
                                        <td>{ArrayHelper.getValue(item,'passengerType')}</td>
                                        <td> <i onClick={()=>this.EditPassenger(item,key)} className="fa fa-edit btn text-primary" title="Edit"></i> <i className="fa fa-trash btn text-danger" onClick={()=>this.props.deletePassenger(key,item.id)} title="Remove"></i></td>
                                    </tr>)
                                    })}
                                    {this.props.PassengerData.map((item,key)=>{
                                    return(<tr key={`PassengerData-${key}`} className={(this.state.selectedKey==key && this.state.actionType=='edit')?'backgroundtr':''}>
                                        <td>{ArrayHelper.getValue(item,'fName')} {ArrayHelper.getValue(item,'mName')} {ArrayHelper.getValue(item,'lName')}</td>
                                        <td>{ArrayHelper.getValue(item,'contactNo')}</td>
                                        <td>
                                            {(ArrayHelper.getValue(item,'dob')!='' && ArrayHelper.getValue(item,'dob')!='1900-01-01T00:00:00')?formatDate(ArrayHelper.getValue(item,'dob'),DISPLAYDATEFORMATE):''}
                                            
                                            </td>
                                        <td>{ArrayHelper.getValue(item,'email')}</td>
                                        <td>{ArrayHelper.getValue(item,'passportNo')}</td>
                                        <td>{ArrayHelper.getValue(item,'passengerType')}</td>
                                        <td> <i onClick={()=>this.EditPassenger(item,key)}  className="fa fa-edit btn text-primary" title="Edit"></i> <i className="fa fa-trash btn text-danger" onClick={()=>this.props.deletePassenger(key,item.id)}></i></td>
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



export default  PassengerFieldFormComponent;