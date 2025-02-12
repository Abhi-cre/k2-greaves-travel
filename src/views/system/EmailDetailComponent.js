import React from "react";
import { formatDate } from "../../vendor/datefns";
import { ArrayHelper } from "../../helpers/arrayhelper";
var parse = require("html-react-parser");
class EmailDetailComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  dateValue(dd) {
    let dateval = new Date(dd);
    dateval = new Date(dateval);
    let startTime = dateval.getTime();
    let datevalcurrent = new Date();
    datevalcurrent = new Date(datevalcurrent);
    let currentTime = datevalcurrent.getTime();
    let timeDiffrent = (currentTime - startTime) / 3600000;
    if (timeDiffrent < 24) {
      return "Today";
    } else if (timeDiffrent < 48) {
      return "Yesterday";
    } else {
      return formatDate(dd, "MMM dd, yyyy");
    }
  }
  downloadFile(e) {
    let filedata = "data:" + e.ContentType + ";base64," + e.ContentBytes;

    const link = document.createElement("a");
    link.href = filedata;
    link.setAttribute("download", e.Name);

    // Append to html link element page
    document.body.appendChild(link);

    // Start download
    link.click();

    // Clean up and remove the link
    link.parentNode.removeChild(link);
  }

  render() {
    return (
      <React.Fragment>
        <div className="content-right">
          <div
            className={`email-details card ${
              ArrayHelper.getValue(this.props.mailDetail, "mailData.id") == ""
                ? "hideClass"
                : ""
            }`}
          >
            <div className="emailReply d-flex justify-content-end">
              <div className="backIcon">
                <a href="#">
                  <i className="fa-solid fa-left-long"></i> &nbsp; Back to Email
                </a>
              </div>
              {ArrayHelper.getValue(this.props.tourRecordData, "tourName") ==
              "" ? (
                <a
                  onClick={() => this.props.ReplyMails("assignToToure")}
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  data-bs-title="Reply"
                  title="Assign To Tour"
                >
                  <img src="/images/assign-tour.png" height="20" />
                </a>
              ) : (
                ""
              )}
              <a
                onClick={() => this.props.ReplyMails("single")}
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                data-bs-title="Reply"
                title="Reply"
              >
                <i className="fa-solid fa-reply"></i>
              </a>
              <a
                onClick={() => this.props.ReplyMails("all")}
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                data-bs-title="Reply to All"
                title="Reply to All"
              >
                <i className="fa-solid fa-reply-all"></i>
              </a>
              <a
                onClick={() => this.props.ReplyMails("forward")}
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                data-bs-title="Forward"
                title="Forward"
              >
                <i className="fa-sharp fa-solid fa-share"></i>
              </a>

              <a
                onClick={() =>
                  this.props.deleteMails(
                    ArrayHelper.getValue(this.props.mailDetail, "mailData.id")
                  )
                }
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                data-bs-title="Delete"
                title="Delete"
              >
                <i className="fa-solid fa-trash"></i>
              </a>
              {this.props.emailKey > 0 ? (
                <a
                  onClick={() =>
                    this.props.nextPrevEmail(
                      parseInt(this.props.emailKey) - 1,
                      ArrayHelper.getValue(this.props.mailDetail, "colorClass")
                    )
                  }
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  data-bs-title="Prev"
                  title="Prev"
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </a>
              ) : (
                <a
                  className="cusourseFalse"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  data-bs-title="Prev"
                  title="Prev"
                >
                  <i className="fa-solid fa-chevron-left disableColor"></i>
                </a>
              )}
              {this.props.numberOfEmail > this.props.emailKey ? (
                <a
                  onClick={() =>
                    this.props.nextPrevEmail(
                      parseInt(this.props.emailKey) + 1,
                      ArrayHelper.getValue(this.props.mailDetail, "colorClass")
                    )
                  }
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  data-bs-title="Next"
                  title="Next"
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </a>
              ) : (
                <a
                  className="cusourseFalse"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  data-bs-title="Next"
                  title="Next"
                >
                  <i className="fa-solid fa-chevron-right disableColor"></i>
                </a>
              )}
            </div>
            <div className="media-list">
              <div className="accordion" id="accordionPanelsStayOpenExample">
                <div className="accordion-item">
                  <h2
                    className="accordion-header"
                    id="panelsStayOpen-headingOne"
                  >
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseOne"
                      aria-expanded="true"
                      aria-controls="panelsStayOpen-collapseOne"
                    >
                      <div className="media-left pr-1">
                        <span className="avatar avatar-md">
                          <span
                            className={`media-object rounded-circle text-circle ${ArrayHelper.getValue(
                              this.props.mailDetail,
                              "colorClass"
                            )}`}
                          >
                            {ArrayHelper.getValue(
                              this.props.mailDetail,
                              "mailData.from.emailAddress.name"
                            ).substring(0, 1)}
                          </span>
                        </span>
                      </div>
                      <div className="media-body w-100">
                        <h6 className="list-group-item-heading text-bold-500">
                          {ArrayHelper.getValue(
                            this.props.mailDetail,
                            "mailData.from.emailAddress.name"
                          )}

                          <span className="float-right">
                            <span className="font-small-2 primary me-3">
                              {ArrayHelper.getValue(
                                this.props.mailDetail,
                                "mailData.receivedDateTime"
                              ) != ""
                                ? this.dateValue(
                                    ArrayHelper.getValue(
                                      this.props.mailDetail,
                                      "mailData.receivedDateTime"
                                    )
                                  )
                                : ""}
                            </span>
                            <span className="font-small-2 primary">
                              {ArrayHelper.getValue(
                                this.props.mailDetail,
                                "mailData.receivedDateTime"
                              ) != ""
                                ? formatDate(
                                    ArrayHelper.getValue(
                                      this.props.mailDetail,
                                      "mailData.receivedDateTime"
                                    ),
                                    "hh:mm a"
                                  )
                                : ""}
                            </span>
                            <br />
                            <span
                              className={`font-small-2 catg-labal  float-right ${ArrayHelper.getValue(
                                this.props.mailDetail,
                                "colorClass"
                              )}`}
                            >
                              {ArrayHelper.getValue(
                                this.props.mailDetail,
                                "displayName"
                              )}
                            </span>
                          </span>
                        </h6>
                        <p className="list-group-item-text text-truncate mb-1">
                          {ArrayHelper.getValue(
                            this.props.mailDetail,
                            "mailData.subject"
                          )}
                        </p>
                        {ArrayHelper.getValue(
                          this.props.tourRecordData,
                          "tourName"
                        ) != "" ? (
                          <p className="list-group-item-text text-truncate mb-1">
                            <strong>Tour Info :</strong>{" "}
                            {ArrayHelper.getValue(
                              this.props.tourRecordData,
                              "tourRecordId"
                            )}{" "}
                            -{" "}
                            {ArrayHelper.getValue(
                              this.props.tourRecordData,
                              "tourName"
                            )}
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                    </button>
                  </h2>
                  <div
                    id="panelsStayOpen-collapseOne"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-headingOne"
                  >
                    <div className="accordion-body">
                      <div className="media-body w-100">
                        <p className="list-group-item-text text-truncate mb-0 fs-small">
                          <span className="fs">From</span>{" "}
                          {ArrayHelper.getValue(
                            this.props.mailDetail,
                            "mailData.from.emailAddress.name"
                          )}
                        </p>
                        {ArrayHelper.getValue(
                          this.props.mailDetail,
                          "mailData.toRecipients"
                        ).length > 0 ? (
                          <p className="list-group-item-text text-truncate mb-0 fs-small">
                            <span className="fs">To</span>{" "}
                            {ArrayHelper.getValue(
                              this.props.mailDetail,
                              "mailData.toRecipients"
                            ).map((item, key) => {
                              if (key > 0) {
                                return (
                                  <span key={`to-${key}`}>
                                    ,{" "}
                                    {ArrayHelper.getValue(
                                      item,
                                      "emailAddress.address"
                                    )}
                                  </span>
                                );
                              } else {
                                return (
                                  <span key={`to-${key}`}>
                                    {" "}
                                    {ArrayHelper.getValue(
                                      item,
                                      "emailAddress.address"
                                    )}
                                  </span>
                                );
                              }
                            })}
                          </p>
                        ) : (
                          ""
                        )}
                        {ArrayHelper.getValue(
                          this.props.mailDetail,
                          "mailData.ccRecipients"
                        ).length > 0 ? (
                          <p className="list-group-item-text text-truncate mb-0 fs-small">
                            <span className="fs">CC</span>{" "}
                            {ArrayHelper.getValue(
                              this.props.mailDetail,
                              "mailData.ccRecipients"
                            ).map((item, key) => {
                              if (key > 0) {
                                return (
                                  <span key={`cc-${key}`}>
                                    ,{" "}
                                    {ArrayHelper.getValue(
                                      item,
                                      "emailAddress.address"
                                    )}
                                  </span>
                                );
                              } else {
                                return (
                                  <span key={`cc-${key}`}>
                                    {" "}
                                    {ArrayHelper.getValue(
                                      item,
                                      "emailAddress.address"
                                    )}
                                  </span>
                                );
                              }
                            })}
                          </p>
                        ) : (
                          ""
                        )}

                        {ArrayHelper.getValue(
                          this.props.mailDetail,
                          "mailData.bccRecipients"
                        ).length > 0 ? (
                          <p className="list-group-item-text text-truncate mb-0 fs-small">
                            <span className="fs">BCC</span>{" "}
                            {ArrayHelper.getValue(
                              this.props.mailDetail,
                              "mailData.bccRecipients"
                            ).map((item, key) => {
                              if (key > 0) {
                                return (
                                  <span key={`bcc-${key}`}>
                                    ,{" "}
                                    {ArrayHelper.getValue(
                                      item,
                                      "emailAddress.address"
                                    )}
                                  </span>
                                );
                              } else {
                                return (
                                  <span key={`bcc-${key}`}>
                                    {" "}
                                    {ArrayHelper.getValue(
                                      item,
                                      "emailAddress.address"
                                    )}
                                  </span>
                                );
                              }
                            })}
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                      <div
                        className="list-group-item-text mb-0 fs"
                        dangerouslySetInnerHTML={{
                          __html: ArrayHelper.getValue(
                            this.props.mailDetail,
                            "mailData.body.content"
                          ),
                        }}
                      />

                      {ArrayHelper.getValue(
                        this.props.mailDetail,
                        "mailData.hasAttachments"
                      ) == true ? (
                        <div className="list-group-item-text mb-0 mt-2 fs text-blue">
                          <span>
                            <i className="fa-paperclip fa"></i>{" "}
                            {
                              ArrayHelper.getValue(
                                this.props.mailDetail,
                                "mailData.attechmentLists"
                              ).length
                            }{" "}
                            Attachments{" "}
                          </span>
                          {ArrayHelper.getValue(
                            this.props.mailDetail,
                            "mailData.attechmentLists"
                          ).map((item, _key) => {
                            let fileType = "fa-solid fa-file ms-4";
                            if (
                              ArrayHelper.getValue(item, "ContentType") ==
                              "image/pdf"
                            ) {
                              fileType = "fa-solid fa-file-pdf  ms-4";
                            } else if (
                              ArrayHelper.getValue(item, "ContentType") ==
                                "image/png" ||
                              ArrayHelper.getValue(item, "ContentType") ==
                                "image/jpg" ||
                              ArrayHelper.getValue(item, "ContentType") ==
                                "image/gif" ||
                              ArrayHelper.getValue(item, "ContentType") ==
                                "image/jpeg"
                            ) {
                              fileType = "fa-regular fa-image ms-4";
                            }
                            return (
                              <span
                                className="attachmentList"
                                key={`attachement-${_key}`}
                              >
                                <a onClick={() => this.downloadFile(item)}>
                                  <i className={fileType}></i>{" "}
                                  {ArrayHelper.getValue(item, "Name")}
                                </a>
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
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

export default EmailDetailComponent;
