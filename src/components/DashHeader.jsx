// import { useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faFileCirclePlus,
  faFilePen,
  faUserGear,
  faUserPlus,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons"
import { useSendLogoutMutation } from "../features/auth/authApiSlice"
import useAuth from "../hooks/useAuth"
import { RingLoader } from "react-spinners"

const DASH_REGEX = /^\/dash(\/)?$/
const NOTES_REGEX = /^\/dash\/notes(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/

const DashHeader = () => {
  const { isAdmin, isManager } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation()

  // useEffect(() => {
  //   console.log("Success " + isSuccess)
  //   if (isSuccess) navigate("/")
  // }, [isSuccess, navigate])

  const onNewNoteClicked = () => navigate("/dash/notes/new")
  const onNewUserClicked = () => navigate("/dash/users/new")
  const onNotesClicked = () => navigate("/dash/notes")
  const onUsersClicked = () => navigate("/dash/users")

  let dashClass = null
  if (
    !DASH_REGEX.test(pathname) &&
    !USERS_REGEX.test(pathname) &&
    !NOTES_REGEX.test(pathname)
  ) {
    dashClass = "dash-header__container--small"
  }

  let newNoteButton = null
  if (NOTES_REGEX.test(pathname)) {
    newNoteButton = (
      <button
        className="icon-button"
        title="New note"
        onClick={onNewNoteClicked}
      >
        <FontAwesomeIcon icon={faFileCirclePlus} />
      </button>
    )
  }

  let newUserButton = null
  if (USERS_REGEX.test(pathname)) {
    newUserButton = (
      <button
        className="icon-button"
        title="New User"
        onClick={onNewUserClicked}
      >
        <FontAwesomeIcon icon={faUserPlus} />
      </button>
    )
  }

  let notesButton = null
  if (!NOTES_REGEX.test(pathname) && pathname.includes("/dash")) {
    notesButton = (
      <button className="icon-button" title="Notes" onClick={onNotesClicked}>
        <FontAwesomeIcon icon={faFilePen} />
      </button>
    )
  }

  let usersButton = null
  if ((isManager || isAdmin) && !USERS_REGEX.test(pathname)) {
    usersButton = (
      <button className="icon-button" title="Users" onClick={onUsersClicked}>
        <FontAwesomeIcon icon={faUserGear} />
      </button>
    )
  }

  const logoutButton = (
    <button
      className="icon-button"
      title="Logout"
      onClick={() => {
        localStorage.clear()
        navigate("/")
        sendLogout()
      }}
    >
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  )

  const errClass = isError ? "errmsg" : "offscreen"

  let buttonContent = null
  if (isLoading) buttonContent = <RingLoader color={"#FFF"} />
  else {
    buttonContent = (
      <>
        {newNoteButton}
        {newUserButton}
        {notesButton}
        {usersButton}
        {logoutButton}
      </>
    )
  }

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>
      <header className="dash-header">
        <div className={`dash-header__container ${dashClass}`}>
          <Link to={"/dash"}>
            <h1 className="dash-header__title">techNotes</h1>
          </Link>
          <nav className="dash-header__nav">{buttonContent}</nav>
        </div>
      </header>
    </>
  )
  return content
}

export default DashHeader
