import React from "react";
import { connect } from "react-redux";
import * as HearedAboutsUser from "../../../store/action/settings.action";
import HearedAboutAddComponent from "./HearedAboutAddComponent";
import HearedAboutUpdateComponent from "./HearedAboutUpdateComponent";
import SettingApi from "../../../api/Setting.api";
import { ArrayHelper } from "../../../helpers/arrayhelper";
import PaginationComponent from "../../../components/PaginationComponent";
import { USER_ID } from "../../../helpers/constants";
import LoaderComponent from "../../../components/LoaderComponent";
import ExcelDownloadButton from "../../../components/ExcelDownloadButton";
class HearedAboutComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      hearedAboutListAll: [],
      hearedAboutListFilter: [],
      hearedAboutList: [],
      selectedHearedAbout: {},
      perPage: 8,
      currentPage: 1,
      keyword: "",
      filteredNames: [],
    };
  }
  componentDidMount() {
    let hearedAboutListData = this.props.hearedAboutListData;
    if (hearedAboutListData.length > 0) {
      let hearedAboutList = [];
      for (let i = 0; i < this.state.perPage; i++) {
        if (ArrayHelper.getValue(hearedAboutListData[i], "id") != "") {
          hearedAboutList.push(hearedAboutListData[i]);
        }
      }

      this.setState({
        hearedAboutListAll: hearedAboutListData,
        hearedAboutListFilter: hearedAboutListData,
        hearedAboutList: hearedAboutList,
      });
    } else {
      this.gethearedAboutList();
    }
  }
  gethearedAboutList = async () => {
    this.setState({ loader: true });
    let response = await SettingApi.GetSettingList("/api/HearedAbout/List");
    if (ArrayHelper.getValue(response, "isSuccess") == true) {
      let hearedAboutList = [];

      for (let i = 0; i < this.state.perPage; i++) {
        if (
          ArrayHelper.getValue(
            ArrayHelper.getValue(response, "hearedAbout")[i],
            "id"
          ) != ""
        ) {
          hearedAboutList.push(
            ArrayHelper.getValue(response, "hearedAbout")[i]
          );
        }
      }

      this.setState({
        loader: false,
        hearedAboutListAll: ArrayHelper.getValue(response, "hearedAbout"),
        hearedAboutListFilter: ArrayHelper.getValue(response, "hearedAbout"),
        hearedAboutList: hearedAboutList,
      });
      this.props.hearedAboutListInfo(
        ArrayHelper.getValue(response, "hearedAbout")
      );
    } else {
      this.setState({ loader: false });
    }
  };
  componentWillReceiveProps(nextProps) {
    if (this.state.hearedAboutListFilter.length > 0) {
      const location = nextProps.params;
      if (
        location.page !== undefined &&
        location.page !== this.state.currentPage
      ) {
        let hearedAboutList = [];
        let numRecord = 0;
        let i = 0;
        i = (location.page - 1) * this.state.perPage;
        numRecord = location.page * this.state.perPage;

        for (i; i < numRecord; i++) {
          if (
            ArrayHelper.getValue(this.state.hearedAboutListFilter[i], "id") !=
            ""
          ) {
            hearedAboutList.push(this.state.hearedAboutListFilter[i]);
          }
        }
        this.setState({
          currentPage: parseInt(location.page),
          hearedAboutList: hearedAboutList,
        });
      } else {
        let hearedAboutList = [];

        for (let i = 0; i < this.state.perPage; i++) {
          if (
            ArrayHelper.getValue(this.state.hearedAboutListFilter[i], "id") !=
            ""
          ) {
            hearedAboutList.push(this.state.hearedAboutListFilter[i]);
          }
        }

        this.setState({ hearedAboutList: hearedAboutList, currentPage: 1 });
      }
    } else if (this.props.hearedAboutListData.length > 0) {
      this.setState({ hearedAboutList: [], currentPage: 1 });
    }
  }
  updatedhearedAboutList = async (str) => {
    let hearedAboutListAll = this.state.hearedAboutListAll;
    hearedAboutListAll = hearedAboutListAll.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    let hearedAboutList = this.state.hearedAboutList;
    hearedAboutList = hearedAboutList.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    let hearedAboutListFilter = this.state.hearedAboutListFilter;
    hearedAboutListFilter = hearedAboutListFilter.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    this.setState({
      hearedAboutListAll: hearedAboutListAll,
      hearedAboutListFilter: hearedAboutListFilter,
      hearedAboutList: hearedAboutList,
      selectedHearedAbout: str,
    });
    this.props.hearedAboutListInfo(hearedAboutListAll);
  };
  HearedAboutDelete = async (str) => {
    if (window.confirm("Do you want to delete selected Heared About?")) {
      this.setState({ loader: true });

      let formData = {
        requestedUserId: parseInt(localStorage.getItem(USER_ID)),
        hearedAboutId: parseInt(str),
      };
      let response = await SettingApi.PostSettingList(
        formData,
        "/api/HearedAbout/Delete"
      );
      if (ArrayHelper.getValue(response, "isSuccess") == true) {
        let hearedAboutListAll = this.state.hearedAboutListAll;
        hearedAboutListAll = hearedAboutListAll.filter(
          (item) => item.id != str
        );
        let hearedAboutListFilter = this.state.hearedAboutListFilter;
        hearedAboutListFilter = hearedAboutListFilter.filter(
          (item) => item.id != str
        );

        this.setState({
          loader: false,
          hearedAboutListAll: hearedAboutListAll,
          hearedAboutListFilter: hearedAboutListFilter,
        });
        this.props.hearedAboutListInfo(hearedAboutListAll);
        this.props.history("/settings/heared-about");
      }
    }
  };
  reloadWindow() {
    window.location.reload();
  }
  filterData() {
    this.setState({ loader: true });
    let hearedAboutListAll = this.state.hearedAboutListAll;
    if (this.state.keyword.trim() != "") {
      let hearedAboutListFilter = hearedAboutListAll.filter((item) => {
        if (
          item.name.search(new RegExp(this.state.keyword.trim(), "i")) != -1 &&
          this.state.keyword.trim() != ""
        ) {
          return item;
        }
      });
      this.setState({
        hearedAboutListFilter: hearedAboutListFilter,
        currentPage: 1,
      });
      setTimeout(() => {
        this.setState({ loader: false });
        this.props.history("/settings/heared-about");
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
      hearedAboutListFilter: this.state.hearedAboutListAll,
    });
    setTimeout(() => {
      this.setState({ loader: false });
      this.props.history("/settings/heared-about");
    }, 10);
  }
  handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    if (name === "keyword") {
      const filteredNames = this.state.hearedAboutListFilter
        .map((user) => user.name)
        .filter((name) => name.toLowerCase().includes(value.toLowerCase()));
      this.setState({ keyword: value, filteredNames: filteredNames });
    } else {
      this.setState({ [name]: value });
    }
  };

  render() {
    const { hearedAboutListFilter, hearedAboutListAll } = this.state;
    const dataToExport =
      hearedAboutListFilter.length > 0
        ? hearedAboutListFilter
        : hearedAboutListAll;
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
                <h5 className="">Heard About</h5>
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
                    data-bs-target="#HearedAboutAdd"
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
                    fileName="HearedAbout.xlsx"
                    sheetName="HearedAbout"
                  />
                </div>
              </div>
            </div>

            <div className="borderless-box">
              <div className="table-responsive">
                {this.state.hearedAboutList.length > 0 ? (
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Sr. No</th>
                        <th>Name</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.hearedAboutList.map((item, key) => {
                        return (
                          <tr key={`HearedAbout-${key}`}>
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
                                data-bs-target="#HearedAboutUpdate"
                                onClick={() => {
                                  this.setState({ selectedHearedAbout: item });
                                }}
                                className="fa fa-edit btn"
                                data-bs-placement="top"
                                title="Edit"
                              ></i>
                            </td>
                            {/* <td>
                              <i
                                onClick={() =>
                                  this.HearedAboutDelete(
                                    ArrayHelper.getValue(item, "id")
                                  )
                                }
                                className="fa fa-trash btn"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="Trash"
                              ></i>
                            </td> */}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p>No Record Found</p>
                )}
                {this.state.hearedAboutListFilter.length >
                this.state.perPage ? (
                  <PaginationComponent
                    total={this.state.hearedAboutListFilter.length}
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
        <HearedAboutAddComponent
          gethearedAboutList={() => this.gethearedAboutList()}
        />
        <HearedAboutUpdateComponent
          updatedhearedAboutList={(str) => this.updatedhearedAboutList(str)}
          selectedHearedAbout={this.state.selectedHearedAbout}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    hearedAboutListData: state.settingsData.hearedAboutList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    hearedAboutListInfo: (data) =>
      dispatch({ type: HearedAboutsUser.HEARED_ABOUT_LIST, payload: data }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HearedAboutComponent);
