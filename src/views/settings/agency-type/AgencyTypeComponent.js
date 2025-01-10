import React from "react";
import { connect } from "react-redux";
import * as actionTypesUser from "../../../store/action/settings.action";
import AgencyTypeAddComponent from "./AgencyTypeAddComponent";
import AgencyTypeUpdateComponent from "./AgencyTypeUpdateComponent";
import SettingApi from "../../../api/Setting.api";
import { ArrayHelper } from "../../../helpers/arrayhelper";
import PaginationComponent from "../../../components/PaginationComponent";
import { USER_ID } from "../../../helpers/constants";
import LoaderComponent from "../../../components/LoaderComponent";
import ExcelDownloadButton from "../../../components/ExcelDownloadButton";

class AgencyTypeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      agencyTypeListAll: [],
      agencyTypeListFilter: [],
      agencyTypeList: [],
      selectedAgencyType: {},
      perPage: 8,
      currentPage: 1,
      keyword: "",
      agencyTypeListFilter: [],
      agencyTypeListAll: [],
      filteredNames: [],
    };
  }
  componentDidMount() {
    let agencyTypeListData = this.props.agencyTypeListData;
    if (agencyTypeListData.length > 0) {
      let agencyTypeList = [];
      for (let i = 0; i < this.state.perPage; i++) {
        if (ArrayHelper.getValue(agencyTypeListData[i], "id") != "") {
          agencyTypeList.push(agencyTypeListData[i]);
        }
      }

      this.setState({
        agencyTypeListAll: agencyTypeListData,
        agencyTypeListFilter: agencyTypeListData,
        agencyTypeList: agencyTypeList,
      });
    } else {
      this.getagencyTypeList();
    }
  }
  getagencyTypeList = async () => {
    this.setState({ loader: true });
    let response = await SettingApi.GetSettingList("/api/AgencyType/List");
    if (ArrayHelper.getValue(response, "isSuccess") == true) {
      let agencyTypeList = [];

      for (let i = 0; i < this.state.perPage; i++) {
        if (
          ArrayHelper.getValue(
            ArrayHelper.getValue(response, "agencyTypes")[i],
            "id"
          ) != ""
        ) {
          agencyTypeList.push(ArrayHelper.getValue(response, "agencyTypes")[i]);
        }
      }

      this.setState({
        loader: false,
        agencyTypeListAll: ArrayHelper.getValue(response, "agencyTypes"),
        agencyTypeListFilter: ArrayHelper.getValue(response, "agencyTypes"),
        agencyTypeList: agencyTypeList,
      });
      this.props.agencyTypeListInfo(
        ArrayHelper.getValue(response, "agencyTypes")
      );
    } else {
      this.setState({ loader: false });
    }
  };
  componentWillReceiveProps(nextProps) {
    if (this.state.agencyTypeListFilter.length > 0) {
      const location = nextProps.params;
      if (
        location.page !== undefined &&
        location.page !== this.state.currentPage
      ) {
        let agencyTypeList = [];
        let numRecord = 0;
        let i = 0;
        i = (location.page - 1) * this.state.perPage;
        numRecord = location.page * this.state.perPage;

        for (i; i < numRecord; i++) {
          if (
            ArrayHelper.getValue(this.state.agencyTypeListFilter[i], "id") != ""
          ) {
            agencyTypeList.push(this.state.agencyTypeListFilter[i]);
          }
        }
        this.setState({
          currentPage: parseInt(location.page),
          agencyTypeList: agencyTypeList,
        });
      } else {
        let agencyTypeList = [];

        for (let i = 0; i < this.state.perPage; i++) {
          if (
            ArrayHelper.getValue(this.state.agencyTypeListFilter[i], "id") != ""
          ) {
            agencyTypeList.push(this.state.agencyTypeListFilter[i]);
          }
        }

        this.setState({ agencyTypeList: agencyTypeList, currentPage: 1 });
      }
    } else if (this.props.agencyTypeListData.length > 0) {
      this.setState({ agencyTypeList: [], currentPage: 1 });
    }
  }
  updatedAgencyTypeList = async (str) => {
    let agencyTypeListAll = this.state.agencyTypeListAll;
    agencyTypeListAll = agencyTypeListAll.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    let agencyTypeList = this.state.agencyTypeList;
    agencyTypeList = agencyTypeList.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    this.setState({
      agencyTypeListAll: agencyTypeListAll,
      agencyTypeList: agencyTypeList,
      selectedAgencyType: str,
    });
    this.props.agencyTypeListInfo(agencyTypeListAll);
  };
  ActionTypeDelete = async (str) => {
    if (window.confirm("Do you want to delete selected Agency Type?")) {
      this.setState({ loader: true });

      let formData = {
        requestedUserId: parseInt(localStorage.getItem(USER_ID)),
        agencyTypeId: parseInt(str),
      };
      let response = await SettingApi.PostSettingList(
        formData,
        "/api/AgencyType/Delete"
      );
      if (ArrayHelper.getValue(response, "isSuccess") == true) {
        let agencyTypeListAll = this.state.agencyTypeListAll;
        agencyTypeListAll = agencyTypeListAll.filter((item) => item.id != str);

        this.setState({ loader: false, agencyTypeListAll: agencyTypeListAll });
        this.props.agencyTypeListInfo(agencyTypeListAll);
        this.clearData();
      }
    }
  };
  reloadWindow() {
    window.location.reload();
  }
  filterData() {
    this.setState({ loader: true });
    let agencyTypeListAll = this.state.agencyTypeListAll;
    if (this.state.keyword.trim() != "") {
      let agencyTypeListFilter = agencyTypeListAll.filter((item) => {
        if (
          item.name.search(new RegExp(this.state.keyword.trim(), "i")) != -1 &&
          this.state.keyword.trim() != ""
        ) {
          return item;
        }
      });
      this.setState({
        agencyTypeListFilter: agencyTypeListFilter,
        currentPage: 1,
      });
      setTimeout(() => {
        this.setState({ loader: false });
        this.props.history("/settings/agency-type");
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
      agencyTypeListFilter: this.state.agencyTypeListAll,
    });
    setTimeout(() => {
      this.setState({ loader: false });
      this.props.history("/settings/agency-type");
    }, 10);
  }
  handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    if (name === "keyword") {
      const filteredNames = this.state.agencyTypeListFilter
        .map((user) => user.name)
        .filter((name) => name.toLowerCase().includes(value.toLowerCase()));
      this.setState({ keyword: value, filteredNames: filteredNames });
    } else {
      this.setState({ [name]: value });
    }
  };

  render() {
    const { agencyTypeListFilter, agencyTypeListAll, currentPage, perPage } =
      this.state;
    const dataToExport =
      agencyTypeListFilter.length > 0
        ? agencyTypeListFilter
        : agencyTypeListAll;
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
                <h5 className="">Agency Type 11</h5>
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
                <a onClick={() => this.reloadWindow()} style={{}}>
                  <img
                    style={{ height: "30px", marginRight: "20px" }}
                    src="/images/reload.png"
                  />
                </a>
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#agencyTypeAdd"
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
                  data={dataToExport} // Pass your data as usual
                  columns={["name"]} // Ensure columns contains "Name" instead of "name"
                  fileName="AgencyTypes.xlsx"
                  sheetName="Agency Types"
                />
              </div>
            </div>

            <div className="borderless-box">
              <div className="table-responsive">
                {this.state.agencyTypeList.length > 0 ? (
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Sr. No</th>

                        <th>Name</th>
                        <th colSpan="2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.agencyTypeList.map((item, key) => {
                        return (
                          <tr key={`actionType-${key}`}>
                            {/* <td>{key+1}</td>          */}
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
                                data-bs-target="#agencyTypeUpdate"
                                onClick={() => {
                                  this.setState({ selectedAgencyType: item });
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
                {this.state.agencyTypeListFilter.length > this.state.perPage ? (
                  <PaginationComponent
                    total={this.state.agencyTypeListFilter.length}
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
        <AgencyTypeAddComponent
          getagencyTypeList={() => this.getagencyTypeList()}
        />
        <AgencyTypeUpdateComponent
          updatedAgencyTypeList={(str) => this.updatedAgencyTypeList(str)}
          selectedAgencyType={this.state.selectedAgencyType}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    agencyTypeListData: state.settingsData.agencyTypeList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    agencyTypeListInfo: (data) =>
      dispatch({ type: actionTypesUser.AGENCY_TYPE_LIST, payload: data }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AgencyTypeComponent);
