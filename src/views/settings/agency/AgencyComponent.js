import React from "react";
import { connect } from "react-redux";
import * as actionTypesUser from "../../../store/action/settings.action";
import AgencyAddComponent from "./AgencyAddComponent";
import AgencyUpdateComponent from "./AgencyUpdateComponent";
import AgencyViewComponent from "./AgencyViewComponent";
import SettingApi from "../../../api/Setting.api";
import { ArrayHelper } from "../../../helpers/arrayhelper";
import PaginationComponent from "../../../components/PaginationComponent";
import { USER_ID } from "../../../helpers/constants";
import LoaderComponent from "../../../components/LoaderComponent";
import ExcelDownloadButton from "../../../components/ExcelDownloadButton";
class AgencyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      agencyListAll: [],
      agencyListFilter: [],
      agencyList: [],
      selectedAgency: {},
      perPage: 8,
      currentPage: 1,
      name: "",
      agnecyTypeName: "",
      greavesOfficeName: "",
      salesRegionName: "",
      agencyTypeList: [],
      greavesOfficeList: [],
      salesRegionList: [],
    };
  }
  componentDidMount() {
    let agencyListData = this.props.agencyListData;
    if (agencyListData.length > 0) {
      let agencyList = [];
      for (let i = 0; i < this.state.perPage; i++) {
        if (ArrayHelper.getValue(agencyListData[i], "id") != "") {
          agencyList.push(agencyListData[i]);
        }
      }

      this.setState({
        agencyListAll: agencyListData,
        agencyListFilter: agencyListData,
        agencyList: agencyList,
      });
    } else {
      this.getAgencyList();
    }
    this.getAgencyList2();
    this.getGreavesOfficeData();
    this.getSaleRegionListData();
  }
  getAgencyList = async () => {
    this.setState({ loader: true });
    let response = await SettingApi.GetSettingList("/api/Agency/List");

    if (ArrayHelper.getValue(response, "isSuccess") == true) {
      let agencyList = [];

      for (let i = 0; i < this.state.perPage; i++) {
        if (
          ArrayHelper.getValue(
            ArrayHelper.getValue(response, "agencies")[i],
            "id"
          ) != ""
        ) {
          agencyList.push(ArrayHelper.getValue(response, "agencies")[i]);
        }
      }

      this.setState({
        loader: false,
        agencyListAll: ArrayHelper.getValue(response, "agencies"),
        agencyListFilter: ArrayHelper.getValue(response, "agencies"),
        agencyList: agencyList,
      });
      setTimeout(() => {
        this.props.agencyListInfo(ArrayHelper.getValue(response, "agencies"));
      }, 10);
    } else {
      this.setState({ loader: false });
    }
  };
  componentWillReceiveProps(nextProps) {
    if (this.state.agencyListFilter.length > 0) {
      const location = nextProps.params;
      if (
        location.page !== undefined &&
        location.page !== this.state.currentPage
      ) {
        let agencyList = [];
        let numRecord = 0;
        let i = 0;
        i = (location.page - 1) * this.state.perPage;
        numRecord = location.page * this.state.perPage;

        for (i; i < numRecord; i++) {
          if (
            ArrayHelper.getValue(this.state.agencyListFilter[i], "id") != ""
          ) {
            agencyList.push(this.state.agencyListFilter[i]);
          }
        }
        this.setState({
          currentPage: parseInt(location.page),
          agencyList: agencyList,
        });
      } else {
        let agencyList = [];

        for (let i = 0; i < this.state.perPage; i++) {
          if (
            ArrayHelper.getValue(this.state.agencyListFilter[i], "id") != ""
          ) {
            agencyList.push(this.state.agencyListFilter[i]);
          }
        }

        this.setState({ agencyList: agencyList, currentPage: 1 });
      }
    } else if (this.props.agencyListData.length > 0) {
      this.setState({ agencyList: [], currentPage: 1 });
    }
  }
  updatedAgencyList = async (str) => {
    let agencyListAll = this.state.agencyListAll;
    console.log(str, "str", agencyListAll);
    agencyListAll = agencyListAll.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    let agencyList = this.state.agencyList;
    agencyList = agencyList.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    let agencyListFilter = this.state.agencyListFilter;
    agencyListFilter = agencyListFilter.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    this.setState({
      agencyListAll: agencyListAll,
      agencyListFilter: agencyListFilter,
      agencyList: agencyList,
      selectedAgency: str,
    });
    setTimeout(() => {
      this.props.agencyListInfo(agencyListAll);
    }, 10);
  };
  AgencyDelete = async (str) => {
    console.log(str, "str");
    if (window.confirm("Do you want to delete selected Agency?")) {
      this.setState({ loader: true });

      let formData = {
        requestedUserId: parseInt(localStorage.getItem(USER_ID)),
        agencyId: parseInt(str),
      };
      let response = await SettingApi.PostSettingList(
        formData,
        "/api/Agency/Delete"
      );
      if (ArrayHelper.getValue(response, "isSuccess") == true) {
        let agencyListAll = this.state.agencyListAll;
        agencyListAll = agencyListAll.filter((item) => item.id != str);
        let agencyListFilter = this.state.agencyListAll;
        agencyListFilter = agencyListFilter.filter((item) => item.id != str);

        this.setState({
          loader: false,
          agencyListAll: agencyListAll,
          agencyListFilter: agencyListFilter,
        });
        setTimeout(() => {
          this.props.agencyListInfo(agencyListAll);
        }, 10);
        this.props.history("/settings/agency");
      }
    }
  };
  reloadWindow() {
    window.location.reload();
  }
  filterData() {
    this.setState({ loader: true });

    let agencyListAll = this.state.agencyListAll;

    let agencyListFilter = agencyListAll.map((item) => {
      item.display = true;
      if (
        item.name.search(new RegExp(this.state.name.trim(), "i")) == -1 &&
        this.state.name.trim() != ""
      ) {
        item.display = false;
      }

      if (this.state.agnecyTypeName) {
        const agencyTypeMatch =
          item.agnecyTypeId === parseInt(this.state.agnecyTypeName);
        if (!agencyTypeMatch) item.display = false;
      }

      if (this.state.greavesOfficeName) {
        const greavesOfficeMatch =
          item.greavesOfficeId === parseInt(this.state.greavesOfficeName);
        console.log(
          `Greaves Office Match (${item.greavesOfficeId} === ${this.state.greavesOfficeName}): ${greavesOfficeMatch}`
        );
        if (!greavesOfficeMatch) item.display = false;
      }
      if (this.state.salesRegionName) {
        const salesRegionMatch =
          item.salesRegionId === parseInt(this.state.salesRegionName);
        if (!salesRegionMatch) item.display = false;
      }

      return item;
    });

    let agencyListFilter1 = agencyListFilter.filter(
      (item) => item.display === true
    );
    this.setState({
      agencyListFilter: agencyListFilter1,
      currentPage: 1,
    });

    setTimeout(() => {
      this.setState({ loader: false });
      this.props.history("/settings/agency");
    }, 10);
  }

  clearData() {
    this.setState({
      loader: true,
      name: "",
      agnecyTypeName: "",
      greavesOfficeName: "",
      salesRegionName: "",
      currentPage: 1,
      agencyListFilter: this.state.agencyListAll,
    });
    setTimeout(() => {
      this.setState({ loader: false });
      this.props.history("/settings/agency");
    }, 10);
  }
  handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    console.log(`Changed field: ${name}, value: ${value}`);
    this.setState({ ...this.state, [name]: value });
  };

  getAgencyList2 = async () => {
    this.setState({ loader: true });
    let agencyTypeListInfoData = this.props.agencyTypeListInfoData;
    console.log(
      agencyTypeListInfoData,
      "agencyTypeListInfoDataagencyTypeListInfoData"
    );

    if (agencyTypeListInfoData.length > 0) {
      this.setState({ agencyTypeList: agencyTypeListInfoData });
    }
    this.setState({ loader: false });
  };

  getGreavesOfficeData = async () => {
    this.setState({ loader: true });
    let greavesOfficeListData = this.props.greavesOfficeListData;
    console.log(
      greavesOfficeListData,
      "greavesOfficeListDatagreavesOfficeListData"
    );

    if (greavesOfficeListData.length > 0) {
      this.setState({ greavesOfficeList: greavesOfficeListData });
    }
    this.setState({ loader: false });
  };

  //   saleRegionListData

  getSaleRegionListData = async () => {
    this.setState({ loader: true });
    let saleRegionListData = this.props.saleRegionListData;
    console.log(saleRegionListData, "saleRegionListDatasaleRegionListData");

    if (saleRegionListData.length > 0) {
      this.setState({ salesRegionList: saleRegionListData });
    }
    this.setState({ loader: false });
  };

  render() {
    const { agencyListFilter, agencyListAll } = this.state;
    const dataToExport =
      agencyListFilter.length > 0 ? agencyListFilter : agencyListAll;
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
                <h5 className="">Air Line</h5>
              </div>
              <div className="col-md-8">
                <div className="row g-3 align-items-center">
                  <div className="col-sm-2">
                    <label>Name </label>
                    <input
                      type="text"
                      name="name"
                      value={this.state.name}
                      onChange={this.handleChange}
                      className="form-control"
                      placeholder="Name"
                    />
                  </div>
                  <div className="col-sm-2">
                    <label>Agency Type </label>

                    <select
                      required
                      className="form-select form-noradious"
                      name="agnecyTypeName"
                      value={this.state.agnecyTypeName}
                      onChange={this.handleChange}
                    >
                      <option value="">Agency Type</option>
                      {this.state.agencyTypeList.map((item, key) => {
                        return (
                          <option
                            key={`agencyTypeList-${key}`}
                            value={ArrayHelper.getValue(item, "id")}
                          >
                            {ArrayHelper.getValue(item, "name")}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="col-sm-2">
                    <label>Greaves Office </label>
                    {/* <input
                      type="text"
                      name="greavesOfficeName"
                      value={this.state.greavesOfficeName}
                      onChange={this.handleChange}
                      className="form-control"
                      placeholder="Greaves Office"
                    /> */}

                    <select
                      required
                      className="form-select form-noradious"
                      name="greavesOfficeName"
                      value={this.state.greavesOfficeName}
                      onChange={this.handleChange}
                    >
                      <option value="">Greaves Office</option>
                      {this.state.greavesOfficeList.map((item, key) => {
                        return (
                          <option
                            key={`greavesOfficeList-${key}`}
                            value={ArrayHelper.getValue(item, "id")}
                          >
                            {ArrayHelper.getValue(item, "name")}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="col-sm-2">
                    <label>Sales Region </label>
                    {/* <input
                      type="text"
                      name="salesRegionName"
                      value={this.state.salesRegionName}
                      onChange={this.handleChange}
                      className="form-control"
                      placeholder="Sales Region"
                    /> */}

                    <select
                      required
                      className="form-select form-noradious"
                      name="salesRegionName"
                      value={this.state.salesRegionName}
                      onChange={this.handleChange}
                    >
                      <option value="">Sales Region</option>
                      {this.state.salesRegionList.map((item, key) => {
                        return (
                          <option
                            key={`salesRegionList-${key}`}
                            value={ArrayHelper.getValue(item, "id")}
                          >
                            {ArrayHelper.getValue(item, "name")}
                          </option>
                        );
                      })}
                    </select>
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
                  data-bs-target="#agencyAdd"
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
                  columns={[
                    "name",
                    "agnecyTypeName",
                    "greavesOfficeName",
                    "salesRegionName",
                    "email",
                    "zip",
                    "address",
                    "cityName",
                    "stateName",
                    "countryName",
                  ]}
                  fileName="ActionTypes.xlsx"
                  sheetName="Action Types"
                />
              </div>
            </div>

            <div className="borderless-box">
              <div className="table-responsive">
                {this.state.agencyList.length > 0 ? (
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Sr. No</th>
                        <th>Name</th>
                        <th>Agency Type</th>
                        <th>Greaves Office</th>
                        <th>Sales Region</th>
                        <th colSpan="3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.agencyList.map((item, key) => {
                        return (
                          <tr key={`agency-${key}`}>
                            {/* <td>{key+1}</td> */}
                            <td>
                              {(this.state.currentPage - 1) *
                                this.state.perPage +
                                key +
                                1}
                            </td>

                            <td>{ArrayHelper.getValue(item, "name")}</td>
                            <td>
                              {ArrayHelper.getValue(item, "agnecyTypeName")}
                            </td>
                            <td>
                              {ArrayHelper.getValue(item, "greavesOfficeName")}
                            </td>
                            <td>
                              {ArrayHelper.getValue(item, "salesRegionName")}
                            </td>
                            <td>
                              <i
                                data-bs-toggle="modal"
                                data-bs-target="#agencyView"
                                onClick={() => {
                                  this.setState({ selectedAgency: item });
                                }}
                                className="fa fa-eye btn"
                                data-bs-placement="top"
                                title="Edit"
                              ></i>
                            </td>
                            <td>
                              <i
                                data-bs-toggle="modal"
                                data-bs-target="#agencyUpdate"
                                onClick={() => {
                                  this.setState({ selectedAgency: item });
                                }}
                                className="fa fa-edit btn"
                                data-bs-placement="top"
                                title="Edit"
                              ></i>
                            </td>
                            <td>
                              <i
                                onClick={() =>
                                  this.AgencyDelete(
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
                {this.state.agencyListFilter.length > this.state.perPage ? (
                  <PaginationComponent
                    total={this.state.agencyListFilter.length}
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
        <AgencyAddComponent getAgencyList={() => this.getAgencyList()} />
        <AgencyUpdateComponent
          updatedAgencyList={(str) => this.updatedAgencyList(str)}
          selectedAgency={this.state.selectedAgency}
        />
        <AgencyViewComponent selectedAgency={this.state.selectedAgency} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    agencyListData: state.settingsData.agencyList,
    agencyTypeListInfoData: state.settingsData.agencyTypeList,
    greavesOfficeListData: state.settingsData.greavesOfficeList,
    saleRegionListData: state.settingsData.salesRegionList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    agencyListInfo: (data) =>
      dispatch({ type: actionTypesUser.AGENCY_LIST, payload: data }),
    agencyTypeListInfo: (data) =>
      dispatch({ type: actionTypesUser.AGENCY_TYPE_LIST, payload: data }),
    greavesOfficeList: (data) =>
      dispatch({ type: actionTypesUser.GREAVES_OFFICE_LIST, payload: data }),
    saleRegionList: (data) =>
      dispatch({ type: actionTypesUser.SALES_REGION_LIST, payload: data }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AgencyComponent);
