import serverInstance from "../network/api/api-config";
import { SessionPayload } from "../definitions/Types";

/*--------SESSION----------*/

export function createSession(value: SessionPayload) {
  try {
    localStorage.setItem("session", JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to store the session`, e)
  }
}

export function getSession(): SessionPayload | null {
  const session: string | null = localStorage.getItem("session");
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

interface Title {
  first_title: string,
  last_title: string,
}

export function setTitle(title: Title): void {
  try {
    localStorage.setItem("title", JSON.stringify({ title }));
  } catch (e) {
    console.error("Failed to set the title", e);
  }
}

/*--------OPTIONS----------*/

export function storeOptions(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to store in localStorage (${key}):`, e)
  }
}

export function cacheCategories() {
  console.info("[info] Caching category list");
  serverInstance.get("/products/categories/").then((response) => {
    if (response.data !== null) {
      storeOptions("categories", response.data);
    }
  })
}

export function checkCategories(): void {
  if (!localStorage.getItem("categories")) {
    cacheCategories();
  }
}

export function getCategoryOptions(): string[] { //MIGHT REMOVE THIS
  const response: string | null = localStorage.getItem("categories");
  if (response && response.length > 0) {
    return JSON.parse(response)
  } else {
    cacheCategories();
    return [];
  }
}