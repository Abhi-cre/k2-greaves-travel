import React from "react";
import TourItineraryServiceFieldComponent from "./TourItineraryServiceFieldComponent";
import { ArrayHelper } from "../../../helpers/arrayhelper";
import MessagesFieldFormComponent from "./MessagesFieldFormComponent";
import NotesFieldFormComponent from "./NotesFieldFormComponent";
import { Editor, EditorTools } from "@progress/kendo-react-editor";
import "@progress/kendo-theme-default/dist/all.css";
import { USER_ID, USER_EMAIL, USER_NAME } from "../../../helpers/constants";
import SettingApi from "../../../api/Setting.api";

const {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignRight,
  AlignCenter,
  Indent,
  Outdent,
  OrderedList,
  UnorderedList,
} = EditorTools;
declare var $;

class TourItineraryFieldFormComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      TourItineraryData: [],
      creditCardFeesList: [
        0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5,
        7.0, 7.5,
      ],
    };
  }
  handleItineraryInput(index: number, key: string, value: any) {
    this.setState({
      TourItineraryData: this.props.TourItineraryData.map(
        (item: any, k: number) => {
          if (index == k) {
            if (key === "isPrimary") {
              item["isPrimary"] = value === "Yes"; // If "Yes", set true, otherwise false
            } else {
              item[key] = value;
            }
            if (key == "itineraryMarkupType") {
              item["itineraryMarkupAmount"] = "";
            } else if (
              key == "itineraryMarkupAmount" ||
              key == "itineraryUSMarkupAmount"
            ) {
              value = value.replace(/[^0-9.]/gi, "");
              item[key] = value;
              if (item["itineraryMarkupType"] == "") {
                alert("Please select Markup Type of Itinerary");
                item[key] = "";
              }

              if (
                value > 99.99 &&
                item["itineraryMarkupType"] == "byPercentage"
              ) {
                alert("Please enter value less than 99.99");
                item[key] = "";
              }
            }
          } else {
            if (value == "Yes" && key == "isPrimary") {
              item["isPrimary"] = false;
            }
          }

          return item;
        }
      ),
    });
  }

  handleUpdate = (item) => {
    const updatedTourItinerary = {
      requestedUserId: parseInt(localStorage.getItem(USER_ID)),
      tourItinerary: {
        id: item.id,
        tourRecordId: item.tourRecordId,
        name: "string",
        subtitle: "string",
        description: "string",
        comments: "string",
        notesFrom: "string",
        isPrimary: item.isPrimary,
        itineraryMarkupType: "string",
        itineraryMarkupAmount: 0,
        itineraryUSMarkupAmount: 0,
        itineraryCreditCardFees: 0,
        itineraryAgentAmount: 0,
        tourItineraryService: [
          {
            id: 0,
            tourRecordId: 0,
            itineraryId: 0,
            serviceId: "string",
            serviceFeesId: 0,
            cityId: 0,
            cityName: "string",
            stateId: 0,
            stateName: "string",
            countryId: 0,
            countryName: "string",
            serviceName: "string",
            vendorId: 0,
            vendorName: "string",
            vendorTypeId: 0,
            vendorTypeName: "string",
            serviceDescription: "string",
            rate: 0,
            rateType: "string",
            description: "string",
            cost: 0,
            unit: 0,
            startDate: "2025-01-15T08:51:38.702Z",
            endDate: "2025-01-15T08:51:38.702Z",
            markupPercentage: 0,
            markupAmount: 0,
            isShowOnItinerary: true,
            serviceGTICommission: 0,
            serviceGrossINR: 0,
            serviceGSTPercentage: 0,
            serviceSellINR: 0,
            serviceNetUSD: 0,
            serviceUSDMarkupPercentage: 0,
            serviceUSDCommission: 0,
            serviceUSDClientDollar: 0,
            agentCommissionType: "string",
            agentCommissionByPercentage: 0,
            agentCommissionValue: 0,
            quoteType: 0,
            quoteTypeName: "string",
            creditCardFees: 0,
            mealPlan: "string",
            noofGuest: 0,
            noofAdult: 0,
            noofChild: 0,
            origin: "string",
            destination: "string",
            flightNo: "string",
            pnr: "string",
            taxAmount: 0,
            isChecked: true,
          },
        ],
      },
    };

    console.log("Updated Tour Itinerary Data:", updatedTourItinerary);

    SettingApi.PostSettingList(
      updatedTourItinerary,
      "/api/TourItinerary/UpdateTourItinerary"
    )
      .then((response) => {
        console.log("Save successful:", response);
      })
      .catch((error) => {
        console.error("API Error:", error.response.data);
      });
  };

  render() {
    return (
      <React.Fragment>
        <div
          className={`borderless-box ${
            this.props.selectedTab == "Itinerary" ||
            this.props.selectedTab == ""
              ? "show"
              : "hide"
          }`}
        >
          {this.props.TourItineraryData.map((item, key) => {
            return (
              <div
                key={`internary-${key}`}
                className="maininfo"
                id={`accordionExample-${key}`}
              >
                {item.id == 0 || this.props.isImportItinerary == true ? (
                  <div className="d-flex mb-2">
                    <div className="flex-fill p-1 width250">
                      <p>
                        <strong>Do you want to import itinerary?</strong>
                      </p>
                    </div>
                    <div className="flex-fill p-1 maxWwidth100">
                      <p>
                        <strong>
                          <input
                            className="isPrimaryId"
                            type="radio"
                            name="importItinerary"
                            value="yes"
                            onClick={() =>
                              this.props.setIsImportItinerary(true)
                            }
                          />{" "}
                          Yes{" "}
                          <input
                            className="isPrimaryId"
                            type="radio"
                            name="importItinerary"
                            value="No"
                            onClick={() =>
                              this.props.setIsImportItinerary(false)
                            }
                          />{" "}
                          No
                        </strong>
                      </p>
                    </div>
                    {this.props.isImportItinerary == true ? (
                      <div
                        className="flex-fill p-1"
                        id="seviceHtmlvendorTypeId"
                      >
                        <label className="form-label">Tours List</label>

                        <select
                          className="form-select form-select-sm"
                          value={this.props.selectedTourId}
                          onChange={(event: any) =>
                            this.props.setChangeTour(event.currentTarget.value)
                          }
                        >
                          <option value="">Select Tour</option>
                          {this.props.toursList.map((item, key) => {
                            return (
                              <option
                                key={`toursList-${key}`}
                                value={ArrayHelper.getValue(item, "id")}
                              >
                                {ArrayHelper.getValue(item, "tourName")}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    ) : (
                      ""
                    )}
                    {this.props.isImportItinerary == true ? (
                      <div
                        className="flex-fill p-1"
                        id="seviceHtmlvendorTypeId"
                      >
                        <label className="form-label">Itinerary List</label>

                        <select
                          className="form-select form-select-sm"
                          onChange={(event: any) =>
                            this.props.importItenery(event.currentTarget.value)
                          }
                        >
                          <option value="">Select Itinerary</option>
                          {this.props.selectedItineraryList.map((item, key) => {
                            return (
                              <option
                                key={`selectedItineraryList-${key}`}
                                value={ArrayHelper.getValue(item, "id")}
                              >
                                {ArrayHelper.getValue(item, "name")}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  ""
                )}

                <div className="d-flex mb-2">
                  <div className="flex-fill p-1">
                    <label className="form-label">Name</label>
                    <input
                      className="form-control form-control-sm"
                      type="text"
                      id={`nameld_${key}`}
                      name={`itinerary[${key}].name`}
                      value={item.name}
                      onChange={(event: any) =>
                        this.handleItineraryInput(
                          key,
                          "name",
                          event.currentTarget.value
                        )
                      }
                      placeholder="Name"
                    />
                  </div>

                  <div className="flex-fill p-1 maxwidth200">
                    <label className="form-label">Primary</label>
                    <br />
                    <input
                      checked={item.isPrimary === true}
                      className="isPrimaryId"
                      type="radio"
                      id={`isPrimaryId_${key}`}
                      name={`itinerary[${key}].isPrimary`}
                      value="Yes"
                      onChange={(event) =>
                        this.handleItineraryInput(key, "isPrimary", "Yes")
                      }
                    />{" "}
                    Yes
                    <input
                      checked={item.isPrimary === false}
                      className="isPrimaryId"
                      type="radio"
                      id={`isPrimaryId_${key}`}
                      name={`itinerary[${key}].isPrimary`}
                      value="No"
                      onChange={(event) =>
                        this.handleItineraryInput(key, "isPrimary", "No")
                      }
                    />{" "}
                    No
                  </div>

                  <div className="flex-fill p-1 maxWwidth200">
                    <label className="form-label">GTI Markup Amount (%)</label>
                    <input
                      maxLength={10}
                      className="form-control form-control-sm"
                      type="text"
                      id={`itineraryMarkupAmountld_${key}`}
                      name={`itinerary[${key}].itineraryMarkupAmount`}
                      value={item.itineraryMarkupAmount}
                      onChange={(event: any) =>
                        this.handleItineraryInput(
                          key,
                          "itineraryMarkupAmount",
                          event.currentTarget.value
                        )
                      }
                      placeholder="GTI Markup Amount"
                    />
                  </div>
                  <div className="flex-fill p-1 maxWwidth200">
                    <label className="form-label">
                      GT US Markup Amount (%)
                    </label>
                    <input
                      maxLength={10}
                      className="form-control form-control-sm"
                      type="text"
                      id={`itineraryUSMarkupAmountld_${key}`}
                      name={`itinerary[${key}].itineraryUSMarkupAmount`}
                      value={item.itineraryUSMarkupAmount}
                      onChange={(event: any) =>
                        this.handleItineraryInput(
                          key,
                          "itineraryUSMarkupAmount",
                          event.currentTarget.value
                        )
                      }
                      placeholder="Itinerary Markup Amount"
                    />
                  </div>
                  <div className="flex-fill p-1 maxWwidth200">
                    <label className="form-label">
                      Agent Commission Amount (%)
                    </label>
                    <input
                      maxLength={10}
                      className="form-control form-control-sm"
                      type="text"
                      id={`itineraryAgentAmountld_${key}`}
                      name={`itinerary[${key}].itineraryAgentAmount`}
                      value={item.itineraryAgentAmount}
                      onChange={(event: any) =>
                        this.handleItineraryInput(
                          key,
                          "itineraryAgentAmount",
                          event.currentTarget.value
                        )
                      }
                      placeholder="Agent Commission Amount"
                    />
                  </div>
                  <div className="flex-fill p-1 maxWwidth200">
                    <label className="form-label">Credit Card Fees</label>
                    <select
                      className="form-select form-select-sm"
                      id={`itineraryCreditCardFeesld_${key}`}
                      name={`itinerary[${key}].itineraryCreditCardFees`}
                      value={item.itineraryCreditCardFees}
                      onChange={(event: any) =>
                        this.handleItineraryInput(
                          key,
                          "itineraryCreditCardFees",
                          event.currentTarget.value
                        )
                      }
                      aria-label=".form-select-sm example"
                    >
                      {this.state.creditCardFeesList.map(
                        (__item: any, __key: any) => {
                          return (
                            <option value={__item} key={`creditCard-${__key}`}>
                              {__item.toFixed(1)}
                            </option>
                          );
                        }
                      )}
                    </select>
                  </div>
                  {item.id != 0 ? (
                    <div
                      title="Add Duplicate Itinerary"
                      className="flex-fill p-1 width220 txt-right"
                    >
                      <button
                        data-bs-toggle="modal"
                        data-bs-target="#CloneItineraryAdd"
                        type="button"
                        className="btn btn-primary  rounded"
                      >
                        <i className="fa-solid fa-clone"></i>
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                  {item.id != 0 ? (
                    <div
                      title=" Itinerary Remove"
                      className="flex-fill p-1 width220 txt-right"
                      onClick={() => this.props.deleteItinerary(key, item.id)}
                    >
                      <button
                        type="button"
                        className="btn removeInternary rounded"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="d-flex mb-2">
                  <div className="flex-fill p-1 notebox">
                    <label className="form-label">Special Notes</label>
                    <Editor
                      value={item.comments}
                      tools={[
                        [Bold, Italic, Underline],
                        [AlignLeft, AlignCenter, AlignRight],
                        [OrderedList, UnorderedList, Indent, Outdent],
                      ]}
                      placeholder="Special Notes"
                      name={`itinerary[${key}].comments`}
                      onChange={(event: any) => {
                        if (event.html.length <= 2500) {
                          this.handleItineraryInput(
                            key,
                            "comments",
                            event.html
                          );
                        } else {
                          alert("More than 450 characters is not allowed.");
                        }
                      }}
                    />
                    <p>Max length of text is 2500 characters.</p>
                  </div>
                </div>
                {this.props.toursId != "" &&
                this.props.isImportItinerary == false ? (
                  <div className="d-flex  mb-2">
                    <div className="flex-fill p-1">
                      {" "}
                      <button
                        className="btn btn-primary rounded"
                        onClick={() => this.handleUpdate(item)}
                      >
                        {" "}
                        Update
                      </button>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <div className="row p-1">
                  <NotesFieldFormComponent
                    NotesData={this.props.NotesData}
                    NotesList={this.props.NotesList}
                  />
                  <MessagesFieldFormComponent
                    MessagesData={this.props.MessagesData}
                    MessagesList={this.props.MessagesList}
                  />
                </div>

                <TourItineraryServiceFieldComponent
                  serviceList={this.props.serviceList}
                  tourStartDate={this.props.tourStartDate}
                  tourEndDate={this.props.tourEndDate}
                  currency={this.props.currency}
                  fileUSDROE={this.props.fileUSDROE}
                  quoteTypeList={this.props.quoteTypeList}
                  cityList={this.props.cityList}
                  stateList={this.props.stateList}
                  countryList={this.props.countryList}
                  vendorTypeList={this.props.vendorTypeList}
                  ItineraryData={item}
                  vendorList={this.props.vendorList}
                  TourItineraryServiceData={this.props.TourItineraryServiceData}
                  tourItineraryService={item.tourItineraryService}
                  itineraryMarkupType="byPercentage"
                  itineraryMarkupAmount={item.itineraryMarkupAmount}
                  itineraryUSMarkupAmount={item.itineraryUSMarkupAmount}
                  itineraryCreditCardFees={item.itineraryCreditCardFees}
                  itineraryAgentAmount={item.itineraryAgentAmount}
                  ItenararyKey={key}
                  resetItinerarySerice={() => this.props.resetItinerarySerice()}
                  addItinerarySerice={() =>
                    this.props.addItinerarySerice(
                      key,
                      this.props.toursId,
                      item.id
                    )
                  }
                  deleteItinerarySerice={(e, e2) =>
                    this.props.deleteItinerarySerice(key, e, e2)
                  }
                  showHideLoder={(e) => this.props.showHideLoder(e)}
                  serviceGSTPercentage={this.props.serviceGSTPercentage}
                  loader={this.props.loader}
                  noofGuest={this.props.noofGuest}
                  isImportItinerary={this.props.isImportItinerary}
                />

                {this.props.toursId != "" &&
                this.props.isImportItinerary == true &&
                item.tourItineraryService.length > 0 ? (
                  <div className="d-flex  mb-2">
                    <div className="flex-fill p-1">
                      {" "}
                      <button className="btn btn-primary rounded">
                        {" "}
                        Add Itinerary
                      </button>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            );
          })}
        </div>
      </React.Fragment>
    );
  }
}

export default TourItineraryFieldFormComponent;
