import React from "react";
import { connect } from "react-redux";
import * as actionTypesUser from "../../../store/action/settings.action";
// import CityAddComponent from './CityAddComponent';
import StateAddComponent from "./StateAddComponent";
// import CityUpdateComponent from './CityUpdateComponent';
import StateUpdateComponent from "./StateUpdateComponent";
import SettingApi from "../../../api/Setting.api";
import { ArrayHelper } from "../../../helpers/arrayhelper";
import PaginationComponent from "../../../components/PaginationComponent";
import { USER_ID } from "../../../helpers/constants";
import LoaderComponent from "../../../components/LoaderComponent";
import ExcelDownloadButton from "../../../components/ExcelDownloadButton";
class StateComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      stateList: [],
      stateListAll: [],
      stateListFilter: [],
      countryList: [],
      selectedState: {},
      perPage: 8,
      currentPage: 1,
      keyword: "",
      filteredNames: [],
    };
  }
  componentDidMount() {
    let statelistData = this.props.stateListData;
    if (statelistData.length > 0) {
      let stateList = [];
      for (let i = 0; i < this.state.perPage; i++) {
        if (ArrayHelper.getValue(statelistData[i], "stateId") != "") {
          stateList.push(statelistData[i]);
        }
      }

      this.setState({
        stateListAll: statelistData,
        stateListFilter: statelistData,
        stateList: stateList,
      });
    } else {
      this.getStateList();
    }
    let countryListData = this.props.countryListData;
    if (countryListData.length > 0) {
      this.setState({ countryList: countryListData });
    } else {
      this.getCountryList();
    }
  }
  getCountryList = async () => {
    this.setState({ loader: true });
    let responseSate = await SettingApi.GetSettingList("/api/City/CountryList");
    if (ArrayHelper.getValue(responseSate, "isSuccess") == true) {
      this.setState({
        loader: false,
        countryList: ArrayHelper.getValue(responseSate, "countries"),
      });
      this.props.countryListInfo(
        ArrayHelper.getValue(responseSate, "countries")
      );
    } else {
      this.setState({ loader: false });
    }
  };
  getStateList = async () => {
    this.setState({ loader: true });
    let response = await SettingApi.GetSettingList("/api/State/List");
    if (ArrayHelper.getValue(response, "isSuccess") == true) {
      let stateList = [];

      for (let i = 0; i < this.state.perPage; i++) {
        if (
          ArrayHelper.getValue(
            ArrayHelper.getValue(response, "states")[i],
            "stateId"
          ) != ""
        ) {
          stateList.push(ArrayHelper.getValue(response, "states")[i]);
        }
      }
      this.setState({
        loader: false,
        stateListAll: ArrayHelper.getValue(response, "states"),
        stateListFilter: ArrayHelper.getValue(response, "states"),
        stateList: stateList,
      });

      setTimeout(() => {
        this.props.stateListInfo(ArrayHelper.getValue(response, "states"));
      }, 10);
    } else {
      this.setState({ loader: false });
    }
  };
  componentWillReceiveProps(nextProps) {
    if (this.state.stateListFilter.length > 0) {
      const location = nextProps.params;
      if (
        location.page !== undefined &&
        location.page !== this.state.currentPage
      ) {
        let stateList = [];
        let numRecord = 0;
        let i = 0;
        i = (location.page - 1) * this.state.perPage;
        numRecord = location.page * this.state.perPage;

        for (i; i < numRecord; i++) {
          if (
            ArrayHelper.getValue(this.state.stateListFilter[i], "stateId") != ""
          ) {
            stateList.push(this.state.stateListFilter[i]);
          }
        }
        this.setState({
          currentPage: parseInt(location.page),
          stateList: stateList,
        });
      } else {
        let stateList = [];

        for (let i = 0; i < this.state.perPage; i++) {
          if (
            ArrayHelper.getValue(this.state.stateListFilter[i], "stateId") != ""
          ) {
            stateList.push(this.state.stateListFilter[i]);
          }
        }

        this.setState({ stateList: stateList, currentPage: 1 });
      }
    } else if (this.props.stateListData.length > 0) {
      this.setState({ stateList: [], currentPage: 1 });
    }
  }
  updatedStateList = async (str) => {
    let stateListAll = this.state.stateListAll;
    stateListAll = stateListAll.map((item) => {
      if (item.stateId == str.stateId) {
        item = str;
        return item;
      }

      return item;
    });
    let stateList = this.state.stateList;

    stateList = stateList.map((item) => {
      if (item.stateId == str.stateId) {
        item = str;
        return item;
      } else if (item.countryId == str.countryId) {
        item = str;
        return item;
      }
      return item;
    });
    let stateListFilter = this.state.stateListFilter;
    stateListFilter = stateListFilter.map((item) => {
      if (item.stateId == str.stateId) {
        item = str;
        return item;
      }
      return item;
    });
    this.setState({
      stateListAll: stateListAll,
      stateListFilter: stateListFilter,
      stateList: stateList,
      selectedState: str,
    });
    setTimeout(() => {
      this.props.stateListInfo(stateListAll);
    }, 10);
  };
  stateDelete = async (str) => {
    if (window.confirm("Do you want to delete selected State?")) {
      this.setState({ loader: true });

      let formData = {
        requestedUserId: parseInt(localStorage.getItem(USER_ID)),
        stateId: parseInt(str),
      };
      let response = await SettingApi.PostSettingList(
        formData,
        "/api/State/Delete"
      );
      if (ArrayHelper.getValue(response, "isSuccess") == true) {
        let stateListAll = this.state.stateListAll;
        stateListAll = stateListAll.filter((item) => item.stateId != str);
        let stateListFilter = this.state.stateListFilter;
        stateListFilter = stateListFilter.filter((item) => item.stateId != str);

        this.setState({
          loader: false,
          stateListAll: stateListAll,
          stateListFilter: stateListFilter,
        });
        setTimeout(() => {
          this.props.countryListInfo(stateListAll);
        }, 10);
        this.props.history("/settings/state");
      }
    }
  };
  reloadWindow() {
    window.location.reload();
  }
  filterData() {
    this.setState({ loader: true });
    let stateListAll = this.state.stateListAll;
    if (this.state.keyword.trim() != "") {
      let stateListFilter = stateListAll.filter((item) => {
        if (
          item.countryName.search(new RegExp(this.state.keyword.trim(), "i")) !=
            -1 &&
          this.state.keyword.trim() != ""
        ) {
          return item;
        }
        if (
          item.stateName.search(new RegExp(this.state.keyword.trim(), "i")) !=
            -1 &&
          this.state.keyword.trim() != ""
        ) {
          return item;
        }
      });
      this.setState({ stateListFilter: stateListFilter, currentPage: 1 });
      setTimeout(() => {
        this.setState({ loader: false });
        this.props.history("/settings/state");
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
      stateListFilter: this.state.stateListAll,
    });
    setTimeout(() => {
      this.setState({ loader: false });
      this.props.history("/settings/state");
    }, 10);
  }
  handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    this.setState({ ...this.state, [name]: value });
  };

  render() {
    const { stateListFilter, stateListAll } = this.state;
    const dataToExport =
      stateListFilter.length > 0 ? stateListFilter : stateListAll;
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
                <h5 className="">State</h5>
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
                  data-bs-toggle="modal"
                  data-bs-target="#cityAdd"
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
                  columns={["countryName", "stateName"]}
                  fileName="ActionTypes.xlsx"
                  sheetName="Action Types"
                />
              </div>
            </div>

            <div className="borderless-box">
              <div className="table-responsive">
                {this.state.stateList.length > 0 ? (
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Sr. No</th>
                        <th>Country Name</th>
                        <th>State Name</th>
                        <th colSpan="2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.stateList.map((item, key) => {
                        return (
                          <tr key={`actionType-${key}`}>
                            {/* <td>{key+1}</td> */}
                            <td>
                              {(this.state.currentPage - 1) *
                                this.state.perPage +
                                key +
                                1}
                            </td>

                            <td>{ArrayHelper.getValue(item, "countryName")}</td>
                            <td>{ArrayHelper.getValue(item, "stateName")}</td>
                            <td>
                              <i
                                data-bs-toggle="modal"
                                data-bs-target="#cityUpdate"
                                onClick={() => {
                                  this.setState({ selectedState: item });
                                }}
                                className="fa fa-edit btn"
                                data-bs-placement="top"
                                title="Edit"
                              ></i>
                            </td>
                            <td>
                              <i
                                onClick={() =>
                                  this.stateDelete(
                                    ArrayHelper.getValue(item, "stateId")
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
                {this.state.stateListFilter.length > this.state.perPage ? (
                  <PaginationComponent
                    total={this.state.stateListFilter.length}
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
        <StateAddComponent
          getCountryList={() => this.getCountryList()}
          getStateList={() => this.getStateList()}
          stateList={this.state.stateList}
          countryList={this.state.countryList}
        />
        <StateUpdateComponent
          updatedStateList={(str) => this.updatedStateList(str)}
          stateList={this.state.stateList}
          selectedState={this.state.selectedState}
          countryList={this.state.countryList}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cityListData: state.settingsData.cityList,
    stateListData: state.settingsData.stateList,
    countryListData: state.settingsData.countryList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    countryListInfo: (data) =>
      dispatch({ type: actionTypesUser.COUNTRY_LIST, payload: data }),
    stateListInfo: (data) =>
      dispatch({ type: actionTypesUser.STATE_LIST, payload: data }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StateComponent);
