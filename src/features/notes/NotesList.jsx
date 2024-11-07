import { useGetNotesQuery } from "./notesApiSlice"
import Note from "./Note"
import useAuth from "../../hooks/useAuth"
import { RingLoader } from "react-spinners"

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
  if (isLoading) content = <RingLoader color={"#FFF"} />
  if (isError) content = <p className="errmsg">{error.data?.message}</p>
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