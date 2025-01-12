import React from "react";
import * as XLSX from "xlsx";

class ExcelDownloadButton extends React.Component {
  downloadExcel = () => {
    const { data, columns, fileName, sheetName } = this.props;

    // Check if data and columns are valid
    if (!data || data.length === 0) {
      alert("No data available to export!");
      return;
    }

    if (!columns || columns.length === 0) {
      alert("No columns provided for export!");
      return;
    }

    const columnsArray = [];
    const formattedData = data.map((item, index) => {
      const formattedRow = {
        SrNo: index + 1,
      };

      columns.forEach((column) => {
        if (column === "name") {
          formattedRow["Name"] = item[column] || "";
        } else if (column === "code") {
          formattedRow["Code"] = item[column] || "";
        } else if (column === "stateName") {
          formattedRow["State Name"] = item[column] || "";
        } else if (column === "countryName") {
          formattedRow["Country Name"] = item[column] || "";
        } else if (column === "cityName") {
          formattedRow["City Name"] = item[column] || "";
        } else if (column === "primaryContactNo") {
          formattedRow["Primary Contact No"] = item[column] || "";
        } else if (column === "vendorName") {
          formattedRow["Vendor Name"] = item[column] || "";
        } else if (column === "vendorTypeName") {
          formattedRow["Vendor Type"] = item[column] || "";
        } else if (column === "email") {
          formattedRow["Email"] = item[column] || "";
        } else if (column === "zip") {
          formattedRow["Zip"] = item[column] || "";
        } else if (column === "address") {
          formattedRow["Address"] = item[column] || "";
        } else if (column === "agnecyTypeName") {
          formattedRow["Agency Type"] = item[column] || "";
        } else if (column === "greavesOfficeName") {
          formattedRow["Greaves Office"] = item[column] || "";
        } else if (column === "salesRegionName") {
          formattedRow["Sales Region"] = item[column] || "";
        } else if (column === "fulllName") {
          formattedRow["Full Name"] = item[column] || "";
        } else if (column === "agencyName") {
          formattedRow["Agency Name"] = item[column] || ""; //
        } else if (column === "agentTypeName") {
          formattedRow["Agent Type"] = item[column] || "";
        } else if (column === "agentContactChannelName") {
          formattedRow["Agent Contact Channel Name"] = item[column] || "";
        } else if (column === "courtesyTitle") {
          formattedRow["Courtesy Title"] = item[column] || "";
        } else if (column === "contactNo") {
          formattedRow["Contact No"] = item[column] || "";
        } else if (column === "dob") {
          formattedRow["DOB"] = item[column] || "";
        } else if (column === "specialties") {
          formattedRow["Specialties"] = item[column] || "";
        } else if (column === "salesCategoryName") {
          formattedRow["Sales Category Name"] = item[column] || "";
        } else if (column === "position") {
          formattedRow["Position"] = item[column] || "";
        } else if (column === "webReference") {
          formattedRow["Web Reference"] = item[column] || "";
        } else if (column === "city") {
          formattedRow["City"] = item[column] || "";
        } else if (column === "state") {
          formattedRow["State"] = item[column] || "";
        } else if (column === "region") {
          formattedRow["Region"] = item[column] || "";
        } else {
          formattedRow[column] = item[column] || "";
        }
      });

      Object.keys(formattedRow).forEach((key) => {
        if (!columnsArray.includes(key)) {
          columnsArray.push(key);
        }
      });

      return formattedRow;
    });

    const finalData = formattedData.filter((row) => {
      return columnsArray.some(
        (column) =>
          row[column] !== undefined &&
          row[column] !== null &&
          row[column] !== ""
      );
    });

    if (finalData.length === 0) {
      alert("No valid data available to export!");
      return;
    }

    const columnWidths = columnsArray.map((column) => {
      let maxLength = column.length;
      finalData.forEach((row) => {
        const cellValue = row[column] ? row[column].toString() : "";
        maxLength = Math.max(maxLength, cellValue.length);
      });
      return { wpx: Math.max(maxLength * 5, 40) };
    });

    // Create worksheet and workbook
    const ws = XLSX.utils.json_to_sheet(finalData, { header: columnsArray });
    ws["!cols"] = columnWidths; // Set column widths
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Write file
    XLSX.writeFile(wb, fileName);
  };

  render() {
    return (
      <div>
        <img
          style={{ height: "30px", width: "30px", cursor: "pointer" }}
          src="/images/downloadExcel.png"
          alt="Download Excel"
          onClick={this.downloadExcel}
        />
      </div>
    );
  }
}

export default ExcelDownloadButton;
