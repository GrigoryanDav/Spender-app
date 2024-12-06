import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { FIRESTORE_PATH_NAMES } from "../../../constants/firestorePaths";
import { RegisterFormValues } from "../../../ts/interfaces/RegisterFormValues";
import { userProfileState } from "../../../ts/interfaces/userProfileState";


const initialState: userProfileState = {
    loading: false,
    authUserInfo: {
        isAuth: false,
        userData: null
    },
    error: null
}

export const fetchUserProfileInfo = createAsyncThunk<RegisterFormValues | null, void>('data/fetchUserProfileInfo', async () => {
    return new Promise<RegisterFormValues | null>((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const { uid } = user
                const userRef = doc(db, FIRESTORE_PATH_NAMES.REGISTERED_USERS, uid)
                getDoc(userRef)
                    .then((userData) => {
                        if (userData.exists()) {
                            resolve(userData.data() as RegisterFormValues)
                        } else {
                            resolve(null)
                        }
                    })
            } else {
                reject('Ooopps')
            }
        })
    })
})

const userProfileSlice = createSlice({
    name: 'userProfile',
    initialState,
    reducers: {
        setIsAuth: (state, action) => {
            state.authUserInfo.isAuth = action.payload
        }
    },
    extraReducers: (promise) => {
        promise
            .addCase(fetchUserProfileInfo.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchUserProfileInfo.fulfilled, (state, action: PayloadAction<RegisterFormValues | null>) => {
                state.loading = false
                if (action.payload) {
                    state.authUserInfo.userData = action.payload
                    state.authUserInfo.isAuth = true
                }
            })
            .addCase(fetchUserProfileInfo.rejected, (state, action) => {
                state.loading = false
                state.authUserInfo.isAuth = false
                state.error = action.payload as string | null
                state.authUserInfo.userData = null
            })
    }
})

export const { setIsAuth } = userProfileSlice.actions
export default userProfileSlice.reducer