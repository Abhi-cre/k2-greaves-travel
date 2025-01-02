import React from 'react';
import * as XLSX from 'xlsx';

class ExcelDownloadButton extends React.Component {
  downloadExcel = () => {
    const { data, columns, fileName, sheetName } = this.props;


    if (!data || data.length === 0) {
      alert("No data available to export!");
      return;
    }


    const columnsArray = [];
    const formattedData = data.map((item, index) => {
                        
      const formattedRow = {
        
        SrNo: index + 1, 
      
      };

     
      columns.forEach((column) => {
        formattedRow[column] = item[column] || ''; 
      });

      Object.keys(formattedRow).forEach((key) => {
        if (!columnsArray.includes(key)) {
          columnsArray.push(key);
        }
      });

      return formattedRow;
    });

    const finalData = formattedData.filter((row) => {
      return columnsArray.some((column) => row[column] !== undefined && row[column] !== null && row[column] !== '');
    });

    if (finalData.length === 0) {
      alert("No valid data available to export!");
      return;
    }

    const columnWidths = columnsArray.map((column) => {
      let maxLength = column.length;
      finalData.forEach((row) => {
        const cellValue = row[column] ? row[column].toString() : '';
        maxLength = Math.max(maxLength, cellValue.length);
      });
      return { wpx: Math.max(maxLength * 10, 60) }; 
    });


    const ws = XLSX.utils.json_to_sheet(finalData, { header: columnsArray });
    ws['!cols'] = columnWidths; 
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    XLSX.writeFile(wb, fileName);
  };

  render() {
    return (
      <button onClick={this.downloadExcel} type="button" className="btn btn-outlined ms-1">
        <i className="fa-sharp fa-solid fa-download"></i> Download Excel
      </button>
    );
  }
}

export default ExcelDownloadButton;
