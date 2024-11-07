import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react"
import { setCredentials } from "../../features/auth/authSlice"

const baseQuery = fetchBaseQuery({
  // baseUrl: "http://localhost:3500",
  baseUrl: "https://technotes-api.onrender.com",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token
    if (token) {
      headers.set("authorization", `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithAuth = async (args, api, extraOptions) => {
  //console.log(args+..........+api+.......extraOptions)
  let result = await baseQuery(args, api, extraOptions)
  if (result?.error?.status === 403) {
    console.log("Sending refresh request")
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions)
    if (refreshResult?.data) {
      api.dispatch(setCredentials(refreshResult.data.accessToken))
      result = await baseQuery(args, api, extraOptions)
    } else {
      if (refreshResult?.error?.status === 403) {
        refreshResult.error.data.message = "Your login has expired"
      }
      return refreshResult
    }
  }
  return result
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Note", "User"],
  endpoints: (builder) => ({}),
})
