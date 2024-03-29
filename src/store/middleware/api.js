﻿import axios from "axios";
import * as actions from "../api";

const api = (store) => (next) => async (action) => {
  if (action.type !== actions.apiCallBegan.type) return next(action);

  const { dispatch } = store;
  const { url, method, data, onSuccess, onError, onStart } = action.payload;

  if (onStart) dispatch({ type: onStart });

  next(action); //used to show action in redux devtools

  try {
    const response = await axios.request({
      baseURL: "http://localhost:3001/",
      method,
      url,
      data,
    });
    // General
    dispatch(actions.apiCallSuccess(response.data));
    // Specific
    if (onSuccess) dispatch({ type: onSuccess, payload: response.data });
  } catch (error) {
    // General
    dispatch(actions.apiCallFailed(error.message));
    // Specific
    if (onError) dispatch({ type: onError, payload: error.message });
  }
};

export default api;
