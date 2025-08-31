import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    doctor: null,
    role: null,
    tenant: null,
  },
  reducers: {
    setDoctor: (state, action) => {
      state.doctor = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setTenant: (state, action) => {
      state.tenant = action.payload;
    },
    updateTenant: (state, action) => {
      state.tenant = { ...state.tenant, ...action.payload };
    },
    logoutDoctor: (state) => {
      state.token = null;
      state.doctor = null;
      state.role = null;
      state.tenant = null;
    },
  },
});

// ✅ Export the actions you use elsewhere
export const { setDoctor, setToken, setRole, setTenant, updateTenant, logoutDoctor } = authSlice.actions;
export default authSlice.reducer;
