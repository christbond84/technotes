import { Link } from "react-router-dom"

const Public = () => {
  const content = (
    <section className="public">
      <header>
        <h1>
          Welcome to <span className="nowrap">compuTech Repairs!</span>
        </h1>
      </header>
      <main className="public__main">
        <p>
          Located in Beautiful Trivandrum City, Computech Repairs provides a
          trained staff ready to meet your tech repair needs.
        </p>
        <address className="public__addr">
          compuTech Repairs
          <br />
          555 Statue Lane
          <br />
          East Fort, Trivandrum 695541
          <br />
          <a href="tel:+15555555555">(944) 123-4567</a>
        </address>
        <br />
        <p>Owner: Joseph George</p>
      </main>
      <footer>
        <Link to={"/login"}>Employee login</Link>
      </footer>
    </section>
  )
  return content
}

export default Public
