import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import categoryReducer from "./slices/categorySlice";
import customerReducer from "./slices/customerSlice";
import serviceProviderReducer from "./slices/serviceProviderSlice";
import serviceReducer from "./slices/serviceSlice";
import partnerRequestReducer from "./slices/partnerRequestSlice";
import transactionReducer from "./slices/transactionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer, // Add the authReducer here to handle the 'auth' slice
    user: userReducer,
    category: categoryReducer,
    customer: customerReducer,
    serviceProvider: serviceProviderReducer,
    service: serviceReducer,
    partnerRequest: partnerRequestReducer,
    transaction: transactionReducer,
  },
});
