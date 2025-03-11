import React, { useEffect, useState } from 'react';

const DutyTimings = ({ staffData }) => {
  const [shiftDetails, setShiftDetails] = useState(null);

  // Extract staffId from staffData
  const staffId = staffData?.staffId;

  useEffect(() => {
    const fetchShiftDetails = async () => {
      if (!staffId) {
        console.error("Staff ID is missing.");
        return;
      }

      try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(`http://localhost:5000/api/staff/staff/${staffId}/shift`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched Shift Details:", data);
          setShiftDetails(data.shiftDetails);
        } else {
          console.error("Failed to fetch shift details");
        }
      } catch (error) {
        console.error("Error fetching shift details:", error);
      }
    };

    fetchShiftDetails();
  }, [staffId]);

  return (
    <div className="duty-section">
      <h2 className="section-title">
        <i className='bx bx-time-five'></i> Duty Timings
      </h2>
      <div className="duty-info">
        {shiftDetails ? (
          <div className="shift-card">
            <div className="shift-header">
              <i className='bx bx-calendar-check'></i>
              <h3>Current Shift</h3>
            </div>
            <div className="shift-details">
              <p><i className='bx bx-time'></i> Shift Timings: {shiftDetails.dutyTimings.start} - {shiftDetails.dutyTimings.end}</p>
              <p className="timing">
                Work Days: {shiftDetails.workDays.startDay} - {shiftDetails.workDays.endDay}
              </p>
            </div>
          </div>
        ) : (
          <p>Loading shift details...</p>
        )}
      </div>
    </div>
  );
};

export default DutyTimings;
