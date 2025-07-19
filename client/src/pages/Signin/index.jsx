import React from 'react';
import Logo from '@images/logo.jpg';
import style from '@styles/signin.module.scss';
import { Link } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";

const Signin = () => {
  return (
    <div className={style.container}>
      <div className={style.left}>
        <div className={style.text}>
          <img src={Logo} alt="SK Logo" className={style.logo} />
          <h1 className={style.title}>Welcome to our community</h1>
          <p className={style.tagline}>
            Our philosophy is simple: transparency, engagement, and accountability.
          </p>
        </div>
      </div>

      <div className={style.right}>
        <div className={style.box}>
          <h2 className={style.title}>Join SKC: Youth Catarman</h2>
          <p className={style.tagline}>
            Through clear communication and engagement, we empower young voters to stay informed,
            participate, and shape their communities.
          </p>
        </div>

        <form className={style.form}>
          <label htmlFor="username">Email</label>
          <input id="email" type="email" placeholder="Enter your email" />

          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="Enter your password" />

          <div className={style.formOptions}>
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot">Forgot password?</Link>
          </div>

          <button type="submit" className={style.loginBtn}>
            Login
          </button>

          <div className={style.orDivider}>or</div>

          <button type="button" className={style.googleBtn}>
            <FcGoogle className={style.google} />
            Signin with Google
          </button>

          <p className={style.signupLink}>
            Don’t have an account? <Link to="/signup">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signin;
