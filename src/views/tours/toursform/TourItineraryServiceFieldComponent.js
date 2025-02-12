import React from "react";
import LoaderComponent from "../../../components/LoaderComponent";
import FlightCityAutoComplete from "../../../components/FlightCityAutoComplete";
import { ArrayHelper } from "../../../helpers/arrayhelper";
import {
  addsDays,
  subsDays,
  formatDate,
  GETDATETIME,
} from "../../../vendor/datefns";
import {
  DATEDURATION,
  DISPLAYDATEFORMATE,
  MEALPLANLIST,
  parseCityDetails,
  VENDORTYPEIDBYDATE,
  ROUNTINGVENDOR,
} from "../../../helpers/constants";
import "react-widgets/styles.css";
import { algo } from "crypto-js";
import SettingApi from "../../../api/Setting.api";
import { Select, Spin, Input } from "antd";
const { Option } = Select;
// import DropdownList from "react-widgets/DropdownList";
declare var $;

class TourItineraryServiceFieldComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      TourItineraryServiceData: [],
      selectServiceData: {},
      calculationType: 0,
      selectedMealPlan: "",
      selectedKey: "",
      vendorList: [],
      serviceList: [],
      creditCardFeesList: [
        0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5,
        7.0, 7.5,
      ],
      selectedServices: [],
      hotelRateList: [],
      costFilter: "",
      selectedKey: null,
      actionType: "",
      displayType: "byCost",
      cityId: "",
      data: [],
      selectedState: "",
      selectedCountry: "",
    };
  }

  EditItenarySercice(item: any, selectedKey: any) {
    // this.props.deleteItinerarySerice(selectedKey,item.id)
    let elmnt = "";
    elmnt = document.getElementById("serviceItenaryHeading");
    elmnt.scrollIntoView(25);
    this.setState({ actionType: "edit", selectedKey: selectedKey });

    this.props.TourItineraryServiceData[0].id = item.id;
    this.props.TourItineraryServiceData[0].tourRecordId = item.tourRecordId;
    this.props.TourItineraryServiceData[0].itineraryId = item.itineraryId;
    this.props.TourItineraryServiceData[0].serviceDescription =
      item.serviceDescription;
    this.props.TourItineraryServiceData[0].rate = item.rate;
    this.props.TourItineraryServiceData[0].rateType = item.rateType;
    this.props.TourItineraryServiceData[0].description = item.description;
    this.props.TourItineraryServiceData[0].unit = item.unit;
    this.props.TourItineraryServiceData[0].cost = item.cost;
    this.props.TourItineraryServiceData[0].noofAdult = item.noofAdult;
    this.props.TourItineraryServiceData[0].noofChild = item.noofChild;
    this.props.TourItineraryServiceData[0].markupPercentage =
      item.markupPercentage;
    this.props.TourItineraryServiceData[0].markupAmount = item.markupAmount;
    this.props.TourItineraryServiceData[0].isShowOnItinerary =
      item.isShowOnItinerary;
    this.props.TourItineraryServiceData[0].serviceGTICommission =
      item.serviceGTICommission;
    this.props.TourItineraryServiceData[0].serviceGrossINR =
      item.serviceGrossINR;
    this.props.TourItineraryServiceData[0].serviceGSTPercentage =
      item.serviceGSTPercentage;
    this.props.TourItineraryServiceData[0].serviceSellINR = item.serviceSellINR;
    this.props.TourItineraryServiceData[0].serviceNetUSD = item.serviceNetUSD;
    this.props.TourItineraryServiceData[0].serviceUSDMarkupPercentage =
      item.serviceUSDMarkupPercentage;
    this.props.TourItineraryServiceData[0].serviceUSDCommission =
      item.serviceUSDCommission;
    this.props.TourItineraryServiceData[0].serviceUSDClientDollar =
      item.serviceUSDClientDollar;
    this.props.TourItineraryServiceData[0].quoteType = item.quoteType;
    this.props.TourItineraryServiceData[0].commissionType =
      item.markupPercentage == 0 ? "byAmount" : "byPercentage";
    this.props.TourItineraryServiceData[0].commissionTypeUS =
      item.serviceUSDMarkupPercentage == 0 ? "byAmount" : "byPercentage";
    this.props.TourItineraryServiceData[0].serviceUSDMarkUpAmount =
      item.serviceUSDCommission;
    this.props.TourItineraryServiceData[0].startDate = item.startDate;
    this.props.TourItineraryServiceData[0].endDate = item.endDate;
    this.props.TourItineraryServiceData[0].creditCardFees = item.creditCardFees;
    this.props.TourItineraryServiceData[0].origin = item.origin;
    this.props.TourItineraryServiceData[0].destination = item.destination;
    this.props.TourItineraryServiceData[0].flightNo = item.flightNo;
    this.props.TourItineraryServiceData[0].pnr = item.pnr;
    this.props.TourItineraryServiceData[0].noofGuest = item.noofGuest;
    this.props.TourItineraryServiceData[0].mealPlan = item.mealPlan;
    this.props.TourItineraryServiceData[0].taxAmount = item.taxAmount;
    this.props.TourItineraryServiceData[0].agentCommissionValue =
      item.agentCommissionValue;
    this.props.TourItineraryServiceData[0].agentCommissionByPercentage =
      item.agentCommissionByPercentage;
    this.props.TourItineraryServiceData[0].agentCommissionType =
      item.agentCommissionType;
    this.props.TourItineraryServiceData[0].isChecked = item.isChecked;

    let vendorList = this.props.vendorList;
    if (item.vendorTypeId == 5) {
      vendorList = vendorList.filter(
        (_item) => item.vendorTypeId == _item.vendorTypeId
      );
    } else {
      vendorList = vendorList.filter(
        (_item) =>
          item.vendorTypeId == _item.vendorTypeId && _item.cityId == item.cityId
      );
    }

    //  vendorList=vendorList.concat([{"id":0,"vendorName":"Select Vendor Type"}])
    this.props.TourItineraryServiceData[0].vendorList = vendorList;
    let serviceList = this.props.serviceList;

    serviceList = serviceList.filter(
      (_item) => _item.vendorId == item.vendorId
    );
    // serviceList=serviceList.concat([{"id":0,"name":"Select Service"}])
    this.props.TourItineraryServiceData[0].serviceList = serviceList;
    this.props.TourItineraryServiceData[0].stateId = item.stateId;
    this.props.TourItineraryServiceData[0].countryId = item.countryId;
    this.props.TourItineraryServiceData[0].cityId = item.cityId;
    this.props.TourItineraryServiceData[0].serviceId = item.serviceId;
    this.props.TourItineraryServiceData[0].vendorId = item.vendorId;
    this.props.TourItineraryServiceData[0].vendorTypeId = item.vendorTypeId;
    this.setState({
      calculationType: ArrayHelper.getValue(
        this.props.vendorTypeList.filter((_it) => _it.id == item.vendorTypeId),
        "[0].calculationType"
      ),
    });
    if (item.vendorTypeId != 4) {
      this.setState({
        selectServiceData: serviceList.filter(
          (_item) => _item.id == item.serviceId
        )[0],
      });
      this.props.TourItineraryServiceData[0].serviceFeesId = item.serviceFeesId;
      if (item.vendorTypeId == 1) {
        setTimeout(() => {
          let serviceFeeList = ArrayHelper.getValue(
            this.state.selectServiceData,
            "serviceFeeDetails",
            []
          ).filter((_item) => _item.id == item.serviceFeesId);
          let hotelRateList = [
            {
              value: `Weekday Rate Single`,
              amount: ArrayHelper.getValue(
                serviceFeeList,
                "[0].weekdayRateSingle"
              ),
              name: `Weekday Rate Single (${ArrayHelper.getValue(
                serviceFeeList,
                "[0].weekdayRateSingle"
              )})`,
            },
            {
              value: `Weekday Rate Double`,
              amount: ArrayHelper.getValue(
                serviceFeeList,
                "[0].weekdayRateDouble"
              ),
              name: `Weekday Rate Double (${ArrayHelper.getValue(
                serviceFeeList,
                "[0].weekdayRateDouble"
              )})`,
            },
            {
              value: `Weekend Rate Single`,
              amount: ArrayHelper.getValue(
                serviceFeeList,
                "[0].weekendRateSingle"
              ),
              name: `Weekend Rate Single (${ArrayHelper.getValue(
                serviceFeeList,
                "[0].weekendRateSingle"
              )})`,
            },
            {
              value: `Weekend Rate Double`,
              amount: ArrayHelper.getValue(
                serviceFeeList,
                "[0].weekendRateDouble"
              ),
              name: `Weekend Rate Double (${ArrayHelper.getValue(
                serviceFeeList,
                "[0].weekendRateDouble"
              )})`,
            },
          ];

          this.setState({
            selectedMealPlan: ArrayHelper.getValue(
              serviceFeeList,
              "[0].mealPlan"
            ),
            hotelRateList: hotelRateList,
          });
        }, 100);
      }
    } else {
      let serviceIdArray = item.serviceId.split(",");

      if (serviceIdArray.length > 0) {
        let selectedServices = [];
        for (let k = 0; k < serviceIdArray.length; k++) {
          let serviceData = serviceList.filter(
            (_item) => _item.id == serviceIdArray[k]
          )[0];

          selectedServices = selectedServices.concat({
            id: ArrayHelper.getValue(serviceData, "id"),
            rate: ArrayHelper.getValue(
              serviceData,
              "serviceFeeDetails[0].rate"
            ),
          });
        }

        this.setState({ selectedServices: selectedServices });
      }
    }
  }
  resetValue(key) {
    setTimeout(() => {
      this.setState({ ...this.state, [key]: "" });
    });
  }
  setCalucation(keyVal) {
    this.setState({
      TourItineraryServiceData: this.props.TourItineraryServiceData.map(
        (item: any, k: number) => {
          let duartion = 1;
          if (item["startDate"] != "" && item["endDate"] != "") {
            duartion = DATEDURATION(item["startDate"], item["endDate"]);
            //  if(this.state.selectServiceData==2)
            //  {
            //     duartion = parseInt(duartion)
            //  }
            //  else if(this.state.selectServiceData==0)
            //  {
            //     duartion = 1
            //  }
            //  else if(this.state.selectServiceData==1)
            //  {
            //     duartion = parseInt(duartion) +1
            //  }
            if (duartion == 0) {
              duartion = 1;
            }
          }

          if (duartion > 0) {
            let cost = (item["unit"] * parseFloat(item["rate"])).toFixed(2);

            let taxAmount = 0.0;
            let greantCost = cost;

            item["serviceGSTPercentage"] = this.props.serviceGSTPercentage;
            if (
              item["vendorTypeId"] != "" &&
              item["vendorTypeId"] != "5" &&
              item["countryId"] != "" &&
              item["countryId"] != "0" &&
              item["countryId"] != "106"
            ) {
              item["serviceGSTPercentage"] = 0.0;
            }
            if (item["vendorTypeId"] == "1") {
              //  console.log('serviceFeeDetails',this.state.selectServiceData,item['serviceFeesId'])
              let selectedServiceFeeDetails = [];
              if (
                ArrayHelper.getValue(
                  this.state.selectServiceData,
                  "serviceFeeDetails"
                ).length > 0
              ) {
                selectedServiceFeeDetails = ArrayHelper.getValue(
                  this.state.selectServiceData,
                  "serviceFeeDetails"
                ).filter((_it) => _it.id == item["serviceFeesId"]);
              }

              //  console.log('selectedServiceFeeDetails',selectedServiceFeeDetails)
              let totalMember =
                parseInt(item["noofGuest"]) +
                parseInt(item["noofAdult"]) +
                parseInt(item["noofChild"]);
              if (parseInt(item["noofAdult"]) > 0) {
                cost =
                  parseFloat(cost) +
                  parseInt(item["noofAdult"]) *
                    parseFloat(
                      ArrayHelper.getValue(
                        selectedServiceFeeDetails,
                        "[0].extraAdult12Above"
                      )
                    );
              }
              if (parseInt(item["noofChild"]) > 0) {
                cost =
                  parseFloat(cost) +
                  parseInt(item["noofChild"]) *
                    parseFloat(
                      ArrayHelper.getValue(
                        selectedServiceFeeDetails,
                        "[0].extraAdultUpto12"
                      )
                    );
              }

              cost = duartion * cost;
              greantCost = cost;
              let normalTax = 0.0;
              let mealTax = 0.0;
              let mealAmount = 0.0;
              if (greantCost <= 7500) {
                normalTax = (greantCost * 12) / 100;
              } else {
                normalTax = (greantCost * 18) / 100;
              }
              if (item["serviceFeesId"] != "-1") {
                if (
                  ArrayHelper.getValue(
                    selectedServiceFeeDetails,
                    "[0].mealPlan"
                  ) != item["mealPlan"]
                ) {
                  if (
                    (item["mealPlan"] == "CP" ||
                      item["mealPlan"] == "CPAI" ||
                      item["mealPlan"] == "MAP(L)" ||
                      item["mealPlan"] == "MAP(L)AI" ||
                      item["mealPlan"] == "MAP(D)" ||
                      item["mealPlan"] == "MAP(D)AI" ||
                      item["mealPlan"] == "AP" ||
                      item["mealPlan"] == "APAI") &&
                    ArrayHelper.getValue(
                      selectedServiceFeeDetails,
                      "[0].mealPlan"
                    ) != "CP" &&
                    ArrayHelper.getValue(
                      selectedServiceFeeDetails,
                      "[0].mealPlan"
                    ) != "CPAI" &&
                    ArrayHelper.getValue(
                      selectedServiceFeeDetails,
                      "[0].mealPlan"
                    ) != "MAP(L)" &&
                    ArrayHelper.getValue(
                      selectedServiceFeeDetails,
                      "[0].mealPlan"
                    ) != "MAP(L)AI" &&
                    ArrayHelper.getValue(
                      selectedServiceFeeDetails,
                      "[0].mealPlan"
                    ) != "MAP(D)" &&
                    ArrayHelper.getValue(
                      selectedServiceFeeDetails,
                      "[0].mealPlan"
                    ) != "MAP(D)AI" &&
                    ArrayHelper.getValue(
                      selectedServiceFeeDetails,
                      "[0].mealPlan"
                    ) != "AP" &&
                    ArrayHelper.getValue(
                      selectedServiceFeeDetails,
                      "[0].mealPlan"
                    ) != "APAI" &&
                    ArrayHelper.getValue(
                      selectedServiceFeeDetails,
                      "[0].mealPlan"
                    ) != "JP" &&
                    ArrayHelper.getValue(
                      selectedServiceFeeDetails,
                      "[0].mealPlan"
                    ) != "JPAI"
                  ) {
                    mealAmount = parseFloat(
                      ArrayHelper.getValue(
                        selectedServiceFeeDetails,
                        "[0].breakFast"
                      )
                    );
                  } else if (
                    (item["mealPlan"] == "JP" || item["mealPlan"] == "JPAI") &&
                    ArrayHelper.getValue(
                      selectedServiceFeeDetails,
                      "[0].mealPlan"
                    ) != "JP" &&
                    ArrayHelper.getValue(
                      selectedServiceFeeDetails,
                      "[0].mealPlan"
                    ) != "JPAI"
                  ) {
                    if (
                      ArrayHelper.getValue(
                        selectedServiceFeeDetails,
                        "[0].mealPlan"
                      ) != "CP" &&
                      ArrayHelper.getValue(
                        selectedServiceFeeDetails,
                        "[0].mealPlan"
                      ) != "CPAI" &&
                      ArrayHelper.getValue(
                        selectedServiceFeeDetails,
                        "[0].mealPlan"
                      ) != "MAP(L)" &&
                      ArrayHelper.getValue(
                        selectedServiceFeeDetails,
                        "[0].mealPlan"
                      ) != "MAP(L)AI" &&
                      ArrayHelper.getValue(
                        selectedServiceFeeDetails,
                        "[0].mealPlan"
                      ) != "MAP(D)" &&
                      ArrayHelper.getValue(
                        selectedServiceFeeDetails,
                        "[0].mealPlan"
                      ) != "MAP(D)AI" &&
                      ArrayHelper.getValue(
                        selectedServiceFeeDetails,
                        "[0].mealPlan"
                      ) != "AP" &&
                      ArrayHelper.getValue(
                        selectedServiceFeeDetails,
                        "[0].mealPlan"
                      ) != "APAI" &&
                      ArrayHelper.getValue(
                        selectedServiceFeeDetails,
                        "[0].mealPlan"
                      ) != "JP" &&
                      ArrayHelper.getValue(
                        selectedServiceFeeDetails,
                        "[0].mealPlan"
                      ) != "JPAI"
                    ) {
                      mealAmount =
                        parseFloat(
                          ArrayHelper.getValue(
                            selectedServiceFeeDetails,
                            "[0].breakFast"
                          )
                        ) +
                        parseFloat(
                          ArrayHelper.getValue(
                            selectedServiceFeeDetails,
                            "[0].jungleSafari"
                          )
                        );
                    } else {
                      mealAmount = parseFloat(
                        ArrayHelper.getValue(
                          selectedServiceFeeDetails,
                          "[0].jungleSafari"
                        )
                      );
                    }
                  }
                }

                //    else if(item['mealPlan']=='MAP(L)' || item['mealPlan']=='MAP(L)AI')
                //    {
                //    // mealAmount=(ArrayHelper.getValue(selectedVendor,'breakFast') + ArrayHelper.getValue(selectedVendor,'lunch'))
                //    }
                //    else if(item['mealPlan']=='MAP(D)' || item['mealPlan']=='MAP(D)AI')
                //    {
                //   //  mealAmount=(ArrayHelper.getValue(selectedVendor,'breakFast') + ArrayHelper.getValue(selectedVendor,'dinner'))
                //    }
                //    else if(item['mealPlan']=='AP'  || item['mealPlan']=='APAI')
                //    {
                //     mealAmount=(ArrayHelper.getValue(selectedVendor,'breakFast') + ArrayHelper.getValue(selectedVendor,'lunch') + ArrayHelper.getValue(selectedVendor,'dinner'))
                //    }

                if (item["serviceFeesId"] != "-1") {
                  if (
                    ArrayHelper.getValue(
                      selectedServiceFeeDetails,
                      "[0].mandatoryLunch"
                    ) != 0
                  ) {
                    mealAmount =
                      mealAmount +
                      ArrayHelper.getValue(
                        selectedServiceFeeDetails,
                        "[0].mandatoryLunch"
                      );
                  }

                  if (
                    ArrayHelper.getValue(
                      selectedServiceFeeDetails,
                      "[0].mandatoryDinner"
                    ) != 0
                  ) {
                    mealAmount =
                      mealAmount +
                      parseFloat(
                        ArrayHelper.getValue(
                          selectedServiceFeeDetails,
                          "[0].mandatoryDinner"
                        )
                      );
                  }

                  if (
                    (item["mealPlan"] == "JP" ||
                      item["mealPlan"] == "JPAI" ||
                      item["mealPlan"] == "AP" ||
                      item["mealPlan"] == "APAI" ||
                      item["mealPlan"] == "MAP(L)" ||
                      item["mealPlan"] == "MAP(L)AI") &&
                    ArrayHelper.getValue(
                      selectedServiceFeeDetails,
                      "[0].mealPlan"
                    ) != "MAP(L)" &&
                    ArrayHelper.getValue(
                      selectedServiceFeeDetails,
                      "[0].mealPlan"
                    ) != "MAP(L)AI" &&
                    ArrayHelper.getValue(
                      selectedServiceFeeDetails,
                      "[0].mealPlan"
                    ) != "AP" &&
                    ArrayHelper.getValue(
                      selectedServiceFeeDetails,
                      "[0].mealPlan"
                    ) != "APAI" &&
                    ArrayHelper.getValue(
                      selectedServiceFeeDetails,
                      "[0].mealPlan"
                    ) != "JP" &&
                    ArrayHelper.getValue(
                      selectedServiceFeeDetails,
                      "[0].mealPlan"
                    ) != "JPAI"
                  ) {
                    mealAmount =
                      mealAmount +
                      parseFloat(
                        ArrayHelper.getValue(
                          selectedServiceFeeDetails,
                          "[0].lunch"
                        )
                      );
                  }

                  if (
                    (item["mealPlan"] == "JP" ||
                      item["mealPlan"] == "JPAI" ||
                      item["mealPlan"] == "AP" ||
                      item["mealPlan"] == "APAI" ||
                      item["mealPlan"] == "MAP(D)" ||
                      item["mealPlan"] == "MAP(D)AI") &&
                    ArrayHelper.getValue(
                      selectedServiceFeeDetails,
                      "[0].mealPlan"
                    ) != "MAP(D)" &&
                    ArrayHelper.getValue(
                      selectedServiceFeeDetails,
                      "[0].mealPlan"
                    ) != "MAP(D)AI" &&
                    ArrayHelper.getValue(
                      selectedServiceFeeDetails,
                      "[0].mealPlan"
                    ) != "AP" &&
                    ArrayHelper.getValue(
                      selectedServiceFeeDetails,
                      "[0].mealPlan"
                    ) != "APAI" &&
                    ArrayHelper.getValue(
                      selectedServiceFeeDetails,
                      "[0].mealPlan"
                    ) != "JP" &&
                    ArrayHelper.getValue(
                      selectedServiceFeeDetails,
                      "[0].mealPlan"
                    ) != "JPAI"
                  ) {
                    mealAmount =
                      mealAmount +
                      parseFloat(
                        ArrayHelper.getValue(
                          selectedServiceFeeDetails,
                          "[0].dinner"
                        )
                      );
                  }
                }
                mealAmount = mealAmount * totalMember * duartion;
                mealAmount = mealAmount;

                if (
                  item["mealPlan"] == "EPAI" ||
                  item["mealPlan"] == "CPAI" ||
                  item["mealPlan"] == "MAP(L)AI" ||
                  item["mealPlan"] == "MAP(D)AI" ||
                  item["mealPlan"] == "APAI" ||
                  item["mealPlan"] == "JPAI"
                ) {
                  mealTax = 0.0;
                  normalTax = 0.0;
                } else if (
                  ArrayHelper.getValue(
                    selectedServiceFeeDetails,
                    "[0].mandatoryLunch"
                  ) != 0 ||
                  ArrayHelper.getValue(
                    selectedServiceFeeDetails,
                    "[0].mandatoryDinner"
                  ) != 0
                ) {
                  mealTax = (mealAmount * 28) / 100;
                } else if (
                  item["mealPlan"] == "EP" ||
                  item["mealPlan"] == "CP" ||
                  item["mealPlan"] == "MAP(L)" ||
                  item["mealPlan"] == "MAP(D)" ||
                  item["mealPlan"] == "AP" ||
                  item["mealPlan"] == "JP"
                ) {
                  mealTax = (mealAmount * 18) / 100;
                } else {
                  mealTax = 0.0;
                }
              }
              taxAmount = parseFloat(normalTax) + parseFloat(mealTax);
              greantCost = parseFloat(cost) + parseFloat(mealAmount);
              item["taxAmount"] = taxAmount.toFixed(2);
              //  console.log('mealAmount',mealAmount)
              //  console.log('mealTax',mealTax)
              //  console.log('cost',cost)
              //  console.log('normalTax',normalTax)
            } else if (
              item["vendorTypeId"] == "5" &&
              item["origin"] != "" &&
              item["destination"] != ""
            ) {
              if (
                parseCityDetails(item["origin"]).countryCode.toLowerCase() ==
                parseCityDetails(item["destination"]).countryCode.toLowerCase()
              ) {
                item["serviceGSTPercentage"] = 0.9;
              } else {
                item["serviceGSTPercentage"] = 1.8;
              }
            } else if (item["vendorTypeId"] == "2") {
              greantCost = (item["unit"] * parseFloat(item["rate"])).toFixed(2);
              taxAmount = (parseFloat(greantCost) * 5) / 100;
              item["taxAmount"] = taxAmount.toFixed(2);
            }

            // console.log('taxAmount',taxAmount)
            // console.log('greantCost',greantCost)

            item["cost"] = (
              parseFloat(greantCost) + parseFloat(taxAmount)
            ).toFixed(2);
            if (item["commissionType"] == "byPercentage") {
              let dividedBy = (100 - item["markupPercentage"]) / 100;
              let serviceGTICommission = parseFloat(
                item["cost"] / dividedBy - item["cost"]
              ).toFixed(2);
              item["serviceGTICommission"] = serviceGTICommission;
              item["serviceGrossINR"] = (
                parseFloat(serviceGTICommission) + parseFloat(item["cost"])
              ).toFixed(2);
            } else {
              item["serviceGTICommission"] = item["markupAmount"];
              item["serviceGrossINR"] = (
                parseFloat(item["markupAmount"]) + parseFloat(item["cost"])
              ).toFixed(2);
            }
            let serviceGTSAMOUNT = parseFloat(
              (item["serviceGrossINR"] * item["serviceGSTPercentage"]) / 100
            ).toFixed(2);
            item["serviceSellINR"] = (
              parseFloat(serviceGTSAMOUNT) + parseFloat(item["serviceGrossINR"])
            ).toFixed(2);
            if (
              keyVal != "serviceNetUSD" &&
              keyVal != "commissionTypeUS" &&
              keyVal != "serviceUSDMarkUpAmount" &&
              keyVal != "creditCardFees" &&
              keyVal != "creditCardFees" &&
              keyVal != "creditCardFees" &&
              item["serviceSellINR"] != "" &&
              item["serviceSellINR"] != "NaN"
            ) {
              item["serviceNetUSD"] = (
                parseFloat(item["serviceSellINR"]) / this.props.fileUSDROE
              ).toFixed(2);
            }

            if (item["commissionTypeUS"] == "byPercentage") {
              let dividedBy = (100 - item["serviceUSDMarkupPercentage"]) / 100;
              let serviceGTICommissionUS = parseFloat(
                item["serviceNetUSD"] / dividedBy -
                  parseFloat(item["serviceNetUSD"])
              );
              // let serviceGTICommissionUS= parseFloat((item['serviceNetUSD']*item['serviceUSDMarkupPercentage'])/100).toFixed(2);
              item["serviceUSDMarkUpAmount"] = serviceGTICommissionUS;
              item["serviceUSDCommission"] = serviceGTICommissionUS.toFixed(2);
              let serviceUSDClientDollar =
                parseFloat(serviceGTICommissionUS) +
                parseFloat(item["serviceNetUSD"]);
              item["serviceUSDClientDollar"] = serviceUSDClientDollar;
            } else {
              let serviceUSDClientDollar =
                parseFloat(item["serviceUSDMarkUpAmount"]) +
                parseFloat(item["serviceNetUSD"]);

              item["serviceUSDCommission"] = item["serviceUSDMarkUpAmount"];
              item["serviceUSDClientDollar"] = serviceUSDClientDollar;
            }
            if (item["creditCardFees"] > 0) {
              let dividedBy = (100 - item["creditCardFees"]) / 100;
              let creditCardFees = parseFloat(
                item["serviceUSDClientDollar"] / dividedBy -
                  item["serviceUSDClientDollar"]
              );
              item["serviceUSDClientDollar"] =
                item["serviceUSDClientDollar"] + creditCardFees;
            }
            if (
              item["agentCommissionType"] == "byPercentage" &&
              item["agentCommissionByPercentage"] != "" &&
              item["agentCommissionByPercentage"] != 0
            ) {
              let dividedBy = (100 - item["agentCommissionByPercentage"]) / 100;
              let agentCommissionValue = parseFloat(
                item["serviceUSDClientDollar"] / dividedBy -
                  parseFloat(item["serviceUSDClientDollar"])
              );
              item["agentCommissionValue"] = agentCommissionValue.toFixed(2);
            }
            item["serviceUSDClientDollar"] =
              item["serviceUSDClientDollar"].toFixed(2);

            // item['serviceUSDMarkupPercentage'] = item['markupPercentage'];
            // item['serviceUSDMarkUpAmount'] = (item['markupAmount']/this.props.fileUSDROE).toFixed(2) ;
            // item['serviceUSDCommission'] = (item['serviceGTICommission']/this.props.fileUSDROE).toFixed(2) ;
            // item['serviceUSDClientDollar'] = (item['serviceGrossINR']/this.props.fileUSDROE).toFixed(2) ;

            // console.log('duartion',duartion)
            // console.log('unit',item['unit'])
            // console.log('rate',item['rate'])
            // console.log('cost',item['cost'])
            // console.log('commissionTypeUS',item['commissionTypeUS'])
            // console.log('markupPercentage',item['markupPercentage'])
            // console.log('markupAmount',item['markupAmount'])
            // console.log('serviceGTICommission',item['serviceGTICommission'])
            // console.log('serviceGrossINR',item['serviceGrossINR'])
            // console.log('serviceGSTPercentage',item['serviceGSTPercentage'])
            // console.log('serviceSellINR',item['serviceSellINR'])
            // console.log('serviceUSDMarkUpAmount',item['serviceUSDMarkUpAmount'])
            // console.log('serviceUSDMarkUpAmount',item['serviceUSDMarkUpAmount'])
            // console.log('serviceUSDCommission',item['serviceUSDCommission'])
            // console.log('serviceUSDClientDollar',item['serviceUSDClientDollar'])
            // console.log('fileUSDROE',this.props.fileUSDROE)
          }

          return item;
        }
      ),
    });
  }

  handleItineraryServiceInput(index: number, key: string, value: any) {
    this.setState({
      TourItineraryServiceData: this.props.TourItineraryServiceData.map(
        (item: any, k: number) => {
          if (index == k) {
            if (
              key == "noofGuest" ||
              key == "noofAdult" ||
              key == "noofChild" ||
              key == "unit"
            ) {
              value = value.replace(/[^0-9]/gi, "");
            } else if (
              key == "rate" ||
              key == "markupPercentage" ||
              key == "markupAmount" ||
              key == "serviceNetUSD" ||
              key == "serviceUSDMarkUpAmount" ||
              key == "serviceUSDMarkupPercentage" ||
              key == "agentCommissionValue" ||
              key == "agentCommissionByPercentage"
            ) {
              value = value.replace(/[^0-9.]/gi, "");
            }
            if (
              key == "serviceFeeList" &&
              (item["startDate"] == "" || item["endDate"] == "")
            ) {
              alert("Please select the date");
            } else if (
              key == "mealPlan" &&
              value !=
                ArrayHelper.getValue(
                  this.state.selectServiceData,
                  "serviceFeeDetails[0].mealPlan"
                )
            ) {
              if (
                (value == "MAP(L)" ||
                  value == "AP" ||
                  value == "JP" ||
                  value == "MAP(L)AI" ||
                  value == "APAI" ||
                  value == "JPAI") &&
                ArrayHelper.getValue(
                  this.state.selectServiceData,
                  "serviceFeeDetails[0].mandatoryLunch"
                ) != 0
              ) {
                alert("Lunch is already added in your meal Plan");
                item[key] = ArrayHelper.getValue(
                  this.state.selectServiceData,
                  "serviceFeeDetails[0].mealPlan"
                );
              } else if (
                (value == "MAP(D)" ||
                  value == "AP" ||
                  value == "JP" ||
                  value == "MAP(D)AI" ||
                  value == "APAI" ||
                  value == "JPAI") &&
                ArrayHelper.getValue(
                  this.state.selectServiceData,
                  "serviceFeeDetails[0].mandatoryDinner"
                ) != 0
              ) {
                alert("Dinner is already added in your meal Plan");
                item[key] = ArrayHelper.getValue(
                  this.state.selectServiceData,
                  "serviceFeeDetails[0].mealPlan"
                );
              } else {
                item[key] = value;
              }
            } else if (
              key == "rate" ||
              key == "cityId" ||
              key == "countryId" ||
              key == "stateId" ||
              key == "vendorId"
            ) {
              if (item["startDate"] == "") {
                item[key] = "";
                this.setState({ selectedServices: [] });
                alert("Please enter value start date");
              } else if (
                item["endDate"] == "" &&
                item["vendorTypeId"] != VENDORTYPEIDBYDATE &&
                item["vendorTypeId"] != "27"
              ) {
                item[key] = "";
                this.setState({ selectedServices: [] });
                alert("Please enter value end date");
              } else if (key == "rate") {
                item[key] = value.slice(0, 6);
              } else if (key == "countryId") {
                item[key] = value;
              } else if (key == "stateId") {
                item[key] = value;
              } else if (key == "cityId") {
                if (item["vendorTypeId"] != "") {
                  item[key] = value;
                  let vendorList = this.props.vendorList;
                  vendorList = vendorList.filter(
                    (_item) =>
                      _item.cityId == value &&
                      _item.vendorTypeId == item["vendorTypeId"]
                  );
                  item["vendorList"] = vendorList;
                  item["vendorId"] = "0";
                  item["serviceId"] = "0";
                  this.setState({ serviceFeeList: [] });
                } else {
                  item[key] = "";

                  alert("PLease select the vendor type");
                }
              } else if (key == "vendorId") {
                item[key] = value;
                let serviceList = this.props.serviceList;

                serviceList = serviceList.filter(
                  (_item) => _item.vendorId == value
                );
                item["serviceList"] = serviceList;
                item["serviceId"] = "0";
                item["serviceFeesId"] = "0";
              }
            } else if (key == "unit") {
              let duartion = DATEDURATION(item["startDate"], item["endDate"]);

              if (item["rate"] == "" || item["rate"] == 0) {
                item[key] = "";
                alert("Please enter value rate");
              } else if (duartion < 0) {
                item[key] = "";
                alert("Please enter valid date");
              } else {
                item[key] = value.slice(0, 3);
                item["cost"] = (
                  duartion *
                  item[key] *
                  parseFloat(item["rate"])
                ).toFixed(2);
              }
            } else if (key == "cost") {
              if (item["unit"] == "" || item["unit"] == 0) {
                item[key] = "";
                alert("Please enter unit");
              } else {
                item[key] = value.slice(0, 6);
              }
            } else if (key == "serviceGTICommission") {
              if (
                (item["markupPercentage"] == "" ||
                  item["markupPercentage"] == 0) &&
                item["commissionType"] == "byPercentage"
              ) {
                item[key] = "";
                alert("Please enter value of markup percentage");
              } else if (
                (item["markupAmount"] == "" || item["markupAmount"] == 0) &&
                item["commissionType"] == "byAmount"
              ) {
                item[key] = "";
                alert("Please enter value of markup amount");
              } else {
                item[key] = value.slice(0, 6);
              }
            } else if (key == "serviceUSDCommission") {
              if (
                (item["serviceUSDMarkupPercentage"] == "" ||
                  item["serviceUSDMarkupPercentage"] == 0) &&
                item["commissionTypeUS"] == "byPercentage"
              ) {
                item[key] = "";
                alert("Please enter value of GTI US Markup Percentage");
              } else if (
                (item["serviceUSDMarkUpAmount"] == "" ||
                  item["serviceUSDMarkUpAmount"] == 0) &&
                item["commissionTypeUS"] == "byAmount"
              ) {
                item[key] = "";
                alert("Please enter value of GTI US Markup Amount");
              } else {
                item[key] = value.slice(0, 6);
              }
            } else if (key == "serviceGrossINR") {
              if (
                item["serviceGTICommission"] == "" ||
                item["serviceGTICommission"] == 0
              ) {
                item[key] = "";
                alert("Please enter value of GTI Commission");
              } else {
                item[key] = value.slice(0, 6);
              }
            } else if (
              key == "markupPercentage" ||
              key == "agentCommissionByPercentage"
            ) {
              item[key] = value.slice(0, 5);

              if (item["rate"] == "" || item["rate"] == 0) {
                item[key] = "";
                alert("Please enter value rate");
              } else if (item["cost"] == "" || item["cost"] == 0) {
                item[key] = "";
                alert("Please enter value cost");
              } else if (value < 99.99) {
                item[key] = value;
              } else {
                alert("Please enter value than 99.99");
                item[key] = "";
              }
            } else if (key == "markupAmount") {
              if (item["rate"] == "" || item["rate"] == 0) {
                item[key] = "";
                alert("Please enter value rate");
              } else if (item["cost"] == "" || item["cost"] == 0) {
                item[key] = "";
                alert("Please enter value cost");
              } else {
                item[key] = value;

                item["serviceGTICommission"] = value;
                item["serviceGrossINR"] = (
                  parseFloat(value) + parseFloat(item["cost"])
                ).toFixed(2);
              }
            } else if (key == "serviceGSTPercentage") {
              item[key] = value.slice(0, 3);

              if (
                item["serviceGrossINR"] == "" ||
                item["serviceGrossINR"] == 0
              ) {
                item[key] = "";
                alert("Please enter value Gross INR");
              } else if (value < 99.99) {
                item[key] = value;
              } else {
                alert("Please enter value than 99.99");
                item[key] = "";
              }
            } else if (key == "serviceSellINR") {
              if (
                item["serviceGrossINR"] == "" ||
                item["serviceGrossINR"] == 0
              ) {
                item[key] = "";
                alert("Please enter value Gross INR");
              } else if (
                item["serviceGSTPercentage"] == "" ||
                item["serviceGSTPercentage"] == 0
              ) {
                item[key] = "";
                alert("Please enter value GTI GST Percentage");
              } else {
                item[key] = value.slice(0, 6);
              }
            } else if (
              key == "serviceNetUSD" ||
              key == "noofGuest" ||
              key == "mealPlan" ||
              key == "origin" ||
              key == "destination"
            ) {
              item[key] = value;
            } else if (key == "serviceUSDMarkupPercentage") {
              if (item["serviceNetUSD"] == "" || item["serviceNetUSD"] == 0) {
                alert("Please enter value of  Net USD");
              } else if (value < 99.99) {
                item[key] = value;
              } else {
                alert("Please enter value than 99.99");
                item[key] = "";
              }
            } else if (key == "serviceUSDMarkUpAmount") {
              if (item["serviceNetUSD"] == "" || item["serviceNetUSD"] == 0) {
                alert("Please enter value of  Net USD");
              } else {
                item[key] = value;
              }
            } else if (key == "creditCardFees") {
              item[key] = value;
            }

            if (
              key == "countryId" &&
              item["vendorTypeId"] != "" &&
              item["vendorTypeId"] != "5" &&
              value != "" &&
              value != "0"
            ) {
              if (value == "106") {
                item["serviceGSTPercentage"] = this.props.serviceGSTPercentage;
              } else {
                item["serviceGSTPercentage"] = 0.0;
              }
            } else if (key == "vendorTypeId") {
              if (value == VENDORTYPEIDBYDATE || value == ROUNTINGVENDOR) {
                this.setState({ displayType: "byDate" });
              } else {
                this.setState({ displayType: "byCost" });
              }

              item[key] = value;

              item["rate"] = 0.0;
              item["unit"] = 1;
              item["cost"] = 0.0;
              item["taxAmount"] = 0.0;
              item["noofGuest"] = this.props.noofGuest;
              item["noofAdult"] = 0;
              item["noofChild"] = 0;
              item["mealPlan"] = "";
              item["origin"] = "";
              item["destination"] = "";
              item["flightNo"] = "";
              item["pnr"] = "";
              item["markupPercentage"] =
                this.props.itineraryMarkupType == "byPercentage"
                  ? this.props.itineraryMarkupAmount
                  : 0.0;
              item["markupAmount"] =
                this.props.itineraryMarkupType == "byAmount"
                  ? this.props.itineraryMarkupAmount
                  : 0.0;
              item["isShowOnItinerary"] = 0.0;
              item["serviceGTICommission"] = 0.0;
              item["serviceSellINR"] = 0.0;
              item["serviceNetUSD"] = 0.0;
              item["serviceUSDMarkupPercentage"] =
                this.props.itineraryMarkupType == "byPercentage"
                  ? this.props.itineraryUSMarkupAmount
                  : 0.0;
              item["serviceUSDCommission"] =
                this.props.itineraryMarkupType == "byAmount"
                  ? this.props.itineraryUSMarkupAmount
                  : 0.0;
              item["serviceUSDClientDollar"] = 0.0;
              item["creditCardFees"] = this.props.itineraryCreditCardFees;
              item["quoteType"] = "0";
              item["commissionType"] = this.props.itineraryMarkupType;
              item["commissionTypeUS"] = this.props.itineraryMarkupType;
              item["agentCommissionType"] = this.props.itineraryMarkupType;
              item["agentCommissionByPercentage"] =
                this.props.itineraryAgentAmount;
              item["serviceUSDMarkUpAmount"] = 0.0;

              item["vendorList"] = [];
              item["serviceList"] = [];

              this.setState({
                selectServiceData: {},
                selectedServices: [],
                serviceFeeList: [],
                calculationType: ArrayHelper.getValue(
                  this.props.vendorTypeList.filter((_it) => _it.id == value),
                  "[0].calculationType"
                ),
              });
              if (value == 5) {
                let vendorList = this.props.vendorList;
                vendorList = vendorList.filter(
                  (_item) => _item.vendorTypeId == value
                );
                item["vendorList"] = vendorList;
              }
            } else if (key == "serviceFeesId") {
              item["serviceFeesId"] = value;
              if (value != "-1") {
                let serviceFeeList = ArrayHelper.getValue(
                  this.state.selectServiceData,
                  "serviceFeeDetails",
                  []
                ).filter((item) => item.id == value);

                let hotelRateList = [
                  {
                    value: `Weekday Rate Single`,
                    amount: ArrayHelper.getValue(
                      serviceFeeList,
                      "[0].weekdayRateSingle"
                    ),
                    name: `Weekday Rate Single (${ArrayHelper.getValue(
                      serviceFeeList,
                      "[0].weekdayRateSingle"
                    )})`,
                  },
                  {
                    value: `Weekday Rate Double`,
                    amount: ArrayHelper.getValue(
                      serviceFeeList,
                      "[0].weekdayRateDouble"
                    ),
                    name: `Weekday Rate Double (${ArrayHelper.getValue(
                      serviceFeeList,
                      "[0].weekdayRateDouble"
                    )})`,
                  },
                  {
                    value: `Weekend Rate Single`,
                    amount: ArrayHelper.getValue(
                      serviceFeeList,
                      "[0].weekendRateSingle"
                    ),
                    name: `Weekend Rate Single (${ArrayHelper.getValue(
                      serviceFeeList,
                      "[0].weekendRateSingle"
                    )})`,
                  },
                  {
                    value: `Weekend Rate Double`,
                    amount: ArrayHelper.getValue(
                      serviceFeeList,
                      "[0].weekendRateDouble"
                    ),
                    name: `Weekend Rate Double (${ArrayHelper.getValue(
                      serviceFeeList,
                      "[0].weekendRateDouble"
                    )})`,
                  },
                ];
                this.setState({ hotelRateList: hotelRateList });
                item["rateType"] = "";
                item["rate"] = ArrayHelper.getValue(serviceFeeList, "[0].rate");
                item["unit"] = 1;
                item["cost"] = ArrayHelper.getValue(serviceFeeList, "[0].cost");

                item["mealPlan"] = ArrayHelper.getValue(
                  serviceFeeList,
                  "[0].mealPlan"
                );
                this.setState({
                  selectedMealPlan: ArrayHelper.getValue(
                    serviceFeeList,
                    "[0].mealPlan"
                  ),
                });
                if (
                  ArrayHelper.getValue(
                    serviceFeeList,
                    "[0].markupPercentage"
                  ) == 0 &&
                  ArrayHelper.getValue(serviceFeeList, "[0].markupAmount") != 0
                ) {
                } else {
                }
                if (item["vendorTypeId"] == 1) {
                  if (
                    GETDATETIME(item["startDate"]) >=
                      GETDATETIME(
                        ArrayHelper.getValue(serviceFeeList, "[0].startDate")
                      ) &&
                    GETDATETIME(
                      ArrayHelper.getValue(serviceFeeList, "[0].endDate")
                    ) >= GETDATETIME(item["startDate"]) &&
                    GETDATETIME(
                      ArrayHelper.getValue(serviceFeeList, "[0].endDate")
                    ) >= GETDATETIME(item["endDate"])
                  ) {
                  } else {
                    item[key] = "";
                    item["rate"] = 0.0;
                    item["unit"] = 1;
                    item["cost"] = 0.0;

                    alert(
                      "Please select Hotel Feed Duration according to itenary date"
                    );
                  }
                }
              } else {
                item["rate"] = 0.0;
                item["unit"] = 1;
                item["cost"] = 0.0;
                item["mealPlan"] = "";
              }
            } else if (key == "serviceId") {
              item[key] = value;
              item["serviceFeesId"] = "";
              let serviceList = this.props.serviceList;
              serviceList = serviceList.filter((item) => item.id == value);
              this.setState({
                selectServiceData: ArrayHelper.getValue(serviceList, "[0]"),
              });
              $(".serviceFee").prop({ checked: false });
            } else if (key == "startDate") {
              item["serviceId"] = "";
              item[key] = value;
            } else if (key == "endDate") {
              if (item["startDate"] != "") {
                item["serviceId"] = "";
                item[key] = value;
              } else {
                item[key] = "";
                alert("Please select start date");
              }
            } else if (
              key == "serviceGTICommission" ||
              key == "serviceGrossINR" ||
              key == "serviceNetUSD" ||
              key == "serviceUSDCommission" ||
              key == "serviceUSDClientDollar"
            ) {
              item[key] = value.slice(0, 6);
            } else if (key == "agentCommissionType") {
              item[key] = value;
              item["agentCommissionByPercentage"] = "";
              item["agentCommissionValue"] = "";
            } else if (key == "rateType") {
              item[key] = value;
              let hotelRateList = this.state.hotelRateList;
              hotelRateList = hotelRateList.filter(
                (_item) => _item.value == value
              );

              item["rate"] = ArrayHelper.getValue(hotelRateList, "[0].amount");
            } else {
              item[key] = value;
            }
            if (
              value != "" &&
              key != "quoteType" &&
              key != "isShowOnItinerary" &&
              key != "description" &&
              key != "agentCommissionType"
            ) {
              setTimeout(() => {
                this.setCalucation(key);
              }, 500);
            }
          }

          return item;
        }
      ),
    });
  }

  submitItinerarySerice() {
    console.log(
      "TourItineraryServiceData before submission:",
      this.props.TourItineraryServiceData
    );
    console.log(
      "City ID in submitItinerarySerice:",
      this.props.TourItineraryServiceData[0]?.selectedState
    );
    let error = "";

    if (error == "" && this.props.ItineraryData.name == "") {
      alert("Please provide the Itinerary Name.");
      error = "yes";
    } else if (
      error == "" &&
      (this.props.TourItineraryServiceData[0].vendorTypeId == "" ||
        this.props.TourItineraryServiceData[0].vendorTypeId == "0")
    ) {
      alert("Please provide the vendor type.");
      error = "yes";
    } else if (
      error == "" &&
      this.props.TourItineraryServiceData[0].startDate == ""
    ) {
      alert("Please provide Itinerary Service start date.");
      error = "yes";
    } else if (
      error == "" &&
      this.props.TourItineraryServiceData[0].endDate == "" &&
      this.props.TourItineraryServiceData[0].vendorTypeId !=
        VENDORTYPEIDBYDATE &&
      this.props.TourItineraryServiceData[0].vendorTypeId != "27"
    ) {
      alert("Please provide Itinerary Service end  date.");
      error = "yes";
    } else if (
      error == "" &&
      (this.props.TourItineraryServiceData[0].cityId == "" ||
        this.props.TourItineraryServiceData[0].cityId == "0") &&
      this.props.TourItineraryServiceData[0].vendorTypeId != "5"
    ) {
      console.log(
        "TourItineraryServiceData before submission:",
        this.state.TourItineraryServiceData
      );
      console.log(
        "City cityName in submitItinerarySerice:",
        this.state.TourItineraryServiceData[0]?.cityName
      );

      alert("Please provide the city.");
      error = "yes";
    } else if (
      error == "" &&
      this.props.TourItineraryServiceData[0].vendorTypeId !=
        VENDORTYPEIDBYDATE &&
      this.props.TourItineraryServiceData[0].vendorTypeId != "27" &&
      (this.props.TourItineraryServiceData[0].vendorId == "" ||
        this.props.TourItineraryServiceData[0].vendorId == "0")
    ) {
      alert("Please provide the vendor.");
      error = "yes";
    } else if (
      error == "" &&
      this.props.TourItineraryServiceData[0].vendorTypeId !=
        VENDORTYPEIDBYDATE &&
      this.props.TourItineraryServiceData[0].vendorTypeId != "27" &&
      (this.props.TourItineraryServiceData[0].serviceId == "" ||
        this.props.TourItineraryServiceData[0].serviceId == "0")
    ) {
      alert("Please provide the service.");
      error = "yes";
    } else if (
      error == "" &&
      this.props.TourItineraryServiceData[0].vendorTypeId !=
        VENDORTYPEIDBYDATE &&
      this.props.TourItineraryServiceData[0].vendorTypeId != "27" &&
      this.props.TourItineraryServiceData[0].rate == ""
    ) {
      alert("Please provide the rate.");
      error = "yes";
    } else if (
      error == "" &&
      this.props.TourItineraryServiceData[0].vendorTypeId !=
        VENDORTYPEIDBYDATE &&
      this.props.TourItineraryServiceData[0].vendorTypeId != "27" &&
      this.props.TourItineraryServiceData[0].unit == ""
    ) {
      alert("Please provide the unit.");
      error = "yes";
    } else if (
      error == "" &&
      this.props.TourItineraryServiceData[0].vendorTypeId !=
        VENDORTYPEIDBYDATE &&
      this.props.TourItineraryServiceData[0].vendorTypeId != "27" &&
      this.props.TourItineraryServiceData[0].cost == ""
    ) {
      alert("Please provide the cost.");
      error = "yes";
    } else if (
      error == "" &&
      this.props.TourItineraryServiceData[0].vendorTypeId !=
        VENDORTYPEIDBYDATE &&
      this.props.TourItineraryServiceData[0].vendorTypeId != "27" &&
      this.props.TourItineraryServiceData[0].commissionType == "byPercentage" &&
      (this.props.TourItineraryServiceData[0].markupPercentage == "" ||
        this.props.TourItineraryServiceData[0].markupPercentage == 0)
    ) {
      alert("Please provide the Markup Percentage.");
      error = "yes";
    } else if (
      error == "" &&
      this.props.TourItineraryServiceData[0].vendorTypeId !=
        VENDORTYPEIDBYDATE &&
      this.props.TourItineraryServiceData[0].vendorTypeId != "27" &&
      (this.props.TourItineraryServiceData[0].serviceGTICommission == "" ||
        this.props.TourItineraryServiceData[0].serviceGTICommission == 0)
    ) {
      alert("Please provide the GTI Commission.");
      error = "yes";
    } else if (
      error == "" &&
      this.props.TourItineraryServiceData[0].vendorTypeId !=
        VENDORTYPEIDBYDATE &&
      this.props.TourItineraryServiceData[0].vendorTypeId != "27" &&
      this.props.TourItineraryServiceData[0].commissionTypeUS ==
        "byPercentage" &&
      (this.props.TourItineraryServiceData[0].serviceUSDMarkupPercentage ==
        "" ||
        this.props.TourItineraryServiceData[0].serviceUSDMarkupPercentage == 0)
    ) {
      alert("Please provide the GT US Markup Percentage.");
      error = "yes";
    } else if (
      error == "" &&
      this.props.TourItineraryServiceData[0].vendorTypeId !=
        VENDORTYPEIDBYDATE &&
      this.props.TourItineraryServiceData[0].vendorTypeId != "27" &&
      (this.props.TourItineraryServiceData[0].serviceUSDCommission == "" ||
        this.props.TourItineraryServiceData[0].serviceUSDCommission == 0)
    ) {
      alert("Please provide the GT US Commission.");
      error = "yes";
    } else if (
      error == "" &&
      this.props.TourItineraryServiceData[0].vendorTypeId !=
        VENDORTYPEIDBYDATE &&
      this.props.TourItineraryServiceData[0].serviceGrossINR == ""
    ) {
      alert("Please provide the GTI gross amount");
      error = "yes";
    } else if (
      error == "" &&
      this.props.TourItineraryServiceData[0].vendorTypeId !=
        VENDORTYPEIDBYDATE &&
      this.props.TourItineraryServiceData[0].serviceGSTPercentage == "" &&
      this.props.TourItineraryServiceData[0].countryId == "106"
    ) {
      alert("Please provide the GTI GST Percentage");
      error = "yes";
    } else if (
      error == "" &&
      this.props.TourItineraryServiceData[0].vendorTypeId !=
        VENDORTYPEIDBYDATE &&
      this.props.TourItineraryServiceData[0].serviceSellINR == ""
    ) {
      alert("Please provide the GTI shell amount.");
      error = "yes";
    } else if (
      error == "" &&
      this.props.TourItineraryServiceData[0].vendorTypeId !=
        VENDORTYPEIDBYDATE &&
      this.props.TourItineraryServiceData[0].isShowOnItinerary == "Yes" &&
      this.props.TourItineraryServiceData[0].description == ""
    ) {
      alert("Please provide description.");
      error = "yes";
    } else if (
      error == "" &&
      this.props.TourItineraryServiceData[0].vendorTypeId !=
        VENDORTYPEIDBYDATE &&
      this.props.TourItineraryServiceData[0].vendorTypeId != "27" &&
      (this.props.TourItineraryServiceData[0].quoteType == "" ||
        this.props.TourItineraryServiceData[0].quoteType == "0")
    ) {
      alert("Please provide the Quote Type.");
      error = "yes";
    } else if (
      this.props.TourItineraryServiceData[0].vendorTypeId == "5" &&
      this.props.TourItineraryServiceData[0].vendorTypeId !=
        VENDORTYPEIDBYDATE &&
      (parseCityDetails(this.props.TourItineraryServiceData[0].origin)
        .countryCode == "" ||
        parseCityDetails(this.props.TourItineraryServiceData[0].origin)
          .countryCode == this.props.TourItineraryServiceData[0].origin)
    ) {
      alert("Please provide origin value properly.");
      error = "yes";
    } else if (
      this.props.TourItineraryServiceData[0].vendorTypeId == "5" &&
      this.props.TourItineraryServiceData[0].vendorTypeId !=
        VENDORTYPEIDBYDATE &&
      (parseCityDetails(this.props.TourItineraryServiceData[0].destination)
        .countryCode == "" ||
        parseCityDetails(this.props.TourItineraryServiceData[0].destination)
          .countryCode == this.props.TourItineraryServiceData[0].destination)
    ) {
      alert("Please provide destination value properly.");
      error = "yes";
    }

    if (error == "") {
      this.props.addItinerarySerice();
      if (this.props.loader == false) {
        this.setState({
          selectedKey: "",
          actionType: "add",
          serviceFeeList: [],
        });
      }
    }
  }
  resetItinerarySerice() {
    this.props.resetItinerarySerice();
    this.setState({
      selectedKey: "",
      actionType: "add",
      serviceFeeList: [],
      selectedState: [],
      selectedCity: [],
      selectedCountry: [],
    });
  }
  componentDidMount() {
    //    this.showDate();
    //    setTimeout(()=>{
    //     this.showDate();
    //    },1000)
  }
  componentWillReceiveProps() {
    setTimeout(() => {
      this.showDate();
    }, 1000);
  }
  showDate() {
    $("#serviveStartDate")
      .datepicker({
        minDate: addsDays(this.props.tourStartDate, 0),
        maxDate: subsDays(this.props.tourEndDate, 0),
      })
      .on("change", (e: any) => {
        $("#serviceEndDate").datepicker(
          "option",
          "minDate",
          addsDays(e.target.value, 0)
        );
        this.handleItineraryServiceInput(0, "startDate", e.target.value);
      });

    $("#serviceEndDate")
      .datepicker({
        minDate: addsDays(this.props.tourStartDate, 0),
        maxDate: subsDays(this.props.tourEndDate, 0),
      })
      .on("change", (e: any) => {
        //  $("#serviveStartDate").datepicker("option", "maxDate", subsDays(e.target.value,0));
        this.handleItineraryServiceInput(0, "endDate", e.target.value);
      });
  }
  selectServiceList(e) {
    let selectedServices = this.state.selectedServices;
    let selectedServicesList = [];
    if (selectedServices.filter((item) => item.id == e.id).length > 0) {
      selectedServicesList = selectedServices.filter((item) => item.id != e.id);
    } else {
      selectedServicesList = selectedServices.concat({
        id: ArrayHelper.getValue(e, "id"),
        rate: ArrayHelper.getValue(e, "serviceFeeDetails[0].rate"),
      });
    }
    let serviveId = "";
    let rateAmount = 0;
    if (selectedServicesList.length > 0) {
      selectedServicesList.map((item, key) => {
        if (key > 0) {
          serviveId = serviveId + ",";
        }
        rateAmount = rateAmount + parseInt(item.rate);
        serviveId = serviveId + item.id;
      });
    }

    this.handleItineraryServiceInput(0, "rate", rateAmount.toString());
    this.handleItineraryServiceInput(0, "serviceId", serviveId);
    this.setState({ selectedServices: selectedServicesList });
  }

  handleSelectChange = (event) => {
    const value = event.target.value;
    this.setState({ costFilter: value });
  };
  getCitySuggestions = async (value) => {
    this.setState({ loading: true, cityId: value });
    try {
      let response = await SettingApi.GetSettingList(
        `/api/City/AutoCompleteCity?searchcity=${value}`
      );
      console.log(value, "value-=-=-");

      console.log("API Response:", response);

      if (ArrayHelper.getValue(response, "isSuccess") === true) {
        this.setState({
          data: response.cities,
        });
      } else {
        this.setState({
          data: [],
        });
      }
    } catch (error) {
      console.error("Error fetching city suggestions", error);
      this.setState({
        data: [],
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleSearch = (value) => {
    if (value) {
      this.getCitySuggestions(value);
    } else {
      this.setState({ data: [] });
    }
  };

  handleCityChange = (value, option, index) => {
    // Ensure the city exists in the 'data' array.
    const selectedCity = this.state.data.find(
      (city) => city.cityName === value
    );

    // If the city is not found in 'data', log an error and return.
    if (!selectedCity) {
      console.error("Selected city not found in data.");
      return;
    }

    // Ensure 'TourItineraryServiceData' exists and contains valid data.
    if (
      !this.props.TourItineraryServiceData ||
      this.props.TourItineraryServiceData.length === 0
    ) {
      console.error("TourItineraryServiceData is empty.");
      return;
    }

    // Get the first object in the TourItineraryServiceData array
    const serviceData = this.props.TourItineraryServiceData[0];

    // Find the city in the service data (use 'cityId' to match)
    const cityIndex = serviceData.serviceList.findIndex(
      (service) => service.cityId === selectedCity.cityId
    );

    // If the city doesn't exist in the service data, add it.
    if (cityIndex === -1) {
      serviceData.serviceList.push({
        cityId: selectedCity.cityId,
        cityName: selectedCity.cityName,
        stateId: selectedCity.stateId,
        stateName: selectedCity.stateName,
        countryId: selectedCity.countryId,
        countryName: selectedCity.countryName,
      });
      console.log("City added to serviceList:", serviceData.serviceList);
    } else {
      // If the city exists, update the existing data.
      serviceData.serviceList[cityIndex] = {
        ...serviceData.serviceList[cityIndex],
        cityId: selectedCity.cityId,
        cityName: selectedCity.cityName,
        stateId: selectedCity.stateId,
        stateName: selectedCity.stateName,
        countryId: selectedCity.countryId,
        countryName: selectedCity.countryName,
      };
      console.log("Updated city data in serviceList:", serviceData.serviceList);
    }

    // Now, update the component state with the selected city information.
    this.setState(
      {
        cityId: selectedCity.cityId,
        selectedCityId: selectedCity.cityId,
        selectedCity: selectedCity.cityName,
        selectedState: selectedCity.stateName,
        selectedCountry: selectedCity.countryName,
      },
      () => {
        console.log("Updated state after setState:", this.state);
        // Pass the updated cityId to the itinerary service input
        this.handleItineraryServiceInput(
          index,
          "cityId",
          selectedCity.cityId,
          "vendorTypeId",
          "vendorId"
        );
      }
    );
  };

  // handleCityChange = (value, option, index) => {
  //   console.log("Selected value:", value); // Value will be cityName here
  //   console.log("Selected option:", option); // Option contains city data
  //   console.log("Selected index:", index); // Index of the selected option
  //   console.log("Available cities:", this.state.data);

  //   console.log(
  //     "TourItineraryServiceData before update:",
  //     this.props.TourItineraryServiceData
  //   );

  //   // Find the selected city based on cityName
  //   const selectedCity = this.state.data.find(
  //     (city) => city.cityName === value
  //   );

  //   if (selectedCity) {
  //     console.log("City found:", selectedCity);

  //     const updatedServiceData = [...this.props.TourItineraryServiceData];

  //     if (updatedServiceData.length === 0 || !updatedServiceData[index]) {
  //       console.error("Invalid index or empty data, can't update.");
  //     } else {
  //       updatedServiceData[index] = {
  //         ...updatedServiceData[index],
  //         cityId: selectedCity.cityId,
  //         cityName: selectedCity.cityName,
  //         stateId: selectedCity.stateId,
  //         stateName: selectedCity.stateName,
  //         countryId: selectedCity.countryId,
  //         countryName: selectedCity.countryName,
  //       };

  //       console.log("Updated data in handleCityChange:", updatedServiceData);

  //       this.setState(
  //         {
  //           cityId: selectedCity.cityId,
  //           selectedCityId: selectedCity.cityId,
  //           selectedState: selectedCity.stateName,
  //           selectedCountry: selectedCity.countryName,
  //         },
  //         () => {
  //           console.log("Updated state after setState:", this.state);

  //           // Call handleItineraryServiceInput after the city data has been updated
  //           this.handleItineraryServiceInput(
  //             index,
  //             "cityId",
  //             selectedCity.cityId,
  //             "vendorTypeId",
  //             "vendorId"
  //           );
  //         }
  //       );
  //     }
  //   } else {
  //     console.error("Selected city not found.");
  //     alert("City not found, please select a valid city.");
  //   }
  // };

  render() {
    let tourItineraryService =
      this.state.displayType == "byCost"
        ? this.props.tourItineraryService.filter(
            (item) =>
              ArrayHelper.getValue(item, "vendorTypeId") !=
                VENDORTYPEIDBYDATE &&
              ArrayHelper.getValue(item, "vendorTypeId") != ROUNTINGVENDOR
          )
        : this.props.tourItineraryService.filter(
            (item) =>
              ArrayHelper.getValue(item, "vendorTypeId") ==
                VENDORTYPEIDBYDATE ||
              ArrayHelper.getValue(item, "vendorTypeId") == ROUNTINGVENDOR
          );
    const { data, loading, cityId, selectedState, selectedCountry } =
      this.state;
    return (
      <React.Fragment>
        <div
          className="p-3 border mt-2 mb-2 boxAddPassanger whiteBackgound"
          id="serviceItenaryHeading"
        >
          <span className="me-2 heading">Itinerary Service</span>{" "}
          <span className="txt-right floatright">
            <button
              onClick={() => this.resetItinerarySerice()}
              type="button"
              className="btn btn-sm btn-primary rounded"
            >
              Reset
            </button>
          </span>
          {this.props.TourItineraryServiceData.map((item, key) => {
            let vendorName = "Vendor";
            let serviceName = "Service";
            let serviceFeeName = "Service Fee";
            if (item.vendorTypeId == 1) {
              vendorName = "Hotel";
              serviceName = "Room";
              serviceFeeName = "Hotel Feed Duration";
            } else if (item.vendorTypeId == 2) {
              vendorName = "Transport";
              serviceFeeName = "Vehicle Type";
            }
            return (
              <div key={`service-${key}`}>
                <div className="d-flex mb-4">
                  <div className="flex-fill p-1" id="seviceHtmlvendorTypeId">
                    <label className="form-label">Vendor Type</label>

                    <select
                      className="form-select form-select-sm"
                      value={item.vendorTypeId}
                      onChange={(event: any) =>
                        this.handleItineraryServiceInput(
                          0,
                          "vendorTypeId",
                          event.currentTarget.value
                        )
                      }
                    >
                      <option value="">Select Vendor Type</option>
                      {this.props.vendorTypeList.map((item, key) => {
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
                  {item.vendorTypeId == 1 ? (
                    <div className="flex-fill p-1">
                      <label className="form-label">No. of Guest </label>
                      <input
                        maxLength={3}
                        type="text"
                        className="form-control form-control-sm"
                        id={`rateld_${this.props.ItenararyKey}_${key}`}
                        name={`tours[${key}].noofGuest`}
                        value={item.noofGuest}
                        onChange={(event: any) =>
                          this.handleItineraryServiceInput(
                            key,
                            "noofGuest",
                            event.currentTarget.value
                          )
                        }
                        placeholder="Enter No. of Guest"
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  {item.vendorTypeId == 1 ? (
                    <div className="flex-fill p-1">
                      <label className="form-label">No. of Extra Adult </label>
                      <input
                        maxLength={3}
                        type="text"
                        className="form-control form-control-sm"
                        id={`rateld_${this.props.ItenararyKey}_${key}`}
                        name={`tours[${key}].noofAdult`}
                        value={item.noofAdult}
                        onChange={(event: any) =>
                          this.handleItineraryServiceInput(
                            key,
                            "noofAdult",
                            event.currentTarget.value
                          )
                        }
                        placeholder="Enter No. of Extra Adult"
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  {item.vendorTypeId == 1 ? (
                    <div className="flex-fill p-1">
                      <label className="form-label">No. of Extra Child </label>
                      <input
                        maxLength={3}
                        type="text"
                        className="form-control form-control-sm"
                        id={`rateld_${this.props.ItenararyKey}_${key}`}
                        name={`tours[${key}].noofChild`}
                        value={item.noofChild}
                        onChange={(event: any) =>
                          this.handleItineraryServiceInput(
                            key,
                            "noofChild",
                            event.currentTarget.value
                          )
                        }
                        placeholder="Enter No. of Extra Child"
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="flex-fill p-1">
                    <label className="form-label">
                      {Number(item.vendorTypeId) === 25 ||
                      Number(item.vendorTypeId) === 27
                        ? "Date"
                        : "Start Date"}
                    </label>
                    <br />
                    <input
                      onClick={() => this.showDate()}
                      readOnly
                      id="serviveStartDate"
                      required
                      type="text"
                      placeholder="Enter Start Date"
                      className="form-control form-control-sm serviveStartDate"
                      name={`tours[${key}].startDate`}
                      value={formatDate(item.startDate)}
                    />
                  </div>
                  {Number(item.vendorTypeId) !== 25 &&
                  Number(item.vendorTypeId) !== 27 ? (
                    <div className="flex-fill p-1">
                      <label className="form-label">End Date </label>
                      <br />
                      <input
                        onClick={() => this.showDate()}
                        readOnly
                        id="serviceEndDate"
                        required
                        type="text"
                        placeholder="Enter End Date"
                        className="form-control form-control-sm serviceEndDate"
                        name={`tours[${key}].endDate`}
                        value={formatDate(item.endDate)}
                      />
                    </div>
                  ) : (
                    ""
                  )}

                  {item.vendorTypeId != 5 ? (
                    <div className="flex-fill p-1" id="seviceHtmlcityId">
                      <label className="form-label">City</label>

                      {/* <select
                        className="form-select form-select-sm"
                        value={item.cityId}
                        onChange={(event: any) =>
                          this.handleItineraryServiceInput(
                            0,
                            "cityId",
                            event.currentTarget.value
                          )
                        }
                      >
                        <option value="">Select City</option>
                        {this.props.cityList
                          .filter((_it) => _it.stateId == item.stateId)
                          .map((item, key) => {
                            return (
                              <option
                                key={`cityList-${key}`}
                                value={ArrayHelper.getValue(item, "cityId")}
                              >
                                {ArrayHelper.getValue(item, "cityName")}
                              </option>
                            );
                          })}
                      </select> */}

                      <Select
                        showSearch
                        value={this.state.selectedCity}
                        placeholder="Search for city"
                        notFoundContent={loading ? <Spin size="small" /> : null}
                        onSearch={this.handleSearch}
                        onChange={(value, option) =>
                          this.handleCityChange(value, option, option.key)
                        } // Ensure you pass the correct index here
                        filterOption={false}
                        style={{ width: "100%" }}
                      >
                        {data.map((city, index) => (
                          <Option key={index} value={city.cityName}>
                            {city.cityName}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  ) : (
                    ""
                  )}

                  {item.vendorTypeId != 5 ? (
                    <div className="flex-fill p-1" id="seviceHtmlstateId">
                      <label className="form-label">State</label>

                      {/* <select
                        className="form-select form-select-sm"
                        value={item.stateId}
                        onChange={(event: any) =>
                          this.handleItineraryServiceInput(
                            0,
                            "stateId",
                            event.currentTarget.value
                          )
                        }
                      >
                        <option value="">Select State</option>
                        {this.props.stateList
                          .filter((_it) => _it.countryId == item.countryId)
                          .map((item, key) => {
                            return (
                              <option
                                key={`stateList-${key}`}
                                value={ArrayHelper.getValue(item, "stateId")}
                              >
                                {ArrayHelper.getValue(item, "stateName")}
                              </option>
                            );
                          })}
                      </select> */}
                      <Input
                        value={selectedState}
                        placeholder="State"
                        readOnly
                      />
                    </div>
                  ) : (
                    ""
                  )}

                  {item.vendorTypeId != 5 ? (
                    <div className="flex-fill p-1" id="seviceHtmlcountryId">
                      <label className="form-label">Country</label>

                      <Input
                        value={selectedCountry}
                        placeholder="Country"
                        readOnly
                      />

                      {/* <select
                        className="form-select form-select-sm"
                        value={item.countryId}
                        onChange={(event: any) =>
                          this.handleItineraryServiceInput(
                            0,
                            "countryId",
                            event.currentTarget.value
                          )
                        }
                      >
                        <option value="">Select Country</option>
                        {this.props.countryList.map((item, key) => {
                          return (
                            <option
                              key={`countryList-${key}`}
                              value={ArrayHelper.getValue(item, "countryId")}
                            >
                              {ArrayHelper.getValue(item, "countryName")}
                            </option>
                          );
                        })}
                      </select> */}
                    </div>
                  ) : (
                    ""
                  )}

                  {Number(item.vendorTypeId) !== 25 &&
                  Number(item.vendorTypeId) !== 27 ? (
                    <div className="flex-fill p-1" id="seviceHtmlvendorId">
                      <label className="form-label">{vendorName}</label>
                      {/* <DropdownList filter
                                  data={ArrayHelper.getValue(item,'vendorList',[])}
                                  placeholder="Select Vendor Type"
                                  onChange={(event: any) => this.handleItineraryServiceInput(0, 'vendorId', event.id)}
                                  defaultValue={item.vendorId}
                                  dataKey='id'
                                  textField='vendorName' /> */}
                      <select
                        className="form-select form-select-sm"
                        value={item.vendorId}
                        onChange={(event: any) =>
                          this.handleItineraryServiceInput(
                            0,
                            "vendorId",
                            event.currentTarget.value
                          )
                        }
                      >
                        <option value="">Select {vendorName}</option>
                        {ArrayHelper.getValue(item, "vendorList", []).map(
                          (item, key) => {
                            return (
                              <option
                                key={`vendorList-${key}`}
                                value={ArrayHelper.getValue(item, "id")}
                              >
                                {ArrayHelper.getValue(item, "vendorName")}
                              </option>
                            );
                          }
                        )}
                      </select>
                    </div>
                  ) : (
                    ""
                  )}
                  {item.vendorTypeId != 4 &&
                  item.vendorTypeId != 25 &&
                  item.vendorTypeId != 27 ? (
                    <div className="flex-fill p-1" id="seviceHtmlserviceId">
                      <label className="form-label">{serviceName}</label>
                      <select
                        className="form-select form-select-sm"
                        value={item.serviceId}
                        onChange={(event: any) =>
                          this.handleItineraryServiceInput(
                            0,
                            "serviceId",
                            event.currentTarget.value
                          )
                        }
                      >
                        <option value="">Select {serviceName}</option>
                        {ArrayHelper.getValue(item, "serviceList", []).map(
                          (_item, key) => {
                            return (
                              <option
                                key={`serviceList-${key}`}
                                value={ArrayHelper.getValue(_item, "id")}
                              >
                                {ArrayHelper.getValue(_item, "name")}
                              </option>
                            );
                          }
                        )}
                      </select>
                    </div>
                  ) : (
                    ""
                  )}
                  {(ArrayHelper.getValue(
                    this.state.selectServiceData,
                    "serviceFeeDetails",
                    []
                  ).length > 0 &&
                    item.vendorTypeId != 4) ||
                  (item.vendorTypeId == 1 &&
                    item.serviceId != "" &&
                    item.serviceId != "0") ? (
                    <div className="flex-fill p-1" id="seviceHtmlserviceFeeId">
                      <label className="form-label">{serviceFeeName}</label>

                      <select
                        className="form-select form-select-sm"
                        value={item.serviceFeesId}
                        onChange={(event: any) =>
                          this.handleItineraryServiceInput(
                            key,
                            "serviceFeesId",
                            event.currentTarget.value
                          )
                        }
                      >
                        <option value="">Select {serviceFeeName}</option>
                        {ArrayHelper.getValue(
                          this.state.selectServiceData,
                          "serviceFeeDetails",
                          []
                        ).map((__tem, __key) => {
                          return (
                            <option
                              key={`serviceFeeList-${__key}`}
                              value={ArrayHelper.getValue(__tem, "id")}
                            >
                              {item.vendorTypeId != 1 ? (
                                ArrayHelper.getValue(__tem, "description")
                              ) : (
                                <span>
                                  From{" "}
                                  {formatDate(
                                    ArrayHelper.getValue(__tem, "startDate")
                                  )}{" "}
                                  To{" "}
                                  {formatDate(
                                    ArrayHelper.getValue(__tem, "endDate")
                                  )}
                                </span>
                              )}
                            </option>
                          );
                        })}
                        {item.vendorTypeId == 1 ? (
                          <option value="-1">Adoc Rate</option>
                        ) : (
                          ""
                        )}
                      </select>
                    </div>
                  ) : (
                    ""
                  )}
                  {ArrayHelper.getValue(
                    this.state.selectServiceData,
                    "serviceFeeDetails",
                    []
                  ).length > 0 &&
                  item.serviceFeesId != "" &&
                  item.serviceFeesId != "-1" &&
                  item.vendorTypeId == 1 ? (
                    <div className="flex-fill p-1">
                      <label className="form-label">Rate Type</label>

                      <select
                        className="form-select form-select-sm"
                        id={`commissionTypeld_${this.props.ItenararyKey}_${key}`}
                        name={`hotelRate`}
                        value={item.rateType}
                        onChange={(event: any) =>
                          this.handleItineraryServiceInput(
                            key,
                            "rateType",
                            event.currentTarget.value
                          )
                        }
                        aria-label=".form-select-sm example"
                      >
                        <option value="">Select Rate Type</option>
                        {this.state.hotelRateList.map(
                          (_item: any, _key: any) => {
                            return (
                              <option
                                key={`hotelRate-${_key}`}
                                value={_item.value}
                              >
                                {_item.name}
                              </option>
                            );
                          }
                        )}
                      </select>
                    </div>
                  ) : (
                    ""
                  )}

                  {item.vendorTypeId == 5 ? (
                    <div className="flex-fill p-1">
                      <label className="form-label">Origin</label>
                      <FlightCityAutoComplete
                        placeholder={"Enter Origin"}
                        value={item.origin}
                        name={`tours[${key}].origin`}
                        className="from"
                        select={(event: any) =>
                          this.handleItineraryServiceInput(key, "origin", event)
                        }
                        handleUserInput={(event: any) =>
                          this.handleItineraryServiceInput(
                            key,
                            "origin",
                            event.currentTarget.value
                          )
                        }
                        showHideLoder={(e) => this.props.showHideLoder(e)}
                        emptyState={() => {
                          // this.setState({ 'to': '' }, () => { this.setCityVal('to','') })
                        }}
                      />
                      {/* <input type="text" className="form-control form-control-sm" 
                                             id={`originld_${this.props.ItenararyKey}_${key}`}
                                             name={`tours[${key}].origin`} 
                                             value={item.origin}
                                             onChange={(event: any) => this.handleItineraryServiceInput(key, 'origin', event.currentTarget.value)}
                                            placeholder="Enter Origin"/> */}
                    </div>
                  ) : (
                    ""
                  )}
                  {item.vendorTypeId == 5 ? (
                    <div className="flex-fill p-1">
                      <label className="form-label">Destination</label>
                      <FlightCityAutoComplete
                        placeholder={"Enter Destination"}
                        value={item.destination}
                        name={`tours[${key}].destination`}
                        className="from"
                        select={(event: any) =>
                          this.handleItineraryServiceInput(
                            key,
                            "destination",
                            event
                          )
                        }
                        handleUserInput={(event: any) =>
                          this.handleItineraryServiceInput(
                            key,
                            "destination",
                            event.currentTarget.value
                          )
                        }
                        showHideLoder={(e) => this.props.showHideLoder(e)}
                        emptyState={() => {
                          // this.setState({ 'to': '' }, () => { this.setCityVal('to','') })
                        }}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  {item.vendorTypeId == 5 ? (
                    <div className="flex-fill p-1">
                      <label className="form-label">Flight No</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id={`flightNold_${this.props.ItenararyKey}_${key}`}
                        name={`tours[${key}].flightNo`}
                        value={item.flightNo}
                        onChange={(event: any) =>
                          this.handleItineraryServiceInput(
                            key,
                            "flightNo",
                            event.currentTarget.value
                          )
                        }
                        placeholder="Enter Flight No"
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  {item.vendorTypeId == 5 ? (
                    <div className="flex-fill p-1">
                      <label className="form-label">PNR</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id={`pnrd_${this.props.ItenararyKey}_${key}`}
                        name={`tours[${key}].pnr`}
                        value={item.pnr}
                        onChange={(event: any) =>
                          this.handleItineraryServiceInput(
                            key,
                            "pnr",
                            event.currentTarget.value
                          )
                        }
                        placeholder="Enter PNR"
                      />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                {ArrayHelper.getValue(
                  this.state.selectServiceData,
                  "serviceFeeDetails[0].notes"
                ) != "" ||
                ArrayHelper.getValue(
                  this.state.selectServiceData,
                  "serviceFeeDetails[0].notes"
                ) != "" ? (
                  <div className="col-md-12 mb-2 ">
                    <p className="widthFull">
                      <label className="form-label width100">
                        {/* {(item.vendorTypeId==1)?'Room':'Service'} */}
                        Notes:
                      </label>{" "}
                    </p>
                    <div className="serviceList-html message-red">
                      <div
                        className="message-red"
                        dangerouslySetInnerHTML={{
                          __html: ArrayHelper.getValue(
                            this.state.selectServiceData,
                            "notes"
                          ).replaceAll("\n", "<br/>"),
                        }}
                      />
                      {/* {(ArrayHelper.getValue(this.state.selectServiceData,'serviceFeeDetails[0].notes')!='')?<strong>Room Rates Notes</strong>:''} */}
                      <div
                        dangerouslySetInnerHTML={{
                          __html: ArrayHelper.getValue(
                            this.state.selectServiceData,
                            "serviceFeeDetails[0].notes"
                          ).replaceAll("\n", "<br/>"),
                        }}
                      />
                      {ArrayHelper.getValue(
                        this.state.selectServiceData,
                        "serviceFeeDetails[0].mandatoryLunch"
                      ) == 1 ? (
                        <strong className="message-red">
                          Lunch is mandatory
                        </strong>
                      ) : (
                        ""
                      )}
                      <br />
                      {ArrayHelper.getValue(
                        this.state.selectServiceData,
                        "serviceFeeDetails[0].mandatoryDinner"
                      ) == 1 ? (
                        <strong className="message-red">
                          Dinner is mandatory
                        </strong>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {ArrayHelper.getValue(item, "serviceList", []).length > 0 &&
                item.vendorTypeId == 4 &&
                item.vendorId != "0" ? (
                  <div className="col-md-12 mb-2 ">
                    <p className="widthFull">
                      <label className="form-label width100">
                        Service List:
                      </label>{" "}
                    </p>
                    <div className="serviceList-html">
                      {ArrayHelper.getValue(item, "serviceList", []).map(
                        (__tem, __key) => {
                          return (
                            <span
                              key={`serviceList-${__key}`}
                              className="form-label serviceListDisplay cursourPointer"
                              onClick={() => this.selectServiceList(__tem)}
                            >
                              {" "}
                              {this.state.selectedServices.filter(
                                (__it) => __it.id == __tem.id
                              ).length > 0 ? (
                                <input
                                  checked
                                  value={__tem.id}
                                  className="serviceFee"
                                  type="checkbox"
                                  name="serviceList"
                                  onClick={() => this.selectServiceList(__tem)}
                                />
                              ) : (
                                <input
                                  value={__tem.id}
                                  className="serviceFee"
                                  type="checkbox"
                                  name="serviceList"
                                  onClick={() => this.selectServiceList(__tem)}
                                />
                              )}{" "}
                              <span className="entance-vendor-txt">
                                {ArrayHelper.getValue(__tem, "name")} (
                                {ArrayHelper.getValue(
                                  __tem,
                                  "serviceFeeDetails[0].rate"
                                )}
                                )
                              </span>
                            </span>
                          );
                        }
                      )}
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {/* {(this.state.serviceFeeList.length>0)?<div className="col-md-12 mb-2">
                                              <p className="widthFull"><label className="form-label width100">Service Fee List:</label> </p>
                                                                                
                                             {this.state.serviceFeeList.map((__tem,__key)=>{
                                                return(<p key={`serviceFeeList-${__key}`}  className="form-label widthFull"><input value={__tem.id} className="serviceFee" type="radio" name="serviceFee"  onClick={() => this.handleItineraryServiceInput(key, 'serviceFeeList',__tem.id)}   /> {ArrayHelper.getValue(__tem,'description')}</p> )
                                             })}
                                        </div>:''} */}
                {item.vendorTypeId != 25 && item.vendorTypeId != 27 ? (
                  <div className="d-flex mb-4">
                    <div className="flex-fill p-1">
                      <label className="form-label">Markup Type</label>
                      <select
                        className="form-select form-select-sm"
                        id={`commissionTypeld_${this.props.ItenararyKey}_${key}`}
                        name={`tours[${key}].commissionType`}
                        value={item.commissionType}
                        onChange={(event: any) =>
                          this.handleItineraryServiceInput(
                            key,
                            "commissionType",
                            event.currentTarget.value
                          )
                        }
                        aria-label=".form-select-sm example"
                      >
                        <option value="byPercentage">By Percentage</option>
                        <option value="byAmount">By Amount</option>
                      </select>
                    </div>
                    <div className="flex-fill p-1">
                      <label className="form-label">
                        Rate{" "}
                        {ArrayHelper.getValue(
                          this.state.selectServiceData,
                          "serviceFeeDetails[0].isContractedRate"
                        ) == false &&
                        item.vendorTypeId == "1" &&
                        item.serviceFeesId != "" ? (
                          <span className="message-red">*</span>
                        ) : (
                          ""
                        )}
                      </label>
                      <input
                        maxLength={12}
                        type="text"
                        className="form-control form-control-sm"
                        id={`rateld_${this.props.ItenararyKey}_${key}`}
                        name={`tours[${key}].rate`}
                        value={item.rate}
                        onChange={(event: any) =>
                          this.handleItineraryServiceInput(
                            key,
                            "rate",
                            event.currentTarget.value
                          )
                        }
                        placeholder="Enter Rate"
                      />
                    </div>
                    <div className="flex-fill p-1">
                      <label className="form-label">Unit</label>
                      <input
                        maxLength={3}
                        type="text"
                        className="form-control form-control-sm"
                        id={`rateld_${this.props.ItenararyKey}_${key}`}
                        name={`tours[${key}].unit`}
                        value={item.unit}
                        onChange={(event: any) =>
                          this.handleItineraryServiceInput(
                            key,
                            "unit",
                            event.currentTarget.value
                          )
                        }
                        placeholder="Enter Unit"
                      />
                    </div>

                    {item.vendorTypeId == 1 ? (
                      <div className="flex-fill p-1">
                        <label className="form-label">Meal Plan</label>
                        <select
                          className="form-select form-select-sm"
                          id={`mealPlan_${this.props.ItenararyKey}_${key}`}
                          name={`tours[${key}].mealPlan`}
                          value={item.mealPlan}
                          onChange={(event: any) =>
                            this.handleItineraryServiceInput(
                              key,
                              "mealPlan",
                              event.currentTarget.value
                            )
                          }
                          aria-label=".form-select-sm example"
                        >
                          <option value="">Select Meal Plan</option>
                          {MEALPLANLIST.map((item, key) => {
                            return (
                              <option key={`mealplan-${key}`} value={item}>
                                {item}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    ) : (
                      ""
                    )}
                    {item.vendorTypeId == 1 || item.vendorTypeId == 2 ? (
                      <div className="flex-fill p-1">
                        <label className="form-label">Tax Amount </label>
                        <input
                          readOnly
                          type="number"
                          className="form-control form-control-sm"
                          id={`taxAmount_${this.props.ItenararyKey}_${key}`}
                          name={`tours[${key}].taxAmount`}
                          value={item.taxAmount}
                          onChange={(event: any) =>
                            this.handleItineraryServiceInput(
                              key,
                              "taxAmount",
                              event.currentTarget.value
                            )
                          }
                          placeholder="Enter Tax Amount"
                        />
                      </div>
                    ) : (
                      ""
                    )}

                    <div className="flex-fill p-1">
                      <label className="form-label">Cost</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        readOnly
                        id={`costld_${this.props.ItenararyKey}_${key}`}
                        name={`tours[${key}].cost`}
                        value={item.cost}
                        onChange={(event: any) =>
                          this.handleItineraryServiceInput(
                            key,
                            "cost",
                            event.currentTarget.value
                          )
                        }
                        placeholder="Enter Cost"
                      />
                    </div>
                    <div
                      className={
                        item.commissionType == "byPercentage"
                          ? "flex-fill p-1 show"
                          : "flex-fill p-1 hide"
                      }
                    >
                      <label className="form-label">Markup Percentage</label>
                      <input
                        maxLength={5}
                        type="text"
                        className="form-control form-control-sm"
                        id={`markupPercentageld_${this.props.ItenararyKey}_${key}`}
                        name={`tours[${key}].markupPercentage`}
                        value={item.markupPercentage}
                        onChange={(event: any) =>
                          this.handleItineraryServiceInput(
                            key,
                            "markupPercentage",
                            event.currentTarget.value
                          )
                        }
                        placeholder="Enter Markup Percentage"
                      />
                    </div>
                    <div
                      className={
                        item.commissionType == "byAmount"
                          ? "flex-fill p-1 show"
                          : "flex-fill p-1 hide"
                      }
                    >
                      <label className="form-label">Markup Amount</label>
                      <input
                        maxLength={10}
                        type="text"
                        className="form-control form-control-sm"
                        id={`markupAmountld_${this.props.ItenararyKey}_${key}`}
                        name={`tours[${key}].markupAmount`}
                        value={item.markupAmount}
                        onChange={(event: any) =>
                          this.handleItineraryServiceInput(
                            key,
                            "markupAmount",
                            event.currentTarget.value
                          )
                        }
                        placeholder="Enter Markup Amount"
                      />
                    </div>
                    <div className="flex-fill p-1">
                      <label className="form-label">GTI Commission</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        readOnly
                        id={`serviceGTICommissionld_${this.props.ItenararyKey}_${key}`}
                        name={`tours[${key}].serviceGTICommission`}
                        value={item.serviceGTICommission}
                        onChange={(event: any) =>
                          this.handleItineraryServiceInput(
                            key,
                            "serviceGTICommission",
                            event.currentTarget.value
                          )
                        }
                        placeholder="Enter Service GTI Commission"
                      />
                    </div>
                    <div className="flex-fill p-1">
                      <label className="form-label">GTI Gross (INR)</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        id={`serviceGrossINRld_${this.props.ItenararyKey}_${key}`}
                        readOnly
                        name={`tours[${key}].serviceGrossINR`}
                        value={item.serviceGrossINR}
                        onChange={(event: any) =>
                          this.handleItineraryServiceInput(
                            key,
                            "serviceGrossINR",
                            event.currentTarget.value
                          )
                        }
                        placeholder="Enter Service Gross INR<"
                      />
                    </div>
                    <div className="flex-fill p-1">
                      <label className="form-label">GTI GST Percentage</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        readOnly
                        id={`serviceGSTPercentageld_${this.props.ItenararyKey}_${key}`}
                        name={`tours[${key}].serviceGSTPercentage`}
                        value={item.serviceGSTPercentage}
                        onChange={(event: any) =>
                          this.handleItineraryServiceInput(
                            key,
                            "serviceGSTPercentage",
                            event.currentTarget.value
                          )
                        }
                        placeholder="Enter Service GST Percentage"
                      />
                    </div>
                    <div className="flex-fill p-1">
                      <label className="form-label">GTI Sell (INR)</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        id={`serviceSellINRld_${this.props.ItenararyKey}_${key}`}
                        readOnly
                        name={`tours[${key}].serviceSellINR`}
                        value={item.serviceSellINR}
                        onChange={(event: any) =>
                          this.handleItineraryServiceInput(
                            key,
                            "serviceSellINR",
                            event.currentTarget.value
                          )
                        }
                        placeholder="Enter Service Sell INR"
                      />
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {item.vendorTypeId != 25 && item.vendorTypeId != 27 ? (
                  <div className="d-flex mb-4">
                    <div className="flex-fill p-1">
                      <label className="form-label">GT US Markup Type</label>
                      <select
                        className="form-select form-select-sm"
                        id={`commissionTypeUSld_${this.props.ItenararyKey}_${key}`}
                        name={`tours[${key}].commissionTypeUS`}
                        value={item.commissionTypeUS}
                        onChange={(event: any) =>
                          this.handleItineraryServiceInput(
                            key,
                            "commissionTypeUS",
                            event.currentTarget.value
                          )
                        }
                        aria-label=".form-select-sm example"
                      >
                        <option value="byPercentage">By Percentage</option>
                        <option value="byAmount">By Amount</option>
                      </select>
                    </div>
                    <div className="flex-fill p-1">
                      <label className="form-label">
                        GTI Sales Amount ({this.props.currency})
                      </label>
                      <input
                        maxLength={10}
                        type="text"
                        className="form-control form-control-sm"
                        id={`serviceNetUSDld_${this.props.ItenararyKey}_${key}`}
                        name={`tours[${key}].servserviceNetUSDiceId`}
                        value={item.serviceNetUSD}
                        onChange={(event: any) =>
                          this.handleItineraryServiceInput(
                            key,
                            "serviceNetUSD",
                            event.currentTarget.value
                          )
                        }
                        placeholder="Enter Service Net USD"
                      />
                    </div>
                    <div
                      className={
                        item.commissionTypeUS == "byPercentage"
                          ? "flex-fill p-1 show"
                          : "flex-fill p-1 hide"
                      }
                    >
                      <label className="form-label">
                        GT US Markup Percentage
                      </label>
                      <input
                        maxLength={5}
                        type="text"
                        className="form-control form-control-sm"
                        id={`serviceUSDMarkupPercentageld_${this.props.ItenararyKey}_${key}`}
                        name={`tours[${key}].serviceUSDMarkupPercentage`}
                        value={item.serviceUSDMarkupPercentage}
                        onChange={(event: any) =>
                          this.handleItineraryServiceInput(
                            key,
                            "serviceUSDMarkupPercentage",
                            event.currentTarget.value
                          )
                        }
                        placeholder="Enter Service USD Markup Percentage"
                      />
                    </div>
                    <div
                      className={
                        item.commissionTypeUS == "byAmount"
                          ? "flex-fill p-1 show"
                          : "flex-fill p-1 hide"
                      }
                    >
                      <label className="form-label">
                        GT US Markup Amount ({this.props.currency})
                      </label>
                      <input
                        maxLength={10}
                        type="text"
                        className="form-control form-control-sm"
                        id={`serviceUSDMarkUpAmountld_${this.props.ItenararyKey}_${key}`}
                        name={`tours[${key}].serviceUSDMarkUpAmount`}
                        value={item.serviceUSDMarkUpAmount}
                        onChange={(event: any) =>
                          this.handleItineraryServiceInput(
                            key,
                            "serviceUSDMarkUpAmount",
                            event.currentTarget.value
                          )
                        }
                        placeholder="Enter Service USD MarkUp Amount"
                      />
                    </div>
                    <div className="flex-fill p-1">
                      <label className="form-label">
                        GT US Commission ({this.props.currency})
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        name="serviceUSDCommission"
                        value={item.serviceUSDCommission}
                        readOnly
                        onChange={(event: any) =>
                          this.handleItineraryServiceInput(
                            key,
                            "serviceUSDCommission",
                            event.currentTarget.value
                          )
                        }
                        placeholder="Enter Service USD Commission"
                      />
                    </div>
                    <div className="flex-fill p-1">
                      <label className="form-label">Credit Card Fees</label>
                      <select
                        className="form-select form-select-sm"
                        id={`creditCardFees_${this.props.ItenararyKey}_${key}`}
                        name={`tours[${key}].creditCardFees`}
                        value={item.creditCardFees}
                        onChange={(event: any) =>
                          this.handleItineraryServiceInput(
                            key,
                            "creditCardFees",
                            event.currentTarget.value
                          )
                        }
                        aria-label=".form-select-sm example"
                      >
                        {this.state.creditCardFeesList.map(
                          (__item: any, __key: any) => {
                            return (
                              <option
                                value={__item}
                                key={`creditCard-${__key}`}
                              >
                                {__item.toFixed(1)}
                              </option>
                            );
                          }
                        )}
                      </select>
                    </div>
                    <div className="flex-fill p-1">
                      <label className="form-label">
                        GT US Payable Amount Exclude Tax ({this.props.currency})
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        id={`serviceUSDClientDollarld_${this.props.ItenararyKey}_${key}`}
                        readOnly
                        name={`tours[${key}].serviceUSDClientDollar`}
                        value={item.serviceUSDClientDollar}
                        onChange={(event: any) =>
                          this.handleItineraryServiceInput(
                            key,
                            "serviceUSDClientDollar",
                            event.currentTarget.value
                          )
                        }
                        placeholder="Enter Service US DClient Dollar"
                      />
                    </div>
                    <div className="flex-fill p-1">
                      <label className="form-label">Quote Type</label>
                      <select
                        className="form-select form-select-sm"
                        id={`quoteTypeld_${this.props.ItenararyKey}_${key}`}
                        name={`tours[${key}].quoteType`}
                        value={item.quoteType}
                        onChange={(event: any) =>
                          this.handleItineraryServiceInput(
                            key,
                            "quoteType",
                            event.currentTarget.value
                          )
                        }
                        aria-label=".form-select-sm example"
                      >
                        <option value="">Select Quote Type</option>
                        {this.props.quoteTypeList.map((item, key) => {
                          return (
                            <option
                              key={`quoteTypeList-${key}`}
                              value={ArrayHelper.getValue(item, "id")}
                            >
                              {ArrayHelper.getValue(item, "name")}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="flex-fill p-1">
                      <label className="form-label">Show On Itinerary</label>
                      <br />
                      {item.isShowOnItinerary == true ? (
                        <input
                          className=""
                          type="radio"
                          checked
                          name={`tours[${key}].isShowOnItinerary`}
                          value={item.isShowOnItinerary}
                          onChange={(event: any) =>
                            this.handleItineraryServiceInput(
                              key,
                              "isShowOnItinerary",
                              "Yes"
                            )
                          }
                        />
                      ) : (
                        <input
                          className=""
                          type="radio"
                          name={`tours[${key}].isShowOnItinerary`}
                          value={item.isShowOnItinerary}
                          onChange={(event: any) =>
                            this.handleItineraryServiceInput(
                              key,
                              "isShowOnItinerary",
                              "Yes"
                            )
                          }
                        />
                      )}{" "}
                      Yes &nbsp; &nbsp;{" "}
                      {item.isShowOnItinerary == false ? (
                        <input
                          type="radio"
                          checked
                          name={`tours[${key}].isShowOnItinerary`}
                          value={item.isShowOnItinerary}
                          onChange={(event: any) =>
                            this.handleItineraryServiceInput(
                              key,
                              "isShowOnItinerary",
                              "No"
                            )
                          }
                        />
                      ) : (
                        <input
                          type="radio"
                          name={`tours[${key}].isShowOnItinerary`}
                          value={item.isShowOnItinerary}
                          onChange={(event: any) =>
                            this.handleItineraryServiceInput(
                              key,
                              "isShowOnItinerary",
                              "No"
                            )
                          }
                        />
                      )}{" "}
                      No
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {item.vendorTypeId != 25 && item.vendorTypeId != 27 ? (
                  <div className="d-flex mb-4">
                    <div className="flex-fill p-1 maxWwidth200">
                      <label className="form-label">
                        Agent Commission Type
                      </label>
                      <select
                        className="form-select form-select-sm"
                        id={`agentCommissionTypeld_${this.props.ItenararyKey}_${key}`}
                        name={`tours[${key}].agentCommissionType`}
                        value={item.agentCommissionType}
                        onChange={(event: any) =>
                          this.handleItineraryServiceInput(
                            key,
                            "agentCommissionType",
                            event.currentTarget.value
                          )
                        }
                        aria-label=".form-select-sm example"
                      >
                        <option value="">Select Commission Type</option>
                        <option value="byPercentage">By Percentage</option>
                        <option value="byAmount">By Amount</option>
                      </select>
                    </div>
                    <div
                      className={
                        item.agentCommissionType == "byPercentage"
                          ? "flex-fill p-1 show maxWwidth200"
                          : "flex-fill p-1 hide maxWwidth200"
                      }
                    >
                      <label className="form-label">
                        Commission Percentage ({this.props.currency})
                      </label>
                      <input
                        maxLength={5}
                        type="text"
                        className="form-control form-control-sm"
                        id={`agentCommissionByPercentageld_${this.props.ItenararyKey}_${key}`}
                        name={`tours[${key}].agentCommissionByPercentage`}
                        value={item.agentCommissionByPercentage}
                        onChange={(event: any) =>
                          this.handleItineraryServiceInput(
                            key,
                            "agentCommissionByPercentage",
                            event.currentTarget.value
                          )
                        }
                        placeholder="Enter Commission Percentage"
                      />
                    </div>
                    <div className="flex-fill p-1 maxWwidth200">
                      <label className="form-label">
                        Commission Value ({this.props.currency})
                      </label>
                      {item.agentCommissionType == "byPercentage" ? (
                        <input
                          readOnly
                          maxLength={10}
                          type="text"
                          className="form-control form-control-sm"
                          id={`agentCommissionValueld_${this.props.ItenararyKey}_${key}`}
                          name={`tours[${key}].agentCommissionValue`}
                          value={item.agentCommissionValue}
                          onChange={(event: any) =>
                            this.handleItineraryServiceInput(
                              key,
                              "agentCommissionValue",
                              event.currentTarget.value
                            )
                          }
                          placeholder="Enter Commission Value"
                        />
                      ) : (
                        <input
                          maxLength={10}
                          type="text"
                          className="form-control form-control-sm"
                          id={`agentCommissionValueld_${this.props.ItenararyKey}_${key}`}
                          name={`tours[${key}].agentCommissionValue`}
                          value={item.agentCommissionValue}
                          onChange={(event: any) =>
                            this.handleItineraryServiceInput(
                              key,
                              "agentCommissionValue",
                              event.currentTarget.value
                            )
                          }
                          placeholder="Enter Commission Value"
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <div className="d-flex">
                  <div className="flex-fill p-1">
                    <label className="form-label">
                      {item.vendorTypeId != 25 && item.vendorTypeId != 27
                        ? "Descriptions"
                        : "Remarks"}
                    </label>
                    <textarea
                      type="text"
                      className="form-control form-control-sm"
                      name="description"
                      value={item.description}
                      onChange={(event: any) =>
                        this.handleItineraryServiceInput(
                          key,
                          "description",
                          event.currentTarget.value
                        )
                      }
                      placeholder={
                        item.vendorTypeId != 25 && item.vendorTypeId != 27
                          ? "Enter Description"
                          : "Enter Remarks"
                      }
                    />
                  </div>
                </div>
                <div className="d-flex mb-4">
                  <div className="flex-fill p-1 maxWwidth100">
                    {this.props.loader == false ? (
                      <button
                        onClick={() => this.submitItinerarySerice()}
                        type="button"
                        className="btn btn-sm btn-primary rounded mt-4"
                      >
                        {item.id == 0 &&
                        this.props.isImportItinerary == false ? (
                          <i className="fa-solid fa-plus"></i>
                        ) : (
                          ""
                        )}
                        {item.id != 0 ? "Update" : "Add"}{" "}
                      </button>
                    ) : (
                      <button
                        disabled
                        type="button"
                        className="btn btn-sm btn-primary rounded mt-4"
                      >
                        {item.id == 0 ? (
                          <i className="fa-solid fa-plus"></i>
                        ) : (
                          ""
                        )}
                        {item.id != 0 ? "Update" : "Add"}{" "}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {tourItineraryService.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped rounded border mb-0">
                <tbody>
                  <tr>
                    {/* <th>Heading</th> */}
                    {this.state.displayType == "byCost" ? (
                      <th>Start Date Time</th>
                    ) : (
                      <th>Date</th>
                    )}
                    {this.state.displayType == "byCost" ? (
                      <th>End Date Time</th>
                    ) : (
                      ""
                    )}
                    {this.state.displayType == "byCost" ? (
                      <th>Vendor Type</th>
                    ) : (
                      ""
                    )}
                    {this.state.displayType == "byCost" ? <th>Vendor</th> : ""}
                    <th>City</th>
                    {this.state.displayType == "byCost" ? (
                      <th>No. of Guest</th>
                    ) : (
                      ""
                    )}
                    {this.state.displayType == "byCost" ? (
                      <th className="maxWwidth100">Service</th>
                    ) : (
                      ""
                    )}
                    {this.state.displayType == "byCost" ? <th>Cost</th> : ""}
                    {this.state.displayType == "byCost" ? (
                      <th>GT US Sell (INR)</th>
                    ) : (
                      ""
                    )}
                    {this.state.displayType == "byCost" ? (
                      <th>GT US Payable Amount</th>
                    ) : (
                      ""
                    )}
                    {this.state.displayType == "byCost" ? (
                      <th>Agent Commission Amount</th>
                    ) : (
                      ""
                    )}
                    {this.state.displayType == "byCost" ? (
                      <th>Quote Type</th>
                    ) : (
                      <th>Remarks</th>
                    )}
                    <th className="maxWwidth100">Action</th>
                  </tr>
                  {tourItineraryService.map((item, key) => {
                    let serviceIdArray = ArrayHelper.getValue(
                      item,
                      "serviceId"
                    ).split(",");
                    let serviceName = "";
                    for (let z = 0; z < serviceIdArray.length; z++) {
                      if (z > 0) {
                        serviceName = serviceName + "  ,  ";
                      }

                      serviceName =
                        serviceName +
                        ArrayHelper.getValue(
                          this.props.serviceList.filter(
                            (_it) => _it.id == serviceIdArray[z]
                          ),
                          "[0].name"
                        );
                    }

                    return (
                      <tr
                        key={`tourItineraryServiceList-${key}`}
                        className={
                          this.state.selectedKey == key &&
                          this.state.actionType == "edit"
                            ? "backgroundtr"
                            : ""
                        }
                      >
                        {/* <td>{ArrayHelper.getValue(item,'serviceDescription')}</td> */}
                        {this.state.displayType == "byCost" ? (
                          <td>
                            {ArrayHelper.getValue(item, "startDate") != "" &&
                            ArrayHelper.getValue(item, "startDate") !=
                              "1900-01-01T00:00:00"
                              ? formatDate(item.startDate, DISPLAYDATEFORMATE)
                              : ""}
                          </td>
                        ) : (
                          <td>
                            {ArrayHelper.getValue(item, "startDate") != "" &&
                            ArrayHelper.getValue(item, "startDate") !=
                              "1900-01-01T00:00:00"
                              ? formatDate(item.startDate, "EEEE, dd MMM yyyy")
                              : ""}
                          </td>
                        )}
                        {this.state.displayType == "byCost" ? (
                          <td>
                            {ArrayHelper.getValue(item, "endDate") != "" &&
                            ArrayHelper.getValue(item, "endDate") !=
                              "1900-01-01T00:00:00"
                              ? formatDate(item.endDate, DISPLAYDATEFORMATE)
                              : ""}
                          </td>
                        ) : (
                          ""
                        )}
                        {this.state.displayType == "byCost" ? (
                          <td>
                            {" "}
                            {ArrayHelper.getValue(item, "vendorTypeName")}
                          </td>
                        ) : (
                          ""
                        )}
                        {this.state.displayType == "byCost" ? (
                          <td>{ArrayHelper.getValue(item, "vendorName")}</td>
                        ) : (
                          ""
                        )}
                        <td>{ArrayHelper.getValue(item, "cityName")}</td>
                        {this.state.displayType == "byCost" ? (
                          <td>
                            {ArrayHelper.getValue(item, "vendorTypeId") == "1"
                              ? ArrayHelper.getValue(item, "noofGuest")
                              : this.props.noofGuest}
                          </td>
                        ) : (
                          ""
                        )}
                        {this.state.displayType == "byCost" ? (
                          <td className="maxWwidth100">{serviceName}</td>
                        ) : (
                          ""
                        )}
                        {this.state.displayType == "byCost" ? (
                          <td>{ArrayHelper.getValue(item, "cost")}</td>
                        ) : (
                          ""
                        )}
                        {this.state.displayType == "byCost" ? (
                          <td>
                            {ArrayHelper.getValue(item, "serviceSellINR")}
                          </td>
                        ) : (
                          ""
                        )}
                        {this.state.displayType == "byCost" ? (
                          <td>
                            {ArrayHelper.getValue(
                              item,
                              "serviceUSDClientDollar"
                            )}
                          </td>
                        ) : (
                          ""
                        )}
                        {this.state.displayType == "byCost" ? (
                          <td>
                            {ArrayHelper.getValue(item, "agentCommissionValue")}
                          </td>
                        ) : (
                          ""
                        )}
                        {this.state.displayType == "byCost" ? (
                          <td>{ArrayHelper.getValue(item, "quoteTypeName")}</td>
                        ) : (
                          <td>{ArrayHelper.getValue(item, "description")}</td>
                        )}
                        <td>
                          {" "}
                          <i
                            onClick={() => this.EditItenarySercice(item, key)}
                            className="fa fa-edit btn text-primary"
                            title="Edit"
                          ></i>{" "}
                          <i
                            className="fa fa-trash btn text-danger"
                            onClick={() =>
                              this.props.deleteItinerarySerice(key, item.id)
                            }
                            title="Remove"
                          ></i>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            ""
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default TourItineraryServiceFieldComponent;
