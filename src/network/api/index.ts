import serverInstance from "./api-config";
import { Services } from "../../definitions/Types";

async function getStuff(path: string): Promise<any[]> {
  try {
    const response = await serverInstance.get(path);
    return response.data;
  } catch (e) {
    console.error(`Failed to fetch the data for ${path}:`, e.response);
    return [];
  }
}

async function updateStuff(path: string, data: object): Promise<number> {
  try {
    const response = await serverInstance.put(path, data);
    console.log("Success:", response.data);
    return response.status;
  } catch (e) {
    console.error(`Failed to update the data for ${path}:`, e.response);
    return 500;
  }
}

async function getReport(path: string, data: object): Promise<any> {
  try {
    const response = await serverInstance.post(path, data);
    return response.data;
  } catch (e) {
    console.error(`Failed to post the data for ${path}:`, e.response);
    return 500;
  }
}

export async function updateCredit(data: object): Promise<any> {
  try {
    const response = await serverInstance.put("reports/debit/update", data);
    return response;
  } catch (e) {
    console.error(`Failed to update credit`, e.response);
    return 500;
  }
}

export async function deleteCredit(id: number): Promise<any> {
  try {
    const response = await serverInstance.post("reports/debit/delete", {
      id,
    });
    return response.data;
  } catch (e) {
    console.error(`Failed to update credit`, e.response);
    return 500;
  }
}

async function postData(path: string, data: object): Promise<number> {
  try {
    const response = await serverInstance.post(path, data);
    return response.status;
  } catch (e) {
    console.error(`Failed to post the data for ${path}:`, e.response);
    return 500;
  }
}

async function deleteStuff(path: string, data: object): Promise<number> {
  try {
    const response = await serverInstance.delete(path, { data });
    console.log("Success:", response.data);
    return response.status;
  } catch (e) {
    console.error(`Failed to delete the data for ${path}:`, e.response);
    return 500;
  }
}

async function getData<T extends Services>(path: string): Promise<T[]> {
  try {
    const response = await serverInstance.get(path);
    return response.data;
  } catch (e) {
    console.error(`Failed to fetch the data for ${path}:`, e.response);
    return [] as T[];
  }
}

async function getRequest(path: string): Promise<any> {
  try {
    const response = await serverInstance.get(path);
    return response.data;
  } catch (e) {
    console.error(`Failed to fetch the data for ${path}:`, e.response);
    return [];
  }
}

async function getRow<T extends Services>(path: string): Promise<T> {
  try {
    const response = await serverInstance.get(path);
    return response.data;
  } catch (e) {
    console.error(`Failed to fetch the data for ${path}:`, e.response);
    return {} as T;
  }
}

async function deleteRow(path: string): Promise<number> {
  try {
    const response = await serverInstance.delete(path);
    console.log("Success:", response.data);
    return response.status;
  } catch (e) {
    console.error(`Failed to delete the data for ${path}:`, e.response);
    return 500;
  }
}

export async function getCount(path: string): Promise<number> {
  try {
    const response = await serverInstance.get(path);
    return response.data;
  } catch (e) {
    console.error(`Failed to fetch the data for /count:`, e.response);
    return 0;
  }
}

async function addRow(path: string, data: object): Promise<number> {
  try {
    const response = await serverInstance.post(path, data);
    // console.log(response);
    // console.log("Success:", response.data);
    return response.status;
  } catch (e) {
    console.error(`Failed to add the data for ${path}:`, e.response);
    return e.response.status;
  }
}

interface quickRes {
  status: number;
  data: any;
}

async function quickAdd(path: string, data: object): Promise<quickRes> {
  try {
    const response = await serverInstance.post(path, data);
    console.log("Success:", response.data);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (e) {
    console.error(`Failed to add the data for ${path}:`, e.response);
    return {
      status: 500,
      data: null,
    };
  }
}

async function updateRow(path: string, data: object): Promise<number> {
  try {
    const response = await serverInstance.post(path, data);
    return response.status;
  } catch (e) {
    console.error(`Failed to update the data for ${path}:`, e.response);
    return 500;
  }
}

export async function updatePut(path: string, data: object): Promise<number> {
  try {
    const response = await serverInstance.put(path, data);
    return response.status;
  } catch (e) {
    console.error(`Failed to update the data for ${path}:`, e.response);
    return 500;
  }
}

async function checkSetup(): Promise<boolean> {
  const response = await serverInstance.get("/auth/new");
  return response.data;
}

export async function getInvoiceCount(): Promise<void> {
  const response = await serverInstance.get("/invoices/count");
  localStorage.setItem("invoiceCount", response.data);
  return;
}

/*--------LOGIN--------*/

interface Login {
  email: string;
  password: string;
}

interface UserSession {
  id: number;
  name: string;
  role: string;
}

interface Session {
  user: UserSession;
  avatar: string;
  token: string;
}

async function apiLogin(payload: Login) {
  try {
    return await serverInstance.post("/auth/login", payload);
  } catch (e) {
    console.error(`Failed to login server:`, e.response);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return e.response;
  }
}

async function uploadImg(image: File, root?: boolean): Promise<number> {
  const formData = new FormData();
  formData.append("image", image);

  const PATH = root && root === true ? "/auth/upload/" : "/users/upload/";

  // Fire-and-forget the request
  serverInstance
    .post(PATH, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      console.log("Upload successful:", response.status);
    })
    .catch((error) => {
      console.error("Upload failed:", error.response);
    });

  return Promise.resolve(200);
}

async function fetchProduct(data: any): Promise<any> {
  try {
    return await serverInstance.post("/shop/place", data);
  } catch (e) {
    console.error("Failed to fetch products at shop", e.response);
  }
}

async function fetchDiscount(data: any): Promise<any> {
  try {
    return await serverInstance.post("/shop/discount/fetch", data);
  } catch (e) {
    console.error(e.response);
  }
}

async function placeOrder(data: any): Promise<any> {
  try {
    const response = await serverInstance.post("/shop/order/place", data);
    return { status: response.status, message: response.data };
  } catch (e) {
    return {
      status: e.response.status,
      message: e.response.data.reason.message,
    };
  }
}

async function fetchLogo(): Promise<string> {
  try {
    const response = await serverInstance.get("/logo");
    return response.data;
  } catch (e) {
    console.error(`Failed to fetch the logo:`, e.response);
    return "";
  }
}

export {
  getData,
  getRequest,
  getReport,
  getStuff,
  deleteRow,
  addRow,
  updateRow,
  quickAdd,
  getRow,
  checkSetup,
  uploadImg,
  apiLogin,
  fetchProduct,
  fetchDiscount,
  placeOrder,
  fetchLogo,
  updateStuff,
  deleteStuff,
  postData,
};
