import React from "react";
import { connect } from "react-redux";
import * as actionTypesUser from "../../../store/action/settings.action";
import UserTypeAddComponent from "./UserTypeAddComponent";
import UserTypeUpdateComponent from "./UserTypeUpdateComponent";
import SettingApi from "../../../api/Setting.api";
import { ArrayHelper } from "../../../helpers/arrayhelper";
import PaginationComponent from "../../../components/PaginationComponent";
import { USER_ID } from "../../../helpers/constants";
import LoaderComponent from "../../../components/LoaderComponent";
import ExcelDownloadButton from "../../../components/ExcelDownloadButton";
class UserTypeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      userTypeListAll: [],
      userTypeListFilter: [],
      userTypeList: [],
      selectedUserType: {},
      perPage: 20,
      currentPage: 1,
      filteredNames: [],
    };
  }
  componentDidMount() {
    let userTypeListData = this.props.userTypeListData;
    if (userTypeListData.length > 0) {
      let userTypeList = [];
      for (let i = 0; i < this.state.perPage; i++) {
        if (ArrayHelper.getValue(userTypeListData[i], "id") != "") {
          userTypeList.push(userTypeListData[i]);
        }
      }

      this.setState({
        userTypeListAll: userTypeListData,
        userTypeListFilter: userTypeListData,
        userTypeList: userTypeList,
      });
    } else {
      this.getUserTypeList();
    }
  }
  getUserTypeList = async () => {
    this.setState({ loader: true });
    let response = await SettingApi.GetSettingList("/api/UserType/List");
    if (ArrayHelper.getValue(response, "isSuccess") == true) {
      let userTypeList = [];

      for (let i = 0; i < this.state.perPage; i++) {
        if (
          ArrayHelper.getValue(
            ArrayHelper.getValue(response, "userTypes")[i],
            "id"
          ) != ""
        ) {
          userTypeList.push(ArrayHelper.getValue(response, "userTypes")[i]);
        }
      }

      this.setState({
        loader: false,
        userTypeListAll: ArrayHelper.getValue(response, "userTypes"),
        userTypeListFilter: ArrayHelper.getValue(response, "userTypes"),
        userTypeList: userTypeList,
      });
      this.props.userTypeListInfo(ArrayHelper.getValue(response, "userTypes"));
    } else {
      this.setState({ loader: false });
    }
  };
  componentWillReceiveProps(nextProps) {
    if (this.state.userTypeListFilter.length > 0) {
      const location = nextProps.params;
      if (
        location.page !== undefined &&
        location.page !== this.state.currentPage
      ) {
        let userTypeList = [];
        let numRecord = 0;
        let i = 0;
        i = (location.page - 1) * this.state.perPage;
        numRecord = location.page * this.state.perPage;

        for (i; i < numRecord; i++) {
          if (
            ArrayHelper.getValue(this.state.userTypeListFilter[i], "id") != ""
          ) {
            userTypeList.push(this.state.userTypeListFilter[i]);
          }
        }
        this.setState({
          currentPage: parseInt(location.page),
          userTypeList: userTypeList,
        });
      } else {
        let userTypeList = [];

        for (let i = 0; i < this.state.perPage; i++) {
          if (
            ArrayHelper.getValue(this.state.userTypeListFilter[i], "id") != ""
          ) {
            userTypeList.push(this.state.userTypeListFilter[i]);
          }
        }

        this.setState({ userTypeList: userTypeList, currentPage: 1 });
      }
    } else if (this.props.userTypeListData.length > 0) {
      this.setState({ userTypeList: [], currentPage: 1 });
    }
  }
  updatedUserTypeList = async (str) => {
    let userTypeListAll = this.state.userTypeListAll;
    userTypeListAll = userTypeListAll.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    let userTypeList = this.state.userTypeList;
    userTypeList = userTypeList.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    let userTypeListFilter = this.state.userTypeListFilter;
    userTypeListFilter = userTypeListFilter.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    this.setState({
      userTypeListAll: userTypeListAll,
      userTypeListFilter: userTypeListFilter,
      userTypeList: userTypeList,
      selectedUserType: str,
    });
    this.props.userTypeListInfo(userTypeListAll);
  };
  UserTypeDelete = async (str) => {
    if (window.confirm("Do you want to delete selected User Type?")) {
      this.setState({ loader: true });

      let formData = {
        requestedUserId: parseInt(localStorage.getItem(USER_ID)),
        userTypeId: parseInt(str),
      };
      let response = await SettingApi.PostSettingList(
        formData,
        "/api/UserType/Delete"
      );
      if (ArrayHelper.getValue(response, "isSuccess") == true) {
        let userTypeListAll = this.state.userTypeListAll;
        userTypeListAll = userTypeListAll.filter((item) => item.id != str);
        let userTypeListFilter = this.state.userTypeListAll;
        userTypeListFilter = userTypeListFilter.filter(
          (item) => item.id != str
        );

        this.setState({
          loader: false,
          userTypeListAll: userTypeListAll,
          userTypeListFilter: userTypeListFilter,
        });
        this.props.userTypeListInfo(userTypeListAll);
        this.props.history("/settings/user-type");
      }
    }
  };
  reloadWindow() {
    window.location.reload();
  }
  filterData() {
    this.setState({ loader: true });
    let userTypeListAll = this.state.userTypeListAll;
    if (this.state.keyword.trim() != "") {
      let userTypeListFilter = userTypeListAll.filter((item) => {
        if (
          item.name.search(new RegExp(this.state.keyword.trim(), "i")) != -1 &&
          this.state.keyword.trim() != ""
        ) {
          return item;
        }
      });
      this.setState({ userTypeListFilter: userTypeListFilter, currentPage: 1 });
      setTimeout(() => {
        this.setState({ loader: false });
        this.props.history("/settings/user-type");
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
      userTypeListFilter: this.state.userTypeListAll,
    });
    setTimeout(() => {
      this.setState({ loader: false });
      this.props.history("/settings/user-type");
    }, 10);
  }
  //   handleChange = (e) => {
  //     const name = e.target.name;
  //     let value = e.target.value;
  //     this.setState({ ...this.state, [name]: value });
  //   };
  handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    if (name === "keyword") {
      const filteredNames = this.state.userTypeListFilter
        .map((user) => user.name)
        .filter((name) => name.toLowerCase().includes(value.toLowerCase()));
      this.setState({ keyword: value, filteredNames: filteredNames });
    } else {
      this.setState({ [name]: value });
    }
  };

  render() {
    const { userTypeListFilter, userTypeListAll } = this.state;
    const dataToExport =
      userTypeListFilter.length > 0 ? userTypeListFilter : userTypeListAll;
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
                <h5 className="">User Type</h5>
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
                    data-bs-target="#userTypeAdd"
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
                    fileName="ActionTypes.xlsx"
                    sheetName="Action Types"
                  />
                </div>
              </div>


            </div>
            <div className="borderless-box">
              <div className="table-responsive">
                {this.state.userTypeList.length > 0 ? (
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Sr. No</th>
                        <th>Name</th>
                        <th colSpan="2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.userTypeList.map((item, key) => {
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
                                data-bs-target="#userTypeUpdate"
                                onClick={() => {
                                  this.setState({ selectedUserType: item });
                                }}
                                className="fa fa-edit btn"
                                data-bs-placement="top"
                                title="Edit"
                              ></i>
                            </td>
                            <td>
                              <i
                                onClick={() =>
                                  this.UserTypeDelete(
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
                {this.state.userTypeListFilter.length > this.state.perPage ? (
                  <PaginationComponent
                    total={this.state.userTypeListFilter.length}
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
        <UserTypeAddComponent getUserTypeList={() => this.getUserTypeList()} />
        <UserTypeUpdateComponent
          updatedUserTypeList={(str) => this.updatedUserTypeList(str)}
          selectedUserType={this.state.selectedUserType}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userTypeListData: state.settingsData.userTypeList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    userTypeListInfo: (data) =>
      dispatch({ type: actionTypesUser.USER_TYPE_LIST, payload: data }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserTypeComponent);
