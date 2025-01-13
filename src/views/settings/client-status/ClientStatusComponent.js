import React from "react";
import { connect } from "react-redux";
import * as actionTypesUser from "../../../store/action/settings.action";
import ClientStatusAddComponent from "./ClientStatusAddComponent";
import ClientStatusUpdateComponent from "./ClientStatusUpdateComponent";
import SettingApi from "../../../api/Setting.api";
import { ArrayHelper } from "../../../helpers/arrayhelper";
import PaginationComponent from "../../../components/PaginationComponent";
import { USER_ID } from "../../../helpers/constants";
import LoaderComponent from "../../../components/LoaderComponent";
import ExcelDownloadButton from "../../../components/ExcelDownloadButton";
class ClientStatusComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      clientStatusListAll: [],
      clientStatusListFilter: [],
      clientStatusList: [],
      selectedClientStatus: {},
      perPage: 8,
      currentPage: 1,
      keyword: "",
      filteredNames: [],
    };
  }
  componentDidMount() {
    let clientStatusListData = this.props.clientStatusListData;
    if (clientStatusListData.length > 0) {
      let clientStatusList = [];
      for (let i = 0; i < this.state.perPage; i++) {
        if (ArrayHelper.getValue(clientStatusListData[i], "id") != "") {
          clientStatusList.push(clientStatusListData[i]);
        }
      }

      this.setState({
        clientStatusListAll: clientStatusListData,
        clientStatusListFilter: clientStatusListData,
        clientStatusList: clientStatusList,
      });
    } else {
      this.getClientStatusList();
    }
  }
  getClientStatusList = async () => {
    this.setState({ loader: true });
    let response = await SettingApi.GetSettingList("/api/ClientStatus/List");
    if (ArrayHelper.getValue(response, "isSuccess") == true) {
      let clientStatusList = [];

      for (let i = 0; i < this.state.perPage; i++) {
        if (
          ArrayHelper.getValue(
            ArrayHelper.getValue(response, "clientStatuses")[i],
            "id"
          ) != ""
        ) {
          clientStatusList.push(
            ArrayHelper.getValue(response, "clientStatuses")[i]
          );
        }
      }

      this.setState({
        loader: false,
        clientStatusListAll: ArrayHelper.getValue(response, "clientStatuses"),
        clientStatusListFilter: ArrayHelper.getValue(
          response,
          "clientStatuses"
        ),
        clientStatusList: clientStatusList,
      });
      this.props.clientStatusListInfo(
        ArrayHelper.getValue(response, "clientStatuses")
      );
    } else {
      this.setState({ loader: false });
    }
  };
  componentWillReceiveProps(nextProps) {
    if (this.state.clientStatusListFilter.length > 0) {
      const location = nextProps.params;
      if (
        location.page !== undefined &&
        location.page !== this.state.currentPage
      ) {
        let clientStatusList = [];
        let numRecord = 0;
        let i = 0;
        i = (location.page - 1) * this.state.perPage;
        numRecord = location.page * this.state.perPage;

        for (i; i < numRecord; i++) {
          if (
            ArrayHelper.getValue(this.state.clientStatusListFilter[i], "id") !=
            ""
          ) {
            clientStatusList.push(this.state.clientStatusListFilter[i]);
          }
        }
        this.setState({
          currentPage: parseInt(location.page),
          clientStatusList: clientStatusList,
        });
      } else {
        let clientStatusList = [];

        for (let i = 0; i < this.state.perPage; i++) {
          if (
            ArrayHelper.getValue(this.state.clientStatusListFilter[i], "id") !=
            ""
          ) {
            clientStatusList.push(this.state.clientStatusListFilter[i]);
          }
        }

        this.setState({ clientStatusList: clientStatusList, currentPage: 1 });
      }
    } else if (this.props.clientStatusListData.length > 0) {
      this.setState({ clientStatusList: [], currentPage: 1 });
    }
  }
  updatedclientStatusList = async (str) => {
    let clientStatusListAll = this.state.clientStatusListAll;
    clientStatusListAll = clientStatusListAll.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    let clientStatusList = this.state.clientStatusList;
    clientStatusList = clientStatusList.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    let clientStatusListFilter = this.state.clientStatusListFilter;
    clientStatusListFilter = clientStatusListFilter.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    this.setState({
      clientStatusListAll: clientStatusListAll,
      clientStatusListFilter: clientStatusListFilter,
      clientStatusList: clientStatusList,
      selectedClientStatus: str,
    });
    this.props.clientStatusListInfo(clientStatusListAll);
  };
  ClientStatusDelete = async (str) => {
    if (window.confirm("Do you want to delete selected Client Status?")) {
      this.setState({ loader: true });

      let formData = {
        requestedUserId: parseInt(localStorage.getItem(USER_ID)),
        clientStatusId: parseInt(str),
      };
      let response = await SettingApi.PostSettingList(
        formData,
        "/api/ClientStatus/Delete"
      );
      if (ArrayHelper.getValue(response, "isSuccess") == true) {
        let clientStatusListAll = this.state.clientStatusListAll;
        clientStatusListAll = clientStatusListAll.filter(
          (item) => item.id != str
        );
        let clientStatusListFilter = this.state.clientStatusListFilter;
        clientStatusListFilter = clientStatusListFilter.filter(
          (item) => item.id != str
        );

        this.setState({
          loader: false,
          clientStatusListAll: clientStatusListAll,
          clientStatusListFilter: clientStatusListFilter,
        });
        this.props.clientStatusListInfo(clientStatusListAll);
        this.props.history("/settings/client-status");
      }
    }
  };
  reloadWindow() {
    window.location.reload();
  }
  filterData() {
    this.setState({ loader: true });
    let clientStatusListAll = this.state.clientStatusListAll;
    if (this.state.keyword.trim() != "") {
      let clientStatusListFilter = clientStatusListAll.filter((item) => {
        if (
          item.name.search(new RegExp(this.state.keyword.trim(), "i")) != -1 &&
          this.state.keyword.trim() != ""
        ) {
          return item;
        }
      });
      this.setState({
        clientStatusListFilter: clientStatusListFilter,
        currentPage: 1,
      });
      setTimeout(() => {
        this.setState({ loader: false });
        this.props.history("/settings/client-status");
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
      clientStatusListFilter: this.state.clientStatusListAll,
    });
    setTimeout(() => {
      this.setState({ loader: false });
      this.props.history("/settings/client-status");
    }, 10);
  }
  handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    if (name === "keyword") {
      const filteredNames = this.state.clientStatusListFilter
        .map((user) => user.name)
        .filter((name) => name.toLowerCase().includes(value.toLowerCase()));
      this.setState({ keyword: value, filteredNames: filteredNames });
    } else {
      this.setState({ [name]: value });
    }
  };
  render() {
    const { clientStatusListFilter, clientStatusListAll } = this.state;
    const dataToExport =
      clientStatusListFilter.length > 0
        ? clientStatusListFilter
        : clientStatusListAll;
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
                <h5 className="">Client Status</h5>
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
                    data-bs-target="#clientStatusAdd"
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
                    fileName="ClientStatus.xlsx"
                    sheetName="ClientStatus"
                  />
                </div>
              </div>
            </div>

            <div className="borderless-box">
              <div className="table-responsive">
                {this.state.clientStatusList.length > 0 ? (
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Sr. No</th>
                        <th>Name</th>
                        <th colSpan="2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.clientStatusList.map((item, key) => {
                        return (
                          <tr key={`actionType-${key}`}>
                            {/* <td>{key+1}</td> */}
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
                                data-bs-target="#clientStatusUpdate"
                                onClick={() => {
                                  this.setState({ selectedClientStatus: item });
                                }}
                                className="fa fa-edit btn"
                                data-bs-placement="top"
                                title="Edit"
                              ></i>
                            </td>
                            <td>
                              <i
                                onClick={() =>
                                  this.ClientStatusDelete(
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
                {this.state.clientStatusListFilter.length >
                this.state.perPage ? (
                  <PaginationComponent
                    total={this.state.clientStatusListFilter.length}
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
        <ClientStatusAddComponent
          getClientStatusList={() => this.getClientStatusList()}
        />
        <ClientStatusUpdateComponent
          updatedclientStatusList={(str) => this.updatedclientStatusList(str)}
          selectedClientStatus={this.state.selectedClientStatus}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    clientStatusListData: state.settingsData.clientStatusList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clientStatusListInfo: (data) =>
      dispatch({ type: actionTypesUser.CLIENT_STATUS_LIST, payload: data }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClientStatusComponent);
