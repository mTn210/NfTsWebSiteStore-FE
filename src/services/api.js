import { axiosInstance as axios } from "./axiosInstance";

const CREATE_NEW_USER = () => "api/public/user/create";

const AUTHENTICATE = () => "api/public/authenticate";

const TEST_API = () => `api/public/test1`;

const GET_ALL_ITEMS = () => "api/items/all";

const ADD_TO_FAVORITE = () => "api/favoriteItems/add";

const FETCH_FAVORITE_ITEMS = (userName) => `api/favoriteItems/list/${userName}`;

const REMOVE_FAVORITE_ITEM = (favoriteItemId) =>
  `api/favoriteItems/remove/${favoriteItemId}`;

const DELETE_USER = (userName) => `api/public/user/delete/${userName}`;

const GET_USER_ORDERS = (userName) => `/api/orders/user/${userName}`;

const ADD_ITEM_TO_ORDER = (userName) =>
  `/api/orders/${userName}/addOrUpdateOrder`;

const REMOVE_ITEM_FROM_ORDER = (orderId, itemId) =>
  `/api/orders/${orderId}/item/${itemId}`;

const UPDATE_ORDER_STATUS = (orderId) => `/api/orders/${orderId}/finalize`;

const GET_USER_ORDERS_DETAILS = (orderId) => `/api/orders/${orderId}`;

const CLOSE_PENDING_ORDER = (orderId) => `/api/orders/${orderId}/finalize`;

const SEARCH_ITEM = () => `api/items/search`;

export const searchItems = (searchTerm) => {
  return axios.get(SEARCH_ITEM(), {
    params: { name: searchTerm },
  });
};

export const getAllItems = () => {
  return axios.get(GET_ALL_ITEMS());
};

export const closePendingOrders = (orderId, shippingAddress) => {
  return axios.put(CLOSE_PENDING_ORDER(orderId), null, {
    params: { shippingAddress },
  });
};

export const getOrderDetails = (orderId) => {
  return axios.get(GET_USER_ORDERS_DETAILS(orderId));
};

export const updateOrderStatus = (orderId) => {
  return axios.put(UPDATE_ORDER_STATUS(orderId));
};

export const removeItemFromOrder = (orderId, itemId) => {
  return axios.delete(REMOVE_ITEM_FROM_ORDER(orderId, itemId));
};

export const getUserOrders = (userName) => {
  return axios.get(GET_USER_ORDERS(userName));
};

export const addItemToOrder = (userName, itemData) => {
  return axios.post(ADD_ITEM_TO_ORDER(userName), itemData);
};

export const deleteUser = (userName) => {
  return axios.delete(DELETE_USER(userName));
};

export const removeFavoriteItem = (favoriteItemId) => {
  return axios.delete(REMOVE_FAVORITE_ITEM(favoriteItemId));
};

export const fetchFavoriteItems = (userName) => {
  return axios.get(FETCH_FAVORITE_ITEMS(userName), {});
};

export const createNewUser = (userBody) => {
  return axios.post(CREATE_NEW_USER(), userBody);
};

export const authenticate = (userBody) => {
  return axios.post(AUTHENTICATE(), userBody);
};

export const testAuthenticatedApi = (params) => {
  return axios.get(TEST_API(), { params: params });
};

export const addToFavorite = (favoriteItem) => {
  const url = ADD_TO_FAVORITE();
  return axios.post(url, favoriteItem);
};
