import { createSlice } from '@reduxjs/toolkit'
// import type { PayloadAction } from '@reduxjs/toolkit'

// export interface usetMessage {
//     isLogin: boolean
//     isAdmin?: boolean
//     [key: string]: string | boolean
// }

const initialState = {
    isLogin: window.sessionStorage.getItem('isLogin') ? sessionStorage.getItem('isLogin') : false,
    isAdmin: window.sessionStorage.getItem('isAdmin')? sessionStorage.getItem('isAdmin') : false
}

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        changeLoginState(state, action) {
            state.isLogin = action.payload;
            sessionStorage.setItem('isLogin', true)
        },
        changeAdminState(state, action) {
            state.isAdmin = action.payload;
            sessionStorage.setItem('isAdmin', true)

        }
    },
})

// Action creators are generated for each case reducer function
export const { changeLoginState, changeAdminState } = counterSlice.actions

export default counterSlice.reducer