import React, { createContext, useReducer } from "react";

export enum ActionTypes {
  UPDATE_USER_DATA,
  UPDATE_USER_TOKEN,
  UPDATE_APP_GROUP,
  UPDATE_APP_SHOP,
}

export interface ActionProps {
  type: ActionTypes;
  payload: any;
}

function userReducer(state: any, action: ActionProps) {
  if (action.type === ActionTypes.UPDATE_USER_DATA) {
    return {
      ...state,
      userData: action.payload,
    };
  } else if (action.type === ActionTypes.UPDATE_USER_TOKEN) {
    return {
      ...state,
      userToken: action.payload,
    };
  }

  return state;
}

function appReducer(state: any, action: ActionProps) {
  if (action.type === ActionTypes.UPDATE_APP_GROUP) {
    return {
      ...state,
      groups: action.payload,
    };
  } else if (action.type === ActionTypes.UPDATE_APP_SHOP) {
    return {
      ...state,
      shop: action.payload,
    };
  }

  return state;
}

const reduceReducers =
  (...reducers: any) =>
  (prevState: any, value: any, ...args: any) =>
    reducers.reduce(
      (newState: any, reducer: any) => reducer(newState, value, ...args),
      prevState
    );

const userInitialData: { userData: any; userToken: string | null } = {
  userData: null,
  userToken: null,
};

const appInitialData: { groups: any; shop: any, colaborador: any } = {
  groups: null,
  colaborador: null,
  shop: null,
};

const initialData: any = {
  ...userInitialData,
  ...appInitialData
};

export const store = createContext(initialData);

const combinedReducer = reduceReducers(userReducer, appReducer);

export function StoreProvider({ children }: any) {

  const [state, dispatch] = useReducer(combinedReducer, initialData)

  const { Provider } = store

  return <Provider value={{ state, dispatch }}>{children}</Provider>
}