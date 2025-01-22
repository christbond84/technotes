import { useState, useEffect, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useLoginMutation } from "./authApiSlice"
import { setCredentials } from "./authSlice"
import { useDispatch } from "react-redux"
import usePersist from "../../hooks/usePersist"
import { RingLoader } from "react-spinners"

const Login = () => {
  const errRef = useRef()
  const userRef = useRef()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errMsg, setErrMsg] = useState("")
  const [persist, setPersist] = usePersist()

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const errClass = errMsg ? "errmsg" : "offscreen"

  const [Login, { isLoading }] = useLoginMutation()

  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    setErrMsg("")
  }, [username, password])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const accessToken = await Login({ username, password, persist }).unwrap()
      dispatch(setCredentials(accessToken.accessToken))
      setUsername("")
      setPassword("")
      navigate("/dash")
    } catch (err) {
      if (!err.status) {
        setErrMsg("No server response")
      } else if (err.status === 400) {
        setErrMsg("Username or password is missing")
      } else if (err.status === 401) {
        setErrMsg("Unauthorised")
      } else {
        setErrMsg(err.data?.message)
      }
      errRef.current.focus()
    }
  }

  const handleUserInput = (e) => setUsername(e.target.value)
  const handlePwdInput = (e) => setPassword(e.target.value)
  const togglePersist = (e) => setPersist((prev) => !prev)

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

  const content = (
    <section className="public">
      <header>
        <h1>Employee login</h1>
      </header>
      <main className="login">
        <p ref={errRef} className={errClass} aria-live="assertive">
          {errMsg}
        </p>
        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input
            value={username}
            ref={userRef}
            type="text"
            className="form__input"
            autoComplete="off"
            id="username"
            onChange={handleUserInput}
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePwdInput}
            className="form__input"
            required
          />
          <button className="form__submit-button">Sign-In</button>
          <label htmlFor="persist" className="form__persist">
            <input
              type="checkbox"
              id="persist"
              value={persist}
              onChange={togglePersist}
              className="form__checkbox"
            />
            Trust this device
          </label>
        </form>
      </main>
      <footer>
        <Link to={"/"}>Back to home</Link>
      </footer>
    </section>
  )

  return content
}

export default Login
