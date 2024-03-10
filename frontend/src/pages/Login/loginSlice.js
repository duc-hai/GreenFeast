import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { requestLoginService } from "../../Services/loginService";

const initialState = {
    isLoading: false,
    token: {}
}
export const loginAsync = createAsyncThunk('login', async (params) => {
    const response = await requestLoginService(params)
    return response.data
})

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(loginAsync.pending, state => {
                state.isLoading = true;
            })
            .addCase(loginAsync.fulfilled, (state, action) => {
                if (action.payload) {
                    state.isLoading = false;
                    state.token = action.payload
                }
            })

    }
})

export const selectLogin = state => state.login;
export default loginSlice.reducer;