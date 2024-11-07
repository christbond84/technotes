import { useState, useEffect } from "react"
import { useAddNewNoteMutation } from "./notesApiSlice"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"

const NewNoteForm = ({ users }) => {
  const [addNewNote, { isLoading, isError, isSuccess, error }] =
    useAddNewNoteMutation()

  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [text, setText] = useState("")
  const [userId, setUserId] = useState(users[0].id)

  useEffect(() => {
    if (isSuccess) {
      setTitle("")
      setText("")
      setUserId("")
      navigate("/dash/notes")
    }
  }, [isSuccess, navigate])

  const onTitleChanged = (e) => setTitle(e.target.value)
  const onTextChanged = (e) => setText(e.target.value)
  const onUserIdChanged = (e) => setUserId(e.target.value)

  const canSave = [userId, title, text].every(Boolean) && !isLoading

  const onSaveNote = async (e) => {
    e.preventDefault()
    if (canSave) {
      await addNewNote({ user: userId, title, text })
    }
  }
  const options = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.username}
    </option>
  ))

  const errClass = isError ? "errmsg" : "offscreen"
  const validTitleClass = !title ? "form__input--incomplete" : ""
  const validTextClass = !text ? "form__input--incomplete" : ""

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>
      <form className="form" onSubmit={onSaveNote}>
        <div className="form__title-row">
          <h2>New note</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>

        <label htmlFor="title" className="form__label">
          Title:{" "}
        </label>
        <input
          id="title"
          name="title"
          onChange={onTitleChanged}
          type="text"
          className={`form__input ${validTitleClass}`}
          autoComplete="off"
          value={title}
        />

        <label htmlFor="text" className="form__label">
          Text:{" "}
        </label>
        <textarea
          name="text"
          id="text"
          value={text}
          onChange={onTextChanged}
          className={`form__input form__input--text ${validTextClass}`}
        ></textarea>

        <label
          htmlFor="username"
          className="form__label form__checkbox-container"
        >
          Assigned to:{" "}
        </label>
        <select
          name="username"
          id="username"
          value={userId}
          className="form__select"
          onChange={onUserIdChanged}
        >
          {options}
        </select>
      </form>
    </>
  )
  return content
}

export default NewNoteForm
