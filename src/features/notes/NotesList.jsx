import { useGetNotesQuery } from "./notesApiSlice"
import Note from "./Note"
import useAuth from "../../hooks/useAuth"
import { RingLoader } from "react-spinners"
import { Link } from "react-router-dom"

const NotesList = () => {
  const { username, isAdmin, isManager } = useAuth()
  const {
    data: Notes,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useGetNotesQuery("notesList", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  })

  let content
  if (isLoading)
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <RingLoader color={"#FFF"} size={100} />
      </div>
    )
  if (isError)
    content = (
      <p className="errmsg">
        {`${error?.data?.message} - `}
        <Link to={"/login"}>Please login again</Link>
      </p>
    )
  if (isSuccess) {
    const { ids, entities } = Notes

    let filteredIds = null
    if (isAdmin || isManager) {
      filteredIds = [...ids]
    } else {
      filteredIds = ids.filter(
        (noteId) => entities[noteId].username === username
      )
    }

    const tableContents =
      ids?.length &&
      filteredIds.map((noteId) => <Note key={noteId} noteId={noteId} />)

    content = (
      <table className="table table--notes">
        <thead className="table__head">
          <tr>
            <th scope="col" className="table__th note__status">
              Username
            </th>
            <th scope="col" className="table__th note__created">
              Created
            </th>
            <th scope="col" className="table__th note__updated">
              Updated
            </th>
            <th scope="col" className="table__th note__title">
              Title
            </th>
            <th scope="col" className="table__th note__username">
              Owner
            </th>
            <th scope="col" className="table__th note__edit">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{tableContents}</tbody>
      </table>
    )
  }

  return content
}

export default NotesList
