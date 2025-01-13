import React from "react";
import { connect } from "react-redux";
import * as actionTypesUser from "../../../store/action/settings.action";
import ContactChannelAddComponent from "./ContactChannelAddComponent";
import ContactChannelUpdateComponent from "./ContactChannelUpdateComponent";
import SettingApi from "../../../api/Setting.api";
import { ArrayHelper } from "../../../helpers/arrayhelper";
import PaginationComponent from "../../../components/PaginationComponent";
import { USER_ID } from "../../../helpers/constants";
import LoaderComponent from "../../../components/LoaderComponent";
import ExcelDownloadButton from "../../../components/ExcelDownloadButton";
class ContactChannelComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      contactChannelListAll: [],
      contactChannelListFilter: [],
      contactChannelList: [],
      selectedContactChannel: {},
      perPage: 20,
      currentPage: 1,
      keyword: "",
      filteredNames: [],
    };
  }
  componentDidMount() {
    let contactChannelListData = this.props.contactChannelListData;
    if (contactChannelListData.length > 0) {
      let contactChannelList = [];
      for (let i = 0; i < this.state.perPage; i++) {
        if (ArrayHelper.getValue(contactChannelListData[i], "id") != "") {
          contactChannelList.push(contactChannelListData[i]);
        }
      }

      this.setState({
        contactChannelListAll: contactChannelListData,
        contactChannelListFilter: contactChannelListData,
        contactChannelList: contactChannelList,
      });
    } else {
      this.getContactChannelList();
    }
  }
  getContactChannelList = async () => {
    this.setState({ loader: true });
    let response = await SettingApi.GetSettingList("/api/ContactChannel/List");
    if (ArrayHelper.getValue(response, "isSuccess") == true) {
      let contactChannelList = [];

      for (let i = 0; i < this.state.perPage; i++) {
        if (
          ArrayHelper.getValue(
            ArrayHelper.getValue(response, "contactChannels")[i],
            "id"
          ) != ""
        ) {
          contactChannelList.push(
            ArrayHelper.getValue(response, "contactChannels")[i]
          );
        }
      }

      this.setState({
        loader: false,
        contactChannelListAll: ArrayHelper.getValue(
          response,
          "contactChannels"
        ),
        contactChannelListFilter: ArrayHelper.getValue(
          response,
          "contactChannels"
        ),
        contactChannelList: contactChannelList,
      });
      this.props.contactChannelListInfo(
        ArrayHelper.getValue(response, "contactChannels")
      );
    } else {
      this.setState({ loader: false });
    }
  };
  componentWillReceiveProps(nextProps) {
    if (this.state.contactChannelListFilter.length > 0) {
      const location = nextProps.params;
      if (
        location.page !== undefined &&
        location.page !== this.state.currentPage
      ) {
        let contactChannelList = [];
        let numRecord = 0;
        let i = 0;
        i = (location.page - 1) * this.state.perPage;
        numRecord = location.page * this.state.perPage;

        for (i; i < numRecord; i++) {
          if (
            ArrayHelper.getValue(
              this.state.contactChannelListFilter[i],
              "id"
            ) != ""
          ) {
            contactChannelList.push(this.state.contactChannelListFilter[i]);
          }
        }
        this.setState({
          currentPage: parseInt(location.page),
          contactChannelList: contactChannelList,
        });
      } else {
        let contactChannelList = [];

        for (let i = 0; i < this.state.perPage; i++) {
          if (
            ArrayHelper.getValue(
              this.state.contactChannelListFilter[i],
              "id"
            ) != ""
          ) {
            contactChannelList.push(this.state.contactChannelListFilter[i]);
          }
        }

        this.setState({
          contactChannelList: contactChannelList,
          currentPage: 1,
        });
      }
    } else if (this.props.contactChannelListData.length > 0) {
      this.setState({ contactChannelList: [], currentPage: 1 });
    }
  }
  updatedcontactChannelList = async (str) => {
    let contactChannelListAll = this.state.contactChannelListAll;
    contactChannelListAll = contactChannelListAll.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    let contactChannelList = this.state.contactChannelList;
    contactChannelList = contactChannelList.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    let contactChannelListFilter = this.state.contactChannelListFilter;
    contactChannelListFilter = contactChannelListFilter.map((item) => {
      if (item.id == str.id) {
        item = str;
        return item;
      }
      return item;
    });
    this.setState({
      contactChannelListAll: contactChannelListAll,
      contactChannelListFilter: contactChannelListFilter,
      contactChannelList: contactChannelList,
      selectedContactChannel: str,
    });
    this.props.contactChannelListInfo(contactChannelListAll);
  };
  ContactStatusDelete = async (str) => {
    if (window.confirm("Do you want to delete selected Contact Channel?")) {
      this.setState({ loader: true });

      let formData = {
        requestedUserId: parseInt(localStorage.getItem(USER_ID)),
        channelId: parseInt(str),
      };
      let response = await SettingApi.PostSettingList(
        formData,
        "/api/ContactChannel/Delete"
      );
      if (ArrayHelper.getValue(response, "isSuccess") == true) {
        let contactChannelListAll = this.state.contactChannelListAll;
        contactChannelListAll = contactChannelListAll.filter(
          (item) => item.id != str
        );
        let contactChannelListFilter = this.state.contactChannelListFilter;
        contactChannelListFilter = contactChannelListFilter.filter(
          (item) => item.id != str
        );

        this.setState({
          loader: false,
          contactChannelListAll: contactChannelListAll,
          contactChannelListFilter: contactChannelListFilter,
        });
        this.props.contactChannelListInfo(contactChannelListAll);
        this.props.history("/settings/contact-channel");
      }
    }
  };

  reloadWindow() {
    window.location.reload();
  }
  filterData() {
    this.setState({ loader: true });
    let contactChannelListAll = this.state.contactChannelListAll;
    if (this.state.keyword.trim() != "") {
      let contactChannelListFilter = contactChannelListAll.filter((item) => {
        if (
          item.name.search(new RegExp(this.state.keyword.trim(), "i")) != -1 &&
          this.state.keyword.trim() != ""
        ) {
          return item;
        }
      });
      this.setState({
        contactChannelListFilter: contactChannelListFilter,
        currentPage: 1,
      });
      setTimeout(() => {
        this.setState({ loader: false });
        this.props.history("/settings/contact-channel");
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
      contactChannelListFilter: this.state.contactChannelListAll,
    });
    setTimeout(() => {
      this.setState({ loader: false });
      this.props.history("/settings/contact-channel");
    }, 10);
  }
  //   handleChange = (e) => {
  //     const name = e.target.name;
  //     let value = e.target.value;
  //     this.setState({ ...this.state, [name]: value });
  //   };

  handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    if (name === "keyword") {
      const filteredNames = this.state.contactChannelListFilter
        .map((user) => user.name)
        .filter((name) => name.toLowerCase().includes(value.toLowerCase()));
      this.setState({ keyword: value, filteredNames: filteredNames });
    } else {
      this.setState({ [name]: value });
    }
  };

  render() {
    const { contactChannelListFilter, contactChannelListAll } = this.state;
    const dataToExport =
      contactChannelListFilter.length > 0
        ? contactChannelListFilter
        : contactChannelListAll;
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
                <h5 className="">Contact Channel</h5>
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
                    data-bs-target="#contactChannelAdd"
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
                    fileName="ContactChannel.xlsx"
                    sheetName="ContactChannel"
                  />
                </div>
              </div>
            </div>

            <div className="borderless-box">
              <div className="table-responsive">
                {this.state.contactChannelList.length > 0 ? (
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Sr. No</th>
                        <th>Name</th>
                        <th colSpan="2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.contactChannelList.map((item, key) => {
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
                                data-bs-target="#contactChannelUpdate"
                                onClick={() => {
                                  this.setState({
                                    selectedContactChannel: item,
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
                                  this.ContactStatusDelete(
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
                {this.state.contactChannelListFilter.length >
                this.state.perPage ? (
                  <PaginationComponent
                    total={this.state.contactChannelListFilter.length}
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
        <ContactChannelAddComponent
          getContactChannelList={() => this.getContactChannelList()}
        />
        <ContactChannelUpdateComponent
          updatedcontactChannelList={(str) =>
            this.updatedcontactChannelList(str)
          }
          selectedContactChannel={this.state.selectedContactChannel}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    contactChannelListData: state.settingsData.contactChannelList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    contactChannelListInfo: (data) =>
      dispatch({ type: actionTypesUser.CONTACT_CHANNEL_LIST, payload: data }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactChannelComponent);
