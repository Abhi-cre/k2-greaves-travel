import React from "react";
import { connect } from "react-redux";
import * as actionTypesUser from "../../../store/action/settings.action";
import QuoteTypeAddComponent from "./QuoteTypeAddComponent";
import QuoteTypeUpdateComponent from "./QuoteTypeUpdateComponent";
import SettingApi from "../../../api/Setting.api";
import { ArrayHelper } from "../../../helpers/arrayhelper";
import PaginationComponent from "../../../components/PaginationComponent";
import { USER_ID } from "../../../helpers/constants";
import LoaderComponent from "../../../components/LoaderComponent";
import ExcelDownloadButton from "../../../components/ExcelDownloadButton";
class QuoteTypeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      quoteTypeListAll: [],
      quoteTypeListFilter: [],
      quoteTypeList: [],
      selectedQuoteType: {},
      perPage: 20,
      currentPage: 1,
      keyword: "",
      filteredNames: [],
    };
  }
  componentDidMount() {
    let quoteTypeListData = this.props.quoteTypeListData;
    if (quoteTypeListData.length > 0) {
      let quoteTypeList = [];
      for (let i = 0; i < this.state.perPage; i++) {
        if (ArrayHelper.getValue(quoteTypeListData[i], "id") != "") {
          quoteTypeList.push(quoteTypeListData[i]);
        }
      }

      this.setState({
        quoteTypeListAll: quoteTypeListData,
        quoteTypeListFilter: quoteTypeListData,
        quoteTypeList: quoteTypeList,
      });
    } else {
      this.getQuoteTypeList();
    }
  }
  getQuoteTypeList = async () => {
    this.setState({ loader: true });
    let response = await SettingApi.GetSettingList("/api/QuoteType/List");
    if (ArrayHelper.getValue(response, "isSuccess") == true) {
      let quoteTypeList = [];

      for (let i = 0; i < this.state.perPage; i++) {
        if (
          ArrayHelper.getValue(
            ArrayHelper.getValue(response, "quoteTypes")[i],
            "id"
          ) != ""
        ) {
          quoteTypeList.push(ArrayHelper.getValue(response, "quoteTypes")[i]);
        }
      }

      this.setState({
        loader: false,
        quoteTypeListAll: ArrayHelper.getValue(response, "quoteTypes"),
        quoteTypeListFilter: ArrayHelper.getValue(response, "quoteTypes"),
        quoteTypeList: quoteTypeList,
      });
      this.props.quoteTypeListInfo(
        ArrayHelper.getValue(response, "quoteTypes")
      );
    } else {
      this.setState({ loader: false });
    }
  };
  componentWillReceiveProps(nextProps) {
    if (this.state.quoteTypeListFilter.length > 0) {
      const location = nextProps.params;
      if (
        location.page !== undefined &&
        location.page !== this.state.currentPage
      ) {
        let quoteTypeList = [];
        let numRecord = 0;
        let i = 0;
        i = (location.page - 1) * this.state.perPage;
        numRecord = location.page * this.state.perPage;

        for (i; i < numRecord; i++) {
          if (
            ArrayHelper.getValue(this.state.quoteTypeListFilter[i], "id") != ""
          ) {
            quoteTypeList.push(this.state.quoteTypeListFilter[i]);
          }
        }
        this.setState({
          currentPage: parseInt(location.page),
          quoteTypeList: quoteTypeList,
        });
      } else {
        let quoteTypeList = [];

        for (let i = 0; i < this.state.perPage; i++) {
          if (
            ArrayHelper.getValue(this.state.quoteTypeListFilter[i], "id") != ""
          ) {
            quoteTypeList.push(this.state.quoteTypeListFilter[i]);
          }
        }

        this.setState({ quoteTypeList: quoteTypeList, currentPage: 1 });
      }
    } else if (this.props.quoteTypeListData.length > 0) {
      this.setState({ quoteTypeList: [], currentPage: 1 });
    }
  }
  updatedQuoteTypeList = async (str) => {
    let quoteTypeListAll = this.state.quoteTypeListAll;
    quoteTypeListAll = quoteTypeListAll.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    let quoteTypeList = this.state.quoteTypeList;
    quoteTypeList = quoteTypeList.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    let quoteTypeListFilter = this.state.quoteTypeListFilter;
    quoteTypeListFilter = quoteTypeListFilter.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    this.setState({
      quoteTypeListAll: quoteTypeListAll,
      quoteTypeListFilter: quoteTypeListFilter,
      quoteTypeList: quoteTypeList,
      selectedQuoteType: str,
    });
    this.props.quoteTypeListInfo(quoteTypeListAll);
  };
  VendorTypeDelete = async (str) => {
    if (window.confirm("Do you want to delete selected Quote Type?")) {
      this.setState({ loader: true });

      let formData = {
        requestedUserId: parseInt(localStorage.getItem(USER_ID)),
        vendorTypeId: parseInt(str),
      };
      let response = await SettingApi.PostSettingList(
        formData,
        "/api/QuoteType/Delete"
      );
      if (ArrayHelper.getValue(response, "isSuccess") == true) {
        let quoteTypeListAll = this.state.quoteTypeListAll;
        quoteTypeListAll = quoteTypeListAll.filter((item) => item.id != str);
        let quoteTypeListFilter = this.state.quoteTypeListFilter;
        quoteTypeListFilter = quoteTypeListFilter.filter(
          (item) => item.id != str
        );

        this.setState({
          loader: false,
          quoteTypeListAll: quoteTypeListAll,
          quoteTypeListFilter: quoteTypeListFilter,
        });
        this.props.quoteTypeListInfo(quoteTypeListAll);
        this.props.history("/settings/quote-type");
      }
    }
  };
  reloadWindow() {
    window.location.reload();
  }
  filterData() {
    this.setState({ loader: true });
    let quoteTypeListAll = this.state.quoteTypeListAll;
    if (this.state.keyword.trim() != "") {
      let quoteTypeListFilter = quoteTypeListAll.filter((item) => {
        if (
          item.name.search(new RegExp(this.state.keyword.trim(), "i")) != -1 &&
          this.state.keyword.trim() != ""
        ) {
          return item;
        }
      });
      this.setState({
        quoteTypeListFilter: quoteTypeListFilter,
        currentPage: 1,
      });
      setTimeout(() => {
        this.setState({ loader: false });
        this.props.history("/settings/quote-type");
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
      quoteTypeListFilter: this.state.quoteTypeListAll,
    });
    setTimeout(() => {
      this.setState({ loader: false });
      this.props.history("/settings/quote-type");
    }, 10);
  }
  handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    if (name === "keyword") {
      const filteredNames = this.state.quoteTypeListFilter
        .map((user) => user.name)
        .filter((name) => name.toLowerCase().includes(value.toLowerCase()));
      this.setState({ keyword: value, filteredNames: filteredNames });
    } else {
      this.setState({ [name]: value });
    }
  };
  render() {
    const { quoteTypeListFilter, quoteTypeListAll } = this.state;
    const dataToExport =
      quoteTypeListFilter.length > 0 ? quoteTypeListFilter : quoteTypeListAll;
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
                <h5 className="">Quote Type</h5>
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
                    data-bs-target="#vendorTypeAdd"
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
                {this.state.quoteTypeList.length > 0 ? (
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Sr. No</th>
                        <th>Name</th>
                        <th colSpan="2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.quoteTypeList.map((item, key) => {
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
                                data-bs-target="#vendorTypeUpdate"
                                onClick={() => {
                                  this.setState({ selectedQuoteType: item });
                                }}
                                className="fa fa-edit btn"
                                data-bs-placement="top"
                                title="Edit"
                              ></i>
                            </td>
                            <td>
                              <i
                                onClick={() =>
                                  this.VendorTypeDelete(
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
                {this.state.quoteTypeListFilter.length > this.state.perPage ? (
                  <PaginationComponent
                    total={this.state.quoteTypeListFilter.length}
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
        <QuoteTypeAddComponent
          getQuoteTypeList={() => this.getQuoteTypeList()}
        />
        <QuoteTypeUpdateComponent
          updatedQuoteTypeList={(str) => this.updatedQuoteTypeList(str)}
          selectedQuoteType={this.state.selectedQuoteType}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    quoteTypeListData: state.settingsData.quoteTypeList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    quoteTypeListInfo: (data) =>
      dispatch({ type: actionTypesUser.QUOTE_TYPE_LIST, payload: data }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuoteTypeComponent);
