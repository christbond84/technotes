import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState, useEffect } from "react"
import { useAddNewUserMutation } from "./usersApiSlice"
import ROLES from "../../config/roles"
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const NewUserForm = () => {
  const [addNewUser, { isLoading, isError, isSuccess, error }] =
    useAddNewUserMutation()
  const [username, setUsername] = useState("")
  const [validUsername, setValidUsername] = useState(false)
  const [password, setPassword] = useState("")
  const [validPassword, setValidPassword] = useState(false)
  const [roles, setRoles] = useState(["Employee"])
  const navigate = useNavigate()

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username))
  }, [username])

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password))
  }, [password])

  useEffect(() => {
    if (isSuccess) {
      setPassword("")
      setUsername("")
      setRoles([])
      navigate("/dash/users")
    }
  }, [isSuccess, navigate])

  const onUsernameChanged = (e) => setUsername(e.target.value)
  const onPasswordChanged = (e) => setPassword(e.target.value)
  const onRolesChanged = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    )
    setRoles(values)
  }

  const canSave =
    [roles.length, username, password].every(Boolean) && !isLoading

  const onSaveUser = async (e) => {
    e.preventDefault()
    if (canSave) {
      await addNewUser({ username, password, roles })
    }
  }

  const options = Object.values(ROLES).map((role) => (
    <option key={role} value={role}>
      {role}
    </option>
  ))

  const errClass = isError ? "errmsg" : "offscreen"
  const validUserClass = !validUsername ? "form__input--incomplete" : ""
  const validPwdClass = !validPassword ? "form__input--incomplete" : ""
  const validRolesClass = !Boolean(roles.length)
    ? "form__input--incomplete"
    : ""

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>
      <form className="form" onSubmit={onSaveUser}>
        <div className="form__title-row">
          <h2>New User</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>

        <label htmlFor="username" className="form__label">
          Username: <span className="nowrap">[3-20 letters]</span>
        </label>
        <input
          className={`form__input ${validUserClass}`}
          type="text"
          id="username"
          name="username"
          onChange={onUsernameChanged}
          autoComplete="off"
          value={username}
        />

        <label htmlFor="password" className="form__label">
          Password: <span className="nowrap">[4-12 chars inc. !@#$%]</span>
        </label>
        <input
          className={`form__input ${validPwdClass}`}
          type="password"
          id="password"
          name="password"
          onChange={onPasswordChanged}
          value={password}
        />
        <label className="form__label" htmlFor="roles">
          Assigned Roles:
        </label>
        <select
          name="roles"
          id="roles"
          className={`form__select ${validRolesClass}`}
          size={3}
          value={roles}
          multiple={true}
          onChange={onRolesChanged}
        >
          {options}
        </select>
      </form>
    </>
  )

  return content
}

export default NewUserForm
