import { Outlet } from "react-router-dom"
import { usersApiSlice } from "../users/usersApiSlice"
import { notesApiSlice } from "../notes/notesApiSlice"
import { store } from "../../app/store"
import { useEffect } from "react"

const Prefetch = () => {
  useEffect(() => {
    store.dispatch(
      usersApiSlice.util.prefetch("getUsers", "usersList", { force: true })
    )
    store.dispatch(
      notesApiSlice.util.prefetch("getNotes", "notesList", { force: true })
    )
  }, [])
  return <Outlet />
}

export default Prefetch
