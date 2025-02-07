import React from "react";
import LoaderComponent from "../../../components/LoaderComponent";
import OutLookApi from "../../../api/Outlook.api";
import { Editor, EditorTools } from "@progress/kendo-react-editor";
import "@progress/kendo-theme-default/dist/all.css";
import { ArrayHelper } from "../../../helpers/arrayhelper";
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
class VendorMailComposeComponent extends React.Component {
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
    };
  }
  handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    console.log("sssssssss", name, value);
    if (name == "toEmail" || name == "ccEmail" || name == "bccEmail") {
      value = value.replaceAll(" ", ";");
      value = value.replaceAll(";;", ";");
      value = value.replace(/[&\/\\#,+()!$~%.'":*?<>{}^]/g, "");
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
      let ToRecipients = this.props.vendorList.filter(
        (item) => item.id == this.state.toEmail
      )[0].email;
      let VendorId = this.props.vendorList.filter(
        (item) => item.id == this.state.toEmail
      )[0].id;
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
      subject =
        subject +
        " /" +
        ArrayHelper.getValue(this.props.toursData, "tourRecordId") +
        "/[ref: VEF" +
        VendorId +
        "]";
      let emailExtraContent =
        '<p style="color:#ffffff">___K2GTBT___' +
        ArrayHelper.getValue(this.props.toursData, "tourRecordId") +
        "___K2GTBT___" +
        ArrayHelper.getValue(this.props.toursData, "tourName") +
        "___K2GTBT___" +
        ArrayHelper.getValue(this.props.toursData, "id") +
        "___K2GTBT___" +
        VendorId +
        "___K2GTBT___</p>";

      let mailData = {
        Subject: subject,
        BodyContent: emailContent + emailExtraContent,
        ToRecipients: [ToRecipients],
        CcRecipients: CcRecipients,
        BccRecipients: BccRecipients,
        Importance: this.props.ImportanceType,
      };
      let response = await OutLookApi.SendMail(mailData);

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
      }
    }
  };
  render() {
    return (
      <React.Fragment>
        <LoaderComponent loader={this.state.loader} />
        <div
          className={`border-box ${
            this.props.selectedTab != "vendorMailCompose" ? "hide" : ""
          }`}
        >
          <h2 className="pb-3">Internal Mail Compose</h2>
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
          <div className="email-details1 card1">
            <div className="mail-compose">
              <div className="form-group bordered-left-4 bordered-themeprimary">
                {/* <select
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
                </select> */}
                <label for="to">To:</label>
                <input
                  name="toEmail"
                  value={this.state.toEmail}
                  className="form-control"
                  onChange={this.handleChange}
                  tabIndex="1"
                ></input>

                {/* <div className="field-options">
                                    {(this.state.displayCcEmail==false)?<a  onClick={()=>this.displayBox('ccEmail')}>CC</a>:''}
                                    {(this.state.displayBccEmail==false)?<a  onClick={()=>this.displayBox('bccEmail')}>BCC</a>:''}
                                </div> */}
              </div>
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
      </React.Fragment>
    );
  }
}

export default VendorMailComposeComponent;
