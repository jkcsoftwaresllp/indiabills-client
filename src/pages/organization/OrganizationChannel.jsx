import { useState, useEffect } from "react";
import { getUsersByRole } from "../../network/api/userApi";
import { getAnnouncements, createAnnouncement, getNotes, createNote } from "../../network/api/channelApi";
import { useStore } from "../../store/store";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Avatar,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import { FiPlus, FiX } from "react-icons/fi";
import { socket } from "../../network/websocket";
import { useAuth } from "../../hooks/useAuth";
import PageAnimate from "../../components/Animate/PageAnimate";
import { getBaseURL } from "../../network/api/api-config";

const OrganizationChannel = () => {
  const { user } = useAuth();

  const [newAnnouncement, setNewAnnouncement] = useState({
    id: 0,
    title: "",
    message: "",
    expiryDate: "",
    createdAt: "",
    location: "shop", // Default value
  });
  const [announcements, setAnnouncements] = useState([]);
  const [notes, setNotes] = useState([]);
  const [target, setTarget] = useState("role");
  const [openDialog, setOpenDialog] = useState(false);
  const [newItemType, setNewItemType] = useState("announcement");
  const [newNote, setNewNote] = useState({
    id: 0,
    title: "",
    message: "",
    roles: [],
    users: [],
    createdAt: "",
  });
  const roles = ["admin", "manager", "operator", "customer"];
  const [users, setUsers] = useState([]);

  const { successPopup, errorPopup } = useStore();

  const { currentOrganization } = useStore();

  useEffect(() => {
    fetchAnnouncements();
    fetchNotes();
    fetchUsers();

    const handleNewAnnouncement = (announcement) => {
      setAnnouncements((prev) => [...prev, { ...announcement }]);
    };

    const handleNewNote = (note) => {
      setNotes((prev) => [...prev, { ...note }]);
    };

    socket.on("newAnnouncement", handleNewAnnouncement);
    socket.on("newNote", handleNewNote);

    return () => {
      socket.off("newAnnouncement", handleNewAnnouncement);
      socket.off("newNote", handleNewNote);
    };
  }, [currentOrganization]);

  const fetchAnnouncements = async () => {
    try {
      // Fetch all announcements
      const response = await getAnnouncements();
      if (response.status === 200) {
        setAnnouncements(response.data);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  const fetchShopAnnouncements = async () => {
    try {
      const data = await getData("/channel/announcements/shop");
      return data;
    } catch (error) {
      console.error("Error fetching shop announcements:", error);
      return [];
    }
  };

  const fetchChannelAnnouncements = async () => {
    try {
      const data = await getData("/channel/announcements/channel");
      return data;
    } catch (error) {
      console.error("Error fetching channel announcements:", error);
      return [];
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await getNotes();
      if (response.status === 200) {
        setNotes(response.data);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      // Fetch all users by collecting from all roles
      const roles = ["admin", "manager", "operator", "customer", "delivery"];
      const allUsers = [];

      for (const role of roles) {
        const response = await getUsersByRole(role);
        if (response.status === 200 && Array.isArray(response.data)) {
          // Add role to each user
          const usersWithRole = response.data.map((user) => ({
            ...user,
            role: role,
          }));
          allUsers.push(...usersWithRole);
        }
      }

      setUsers(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  const handleCreateAnnouncement = async () => {
    try {
      const response = await createAnnouncement(newAnnouncement);
      if (response.status === 201) {
        successPopup("Announcement created!");
        setOpenDialog(false);
        setNewAnnouncement({
          id: 0,
          title: "",
          message: "",
          expiryDate: "",
          createdAt: "",
          location: "shop",
        });
        fetchAnnouncements();
      } else {
        errorPopup("Error creating announcement");
      }
    } catch (error) {
      console.error("Error creating announcement:", error);
      errorPopup("Error creating announcement");
    }
  };

  const handleCreateNote = async () => {
    try {
      const response = await createNote({
        ...newNote,
        target,
      });
      if (response.status === 201) {
        successPopup("Note created successfully");
        setOpenDialog(false);
        setNewNote({
          id: 0,
          title: "",
          message: "",
          roles: [],
          users: [],
          createdAt: "",
        });
        setTarget("role");
        fetchNotes();
      } else {
        errorPopup("Error creating note");
      }
    } catch (error) {
      console.error("Error creating note:", error);
      errorPopup("Error creating note");
    }
  };

  const handleDismissNote = async (id) => {
    try {
      setNotes((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error dismissing note:", error);
    }
  };

  return (
    <PageAnimate>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Organization Channel
            </h1>
            <p className="text-slate-600">
              Manage announcements and notes for your organization
            </p>
          </div>

          {/* Action Buttons */}
          {user.role === "admin" && (
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Button
                variant="contained"
                startIcon={<FiPlus />}
                onClick={() => {
                  setNewItemType("announcement");
                  setOpenDialog(true);
                }}
                sx={{
                  backgroundColor: "#c42032",
                  "&:hover": { backgroundColor: "#a01929" },
                  textTransform: "none",
                  fontWeight: 600,
                  py: 1.2,
                  px: 3,
                }}
              >
                Create Announcement
              </Button>
              <Button
                variant="contained"
                startIcon={<FiPlus />}
                onClick={() => {
                  setNewItemType("note");
                  setOpenDialog(true);
                }}
                sx={{
                  backgroundColor: "#1e2938",
                  "&:hover": { backgroundColor: "#0d1117" },
                  textTransform: "none",
                  fontWeight: 600,
                  py: 1.2,
                  px: 3,
                }}
              >
                Create Note
              </Button>
            </div>
          )}

          {/* Announcements Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              📢 Announcements
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {announcements.length > 0 ? (
                [...announcements].reverse().map((item, index) => (
                  <Card
                    key={index}
                    sx={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <CardContent>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-slate-900">
                          {item.title}
                        </h3>
                        <Chip
                          label={
                            item.location === "shop" ? "🏪 Shop" : "💬 Channel"
                          }
                          size="small"
                          sx={{
                            backgroundColor:
                              item.location === "shop"
                                ? "rgba(196, 32, 50, 0.1)"
                                : "rgba(30, 41, 56, 0.1)",
                            color:
                              item.location === "shop" ? "#c42032" : "#1e2938",
                            fontWeight: 600,
                          }}
                        />
                      </div>
                      <p className="text-slate-700 mb-3">{item.message}</p>
                       {(item.expiryDate || item.expiry) && (
                         <p className="text-sm text-slate-500">
                           ⏰ Expires on:{" "}
                           <span className="font-semibold">
                             {new Date(item.expiryDate || item.expiry).toLocaleDateString()}
                           </span>
                         </p>
                       )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="p-8 bg-white rounded-lg border border-slate-200 text-center">
                  <p className="text-slate-500">No announcements yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Notes Section */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              📝 Notes
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {notes.length > 0 ? (
                [...notes].reverse().map((item, index) => (
                  <Card
                    key={index}
                    sx={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <CardContent>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-slate-700 mb-4">{item.message}</p>

                      {/* Recipients */}
                      <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                        <p className="text-xs font-semibold text-slate-600 mb-2 uppercase">
                          👥 For:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {item.roles && item.roles.length > 0
                            ? item.roles.map((role) => (
                                <Chip
                                  key={role}
                                  label={role}
                                  size="small"
                                  sx={{
                                    backgroundColor: "rgba(196, 32, 50, 0.15)",
                                    color: "#c42032",
                                    textTransform: "capitalize",
                                    fontWeight: 500,
                                  }}
                                />
                              ))
                            : item.users && item.users.length > 0
                            ? item.users.map((id) => {
                                const userData =
                                  Array.isArray(users) &&
                                  users.find((u) => u.userId === id);
                                return userData ? (
                                  <Chip
                                    key={id}
                                    avatar={
                                      <Avatar
                                        src={
                                          userData.avatar
                                            ? `${process.env.REACT_APP_SERVER_URL}/${userData.avatar}`
                                            : `${process.env.REACT_APP_SERVER_URL}/default.webp`
                                        }
                                        alt={userData.username}
                                      />
                                    }
                                    label={`${userData.first_name} ${userData.last_name} (${userData.role})`}
                                    size="small"
                                    sx={{
                                      backgroundColor: "rgba(30, 41, 56, 0.1)",
                                      color: "#1e2938",
                                    }}
                                  />
                                ) : null;
                              })
                            : null}
                        </div>
                      </div>

                      {/* Dismiss Button */}
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<FiX />}
                        onClick={() => handleDismissNote(item.id)}
                        sx={{
                          borderColor: "#e5e7eb",
                          color: "#6b7280",
                          "&:hover": {
                            borderColor: "#c42032",
                            color: "#c42032",
                            backgroundColor: "rgba(196, 32, 50, 0.05)",
                          },
                          textTransform: "none",
                        }}
                      >
                        Dismiss
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="p-8 bg-white rounded-lg border border-slate-200 text-center">
                  <p className="text-slate-500">No notes yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "12px",
              backgroundColor: "#ffffff",
            },
          }}
        >
          {newItemType === "announcement" ? (
            <>
              <DialogTitle
                sx={{ fontWeight: 700, fontSize: "1.25rem", color: "#1e2938" }}
              >
                📢 Create Announcement
              </DialogTitle>
              <DialogContent sx={{ pt: 3 }}>
                <TextField
                  label="Title"
                  fullWidth
                  margin="dense"
                  value={newAnnouncement.title}
                  onChange={(e) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      title: e.target.value,
                    })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
                <TextField
                  label="Message"
                  fullWidth
                  margin="dense"
                  multiline
                  rows={4}
                  value={newAnnouncement.message}
                  onChange={(e) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      message: e.target.value,
                    })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
                <TextField
                  label="Expiry Date"
                  type="date"
                  fullWidth
                  margin="dense"
                  InputLabelProps={{ shrink: true }}
                  value={newAnnouncement.expiryDate}
                  onChange={(e) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      expiryDate: e.target.value,
                    })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
                <FormControl fullWidth margin="dense">
                  <InputLabel>Location</InputLabel>
                  <Select
                    value={newAnnouncement.location}
                    onChange={(e) =>
                      setNewAnnouncement({
                        ...newAnnouncement,
                        location: e.target.value,
                      })
                    }
                    sx={{
                      borderRadius: "8px",
                    }}
                  >
                    <MenuItem value="shop">🏪 Shop</MenuItem>
                    <MenuItem value="channel">💬 Channel</MenuItem>
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <Button
                  onClick={() => setOpenDialog(false)}
                  sx={{ color: "#6b7280", textTransform: "none" }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateAnnouncement}
                  variant="contained"
                  sx={{
                    backgroundColor: "#c42032",
                    "&:hover": { backgroundColor: "#a01929" },
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Create
                </Button>
              </DialogActions>
            </>
          ) : (
            <>
              <DialogTitle
                sx={{ fontWeight: 700, fontSize: "1.25rem", color: "#1e2938" }}
              >
                📝 Create Note
              </DialogTitle>
              <DialogContent sx={{ pt: 3 }}>
                <TextField
                  label="Title"
                  fullWidth
                  margin="dense"
                  value={newNote.title}
                  onChange={(e) =>
                    setNewNote({ ...newNote, title: e.target.value })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
                <TextField
                  label="Message"
                  fullWidth
                  margin="dense"
                  multiline
                  rows={4}
                  value={newNote.message}
                  onChange={(e) =>
                    setNewNote({ ...newNote, message: e.target.value })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
                <FormControl fullWidth margin="dense">
                  <InputLabel>Target</InputLabel>
                  <Select
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    sx={{
                      borderRadius: "8px",
                    }}
                  >
                    <MenuItem value="role">Specific Role</MenuItem>
                    <MenuItem value="user">Specific User</MenuItem>
                  </Select>
                </FormControl>
                {target === "role" && (
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Roles</InputLabel>
                    <Select
                      multiple
                      value={newNote.roles}
                      onChange={(e) =>
                        setNewNote({ ...newNote, roles: e.target.value })
                      }
                      input={<OutlinedInput label="Roles" />}
                      renderValue={(selected) => selected.join(", ")}
                    >
                      {roles.map((role) => (
                        <MenuItem key={role} value={role}>
                          <Checkbox checked={newNote.roles?.includes(role)} />
                          <ListItemText className="capitalize" primary={role} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                {target === "user" && (
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Users</InputLabel>
                    <Select
                      multiple
                      value={newNote.users}
                      onChange={(e) =>
                        setNewNote({ ...newNote, users: e.target.value })
                      }
                      input={<OutlinedInput label="Users" />}
                      renderValue={(selected) =>
                        (Array.isArray(users) ? users : [])
                          .filter((user) => selected.includes(user.userId))
                          .map((user) => `${user.first_name} ${user.last_name} (${user.role})`)
                          .join(", ")
                      }
                    >
                      {Array.isArray(users) && users.map((user) => (
                       <MenuItem key={user.userId} value={user.userId} sx={{ display: "block" }}>
                         <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                           <Checkbox
                             checked={newNote.users?.includes(user.userId)}
                             style={{ marginRight: 8 }}
                           />
                           <Avatar
                             src={
                               user.avatar
                                 ? `${getBaseURL()}/${user.avatar}`
                                 : `${getBaseURL()}/default.webp`
                             }
                             alt={user.username}
                             sx={{ width: 32, height: 32, marginRight: 1 }}
                           />
                           <div style={{ flex: 1, minWidth: 0 }}>
                             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                               <span style={{ fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                  {user.first_name} {user.last_name}
                                </span>
                                <span
                                 style={{
                                   fontSize: "0.75rem",
                                   padding: "2px 8px",
                                   backgroundColor: "#f3f4f6",
                                   borderRadius: "4px",
                                   textTransform: "capitalize",
                                   fontWeight: 500,
                                   color: "#666",
                                   whiteSpace: "nowrap",
                                 }}
                                >
                                  {user.role}
                                </span>
                             </div>
                             <div style={{ fontSize: "0.85rem", color: "#999", marginTop: 2 }}>
                                @{user.username} • #{user.userId}
                              </div>
                            </div>
                         </div>
                       </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <Button
                  onClick={() => setOpenDialog(false)}
                  sx={{ color: "#6b7280", textTransform: "none" }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateNote}
                  variant="contained"
                  sx={{
                    backgroundColor: "#1e2938",
                    "&:hover": { backgroundColor: "#0d1117" },
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Create
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </div>
    </PageAnimate>
  );
};

export default OrganizationChannel;
