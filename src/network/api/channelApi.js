import serverInstance from './api-config';

// Announcements APIs
export async function getAnnouncements() {
  try {
    const response = await serverInstance.get('/channel/announcements');
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to fetch announcements:', error.response);
    return {
      status: error.response?.status || 500,
      data: []
    };
  }
}

export async function createAnnouncement(announcementData) {
  try {
    const response = await serverInstance.post('/channel/announcement/create', announcementData);
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to create announcement:', error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: 'Failed to create announcement' }
    };
  }
}

export async function getShopAnnouncements() {
  try {
    const response = await serverInstance.get('/channel/announcements/shop');
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to fetch shop announcements:', error.response);
    return {
      status: error.response?.status || 500,
      data: []
    };
  }
}

export async function getChannelAnnouncements() {
  try {
    const response = await serverInstance.get('/channel/announcements/channel');
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to fetch channel announcements:', error.response);
    return {
      status: error.response?.status || 500,
      data: []
    };
  }
}

// Notes APIs
export async function getNotes() {
  try {
    const response = await serverInstance.get('/channel/notes');
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to fetch notes:', error.response);
    return {
      status: error.response?.status || 500,
      data: []
    };
  }
}

export async function createNote(noteData) {
  try {
    const response = await serverInstance.post('/channel/note/create', noteData);
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to create note:', error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: 'Failed to create note' }
    };
  }
}

export async function updateAnnouncement(announcementId, announcementData) {
  try {
    const response = await serverInstance.patch(`/channel/announcements/${announcementId}`, announcementData);
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to update announcement:', error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: 'Failed to update announcement' }
    };
  }
}

export async function deleteAnnouncement(announcementId) {
  try {
    const response = await serverInstance.delete(`/channel/announcements/${announcementId}`);
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to delete announcement:', error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: 'Failed to delete announcement' }
    };
  }
}

export async function updateNote(notesId, noteData) {
  try {
    const response = await serverInstance.patch(`/channel/note/${notesId}`, noteData);
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to update note:', error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: 'Failed to update note' }
    };
  }
}

export async function deleteNote(notesId) {
  try {
    const response = await serverInstance.delete(`/channel/note/${notesId}`);
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Failed to delete note:', error.response);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: 'Failed to delete note' }
    };
  }
}
