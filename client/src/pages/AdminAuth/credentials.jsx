import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from '@styles/adminAuth.module.scss';

const Credentials = ({ prev, handleChange, handleSubmit, data, loading, errors }) => {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!acceptTerms) {
      alert("Please accept the terms of service.");
      return;
    }

    const success = await handleSubmit();
    if (success) navigate('/login');
  };

  return (
    <form onSubmit={onSubmit} className={style.credentials}>
      <h2 className={style.signupTitle}>Sign Up</h2>

      <input
        type="email"
        placeholder="Email"
        value={data.email}
        onChange={(e) => handleChange("email", e.target.value)}
      />
      {errors?.email && <p className={style.error}>{errors.email}</p>}

      <input
        type="password"
        placeholder="Password"
        value={data.password}
        onChange={(e) => handleChange("password", e.target.value)}
      />
      {errors?.password && <p className={style.error}>{errors.password}</p>}

      <input
        type="password"
        placeholder="Confirm Password"
        value={data.confirmPassword}
        onChange={(e) => handleChange("confirmPassword", e.target.value)}
      />
      {data.password !== data.confirmPassword && (
        <p className={style.error}>Passwords do not match.</p>
      )}

      <label className={style.terms}>
        <input
          type="checkbox"
          className={style.check}
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
        />
        I accept the terms of service.
      </label>

      <button
        type="submit"
        className={style.button}
        disabled={loading}
      >
        {loading ? "Signing up..." : "Sign Up"}
      </button>

      <button type="button" onClick={prev} className={style.back}>Back</button>
    </form>
  );
};

export default Credentials;
