import React from "react";
import { connect } from "react-redux";
import * as actionTypesUser from "../../../store/action/settings.action";
import { DISPLAYDATEFORMATE } from "../../../helpers/constants";
import ServiceAddComponent from "./ServiceAddComponent";
import ServiceUpdateComponent from "./ServiceUpdateComponent";
import ServiceViewComponent from "./ServiceViewComponent";
import SettingApi from "../../../api/Setting.api";
import { ArrayHelper } from "../../../helpers/arrayhelper";
import PaginationComponent from "../../../components/PaginationComponent";
import { USER_ID } from "../../../helpers/constants";
import LoaderComponent from "../../../components/LoaderComponent";
import {
  addsDays,
  subsDays,
  formatDate,
  GETDATETIME,
} from "../../../vendor/datefns";
import * as XLSX from "xlsx";
declare var $;
class ServiceComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      vendorTypeList: [],
      vendorList: [],
      serviceListFilter: [],
      serviceListAll: [],
      serviceList: [],
      selectedService: {},
      perPage: 8,
      currentPage: 1,
      vendorTypeId: 0,
      name: "",
      vendorType: "",
      vendorName: "",
      startDate: "",
      endDate: "",
      filteredNames: [],
      filteredVendor: [],
    };
  }
  componentDidMount() {
    $("#searchStartDate")
      .datepicker()
      .on("change", (e: any) => {
        $("#searchEndDate").datepicker(
          "option",
          "minDate",
          addsDays(e.target.value, 1)
        );

        this.setState({ startDate: e.target.value });
      });

    $("#searchEndDate")
      .datepicker()
      .on("change", (e: any) => {
        $("#searchStartDate").datepicker(
          "option",
          "maxDate",
          subsDays(e.target.value, 1)
        );
        this.setState({ endDate: e.target.value });
      });
    let serviceListData = this.props.serviceListData;
    if (serviceListData.length > 0) {
      let serviceList = [];
      for (let i = 0; i < this.state.perPage; i++) {
        if (ArrayHelper.getValue(serviceListData[i], "id") != "") {
          serviceList.push(serviceListData[i]);
        }
      }

      this.setState({
        serviceListAll: serviceListData,
        serviceList: serviceList,
        vendorTypeList: this.props.vendorTypeListData,
      });
    } else {
      this.getServiceList();
    }
  }
  getServiceList = async () => {
    this.setState({ loader: true });
    let vendorTypeListData = this.props.vendorTypeListData;

    if (vendorTypeListData.length > 0) {
      this.setState({ vendorTypeList: vendorTypeListData });
    } else {
      this.setState({ loader: true });
      let response = await SettingApi.GetSettingList("/api/VendorType/List");
      console.log(
        response,
        "vendorTypeListDatavendorTypeListDatavendorTypeListData"
      );

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
    let vendorListData = this.props.vendorListData;
    if (vendorListData.length > 0) {
      this.setState({ vendorList: vendorListData });
    } else {
      this.setState({ loader: true });
      let response = await SettingApi.GetSettingList("/api/Vendor/List");
      console.log(response, "Vendor/ListVendor/ListVendor/List");

      if (ArrayHelper.getValue(response, "isSuccess") == true) {
        this.setState({
          loader: false,
          vendorList: ArrayHelper.getValue(response, "vendors"),
        });
        this.props.vendorListInfo(ArrayHelper.getValue(response, "vendors"));
      }
    }
    let response = await SettingApi.GetSettingList("/api/Service/List");
    if (ArrayHelper.getValue(response, "isSuccess") == true) {
      let serviceList = [];

      for (let i = 0; i < this.state.perPage; i++) {
        if (
          ArrayHelper.getValue(
            ArrayHelper.getValue(response, "services")[i],
            "id"
          ) != ""
        ) {
          serviceList.push(ArrayHelper.getValue(response, "services")[i]);
        }
      }

      this.setState({
        loader: false,
        serviceListFilter: ArrayHelper.getValue(response, "services"),
        serviceListAll: ArrayHelper.getValue(response, "services"),
        serviceList: serviceList,
      });
      this.props.serviceListInfo(ArrayHelper.getValue(response, "services"));
    } else {
      this.setState({ loader: false });
    }
  };
  componentWillReceiveProps(nextProps) {
    if (this.state.serviceListFilter.length > 0) {
      const location = nextProps.params;
      if (
        location.page !== undefined &&
        location.page !== this.state.currentPage
      ) {
        let serviceList = [];
        let numRecord = 0;
        let i = 0;
        i = (location.page - 1) * this.state.perPage;
        numRecord = location.page * this.state.perPage;

        for (i; i < numRecord; i++) {
          if (
            ArrayHelper.getValue(this.state.serviceListFilter[i], "id") != ""
          ) {
            serviceList.push(this.state.serviceListFilter[i]);
          }
        }
        this.setState({
          currentPage: parseInt(location.page),
          serviceList: serviceList,
        });
      } else {
        let serviceList = [];

        for (let i = 0; i < this.state.perPage; i++) {
          if (
            ArrayHelper.getValue(this.state.serviceListFilter[i], "id") != ""
          ) {
            serviceList.push(this.state.serviceListFilter[i]);
          }
        }

        this.setState({ serviceList: serviceList, currentPage: 1 });
      }
    } else if (this.props.serviceListData.length > 0) {
      this.setState({ serviceList: [], currentPage: 1 });
    }
  }
  updatedServiceList = async (str) => {
    let serviceListAll = this.state.serviceListAll;
    serviceListAll = serviceListAll.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    let serviceList = this.state.serviceList;
    serviceList = serviceList.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    this.setState({
      serviceListAll: serviceListAll,
      serviceList: serviceList,
      selectedService: str,
    });
    this.props.serviceListInfo(serviceListAll);
  };
  ServiceDelete = async (str) => {
    if (window.confirm("Do you want to delete selected Service?")) {
      this.setState({ loader: true });

      let formData = {
        requestedUserId: parseInt(localStorage.getItem(USER_ID)),
        serviceId: parseInt(str),
      };
      let response = await SettingApi.PostSettingList(
        formData,
        "/api/Service/Delete"
      );
      if (ArrayHelper.getValue(response, "isSuccess") == true) {
        let serviceListAll = this.state.serviceListAll;
        serviceListAll = serviceListAll.filter((item) => item.id != str);
        let serviceListFilter = this.state.serviceListFilter;
        serviceListFilter = serviceListFilter.filter((item) => item.id != str);
        let serviceList = this.state.serviceList;
        serviceList = serviceList.filter((item) => item.id != str);

        this.setState({
          loader: false,
          serviceListAll: serviceListAll,
          serviceList: serviceList,
          serviceListFilter: serviceListFilter,
        });
        //this.props.serviceListInfo(serviceListAll);
        // this.props.history("/settings/service");
      }
    }
  };
  reloadWindow() {
    window.location.reload();
  }
  filterData() {
    this.setState({ loader: true });
    let serviceListAll = this.state.serviceListAll;

    let serviceListFilter = serviceListAll.map((item) => {
      item.display = true;
      if (
        item.name.search(new RegExp(this.state.name.trim(), "i")) == -1 &&
        this.state.name.trim() != ""
      ) {
        item.display = false;
      }
      if (
        item.vendorTypeId != this.state.vendorTypeId &&
        this.state.vendorTypeId != ""
      ) {
        item.display = false;
      }
      if (
        item.vendorName.search(new RegExp(this.state.vendorName.trim(), "i")) ==
          -1 &&
        this.state.vendorName.trim() != ""
      ) {
        item.display = false;
      }
      if (
        GETDATETIME(item.startDate) < GETDATETIME(this.state.startDate) &&
        this.state.startDate.trim() != ""
      ) {
        item.display = false;
      }
      if (
        GETDATETIME(item.endDate) > GETDATETIME(this.state.endDate) &&
        this.state.endDate.trim() != ""
      ) {
        item.display = false;
      }
      return item;
    });

    let serviceListFilter1 = serviceListFilter.filter(
      (item) => item.display == true
    );
    this.setState({ serviceListFilter: serviceListFilter1, currentPage: 1 });
    setTimeout(() => {
      this.setState({ loader: false });
      this.props.history("/settings/service");
    }, 10);
  }
  clearData() {
    this.setState({
      loader: true,
      name: "",
      vendorTypeId: "",
      vendorName: "",
      startDate: "",
      endDate: "",
      currentPage: 1,
      serviceListFilter: this.state.serviceListAll,
    });
    setTimeout(() => {
      this.setState({ loader: false });
      this.props.history("/settings/service");
    }, 10);
  }

  handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      const filteredNames = this.state.serviceListFilter
        .map((user) => user.name)
        .filter((name) => name.toLowerCase().includes(value.toLowerCase()))
        .filter((value, index, self) => self.indexOf(value) === index);

      this.setState({ name: value, filteredNames });
    } else if (name === "vendorName") {
      const filteredVendor = this.state.serviceListFilter
        .map((user) => user.vendorName)
        .filter((vendorName) =>
          vendorName.toLowerCase().includes(value.toLowerCase())
        )
        .filter((value, index, self) => self.indexOf(value) === index);

      this.setState({ vendorName: value, filteredVendor });
    } else {
      // For other fields, just update the state
      this.setState({ [name]: value });
    }
  };

  downloadExcel = () => {
    const { serviceListFilter, vendorTypeList } = this.state;
    const dataToExport = serviceListFilter.length > 0 ? serviceListFilter : [];

    if (dataToExport.length === 0) {
      alert("No data available to export!");
      return;
    }

    const columns = [];
    const formattedData = dataToExport.map((item, index) => {
      const vendorType = vendorTypeList.find(
        (vt) => vt.id === item.vendorTypeId
      );
      const vendorTypeName = vendorType ? vendorType.name : "";

      const startDate = ArrayHelper.getValue(
        item,
        "serviceFeeDetails[0].startDate"
      );
      const endDate = ArrayHelper.getValue(
        item,
        "serviceFeeDetails[0].endDate"
      );

      const formattedStartDate =
        startDate && startDate !== "0001-01-01T00:00:00"
          ? formatDate(startDate, "dd-MM-yyyy")
          : "";
      const formattedEndDate =
        endDate && endDate !== "0001-01-01T00:00:00"
          ? formatDate(endDate, "dd-MM-yyyy")
          : "";

      const formattedRow = {
        SrNo: index + 1,
        Name: item.name,
        Vendor_TypeName: vendorTypeName,
        Vendor_Name: item.vendorName,
        VendorId: item.vendorId,
        Start_Date: formattedStartDate,
        End_Date: formattedEndDate,
      };

      Object.keys(formattedRow).forEach((key) => {
        if (
          !columns.includes(key) &&
          formattedRow[key] !== undefined &&
          formattedRow[key] !== null &&
          formattedRow[key] !== ""
        ) {
          columns.push(key);
        }
      });

      return formattedRow;
    });

    const finalData = formattedData.filter((row) =>
      columns.some(
        (column) =>
          row[column] !== undefined &&
          row[column] !== null &&
          row[column] !== ""
      )
    );

    if (finalData.length === 0) {
      alert("No valid data available to export!");
      return;
    }

    const columnWidths = columns.map((column) => {
      let maxLength = column.length;
      finalData.forEach((row) => {
        const cellValue = row[column] ? row[column].toString() : "";
        maxLength = Math.max(maxLength, cellValue.length);
      });
      return { wpx: Math.max(maxLength * 8, 100) };
    });

    const ws = XLSX.utils.json_to_sheet(finalData, { header: columns });
    ws["!cols"] = columnWidths;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Service Data");
    const filename = "Service_List.xlsx";
    XLSX.writeFile(wb, filename);
  };

  render() {
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
                <h5 className="">Service</h5>
              </div>
              <div className="col-md-8">
                <div className="row g-3 align-items-center">
                  <div className="col-sm-2">
                    <label>Name </label>
                    {/* <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={this.state.name}
                      onChange={this.handleChange}
                      className="form-control"
                    /> */}

                    <input
                      type="text"
                      name="name"
                      value={this.state.name}
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
                  <div className="col-sm-2">
                    <label>Vendor Type </label>
                    <select
                      required
                      className="form-select form-noradious"
                      name="vendorTypeId"
                      value={this.state.vendorTypeId}
                      onChange={this.handleChange}
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
                    <label>Vendor Name </label>
                    {/* <input
                      type="text"
                      name="vendorName"
                      placeholder="Vendor Name"
                      value={this.state.vendorName}
                      onChange={this.handleChange}
                      className="form-control"
                    /> */}

                    <input
                      type="text"
                      name="vendorName"
                      value={this.state.vendorName}
                      onChange={this.handleChange}
                      className="form-control"
                      placeholder="Vendor Name"
                      list="vendorNameSuggestions"
                    />
                    <datalist id="vendorNameSuggestions">
                      {this.state.filteredVendor.map((name, index) => (
                        <option key={index} value={name} />
                      ))}
                    </datalist>
                  </div>
                  {/* <div className="col-sm-2">
                                    <label>State Date </label>
                                    <input readOnly id="searchStartDate" required type="text" placeholder="Start Date" className="form-control" name="startDate" value={this.state.startDate}/>
                            </div>
                            <div className="col-sm-2">
                                    <label>End Date </label>
                                    <input readOnly id="searchEndDate" required type="text" placeholder="End Date" className="form-control" name="endDate" value={this.state.endDate}/>
                            </div> */}

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
                    data-bs-target="#serviceAdd"
                    className=""
                    style={{ marginRight: "20px" }}
                  >
                    <img
                      src="/images/add.png"
                      alt="Add"
                      style={{ height: "20px", width: "20px" }}
                    />
                  </button>

                  <img
                    style={{ height: "25px", width: "25px", cursor: "pointer" }}
                    src="/images/downloadExcel.png"
                    alt="Download Excel"
                    onClick={this.downloadExcel}
                  />
                </div>
              </div>
            </div>

            <div className="borderless-box">
              <div className="table-responsive">
                {this.state.serviceList.length > 0 ? (
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Sr. No</th>
                        <th>Name</th>
                        <th>Vendor Type</th>
                        <th>Vendor Name</th>
                        {/* <th>Start Date</th> 
                                            <th>End Date</th>                                            */}
                        <th colSpan="3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.serviceList.map((item, key) => {
                        return (
                          <tr key={`service-${key}`}>
                            {/* <td>{key+1}</td> */}
                            <td>
                              {(this.state.currentPage - 1) *
                                this.state.perPage +
                                key +
                                1}
                            </td>

                            <td>{ArrayHelper.getValue(item, "name")}</td>
                            <td>{ArrayHelper.getValue(item, "vendorType")}</td>
                            <td>{ArrayHelper.getValue(item, "vendorName")}</td>
                            {/* <td>{ formatDate(ArrayHelper.getValue(item,'startDate'),DISPLAYDATEFORMATE)}</td> 
                                                <td>{formatDate(ArrayHelper.getValue(item,'endDate'),DISPLAYDATEFORMATE)}</td>                                             */}
                            <td>
                              <i
                                data-bs-toggle="modal"
                                data-bs-target="#agencyView"
                                onClick={() => {
                                  this.setState({ selectedService: item });
                                }}
                                className="fa fa-eye btn"
                                data-bs-placement="top"
                                title="Edit"
                              ></i>
                            </td>
                            <td>
                              <i
                                data-bs-toggle="modal"
                                data-bs-target="#serviceUpdate"
                                onClick={() => {
                                  this.setState({ selectedService: item });
                                }}
                                className="fa fa-edit btn"
                                data-bs-placement="top"
                                title="Edit"
                              ></i>
                            </td>
                            <td>
                              <i
                                onClick={() =>
                                  this.ServiceDelete(
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
                {this.state.serviceListFilter.length > this.state.perPage ? (
                  <PaginationComponent
                    total={this.state.serviceListFilter.length}
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
        <ServiceAddComponent getServiceList={() => this.getServiceList()} />
        <ServiceUpdateComponent
          getServiceList={() => this.getServiceList()}
          selectedService={this.state.selectedService}
        />
        <ServiceViewComponent
          selectedService={this.state.selectedService}
          vendorTypeList={this.state.vendorTypeList}
          vendorList={this.state.vendorList}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    serviceListData: state.settingsData.serviceList,
    vendorTypeListData: state.settingsData.vendorTypeList,
    vendorListData: state.settingsData.vendorList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    vendorTypeListInfo: (data) =>
      dispatch({ type: actionTypesUser.VENDOR_TYPE_LIST, payload: data }),
    serviceListInfo: (data) =>
      dispatch({ type: actionTypesUser.SERVICE_LIST, payload: data }),
    vendorListInfo: (data) =>
      dispatch({ type: actionTypesUser.VENDOR_LIST, payload: data }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ServiceComponent);
