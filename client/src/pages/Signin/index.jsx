import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '@images/logo.jpg';
import style from '@styles/signin.module.scss';
import useLogin from '@hooks/useSignin'; // <- import the hook

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, errors, user } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { success, user } = await login(email, password);

    if (success && user) {
      if (user.userType === 'admin') {
        navigate('/dashboard');
      } else if (user.userType === 'youth') {
        navigate('/feed');
      } else {
        alert("Unknown user type");
      }
    }
  };


  return (
    <div className={style.container}>
      <div className={style.left}>
        <div className={style.text}>
          <img src={Logo} alt="SK Logo" className={style.logo} />
          <h1 className={style.title}>Catarman community</h1>
          <p className={style.tagline}>
            Our philosophy is simple: transparency, engagement, and accountability.
          </p>
        </div>
      </div>

      <div className={style.right}>
        <div className={style.box}>
          <h2 className={style.title}>Welcome back</h2>
          <p className={style.tagline}>
            Through clear communication and engagement, we empower young voters to stay informed,
            participate, and shape their communities.
          </p>
        </div>

        <form className={style.form} onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors?.email && <p className={style.error}>{errors.email}</p>}

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors?.password && <p className={style.error}>{errors.password}</p>}
          {errors?.general && <p className={style.error}>{errors.general}</p>}

          <div className={style.formOptions}>
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot">Forgot password?</Link>
          </div>

          <button type="submit" className={style.loginBtn} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
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
