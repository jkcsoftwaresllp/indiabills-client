import serverInstance from "../network/api/api-config";

/*--------SESSION----------*/

export function createSession(value) {
  try {
    localStorage.setItem("session", JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to store the session`, e);
  }
}

export function getSession() {
  const session = localStorage.getItem("session");
  if (session && session.length > 0) {
    return JSON.parse(session);
  } else {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem("session");
}

/*--------TITLE----------*/

export function setTitle(title) {
  try {
    localStorage.setItem("title", JSON.stringify({ title }));
  } catch (e) {
    console.error("Failed to set the title", e);
  }
}

/*--------OPTIONS----------*/

export function storeOptions(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to store in localStorage (${key}):`, e);
  }
}

export function cacheCategories() {
  console.info("[info] Caching category list");
  serverInstance.get("/products/categories/").then((response) => {
    if (response.data !== null) {
      storeOptions("categories", response.data);
    }
  });
}

export function checkCategories() {
  if (!localStorage.getItem("categories")) {
    cacheCategories();
  }
}

export function getCategoryOptions() {
  const response = localStorage.getItem("categories");
  if (response && response.length > 0) {
    return JSON.parse(response);
  } else {
    cacheCategories();
    return [];
  }
}

