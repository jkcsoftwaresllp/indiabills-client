import { useEffect, useState } from "react";
import { Card, CardContent, IconButton, Chip } from "@mui/material";
import { FiX } from "react-icons/fi";
import { socket } from "../../network/websocket";
import { useAuth } from "../../hooks/useAuth";
import "./NotificationPanel.css";

const NotificationPanel = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleNewAnnouncement = (announcement) => {
      // Show announcement notification based on user's role/location
      if (announcement.location === "shop") {
        // All customers should see shop announcements
        if (user.role === "customer" || user.role === "user") {
          addNotification({
            id: announcement.announcementId,
            title: announcement.title,
            message: announcement.message,
            type: "announcement",
            location: announcement.location,
            expiryDate: announcement.expiryDate,
          });
        }
      } else if (announcement.location === "channel") {
        // Only admins/managers should see channel announcements
        if (user.role === "admin" || user.role === "manager") {
          addNotification({
            id: announcement.announcementId,
            title: announcement.title,
            message: announcement.message,
            type: "announcement",
            location: announcement.location,
            expiryDate: announcement.expiryDate,
          });
        }
      }
    };

    const handleNewNote = (note) => {
      // Show note notification if targeted to user's role or user ID
      let shouldShow = false;

      if (note.targetRoles && Array.isArray(note.targetRoles) && note.targetRoles.includes(user.role)) {
        shouldShow = true;
      }

      if (note.targetUsers && Array.isArray(note.targetUsers) && note.targetUsers.includes(user.id)) {
        shouldShow = true;
      }

      if (shouldShow) {
        addNotification({
          id: note.notesId || Math.random(),
          title: note.title,
          message: note.message,
          type: "note",
          targetRoles: note.targetRoles,
          targetUsers: note.targetUsers,
        });
      }
    };

    socket.on("newAnnouncement", handleNewAnnouncement);
    socket.on("newNote", handleNewNote);

    return () => {
      socket.off("newAnnouncement", handleNewAnnouncement);
      socket.off("newNote", handleNewNote);
    };
  }, [user]);

  const addNotification = (notification) => {
    setNotifications((prev) => [...prev, notification]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  return (
    <div className="notification-panel">
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className="notification-card"
          sx={{
            position: "relative",
            backgroundColor:
              notification.type === "announcement" ? "#fff3cd" : "#d4edff",
            border:
              notification.type === "announcement"
                ? "1px solid #ffc107"
                : "1px solid #0288d1",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            animation: "slideIn 0.3s ease-out",
          }}
        >
          <CardContent sx={{ pb: 1 }}>
            <div className="notification-header">
              <div>
                <h4 className="notification-title">{notification.title}</h4>
                {notification.location && (
                  <Chip
                    label={
                      notification.location === "shop"
                        ? "🏪 Shop"
                        : "💬 Channel"
                    }
                    size="small"
                    sx={{
                      backgroundColor:
                        notification.location === "shop"
                          ? "rgba(196, 32, 50, 0.1)"
                          : "rgba(30, 41, 56, 0.1)",
                      color:
                        notification.location === "shop"
                          ? "#c42032"
                          : "#1e2938",
                      fontWeight: 600,
                      marginRight: 1,
                      marginTop: 0.5,
                    }}
                  />
                )}
              </div>
              <IconButton
                size="small"
                onClick={() => removeNotification(notification.id)}
                sx={{
                  color:
                    notification.type === "announcement"
                      ? "#ff9800"
                      : "#0288d1",
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.05)",
                  },
                }}
              >
                <FiX />
              </IconButton>
            </div>
            <p className="notification-message">{notification.message}</p>
            {notification.expiryDate && (
              <p className="notification-meta">
                ⏰ Expires on:{" "}
                <span className="font-semibold">
                  {new Date(notification.expiryDate).toLocaleDateString()}
                </span>
              </p>
            )}
          </CardContent>
        </Card>
      ))}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationPanel;
