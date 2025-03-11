import React, { useState } from "react";

const Notifications = ({ handleDeleteNotification }) => {
  // Sample static notifications for display purposes
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "New appointment scheduled",
      timestamp: "2025-03-01 10:30 AM",
    },
    {
      id: 2,
      message: "Leave request approved",
      timestamp: "2025-03-01 02:45 PM",
    },
  ]);

  return (
    <div className="notifications-section">
      <h2 className="section-title">
        <i className="bx bx-bell"></i> Notifications
      </h2>
      <div className="notifications-list">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div key={notification.id} className="notification-card">
              <div className="notification-content">
                <i className="bx bx-info-circle"></i>
                <div className="notification-details">
                  <p>{notification.message}</p>
                  <span className="notification-time">{notification.timestamp}</span>
                </div>
              </div>
              <button
                className="delete-notification-btn"
                onClick={() => handleDeleteNotification(notification.id)}
              >
                <i className="bx bx-trash"></i>
              </button>
            </div>
          ))
        ) : (
          <div className="no-notifications">
            <i className="bx bx-bell-off"></i>
            <p>No notifications available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
