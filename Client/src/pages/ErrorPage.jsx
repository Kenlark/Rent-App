import { useRouteError, Link } from "react-router-dom";

import logo from "../assets/images/undraw_page_not_found_re_e9o6.svg";

function ErrorPage() {
  const error = useRouteError();

  if (error.status === 404) {
    return (
      <section className="section-center-404">
        <h1>404</h1>
        <p>Page introuvable</p>
        <img src={logo} alt="Error 404" />
        <Link to="/" className="Error-redirect">
          Retour à l&apos;accueil
        </Link>
      </section>
    );
  }

  return (
    <section className="section-center-404">
      <h1>Une erreur s&apos;est produite</h1>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <img src={logo} alt="Error 404" className="img-404" />
      <div className="link-404">
        <Link to="/" className="Error-redirect">
          Retour à l&apos;accueil
        </Link>
      </div>
    </section>
  );
}

export default ErrorPage;
