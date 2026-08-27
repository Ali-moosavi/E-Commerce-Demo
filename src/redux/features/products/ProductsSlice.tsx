import { createSlice } from "@reduxjs/toolkit";
import type { INITIALSTATES } from "@/types/types";
import { GetProductsAction } from "./ProductsService";


const initialState:INITIALSTATES = {
    products:[],
    filteredItems:[],
    status:'idle'
}

const ProductsSlice = createSlice({
    name:'ProductsSlice',
    initialState,
    reducers:{
        changefilteredItems(state , action){
            state.filteredItems = action.payload
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(GetProductsAction.pending , (state)=>{
            state.status = 'loading'
        })
        builder.addCase(GetProductsAction.fulfilled , (state, action)=>{
            state.status = 'succeeded'
            state.products = action.payload
        })
        builder.addCase(GetProductsAction.rejected , (state)=>{
            state.status = 'failed'
        })
    }
})

export default ProductsSlice.reducer
export const {changefilteredItems} = ProductsSlice.actions
