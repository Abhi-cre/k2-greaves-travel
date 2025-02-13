import React from "react";
import { USER_ID } from "../../helpers/constants";
import { ArrayHelper } from "../../helpers/arrayhelper";
import SettingApi from "../../api/Setting.api";
import LoaderComponent from "../../components/LoaderComponent";
import DropdownList from "react-widgets/DropdownList";

class AssignToToureComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tourRecordId: "", loader: false };
  }
  handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    this.setState({ ...this.state, [name]: value });
  };

  submitRecord = async (event: any) => {
    event.preventDefault();

    this.setState({ loader: true });
    let data = {
      requestedUserId: parseInt(localStorage.getItem(USER_ID)),
      tourRecordId: parseInt(this.state.tourRecordId),
      outlookMessageId: ArrayHelper.getValue(
        this.props.mailDetail,
        "mailData.id"
      ),
    };

    let response = await SettingApi.PostSettingList(
      data,
      "/api/TourRecord/UpdateMessageId"
    );
    if (ArrayHelper.getValue(response, "isSuccess") == true) {
      this.setState({ loader: false });
      this.props.getTourRecordData(
        ArrayHelper.getValue(this.props.mailDetail, "mailData.id")
      );
      this.props.showRightSide();
      let categories = "";
      let recipientsName = "";
      let recipientsEmail = "";
      let ccRecipientsName = "";
      let ccRecipientsEmail = "";
      let bccRecipientsName = "";
      let bccRecipientsEmail = "";
      let replyName = "";
      let replyEmail = "";
      if (
        ArrayHelper.getValue(this.props.mailDetail, "mailData.categories", [])
          .length > 0
      ) {
        ArrayHelper.getValue(
          this.props.mailDetail,
          "mailData.categories",
          []
        ).map((item: any, key: number) => {
          if (key > 0) {
            categories = categories + ";";
          }
          categories = categories + item;
        });
      }
      if (
        ArrayHelper.getValue(this.props.mailDetail, "mailData.toRecipients", [])
          .length > 0
      ) {
        ArrayHelper.getValue(
          this.props.mailDetail,
          "mailData.toRecipients",
          []
        ).map((item: any, key: number) => {
          if (key > 0) {
            recipientsName = recipientsName + ";";
            recipientsEmail = recipientsEmail + ";";
          }
          recipientsName =
            recipientsName + ArrayHelper.getValue(item, "emailAddress.name");
          recipientsEmail =
            recipientsName + ArrayHelper.getValue(item, "emailAddress.address");
        });
      }
      if (
        ArrayHelper.getValue(this.props.mailDetail, "mailData.ccRecipients", [])
          .length > 0
      ) {
        ArrayHelper.getValue(
          this.props.mailDetail,
          "mailData.ccRecipients",
          []
        ).map((item: any, key: number) => {
          if (key > 0) {
            ccRecipientsName = ccRecipientsName + ";";
            ccRecipientsEmail = ccRecipientsEmail + ";";
          }
          recipientsName =
            recipientsName + ArrayHelper.getValue(item, "emailAddress.name");
          ccRecipientsEmail =
            ccRecipientsEmail +
            ArrayHelper.getValue(item, "emailAddress.address");
        });
      }
      if (
        ArrayHelper.getValue(
          this.props.mailDetail,
          "mailData.bccRecipients",
          []
        ).length > 0
      ) {
        ArrayHelper.getValue(
          this.props.mailDetail,
          "mailData.bccRecipients",
          []
        ).map((item: any, key: number) => {
          if (key > 0) {
            bccRecipientsName = bccRecipientsName + ";";
            bccRecipientsEmail = bccRecipientsEmail + ";";
          }
          bccRecipientsName =
            bccRecipientsName + ArrayHelper.getValue(item, "emailAddress.name");
          bccRecipientsEmail =
            bccRecipientsEmail +
            ArrayHelper.getValue(item, "emailAddress.address");
        });
      }
      if (
        ArrayHelper.getValue(this.props.mailDetail, "mailData.replyTo", [])
          .length > 0
      ) {
        ArrayHelper.getValue(this.props.mailDetail, "mailData.replyTo", []).map(
          (item: any, key: number) => {
            if (key > 0) {
              replyName = replyName + ";";
              replyEmail = replyEmail + ";";
            }
            replyName =
              replyName + ArrayHelper.getValue(item, "emailAddress.name");
            replyEmail =
              replyEmail + ArrayHelper.getValue(item, "emailAddress.address");
          }
        );
      }
      let mailLogData = {
        requestedUserId: parseInt(localStorage.getItem(USER_ID)),
        mailLog: {
          id: 0,
          tourRecordId: parseInt(this.state.tourRecordId),
          messageId: ArrayHelper.getValue(this.props.mailDetail, "mailData.id"),
          odataContext: ArrayHelper.getValue(
            this.props.mailDetail,
            "mailData.OdataContext"
          ),
          odataEtag: ArrayHelper.getValue(
            this.props.mailDetail,
            "mailData.odataEtag"
          ),
          createdDateTime: ArrayHelper.getValue(
            this.props.mailDetail,
            "mailData.createdDateTime"
          ),
          lastModifiedDateTime: ArrayHelper.getValue(
            this.props.mailDetail,
            "mailData.lastModifiedDateTime"
          ),
          changeKey: ArrayHelper.getValue(
            this.props.mailDetail,
            "mailData.changeKey"
          ),
          categories: categories,
          receivedDateTime: ArrayHelper.getValue(
            this.props.mailDetail,
            "mailData.receivedDateTime"
          ),
          sentDateTime: ArrayHelper.getValue(
            this.props.mailDetail,
            "mailData.sentDateTime"
          ),
          hasAttachments: ArrayHelper.getValue(
            this.props.mailDetail,
            "mailData.hasAttachments"
          ),
          internetMessageId: ArrayHelper.getValue(
            this.props.mailDetail,
            "mailData.internetMessageId"
          ),
          subject: ArrayHelper.getValue(
            this.props.mailDetail,
            "mailData.subject"
          ),
          bodyPreview: ArrayHelper.getValue(
            this.props.mailDetail,
            "mailData.bodyPreview"
          ),
          importance: ArrayHelper.getValue(
            this.props.mailDetail,
            "mailData.importance"
          ),
          parentFolderId: ArrayHelper.getValue(
            this.props.mailDetail,
            "mailData.parentFolderId"
          ),
          conversationId: ArrayHelper.getValue(
            this.props.mailDetail,
            "mailData.conversationId"
          ),
          isDeliveryReceiptRequested: ArrayHelper.getValue(
            this.props.mailDetail,
            "mailData.isDeliveryReceiptRequested"
          ),
          isReadReceiptRequested:
            ArrayHelper.getValue(
              this.props.mailDetail,
              "mailData.isReadReceiptRequested"
            ) == "" ||
            ArrayHelper.getValue(
              this.props.mailDetail,
              "mailData.isReadReceiptRequested"
            ) == false
              ? false
              : true,
          isRead: ArrayHelper.getValue(
            this.props.mailDetail,
            "mailData.isRead"
          ),
          isDraft: ArrayHelper.getValue(
            this.props.mailDetail,
            "mailData.isDraft"
          ),
          webLink: ArrayHelper.getValue(
            this.props.mailDetail,
            "mailData.webLink"
          ),
          inferenceClassification: ArrayHelper.getValue(
            this.props.mailDetail,
            "mailData.inferenceClassification"
          ),
          bodyContentType: ArrayHelper.getValue(
            this.props.mailDetail,
            "mailData.body.contentType"
          ),
          bodyContent: ArrayHelper.getValue(
            this.props.mailDetail,
            "mailData.body.content"
          ),
          senderName: ArrayHelper.getValue(
            this.props.mailDetail,
            "mailData.sender.emailAddress.name"
          ),
          senderEmail: ArrayHelper.getValue(
            this.props.mailDetail,
            "mailData.sender.emailAddress.address"
          ),
          fromName: ArrayHelper.getValue(
            this.props.mailDetail,
            "mailData.from.emailAddress.name"
          ),
          fromEmail: ArrayHelper.getValue(
            this.props.mailDetail,
            "mailData.from.emailAddress.address"
          ),
          recipientsName: recipientsName,
          recipientsEmail: recipientsEmail,
          ccRecipientsName: ccRecipientsName,
          ccRecipientsEmail: ccRecipientsEmail,
          bccRecipientsName: bccRecipientsName,
          bccRecipientsEmail: bccRecipientsEmail,
          replyName: replyName,
          replyEmail: replyEmail,
          flagStatus: ArrayHelper.getValue(
            this.props.mailDetail,
            "mailData.flag.flagStatus"
          ),
        },
      };

      SettingApi.PostSettingList(mailLogData, "/api/MailLog/Add");
    }
  };
  render() {
    return (
      <React.Fragment>
        <LoaderComponent loader={this.state.loader} />
        <div className={`content-right show `}>
          <div className="email-details card">
            <form method="post" role="form" onSubmit={this.submitRecord}>
              <h6>Assign to Tour</h6>
              <div className="mail-compose">
                <div className="form-group bordered-left-4 bordered-themeprimary">
                  <label htmlFor="to">Subject:</label>

                  <input
                    readOnly
                    name="toEmail"
                    value={ArrayHelper.getValue(
                      this.props.mailDetail,
                      "mailData.subject"
                    )}
                    type="text"
                    className="form-control"
                    id="to"
                    tabIndex="1"
                  />
                </div>

                <div className="form-group bordered-left-4 bordered-themesecondary">
                  {/* <select
                    required
                    name="tourRecordId"
                    value={this.state.tourRecordId}
                    className="form-control"
                    onChange={this.handleChange}
                    tabIndex="1"
                  >
                    <option value="">Select Tour</option>
                    {this.props.tourRecordList.map((item: any, key: any) => {
                      return (
                        <option key={`tourRecord-${key}`} value={item.id}>
                          {ArrayHelper.getValue(item, "tourName")}
                        </option>
                      );
                    })}
                  </select> */}
                  <label className="form-label"> Select Tour</label>
                  <DropdownList
                    filter
                    data={this.props.tourRecordList}
                    placeholder=""
                    onChange={(event: any) =>
                      this.handleChange({
                        target: { name: "tourRecordId", value: event.id },
                      })
                    }
                    defaultValue={this.state.tourRecordId}
                    dataKey="id"
                    textField={(item: any) =>
                      ArrayHelper.getValue(item, "tourName")
                    }
                  />
                </div>

                <div className="d-flex mailSend">
                  <button type="submit" className="btn btn-primary me-2">
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default AssignToToureComponent;
