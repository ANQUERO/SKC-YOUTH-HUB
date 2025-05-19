import React from 'react';
import Logo from '@images/logo.jpg';
import style from '@styles/signin.module.scss';

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
          <label htmlFor="username">Username</label>
          <input id="username" type="text" placeholder="Enter your username" />

          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="Enter your password" />

          <div className={style.formOptions}>
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit" className={style.loginBtn}>
            Login →
          </button>

          <div className={style.orDivider}>or</div>

          <button type="button" className={style.googleBtn}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
              alt="Google"
            />
            Sign in with Google
          </button>

          <p className={style.signupLink}>
            Don’t have an account? <a href="#">Create an account</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signin;
