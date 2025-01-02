import React from "react";
class CostingFieldFormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loader:false,agentTypeListAll:[],agentTypeList:[],selectedAgentType:{},perPage:20,currentPage:1};
    }
     
    render(){
      
        return(
          
            <React.Fragment>
                <div className={`borderless-box ${(this.props.selectedTab!='Costing')?'hide':''}`}>
                    <div className="accordion border-0 pt-3 " id="accordionExample">
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingOne">
                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    Costing  Details
                                </button>
                            </h2>
                            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                <div className="accordion-body pb-4">
                                    <div className="row">
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Day 1</label>
                                            <input type="date" className="form-control form-control-sm" id="exampleFormControlInput1" placeholder="Name"/>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Sector</label>
                                            <input type="text" className="form-control form-control-sm" id="exampleFormControlInput1" placeholder="SYLVIA MARIA CAFFERATA"/>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">D.City</label>
                                            <input type="text" className="form-control form-control-sm" id="exampleFormControlInput1" placeholder="Sector"/>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">A.CIty</label>
                                            <input type="text" className="form-control form-control-sm" id="exampleFormControlInput1" placeholder="A.CIty"/>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">D.City</label>
                                            <input type="text" className="form-control form-control-sm" id="exampleFormControlInput1" placeholder="D.City"/>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">A.CIty</label>
                                            <input type="text" className="form-control form-control-sm" id="exampleFormControlInput1" placeholder="A.CIty"/>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">A.CIty</label>
                                            <input type="text" className="form-control form-control-sm" id="exampleFormControlInput1" placeholder="A.CIty"/>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Guide</label>
                                            <input type="text" className="form-control form-control-sm" id="exampleFormControlInput1" placeholder="Guide"/>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">SGL</label>
                                            <input type="text" className="form-control form-control-sm" id="exampleFormControlInput1" placeholder="SGL"/>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">DBL</label>
                                            <input type="text" className="form-control form-control-sm" id="exampleFormControlInput1" placeholder="DBL"/>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Room Type</label>
                                            <select className="form-select form-select-sm" aria-label=".form-select-sm example">
                                                    <option selected>AC Room</option>
                                                    <option value="1">One</option>
                                                    <option value="2">Two</option>
                                                    <option value="3">Three</option>
                                                </select>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Hotel</label>
                                            <input type="text" className="form-control form-control-sm" id="exampleFormControlInput1" placeholder="Hotel"/>
                                        </div>
                                      
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">E/BED</label>
                                            <input type="text" className="form-control form-control-sm" id="exampleFormControlInput1" placeholder="E/BED"/>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">ENT</label>
                                            <input type="text" className="form-control form-control-sm" id="exampleFormControlInput1" placeholder="ENT"/>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Extras</label>
                                            <input type="text" className="form-control form-control-sm" id="exampleFormControlInput1" placeholder="Extras"/>
                                        </div>
                                        <div className="col-md-12">
                                            <label htmlFor="exampleFormControlTextarea1" className="form-label">Remark</label>
                                            <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" placeholder="Remark"></textarea>

                                        </div>
                                        <div className="col-auto text-center mt-4">
                                            <button type="submit" className="btn btn-primary rounded py-2 px-5">Add Element</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingTwo">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                    Greaves Tours Quote Sheet
                                    </button>
                            </h2>
                            <div id="collapseTwo" className="accordion-collapse collapse show" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                <div className="accordion-body pb-0">
                                    <div className="row">
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">INR to USD rate</label>
                                            <input type="text" className="form-control form-control-sm" id="exampleFormControlInput1" placeholder="79.55"/>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Percentage</label>
                                            <input type="text" className="form-control form-control-sm" id="exampleFormControlInput1" placeholder="15%"/>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingThree">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                    Greaves India Ground Services
                                </button>
                            </h2>
                            <div id="collapseThree" className="accordion-collapse collapse show" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                <div className="accordion-body pb-0 row">
                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label">Element Name</label>
                                        <input type="date" className="form-control form-control-sm" id="exampleFormControlInput1" placeholder="Ground Arrangements (Without Hotels)"/>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label">Total For Element</label>
                                        <input type="text" className="form-control form-control-sm" id="exampleFormControlInput1" placeholder="368,900"/>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label">GTI-NET INR</label>
                                        <input type="text" className="form-control form-control-sm" id="exampleFormControlInput1" placeholder="GTI-NET INR"/>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label">GTI Markup</label>
                                        <input type="text" className="form-control form-control-sm" id="exampleFormControlInput1" placeholder="GTI Markup"/>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label">GTI COMM</label>
                                        <input type="text" className="form-control form-control-sm" id="exampleFormControlInput1" placeholder="GTI COMM"/>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label">GTI Gross Up</label>
                                        <input type="text" className="form-control form-control-sm" id="exampleFormControlInput1" placeholder="GTI Gross Up"/>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label">S/TAX</label>
                                        <input type="text" className="form-control form-control-sm" id="exampleFormControlInput1" placeholder="S/TAX"/>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label">GTI SELL</label>
                                        <input type="text" className="form-control form-control-sm" id="exampleFormControlInput1" placeholder="GTI SELL"/>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label">ROE Conv</label>
                                        <input type="text" className="form-control form-control-sm" id="exampleFormControlInput1" placeholder="ROE Conv"/>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label">Include in Quote</label>
                                        <input type="text" className="form-control form-control-sm" id="exampleFormControlInput1" placeholder="Include in Quote"/>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label">Mark Up</label>
                                        <input type="text" className="form-control form-control-sm" id="exampleFormControlInput1" placeholder="Mark Up"/>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label">COMM</label>
                                        <input type="text" className="form-control form-control-sm" id="exampleFormControlInput1" placeholder="COMM"/>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label">Client Cost</label>
                                        <input type="text" className="form-control form-control-sm" id="exampleFormControlInput1" placeholder="Client Cost"/>
                                    </div>

                                </div>
                            </div>
                        </div>



                        <div className="text-end p-4">
                            <button className="btn btn-outlined rounded my-3 me-2" type="submit">Cancel</button>
                            <button className="btn rounded btn-primary my-3" type="submit">Save</button>
                        </div>
                    </div>

                </div>
            </React.Fragment>
        )
    }
}  



export default  CostingFieldFormComponent;