import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth/authSlice'
import wishlistReducer from './wishlist/wishlistSlice'

export default configureStore({
  reducer: {
    auth : authReducer,
    wishlist: wishlistReducer
  }
})