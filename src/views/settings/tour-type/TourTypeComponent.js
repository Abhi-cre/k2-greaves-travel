import React from "react";
import { connect } from "react-redux";
import * as actionTypesUser from "../../../store/action/settings.action";
import TourTypeAddComponent from "./TourTypeAddComponent";
import TourTypeUpdateComponent from "./TourTypeUpdateComponent";
import SettingApi from "../../../api/Setting.api";
import { ArrayHelper } from "../../../helpers/arrayhelper";
import PaginationComponent from "../../../components/PaginationComponent";
import { USER_ID } from "../../../helpers/constants";
import LoaderComponent from "../../../components/LoaderComponent";
import * as XLSX from "xlsx";
import ExcelDownloadButton from "../../../components/ExcelDownloadButton";
class TourTypeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      tourTypeListAll: [],
      tourTypeListFilter: [],
      tourTypeList: [],
      selectedTourType: {},
      perPage: 20,
      currentPage: 1,
      keyword: "",
      filteredNames: [],
    };
  }
  componentDidMount() {
    let tourTypeListData = this.props.tourTypeListData;
    if (tourTypeListData.length > 0) {
      let tourTypeList = [];
      for (let i = 0; i < this.state.perPage; i++) {
        if (ArrayHelper.getValue(tourTypeListData[i], "id") != "") {
          tourTypeList.push(tourTypeListData[i]);
        }
      }

      this.setState({
        tourTypeListAll: tourTypeListData,
        tourTypeListFilter: tourTypeListData,
        tourTypeList: tourTypeList,
      });
    } else {
      this.getTourTypeList();
    }
  }
  getTourTypeList = async () => {
    this.setState({ loader: true });
    let response = await SettingApi.GetSettingList("/api/TourType/List");
    if (ArrayHelper.getValue(response, "isSuccess") == true) {
      let tourTypeList = [];

      for (let i = 0; i < this.state.perPage; i++) {
        if (
          ArrayHelper.getValue(
            ArrayHelper.getValue(response, "tourTypes")[i],
            "id"
          ) != ""
        ) {
          tourTypeList.push(ArrayHelper.getValue(response, "tourTypes")[i]);
        }
      }

      this.setState({
        loader: false,
        tourTypeListAll: ArrayHelper.getValue(response, "tourTypes"),
        tourTypeListFilter: ArrayHelper.getValue(response, "tourTypes"),
        tourTypeList: tourTypeList,
      });
      this.props.tourTypeListInfo(ArrayHelper.getValue(response, "tourTypes"));
    } else {
      this.setState({ loader: false });
    }
  };
  componentWillReceiveProps(nextProps) {
    if (this.state.tourTypeListFilter.length > 0) {
      const location = nextProps.params;
      if (
        location.page !== undefined &&
        location.page !== this.state.currentPage
      ) {
        let tourTypeList = [];
        let numRecord = 0;
        let i = 0;
        i = (location.page - 1) * this.state.perPage;
        numRecord = location.page * this.state.perPage;

        for (i; i < numRecord; i++) {
          if (
            ArrayHelper.getValue(this.state.tourTypeListFilter[i], "id") != ""
          ) {
            tourTypeList.push(this.state.tourTypeListFilter[i]);
          }
        }
        this.setState({
          currentPage: parseInt(location.page),
          tourTypeList: tourTypeList,
        });
      } else {
        let tourTypeList = [];

        for (let i = 0; i < this.state.perPage; i++) {
          if (
            ArrayHelper.getValue(this.state.tourTypeListFilter[i], "id") != ""
          ) {
            tourTypeList.push(this.state.tourTypeListFilter[i]);
          }
        }

        this.setState({ tourTypeList: tourTypeList, currentPage: 1 });
      }
    } else if (this.props.tourTypeListData.length > 0) {
      this.setState({ tourTypeList: [], currentPage: 1 });
    }
  }
  updatedTourTypeList = async (str) => {
    let tourTypeListAll = this.state.tourTypeListAll;
    tourTypeListAll = tourTypeListAll.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    let tourTypeList = this.state.tourTypeList;
    tourTypeList = tourTypeList.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    let tourTypeListFilter = this.state.tourTypeListFilter;
    tourTypeListFilter = tourTypeListFilter.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    this.setState({
      tourTypeListAll: tourTypeListAll,
      tourTypeListFilter: tourTypeListFilter,
      tourTypeList: tourTypeList,
      selectedTourType: str,
    });
    this.props.tourTypeListInfo(tourTypeListAll);
  };
  SalesRegionDelete = async (str) => {
    if (window.confirm("Do you want to delete selected Tour Type?")) {
      this.setState({ loader: true });

      let formData = {
        requestedUserId: parseInt(localStorage.getItem(USER_ID)),
        tourTypeId: parseInt(str),
      };
      let response = await SettingApi.PostSettingList(
        formData,
        "/api/TourType/Delete"
      );
      if (ArrayHelper.getValue(response, "isSuccess") == true) {
        let tourTypeListAll = this.state.tourTypeListAll;
        tourTypeListAll = tourTypeListAll.filter((item) => item.id != str);
        let tourTypeListFilter = this.state.tourTypeListFilter;
        tourTypeListFilter = tourTypeListFilter.filter(
          (item) => item.id != str
        );

        this.setState({
          loader: false,
          tourTypeListAll: tourTypeListAll,
          tourTypeListFilter: tourTypeListFilter,
        });
        this.props.tourTypeListInfo(tourTypeListAll);
        this.props.history("/settings/tour-type");
      }
    }
  };
  reloadWindow() {
    window.location.reload();
  }
  filterData() {
    this.setState({ loader: true });
    let tourTypeListAll = this.state.tourTypeListAll;
    if (this.state.keyword.trim() != "") {
      let tourTypeListFilter = tourTypeListAll.filter((item) => {
        if (
          item.name.search(new RegExp(this.state.keyword.trim(), "i")) != -1 &&
          this.state.keyword.trim() != ""
        ) {
          return item;
        }
      });
      this.setState({ tourTypeListFilter: tourTypeListFilter, currentPage: 1 });
      setTimeout(() => {
        this.setState({ loader: false });
        this.props.history("/settings/tour-type");
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
      tourTypeListFilter: this.state.tourTypeListAll,
    });
    setTimeout(() => {
      this.setState({ loader: false });
      this.props.history("/settings/tour-type");
    }, 10);
  }
  handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    if (name === "keyword") {
      const filteredNames = this.state.tourTypeListFilter
        .map((user) => user.name)
        .filter((name) => name.toLowerCase().includes(value.toLowerCase()));
      this.setState({ keyword: value, filteredNames: filteredNames });
    } else {
      this.setState({ [name]: value });
    }
  };

  render() {
    const { tourTypeListFilter, tourTypeListAll } = this.state;
    const dataToExport =
      tourTypeListFilter.length > 0 ? tourTypeListFilter : tourTypeListAll;
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
                <h5 className="">Tour Type</h5>
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
                    data-bs-target="#tourTypeAdd"
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
                {this.state.tourTypeList.length > 0 ? (
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Sr. No</th>
                        <th>Name</th>
                        <th colSpan="2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.tourTypeList.map((item, key) => {
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
                                data-bs-target="#tourTypeUpdate"
                                onClick={() => {
                                  this.setState({ selectedTourType: item });
                                }}
                                className="fa fa-edit btn"
                                data-bs-placement="top"
                                title="Edit"
                              ></i>
                            </td>
                            <td>
                              <i
                                onClick={() =>
                                  this.SalesRegionDelete(
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
                {this.state.tourTypeListFilter.length > this.state.perPage ? (
                  <PaginationComponent
                    total={this.state.tourTypeListFilter.length}
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
        <TourTypeAddComponent getTourTypeList={() => this.getTourTypeList()} />
        <TourTypeUpdateComponent
          updatedTourTypeList={(str) => this.updatedTourTypeList(str)}
          selectedTourType={this.state.selectedTourType}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    tourTypeListData: state.settingsData.tourTypeList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    tourTypeListInfo: (data) =>
      dispatch({ type: actionTypesUser.TOUR_TYPE_LIST, payload: data }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TourTypeComponent);
