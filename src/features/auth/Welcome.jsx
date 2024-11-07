import { Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

const Welcome = () => {
  const { isManager, isAdmin } = useAuth()
  const today = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(new Date())

  const content = (
    <section className="welcome">
      <p>{today}</p>
      <h1>Welcome!</h1>
      <p>
        <Link to={"/dash/notes"}>View techNotes</Link>
      </p>
      <p>
        <Link to={"/dash/notes/new"}>Add new techNotes</Link>
      </p>
      {(isManager || isAdmin) && (
        <>
          <p>
            <Link to={"/dash/users"}>View user settings</Link>
          </p>
          <p>
            <Link to={"/dash/users/new"}>Add new user</Link>
          </p>
        </>
      )}
    </section>
  )
  return content
}

export default Welcome
