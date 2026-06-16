// import { configureStore } from '@reduxjs/toolkit'
// import userSlice from "./userSlice"

// export const store = configureStore({
//   reducer: {
//     user:userSlice
//   },
// })


import {combineReducers, configureStore} from "@reduxjs/toolkit";
import userSlice from "./userSlice"

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
const storage = {
  getItem: (key) =>
    Promise.resolve(
      typeof window !== 'undefined' ? window.localStorage.getItem(key) : null,
    ),
  setItem: (key, item) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, item)
    }
    return Promise.resolve()
  },
  removeItem: (key) => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key)
    }
    return Promise.resolve()
  },
}


const persistConfig = {
    key: 'ai-website-builder',
    version: 1,
    storage,
  }
  const rootReducer = combineReducers({
    user:userSlice,
  })
  const persistedReducer = persistReducer(persistConfig, rootReducer)


const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
});
export default store;