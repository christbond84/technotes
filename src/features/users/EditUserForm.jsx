import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState, useEffect } from "react"
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice"
import ROLES from "../../config/roles"
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const EditUserForm = ({ user }) => {
  const [updateUser, { isLoading, isError, isSuccess, error }] =
    useUpdateUserMutation()
  const [
    deleteUser,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteUserMutation()

  const [username, setUsername] = useState(user.username)
  const [validUsername, setValidUsername] = useState(false)
  const [password, setPassword] = useState("")
  const [validPassword, setValidPassword] = useState(false)
  const [roles, setRoles] = useState(user.roles)
  const [active, setActive] = useState(user.active)
  const navigate = useNavigate()

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username))
  }, [username])

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password))
  }, [password])

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setPassword("")
      setUsername("")
      setRoles([])
      navigate("/dash/users")
    }
  }, [isSuccess, isDelSuccess, navigate])

  const onUsernameChanged = (e) => setUsername(e.target.value)
  const onPasswordChanged = (e) => setPassword(e.target.value)
  const onRolesChanged = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    )
    setRoles(values)
  }
  const onActiveChanged = () => setActive((prev) => !prev)

  const onSaveUser = async () => {
    if (password) {
      await updateUser({ id: user.id, username, password, roles, active })
    } else {
      await updateUser({ id: user.id, username, roles, active })
    }
  }
  const onDeleteUser = async () => {
    await deleteUser({ id: user.id })
  }

  const options = Object.values(ROLES).map((role) => (
    <option key={role} value={role}>
      {role}
    </option>
  ))
  let canSave
  if (password) {
    canSave =
      [roles.length, validUsername, validPassword].every(Boolean) && !isLoading
  } else {
    canSave = [roles.length, validUsername].every(Boolean) && !isLoading
  }

  const errClass = isError ? "errmsg" : "offscreen"
  const validUserClass = !validUsername ? "form__input--incomplete" : ""
  const validPwdClass =
    password && !validPassword ? "form__input--incomplete" : ""
  const validRolesClass = !Boolean(roles.length)
    ? "form__input--incomplete"
    : ""

  const errContent = (error?.data?.message || delerror?.data?.message) ?? ""

  const content = (
    <>
      <p className={errClass}>{errContent}</p>
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit User</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              onClick={onSaveUser}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button
              className="icon-button"
              title="Delete"
              onClick={onDeleteUser}
            >
              <FontAwesomeIcon icon={faTrashCan} />
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
          Password:{" "}
          <span className="nowrap">
            [empty = no change] [4-12 chars inc. !@#$%]
          </span>
        </label>
        <input
          className={`form__input ${validPwdClass}`}
          type="password"
          id="password"
          name="password"
          onChange={onPasswordChanged}
          value={password}
        />

        <label
          htmlFor="user-active"
          className="form__label form__checkbox-container"
        >
          Active:
          <input
            className="form__checkbox"
            type="checkbox"
            id="user-active"
            name="user-active"
            onChange={onActiveChanged}
            checked={active}
          />
        </label>

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

export default EditUserForm
