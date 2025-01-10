import React from "react";
import { connect } from "react-redux";
import * as actionTypesUser from "../../../store/action/settings.action";
import VendorAddComponent from "./VendorAddComponent";
import VendorUpdateComponent from "./VendorUpdateComponent";
import VendorViewComponent from "./VendorViewComponent";
import SettingApi from "../../../api/Setting.api";
import { ArrayHelper } from "../../../helpers/arrayhelper";
import PaginationComponent from "../../../components/PaginationComponent";
import { USER_ID } from "../../../helpers/constants";
import LoaderComponent from "../../../components/LoaderComponent";
import ExcelDownloadButton from "../../../components/ExcelDownloadButton";
class VendorComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      vendorListAll: [],
      vendorListFilter: [],
      vendorList: [],
      selectedVendor: {},
      perPage: 8,
      currentPage: 1,
      vendorTypeList: [],
      vendorTypeId: "",
      vendorName: "",
      stateName: "",
      cityName: "",
      countryName: "",
      countryList: [],
      filteredNames: [],
    };
  }
  componentDidMount() {
    let vendorListData = this.props.vendorListData;
    if (vendorListData.length > 0) {
      let vendorList = [];
      for (let i = 0; i < this.state.perPage; i++) {
        if (ArrayHelper.getValue(vendorListData[i], "id") != "") {
          vendorList.push(vendorListData[i]);
        }
      }

      this.setState({
        vendorListAll: vendorListData,
        vendorListFilter: vendorListData,
        vendorList: vendorList,
        vendorTypeList: this.props.vendorTypeListData,
      });
    } else {
      this.getVendorList();
    }
    this.getCountryList();
  }
  getVendorList = async () => {
    this.setState({ loader: true });
    let vendorTypeListData = this.props.vendorTypeListData;

    if (vendorTypeListData.length > 0) {
      this.setState({ vendorTypeList: vendorTypeListData });
    } else {
      this.setState({ loader: true });
      let response = await SettingApi.GetSettingList("/api/VendorType/List");
      if (ArrayHelper.getValue(response, "isSuccess") == true) {
        this.setState({
          loader: false,
          vendorTypeList: ArrayHelper.getValue(response, "vendorTypes"),
        });
        this.props.vendorTypeListInfo(
          ArrayHelper.getValue(response, "vendorTypes")
        );
      }
    }
    let response = await SettingApi.GetSettingList("/api/Vendor/List");
    if (ArrayHelper.getValue(response, "isSuccess") == true) {
      let vendorList = [];

      for (let i = 0; i < this.state.perPage; i++) {
        if (
          ArrayHelper.getValue(
            ArrayHelper.getValue(response, "vendors")[i],
            "id"
          ) != ""
        ) {
          vendorList.push(ArrayHelper.getValue(response, "vendors")[i]);
        }
      }

      this.setState({
        loader: false,
        vendorListFilter: ArrayHelper.getValue(response, "vendors"),
        vendorListAll: ArrayHelper.getValue(response, "vendors"),
        vendorList: vendorList,
      });
      this.props.vendorListInfo(ArrayHelper.getValue(response, "vendors"));
    } else {
      this.setState({ loader: false });
    }
  };

  getCountryList = async () => {
    this.setState({ loader: true });
    let countryListData2 = this.props.countryListData2;
    console.log(countryListData2, "getCountryList--getCountryList");

    if (countryListData2.length > 0) {
      this.setState({ countryList: countryListData2 });
    }
    this.setState({ loader: false });
  };
  componentWillReceiveProps(nextProps) {
    if (this.state.vendorListFilter.length > 0) {
      const location = nextProps.params;
      if (
        location.page !== undefined &&
        location.page !== this.state.currentPage
      ) {
        let vendorList = [];
        let numRecord = 0;
        let i = 0;
        i = (location.page - 1) * this.state.perPage;
        numRecord = location.page * this.state.perPage;

        for (i; i < numRecord; i++) {
          if (
            ArrayHelper.getValue(this.state.vendorListFilter[i], "id") != ""
          ) {
            vendorList.push(this.state.vendorListFilter[i]);
          }
        }
        this.setState({
          currentPage: parseInt(location.page),
          vendorList: vendorList,
        });
      } else {
        let vendorList = [];

        for (let i = 0; i < this.state.perPage; i++) {
          if (
            ArrayHelper.getValue(this.state.vendorListFilter[i], "id") != ""
          ) {
            vendorList.push(this.state.vendorListFilter[i]);
          }
        }

        this.setState({ vendorList: vendorList, currentPage: 1 });
      }
    } else if (this.props.vendorListData.length > 0) {
      this.setState({ vendorList: [], currentPage: 1 });
    }
  }
  updatedVendorList = async (str) => {
    let vendorListAll = this.state.vendorListAll;
    vendorListAll = vendorListAll.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    let vendorList = this.state.vendorList;
    vendorList = vendorList.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    let vendorListFilter = this.state.vendorListFilter;
    vendorListFilter = vendorListFilter.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    this.setState({
      vendorListAll: vendorListAll,
      vendorList: vendorList,
      vendorListFilter: vendorListFilter,
      selectedVendor: str,
    });
    setTimeout(() => {
      this.props.vendorListInfo(vendorListAll);
    }, 10);
  };
  AgencyDelete = async (str) => {
    if (window.confirm("Do you want to delete selected Vendor?")) {
      this.setState({ loader: true });

      let formData = {
        requestedUserId: parseInt(localStorage.getItem(USER_ID)),
        vendorId: parseInt(str),
      };
      let response = await SettingApi.PostSettingList(
        formData,
        "/api/Vendor/Delete"
      );
      if (ArrayHelper.getValue(response, "isSuccess") == true) {
        let vendorListAll = this.state.vendorListAll;
        vendorListAll = vendorListAll.filter((item) => item.id != str);
        let vendorListFilter = this.state.vendorListAll;
        vendorListFilter = vendorListFilter.filter((item) => item.id != str);

        this.setState({
          loader: false,
          vendorListAll: vendorListAll,
          vendorListFilter: vendorListFilter,
        });
        setTimeout(() => {
          this.props.vendorListInfo(vendorListAll);
        }, 10);
        this.props.history("/settings/vendor");
      }
    }
  };
  reloadWindow() {
    window.location.reload();
  }
  filterData() {
    this.setState({ loader: true });
    let vendorListAll = this.state.vendorListAll;

    let vendorListFilter = vendorListAll.map((item) => {
      item.display = true;
      if (
        item.vendorName.search(new RegExp(this.state.vendorName.trim(), "i")) ==
        -1 &&
        this.state.vendorName.trim() != ""
      ) {
        item.display = false;
      }
      if (
        item.stateName.search(new RegExp(this.state.stateName.trim(), "i")) ==
        -1 &&
        this.state.stateName.trim() != ""
      ) {
        console.log("state");
        item.display = false;
      }
      if (
        item.cityName.search(new RegExp(this.state.cityName.trim(), "i")) ==
        -1 &&
        this.state.cityName.trim() != ""
      ) {
        item.display = false;
      }
      if (
        item.countryName.search(
          new RegExp(this.state.countryName.trim(), "i")
        ) == -1 &&
        this.state.countryName.trim() != ""
      ) {
        console.log("hii");
        item.display = false;
      }
      if (
        item.vendorTypeId != this.state.vendorTypeId &&
        this.state.vendorTypeId.trim() != ""
      ) {
        item.display = false;
      }

      return item;
    });

    let vendorListFilter1 = vendorListFilter.filter(
      (item) => item.display == true
    );

    this.setState({ vendorListFilter: vendorListFilter1, currentPage: 1 });
    setTimeout(() => {
      this.setState({ loader: false });
      this.props.history("/settings/vendor");
    }, 10);
  }
  clearData() {
    this.setState({
      loader: true,
      vendorName: "",
      vendorTypeId: "",
      stateName: "",
      cityName: "",
      currentPage: 1,
      vendorListFilter: this.state.vendorListAll,
    });
    setTimeout(() => {
      this.setState({ loader: false });
      this.props.history("/settings/vendor"); //cityName
    }, 10);
  }
  handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    if (name === "countryName") {
      const filteredNames = this.state.vendorListFilter
        .map((user) => user.countryName)
        .filter((countryName) =>
          countryName.toLowerCase().includes(value.toLowerCase())
        );

      this.setState({ countryName: value, filteredNames: filteredNames });
    } else {
      this.setState({ [name]: value });
    }

    if (name === "stateName") {
      const filteredNames = this.state.vendorListFilter
        .map((user) => user.stateName)
        .filter((stateName) =>
          stateName.toLowerCase().includes(value.toLowerCase())
        );

      this.setState({ stateName: value, filteredNames: filteredNames });
    }

    if (name === "cityName") {
      const filteredNames = this.state.vendorListFilter
        .map((user) => user.cityName)
        .filter((cityName) =>
          cityName.toLowerCase().includes(value.toLowerCase())
        );

      this.setState({ cityName: value, filteredNames: filteredNames });
    }
  };

  render() {
    const { vendorListFilter, vendorListAll } = this.state;
    const dataToExport =
      vendorListFilter.length > 0 ? vendorListFilter : vendorListAll;
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
                <h5 className="">Vendorxxx</h5>
              </div>
              <div className="col-md-8">
                <div className="row g-3 align-items-center">
                  <div className="col-sm-2">
                    <label>Name </label>
                    <input
                      type="text"
                      name="vendorName"
                      placeholder="Name"
                      value={this.state.vendorName}
                      onChange={this.handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="col-sm-2">
                    <label>Vendor Type </label>
                    <select
                      required
                      className="form-select form-noradious"
                      name="vendorTypeId"
                      value={this.state.vendorTypeId}
                      onChange={this.handleChange}
                    >
                      <option value="">Select Vendor Type</option>
                      {this.state.vendorTypeList.map((item, key) => {
                        return (
                          <option
                            key={`vendorTypeList-${key}`}
                            value={ArrayHelper.getValue(item, "id")}
                          >
                            {ArrayHelper.getValue(item, "name")}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="col-sm-2">
                    <label>Country Name </label>
                    <input
                      type="text"
                      name="countryName"
                      value={this.state.countryName}
                      onChange={this.handleChange}
                      className="form-control"
                      placeholder="Country Name"
                      list="nameSuggestions"
                    />
                    <datalist id="nameSuggestions">
                      {this.state.filteredNames.map((name, index) => (
                        <option key={index} value={name} />
                      ))}
                    </datalist>
                  </div>
                  <div className="col-sm-2">
                    <label>State Name </label>
                    <input
                      type="text"
                      name="stateName"
                      value={this.state.stateName}
                      onChange={this.handleChange}
                      className="form-control"
                      placeholder="State Name"
                      list="nameSuggestions"
                    />
                    <datalist id="nameSuggestions">
                      {this.state.filteredNames.map((name, index) => (
                        <option key={index} value={name} />
                      ))}
                    </datalist>
                  </div>
                  <div className="col-sm-2">
                    <label>City Name </label>
                    <input
                      type="text"
                      name="cityName"
                      value={this.state.cityName}
                      onChange={this.handleChange}
                      className="form-control"
                      placeholder="State Name"
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
                  data-bs-target="#vendorAdd"
                  className=""
                  style={{ marginRight: "20px" }}
                >
                  <img
                    src="/images/add.png"
                    alt="Add"
                    style={{ height: "40px", width: "40px" }}
                  />
                </button>
                {/* <button onClick={this.downloadExcel} type="button" className="btn btn-outlined ms-1">
                    <i className="fa-sharp fa-solid fa-download"></i> Download Excel
                  </button> */}

                <ExcelDownloadButton
                  data={dataToExport}
                  columns={[
                    "vendorName",
                    "vendorTypeName",
                    "countryName",
                    "stateName",
                    "cityName",
                    "email",
                    "primaryContactNo",
                    "address",
                    "zip",
                  ]}
                  fileName="ActionTypes.xlsx"
                  sheetName="Action Types"
                />
              </div>
            </div>

            <div className="borderless-box">
              <div className="table-responsive">
                {this.state.vendorList.length > 0 ? (
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Sr. No</th>
                        <th>Name</th>
                        <th>Vendor Type</th>
                        <th>Country Name</th>
                        <th>State Name</th>
                        <th>City Name</th>
                        <th>Primary Contact No</th>
                        <th>Email Address</th>
                        <th colSpan="3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.vendorList.map((item, key) => {
                        return (
                          <tr key={`agency-${key}`}>
                            {/* <td>{key+1}</td> */}

                            <td>
                              {(this.state.currentPage - 1) *
                                this.state.perPage +
                                key +
                                1}
                            </td>

                            <td>{ArrayHelper.getValue(item, "vendorName")}</td>
                            <td>
                              {ArrayHelper.getValue(item, "vendorTypeName")}
                            </td>
                            <td>{ArrayHelper.getValue(item, "countryName")}</td>
                            <td>{ArrayHelper.getValue(item, "stateName")}</td>
                            <td>{ArrayHelper.getValue(item, "cityName")}</td>
                            <td>
                              {ArrayHelper.getValue(item, "primaryContactNo")}
                            </td>
                            <td>{ArrayHelper.getValue(item, "email")}</td>
                            <td>
                              <i
                                data-bs-toggle="modal"
                                data-bs-target="#vendorView"
                                onClick={() => {
                                  this.setState({ selectedVendor: item });
                                }}
                                className="fa fa-eye btn"
                                data-bs-placement="top"
                                title="Edit"
                              ></i>
                            </td>
                            <td>
                              <i
                                data-bs-toggle="modal"
                                data-bs-target="#vendorUpdate"
                                onClick={() => {
                                  this.setState({ selectedVendor: item });
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
                {this.state.vendorListFilter.length > this.state.perPage ? (
                  <PaginationComponent
                    total={this.state.vendorListFilter.length}
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
        <VendorAddComponent getVendorList={() => this.getVendorList()} />
        <VendorUpdateComponent
          updatedVendorList={(str) => this.updatedVendorList(str)}
          selectedVendor={this.state.selectedVendor}
        />
        <VendorViewComponent selectedVendor={this.state.selectedVendor} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    vendorListData: state.settingsData.vendorList,
    vendorTypeListData: state.settingsData.vendorTypeList,
    countryListData2: state.settingsData.countryList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    vendorTypeListInfo: (data) =>
      dispatch({ type: actionTypesUser.VENDOR_TYPE_LIST, payload: data }),
    vendorListInfo: (data) =>
      dispatch({ type: actionTypesUser.VENDOR_LIST, payload: data }),
    countryListData: (data) =>
      dispatch({ type: actionTypesUser.COUNTRY_LIST, payload: data }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VendorComponent);
