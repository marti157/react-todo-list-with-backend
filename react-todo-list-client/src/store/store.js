import React, { createContext, useReducer } from 'react';
import Reducer from './reducer';

const initialState = {
  uuid: localStorage.getItem('uuid') || null,
  token: localStorage.getItem('token') || null,
  username: localStorage.getItem('username') || null,
  success: localStorage.getItem('success') || null,
};

const Store = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  return (
    <Context.Provider value={[state, dispatch]}>
      {children}
    </Context.Provider>
  );
};

export const Context = createContext(initialState);
export default Store;
