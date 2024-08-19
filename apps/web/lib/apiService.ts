import { isServer } from "@tanstack/react-query";

const API_ROUTE = "http://localhost:3000";

function getBaseURL() {
  if (!isServer) {
    return "";
  }

  return API_ROUTE;
}

export const apiService = async <T>(url: string, input?: RequestInit) => {
  try {
    const fetchUrl = `${getBaseURL()}${url}`;
    console.debug(`Fetching ${fetchUrl}`);
    const response = await fetch(fetchUrl, input);

    let data;
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Not found");
      }
      data = await response.json();

      if (!data.message) {
        throw new Error("An error occurred");
      }

      throw new Error(data.message);
    } else {
      data = await response.json();
    }

    return data as T;
  } catch (e) {
    // Handle logging of errors
    console.error(e);
    throw e;
  }
};
