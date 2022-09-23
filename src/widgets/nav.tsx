import { Link } from "react-router-dom";
import {
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandDiscord,
} from "@tabler/icons";

export default function Nav() {
  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-light fixed-top"
        id="mainNav"
        style={{ background: "#262626" }}
      >
        <div className="container px-4 px-lg-5">
          <img
            className="img-brand logo-bc p-1"
            src="assets/logo.png"
            style={{width: '5vh'}}
            alt=""
          />
          <button
            className="navbar-toggler navbar-toggler-right"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarResponsive"
            aria-controls="navbarResponsive"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="fas fa-bars" aria-hidden="true"></i>
          </button>
          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav ms-auto">
              {/* <li className="nav-item">
                <a
                  className="nav-link"
                  target="_blank"
                  href="#"
                >
                  <IconBrandTwitter size="30" color="#c44d56" />
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" target="_blank" href="#">
                  <IconBrandInstagram size="30" color="#c44d56" />
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  target="_blank"
                  href="#"
                >
                  <IconBrandDiscord size="30" color="#c44d56" />
                </a>
              </li> */}
              <li className="nav-item">
                <Link style={{ textDecoration: "none" }} to={`/request`}>
                  <div className="nav-link req-button">Apply For Listing</div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
