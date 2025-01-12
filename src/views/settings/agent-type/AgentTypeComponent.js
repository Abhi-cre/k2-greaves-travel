import React from "react";
import { connect } from "react-redux";
import * as actionTypesUser from "../../../store/action/settings.action";
import AgentTypeAddComponent from "./AgentTypeAddComponent";
import AgentTypeUpdateComponent from "./AgentTypeUpdateComponent";
import SettingApi from "../../../api/Setting.api";
import { ArrayHelper } from "../../../helpers/arrayhelper";
import PaginationComponent from "../../../components/PaginationComponent";
import { USER_ID } from "../../../helpers/constants";
import LoaderComponent from "../../../components/LoaderComponent";
import ExcelDownloadButton from "../../../components/ExcelDownloadButton";

class AgencyTypeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      agentTypeListAll: [],
      agentTypeListFilter: [],
      agentTypeList: [],
      selectedAgentType: {},
      perPage: 20,
      currentPage: 1,
      keyword: "",
      filteredNames: [],
    };
  }
  componentDidMount() {
    let agentTypeListData = this.props.agentTypeListData;
    if (agentTypeListData.length > 0) {
      let agentTypeList = [];
      for (let i = 0; i < this.state.perPage; i++) {
        if (ArrayHelper.getValue(agentTypeListData[i], "id") != "") {
          agentTypeList.push(agentTypeListData[i]);
        }
      }

      this.setState({
        agentTypeListAll: agentTypeListData,
        agentTypeListFilter: agentTypeListData,
        agentTypeList: agentTypeList,
      });
    } else {
      this.getAgentTypeList();
    }
  }
  getAgentTypeList = async () => {
    this.setState({ loader: true });
    let response = await SettingApi.GetSettingList("/api/AgentType/List");
    if (ArrayHelper.getValue(response, "isSuccess") == true) {
      let agentTypeList = [];

      for (let i = 0; i < this.state.perPage; i++) {
        if (
          ArrayHelper.getValue(
            ArrayHelper.getValue(response, "agentTypes")[i],
            "id"
          ) != ""
        ) {
          agentTypeList.push(ArrayHelper.getValue(response, "agentTypes")[i]);
        }
      }

      this.setState({
        loader: false,
        agentTypeListAll: ArrayHelper.getValue(response, "agentTypes"),
        agentTypeListFilter: ArrayHelper.getValue(response, "agentTypes"),
        agentTypeList: agentTypeList,
      });
      this.props.agentTypeListInfo(
        ArrayHelper.getValue(response, "agentTypes")
      );
    } else {
      this.setState({ loader: false });
    }
  };
  componentWillReceiveProps(nextProps) {
    if (this.state.agentTypeListFilter.length > 0) {
      const location = nextProps.params;
      if (
        location.page !== undefined &&
        location.page !== this.state.currentPage
      ) {
        let agentTypeList = [];
        let numRecord = 0;
        let i = 0;
        i = (location.page - 1) * this.state.perPage;
        numRecord = location.page * this.state.perPage;

        for (i; i < numRecord; i++) {
          if (
            ArrayHelper.getValue(this.state.agentTypeListFilter[i], "id") != ""
          ) {
            agentTypeList.push(this.state.agentTypeListFilter[i]);
          }
        }
        this.setState({
          currentPage: parseInt(location.page),
          agentTypeList: agentTypeList,
        });
      } else {
        let agentTypeList = [];

        for (let i = 0; i < this.state.perPage; i++) {
          if (
            ArrayHelper.getValue(this.state.agentTypeListFilter[i], "id") != ""
          ) {
            agentTypeList.push(this.state.agentTypeListFilter[i]);
          }
        }

        this.setState({ agentTypeList: agentTypeList, currentPage: 1 });
      }
    } else if (this.props.agentTypeListData.length > 0) {
      this.setState({ agentTypeList: [], currentPage: 1 });
    }
  }
  updatedAgentTypeList = async (str) => {
    let agentTypeListAll = this.state.agentTypeListAll;
    agentTypeListAll = agentTypeListAll.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    let agentTypeList = this.state.agentTypeList;
    agentTypeList = agentTypeList.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    let agentTypeListFilter = this.state.agentTypeListFilter;
    agentTypeListFilter = agentTypeListFilter.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    this.setState({
      agentTypeListAll: agentTypeListAll,
      agentTypeListFilter: agentTypeListFilter,
      agentTypeList: agentTypeList,
      selectedAgentType: str,
    });
    this.props.agentTypeListInfo(agentTypeListAll);
  };
  AgentTypeDelete = async (str) => {
    if (window.confirm("Do you want to delete selected Agent Type?")) {
      this.setState({ loader: true });

      let formData = {
        requestedUserId: parseInt(localStorage.getItem(USER_ID)),
        agentTypeId: parseInt(str),
      };
      let response = await SettingApi.PostSettingList(
        formData,
        "/api/AgentType/Delete"
      );
      if (ArrayHelper.getValue(response, "isSuccess") == true) {
        let agentTypeListAll = this.state.agentTypeListAll;
        agentTypeListAll = agentTypeListAll.filter((item) => item.id != str);
        let agentTypeListFilter = this.state.agentTypeListAll;
        agentTypeListFilter = agentTypeListFilter.filter(
          (item) => item.id != str
        );

        this.setState({
          loader: false,
          agentTypeListAll: agentTypeListAll,
          agentTypeListFilter: agentTypeListFilter,
        });
        this.props.agentTypeListInfo(agentTypeListAll);
        this.clearData();
      }
    }
  };
  reloadWindow() {
    window.location.reload();
  }
  filterData() {
    this.setState({ loader: true });
    let agentTypeListAll = this.state.agentTypeListAll;
    if (this.state.keyword.trim() != "") {
      let agentTypeListFilter = agentTypeListAll.filter((item) => {
        if (
          item.name.search(new RegExp(this.state.keyword.trim(), "i")) != -1 &&
          this.state.keyword.trim() != ""
        ) {
          return item;
        }
      });
      this.setState({
        agentTypeListFilter: agentTypeListFilter,
        currentPage: 1,
      });
      setTimeout(() => {
        this.setState({ loader: false });
        this.props.history("/settings/agent-type");
      }, 10);
    } else {
      this.clearData();
    }
  }
  clearData() {
    this.setState({
      loader: true,
      keyword: "",
      currentPage: 1,
      agentTypeListFilter: this.state.agentTypeListAll,
    });
    setTimeout(() => {
      this.setState({ loader: false });
      this.props.history("/settings/agent-type");
    }, 10);
  }
  handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    if (name === "keyword") {
      const filteredNames = this.state.agentTypeListFilter
        .map((user) => user.name)
        .filter((name) => name.toLowerCase().includes(value.toLowerCase()));
      this.setState({ keyword: value, filteredNames: filteredNames });
    } else {
      this.setState({ [name]: value });
    }
  };

  render() {
    const { agentTypeListFilter, agentTypeListAll } = this.state;
    const dataToExport =
      agentTypeListFilter.length > 0 ? agentTypeListFilter : agentTypeListAll;
    return (
      <React.Fragment>
        <LoaderComponent loader={this.state.loader} />
        <div
          className="tab-pane fade show active"
          id="AgencyType-tab-pane"
          role="tabpanel"
          aria-labelledby="AgencyType-tab"
          tabIndex="0"
        >
          <div className="p-4">
            <div className="row mb-3">
              <div className="col-md-2">
                <br />
                <h5 className="">Agent Type</h5>
              </div>
              <div className="col-md-8">
                <div className="row g-3 align-items-center">
                  <div className="col-sm-3">
                    <label>Search </label>
                    {/* <input
                      type="text"
                      name="keyword"
                      value={this.state.keyword}
                      onChange={this.handleChange}
                      className="form-control"
                      placeholder=""
                    /> */}

                    <input
                      type="text"
                      name="keyword"
                      value={this.state.keyword}
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
                    data-bs-target="#agentTypeAdd"
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
                    data={dataToExport}
                    columns={["name"]}
                    fileName="AgentTypes.xlsx"
                    sheetName="Agent Types"
                  />
                </div>
              </div>


            </div>

            <div className="borderless-box">
              <div className="table-responsive">
                {this.state.agentTypeList.length > 0 ? (
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Sr. No</th>
                        <th>Name</th>
                        <th colSpan="2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.agentTypeList.map((item, key) => {
                        return (
                          <tr key={`actionType-${key}`}>
                            {/* <td>{key+1}</td>
                             */}
                            <td>
                              {(this.state.currentPage - 1) *
                                this.state.perPage +
                                key +
                                1}
                            </td>

                            <td>{ArrayHelper.getValue(item, "name")}</td>
                            <td>
                              <i
                                data-bs-toggle="modal"
                                data-bs-target="#agentTypeUpdate"
                                onClick={() => {
                                  this.setState({ selectedAgentType: item });
                                }}
                                className="fa fa-edit btn"
                                data-bs-placement="top"
                                title="Edit"
                              ></i>
                            </td>
                            <td>
                              <i
                                onClick={() =>
                                  this.AgentTypeDelete(
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
                {this.state.agentTypeListFilter.length > this.state.perPage ? (
                  <PaginationComponent
                    total={this.state.agentTypeListFilter.length}
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
        <AgentTypeAddComponent
          getAgentTypeList={() => this.getAgentTypeList()}
        />
        <AgentTypeUpdateComponent
          updatedAgentTypeList={(str) => this.updatedAgentTypeList(str)}
          selectedAgentType={this.state.selectedAgentType}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    agentTypeListData: state.settingsData.agentTypeList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    agentTypeListInfo: (data) =>
      dispatch({ type: actionTypesUser.AGENT_TYPE_LIST, payload: data }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AgencyTypeComponent);
