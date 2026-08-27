import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppState } from "@/redux/setup/store";
import axios from "axios";
import type { SUCCES_PRODUCTS_TYPE } from "@/types/types";



interface asyncThunkConfig {
  rejectValue: {
    errorObj: {
      title: string;
      status: number;
      errormessage: string | null;
      message: string;
      responseCode: number;
      result: string;
    };
  };
  state: AppState;
}

export const GetProductsAction = createAsyncThunk<
  SUCCES_PRODUCTS_TYPE,
  void,
  asyncThunkConfig
>("GetProductsAction", async () => {
  const response = await axios.get<SUCCES_PRODUCTS_TYPE>("/api/categories");
  return response.data;
});
