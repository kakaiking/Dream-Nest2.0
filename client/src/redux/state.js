import { createSlice} from "@reduxjs/toolkit"

const initialState = {
  user: null,
  token: null,
  listings: [], // Initialize listings state here
  updates: [],  // Initialize updates state here
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
    },
    setLogout: (state) => {
      state.user = null
      state.token = null
    },
    setListings: (state, action) => {
      state.listings = action.payload.listings
    },
    setListingStatus: (state, action) => {
      const { listingId, status } = action.payload;
      const listing = state.listings.find((listing) => listing._id === listingId);
      if (listing) {
        listing.status = status; // Update the status of the listing in the state
      }
    },
    setUpdates: (state, action) => {
      state.updates = action.payload.updates;
    },
    addUpdate: (state, action) => {
      state.updates.push(action.payload);
    },
    setTripList: (state, action) => {
      state.user.tripList = action.payload
    },
    setWishList: (state, action) => {
      state.user.wishList = action.payload
    },
    setPropertyList: (state, action) => {
      state.user.propertyList = action.payload
    },
    setReservationList: (state, action) => {
      state.user.reservationList = action.payload
    },
    setProfileDetails: (state, action) => {
      state.user.profileDetails = action.payload
    },
    
  }
})

export const { setLogin, setLogout, setListings, setListingStatus, setTripList, setWishList, setPropertyList, setReservationList, setProfileDetails, setUpdates, addUpdate } = userSlice.actions
export default userSlice.reducer