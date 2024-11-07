import { useState, useEffect } from "react"
import { useUpdateNoteMutation, useDeleteNoteMutation } from "./notesApiSlice"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

const EditNoteForm = ({ note, users }) => {
  const { isAdmin, isManager } = useAuth()
  const [updateNote, { isLoading, isSuccess, isError, error }] =
    useUpdateNoteMutation()
  const [
    deleteNote,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteNoteMutation()

  const navigate = useNavigate()
  const [title, setTitle] = useState(note.title)
  const [text, setText] = useState(note.text)
  const [completed, setCompleted] = useState(note.completed)
  const [userId, setUserId] = useState(note.user)

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setTitle("")
      setText("")
      setUserId("")
      navigate("/dash/notes")
    }
  }, [isSuccess, isDelSuccess, navigate])

  const onTitleChanged = (e) => setTitle(e.target.value)
  const onTextChanged = (e) => setText(e.target.value)
  const onCompletedChanged = (e) => setCompleted((prev) => !prev)
  const onUserIdChanged = (e) => setTitle(e.target.value)

  const canSave = [title, text, userId].every(Boolean) && !isLoading

  const onSaveNote = async () => {
    if (canSave) {
      await updateNote({ id: note.id, user: userId, title, text, completed })
    }
  }
  const onDeleteNote = async () => {
    await deleteNote({ id: note.id })
  }
  const created = new Date(note.createdAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  })
  const updated = new Date(note.updatedAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  })

  const options = users.map((user) => (
    <option value={user.id} key={user.id}>
      {user.username}
    </option>
  ))

  const errClass = isError || isDelError ? "errmsg" : "offscreen"
  const validTitleClass = !title ? "form__input--incomplete" : ""
  const validTextClass = !text ? "form__input--incomplete" : ""
  const errContent = (error?.data?.message || delerror?.data?.message) ?? ""

  let deleteButton = null
  if (isAdmin || isManager) {
    deleteButton = (
      <button className="icon-button" onClick={onDeleteNote} title="Delete">
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
    )
  }

  const content = (
    <>
      <p className={errClass}>{errContent}</p>
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit note #{note.ticket}</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              onClick={onSaveNote}
              title="Save"
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            {deleteButton}
          </div>
        </div>

        <label htmlFor="note-title" className="form__label">
          Title:
        </label>
        <input
          type="text"
          className={`form__input ${validTitleClass}`}
          id="note-title"
          name="title"
          onChange={onTitleChanged}
          value={title}
          autoComplete="off"
        />

        <label htmlFor="note-text" className="form__label">
          Text:
        </label>
        <textarea
          className={`form__input form__input--text${validTextClass}`}
          id="note-text"
          name="text"
          onChange={onTextChanged}
          value={text}
        />
        <div className="form__row">
          <div className="form__divider">
            <label
              htmlFor="note-completed"
              className="form__label form__checkbox-container"
            >
              Work completed:
              <input
                type="checkbox"
                className="form__checkbox"
                id="note-completed"
                name="completed"
                checked={completed}
                onChange={onCompletedChanged}
              />
            </label>
            <label
              htmlFor="note-username"
              className="form__label form__checkbox-container"
            >
              Assigned to:
            </label>
            <select
              name="username"
              id="note-username"
              className="form__select"
              value={userId}
              onChange={onUserIdChanged}
            >
              {options}
            </select>
          </div>
          <div className="form__divider">
            <p className="form__created">
              Created:
              <br />
              {created}
            </p>
            <p className="form__created">
              Updated:
              <br />
              {updated}
            </p>
          </div>
        </div>
      </form>
    </>
  )

  return content
}

export default EditNoteForm
