import { notification } from "antd";
import { USERTOKEN } from "../layout/MainLayout";
import Axios from "axios";
import { GROUP_URL, SHOP_URL } from "./myPaths";

export const redirectToLogin = (history: any) => {
  history.push("/login");
};

export const logout = (history: any) => {
  localStorage.removeItem(USERTOKEN);
  redirectToLogin(history);
};

export const errorHandler = (e: any) => {
  if (!e.response) {
    return "Network error, Please check your network and try again";
  }
  let errorMessage = "";
  Object.values(e.response.data).map((item: any) => {
    errorMessage += item;
    return null;
  });
  return errorMessage;
};

export enum NotificationTypes {
  SUCCESS = "success",
  INFO = "info",
  ERROR = "error",
  WARNING = "warning",
}

export const openNotificationWithIcon = (
  type: NotificationTypes,
  title: string,
  description?: string
) => {
  notification[type]({
    message: title,
    description: description,
  });
};

export const getAppGroups = (
  userToken: string,
  currentPage?: number,
  search?: string
) => {
  return Axios.get(
    GROUP_URL + `?page=${currentPage || 1}&keyword=${search || ""}`,
    {
      headers: { Authorization: userToken },
    }
  ).catch((e) =>
    openNotificationWithIcon(NotificationTypes.ERROR, errorHandler(e))
  );
};

export const getAppShops = (
  userToken: string,
  currentPage?: number,
  search?: string
) => {
  return Axios.get(
    SHOP_URL + `?page=${currentPage || 1}&keyword=${search || ""}`,
    {
      headers: { Authorization: userToken },
    }
  ).catch((e) =>
    openNotificationWithIcon(NotificationTypes.ERROR, errorHandler(e))
  );
};

export function formatCurrency(num: number) {
  return num.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}