import React from "react";
import { formatDate } from "../../../vendor/datefns";
import { ArrayHelper } from "../../../helpers/arrayhelper";
import { DISPLAYDATEFORMATE } from "../../../helpers/constants";

class TourItineraryServiceViewComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      tourItineraryService: [],
      filterOption: "withCost", // Set initial state to "withCost"
    };
  }

  // Set the filterOption to "withCost" when the component is mounted
  componentDidMount() {
    this.setState({ filterOption: "withCost" });
    console.log("Component mounted, initial state:", this.state); 
  }

  handleTabChange = (option) => {
    this.setState({ filterOption: option });
  };

  hasCost = (item) => {
    return (
      item.cost > 0 ||
      item.serviceNetUSD > 0 ||
      item.serviceUSDClientDollar > 0 ||
      item.serviceGrossINR > 0
    );
  };

  render() {
    const { filterOption } = this.state;

    // Filter itinerary services based on the selected filter option
    const filteredItineraryService = this.props.tourItineraryService.filter(
      (item) => {
        if (filterOption === "withCost") {
          return this.hasCost(item);
        }
        if (filterOption === "withoutCost") {
          return !this.hasCost(item);
        }
        return true; // Show all services for "all"
      }
    );

    return (
      <React.Fragment>
        {/* Tab Navigation */}
        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <a
              className={`nav-link ${filterOption === "withCost" ? "active" : ""}`}
              href="#"
              onClick={() => this.handleTabChange("withCost")}
            >
              With Cost
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${filterOption === "withoutCost" ? "active" : ""}`}
              href="#"
              onClick={() => this.handleTabChange("withoutCost")}
            >
              Without Cost
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${filterOption === "" ? "active" : ""}`}
              href="#"
              onClick={() => this.handleTabChange("")}
            >
              All
            </a>
          </li>
        </ul>

        {/* No Data Available Message */}
        {filteredItineraryService.length === 0 ? (
          <div className="alert alert-warning" role="alert">
            No data available.
          </div>
        ) : (
          <div
            className="accordion border-0 pt-3 p-4"
            id={`accordionSeviceExample-${this.props.ItenararyKey}`}
          >
            {filteredItineraryService.map((item, key) => {
              let serviceIdArray = ArrayHelper.getValue(item, "serviceId").split(",");
              let serviceName = "";

              for (let z = 0; z < serviceIdArray.length; z++) {
                if (z > 0) {
                  serviceName = serviceName + "  ,  ";
                }
                serviceName =
                  serviceName +
                  ArrayHelper.getValue(
                    this.props.serviceList.filter((_it) => _it.id == serviceIdArray[z]),
                    "[0].name"
                  );
              }

              // Format start and end dates
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

              // Calculate CreditCardFees
              let CreditCardFees = 0;
              CreditCardFees =
                ArrayHelper.getValue(item, "serviceUSDClientDollar") -
                (ArrayHelper.getValue(item, "serviceNetUSD") +
                  ArrayHelper.getValue(item, "serviceUSDCommission"));

              return (
                <div
                  className="accordion-item"
                  key={`internaryService-${this.props.ItenararyKey}-${key}`}
                >
                  <h2
                    className="accordion-header borderBottom"
                    id={`headingInternaryService-${this.props.ItenararyKey}-${key}`}
                  >
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapseInternaryService-${this.props.ItenararyKey}-${key}`}
                      aria-expanded="false"
                      aria-controls={`collapseInternaryService-${this.props.ItenararyKey}-${key}`}
                    >
                      Itinerary Service from {item.startDate} to {item.endDate}
                    </button>
                  </h2>

                  <div
                    id={`collapseInternaryService-${this.props.ItenararyKey}-${key}`}
                    className="accordion-collapse collapse show"
                    aria-labelledby={`headingInternaryService-${this.props.ItenararyKey}-${key}`}
                    data-bs-parent={`#accordionSeviceExample-${this.props.ItenararyKey}`}
                  >
                    <div className="accordion-body pb-0">
                      {/* Show minimal fields when the filterOption is "withoutCost" or "all" (and item has no cost) */}
                      {filterOption === "withoutCost" ||
                      (filterOption === "" && !this.hasCost(item)) ? (
                        <div className="d-flex mb-4">
                          <div className="flex-fill p-1" id="htmlstartDate">
                            <label className="form-label">Start Date</label>
                            <p>{item.startDate}</p>
                          </div>
                          <div className="flex-fill p-1" id="htmlstartDate">
                            <label className="form-label">End Date</label>
                            <p>{item.endDate}</p>
                          </div>
                          <div className="flex-fill p-1" id="htmlstartDate">
                            <label className="form-label">City</label>
                            <p>{item.cityName}</p>
                          </div>
                          <div className="d-flex mb-4">
                            <div className="flex-fill p-1" id="htmlstartDate">
                              <label className="form-label">Remarks</label>
                              <p>{item.description}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="d-flex mt-2 mb-4 borderBottom">
                            <div className="flex-fill p-1" id="htmlstartDate">
                              <label className="form-label">Vendor Type</label>
                              <p>{item.vendorTypeName}</p>
                            </div>
                            <div className="flex-fill p-1" id="htmlstartDate">
                              <label className="form-label">Start Date</label>
                              <p>{item.startDate}</p>
                            </div>

                            {this.hasCost(item) && filterOption === "withCost" && (
                              <>
                                <div className="flex-fill p-1" id="htmlstartDate">
                                  <label className="form-label">Country</label>
                                  <p>{item.countryName}</p>
                                </div>
                                <div className="flex-fill p-1" id="htmlstartDate">
                                  <label className="form-label">State</label>
                                  <p>{item.stateName}</p>
                                </div>
                                <div className="flex-fill p-1" id="htmlstartDate">
                                  <label className="form-label">City</label>
                                  <p>{item.cityName}</p>
                                </div>
                              </>
                            )}

                            <div className="flex-fill p-1" id="htmlstartDate">
                              <label className="form-label">Vendor</label>
                              <p>{item.vendorName}</p>
                            </div>
                            <div className="flex-fill p-1 width200" id="htmlstartDate">
                              <label className="form-label">Service</label>
                              <p>{serviceName}</p>
                            </div>
                          </div>

                          <div className="d-flex mb-4 borderBottom">
                            <div className="flex-fill p-1" id="htmlstartDate">
                              <label className="form-label">Rate</label>
                              <p>{item.rate}</p>
                            </div>
                            <div className="flex-fill p-1" id="htmlstartDate">
                              <label className="form-label">Unit</label>
                              <p>{item.unit}</p>
                            </div>

                            <div className="flex-fill p-1" id="htmlstartDate">
                              <label className="form-label">No. of Guest</label>
                              <p>{item.noofGuest}</p>
                            </div>

                            <div className="flex-fill p-1" id="htmlstartDate">
                              <label className="form-label">Meal Plan</label>
                              <p>{item.mealPlan}</p>
                            </div>

                            <div className="flex-fill p-1" id="htmlstartDate">
                              <label className="form-label">Tax Amount</label>
                              <p>{item.taxAmount}</p>
                            </div>

                            <div className="flex-fill p-1" id="htmlstartDate">
                              <label className="form-label">Cost</label>
                              <p>{item.cost}</p>
                            </div>

                            <div className="flex-fill p-1" id="htmlstartDate">
                              <label className="form-label">GTI Commission</label>
                              <p>{item.serviceGTICommission}</p>
                            </div>

                            <div className="flex-fill p-1" id="htmlstartDate">
                              <label className="form-label">GTI Gross (INR)</label>
                              <p>{item.serviceGrossINR}</p>
                            </div>

                            <div className="flex-fill p-1" id="htmlstartDate">
                              <label className="form-label">GTI GST Percentage</label>
                              <p>{item.serviceGSTPercentage}</p>
                            </div>
                            <div className="flex-fill p-1" id="htmlstartDate">
                              <label className="form-label">GTI Sell (INR)</label>
                              <p>{item.serviceSellINR}</p>
                            </div>
                          </div>

                          <div className="d-flex mb-4 borderBottom">
                            <div className="flex-fill p-1" id="htmlstartDate">
                              <label className="form-label">GTI Sales Amount(INR)</label>
                              <p>{item.serviceSellINR}</p>
                            </div>
                            <div className="flex-fill p-1" id="htmlstartDate">
                              <label className="form-label">GTI Commission (INR)</label>
                              <p>{item.serviceUSDCommission}</p>
                            </div>
                            <div className="flex-fill p-1" id="htmlstartDate">
                              <label className="form-label">Credit Card Fees(INR)</label>
                              <p>{item.creditCardFees}</p>
                            </div>
                            <div className="flex-fill p-1" id="htmlstartDate">
                              <label className="form-label">GTI US Payable Amount Exclude Tax(INR)</label>
                              <p>{item.serviceUSDClientDollar}</p>
                            </div>

                            <div className="flex-fill p-1" id="htmlstartDate">
                              <label className="form-label">Agent Commission Amount(INR)</label>
                              <p>{item.agentCommissionValue}</p>
                            </div>

                            <div className="flex-fill p-1" id="htmlstartDate">
                              <label className="form-label">Quote Type</label>
                              <p>{item.quoteTypeName}</p>
                            </div>

                            <div className="flex-fill p-1" id="htmlstartDate">
                              <label className="form-label">Show On Itinerary</label>
                              <p>{item.isShowOnItinerary ? "Yes" : "No"}</p>
                            </div>
                          </div>

                          <div className="d-flex mb-4">
                            <div className="flex-fill p-1" id="htmlstartDate">
                              <label className="form-label">Description</label>
                              <p>{item.description}</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default TourItineraryServiceViewComponent;
