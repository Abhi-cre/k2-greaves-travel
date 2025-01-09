import React from "react";
import { connect } from "react-redux";
import * as actionTypesUser from "../../../store/action/settings.action";
import ActionTypeAddComponent from "./ActionTypeAddComponent";
import ActionTypeUpdateComponent from "./ActionTypeUpdateComponent";
import SettingApi from "../../../api/Setting.api";
import { ArrayHelper } from "../../../helpers/arrayhelper";
import PaginationComponent from "../../../components/PaginationComponent";
import { USER_ID } from "../../../helpers/constants";
import LoaderComponent from "../../../components/LoaderComponent";
import ExcelDownloadButton from "../../../components/ExcelDownloadButton";
class ActionTypeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      keyword: "",
      actionTypeListAll: [],
      actionTypeListFilter: [],
      actionTypeList: [],
      selectedActionType: {},
      perPage: 8,
      currentPage: 1,
      filteredNames: [],
    };
  }
  componentDidMount() {
    let actionTypeListData = this.props.actionTypeListData;
    if (actionTypeListData.length > 0) {
      let actionTypeList = [];
      for (let i = 0; i < this.state.perPage; i++) {
        if (ArrayHelper.getValue(actionTypeListData[i], "id") != "") {
          actionTypeList.push(actionTypeListData[i]);
        }
      }

      this.setState({
        actionTypeListAll: actionTypeListData,
        actionTypeListFilter: actionTypeListData,
        actionTypeList: actionTypeList,
      });
    } else {
      this.getActionTypeList();
    }
  }
  getActionTypeList = async () => {
    this.setState({ loader: true });
    let response = await SettingApi.GetSettingList("/api/ActionType/List");
    if (ArrayHelper.getValue(response, "isSuccess") == true) {
      let actionTypeList = [];

      for (let i = 0; i < this.state.perPage; i++) {
        if (
          ArrayHelper.getValue(
            ArrayHelper.getValue(response, "actionTypes")[i],
            "id"
          ) != ""
        ) {
          actionTypeList.push(ArrayHelper.getValue(response, "actionTypes")[i]);
        }
      }

      this.setState({
        loader: false,
        actionTypeListFilter: ArrayHelper.getValue(response, "actionTypes"),
        actionTypeListAll: ArrayHelper.getValue(response, "actionTypes"),
        actionTypeList: actionTypeList,
      });
      this.props.actionTypeListInfo(
        ArrayHelper.getValue(response, "actionTypes")
      );
    } else {
      this.setState({ loader: false });
    }
  };
  componentWillReceiveProps(nextProps) {
    console.log(
      "sssssssssssss",
      this.state.actionTypeListFilter.length,
      this.state.actionTypeListAll.length
    );
    if (this.state.actionTypeListFilter.length > 0) {
      const location = nextProps.params;
      if (
        location.page !== undefined &&
        location.page !== this.state.currentPage
      ) {
        let actionTypeList = [];
        let numRecord = 0;
        let i = 0;
        i = (location.page - 1) * this.state.perPage;
        numRecord = location.page * this.state.perPage;

        for (i; i < numRecord; i++) {
          if (
            ArrayHelper.getValue(this.state.actionTypeListFilter[i], "id") != ""
          ) {
            actionTypeList.push(this.state.actionTypeListFilter[i]);
          }
        }
        this.setState({
          currentPage: parseInt(location.page),
          actionTypeList: actionTypeList,
        });
      } else {
        let actionTypeList = [];

        for (let i = 0; i < this.state.perPage; i++) {
          if (
            ArrayHelper.getValue(this.state.actionTypeListFilter[i], "id") != ""
          ) {
            actionTypeList.push(this.state.actionTypeListFilter[i]);
          }
        }

        this.setState({ actionTypeList: actionTypeList, currentPage: 1 });
      }
    } else if (this.props.actionTypeListData.length > 0) {
      this.setState({ actionTypeList: [], currentPage: 1 });
    }
  }
  updatedActionTypeList = async (str) => {
    let actionTypeListAll = this.state.actionTypeListAll;
    actionTypeListAll = actionTypeListAll.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    let actionTypeList = this.state.actionTypeList;
    actionTypeList = actionTypeList.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    let actionTypeListFilter = this.state.actionTypeListFilter;
    actionTypeListFilter = actionTypeListFilter.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    this.setState({
      actionTypeListFilter: actionTypeListFilter,
      actionTypeListAll: actionTypeListAll,
      actionTypeList: actionTypeList,
      selectedActionType: str,
    });
    this.props.actionTypeListInfo(actionTypeListAll);
  };
  ActionTypeDelete = async (str) => {
    if (window.confirm("Do you want to delete selected Action Type?")) {
      this.setState({ loader: true });

      let formData = {
        requestedUserId: parseInt(localStorage.getItem(USER_ID)),
        actionTypeId: parseInt(str),
      };
      let response = await SettingApi.PostSettingList(
        formData,
        "/api/ActionType/Delete"
      );
      if (ArrayHelper.getValue(response, "isSuccess") == true) {
        let actionTypeListAll = this.state.actionTypeListAll;
        actionTypeListAll = actionTypeListAll.filter((item) => item.id != str);

        this.setState({ loader: false, actionTypeListAll: actionTypeListAll });
        this.props.actionTypeListInfo(actionTypeListAll);
        this.clearData();
      }
    }
  };
  reloadWindow() {
    window.location.reload();
  }
  filterData() {
    this.setState({ loader: true });
    let actionTypeListAll = this.state.actionTypeListAll;
    if (this.state.keyword.trim() != "") {
      let actionTypeListFilter = actionTypeListAll.filter((item) => {
        if (
          item.name.search(new RegExp(this.state.keyword.trim(), "i")) != -1 &&
          this.state.keyword.trim() != ""
        ) {
          return item;
        }
      });
      this.setState({
        actionTypeListFilter: actionTypeListFilter,
        currentPage: 1,
      });
      setTimeout(() => {
        this.setState({ loader: false });
        this.props.history("/settings");
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
      actionTypeListFilter: this.state.actionTypeListAll,
    });
    setTimeout(() => {
      this.setState({ loader: false });
      this.props.history("/settings");
    }, 10);
  }
  handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    if (name === "keyword") {
      const filteredNames = this.state.actionTypeListFilter
        .map((user) => user.name)
        .filter((name) => name.toLowerCase().includes(value.toLowerCase()));
      this.setState({ keyword: value, filteredNames: filteredNames });
    } else {
      this.setState({ [name]: value });
    }
  };

  render() {
    const { actionTypeListFilter, actionTypeListAll, currentPage, perPage } =
      this.state;
    const dataToExport =
      actionTypeListFilter.length > 0
        ? actionTypeListFilter
        : actionTypeListAll;
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
                <h5 className="">Action Type</h5>
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
              <div className="d-flex align-items-center justify-content-end">
                <a onClick={() => this.reloadWindow()}>
                  <img
                    style={{ height: "30px", marginRight: "20px" }}
                    src="/images/reload.png"
                  />
                </a>
                <button
                  data-bs-toggle=""
                  data-bs-target="#actionTypeAdd"
                  className=""
                  style={{ marginRight: "20px" }}
                >
                  <img
                    src="/images/add.png"
                    alt="Add"
                    style={{ height: "40px", width: "40px" }}
                  />
                </button>

                <ExcelDownloadButton
                  data={dataToExport}
                  columns={["name"]}
                  fileName="ActionTypes.xlsx"
                  sheetName="Action Types"
                />
              </div>
            </div>
            {/* <div className="w-100 d-sm-inline-flex align-items-center justify-content-start">
                            <div className="w-25 py-2">
                                <h5 className="">Action Type</h5>
                            </div>
                            <div className="w-25 py-2">
                                <h5 className="">Action Type</h5>
                            </div>
                            <div className="w-75 d-sm-inline-flex align-items-center justify-content-end">
                                <div className="w-auto p-2">
                                  
                                <a  onClick={()=>this.reloadWindow()}><img style={{'height': '40px'}} src="images/reload.png"/></a>  <button data-bs-toggle="modal" data-bs-target="#actionTypeAdd" className="btn btn-outlined"> <i className="fa-sharp fa-solid fa-plus"></i> Add </button>
                                </div>
                            </div>
                        </div> */}
            <div className="borderless-box">
              <div className="table-responsive">
                {this.state.actionTypeList.length > 0 ? (
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Sr. No</th>

                        <th>Name</th>
                        <th colSpan="2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.actionTypeList.map((item, key) => {
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
                                data-bs-target="#actionTypeUpdate"
                                onClick={() => {
                                  this.setState({ selectedActionType: item });
                                }}
                                className="fa fa-edit btn"
                                data-bs-placement="top"
                                title="Edit"
                              ></i>
                            </td>
                            <td>
                              <i
                                onClick={() =>
                                  this.ActionTypeDelete(
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
                {this.state.actionTypeListFilter.length > this.state.perPage ? (
                  <PaginationComponent
                    total={this.state.actionTypeListFilter.length}
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
        <ActionTypeAddComponent
          getActionTypeList={() => this.getActionTypeList()}
        />
        <ActionTypeUpdateComponent
          updatedActionTypeList={(str) => this.updatedActionTypeList(str)}
          selectedActionType={this.state.selectedActionType}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    actionTypeListData: state.settingsData.actionTypeList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actionTypeListInfo: (data) =>
      dispatch({ type: actionTypesUser.ACTION_TYPE_LIST, payload: data }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionTypeComponent);
