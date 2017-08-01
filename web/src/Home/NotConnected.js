/* @flow */
import React from 'react';
import { Link } from 'react-router-dom';
import CrickLogoImg from './img/logo-crick.png';

const NotConnected = () =>
  <div className="wrapper">
    <header className="brand">
      <div className="logo">
        <img src={CrickLogoImg} alt="Crick Logo" />
      </div>
      <div className="title">
        <h1>
          <Link to="/">
            <span>app.</span>
            crick
            <span>.io</span>
          </Link>
        </h1>
        <div className="baseline">
          An <a href="https://github.com/TailorDev/crick">open-source</a> backend
          for <a href="https://github.com/TailorDev/Watson">Watson</a>, the CLI
          to track your time.
        </div>
      </div>
    </header>

    <div className="content">
      Login now to start using Crick!
    </div>

    <footer className="copyright">
      Handcrafted by the good people
      at <a href="https://tailordev.fr">TailorDev</a>.
    </footer>
  </div>;

export default NotConnected;
