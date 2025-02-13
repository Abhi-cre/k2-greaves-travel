import React from "react";
import { connect } from "react-redux";
import * as actionTypesUser from "../../../store/action/settings.action";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { ArrayHelper } from "../../../helpers/arrayhelper";
import SettingApi from "../../../api/Setting.api";
import LoaderComponent from "../../../components/LoaderComponent";
import PassengerFieldFormComponent from "./PassengerFieldFormComponent";
import FlightFieldFormComponent from "./FlightFieldFormComponent";
import MessagesFieldFormComponent from "./MessagesFieldFormComponent";
import NotesFieldFormComponent from "./NotesFieldFormComponent";
import PaymentFieldFormComponent from "./PaymentFieldFormComponent";
import VendorPaymentFieldFormComponent from "./VendorPaymentFieldFormComponent";
import { addsDays, subsDays, formatDate } from "../../../vendor/datefns";
import DropdownList from "react-widgets/DropdownList";
import "react-widgets/styles.css";
//const DropdownList  = require('react-widgets/lib/DropdownList');
//import $ from 'jquery'
declare var $;
class ToursFieldFormComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      tourNameListAll: [],
      toursData: [],
      agentFilterList: [],
      tourTypeList: [],
      greavesStatusList: [],
      clientStatusList: [],
      salesRegionList: [],
      userList: [],
      hearedAboutList: [],
      tourNameList: [],
    };
  }

  componentWillMount() {
    this.dataTypeList();
    this.setState({
      hearedAboutList: this.props.hearedAboutList,
      tourNameList: this.props.tourNameList,
    });
  }

  dataTypeList = async () => {
    let agentFilterList = this.props.agentList.filter(
      (__item) =>
        __item.agencyId ==
        ArrayHelper.getValue(this.props.toursData, "[0].agencyId")
    );
    setTimeout(() => {
      this.setState({ agentFilterList: agentFilterList });
    }, 10);
    let tourNameList = this.state.tourNameList;
    if (this.props.toursListData.length > 0) {
      this.props.toursListData.map((item: any) => {
        tourNameList = tourNameList.concat([
          { id: item.tourName, name: item.tourName },
        ]);
      });
    } else {
      let response = await SettingApi.GetSettingList("/api/TourRecord/List");
      if (ArrayHelper.getValue(response, "isSuccess") == true) {
        ArrayHelper.getValue(response, "tourRecords").map((item: any) => {
          tourNameList = tourNameList.concat([
            { id: item.tourName, name: item.tourName },
          ]);
        });
      }
    }
    this.setState({
      tourNameList: tourNameList,
      tourNameListAll: tourNameList,
    });

    this.setState({ agentFilterList: this.props.agentList });

    let tourTypeListData = this.props.tourTypeListData;
    if (tourTypeListData.length > 0) {
      this.setState({ tourTypeList: tourTypeListData });
    } else {
      this.setState({ loader: true });
      let response = await SettingApi.GetSettingList("/api/TourType/List");
      if (ArrayHelper.getValue(response, "isSuccess") == true) {
        this.setState({
          loader: false,
          tourTypeList: ArrayHelper.getValue(response, "tourTypes"),
        });
        this.props.tourTypeListInfo(
          ArrayHelper.getValue(response, "tourTypes")
        );
      } else {
        this.setState({ loader: false });
      }
    }
    let greavesStatusListData = this.props.greavesStatusListData;
    if (greavesStatusListData.length > 0) {
      this.setState({ greavesStatusList: greavesStatusListData });
    } else {
      this.setState({ loader: true });
      let response = await SettingApi.GetSettingList("/api/GreavesStatus/List");
      if (ArrayHelper.getValue(response, "isSuccess") == true) {
        this.setState({
          loader: false,
          greavesStatusList: ArrayHelper.getValue(response, "greavesStatuses"),
        });
        this.props.greavesStatusListInfo(
          ArrayHelper.getValue(response, "greavesStatuses")
        );
      } else {
        this.setState({ loader: false });
      }
    }
    let clientStatusListData = this.props.clientStatusListData;
    if (clientStatusListData.length > 0) {
      this.setState({ clientStatusList: clientStatusListData });
    } else {
      this.setState({ loader: true });
      let response = await SettingApi.GetSettingList("/api/ClientStatus/List");
      if (ArrayHelper.getValue(response, "isSuccess") == true) {
        this.setState({
          loader: false,
          clientStatusList: ArrayHelper.getValue(response, "clientStatuses"),
        });
        this.props.clientStatusListInfo(
          ArrayHelper.getValue(response, "clientStatuses")
        );
      } else {
        this.setState({ loader: false });
      }
    }
    let salesRegionListData = this.props.salesRegionListData;
    if (salesRegionListData.length > 0) {
      console.log("-=-=-=-=");

      this.setState({ salesRegionList: salesRegionListData });
    } else {
      this.setState({ loader: true });
      let response = await SettingApi.GetSettingList("/api/SalesRegion/List");
      if (ArrayHelper.getValue(response, "isSuccess") == true) {
        console.log(response, "responseresponse-==-");

        this.setState({
          loader: false,
          salesRegionList: ArrayHelper.getValue(response, "salesRegions"),
        });
        this.props.salesRegionListInfo(
          ArrayHelper.getValue(response, "salesRegions")
        );
      } else {
        this.setState({ loader: false });
      }
    }
    let userListData = this.props.userListData;
    if (userListData.length > 0) {
      this.setState({ userList: userListData });
    } else {
      this.setState({ loader: true });
      let response = await SettingApi.GetSettingList("/api/User/List");
      if (ArrayHelper.getValue(response, "isSuccess") == true) {
        let userList = ArrayHelper.getValue(response, "userDetails").map(
          (Item) => {
            Item.fullName = Item.firstName + " " + Item.lastName;
            return Item;
          }
        );
        this.setState({ loader: false, userList: userList });
        this.props.userListInfo(userList);
      } else {
        this.setState({ loader: false });
      }
    }
  };

  handleToursInput(index: number, key: string, value: any) {
    this.setState({
      toursData: this.props.toursData.map((item: any, k: number) => {
        if (index == k) {
          if (key == "tourRecordId") {
            item[key] = value.replace("--", "-").replace(/[^A-Z0-9,-]/gi, "");
          } else if (key == "noOfPax") {
            if (value <= 0) {
              item[key] = 1;
            } else if (value <= 99) {
              item[key] = value;
            } else {
              item[key] = "1";
            }
          } else if (key == "exitingTr") {
            item[key] = !value;
            if (item[key] == false) {
              item["tourRecordId"] = "";
            }
          } else if (key == "currency") {
            item[key] = value;

            let settingName = value + "-ROE";
            let appSettingList = this.props.appSettingList.filter(
              (_it) => _it.settingName == settingName
            );
            item["fileUSDROE"] = ArrayHelper.getValue(
              appSettingList,
              "[0].settingValue"
            );
          } else if (key == "agencyId") {
            item[key] = value;
            item["agentId"] = "";
            let agentFilterList = this.props.agentList.filter(
              (__item) => __item.agencyId == value
            );
            setTimeout(() => {
              this.setState({ agentFilterList: agentFilterList });
            }, 10);
          } else {
            item[key] = value;
          }
        }

        return item;
      }),
    });
  }

  handleOnSearch = (string, results) => {
    let tourNameList = this.state.tourNameListAll.filter(
      (_it) => _it.name.search(new RegExp(string.trim(), "i")) != -1
    );

    this.setState({ tourNameList: tourNameList });
    this.handleToursInput(0, "tourName", string);
  };

  handleOnHover = (result) => {
    this.handleToursInput(0, "tourName", result.name);
  };

  handleOnSelect = (item) => {
    this.handleToursInput(0, "tourName", item.name);
  };

  handleOnFocus = () => {
    console.log("Focused");
  };
  handleOnSearchAboutGreaves = (string, results) => {
    let hearedAboutList = this.props.hearedAboutList.filter(
      (_it) => _it.name.search(new RegExp(string.trim(), "i")) != -1
    );

    this.setState({ hearedAboutList: hearedAboutList });
    this.handleToursInput(0, "hearedAbout", string);
  };

  handleOnHoverAboutGreaves = (result) => {
    this.handleToursInput(0, "hearedAbout", result.name);
  };

  handleOnSelectAboutGreaves = (item) => {
    this.handleToursInput(0, "hearedAbout", item.name);
  };

  handleOnFocusAboutGreaves = () => {
    console.log("Focused");
  };
  componentDidMount() {
    // $("#tourStartDate").datepicker({minDate:"+0d"})
    $("#tourStartDate")
      .datepicker()
      .on("change", (e: any) => {
        $("#tourEndDate").datepicker(
          "option",
          "minDate",
          addsDays(e.target.value, 1)
        );
        $("#serviveStartDate").datepicker(
          "option",
          "minDate",
          addsDays(e.target.value, 0)
        );
        $("#serviceEndDate").datepicker(
          "option",
          "minDate",
          addsDays(e.target.value, 0)
        );
        $("#flightDepartureDate").datepicker(
          "option",
          "minDate",
          addsDays(e.target.value, 0)
        );
        $("#flightArrivalDate").datepicker(
          "option",
          "minDate",
          addsDays(e.target.value, 0)
        );
        this.handleToursInput(0, "tourStartDate", e.target.value);
      });
    //$("#tourEndDate").datepicker({minDate:"+0d"})
    $("#tourEndDate")
      .datepicker()
      .on("change", (e: any) => {
        $("#tourStartDate").datepicker(
          "option",
          "maxDate",
          subsDays(e.target.value, 1)
        );
        $("#serviveStartDate").datepicker(
          "option",
          "maxDate",
          subsDays(e.target.value, 0)
        );
        $("#serviceEndDate").datepicker(
          "option",
          "maxDate",
          subsDays(e.target.value, 0)
        );
        $("#flightDepartureDate").datepicker(
          "option",
          "maxDate",
          subsDays(e.target.value, 0)
        );
        $("#flightArrivalDate").datepicker(
          "option",
          "maxDate",
          subsDays(e.target.value, 0)
        );
        this.handleToursInput(0, "tourEndDate", e.target.value);
      });
  }

  render() {
    return (
      <React.Fragment>
        <LoaderComponent loader={this.state.loader} />
        <div
          className={`borderless-box ${
            this.props.selectedTab == "Tours" || this.props.selectedTab == ""
              ? "show"
              : "hide"
          }`}
        >
          <div className="maininfo">
            <div className="d-flex mb-2">
              <div className="flex-fill p-1">
                <label className="form-label">Lead Traveler Name</label>
                <input
                  required
                  maxLength={50}
                  value={ArrayHelper.getValue(
                    this.props.toursData,
                    "[0].traveler_name"
                  )}
                  onChange={(event: any) =>
                    this.handleToursInput(
                      0,
                      "traveler_name",
                      event.currentTarget.value
                    )
                  }
                  name="traveler_name"
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Enter Traveler Name"
                />
              </div>
              <div className="flex-fill p-1 maxWwidth90">
                <label className="form-label">PAX Number</label>
                <input
                  required
                  type="number"
                  value={ArrayHelper.getValue(
                    this.props.toursData,
                    "[0].noOfPax"
                  )}
                  maxLength={2}
                  onChange={(event: any) =>
                    this.handleToursInput(
                      0,
                      "noOfPax",
                      event.currentTarget.value
                    )
                  }
                  className="form-control form-control-sm"
                  placeholder="Enter PAX Number"
                />
              </div>
              <div className="flex-fill p-1">
                <label className="form-label">Email</label>
                <input
                  maxLength={50}
                  required
                  type="email"
                  value={ArrayHelper.getValue(
                    this.props.toursData,
                    "[0].traveler_email"
                  )}
                  onChange={(event: any) =>
                    this.handleToursInput(
                      0,
                      "traveler_email",
                      event.currentTarget.value
                    )
                  }
                  name="traveler_email"
                  className="form-control form-control-sm"
                  placeholder="Enter Email"
                />
              </div>

              <div className="flex-fill p-1">
                <label className="form-label">Contact Number</label>
                <input
                  maxLength={15}
                  type="text"
                  value={ArrayHelper.getValue(
                    this.props.toursData,
                    "[0].traveler_cell"
                  )}
                  onChange={(event: any) =>
                    this.handleToursInput(
                      0,
                      "traveler_cell",
                      event.currentTarget.value
                    )
                  }
                  name="traveler_cell"
                  className="form-control form-control-sm"
                  placeholder="Enter Contact Number"
                />
              </div>
              {/* <div className="flex-fill p-1">
                            <label  className="form-label">Social Link</label>
                            <input type="text" value={ArrayHelper.getValue(this.props.toursData,'[0].traveler_socialLink')}
                                             onChange={(event: any) => this.handleToursInput(0, 'traveler_socialLink', event.currentTarget.value)}
                                               name="traveler_socialLink"   className="form-control form-control-sm"  placeholder="Enter Social Link"/>
                        </div> */}
              <div className="flex-fill p-1">
                <label className="form-label">
                  How did you hear about Greaves
                </label>
                <ReactSearchAutocomplete
                  items={this.state.hearedAboutList}
                  onSearch={this.handleOnSearchAboutGreaves}
                  onHover={this.handleOnHoverAboutGreaves}
                  onSelect={this.handleOnSelectAboutGreaves}
                  onFocus={this.handleOnFocusAboutGreaves}
                  showIcon={false}
                  showClear={false}
                  minMatchCharLength={3}
                  placeholder={ArrayHelper.getValue(
                    this.props.toursData,
                    "[0].hearedAbout"
                  )}
                  autoFocus
                />
              </div>
              <div className="flex-fill p-1">
                <label className="form-label">TR Currency</label>
                <select
                  required
                  className="form-select form-select-sm"
                  name="currencyId"
                  value={ArrayHelper.getValue(
                    this.props.toursData,
                    "[0].currency"
                  )}
                  onChange={(event: any) =>
                    this.handleToursInput(
                      0,
                      "currency",
                      event.currentTarget.value
                    )
                  }
                  aria-label=".form-select-sm example"
                >
                  <option value="">Select Currency</option>
                  <option value="USD">USD</option>
                  <option value="INR">INR</option>
                  <option value="POUND">Pound</option>
                </select>
              </div>
              <div className="flex-fill p-1">
                <label className="form-label">ROE</label>
                <input
                  required
                  type="number"
                  className="form-control form-control-sm"
                  name="fileUSDROE"
                  value={ArrayHelper.getValue(
                    this.props.toursData,
                    "[0].fileUSDROE"
                  )}
                  onChange={(event: any) =>
                    this.handleToursInput(
                      0,
                      "fileUSDROE",
                      event.currentTarget.value
                    )
                  }
                  placeholder="Enter ROE"
                />
              </div>
            </div>

            <div className="d-flex  mb-2">
              <div className="flex-fill p-1">
                <label className="form-label">Lead Type</label>

                <select
                  required
                  className="form-select form-select-sm"
                  value={ArrayHelper.getValue(
                    this.props.toursData,
                    "[0].leadType"
                  )}
                  onChange={(event: any) =>
                    this.handleToursInput(
                      0,
                      "leadType",
                      event.currentTarget.value
                    )
                  }
                  name="leadType"
                  aria-label=".form-select-sm example"
                >
                  <option value="">Select Lead Type</option>
                  <option value="Agency">Agency</option>
                  <option value="Direct">Direct</option>
                  {/* <option value="Email">Email</option>
                                                <option value="Chat">Chat</option>
                                                <option value="Other">Other</option> */}
                </select>
              </div>
              <div
                className={`flex-fill p-1 ${
                  ArrayHelper.getValue(this.props.toursData, "[0].leadType") !=
                  "Agency"
                    ? "show"
                    : "hide"
                }`}
              >
                <label className="form-label">Lead Description</label>
                <input
                  maxLength={100}
                  type="text"
                  className="form-control form-control-sm"
                  name="leadValue"
                  value={ArrayHelper.getValue(
                    this.props.toursData,
                    "[0].leadValue"
                  )}
                  onChange={(event: any) =>
                    this.handleToursInput(
                      0,
                      "leadValue",
                      event.currentTarget.value
                    )
                  }
                  placeholder="Enter Description"
                />
              </div>
              <div
                className={`flex-fill p-1 ${
                  ArrayHelper.getValue(this.props.toursData, "[0].leadType") ==
                  "Agency"
                    ? "show"
                    : "hide"
                }`}
              >
                <label className="form-label">Agency Name</label>
                <DropdownList
                  filter
                  data={this.props.agencyList}
                  placeholder="Select Agnecy"
                  onChange={(event: any) =>
                    this.handleToursInput(0, "agencyId", event.id)
                  }
                  defaultValue={ArrayHelper.getValue(
                    this.props.toursData,
                    "[0].agencyId"
                  )}
                  dataKey="id"
                  textField="name"
                />
              </div>
              <div
                className={`flex-fill p-1 ${
                  ArrayHelper.getValue(this.props.toursData, "[0].leadType") ==
                  "Agency"
                    ? "show"
                    : "hide"
                }`}
              >
                <label className="form-label">Agent name</label>
                <select
                  className="form-select form-select-sm"
                  name="agentId"
                  value={ArrayHelper.getValue(
                    this.props.toursData,
                    "[0].agentId"
                  )}
                  onChange={(event: any) =>
                    this.handleToursInput(
                      0,
                      "agentId",
                      event.currentTarget.value
                    )
                  }
                >
                  <option value="">Select Agent</option>
                  {this.props.agentList.length > 0
                    ? this.props.agentList
                        .filter(
                          (__item) =>
                            __item.agencyId ==
                            ArrayHelper.getValue(
                              this.props.toursData,
                              "[0].agencyId"
                            )
                        )
                        .map((item, key) => {
                          return (
                            <option
                              key={`agentFilterList-${key}`}
                              value={ArrayHelper.getValue(item, "id")}
                            >
                              {ArrayHelper.getValue(item, "title")}{" "}
                              {ArrayHelper.getValue(item, "fname")}{" "}
                              {ArrayHelper.getValue(item, "mname")}{" "}
                              {ArrayHelper.getValue(item, "lname")}
                            </option>
                          );
                        })
                    : ""}
                </select>
                {/* <DropdownList filter
                                  data={this.state.agentFilterList}
                                  placeholder="Select Agent"
                                  onChange={(event: any) => this.handleToursInput(0, 'agentId', event.id)}
                                  defaultValue={ArrayHelper.getValue(this.props.toursData,'[0].agentId')}
                                  dataKey='id'
                                  textField='fullName' /> */}
              </div>

              <div
                className={`flex-fill p-1 ${
                  ArrayHelper.getValue(this.props.toursData, "[0].leadType") ==
                    "Agency" &&
                  ArrayHelper.getValue(this.props.toursData, "[0].agentId") !=
                    ""
                    ? "show"
                    : "hide"
                }`}
              >
                <label className="form-label">Email Address</label>
                <br />
                {ArrayHelper.getValue(
                  this.props.agentList.filter(
                    (item) =>
                      item.id ==
                      ArrayHelper.getValue(this.props.toursData, "[0].agentId")
                  ),
                  "[0].email"
                )}
              </div>
              <div
                className={`flex-fill p-1 ${
                  ArrayHelper.getValue(this.props.toursData, "[0].leadType") ==
                    "Agency" &&
                  ArrayHelper.getValue(this.props.toursData, "[0].agentId") !=
                    ""
                    ? "show"
                    : "hide"
                }`}
              >
                <label className="form-label">Contact No </label>
                <br />
                {ArrayHelper.getValue(
                  this.props.agentList.filter(
                    (item) =>
                      item.id ==
                      ArrayHelper.getValue(this.props.toursData, "[0].agentId")
                  ),
                  "[0].contactNo"
                )}
              </div>

              <div className="flex-fill p-1">
                <label className="form-label">Sales Region</label>
                <DropdownList
                  filter
                  data={this.state.salesRegionList}
                  placeholder="Select Sales Region"
                  onChange={(event: any) =>
                    this.handleToursInput(0, "salesRegionId", event.id)
                  }
                  defaultValue={ArrayHelper.getValue(
                    this.props.toursData,
                    "[0].salesRegionId"
                  )}
                  dataKey="id"
                  textField="name"
                />
              </div>
              <div className="flex-fill p-1">
                <label className="form-label">
                  Wetu Link{" "}
                  {ArrayHelper.getValue(this.props.toursData, "[0].wetuLink") !=
                  "" ? (
                    <spna>
                      {" "}
                      ->{" "}
                      <a
                        target="_blank"
                        href={ArrayHelper.getValue(
                          this.props.toursData,
                          "[0].wetuLink"
                        )}
                      >
                        View Link
                      </a>
                    </spna>
                  ) : (
                    ""
                  )}
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  name="wetuLink"
                  value={ArrayHelper.getValue(
                    this.props.toursData,
                    "[0].wetuLink"
                  )}
                  onChange={(event: any) =>
                    this.handleToursInput(
                      0,
                      "wetuLink",
                      event.currentTarget.value
                    )
                  }
                  placeholder="Enter Wetu Link"
                />
              </div>
              <div
                className={`flex-fill p-1 ${
                  ArrayHelper.getValue(this.props.toursData, "[0].leadType") ==
                  "Agency"
                    ? "show"
                    : "hide"
                }`}
              >
                <label className="form-label"></label>
                <br />
                <a
                  data-bs-toggle="modal"
                  data-bs-target="#agencyAdd"
                  className="btn addInternary btn-outlined"
                >
                  {" "}
                  <i className="fa-sharp fa-solid fa-plus"></i> Add Agency
                </a>
              </div>
              <div
                className={`flex-fill p-1 ${
                  ArrayHelper.getValue(this.props.toursData, "[0].leadType") ==
                  "Agency"
                    ? "show"
                    : "hide"
                }`}
              >
                <label className="form-label"></label>
                <br />
                <a
                  data-bs-toggle="modal"
                  data-bs-target="#agentAdd"
                  className="btn addInternaryService  btn-outlined"
                >
                  {" "}
                  <i className="fa-sharp fa-solid fa-plus"></i> Add Agent
                </a>
              </div>
            </div>

            <div className="d-flex  mb-2">
              {ArrayHelper.getValue(this.props.toursData, "[0].id") == "" ? (
                <div className="flex-fill p-1">
                  <label className="form-label">Exitsig TR Number:</label>
                  <br />
                  <input
                    maxLength={50}
                    onChange={(event: any) =>
                      this.handleToursInput(
                        0,
                        "exitingTr",
                        ArrayHelper.getValue(
                          this.props.toursData,
                          "[0].exitingTr"
                        )
                      )
                    }
                    value={ArrayHelper.getValue(
                      this.props.toursData,
                      "[0].exitingTr"
                    )}
                    type="checkbox"
                  />
                </div>
              ) : (
                ""
              )}
              {ArrayHelper.getValue(this.props.toursData, "[0].id") == "" &&
              ArrayHelper.getValue(this.props.toursData, "[0].exitingTr") ==
                true ? (
                <div className="flex-fill p-1">
                  <label className="form-label">Tour Id</label>
                  <input
                    maxLength={50}
                    type="text"
                    className="form-control form-control-sm"
                    name="tourRecordId"
                    value={ArrayHelper.getValue(
                      this.props.toursData,
                      "[0].tourRecordId"
                    )}
                    onChange={(event: any) =>
                      this.handleToursInput(
                        0,
                        "tourRecordId",
                        event.currentTarget.value
                      )
                    }
                    placeholder="Enter Tour Id"
                  />
                </div>
              ) : (
                ""
              )}
              {ArrayHelper.getValue(this.props.toursData, "[0].id") != "" ? (
                <div className="flex-fill p-1">
                  <label className="form-label">Tour Id</label>
                  <br />
                  {ArrayHelper.getValue(
                    this.props.toursData,
                    "[0].tourRecordId"
                  )}
                </div>
              ) : (
                ""
              )}
              <div className="flex-fill p-1 width220">
                <label className="form-label">Tour Name</label>

                <ReactSearchAutocomplete
                  items={this.state.tourNameList}
                  onSearch={this.handleOnSearch}
                  onHover={this.handleOnHover}
                  onSelect={this.handleOnSelect}
                  onFocus={this.handleOnFocus}
                  showIcon={false}
                  showClear={false}
                  placeholder={ArrayHelper.getValue(
                    this.props.toursData,
                    "[0].tourName"
                  )}
                  autoFocus
                />
                {/* <input required type="text" className="form-control form-control-sm" name="tourName" 
                                            value={ArrayHelper.getValue(this.props.toursData,'[0].tourName')}
                                            onChange={(event: any) => this.handleToursInput(0, 'tourName', event.currentTarget.value)}
                                            placeholder="Enter Tour Name"/> */}
              </div>
              <div className="flex-fill p-1">
                <label className="form-label">Tour Start Date:</label>
                {/* <br/> */}
                <input
                  readOnly
                  id="tourStartDate"
                  required
                  type="text"
                  placeholder="Enter Tour Start Date"
                  className="form-control form-control-sm tourStartDate"
                  name="tourStartDate"
                  value={formatDate(
                    ArrayHelper.getValue(
                      this.props.toursData,
                      "[0].tourStartDate"
                    )
                  )}
                />
                {/* <DateTimePicker required={true} placeholderText="Enter Tour Start Date"   name="tourStartDate"  format={DATEFORMTEOFDATE} onChange={(date:Date) => this.handleToursInput(0, 'tourStartDate', date)} value={ArrayHelper.getValue(this.props.toursData,'[0].tourStartDate')} /> */}
                {/* <DatePicker     timeFormat={false} inputProps={inputProps}   name="tourStartDate" 
                                             value={ArrayHelper.getValue(this.props.toursData,'[0].tourStartDate')}
                                             onChange={(date:Date) => this.handleToursInput(0, 'tourStartDate', date)}
                                            placeholder="Enter Tour Start Date"   className=" formdate form-noradious"    /> */}
              </div>
              <div className="flex-fill p-1">
                <label className="form-label">Tour End Date</label>
                <input
                  readOnly
                  id="tourEndDate"
                  required
                  type="text"
                  placeholder="Enter Tour Start Date"
                  className="form-control form-control-sm tourEndDate"
                  name="tourEndDate"
                  value={formatDate(
                    ArrayHelper.getValue(
                      this.props.toursData,
                      "[0].tourEndDate"
                    )
                  )}
                />
                {/* <br/> */}
                {/* <DateTimePicker  required={true} returnValue="start" minDate={new Date(ArrayHelper.getValue(this.props.toursData,'[0].tourStartDate'))} placeholderText="Enter Tour Start Date"   name="tourEndDate"  format={DATEFORMTEOFDATE}  onChange={(date:Date) => this.handleToursInput(0, 'tourEndDate', date)} value={ArrayHelper.getValue(this.props.toursData,'[0].tourEndDate')} /> */}
                {/* <DatePicker initialViewDate={new Date((ArrayHelper.getValue(this.props.toursData,'[0].tourStartDate')!='')?formatDate(ArrayHelper.getValue(this.props.toursData,'[0].tourStartDate'),'yyyy-MM-dd'):'')} timeFormat={false} inputProps={inputProps}    name="tourEndDate" value={ArrayHelper.getValue(this.props.toursData,'[0].tourEndDate')}
                                             onChange={(date:Date) => this.handleToursInput(0, 'tourEndDate', date)} placeholder="Enter Tour End Date"   className=" formdate form-noradious"    /> */}
              </div>
              <div className="flex-fill p-1">
                <label className="form-label">Tour Type</label>
                <DropdownList
                  filter
                  data={this.state.tourTypeList}
                  placeholder="Select Tour Type"
                  onChange={(event: any) =>
                    this.handleToursInput(0, "tourTypeId", event.id)
                  }
                  defaultValue={ArrayHelper.getValue(
                    this.props.toursData,
                    "[0].tourTypeId"
                  )}
                  dataKey="id"
                  textField="name"
                />
              </div>
              <div className="flex-fill p-1 dreavesStatus">
                <label className="form-label"> Greaves Status</label>
                <DropdownList
                  filter
                  data={this.state.greavesStatusList}
                  placeholder="Select Greaves Status"
                  onChange={(event: any) =>
                    this.handleToursInput(0, "statusFromGreavesId", event.id)
                  }
                  defaultValue={ArrayHelper.getValue(
                    this.props.toursData,
                    "[0].statusFromGreavesId"
                  )}
                  dataKey="id"
                  textField="name"
                />
              </div>
              <div className="flex-fill p-1">
                <label className="form-label">Client Status</label>
                <DropdownList
                  filter
                  data={this.state.clientStatusList}
                  placeholder="Select Client Status"
                  onChange={(event: any) =>
                    this.handleToursInput(0, "statusFromClientId", event.id)
                  }
                  defaultValue={ArrayHelper.getValue(
                    this.props.toursData,
                    "[0].statusFromClientId"
                  )}
                  dataKey="id"
                  textField="name"
                />
              </div>
              <div className="flex-fill p-1">
                <label className="form-label">Operation Staff</label>

                <DropdownList
                  filter
                  data={this.state.userList.filter(
                    (item) => item.departmentId == "2"
                  )}
                  placeholder="Select Operation Staff"
                  onChange={(event: any) =>
                    this.handleToursInput(0, "gtinConsultantId", event.id)
                  }
                  defaultValue={ArrayHelper.getValue(
                    this.props.toursData,
                    "[0].gtinConsultantId"
                  )}
                  dataKey="id"
                  textField="fullName"
                />
              </div>
              <div className="flex-fill p-1">
                <label className="form-label">Sales Staff</label>

                <DropdownList
                  filter
                  data={this.state.userList.filter(
                    (item) => item.departmentId == "1"
                  )}
                  placeholder="Select Sales Staff"
                  onChange={(event: any) =>
                    this.handleToursInput(0, "gtusConsultantId", event.id)
                  }
                  defaultValue={ArrayHelper.getValue(
                    this.props.toursData,
                    "[0].gtusConsultantId"
                  )}
                  dataKey="id"
                  textField="fullName"
                />
              </div>
            </div>
            {ArrayHelper.getValue(this.props.toursData, "[0].id") != "" ? (
              <div className="d-flex  mb-2">
                <div className="flex-fill p-1">
                  {" "}
                  <button className="btn btn-primary rounded"> Update</button>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="p-3 border mt-2 mb-2 boxAddPassanger">
            <div className="row p-1">
              <NotesFieldFormComponent
                NotesData={this.props.NotesData}
                addNotes={(e: any) => this.props.addNotes(e)}
                deleteNotes={(e) => this.props.deleteNotes(e)}
                NotesList={this.props.NotesList}
                showField="yes"
              />
              <MessagesFieldFormComponent
                MessagesData={this.props.MessagesData}
                addMessage={(e: any) => this.props.addMessage(e)}
                deleteMessage={(e) => this.props.deleteMessage(e)}
                MessagesList={this.props.MessagesList}
                showField="yes"
              />
            </div>
          </div>
          <PassengerFieldFormComponent
            noOfPax={ArrayHelper.getValue(this.props.toursData, "[0].noOfPax")}
            traveler_name={ArrayHelper.getValue(
              this.props.toursData,
              "[0].traveler_name"
            )}
            traveler_cell={ArrayHelper.getValue(
              this.props.toursData,
              "[0].traveler_cell"
            )}
            traveler_email={ArrayHelper.getValue(
              this.props.toursData,
              "[0].traveler_email"
            )}
            PassengerData={this.props.PassengerData}
            PassengerList={this.props.PassengerList}
            addPassenger={(e: any) => this.props.addPassenger(e)}
            deletePassenger={(e, e2) => this.props.deletePassenger(e, e2)}
          />

          <FlightFieldFormComponent
            tourStartDate={ArrayHelper.getValue(
              this.props.toursData,
              "[0].tourStartDate"
            )}
            tourEndDate={ArrayHelper.getValue(
              this.props.toursData,
              "[0].tourEndDate"
            )}
            FlightData={this.props.FlightData}
            FlightList={this.props.FlightList}
            addFlight={(e: any) => this.props.addFlight(e)}
            deleteFlight={(e, e2) => this.props.deleteFlight(e, e2)}
            showHideLoder={(e) => this.props.showHideLoder(e)}
          />
          <PaymentFieldFormComponent
            PaymentData={this.props.PaymentData}
            PaymentList={this.props.PaymentList}
            addPayment={(e: any) => this.props.addPayment(e)}
            deletePayment={(e, e2) => this.props.deletePayment(e, e2)}
          />
          <VendorPaymentFieldFormComponent
            vendorList={this.props.vendorList}
            VendorPaymentData={this.props.VendorPaymentData}
            VendorPaymentList={this.props.VendorPaymentList}
            addVendorPayment={(e: any) => this.props.addVendorPayment(e)}
            deleteVendorPayment={(e, e2) =>
              this.props.deleteVendorPayment(e, e2)
            }
          />
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(
    state.settingsData.salesRegionList,
    "state.settingsData.salesRegionList,state.settingsData.salesRegionList,"
  );

  return {
    agencyListData: state.settingsData.agencyList,
    agentListData: state.settingsData.agentList,
    greavesOfficeListData: state.settingsData.greavesOfficeList,
    tourTypeListData: state.settingsData.tourTypeList,
    greavesStatusListData: state.settingsData.greavesStatusList,
    clientStatusListData: state.settingsData.clientStatusList,
    salesRegionListData: state.settingsData.salesRegionList,
    userListData: state.settingsData.userList,
    toursListData: state.settingsData.toursList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    agencyListInfo: (data) =>
      dispatch({ type: actionTypesUser.AGENCY_LIST, payload: data }),
    agentListInfo: (data) =>
      dispatch({ type: actionTypesUser.AGENT_LIST, payload: data }),
    greavesOfficeListInfo: (data) =>
      dispatch({ type: actionTypesUser.GREAVES_OFFICE_LIST, payload: data }),
    tourTypeListInfo: (data) =>
      dispatch({ type: actionTypesUser.TOUR_TYPE_LIST, payload: data }),
    greavesStatusListInfo: (data) =>
      dispatch({ type: actionTypesUser.GREAVES_STATUS_LIST, payload: data }),
    clientStatusListInfo: (data) =>
      dispatch({ type: actionTypesUser.CLIENT_STATUS_LIST, payload: data }),
    salesRegionListInfo: (data) =>
      dispatch({ type: actionTypesUser.SALES_REGION_LIST, payload: data }),
    userListInfo: (data) =>
      dispatch({ type: actionTypesUser.USER_LIST, payload: data }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToursFieldFormComponent);
