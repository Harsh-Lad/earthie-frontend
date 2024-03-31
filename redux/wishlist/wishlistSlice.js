import { createSlice } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: [],
  reducers: {
    setWishlist(state, action) {
      return action.payload;
    },
  },
});

export const { setWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;

// const initialState = {
//   wishlist: [],
//   loading: false,
//   error: null,
// };

// export const wishlistSlice = createSlice({
//   name: 'wishlist',
//   initialState,
//   reducers: {
//     // Add reducer functions if needed
//     wishlistLoading: (state) => {
//       state.loading = true;
//       state.error = null;
//     },
//     wishlistSuccess: (state, action) => {
//       state.loading = false;
//       state.error = null;
//       state.wishlist = action.payload;
//     },
//     wishlistError: (state, action) => {
//       state.loading = false;
//       state.error = action.payload;
//     },
//   },
// });

// export const { wishlistLoading, wishlistSuccess, wishlistError } = wishlistSlice.actions;

// // Fetch wishlist data from the backend and update the state
// export const fetchWishlistData = () => async (dispatch) => {
//   dispatch(wishlistLoading());
//   try {
//     const response = await fetchWishlist(); // Call the API function to fetch wishlist data
//     const data = await response.json();
//     dispatch(wishlistSuccess(data)); // Dispatch success action with fetched data
//   } catch (error) {
//     dispatch(wishlistError(error.message)); // Dispatch error action if fetching fails
//   }
// };