import React, { useState, useEffect } from "react";
import { ArrayHelper } from "../../../helpers/arrayhelper";
import { DATEDURATION } from '../../../helpers/constants';
import { orderBy } from 'lodash';
import { formatDate } from "../../../vendor/datefns";
import { DISPLAYDATEFORMATE } from "../../../helpers/constants";
import SettingApi from "../../../api/Setting.api";
import {USER_ID,USER_EMAIL,USER_NAME} from '../../../helpers/constants';



const CostingViewComponent = (props) => {
    const [shortBy, setShortBy] = useState('cityName');
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [costFilter, setCostFilter] = useState('withCost');
    const [tourItineraryData, setTourItineraryData] = useState([]);
    const [perPersonCost, setPerPersonCost] = useState([]);

    const [totals, setTotals] = useState({
        totalCost: 0,
        totalServiceGTICommission: 0,
        totalServiceGrossINR: 0,
        totalserviceGSTAmount: 0,
        totalserviceSellINR: 0,
        totalserviceNetUSD: 0,
        totalserviceUSDCommission: 0,
        totalCreditCardFees: 0,
        totalserviceUSDClientDollar: 0,
        totalCommissionAmount: 0
    });
    let tourItineraryServiceList = ArrayHelper.getValue(props.TourItinerarySelected, 'tourItineraryService');
//   console.log(tourItineraryServiceList,"tourItineraryServiceListtourItineraryServiceList");
  
    
       
    useEffect(() => {
        const allSelectedItems = new Set();
        let newTotals = { ...totals };

        tourItineraryServiceList.forEach((item, index) => {
            // allSelectedItems.add(index);
            if (item.isChecked) {
                allSelectedItems.add(index);  
            }
            newTotals.totalCost += ArrayHelper.getValue(item, 'cost');
            newTotals.totalServiceGTICommission += ArrayHelper.getValue(item, 'serviceGTICommission');
            newTotals.totalServiceGrossINR += ArrayHelper.getValue(item, 'serviceGrossINR');
            newTotals.totalserviceGSTAmount += (ArrayHelper.getValue(item, 'serviceGSTPercentage') * ArrayHelper.getValue(item, 'serviceGrossINR')) / 100;
            newTotals.totalserviceSellINR += ArrayHelper.getValue(item, 'serviceSellINR');
            newTotals.totalserviceNetUSD += ArrayHelper.getValue(item, 'serviceNetUSD');
            newTotals.totalserviceUSDCommission += ArrayHelper.getValue(item, 'serviceUSDCommission');
            newTotals.totalCreditCardFees += (ArrayHelper.getValue(item, 'serviceUSDClientDollar') - (ArrayHelper.getValue(item, 'serviceNetUSD') + ArrayHelper.getValue(item, 'serviceUSDCommission')));
            newTotals.totalserviceUSDClientDollar += ArrayHelper.getValue(item, 'serviceUSDClientDollar');
            newTotals.totalCommissionAmount += ArrayHelper.getValue(item, 'agentCommissionValue');
        });

        setSelectedItems(allSelectedItems);
        setTotals(newTotals);
    }, [shortBy, props.TourItinerarySelected,tourItineraryServiceList]);

 
    if (costFilter === 'withCost') {
        tourItineraryServiceList = tourItineraryServiceList.filter(item => ArrayHelper.getValue(item, 'cost') > 0);
    } else if (costFilter === 'withoutCost') {
        tourItineraryServiceList = tourItineraryServiceList.filter(item => ArrayHelper.getValue(item, 'cost') === 0);
    }

    if (shortBy === "cityName") {
        tourItineraryServiceList = orderBy(tourItineraryServiceList, [(o) => o.cityName], ["asc"]);
    } else if (shortBy === "vendorTypeName") {
        tourItineraryServiceList = orderBy(tourItineraryServiceList, [(o) => o.vendorTypeName], ["asc"]);
    } else if (shortBy === "vendorName") {
        tourItineraryServiceList = orderBy(tourItineraryServiceList, [(o) => o.vendorName], ["asc"]);
    }

    useEffect(() => {
        const updatedPerPersonCost = calculatePerPersonCost(selectedItems);  
        setPerPersonCost(updatedPerPersonCost);  
    }, [selectedItems]);
    
    
    useEffect(() => {
        const updatedTotals = calculateTotals(tourItineraryServiceList);
        setTotals(updatedTotals);
        // console.log(tourItineraryServiceList,"tourItineraryServiceListtourItineraryServiceList");
        
    }, [shortBy, props.TourItinerarySelected, selectedItems]);

    const calculateTotals = (items) => {
        let newTotals = {
            totalCost: 0,
            totalServiceGTICommission: 0,
            totalServiceGrossINR: 0,
            totalserviceGSTAmount: 0,
            totalserviceSellINR: 0,
            totalserviceNetUSD: 0,
            totalserviceUSDCommission: 0,
            totalCreditCardFees: 0,
            totalserviceUSDClientDollar: 0,
            totalCommissionAmount: 0
        };

        items.forEach((item, index) => {
            if (selectedItems.has(index)) {
                newTotals.totalCost += ArrayHelper.getValue(item, 'cost');
                newTotals.totalServiceGTICommission += ArrayHelper.getValue(item, 'serviceGTICommission');
                newTotals.totalServiceGrossINR += ArrayHelper.getValue(item, 'serviceGrossINR');
                newTotals.totalserviceGSTAmount += (ArrayHelper.getValue(item, 'serviceGSTPercentage') * ArrayHelper.getValue(item, 'serviceGrossINR')) / 100;
                newTotals.totalserviceSellINR += ArrayHelper.getValue(item, 'serviceSellINR');
                newTotals.totalserviceNetUSD += ArrayHelper.getValue(item, 'serviceNetUSD');
                newTotals.totalserviceUSDCommission += ArrayHelper.getValue(item, 'serviceUSDCommission');
                newTotals.totalCreditCardFees += (ArrayHelper.getValue(item, 'serviceUSDClientDollar') - (ArrayHelper.getValue(item, 'serviceNetUSD') + ArrayHelper.getValue(item, 'serviceUSDCommission')));
                newTotals.totalserviceUSDClientDollar += ArrayHelper.getValue(item, 'serviceUSDClientDollar');
                newTotals.totalCommissionAmount += ArrayHelper.getValue(item, 'agentCommissionValue');
            }
        });

        return newTotals;
    };

    // useEffect(() => {
    //     // console.log("Updated tour itinerary1111111:", tourItineraryServiceList);
    // }, [tourItineraryServiceList]);
    

    const handleCheckboxChange = (key, item) => {
        const updatedTourItineraryServiceList = [...tourItineraryServiceList];
        const updatedItem = updatedTourItineraryServiceList.find((i) => i.id === item.id);
        
        if (updatedItem) {
            updatedItem.isChecked = !updatedItem.isChecked;
        }
        setTourItineraryData(updatedTourItineraryServiceList);  
        setSelectedItems((prevSelectedItems) => {
            const newSelectedItems = new Set(prevSelectedItems);
            if (newSelectedItems.has(key)) {
                newSelectedItems.delete(key);
            } else {
                newSelectedItems.add(key); 
            }
            const updatedTotals = calculateTotals(updatedTourItineraryServiceList);
            setTotals(updatedTotals);
            const updatedPerPersonCost = calculatePerPersonCost(newSelectedItems);
            setPerPersonCost(updatedPerPersonCost);
            
            return newSelectedItems; 
        });
    };

    const calculatePerPersonCost = (selectedItems) => {
        let totalSellINR = 0;
        let totalPeople = 0;
    
        tourItineraryServiceList.forEach((item, index) => {
            if (selectedItems.has(index)) {
                const noofAdults = ArrayHelper.getValue(item, 'noofAdult', 0);
                const noofGuests = ArrayHelper.getValue(item, 'noofGuest', 0);

                const totalPersonCount = noofAdults + noofGuests;
                if (totalPersonCount > 0) {
                    const sellINR = ArrayHelper.getValue(item, 'serviceSellINR', 0);
                    totalSellINR += sellINR 
                    totalPeople = totalPersonCount;
   
                    
                }
            }
        });
    
        const totalPerPersonCost = totalPeople > 0 ? totalSellINR / totalPeople : 0;
    
        return totalPerPersonCost.toFixed(2);  
    };
    const handleSave = () => {
        const updatedData = tourItineraryServiceList
            .filter((item) => item.isChecked)
            .map((item) => {
                const formatDate = (dateString) => {
                    const date = new Date(dateString); 
                    return date.toISOString().split('T')[0] + 'T10:00:00.000Z';
                };
    
                return {
                    id: item.id,
                    tourRecordId: item.tourRecordId,
                    itineraryId: item.itineraryId,
                    serviceId: item.serviceId,
                    serviceFeesId: item.serviceFeesId,
                    cityId: item.cityId,
                    cityName: item.cityName,
                    stateId: item.stateId,
                    stateName: item.stateName,
                    countryId: item.countryId,
                    countryName: item.countryName,
                    serviceName: item.serviceName,
                    vendorId: item.vendorId,
                    vendorName: item.vendorName,
                    vendorTypeId: item.vendorTypeId,
                    vendorTypeName: item.vendorTypeName,
                    serviceDescription: item.serviceDescription,
                    rate: item.rate,
                    rateType: item.rateType,
                    description: item.description,
                    cost: item.cost,
                    unit: item.unit,
                    startDate: formatDate(item.startDate), 
                    endDate: formatDate(item.endDate),     
                    markupPercentage: item.markupPercentage,
                    markupAmount: item.markupAmount,
                    isShowOnItinerary: item.isShowOnItinerary,
                    serviceGTICommission: item.serviceGTICommission,
                    serviceGrossINR: item.serviceGrossINR,
                    serviceGSTPercentage: item.serviceGSTPercentage,
                    serviceSellINR: item.serviceSellINR,
                    serviceNetUSD: item.serviceNetUSD,
                    serviceUSDMarkupPercentage: item.serviceUSDMarkupPercentage,
                    serviceUSDCommission: item.serviceUSDCommission,
                    serviceUSDClientDollar: item.serviceUSDClientDollar,
                    agentCommissionType: item.agentCommissionType,
                    agentCommissionByPercentage: item.agentCommissionByPercentage,
                    agentCommissionValue: item.agentCommissionValue,
                    quoteType: item.quoteType,
                    quoteTypeName: item.quoteTypeName,
                    creditCardFees: item.creditCardFees,
                    mealPlan: item.mealPlan,
                    noofGuest: item.noofGuest,
                    noofAdult: item.noofAdult,
                    noofChild: item.noofChild,
                    origin: item.origin,
                    destination: item.destination,
                    flightNo: item.flightNo,
                    pnr: item.pnr,
                    taxAmount: item.taxAmount,
                    isChecked: item.isChecked
                };
            });
    
        // console.log(updatedData, "updatedDataupdatedData");
    
        const data = {
            "requestedUserId": parseInt(localStorage.getItem(USER_ID)),
            "tourItinerary": {
                "id": ArrayHelper.getValue(props.TourItinerarySelected, 'id'),
                "tourRecordId": ArrayHelper.getValue(props.TourItinerarySelected, 'tourRecordId'),
                "name": ArrayHelper.getValue(props.TourItinerarySelected, 'name'),
                "subtitle": ArrayHelper.getValue(props.TourItinerarySelected, 'subtitle'),
                "description": ArrayHelper.getValue(props.TourItinerarySelected, 'description'),
                "comments": ArrayHelper.getValue(props.TourItinerarySelected, 'comments'),
                "notesFrom": ArrayHelper.getValue(props.TourItinerarySelected, 'notesFrom'),
                "isPrimary": ArrayHelper.getValue(props.TourItinerarySelected, 'isPrimary'),
                "itineraryMarkupType": ArrayHelper.getValue(props.TourItinerarySelected, 'itineraryMarkupType'),
                "itineraryMarkupAmount": ArrayHelper.getValue(props.TourItinerarySelected, 'itineraryMarkupAmount'),
                "itineraryUSMarkupAmount": ArrayHelper.getValue(props.TourItinerarySelected, 'itineraryUSMarkupAmount'),
                "itineraryCreditCardFees": ArrayHelper.getValue(props.TourItinerarySelected, 'itineraryCreditCardFees'),
                "itineraryAgentAmount": ArrayHelper.getValue(props.TourItinerarySelected, 'itineraryAgentAmount'),
                "tourItineraryService": updatedData
            }
        };
    
        SettingApi.PostSettingList(data, '/api/TourItinerary/UpdateTourItinerary')
            .then((response) => {
                console.log('Save successful:', response);
                if (response.tourItinerary?.[0]?.tourItineraryService?.[0]?.isChecked) {
                   
                        
                        console.log(response?.tourItinerary?.[0]?.tourItineraryService?.[0]?.isChecked); // true
                        console.log(response?.tourItinerary?.[1]?.tourItineraryService?.[0]?.isChecked);
                      
                      
                } else {
                    console.log("API Response Error:", response.message);
                }
            })
            .catch((error) => {
                console.error('Error saving:', error.response ? error.response : error);
                if (error.response && error.response.data) {
                    console.error('API Error:', error.response.data);
                }
            });
    };




 
    return (
        <React.Fragment>
            <div className={`border-box ${props.selectedTab !== 'Costing' ? 'hide' : ''}`}>
                <h2 className="pb-3">
                    {ArrayHelper.getValue(props.TourItinerarySelected, 'name')}
                    <span className="txt-right me-2 heading floatright">
                        Sort By Costing
                        <select
                            name="costFilter"
                            className="form-select form-select-sm"
                            value={costFilter}
                            onChange={(e) => setCostFilter(e.target.value)} 
                        >
                            <option value="withCost">With Cost</option>
                            <option value="withoutCost">Without Cost</option>
                        </select>
                    </span>
                    <span className="txt-right me-2 heading floatright">
                        Sort By
                        <select
                            name="sortBy"
                            className="form-select form-select-sm"
                            onChange={(e) => setShortBy(e.target.value)}
                        >
                            <option value="cityName">City</option>
                            <option value="vendorTypeName">Vendor Type</option>
                            <option value="vendorName">Vendor</option>
                        </select>
                    </span>
                </h2>
                {tourItineraryServiceList.length > 0 ? (
                    <table className="table table-striped rounded border">
                        <thead>
                            <tr>
                                <th className="width50">Select</th>
                                <th className="width50">S No.</th>
                                <th className="width150">Vendor Type</th>

                                {costFilter === 'withoutCost' ? (
                                    <>
                                        <th className="txt-right ">City</th>
                                        <th className="txt-right ">Start Date</th>
                                        <th className="txt-right ">End Date</th>
                                        <th className="txt-right ">Remarks</th>
                                    </>
                                ) : (
                                    <>
                                        <th className="width200">Vendor</th>
                                        <th className="width200">City</th>
                                        <th className="width200">Service</th>
                                        <th className="txt-right width150">Rate</th>
                                        <th className="txt-right width150">Unit</th>
                                        <th className="txt-right width150">Duration</th>
                                        <th className="txt-right width150">Cost</th>
                                        <th className="txt-right width150">GTI Commission</th>
                                        <th className="txt-right width150">Gross INR</th>
                                        <th className="txt-right width150">GST Amount</th>
                                        <th className="txt-right width150">Sell INR</th>
                                        <th className="txt-right width150">Net USD</th>
                                        <th className="txt-right width150">USD Commission</th>
                                        <th className="txt-right width150">Credit Card Fees</th>
                                        <th className="txt-right width150">USD Client Dollar</th>
                                        <th className="txt-right width150">Agent Commission</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {tourItineraryServiceList.map((item, key) => {
                                let serviceIdArray = ArrayHelper.getValue(item, 'serviceId').split(',');
                                let serviceName = '';

                          
                                for (let z = 0; z < serviceIdArray.length; z++) {
                                    if (z > 0) {
                                        serviceName = serviceName + '  ,  ';
                                    }
                                    serviceName = serviceName + ArrayHelper.getValue(props.serviceList.filter((_it) => _it.id == serviceIdArray[z]), '[0].name');
                                }
                                if (item.startDate === "1900-01-01T00:00:00") {
                                    item.startDate = "";
                                } else if (item.startDate !== "") {
                                    item.startDate = formatDate(item.startDate, DISPLAYDATEFORMATE);
                                }

                                if (item.endDate === "1900-01-01T00:00:00") {
                                    item.endDate = "";
                                } else if (item.endDate !== "") {
                                    item.endDate = formatDate(item.endDate, DISPLAYDATEFORMATE);
                                }
                                let CreditCardFees = 0;
                                CreditCardFees = ArrayHelper.getValue(item, 'serviceUSDClientDollar') - (ArrayHelper.getValue(item, 'serviceNetUSD') + ArrayHelper.getValue(item, 'serviceUSDCommission'));

                                return (
                                    <tr key={`toursList-${key}`}>
                                        <td className="txt-center">
                                            <input
                                                type="checkbox"
                                                name={`checkbox-${key}`}
                                                checked={selectedItems.has(key)}
                                                onChange={() => handleCheckboxChange(key, item)}
                                            />
                                        </td>
                                        <td>{key + 1}</td>
                                        <td>{ArrayHelper.getValue(item, 'vendorTypeName')}</td>
                                        <td>{ArrayHelper.getValue(item, 'vendorName')}</td>
                                        <td>{ArrayHelper.getValue(item, 'cityName')}</td>

                                        {costFilter === 'withoutCost' ? (
                                            <>
                                                <th>{ArrayHelper.getValue(item, 'startDate')}</th>
                                                <th>{ArrayHelper.getValue(item, 'endDate')}</th>
                                                <th>{ArrayHelper.getValue(item, 'description')}</th>
                                            </>
                                        ) : (
                                            <>
                                                <td>{serviceName}</td>
                                                <td className="txt-right">{Number(ArrayHelper.getValue(item, 'rate')).toFixed(2)}</td>
                                                <td className="txt-right">{ArrayHelper.getValue(item, 'unit')}</td>
                                                <td className="txt-right">
                                                    {(ArrayHelper.getValue(item, 'startDate') !== '' && ArrayHelper.getValue(item, 'endDate') !== '') ? DATEDURATION(ArrayHelper.getValue(item, 'startDate'), ArrayHelper.getValue(item, 'endDate')) : ''}
                                                </td>
                                                <td className="txt-right">{Number(ArrayHelper.getValue(item, 'cost', 1)).toFixed(2)}</td>
                                                <td className="txt-right">{Number(ArrayHelper.getValue(item, 'serviceGTICommission')).toFixed(2)}</td>
                                                <td className="txt-right">{Number(ArrayHelper.getValue(item, 'serviceGrossINR')).toFixed(2)}</td>
                                                <td className="txt-right">{((ArrayHelper.getValue(item, 'serviceGSTPercentage') * ArrayHelper.getValue(item, 'serviceGrossINR')) / 100).toFixed(2)}</td>
                                                <td className="txt-right">{Number(ArrayHelper.getValue(item, 'serviceSellINR')).toFixed(2)}</td>
                                                <td className="txt-right">{Number(ArrayHelper.getValue(item, 'serviceNetUSD')).toFixed(2)}</td>
                                                <td className="txt-right">{Number(ArrayHelper.getValue(item, 'serviceUSDCommission')).toFixed(2)}</td>
                                                <td className="txt-right">{Number(CreditCardFees).toFixed(2)}</td>
                                                <td className="txt-right">{Number(ArrayHelper.getValue(item, 'serviceUSDClientDollar')).toFixed(2)}</td>
                                                <td className="txt-right">{Number(ArrayHelper.getValue(item, 'agentCommissionValue')).toFixed(2)}</td>
                                            </>
                                        )}
                                    </tr>
                                );
                            })}

                            {costFilter === 'withCost' || costFilter === 'all' ? 
                            <tr>
                            <th className="txt-right" colSpan={props.displayType === 'Edit' ? 9 : 9}>
                                Total (Round Off)
                            </th>
                            <th className="txt-right">{Number(totals.totalCost).toFixed(0)}</th> 
                            <th className="txt-right">{Number(totals.totalServiceGTICommission).toFixed(0)}</th>
                            <th className="txt-right">{Number(totals.totalServiceGrossINR).toFixed(0)}</th>
                            <th className="txt-right">{Number(totals.totalserviceGSTAmount).toFixed(0)}</th>
                            <th className="txt-right">{Number(totals.totalserviceSellINR).toFixed(0)}</th>
                            <th className="txt-right">{Number(totals.totalserviceNetUSD).toFixed(0)}</th>
                            <th className="txt-right">{Number(totals.totalserviceUSDCommission).toFixed(0)}</th>
                            <th className="txt-right">{Number(totals.totalCreditCardFees).toFixed(0)}</th>
                            <th className="txt-right">{Number(totals.totalserviceUSDClientDollar).toFixed(0)}</th>
                            <th className="txt-right">{Number(totals.totalCommissionAmount).toFixed(0)}</th>
                        </tr> 
                        
                        : " "}

                        {costFilter === 'withCost' && perPersonCost.length > 0 && (
                                <tr>
                                 <th colSpan={16}></th>
                                    <th colSpan={4}>
                                         <table className="table table-striped border">
                                               <tbody>
                                                   <tr>
                                                     <td className="txt-right" colSpan={4}>
                                                
                                                     {props.perPersonCost.map((_item:any,key:any)=>{
                                    return(<tr key={`perPersonCost${key}`}><td className="txt-right">Per person cost for {ArrayHelper.getValue(_item,'noofGuest') + ArrayHelper.getValue(_item,'noofAdult')} :</td> <td className="txt-right">{perPersonCost}</td></tr>)
                                    })}
                                                    </td>
                                                 
                                                   </tr>
                                                   <tr>
                                                   <td className="txt-left" >
                                                    Single Room Supplement: 
                                                     </td>
                                                   </tr>
                                                   <tr>
                                                   <td className="txt-left" >
                                                   Triple Room Reduction:
                                                     </td>
                                                   </tr>
                                              </tbody>
                                         </table>
                                    </th>
                                 </tr>
                            )}


                        </tbody>
                    </table>
                ) : (
                    <div>No data available</div>
                )}

                <button type="button" className="btn btn-primary rounded" onClick={handleSave}>Save</button>

         
            </div>
        </React.Fragment>
    );
};

export default CostingViewComponent;
