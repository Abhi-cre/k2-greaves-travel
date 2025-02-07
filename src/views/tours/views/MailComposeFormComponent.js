import React from "react";
import LoaderComponent from "../../../components/LoaderComponent";
import OutLookApi from "../../../api/Outlook.api";
import { Editor, EditorTools } from "@progress/kendo-react-editor";
import "@progress/kendo-theme-default/dist/all.css";
import { ArrayHelper } from "../../../helpers/arrayhelper";
declare var $;
const {
  FindAndReplace,
  Pdf,
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
  Undo,
  Redo,
  Link,
  Unlink,
} = EditorTools;
const CustomPdf = (props) => (
  <Pdf
    {...props}
    savePdfOptions={{
      fileName: "React Rich Text Editor",
      paperSize: "A4",
      marign: "3cm",
    }}
  />
);
class MailComposeFormComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      toEmail: "",
      ccEmail: "",
      bccEmail: "",
      subject: "",
      displayCcEmail: false,
      displayBccEmail: false,
      messageType: "",
      emailContent: "",
      message: "",
      tourRecordData: {},
    };
  }
  handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    if (name == "toEmail" || name == "ccEmail" || name == "bccEmail") {
      value = value.replaceAll(" ", ";");
      value = value.replaceAll(";;", ";");
      value = value.replace(/[&\/\\#,+()!$~%'":*?<>{}^]/g, "");
    }
    this.setState({ ...this.state, [name]: value });
  };
  handleChangeEditor = (e) => {
    this.setState({ emailContent: e.html });
  };
  displayBox(str) {
    if (str == "ccEmail") {
      this.setState({ displayCcEmail: true });
      setTimeout(() => {
        this.ccEmailInput.focus();
      }, 10);
    } else if (str == "bccEmail") {
      this.setState({ displayBccEmail: true });
      setTimeout(() => {
        this.bccEmailInput.focus();
      }, 10);
    }
  }
  submitMailCompose = async () => {
    let error = "";

    if (this.state.toEmail == "") {
      alert("Please select the vendor.");
      error = "yes";
    }
    if (this.state.subject == "" && error == "") {
      alert("Please Enter the subject");
      error = "yes";
    }
    if (this.state.emailContent == "" && error == "") {
      alert("Please Enter the email content");
      error = "yes";
    }
    if (error == "") {
      let ToRecipients = "";

      let CcRecipients =
        this.state.ccEmail.trim() != ""
          ? this.state.ccEmail.trim().split(";")
          : [];
      let BccRecipients =
        this.state.bccEmail.trim() != ""
          ? this.state.bccEmail.trim().split(";")
          : [];

      this.setState({ loader: true });
      let emailContent = this.state.emailContent;
      let subject = this.state.subject;
      let emailExtraContent = "";
      if (this.props.mailType == "Compose") {
        ToRecipients = this.props.vendorList.filter(
          (item) => item.id == this.state.toEmail
        )[0].email;
        let VendorId = this.props.vendorList.filter(
          (item) => item.id == this.state.toEmail
        )[0].id;
        subject =
          subject +
          " /" +
          ArrayHelper.getValue(this.props.toursData, "tourRecordId") +
          "/[ref: VEF" +
          VendorId +
          "]";
        emailExtraContent =
          '<p style="color:#ffffff">___K2GTBT___' +
          ArrayHelper.getValue(this.props.toursData, "tourRecordId") +
          "___K2GTBT___" +
          ArrayHelper.getValue(this.props.toursData, "tourName") +
          "___K2GTBT___" +
          ArrayHelper.getValue(this.props.toursData, "id") +
          "___K2GTBT___" +
          VendorId +
          "___K2GTBT___</p>";
      } else {
        let vendorTypeEmail = this.state.subject.split("/[ref: VEF");
        if (vendorTypeEmail.length < 2) {
          subject = this.state.subject.replace(
            " /" + ArrayHelper.getValue(this.props.toursData, "id"),
            ""
          );
          subject = this.state.subject.replace(
            "/[ref: TEF" +
              ArrayHelper.getValue(this.props.toursData, "id") +
              "]",
            ""
          );
          emailExtraContent =
            '<p style="color:#ffffff">___K2GTBT___' +
            ArrayHelper.getValue(this.props.toursData, "tourRecordId") +
            "___K2GTBT___" +
            ArrayHelper.getValue(this.props.toursData, "tourName") +
            "___K2GTBT___" +
            ArrayHelper.getValue(this.props.toursData, "id") +
            "___K2GTBT___" +
            ArrayHelper.getValue(this.state.tourRecordData, "vendorId") +
            "___</p>";
          subject =
            subject +
            " /" +
            ArrayHelper.getValue(this.props.toursData, "tourRecordId") +
            "/[ref: TEF" +
            ArrayHelper.getValue(this.props.toursData, "id") +
            "]";
        } else {
          subject = this.state.subjectreplace(
            " /" +
              ArrayHelper.getValue(this.state.tourRecordData, "tourRecordId"),
            ""
          );
          subject = this.state.subject.replace(
            "/[ref: VEF" +
              ArrayHelper.getValue(this.state.tourRecordData, "vendorId") +
              "]",
            ""
          );
          emailExtraContent =
            '<p style="color:#ffffff">___K2GTBT___' +
            ArrayHelper.getValue(this.props.toursData, "tourRecordId") +
            "___K2GTBT___" +
            ArrayHelper.getValue(this.props.toursData, "tourName") +
            "___K2GTBT___" +
            ArrayHelper.getValue(this.props.toursData, "id") +
            "___K2GTBT___" +
            ArrayHelper.getValue(this.state.tourRecordData, "vendorId") +
            "___</p>";
          subject =
            subject +
            " /" +
            ArrayHelper.getValue(this.props.toursData, "tourRecordId") +
            "/[ref: VEF" +
            ArrayHelper.getValue(this.state.tourRecordData, "vendorId") +
            "]";
        }

        ToRecipients =
          this.state.toEmail.trim() != ""
            ? this.state.toEmail.trim().split(";")
            : [];
      }
      let response = "";
      let mailData = {};

      if (this.props.mailType == "Compose") {
        mailData = {
          Subject: subject,
          BodyContent: emailContent + emailExtraContent,
          ToRecipients: [ToRecipients],
          CcRecipients: CcRecipients,
          BccRecipients: BccRecipients,
          Importance: this.props.ImportanceType,
        };
        response = await OutLookApi.SendMail(mailData);
      } else if (this.props.mailType == "Reply") {
        mailData = {
          Comment: emailContent + emailExtraContent,
          ToRecipients: ToRecipients,
          Subject: subject,
          CcRecipients: CcRecipients,
          BccRecipients: BccRecipients,
          Id: ArrayHelper.getValue(
            this.props.selectedMailLogContent,
            "messageId"
          ),
        };
        response = await OutLookApi.Reply(mailData);
      } else if (this.props.mailType == "Forward") {
        mailData = {
          Comment: emailContent + emailExtraContent,
          ToRecipients: ToRecipients,
          Subject: subject,
          CcRecipients: CcRecipients,
          BccRecipients: BccRecipients,
          Id: ArrayHelper.getValue(
            this.props.selectedMailLogContent,
            "messageId"
          ),
        };
        response = await OutLookApi.ForwardMail(mailData);
      } else if (this.props.mailType == "Reply All") {
        mailData = {
          Comments: emailContent + emailExtraContent,
          Subject: subject,
          CcRecipients: CcRecipients,
          BccRecipients: BccRecipients,
          Id: ArrayHelper.getValue(
            this.props.selectedMailLogContent,
            "messageId"
          ),
        };
        response = await OutLookApi.ReplyAll(mailData);
      }

      if (
        ArrayHelper.getValue(response, "IsSuccess") == true ||
        ArrayHelper.getValue(response, "IsSuccess") == false
      ) {
        this.setState({
          loader: false,
          toEmail: "",
          ccEmail: "",
          bccEmail: "",
          subject: "",
          displayCcEmail: false,
          displayBccEmail: false,
          emailContent: "",
          messageType: "success",
          message: "Mail has been sent successfully.",
        });
        $("#mailBody" + this.props.displayType).scrollTop(0);

        setTimeout(() => {
          this.setState({ message: "" });
          $(".close").click();
        }, 1000);
      }
    }
  };
  componentWillReceiveProps() {
    setTimeout(() => {
      let mailDetail = ArrayHelper.getValue(
        this.props.selectedMailLogContent,
        "bodyContent"
      ).split("___K2GTBT___");
      this.setState({ displayCcEmail: false, displayBccEmail: false });
      if (mailDetail.length > 2) {
        this.setState({ tourRecordData: { vendorId: mailDetail[4] } });
      }
      if (this.props.mailType == "Compose") {
        this.setState({ toEmail: "", subject: "" });
      } else if (this.props.mailType == "Reply") {
        this.setState({
          toEmail: ArrayHelper.getValue(
            this.props.selectedMailLogContent,
            "senderEmail"
          ),
          subject: ArrayHelper.getValue(
            this.props.selectedMailLogContent,
            "subject"
          ),
        });
      } else if (this.props.mailType == "Reply All") {
        this.setState({
          toEmail: ArrayHelper.getValue(
            this.props.selectedMailLogContent,
            "senderEmail"
          ),
          ccEmail: ArrayHelper.getValue(
            this.props.selectedMailLogContent,
            "ccRecipientsEmail"
          ),
          bccEmail: ArrayHelper.getValue(
            this.props.selectedMailLogContent,
            "bccRecipientsEmail"
          ),
          subject: ArrayHelper.getValue(
            this.props.selectedMailLogContent,
            "subject"
          ),
        });
      } else if (this.props.mailType == "Forward") {
        this.setState({
          toEmail: "",
          ccEmail: "",
          bccEmail: "",
          subject: ArrayHelper.getValue(
            this.props.selectedMailLogContent,
            "subject"
          ),
        });
      }
    });
  }
  render() {
    return (
      <React.Fragment>
        <div
          className="modal fade"
          id={`selectedMailComposeForm${this.props.displayType}`}
          data-bs-keyboard="false"
          data-bs-backdrop="static"
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title" id="exampleModalLabel">
                  {this.props.mailType == "Compose"
                    ? "Compose Email"
                    : ArrayHelper.getValue(
                        this.props.selectedMailLogContent,
                        "subject"
                      )}
                </h3>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div
                className="modal-body"
                id={`mailBody${this.props.displayType}`}
              >
                <LoaderComponent loader={this.state.loader} />
                <div className="mail-compose">
                  {this.state.message != "" ? (
                    <p
                      className={` updateMessage ${
                        this.state.messageType == "success"
                          ? "message-green"
                          : "message-red"
                      }`}
                    >
                      {this.state.message}
                    </p>
                  ) : (
                    ""
                  )}
                  {this.props.mailType == "Compose" ? (
                    <div className="form-group bordered-left-4 bordered-themeprimary">
                      {this.props.vendorList.length > 0 ? (
                        <select
                          name="toEmail"
                          value={this.state.toEmail}
                          className="form-control"
                          onChange={this.handleChange}
                          tabIndex="1"
                        >
                          <option value="">Select Vendor</option>
                          {this.props.vendorList.map((item: any, key: any) => {
                            return (
                              <option
                                key={`vendorList-${key}`}
                                value={ArrayHelper.getValue(item, "id")}
                              >
                                {ArrayHelper.getValue(item, "vendorName")}
                              </option>
                            );
                          })}
                        </select>
                      ) : (
                        ""
                      )}

                      {/* <div className="field-options">
                                        {(this.state.displayCcEmail==false)?<a  onClick={()=>this.displayBox('ccEmail')}>CC</a>:''}
                                        {(this.state.displayBccEmail==false)?<a  onClick={()=>this.displayBox('bccEmail')}>BCC</a>:''}
                                    </div> */}
                    </div>
                  ) : (
                    <div className="form-group bordered-left-4 bordered-themeprimary">
                      <label htmlFor="to">To:</label>
                      {this.props.mailType == "Forward" ? (
                        <input
                          required
                          name="toEmail"
                          onChange={this.handleChange}
                          value={this.state.toEmail}
                          type="text"
                          className="form-control"
                          id="to"
                          tabIndex="1"
                        />
                      ) : (
                        <input
                          readOnly
                          name="toEmail"
                          onChange={this.handleChange}
                          value={this.state.toEmail}
                          type="text"
                          className="form-control"
                          id="to"
                          tabIndex="1"
                        />
                      )}
                      <div className="field-options">
                        {this.state.displayCcEmail == false ? (
                          <a onClick={() => this.displayBox("ccEmail")}>CC</a>
                        ) : (
                          ""
                        )}
                        {this.state.displayBccEmail == false ? (
                          <a onClick={() => this.displayBox("bccEmail")}>BCC</a>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  )}
                  {this.state.displayCcEmail == true ? (
                    <div className="form-group hidden bordered-left-4 bordered-themethirdcolor">
                      <label htmlFor="cc">CC:</label>
                      <input
                        ref={(input) => {
                          this.ccEmailInput = input;
                        }}
                        type="text"
                        name="ccEmail"
                        onChange={this.handleChange}
                        value={this.state.ccEmail}
                        className="form-control"
                        id="cc"
                        tabIndex="2"
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  {this.state.displayBccEmail == true ? (
                    <div className="form-group hidden bordered-left-4 bordered-themefourthcolor">
                      <label htmlFor="bcc">BCC:</label>
                      <input
                        ref={(input) => {
                          this.bccEmailInput = input;
                        }}
                        type="text"
                        name="bccEmail"
                        onChange={this.handleChange}
                        value={this.state.bccEmail}
                        className="form-control"
                        id="bcc"
                        tabIndex="2"
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  {this.props.mailType == "Compose" ? (
                    <div className="form-group bordered-left-4 bordered-themesecondary">
                      <label htmlFor="subject">Subject:</label>
                      <input
                        type="text"
                        onChange={this.handleChange}
                        name="subject"
                        value={this.state.subject}
                        className="form-control"
                        id="subject"
                        tabIndex="1"
                      />
                    </div>
                  ) : (
                    <div className="form-group bordered-left-4 bordered-themesecondary">
                      <label htmlFor="subject">Subject:</label>
                      <input
                        readOnly
                        type="text"
                        onChange={this.handleChange}
                        name="subject"
                        value={this.state.subject}
                        className="form-control"
                        id="subject"
                        tabIndex="1"
                      />
                    </div>
                  )}
                  <div className="appEditor">
                    <Editor
                      value={this.state.emailContent}
                      tools={[
                        [Bold, Italic, Underline],
                        [Undo, Redo],
                        [Link, Unlink],
                        [AlignLeft, AlignCenter, AlignRight],
                        [OrderedList, UnorderedList, Indent, Outdent],
                        [FindAndReplace, Pdf],
                      ]}
                      name="emailContent"
                      onChange={this.handleChangeEditor}
                    />
                  </div>

                  <div className="d-flex mailSend">
                    <button
                      onClick={() => this.submitMailCompose()}
                      type="button"
                      className="btn btn-primary me-2"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default MailComposeFormComponent;
