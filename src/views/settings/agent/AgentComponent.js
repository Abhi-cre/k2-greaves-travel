import React from "react";
import { connect } from "react-redux";
import * as actionTypesUser from "../../../store/action/settings.action";
import AgentAddComponent from "./AgentAddComponent";
import AgentUpdateComponent from "./AgentUpdateComponent";
import AgentViewComponent from "./AgentViewComponent";
import SettingApi from "../../../api/Setting.api";
import { ArrayHelper } from "../../../helpers/arrayhelper";
import PaginationComponent from "../../../components/PaginationComponent";
import { USER_ID } from "../../../helpers/constants";
import LoaderComponent from "../../../components/LoaderComponent";
import ExcelDownloadButton from "../../../components/ExcelDownloadButton";
class AgentComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      agentListAll: [],
      agentListFilter: [],
      agentList: [],
      selectedAgent: {},
      perPage: 8,
      currentPage: 1,
      fulllName: "",
      agencyName: "",
      agentTypeName: [],
      agentContactChannelName: "",
      agencyList: [],
      agentTypeList: [],
      filteredNames: [],
      filteredChannel: [],
      filteredAgency: [],
    };
  }
  componentDidMount() {
    let agentListData = this.props.agentListData;
    if (agentListData.length > 0) {
      let agentList = [];
      for (let i = 0; i < this.state.perPage; i++) {
        if (ArrayHelper.getValue(agentListData[i], "id") != "") {
          agentList.push(agentListData[i]);
        }
      }

      this.setState({
        agentListAll: agentListData,
        agentListFilter: agentListData,
        agentList: agentList,
      });
    } else {
      this.getAgentList();
    }
    this.getAgenttype();
    this.getAcgencytype();
  }
  getAgentList = async () => {
    this.setState({ loader: true });
    let response = await SettingApi.GetSettingList("/api/Agent/List");
    let agentListData = ArrayHelper.getValue(response, "agents").map((Item) => {
      Item.fulllName =
        Item.title + " " + Item.fname + " " + Item.mname + " " + Item.lname;
      return Item;
    });

    if (ArrayHelper.getValue(response, "isSuccess") == true) {
      let agentList = [];

      for (let i = 0; i < this.state.perPage; i++) {
        if (ArrayHelper.getValue(agentListData[i], "id") != "") {
          agentList.push(agentListData[i]);
        }
      }

      let agencyTypeListData = this.props.agencyTypeListData;

      if (agencyTypeListData.length > 0) {
        this.setState({ agentTypeList: agencyTypeListData });
      } else {
        let typeResponse = await SettingApi.GetSettingList(
          "/api/AgentType/List"
        );

        if (ArrayHelper.getValue(typeResponse, "isSuccess") === true) {
          const agentTypesList2 = ArrayHelper.getValue(
            typeResponse,
            "agentTypes"
          );
          this.setState({
            loader: false,
            agentTypeList: agentTypesList2,
          });
          this.props.agencyTypeList(agentTypesList2);
        }
      }

      this.setState({
        loader: false,
        agentListAll: agentListData,
        agentListFilter: agentListData,
        agentList: agentList,
      });
      setTimeout(() => {
        this.props.agentListInfo(agentListData);
      }, 10);
    } else {
      this.setState({ loader: false });
    }
  };
  componentWillReceiveProps(nextProps) {
    if (this.state.agentListFilter.length > 0) {
      const location = nextProps.params;
      if (
        location.page !== undefined &&
        location.page !== this.state.currentPage
      ) {
        let agentList = [];
        let numRecord = 0;
        let i = 0;
        i = (location.page - 1) * this.state.perPage;
        numRecord = location.page * this.state.perPage;

        for (i; i < numRecord; i++) {
          if (ArrayHelper.getValue(this.state.agentListFilter[i], "id") != "") {
            agentList.push(this.state.agentListFilter[i]);
          }
        }
        this.setState({
          currentPage: parseInt(location.page),
          agentList: agentList,
        });
      } else {
        let agentList = [];

        for (let i = 0; i < this.state.perPage; i++) {
          if (ArrayHelper.getValue(this.state.agentListFilter[i], "id") != "") {
            agentList.push(this.state.agentListFilter[i]);
          }
        }

        this.setState({ agentList: agentList, currentPage: 1 });
      }
    } else if (this.props.agentListData.length > 0) {
      this.setState({ agentList: [], currentPage: 1 });
    }
  }
  updatedAgentList = async (str) => {
    let agentListAll = this.state.agentListAll;
    agentListAll = agentListAll.map((item) => {
      if (item.id == str.id) {
        item = str;
        item.fulllName =
          str.title + " " + str.fname + " " + str.mname + " " + str.lname;
        return item;
      }
      return item;
    });
    let agentList = this.state.agentList;
    agentList = agentList.map((item) => {
      if (item.id == str.id) {
        item = str;
        item.fulllName =
          str.title + " " + str.fname + " " + str.mname + " " + str.lname;
        return item;
      }
      return item;
    });
    let agentListFilter = this.state.agentListFilter;
    agentListFilter = agentListFilter.map((item) => {
      if (item.id == str.id) {
        item = str;
        item.fulllName =
          str.title + " " + str.fname + " " + str.mname + " " + str.lname;
        return item;
      }
      return item;
    });

    this.setState({
      agentListAll: agentListAll,
      agentListFilter: agentListFilter,
      agentList: agentList,
      selectedAgent: str,
    });

    setTimeout(() => {
      this.props.agentListInfo(agentListAll);
    }, 10);
  };
  AgentDelete = async (str) => {
    console.log(str, "str");
    if (window.confirm("Do you want to delete selected Agent?")) {
      this.setState({ loader: true });

      let formData = {
        requestedUserId: parseInt(localStorage.getItem(USER_ID)),
        angentId: parseInt(str),
      };
      let response = await SettingApi.PostSettingList(
        formData,
        "/api/Agent/Delete"
      );
      if (ArrayHelper.getValue(response, "isSuccess") == true) {
        let agentListAll = this.state.agentListAll;
        agentListAll = agentListAll.filter((item) => item.id != str);
        let agentListFilter = this.state.agentListFilter;
        agentListFilter = agentListFilter.filter((item) => item.id != str);

        this.setState({
          loader: false,
          agentListAll: agentListAll,
          agentListFilter: agentListFilter,
        });
        setTimeout(() => {
          this.props.agentListInfo(agentListAll);
        }, 10);
        this.props.history("/settings/agent");
      }
    }
  };
  reloadWindow() {
    window.location.reload();
  }
  filterData() {
    this.setState({ loader: true });

    let agentListAll = this.state.agentListAll;

    let agentListFilter = agentListAll.map((item) => {
      item.display = true;
      if (
        item.fulllName.search(new RegExp(this.state.fulllName.trim(), "i")) ==
          -1 &&
        this.state.fulllName.trim() != ""
      ) {
        item.display = false;
      }

      if (
        item.agencyName.search(new RegExp(this.state.agencyName.trim(), "i")) ==
          -1 &&
        this.state.agencyName.trim() != ""
      ) {
        item.display = false;
      }

      if (
        this.state.agentContactChannelName.trim() !== "" &&
        item.agentContactChannelName.search(
          new RegExp(this.state.agentContactChannelName.trim(), "i")
        ) === -1
      ) {
        item.display = false;
      }

      if (
        item.agentTypeName.search(
          new RegExp(this.state.agentTypeName.trim(), "i")
        ) == -1 &&
        this.state.agentTypeName.trim() != ""
      ) {
        item.display = false;
      }

      return item;
    });

    let filteredAgents = agentListFilter.filter(
      (item) => item.display === true
    );

    console.log("Filtered Agents:", filteredAgents);

    this.setState({
      agentListFilter: filteredAgents,
      currentPage: 1,
    });

    setTimeout(() => {
      this.setState({ loader: false });
      this.props.history("/settings/agent");
    }, 10);
  }

  clearData() {
    this.setState({
      loader: true,
      fulllName: "",
      agencyName: "",
      agentTypeName: "",
      agentContactChannelName: "",
      currentPage: 1,
      agentListFilter: this.state.agentListAll,
    });
    setTimeout(() => {
      this.setState({ loader: false });
      this.props.history("/settings/agent");
    }, 10);
  }

  handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "fulllName") {
      const filteredNames = this.state.agentListFilter
        .map((user) => user.fulllName)
        .filter((fulllName) =>
          fulllName.toLowerCase().includes(value.toLowerCase())
        )
        .filter((value, index, self) => self.indexOf(value) === index);

      this.setState({ fulllName: value, filteredNames });
    } else if (name === "agentContactChannelName") {
      const filteredChannel = this.state.agentListFilter
        .map((user) => user.agentContactChannelName)
        .filter((agentContactChannelName) =>
          agentContactChannelName.toLowerCase().includes(value.toLowerCase())
        )
        .filter((value, index, self) => self.indexOf(value) === index);

      this.setState({ agentContactChannelName: value, filteredChannel });
    } else if (name === "agencyName") {
      const filteredAgency = this.state.agentListFilter
        .map((user) => user.agencyName)
        .filter((agencyName) =>
          agencyName.toLowerCase().includes(value.toLowerCase())
        )
        .filter((value, index, self) => self.indexOf(value) === index);

      this.setState({ agencyName: value, filteredAgency });
    } else {
      // For other fields, just update the state
      this.setState({ [name]: value });
    }
  };

  getAgenttype = async () => {
    this.setState({ loader: true });
    let agencyNameListData = this.props.agencyNameListData;
    console.log(agencyNameListData, "agencyNameListDataagencyNameListData");

    if (agencyNameListData.length > 0) {
      this.setState({ agencyList: agencyNameListData });
    }
    this.setState({ loader: false });
  };

  getAcgencytype = async () => {
    this.setState({ loader: true });
    let agencyTypeListData = this.props.agencyTypeListData;
    if (agencyTypeListData.length > 0) {
      this.setState({ agentTypeList: agencyTypeListData });
    }
    this.setState({ loader: false });
  };
  render() {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const day = ("0" + date.getDate()).slice(-2);
      return `${day}-${month}-${year}`;
    };

    const { agentListFilter, agentListAll } = this.state;
    const dataToExport =
      agentListFilter.length > 0 ? agentListFilter : agentListAll;
    const formattedData = dataToExport.map((item) => ({
      ...item,
      dob: item.dob ? formatDate(item.dob) : "",
    }));
    return (
      <React.Fragment>
        <LoaderComponent loader={this.state.loader} />
        <div
          className="tab-pane fade show active"
          id="AgentType-tab-pane"
          role="tabpanel"
          aria-labelledby="AgentType-tab"
          tabIndex="0"
        >
          <div className="p-4">
            <div className="row mb-3">
              <div className="col-md-2">
                <br />
                <h5 className="">Agent</h5>
              </div>
              <div className="col-md-8">
                <div className="row g-3 align-items-center">
                  <div className="col-sm-2">
                    <label>Name </label>

                    <input
                      type="text"
                      name="fulllName"
                      value={this.state.fulllName}
                      onChange={this.handleChange}
                      className="form-control"
                      placeholder="Name"
                      list="nameSuggestions"
                    />
                    <datalist id="nameSuggestions">
                      {this.state.filteredNames.map((name, index) => (
                        <option key={index} value={name} />
                      ))}
                    </datalist>
                  </div>

                  <div className="col-sm-2">
                    <label>Agency </label>
                    {/* <select
                      required
                      className="form-select form-noradious"
                      name="agencyName"
                      value={this.state.agencyName}
                      onChange={this.handleChange}
                    >
                      <option value="">Agency</option>
                      {Array.isArray(this.state.agencyList) &&
                        this.state.agencyList.map((item, key) => (
                          <option key={`agencyList-${key}`} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                    </select> */}

                    <input
                      type="text"
                      name="agencyName"
                      value={this.state.agencyName}
                      onChange={this.handleChange}
                      className="form-control"
                      placeholder="Agency Name"
                      list="agencyNameSuggestions"
                    />
                    <datalist id="agencyNameSuggestions">
                      {this.state.filteredAgency.map((name, index) => (
                        <option key={index} value={name} />
                      ))}
                    </datalist>
                  </div>
                  <div className="col-sm-2">
                    <label>Agent Type </label>
                    <select
                      required
                      className="form-select form-noradious"
                      name="agentTypeName"
                      value={this.state.agentTypeName}
                      onChange={this.handleChange}
                    >
                      <option value="">Agent Type</option>

                      {Array.isArray(this.state.agentTypeList) &&
                        this.state.agentTypeList.map((item, key) => (
                          <option
                            key={`agentTypeList-${key}`}
                            value={item.name}
                          >
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="col-sm-2">
                    <label>Contact Channel </label>
                    <input
                      type="text"
                      name="agentContactChannelName"
                      value={this.state.agentContactChannelName}
                      onChange={this.handleChange}
                      className="form-control"
                      placeholder="Contact Channel"
                      list="channelSuggestions"
                    />
                    <datalist id="channelSuggestions">
                      {this.state.filteredChannel.map((name, index) => (
                        <option key={index} value={name} />
                      ))}
                    </datalist>
                  </div>

                  <div className="col-sm-1 pt-4">
                    <button
                      onClick={() => this.filterData()}
                      type="button"
                      className="btn btn-sm btn-secondary rounded"
                    >
                      Submit
                    </button>
                  </div>
                  <div className="col-sm-1 pt-4">
                    <button
                      onClick={() => this.clearData()}
                      type="button"
                      className="btn btn-sm btn-secondary rounded"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-md-2 text-end">
                <br />
                <div className="d-flex align-items-center justify-content-end">
                  <a onClick={() => this.reloadWindow()}>
                    <img
                      style={{ height: "20px", marginRight: "20px" }}
                      src="/images/reload.png"
                    />
                  </a>
                  <button
                    data-bs-toggle="modal"
                    data-bs-target="#agentAdd"
                    className=""
                    style={{ marginRight: "20px" }}
                  >
                    <img
                      src="/images/add.png"
                      alt="Add"
                      style={{ height: "20px", width: "20px" }}
                    />
                  </button>

                  <ExcelDownloadButton
                    data={formattedData}
                    columns={[
                      "fulllName",
                      "agencyName",
                      "agentTypeName",
                      "agentContactChannelName",
                      "courtesyTitle",
                      "dob",
                      "address",
                      "cityName",
                      "stateName",
                      "countryName",
                      "zip",
                      "contactNo",
                      "specialties",
                    ]}
                    fileName="ActionTypes.xlsx"
                    sheetName="Action Types"
                  />
                </div>
              </div>
            </div>

            <div className="borderless-box">
              <div className="table-responsive">
                {this.state.agentList.length > 0 ? (
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Sr. No</th>
                        <th>Name</th>
                        <th>Agency</th>
                        <th>Agent Type</th>
                        <th>Contact Channel</th>
                        <th colSpan="3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.agentList.map((item, key) => {
                        return (
                          <tr key={`Agent-${key}`}>
                            {/* <td>{key+1}</td> */}
                            <td>
                              {(this.state.currentPage - 1) *
                                this.state.perPage +
                                key +
                                1}
                            </td>

                            <td>{ArrayHelper.getValue(item, "fulllName")}</td>

                            <td>{ArrayHelper.getValue(item, "agencyName")}</td>
                            <td>
                              {ArrayHelper.getValue(item, "agentTypeName")}
                            </td>
                            <td>
                              {ArrayHelper.getValue(
                                item,
                                "agentContactChannelName"
                              )}
                            </td>
                            <td>
                              <i
                                data-bs-toggle="modal"
                                data-bs-target="#agentView"
                                onClick={() => {
                                  this.setState({ selectedAgent: item });
                                }}
                                className="fa fa-eye btn"
                                data-bs-placement="top"
                                title="Edit"
                              ></i>
                            </td>
                            <td>
                              <i
                                data-bs-toggle="modal"
                                data-bs-target="#agentUpdate"
                                onClick={() => {
                                  this.setState({ selectedAgent: item });
                                }}
                                className="fa fa-edit btn"
                                data-bs-placement="top"
                                title="Edit"
                              ></i>
                            </td>
                            <td>
                              <i
                                onClick={() =>
                                  this.AgentDelete(
                                    ArrayHelper.getValue(item, "id")
                                  )
                                }
                                className="fa fa-trash btn"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="Trash"
                              ></i>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p>No Record Found</p>
                )}
                {this.state.agentListFilter.length > this.state.perPage ? (
                  <PaginationComponent
                    total={this.state.agentListFilter.length}
                    pageSize={this.state.perPage}
                    currentPage={this.state.currentPage}
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
        <AgentAddComponent getAgentList={() => this.getAgentList()} />
        <AgentUpdateComponent
          updatedAgentList={(str) => this.updatedAgentList(str)}
          selectedAgent={this.state.selectedAgent}
        />
        <AgentViewComponent selectedAgent={this.state.selectedAgent} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    agentListData: state.settingsData.agentList,
    agencyNameListData: state.settingsData.agencyList,
    agencyTypeListData: state.settingsData.agentTypeList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    agentListInfo: (data) =>
      dispatch({ type: actionTypesUser.AGENT_LIST, payload: data }),
    agencyNameList: (data) =>
      dispatch({ type: actionTypesUser.AGENCY_LIST, payload: data }),
    agencyTypeList: (data) =>
      dispatch({ type: actionTypesUser.AGENT_TYPE_LIST, payload: data }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AgentComponent);
