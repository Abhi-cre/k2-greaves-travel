import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import * as actionTypesUser from "../../store/action/settings.action";
import ToursViewComponent from "./views/ToursViewComponent";
import TourItineraryViewComponent from "./views/TourItineraryViewComponent";
import CostingViewComponent from "./views/CostingViewComponent";
import QuotationViewComponent from "./views/QuotationViewComponent";
import VendorMailComposeComponent from "./views/VendorMailComposeComponent";
import ClientMailLogViewComponent from "./views/ClientMailLogViewComponent";
import VendorMailLogViewComponent from "./views/VendorMailLogViewComponent";
import { USER_ID } from "../../helpers/constants";
import { ArrayHelper } from "../../helpers/arrayhelper";
import SettingApi from "../../api/Setting.api";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
declare var $;
class ToursViewRecordComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      selectedTab: "Tours",
      toursSelectedData: {},
      TourItineraryData: [],
      TourItinerarySelected: {},
      TourItineraryMaster: {},
      quotationList: [],
      PassengerData: [],
      MessagesList: [],
      NotesList: [],
      FlightData: [],
      PaymentData: [],
      VendorPaymentData: [],
      vendorList: [],
      serviceList: [],
      perPersonCost: [],
    };
  }
  componentWillMount() {
    let toursSelectedData = this.props.toursSelectedData;
    if (ArrayHelper.getValue(toursSelectedData, "id") == "") {
      setTimeout(() => {
        this.props.history("/tours");
      }, 1000);
    } else {
      this.getPassengerList(ArrayHelper.getValue(toursSelectedData, "id"));
      this.getMessageList(ArrayHelper.getValue(toursSelectedData, "id"));
      this.getNotesList(ArrayHelper.getValue(toursSelectedData, "id"));
      this.getFlightList(ArrayHelper.getValue(toursSelectedData, "id"));
      this.getPaymentList(ArrayHelper.getValue(toursSelectedData, "id"));
      this.getVendorPaymentList(ArrayHelper.getValue(toursSelectedData, "id"));
      this.getItinerary();
      this.getVendorList();
      this.getServiceList();
    }
    this.setState({ toursSelectedData: toursSelectedData });
  }
  getServiceList = async () => {
    let serviceListData = this.props.serviceListData;
    if (serviceListData.length > 0) {
      this.setState({ serviceList: serviceListData });
    } else {
      let response = await SettingApi.GetSettingList("/api/Service/List");
      if (ArrayHelper.getValue(response, "isSuccess") == true) {
        this.setState({
          loader: false,
          serviceList: ArrayHelper.getValue(response, "services"),
        });
        this.props.serviceListInfo(ArrayHelper.getValue(response, "services"));
      } else {
        this.setState({ loader: false });
      }
    }
  };
  getItinerary = async () => {
    let data = {
      requestedUserId: parseInt(localStorage.getItem(USER_ID)),
      tourRecordId: ArrayHelper.getValue(this.props.toursSelectedData, "id"),
    };
    let response = await SettingApi.PostSettingList(
      data,
      "/api/TourItinerary/ListByTourId"
    );
    if (ArrayHelper.getValue(response, "isSuccess") == true) {
      if (ArrayHelper.getValue(response, "tourItinerary").length > 0) {
        this.setState({
          loader: false,
          TourItineraryData: ArrayHelper.getValue(response, "tourItinerary"),
        });
        let TourItinerarySelected = ArrayHelper.getValue(
          response,
          "tourItinerary"
        ).filter((item) => item.isPrimary == true);

        if (TourItinerarySelected.length > 0) {
          this.setState({
            TourItinerarySelected: TourItinerarySelected[0],
            TourItineraryMaster: TourItinerarySelected[0],
          });
        } else {
          this.setState({
            TourItinerarySelected: ArrayHelper.getValue(
              response,
              "tourItinerary"
            )[0],
            TourItineraryMaster: ArrayHelper.getValue(
              response,
              "tourItinerary"
            )[0],
          });
        }

        setTimeout(() => {
          this.getQuatationList();
        }, 10);
      }
    } else {
      this.setState({ loader: false });
    }
  };

  selectTab(e) {
    $(".dropdown-menu").removeClass("show");
    this.setState({ selectedTab: e });
    if (e == "Costing" || e == "Quotation") {
      setTimeout(() => {
        this.getPerPesionCost();
      }, 5);
    }
  }
  getPerPesionCost = async () => {
    let data = {
      tourRecordId: ArrayHelper.getValue(this.state.toursSelectedData, "id"),
      itineraryId: ArrayHelper.getValue(this.state.TourItinerarySelected, "id"),
    };
    this.setState({ loader: true });
    let response = await SettingApi.PostSettingList(
      data,
      "/api/TourSalesCosting/GetPerPersonCost"
    );
    if (ArrayHelper.getValue(response, "isSuccess") == true) {
      this.setState({
        loader: false,
        perPersonCost: ArrayHelper.getValue(response, "perPersonCost"),
      });
    }
  };
  selectItenary(e, e2 = "") {
    $(".dropdown-menu").removeClass("show");
    this.setState({ TourItinerarySelected: e });
    setTimeout(() => {
      this.getQuatationList();
    }, 10);
    this.selectTab(e2);
  }

  getQuatationList() {
    if (
      ArrayHelper.getValue(
        this.state.TourItinerarySelected,
        "tourItineraryService"
      ).length > 0
    ) {
      let quotationList = [];
      ArrayHelper.getValue(
        this.state.TourItinerarySelected,
        "tourItineraryService"
      ).map((item) => {
        let quotationListfilter = quotationList.filter(
          (_item) => _item.quoteType == item.quoteType
        );
        if (quotationListfilter.length == 0 && item.quoteTypeName != "") {
          quotationList.push({
            quoteType: item.quoteType,
            quoteTypeName: item.quoteTypeName,
          });
        }
      });
      this.setState({ quotationList: quotationList });
    } else {
      this.setState({ quotationList: [] });
    }
  }
  getPassengerList = async (id) => {
    this.setState({ loader: true });
    let data = {
      requestedUserId: parseInt(localStorage.getItem(USER_ID)),
      tourRecordId: id,
    };
    let response = await SettingApi.PostSettingList(
      data,
      "/api/TourPassenger/PassengerByTourId"
    );
    if (ArrayHelper.getValue(response, "isSuccess") == true) {
      this.setState({
        loader: false,
        PassengerData: ArrayHelper.getValue(response, "tourPassengers"),
      });
    } else {
      this.setState({ loader: false });
    }
  };
  getFlightList = async (id) => {
    this.setState({ loader: true });
    let data = {
      requestedUserId: parseInt(localStorage.getItem(USER_ID)),
      tourRecordId: id,
    };
    let response = await SettingApi.PostSettingList(
      data,
      "/api/TourFlights/FlightListByTourId"
    );
    if (ArrayHelper.getValue(response, "isSuccess") == true) {
      this.setState({
        loader: false,
        FlightData: ArrayHelper.getValue(response, "tourFlights"),
      });
    } else {
      this.setState({ loader: false });
    }
  };
  getPaymentList = async (id) => {
    this.setState({ loader: true });
    let data = {
      requestedUserId: parseInt(localStorage.getItem(USER_ID)),
      tourRecordId: id,
    };
    let response = await SettingApi.PostSettingList(
      data,
      "/api/TourPayment/PaymentByTourId"
    );
    if (ArrayHelper.getValue(response, "isSuccess") == true) {
      this.setState({
        loader: false,
        PaymentData: ArrayHelper.getValue(response, "tourPayments"),
      });
    } else {
      this.setState({ loader: false });
    }
  };
  getVendorPaymentList = async (id) => {
    this.setState({ loader: true });
    let data = {
      requestedUserId: parseInt(localStorage.getItem(USER_ID)),
      tourRecordId: id,
    };
    let response = await SettingApi.PostSettingList(
      data,
      "/api/VendorPayment/PaymentByTourId"
    );
    if (ArrayHelper.getValue(response, "isSuccess") == true) {
      this.setState({
        loader: false,
        VendorPaymentData: ArrayHelper.getValue(response, "vendorPayments"),
      });
    } else {
      this.setState({ loader: false });
    }
  };
  getMessageList = async (id) => {
    this.setState({ loader: true });
    let data = {
      tourRecordId: parseInt(id),
    };
    let response = await SettingApi.PostSettingList(
      data,
      "/api/TourComments/CommentByTourId"
    );
    if (ArrayHelper.getValue(response, "isSuccess") == true) {
      this.setState({
        loader: false,
        MessagesList: ArrayHelper.getValue(response, "tourComments"),
      });
    } else {
      this.setState({ loader: false });
    }
  };
  getNotesList = async (id) => {
    this.setState({ loader: true });
    let data = {
      tourRecordId: parseInt(id),
    };
    let response = await SettingApi.PostSettingList(
      data,
      "/api/TourCostingNotes/CostingNotesById"
    );
    if (ArrayHelper.getValue(response, "isSuccess") == true) {
      this.setState({
        loader: false,
        NotesList: ArrayHelper.getValue(response, "tourCostingNotes"),
      });
    } else {
      this.setState({ loader: false });
    }
  };
  printDocument() {
    let selectedTab = this.state.selectedTab;
    let htmldiv = "";
    if (selectedTab == "Costing") {
      htmldiv = "costingHTML";
    } else if (selectedTab == "Quotation") {
      htmldiv = "QuotationHTML";
    }
    const input = document.getElementById(htmldiv);
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "JPEG", 0, 0);
      // pdf.output('dataurlnewwindow');
      pdf.save("download.pdf");
    });
  }
  getVendorList = async () => {
    let vendorListData = this.props.vendorListData;
    if (vendorListData.length > 0) {
      this.setState({ vendorList: vendorListData });
    } else {
      this.setState({ loader: true });
      let response = await SettingApi.GetSettingList("/api/Vendor/List");
      if (ArrayHelper.getValue(response, "isSuccess") == true) {
        this.setState({
          loader: false,
          vendorList: ArrayHelper.getValue(response, "vendors"),
        });
        this.props.vendorListInfo(ArrayHelper.getValue(response, "vendors"));
      } else {
        this.setState({ loader: false });
      }
    }
  };
  render() {
    return (
      <React.Fragment>
        <div className={`p-4 ms-2 toursBlock`}>
          <div className={`w-100`}>
            <div className="row navbar navbar-expand-lg ">
              <div className="col-md-8 navbar-collapse">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <a
                      onClick={() => this.selectTab("Tours")}
                      className={`nav-link ${
                        this.state.selectedTab == "Tours" ? "active" : ""
                      }`}
                      aria-current="page"
                    >
                      Tours
                    </a>
                  </li>

                  {this.state.TourItineraryData.length > 0 ? (
                    <li className="nav-item dropdown">
                      <a
                        onClick={() => this.selectTab("Itinerary")}
                        className={`nav-link dropdown-toggle costing ${
                          this.state.selectedTab == "Itinerary" ? "active" : ""
                        }`}
                      >
                        Itinerary
                      </a>
                      <ul id="Itinerary" className="dropdown-menu">
                        {this.state.TourItineraryData.map((item, key) => {
                          return (
                            <li key={`Itinerary-${key}`}>
                              <a
                                className="dropdown-item"
                                onClick={() =>
                                  this.selectItenary(item, "Itinerary")
                                }
                              >
                                {" "}
                                {item.name}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  ) : (
                    ""
                  )}
                  {this.state.TourItineraryData.length > 0 ? (
                    <li className="nav-item dropdown">
                      <a
                        onClick={() => this.selectTab("Costing")}
                        className={`nav-link dropdown-toggle costing ${
                          this.state.selectedTab == "Costing" ? "active" : ""
                        }`}
                      >
                        Costing
                      </a>
                      <ul id="Costing" className="dropdown-menu">
                        {this.state.TourItineraryData.map((item, key) => {
                          return (
                            <li key={`costing-${key}`}>
                              <a
                                className="dropdown-item"
                                onClick={() =>
                                  this.selectItenary(item, "Costing")
                                }
                              >
                                {" "}
                                {item.name}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  ) : (
                    ""
                  )}

                  {this.state.TourItineraryData.length > 0 ? (
                    <li className="nav-item dropdown">
                      <a
                        onClick={() => this.selectTab("Quotation")}
                        className={`nav-link dropdown-toggle costing ${
                          this.state.selectedTab == "Quotation" ? "active" : ""
                        }`}
                      >
                        Quotation
                      </a>
                      <ul id="Quotation" className="dropdown-menu">
                        {this.state.TourItineraryData.map((item, key) => {
                          return (
                            <li key={`Quotation-${key}`}>
                              <a
                                className="dropdown-item"
                                onClick={() =>
                                  this.selectItenary(item, "Quotation")
                                }
                              >
                                {" "}
                                {item.name}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  ) : (
                    ""
                  )}
                  {this.state.TourItineraryData.length > 0 ? (
                    <li className="nav-item">
                      <a
                        onClick={() => this.selectTab("clientMailLog")}
                        className={`nav-link  costing ${
                          this.state.selectedTab == "clientMailLog"
                            ? "active"
                            : ""
                        }`}
                      >
                        Client Mail Log
                      </a>
                    </li>
                  ) : (
                    ""
                  )}
                  {this.state.TourItineraryData.length > 0 ? (
                    <li className="nav-item">
                      <a
                        onClick={() => this.selectTab("vendorMailLog")}
                        className={`nav-link  costing ${
                          this.state.selectedTab == "vendorMailLog"
                            ? "active"
                            : ""
                        }`}
                      >
                        Vendor Mail Log
                      </a>
                    </li>
                  ) : (
                    ""
                  )}
                  <li className="nav-item">
                    <a
                      onClick={() => this.selectTab("vendorMailCompose")}
                      className={`nav-link  costing ${
                        this.state.selectedTab == "vendorMailCompose"
                          ? "active"
                          : ""
                      }`}
                    >
                      Vendor Mail Compose
                    </a>
                  </li>
                </ul>
              </div>
              <div
                className="col-md-4 d-sm-inline-flex align-items-center justify-content-end"
                onMouseOver={() => {
                  $(".dropdown-menu").removeClass("show");
                }}
              >
                {this.state.selectedTab == "Tours" ? (
                  <div className="w-auto pt-2 pb-4 me-2">
                    <NavLink to="/tours/update-record">
                      {" "}
                      <button
                        type="button"
                        className="btn btn-outlined rounded"
                      >
                        Edit
                      </button>
                    </NavLink>
                  </div>
                ) : (
                  ""
                )}

                <div className="w-auto pt-2 pb-4">
                  <NavLink to="/tours">
                    {" "}
                    <button type="button" className="btn btn-primary rounded">
                      <i className="fa-sharp fa-solid fa-arrow-right"></i> Tours
                      List
                    </button>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
          <ToursViewComponent
            selectedTab={this.state.selectedTab}
            toursSelectedData={this.props.toursSelectedData}
            questionnaireList={this.props.questionnaireListData}
            TourItineraryMaster={this.state.TourItineraryMaster}
            PassengerData={this.state.PassengerData}
            MessagesList={this.state.MessagesList}
            NotesList={this.state.NotesList}
            FlightData={this.state.FlightData}
            PaymentData={this.state.PaymentData}
            VendorPaymentData={this.state.VendorPaymentData}
          />
          {this.state.TourItineraryData.length > 0 ? (
            <TourItineraryViewComponent
              selectedTab={this.state.selectedTab}
              TourItinerarySelected={this.state.TourItinerarySelected}
              MessagesList={this.state.MessagesList}
              NotesList={this.state.NotesList}
              serviceList={this.state.serviceList}
              currency={ArrayHelper.getValue(
                this.props.toursSelectedData,
                "currency"
              )}
            />
          ) : (
            ""
          )}
          {this.state.TourItineraryData.length > 0 ? (
            <CostingViewComponent
              perPersonCost={this.state.perPersonCost}
              serviceList={this.state.serviceList}
              selectedTab={this.state.selectedTab}
              TourItinerarySelected={this.state.TourItinerarySelected}
              currency={ArrayHelper.getValue(
                this.props.toursSelectedData,
                "currency"
              )}
              displayType="View"
            />
          ) : (
            ""
          )}

          {this.state.TourItineraryData.length > 0 ? (
            <QuotationViewComponent
              perPersonCost={this.state.perPersonCost}
              quotationList={this.state.quotationList}
              selectedTab={this.state.selectedTab}
              TourItinerarySelected={this.state.TourItinerarySelected}
              currency={ArrayHelper.getValue(
                this.props.toursSelectedData,
                "currency"
              )}
            />
          ) : (
            ""
          )}
          <VendorMailComposeComponent
            vendorList={this.state.vendorList}
            toursData={this.props.toursSelectedData}
            selectedTab={this.state.selectedTab}
          />
          {this.state.TourItineraryData.length > 0 ? (
            <ClientMailLogViewComponent
              vendorList={this.state.vendorList}
              selectedTab={this.state.selectedTab}
              toursData={this.props.toursSelectedData}
            />
          ) : (
            ""
          )}
          {this.state.TourItineraryData.length > 0 ? (
            <VendorMailLogViewComponent
              vendorList={this.state.vendorList}
              selectedTab={this.state.selectedTab}
              toursData={this.props.toursSelectedData}
            />
          ) : (
            ""
          )}
          <div className="text-end p-4">
            {this.state.selectedTab == "Tours" ? (
              <NavLink to="/tours/update-record">
                {" "}
                <button type="button" className="btn btn-outlined rounded">
                  Edit
                </button>
              </NavLink>
            ) : (
              ""
            )}

            <NavLink to="/tours">
              {" "}
              <button type="button" className="btn btn-primary rounded">
                <i className="fa-sharp fa-solid fa-arrow-right"></i> Tours List
              </button>
            </NavLink>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(
    state.settingsData.toursSelected,
    "toursSelectedDatatoursSelectedData"
  );

  return {
    toursSelectedData: state.settingsData.toursSelected,
    questionnaireListData: state.settingsData.questionnaireList,
    serviceListData: state.settingsData.serviceList,
    vendorListData: state.settingsData.vendorList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // agentTypeListInfo:(data)=>dispatch({type: actionTypesUser.AGENT_TYPE_LIST,payload:data}),
    serviceListInfo: (data) =>
      dispatch({ type: actionTypesUser.SERVICE_LIST, payload: data }),
    vendorListInfo: (data) =>
      dispatch({ type: actionTypesUser.VENDOR_LIST, payload: data }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToursViewRecordComponent);
