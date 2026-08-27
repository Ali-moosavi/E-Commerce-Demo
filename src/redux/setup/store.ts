import { configureStore } from "@reduxjs/toolkit";
import type { ThunkAction, Action } from "@reduxjs/toolkit";
import ProductsSlice from '../features/products/ProductsSlice'
// import SettingSlice from '../features/Setting/SettingSlice'
// import CategoriesSlice from '../features/Categories/CategoriesSlice'
// import ProductSlice from '../features/Products/ProductSlice'
// import PropertiesReducer from "../features/Properties/PropertiesSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      Productstate:ProductsSlice
    },
  });
}

const store = makeStore()

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>;
export default store