import { useGetUsersQuery } from "./usersApiSlice"
import User from "./User"
import { PuffLoader } from "react-spinners"

const UsersList = () => {
  const {
    data: users,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useGetUsersQuery("usersList", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  })

  let content
  if (isLoading) content = <PuffLoader color={"#FFF"} />
  if (isError) content = <p className="errmsg">{error.data?.message}</p>
  if (isSuccess) {
    const { ids } = users
    const tableContents =
      ids?.length && ids.map((userId) => <User key={userId} userId={userId} />)

    content = (
      <table className="table table--users">
        <thead className="table__head">
          <tr>
            <th scope="col" className="table__th user__username">
              Username
            </th>
            <th scope="col" className="table__th user__roles">
              Roles
            </th>
            <th scope="col" className="table__th user__edit">
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

export default UsersList
