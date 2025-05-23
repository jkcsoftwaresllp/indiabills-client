import { getFlexibleOptions } from "../definitions/Options";
import serverInstance from "../network/api/api-config";
import { storeOptions } from "./cacheHelper";

export const initializeFlexibleOptions = () => {
  const options = getFlexibleOptions();
  storeOptions("offers", options.offerTypeOptions);
  storeOptions("addressTypes", options.addressTypeOptions);
}

export async function initializePrefs(orgName: string): Promise<void> {

  interface Pref {
    theme?: string;
    initials: string;
    paymentMethods: string[];
    productCategories: string[];
  }

  const extractInitials = (name: string): string => {
    const words = name.trim().split(/\s+/);
    if (words.length > 1) {
      return words.map(word => word[0].toUpperCase()).join('');
    } else {
      return name.substring(0, 2).toUpperCase();
    }
  }

  const data: Pref = {
    theme: 'light',
    initials: extractInitials(orgName),
    paymentMethods: ['cash', 'card'],
    productCategories: [ "electronics", "gadgets", "sports", "home decorations", "toys", "clothing", "accessories", "gaming", "food" ]
  }

  try {
    await serverInstance.post("/settings/default", data);
  } catch (e) {
    console.error(e);
  }
}

export function getYear(): any { //Promise<number>
  
  return {
    startDate: new Date(new Date().getFullYear(), 0, 1),
    endDate: new Date(new Date().getFullYear(), 11, 31)
  };

  // try {
  //   const response = await serverInstance.get("/settings/year");
  //   return response.data.year;
  // } catch (e) {
  //   console.error(e);
  //   return new Date().getFullYear();
  // }
}