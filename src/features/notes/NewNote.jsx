import { useGetUsersQuery } from "../users/usersApiSlice"
import NewNoteForm from "./NewNoteForm"
import { PulseLoader } from "react-spinners/PulseLoader"

const NewNote = () => {
  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  })

  // if (!users?.length) return <PulseLoader color={"#FFF"} />
  if (!users?.length) return <p>Loading......</p>

  return <NewNoteForm users={users} />
}

export default NewNote
