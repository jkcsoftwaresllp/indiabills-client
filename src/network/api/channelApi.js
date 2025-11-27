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
