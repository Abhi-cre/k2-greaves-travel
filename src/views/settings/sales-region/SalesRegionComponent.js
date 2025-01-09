import React from "react";
import { connect } from "react-redux";
import * as actionTypesUser from "../../../store/action/settings.action";
import SalesRegionAddComponent from "./SalesRegionAddComponent";
import SalesRegionUpdateComponent from "./SalesRegionUpdateComponent";
import SettingApi from "../../../api/Setting.api";
import { ArrayHelper } from "../../../helpers/arrayhelper";
import PaginationComponent from "../../../components/PaginationComponent";
import { USER_ID } from "../../../helpers/constants";
import LoaderComponent from "../../../components/LoaderComponent";
import ExcelDownloadButton from "../../../components/ExcelDownloadButton";
class SalesRegionComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      salesRegionListAll: [],
      salesRegionListFilter: [],
      salesRegionList: [],
      selectedSalesRegion: {},
      perPage: 8,
      currentPage: 1,
      keyword: "",
      filteredNames: [],
    };
  }
  componentDidMount() {
    let salesRegionListData = this.props.salesRegionListData;
    if (salesRegionListData.length > 0) {
      let salesRegionList = [];
      for (let i = 0; i < this.state.perPage; i++) {
        if (ArrayHelper.getValue(salesRegionListData[i], "id") != "") {
          salesRegionList.push(salesRegionListData[i]);
        }
      }

      this.setState({
        salesRegionListAll: salesRegionListData,
        salesRegionListFilter: salesRegionListData,
        salesRegionList: salesRegionList,
      });
    } else {
      this.getSalesRegionList();
    }
  }
  getSalesRegionList = async () => {
    this.setState({ loader: true });
    let response = await SettingApi.GetSettingList("/api/SalesRegion/List");
    if (ArrayHelper.getValue(response, "isSuccess") == true) {
      let salesRegionList = [];

      for (let i = 0; i < this.state.perPage; i++) {
        if (
          ArrayHelper.getValue(
            ArrayHelper.getValue(response, "salesRegions")[i],
            "id"
          ) != ""
        ) {
          salesRegionList.push(
            ArrayHelper.getValue(response, "salesRegions")[i]
          );
        }
      }

      this.setState({
        loader: false,
        salesRegionListAll: ArrayHelper.getValue(response, "salesRegions"),
        salesRegionListFilter: ArrayHelper.getValue(response, "salesRegions"),
        salesRegionList: salesRegionList,
      });
      this.props.salesRegionListInfo(
        ArrayHelper.getValue(response, "salesRegions")
      );
    } else {
      this.setState({ loader: false });
    }
  };
  componentWillReceiveProps(nextProps) {
    if (this.state.salesRegionListFilter.length > 0) {
      const location = nextProps.params;
      if (
        location.page !== undefined &&
        location.page !== this.state.currentPage
      ) {
        let salesRegionList = [];
        let numRecord = 0;
        let i = 0;
        i = (location.page - 1) * this.state.perPage;
        numRecord = location.page * this.state.perPage;

        for (i; i < numRecord; i++) {
          if (
            ArrayHelper.getValue(this.state.salesRegionListFilter[i], "id") !=
            ""
          ) {
            salesRegionList.push(this.state.salesRegionListFilter[i]);
          }
        }
        this.setState({
          currentPage: parseInt(location.page),
          salesRegionList: salesRegionList,
        });
      } else {
        let salesRegionList = [];

        for (let i = 0; i < this.state.perPage; i++) {
          if (
            ArrayHelper.getValue(this.state.salesRegionListFilter[i], "id") !=
            ""
          ) {
            salesRegionList.push(this.state.salesRegionListFilter[i]);
          }
        }

        this.setState({ salesRegionList: salesRegionList, currentPage: 1 });
      }
    } else if (this.props.salesRegionListData.length > 0) {
      this.setState({ salesRegionList: [], currentPage: 1 });
    }
  }
  updatedSalesRegionList = async (str) => {
    let salesRegionListAll = this.state.salesRegionListAll;
    salesRegionListAll = salesRegionListAll.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    let salesRegionList = this.state.salesRegionList;
    salesRegionList = salesRegionList.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    let salesRegionListFilter = this.state.salesRegionListFilter;
    salesRegionListFilter = salesRegionListFilter.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    this.setState({
      salesRegionListAll: salesRegionListAll,
      salesRegionListFilter: salesRegionListFilter,
      salesRegionList: salesRegionList,
      selectedSalesRegion: str,
    });
    this.props.salesRegionListInfo(salesRegionListAll);
  };
  SalesRegionDelete = async (str) => {
    if (window.confirm("Do you want to delete selected Sales Region?")) {
      this.setState({ loader: true });

      let formData = {
        requestedUserId: parseInt(localStorage.getItem(USER_ID)),
        salesRegionId: parseInt(str),
      };
      let response = await SettingApi.PostSettingList(
        formData,
        "/api/SalesRegion/Delete"
      );
      if (ArrayHelper.getValue(response, "isSuccess") == true) {
        let salesRegionListAll = this.state.salesRegionListAll;
        salesRegionListAll = salesRegionListAll.filter(
          (item) => item.id != str
        );
        let salesRegionListFilter = this.state.salesRegionListFilter;
        salesRegionListFilter = salesRegionListFilter.filter(
          (item) => item.id != str
        );

        this.setState({
          loader: false,
          salesRegionListAll: salesRegionListAll,
          salesRegionListFilter: salesRegionListFilter,
        });
        this.props.salesRegionListInfo(salesRegionListAll);
        this.props.history("/settings/sales-region");
      }
    }
  };
  reloadWindow() {
    window.location.reload();
  }
  filterData() {
    this.setState({ loader: true });
    let salesRegionListAll = this.state.salesRegionListAll;
    if (this.state.keyword.trim() != "") {
      let salesRegionListFilter = salesRegionListAll.filter((item) => {
        if (
          item.name.search(new RegExp(this.state.keyword.trim(), "i")) != -1 &&
          this.state.keyword.trim() != ""
        ) {
          return item;
        }
      });
      this.setState({
        salesRegionListFilter: salesRegionListFilter,
        currentPage: 1,
      });
      setTimeout(() => {
        this.setState({ loader: false });
        this.props.history("/settings/sales-region");
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
      salesRegionListFilter: this.state.salesRegionListAll,
    });
    setTimeout(() => {
      this.setState({ loader: false });
      this.props.history("/settings/sales-region");
    }, 10);
  }
  handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    if (name === "keyword") {
      const filteredNames = this.state.salesRegionListFilter
        .map((user) => user.name)
        .filter((name) => name.toLowerCase().includes(value.toLowerCase()));
      this.setState({ keyword: value, filteredNames: filteredNames });
    } else {
      this.setState({ [name]: value });
    }
  };

  render() {
    const { salesRegionListFilter, salesRegionListAll } = this.state;
    const dataToExport =
      salesRegionListFilter.length > 0
        ? salesRegionListFilter
        : salesRegionListAll;
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
                <h5 className="">Sales Region</h5>
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
                  data-bs-target="#salesRegionAdd"
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
            <div className="borderless-box">
              <div className="table-responsive">
                {this.state.salesRegionList.length > 0 ? (
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Sr. No</th>
                        <th>Name</th>
                        <th colSpan="2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.salesRegionList.map((item, key) => {
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
                                data-bs-target="#salesRegionUpdate"
                                onClick={() => {
                                  this.setState({ selectedSalesRegion: item });
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
                {this.state.salesRegionListFilter.length >
                this.state.perPage ? (
                  <PaginationComponent
                    total={this.state.salesRegionListFilter.length}
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
        <SalesRegionAddComponent
          getSalesRegionList={() => this.getSalesRegionList()}
        />
        <SalesRegionUpdateComponent
          updatedSalesRegionList={(str) => this.updatedSalesRegionList(str)}
          selectedSalesRegion={this.state.selectedSalesRegion}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    salesRegionListData: state.settingsData.salesRegionList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    salesRegionListInfo: (data) =>
      dispatch({ type: actionTypesUser.SALES_REGION_LIST, payload: data }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SalesRegionComponent);
