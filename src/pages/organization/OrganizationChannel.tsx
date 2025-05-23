import { useState, useEffect } from 'react';
import { getData, postData } from '../../network/api';
import { useStore } from '../../store/store';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, ListItemText, OutlinedInput, Avatar, } from '@mui/material';
import {socket} from '../../network/websocket';
import { useAuth } from '../../hooks/useAuth';
import PageAnimate from '../../components/Animate/PageAnimate';
import { getBaseURL } from '../../network/api/api-config';

interface Announcement {
  id: number;
  title: string;
  message: string;
  expiryDate?: string;
  createdAt: string;
  location: string;
}

interface Note {
  id: number;
  title: string;
  message: string;
  roles?: string[];
  users?: number[];
  createdAt: string;
}

interface UserList {
  userId: number;
  username: string;
  avatar: string;
  role: string;
}

const OrganizationChannel = () => {

  const { user } = useAuth();

  // console.log(user);

  const [newAnnouncement, setNewAnnouncement] = useState<Announcement>({
    id: 0,
    title: '',
    message: '',
    expiryDate: '',
    createdAt: '',
    location: 'shop', // Default value
  });
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [target, setTarget] = useState<string>('role');
  const [openDialog, setOpenDialog] = useState(false);
  const [newItemType, setNewItemType] = useState<'announcement' | 'note'>('announcement');
  const [newNote, setNewNote] = useState<Note>({
    id: 0,
    title: '',
    message: '',
    roles: [],
    users: [],
    createdAt: '',
  });
  const roles = ["admin", "operator", "reporter", "customer", "delivery"];
  const [users, setUsers] = useState<UserList[]>([]);

  const { successPopup, errorPopup } = useStore();

  useEffect(() => {
    fetchAnnouncements();
    fetchNotes();
    fetchUsers();
  
    const handleNewAnnouncement = (announcement: Announcement) => {
      // console.log("socket:", announcement);
      setAnnouncements((prev) => [...prev, { ...announcement }]);
    };
  
    const handleNewNote = (note: Note) => {
      console.log("socket:", note);
      setNotes((prev) => [...prev, { ...note }]);
    };
  
    socket.on('newAnnouncement', handleNewAnnouncement);
    socket.on('newNote', handleNewNote);
  
    return () => {
      socket.off('newAnnouncement', handleNewAnnouncement);
      socket.off('newNote', handleNewNote);
    };
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const data = await getData('/channel/announcements');
      setAnnouncements(data as unknown as Announcement[]);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const fetchNotes = async () => {
    try {
      const data = await getData('/channel/notes');
      setNotes(data as unknown as Note[]);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await getData('/users/list');
      setUsers(data as unknown as UserList[]);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCreateAnnouncement = async () => {
    try {
      const result = await postData('/channel/announcement/create', newAnnouncement);
      if (result === 200) {
        successPopup('Announcement created!');
        setOpenDialog(false);
        fetchAnnouncements();
      } else {
        errorPopup('Error creating announcement');
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
    }
  };

  const handleCreateNote = async () => {
    try {
      const result = await postData('/channel/note/create', {...newNote, target} );
      if (result === 200) {
        successPopup('Note created successfully');
        setOpenDialog(false);
        fetchNotes();
      } else {
        errorPopup('Error creating note');
      }
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleDismissNote = async (id: number) => {
    try {
      // API call to dismiss note
      // await postData(`/notes/${id}/dismiss`, {});
      setNotes((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error dismissing note:', error);
    }
  };

  // console.log(notes)

  return (
    <PageAnimate>
    <div className="container mx-auto p-4">
      {user.role === 'admin' && (<div>
      <Button variant="contained" color="primary" onClick={() => { setNewItemType('announcement'); setOpenDialog(true); }}> Create Announcement </Button>
      <Button variant="contained" color="primary" onClick={() => { setNewItemType('note'); setOpenDialog(true); }} style={{ marginLeft: '10px' }}> Create Note </Button>
      </div>)}
        <h2 className="text-xl font-semibold mb-2">Announcements</h2>
      <div className="mt-4 flex flex-col-reverse"> 
        {announcements.map((item, index) => (
          <div key={index} className="border p-4 mb-2">
            <h3 className="text-lg font-bold">{item.title}</h3>
            <p>{item.message}</p>
            {item.expiryDate && (
              <p>Expires on: {new Date(item.expiryDate).toLocaleDateString()}</p>
            )}
          </div>
        ))}
      </div>
        <h2 className="text-xl font-semibold mb-2">Notes</h2>
      <div className="mt-4 flex flex-col-reverse">
        {notes.map((item, index) => (
          <div key={index} className="border p-4 mb-2">
            <h3 className="text-lg font-bold">{item.title}</h3>
            <p>{item.message}</p>
            <div className='capitalize flex gap-4 p-2 items-center'>
              For: {item.roles && item.roles.length > 0 ? item.roles.join(', ') : item.users?.map((id) => {
                const user = users.find(user => user.userId === id);
                return user ? (
                  <span key={id} className="flex items-center">
                    <Avatar src={user.avatar ? `${process.env.REACT_APP_SERVER_URL}/${user.avatar}` : `${process.env.REACT_APP_SERVER_URL}/default.webp`} alt={user.username} sx={{ width: 24, height: 24, marginRight: 1 }} />
                    {user.username}
                  </span>
                ) : null;
              })}
            </div>
            <Button variant="outlined" onClick={() => handleDismissNote(item.id)}>
              Dismiss
            </Button>
          </div>
        ))}
      </div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
  {newItemType === 'announcement' ? (
    <>
      <DialogTitle>Create Announcement</DialogTitle>
      <DialogContent>
        <TextField label="Title" fullWidth margin="dense" value={newAnnouncement.title} onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })} />
        <TextField label="Message" fullWidth margin="dense" multiline rows={4} value={newAnnouncement.message} onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })} />
        <TextField label="Expiry Date" type="date" fullWidth margin="dense" InputLabelProps={{ shrink: true }} value={newAnnouncement.expiryDate} onChange={(e) => setNewAnnouncement({ ...newAnnouncement, expiryDate: e.target.value })} />
        <FormControl fullWidth margin="dense">
          <InputLabel>Location</InputLabel>
          <Select value={newAnnouncement.location} onChange={(e) => setNewAnnouncement({ ...newAnnouncement, location: e.target.value })} >
            <MenuItem value="shop">Shop</MenuItem>
            <MenuItem value="channel">Channel</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
        <Button onClick={handleCreateAnnouncement} variant="contained" color="primary">
          Create
        </Button>
      </DialogActions>
    </>
  ) : (
    <>
      <DialogTitle>Create Note</DialogTitle>
      <DialogContent>
        <TextField label="Title" fullWidth margin="dense" value={newNote.title} onChange={(e) => setNewNote({ ...newNote, title: e.target.value })} />
        <TextField label="Message" fullWidth margin="dense" multiline rows={4} value={newNote.message} onChange={(e) => setNewNote({ ...newNote, message: e.target.value })} />
        <FormControl fullWidth margin="dense">
          <InputLabel>Target</InputLabel>
          <Select value={target} onChange={(e) => setTarget(e.target.value)}>
            <MenuItem value="role">Specific Role</MenuItem>
            <MenuItem value="user">Specific User</MenuItem>
          </Select>
        </FormControl>
        {target === 'role' && (
          <FormControl fullWidth margin="dense">
            <InputLabel>Roles</InputLabel>
            <Select
              multiple
              value={newNote.roles}
              onChange={(e) => setNewNote({ ...newNote, roles: e.target.value as string[] })}
              input={<OutlinedInput label="Roles" />}
              renderValue={(selected) => selected.join(', ')}>
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  <Checkbox checked={newNote.roles?.includes(role)} />
                  <ListItemText className="capitalize" primary={role} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {target === 'user' && (
          <FormControl fullWidth margin="dense">
            <InputLabel>Users</InputLabel>
            <Select
              multiple
              value={newNote.users}
              onChange={(e) => setNewNote({ ...newNote, users: e.target.value as number[] })}
              input={<OutlinedInput label="Users" />}
              renderValue={(selected) =>
                users
                  .filter((user) => selected.includes(user.userId))
                  .map((user) => user.username)
                  .join(', ')
              }>
              {users.map((user) => (
                <MenuItem key={user.userId} value={user.userId}>
                  <Checkbox checked={newNote.users?.includes(user.userId)} />
                  <div className="flex items-center">
                    <Avatar
                      src={
                        user.avatar
                          ? `${getBaseURL()}/${user.avatar}`
                          : `${getBaseURL()}/default.webp`
                      }
                      alt={user.username}
                      sx={{ width: 28, height: 28 }}
                    />
                    <span className="font-regular" style={{ marginLeft: 8 }}>
                      {user.username}
                    </span>
                    <span className="font-medium" style={{ marginLeft: 8 }}>
                      #{user.userId}
                    </span>
                  </div>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
        <Button onClick={handleCreateNote} variant="contained" color="primary">
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
