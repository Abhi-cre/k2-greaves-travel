import React from "react";
import { connect } from "react-redux";
import * as actionTypesUser from "../../../store/action/settings.action";
import SalesCategoryAddComponent from "./SalesCategoryAddComponent";
import SalesCategoryUpdateComponent from "./SalesCategoryUpdateComponent";
import SettingApi from "../../../api/Setting.api";
import { ArrayHelper } from "../../../helpers/arrayhelper";
import PaginationComponent from "../../../components/PaginationComponent";
import { USER_ID } from "../../../helpers/constants";
import LoaderComponent from "../../../components/LoaderComponent";
import ExcelDownloadButton from "../../../components/ExcelDownloadButton";
class SalesCategoryComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      salesCategoryListAll: [],
      salesCategoryListFilter: [],
      salesCategoryList: [],
      selectedSalesCategory: {},
      perPage: 8,
      currentPage: 1,
      keyword: "",
      filteredNames: [],
    };
  }
  componentDidMount() {
    let salesCategoryListData = this.props.salesCategoryListData;
    if (salesCategoryListData.length > 0) {
      let salesCategoryList = [];
      for (let i = 0; i < this.state.perPage; i++) {
        if (ArrayHelper.getValue(salesCategoryListData[i], "id") != "") {
          salesCategoryList.push(salesCategoryListData[i]);
        }
      }

      this.setState({
        salesCategoryListAll: salesCategoryListData,
        salesCategoryListFilter: salesCategoryListData,
        salesCategoryList: salesCategoryList,
      });
    } else {
      this.getSalesCategoryList();
    }
  }
  getSalesCategoryList = async () => {
    this.setState({ loader: true });
    let response = await SettingApi.GetSettingList("/api/SalesCategory/List");
    if (ArrayHelper.getValue(response, "isSuccess") == true) {
      let salesCategoryList = [];

      for (let i = 0; i < this.state.perPage; i++) {
        if (
          ArrayHelper.getValue(
            ArrayHelper.getValue(response, "salesCategories")[i],
            "id"
          ) != ""
        ) {
          salesCategoryList.push(
            ArrayHelper.getValue(response, "salesCategories")[i]
          );
        }
      }

      this.setState({
        loader: false,
        salesCategoryListAll: ArrayHelper.getValue(response, "salesCategories"),
        salesCategoryListFilter: ArrayHelper.getValue(
          response,
          "salesCategories"
        ),
        salesCategoryList: salesCategoryList,
      });
      this.props.salesCategoryListInfo(
        ArrayHelper.getValue(response, "salesCategories")
      );
    } else {
      this.setState({ loader: false });
    }
  };
  componentWillReceiveProps(nextProps) {
    if (this.state.salesCategoryListFilter.length > 0) {
      const location = nextProps.params;
      if (
        location.page !== undefined &&
        location.page !== this.state.currentPage
      ) {
        let salesCategoryList = [];
        let numRecord = 0;
        let i = 0;
        i = (location.page - 1) * this.state.perPage;
        numRecord = location.page * this.state.perPage;

        for (i; i < numRecord; i++) {
          if (
            ArrayHelper.getValue(this.state.salesCategoryListFilter[i], "id") !=
            ""
          ) {
            salesCategoryList.push(this.state.salesCategoryListFilter[i]);
          }
        }
        this.setState({
          currentPage: parseInt(location.page),
          salesCategoryList: salesCategoryList,
        });
      } else {
        let salesCategoryList = [];

        for (let i = 0; i < this.state.perPage; i++) {
          if (
            ArrayHelper.getValue(this.state.salesCategoryListFilter[i], "id") !=
            ""
          ) {
            salesCategoryList.push(this.state.salesCategoryListFilter[i]);
          }
        }

        this.setState({ salesCategoryList: salesCategoryList, currentPage: 1 });
      }
    } else if (this.props.salesCategoryListData.length > 0) {
      this.setState({ salesCategoryList: [], currentPage: 1 });
    }
  }
  updatedSalesCategoryList = async (str) => {
    let salesCategoryListAll = this.state.salesCategoryListAll;
    salesCategoryListAll = salesCategoryListAll.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    let salesCategoryList = this.state.salesCategoryList;
    salesCategoryList = salesCategoryList.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    let salesCategoryListFilter = this.state.salesCategoryListFilter;
    salesCategoryListFilter = salesCategoryListFilter.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    this.setState({
      salesCategoryListAll: salesCategoryListAll,
      salesCategoryListFilter: salesCategoryListFilter,
      salesCategoryList: salesCategoryList,
      selectedSalesCategory: str,
    });
    this.props.salesCategoryListInfo(salesCategoryListAll);
  };
  SalesCategoryDelete = async (str) => {
    if (window.confirm("Do you want to delete selected Sales Category?")) {
      this.setState({ loader: true });

      let formData = {
        requestedUserId: parseInt(localStorage.getItem(USER_ID)),
        salesCategoryId: parseInt(str),
      };
      let response = await SettingApi.PostSettingList(
        formData,
        "/api/SalesCategory/Delete"
      );
      if (ArrayHelper.getValue(response, "isSuccess") == true) {
        let salesCategoryListAll = this.state.salesCategoryListAll;
        salesCategoryListAll = salesCategoryListAll.filter(
          (item) => item.id != str
        );
        let salesCategoryListFilter = this.state.salesCategoryListAll;
        salesCategoryListFilter = salesCategoryListFilter.filter(
          (item) => item.id != str
        );

        this.setState({
          loader: false,
          salesCategoryListAll: salesCategoryListAll,
          salesCategoryListFilter: salesCategoryListFilter,
        });
        this.props.salesCategoryListInfo(salesCategoryListAll);
        this.props.history("/settings/sales-category");
      }
    }
  };
  reloadWindow() {
    window.location.reload();
  }
  filterData() {
    this.setState({ loader: true });
    let salesCategoryListAll = this.state.salesCategoryListAll;
    if (this.state.keyword.trim() != "") {
      let salesCategoryListFilter = salesCategoryListAll.filter((item) => {
        if (
          item.name.search(new RegExp(this.state.keyword.trim(), "i")) != -1 &&
          this.state.keyword.trim() != ""
        ) {
          return item;
        }
      });
      this.setState({
        salesCategoryListFilter: salesCategoryListFilter,
        currentPage: 1,
      });
      setTimeout(() => {
        this.setState({ loader: false });
        this.props.history("/settings/sales-category");
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
      salesCategoryListFilter: this.state.salesCategoryListAll,
    });
    setTimeout(() => {
      this.setState({ loader: false });
      this.props.history("/settings/sales-category");
    }, 10);
  }
  handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    if (name === "keyword") {
      const filteredNames = this.state.salesCategoryListFilter
        .map((user) => user.name)
        .filter((name) => name.toLowerCase().includes(value.toLowerCase()));
      this.setState({ keyword: value, filteredNames: filteredNames });
    } else {
      this.setState({ [name]: value });
    }
  };
  render() {
    const { salesCategoryListFilter, salesCategoryListAll } = this.state;
    const dataToExport =
      salesCategoryListFilter.length > 0
        ? salesCategoryListFilter
        : salesCategoryListAll;
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
                <h5 className="">Sales Category</h5>
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
                    data-bs-target="#salesCategoryAdd"
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
                {this.state.salesCategoryList.length > 0 ? (
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Sr. No</th>
                        <th>Name</th>
                        <th colSpan="2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.salesCategoryList.map((item, key) => {
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
                                data-bs-target="#salesCategoryUpdate"
                                onClick={() => {
                                  this.setState({
                                    selectedSalesCategory: item,
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
                                  this.SalesCategoryDelete(
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
                {this.state.salesCategoryListFilter.length >
                  this.state.perPage ? (
                  <PaginationComponent
                    total={this.state.salesCategoryListFilter.length}
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
        <SalesCategoryAddComponent
          getSalesCategoryList={() => this.getSalesCategoryList()}
        />
        <SalesCategoryUpdateComponent
          updatedSalesCategoryList={(str) => this.updatedSalesCategoryList(str)}
          selectedSalesCategory={this.state.selectedSalesCategory}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    salesCategoryListData: state.settingsData.salesCategoryList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    salesCategoryListInfo: (data) =>
      dispatch({ type: actionTypesUser.SALES_CATEGORY_LIST, payload: data }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SalesCategoryComponent);
