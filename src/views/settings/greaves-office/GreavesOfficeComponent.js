import React from "react";
import { connect } from "react-redux";
import * as actionTypesUser from "../../../store/action/settings.action";
import GreavesOfficeAddComponent from "./GreavesOfficeAddComponent";
import GreavesOfficeUpdateComponent from "./GreavesOfficeUpdateComponent";
import SettingApi from "../../../api/Setting.api";
import { ArrayHelper } from "../../../helpers/arrayhelper";
import PaginationComponent from "../../../components/PaginationComponent";
import { USER_ID } from "../../../helpers/constants";
import LoaderComponent from "../../../components/LoaderComponent";
import ExcelDownloadButton from "../../../components/ExcelDownloadButton";
class GreavesOfficeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      greavesOfficeListAll: [],
      greavesOfficeListFilter: [],
      greavesOfficeList: [],
      selectedGreavesOffice: {},
      perPage: 20,
      currentPage: 1,
      keyword: "",
      filteredNames: [],
    };
  }
  componentDidMount() {
    let greavesOfficeListData = this.props.greavesOfficeListData;
    if (greavesOfficeListData.length > 0) {
      let greavesOfficeList = [];
      for (let i = 0; i < this.state.perPage; i++) {
        if (ArrayHelper.getValue(greavesOfficeListData[i], "id") != "") {
          greavesOfficeList.push(greavesOfficeListData[i]);
        }
      }

      this.setState({
        greavesOfficeListAll: greavesOfficeListData,
        greavesOfficeListFilter: greavesOfficeListData,
        greavesOfficeList: greavesOfficeList,
      });
    } else {
      this.getGreavesOfficeList();
    }
  }
  getGreavesOfficeList = async () => {
    this.setState({ loader: true });
    let response = await SettingApi.GetSettingList("/api/GreavesOffice/List");
    if (ArrayHelper.getValue(response, "isSuccess") == true) {
      let greavesOfficeList = [];

      for (let i = 0; i < this.state.perPage; i++) {
        if (
          ArrayHelper.getValue(
            ArrayHelper.getValue(response, "greavesOffices")[i],
            "id"
          ) != ""
        ) {
          greavesOfficeList.push(
            ArrayHelper.getValue(response, "greavesOffices")[i]
          );
        }
      }

      this.setState({
        loader: false,
        greavesOfficeListAll: ArrayHelper.getValue(response, "greavesOffices"),
        greavesOfficeListFilter: ArrayHelper.getValue(
          response,
          "greavesOffices"
        ),
        greavesOfficeList: greavesOfficeList,
      });
      this.props.greavesOfficeListInfo(
        ArrayHelper.getValue(response, "greavesOffices")
      );
    } else {
      this.setState({ loader: false });
    }
  };
  componentWillReceiveProps(nextProps) {
    if (this.state.greavesOfficeListFilter.length > 0) {
      const location = nextProps.params;
      if (
        location.page !== undefined &&
        location.page !== this.state.currentPage
      ) {
        let greavesOfficeList = [];
        let numRecord = 0;
        let i = 0;
        i = (location.page - 1) * this.state.perPage;
        numRecord = location.page * this.state.perPage;

        for (i; i < numRecord; i++) {
          if (
            ArrayHelper.getValue(this.state.greavesOfficeListFilter[i], "id") !=
            ""
          ) {
            greavesOfficeList.push(this.state.greavesOfficeListFilter[i]);
          }
        }
        this.setState({
          currentPage: parseInt(location.page),
          greavesOfficeList: greavesOfficeList,
        });
      } else {
        let greavesOfficeList = [];

        for (let i = 0; i < this.state.perPage; i++) {
          if (
            ArrayHelper.getValue(this.state.greavesOfficeListFilter[i], "id") !=
            ""
          ) {
            greavesOfficeList.push(this.state.greavesOfficeListFilter[i]);
          }
        }

        this.setState({ greavesOfficeList: greavesOfficeList, currentPage: 1 });
      }
    } else if (this.props.greavesOfficeListData.length > 0) {
      this.setState({ greavesOfficeList: [], currentPage: 1 });
    }
  }
  updatedGreavesOfficeList = async (str) => {
    let greavesOfficeListAll = this.state.greavesOfficeListAll;
    greavesOfficeListAll = greavesOfficeListAll.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    let greavesOfficeList = this.state.greavesOfficeList;
    greavesOfficeList = greavesOfficeList.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    let greavesOfficeListFilter = this.state.greavesOfficeListFilter;
    greavesOfficeListFilter = greavesOfficeListFilter.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    this.setState({
      greavesOfficeListAll: greavesOfficeListAll,
      greavesOfficeListFilter: greavesOfficeListFilter,
      greavesOfficeList: greavesOfficeList,
      selectedGreavesOffice: str,
    });
    this.props.greavesOfficeListInfo(greavesOfficeListAll);
  };
  ClientStatusDelete = async (str) => {
    if (window.confirm("Do you want to delete selected Greaves Office?")) {
      this.setState({ loader: true });

      let formData = {
        requestedUserId: parseInt(localStorage.getItem(USER_ID)),
        clientStatusId: parseInt(str),
      };
      let response = await SettingApi.PostSettingList(
        formData,
        "/api/GreavesOffice/Delete"
      );
      if (ArrayHelper.getValue(response, "isSuccess") == true) {
        let greavesOfficeListAll = this.state.greavesOfficeListAll;
        greavesOfficeListAll = greavesOfficeListAll.filter(
          (item) => item.id != str
        );
        let greavesOfficeListFilter = this.state.greavesOfficeListFilter;
        greavesOfficeListFilter = greavesOfficeListFilter.filter(
          (item) => item.id != str
        );

        this.setState({
          loader: false,
          greavesOfficeListAll: greavesOfficeListAll,
          greavesOfficeListFilter: greavesOfficeListFilter,
        });
        this.props.greavesOfficeListInfo(greavesOfficeListAll);
        this.props.history("/settings/greaves-office");
      }
    }
  };
  reloadWindow() {
    window.location.reload();
  }
  filterData() {
    this.setState({ loader: true });
    let greavesOfficeListAll = this.state.greavesOfficeListAll;
    if (this.state.keyword.trim() != "") {
      let greavesOfficeListFilter = greavesOfficeListAll.filter((item) => {
        if (
          item.name.search(new RegExp(this.state.keyword.trim(), "i")) != -1 &&
          this.state.keyword.trim() != ""
        ) {
          return item;
        }
      });
      this.setState({
        greavesOfficeListFilter: greavesOfficeListFilter,
        currentPage: 1,
      });
      setTimeout(() => {
        this.setState({ loader: false });
        this.props.history("/settings/greaves-office");
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
      greavesOfficeListFilter: this.state.greavesOfficeListAll,
    });
    setTimeout(() => {
      this.setState({ loader: false });
      this.props.history("/settings/greaves-office");
    }, 10);
  }
  handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    if (name === "keyword") {
      const filteredNames = this.state.greavesOfficeListFilter
        .map((user) => user.name)
        .filter((name) => name.toLowerCase().includes(value.toLowerCase()));
      this.setState({ keyword: value, filteredNames: filteredNames });
    } else {
      this.setState({ [name]: value });
    }
  };

  render() {
    const { greavesOfficeListFilter, greavesOfficeListAll } = this.state;
    const dataToExport =
      greavesOfficeListFilter.length > 0
        ? greavesOfficeListFilter
        : greavesOfficeListAll;
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
                <h5 className="">Greaves Office</h5>
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
                    data-bs-target="#greavesOfficeAdd"
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
                {this.state.greavesOfficeList.length > 0 ? (
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Sr. No</th>
                        <th>Name</th>
                        <th colSpan="2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.greavesOfficeList.map((item, key) => {
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
                                  this.setState({
                                    selectedGreavesOffice: item,
                                  });
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
                {this.state.greavesOfficeListFilter.length >
                  this.state.perPage ? (
                  <PaginationComponent
                    total={this.state.greavesOfficeListFilter.length}
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
        <GreavesOfficeAddComponent
          getGreavesOfficeList={() => this.getGreavesOfficeList()}
        />
        <GreavesOfficeUpdateComponent
          updatedGreavesOfficeList={(str) => this.updatedGreavesOfficeList(str)}
          selectedGreavesOffice={this.state.selectedGreavesOffice}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    greavesOfficeListData: state.settingsData.greavesOfficeList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    greavesOfficeListInfo: (data) =>
      dispatch({ type: actionTypesUser.GREAVES_OFFICE_LIST, payload: data }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GreavesOfficeComponent);
