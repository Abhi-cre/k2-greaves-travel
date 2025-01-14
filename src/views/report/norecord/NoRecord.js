import React, { useState, useEffect } from "react";
import SettingApi from "../../../api/Setting.api";
import PaginationComponent from "../../../components/PaginationComponent";
import { useLocation, useNavigate } from "react-router-dom";
import ExcelDownloadButton from "../../../components/ExcelDownloadButton";
import * as XLSX from "xlsx";

const ActionTypeComponent = () => {
  const [tourData, setTourData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(8);
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const page = parseInt(queryParams.get("page")) || 1;
    setCurrentPage(page);
  }, [location]);

  const indexOfLastItem = currentPage * perPage;
  const indexOfFirstItem = indexOfLastItem - perPage;
  const currentData = tourData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    navigate(`?page=${pageNumber}`);
  };

  useEffect(() => {
    const getActionTypeList = async () => {
      try {
        const response = await SettingApi.GetSettingList(
          "/api/TourRecord/TourRecordNoItinerary"
        );

        if (response.isSuccess) {
          setTourData(response.tourWithoutItineraryModels);
        } else {
          console.error("No data found or error occurred.");
        }
      } catch (error) {
        console.error("Error fetching tour data:", error);
      } finally {
        setLoader(false);
      }
    };
    getActionTypeList();
  }, []);

  const reloadWindow = () => {
    window.location.reload();
  };

  const exportToExcel = () => {
    const formattedData = tourData.map((tour, index) => ({
      "Sr.No": index + 1,
      "Tour Name": tour.tourName,
      "Tour Record ID": tour.tourRecordId,
      "Client Status": tour.clientStatusName,
      "Greaves Status": tour.greavesStatusName,
      "Created By": tour.createdBy,
      "Created On": new Date(tour.createdOn).toLocaleDateString(),
      "Start Date": new Date(tour.startDate).toLocaleDateString(),
      "GTIN Consultant": tour.gtinConsultantName,
      "GTUS Consultant": tour.gtusConsultantName,
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData);

    const columnWidths = [];
    const columns = Object.keys(formattedData[0]);

    columns.forEach((col, index) => {
      let maxLength = col.length;
      formattedData.forEach((row) => {
        const cellValue = row[col] ? row[col].toString() : "";
        maxLength = Math.max(maxLength, cellValue.length);
      });

      columnWidths.push({ wpx: Math.min(maxLength * 10, 300) });
    });
    ws["!cols"] = columnWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tour Records");

    XLSX.writeFile(wb, "TourRecordNoItinerary.xlsx");
  };

  return (
    <>
      <div
        className="tab-pane fade show active"
        id="AgentType-tab-pane"
        role="tabpanel"
        aria-labelledby="AgentType-tab"
        tabIndex="0"
      >
        <div className="p-4">
          <div className="row mb-3">
            <div className="col-md-2">
              <br />
              <h5 className="">Tour Record Without Itinerary</h5>
            </div>
            <div className="col-md-10 text-end">
              <br />
              <div className="d-flex align-items-center justify-content-end">
                <a onClick={() => reloadWindow()}>
                  <img
                    style={{ height: "20px", marginRight: "20px" }}
                    src="/images/reload.png"
                    alt="Reload"
                  />
                </a>

                <div>
                  <img
                    style={{ height: "25px", width: "25px", cursor: "pointer" }}
                    src="/images/downloadExcel.png"
                    alt="Download Excel"
                    onClick={exportToExcel}
                  />
                </div>
              </div>
            </div>
            <div className="borderless-box">
              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Sr.No</th>
                      <th>Tour Name</th>
                      <th>Tour Record ID</th>
                      <th>Client Status</th>
                      <th>Greaves Status</th>
                      <th>Created By</th>
                      <th>Created On</th>
                      <th>Start Date</th>
                      <th>GTIN Consultant</th>
                      <th>GTUS Consultant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((tour, index) => (
                      <tr key={tour.id}>
                        <td>{index + 1 + (currentPage - 1) * perPage}</td>
                        <td>{tour.tourName}</td>
                        <td>{tour.tourRecordId}</td>
                        <td>{tour.clientStatusName}</td>
                        <td>{tour.greavesStatusName}</td>
                        <td>{tour.createdBy}</td>
                        <td>{new Date(tour.createdOn).toLocaleDateString()}</td>
                        <td>
                          {new Date(tour.startDate).toLocaleDateString()}
                        </td>{" "}
                        {/* Format date */}
                        <td>{tour.gtinConsultantName}</td>
                        <td>{tour.gtusConsultantName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        {tourData.length > perPage && (
          <PaginationComponent
            total={tourData.length}
            pageSize={perPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
};

export default ActionTypeComponent;
