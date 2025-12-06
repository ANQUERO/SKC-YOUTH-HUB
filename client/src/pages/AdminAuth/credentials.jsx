import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from '@styles/adminAuth.module.scss';

const Credentials = ({ prev, handleChange, handleSubmit, data, loading, errors }) => {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const navigate = useNavigate();

  // Check if passwords match and confirmPassword is not empty
  const passwordsMatch = data.confirmPassword && data.password === data.confirmPassword;
  const showPasswordError = data.confirmPassword && !passwordsMatch;

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!passwordsMatch) {
      alert("Passwords do not match.");
      return;
    }

    if (!acceptTerms) {
      alert("Please accept the terms of service.");
      return;
    }

    const success = await handleSubmit();
    if (success) {
      navigate('/login');
    }
  };

  return (
    <form onSubmit={onSubmit} className={style.credentials}>
      <h2 className={style.signupTitle}>Sign Up</h2>

      <input
        type="email"
        placeholder="Email"
        value={data.email}
        onChange={(e) => handleChange("email", e.target.value)}
        required
      />
      {errors?.email && <p className={style.error}>{errors.email}</p>}

      <input
        type="password"
        placeholder="Password"
        value={data.password}
        onChange={(e) => handleChange("password", e.target.value)}
        required
        minLength={8}
      />
      {errors?.password && <p className={style.error}>{errors.password}</p>}

      <input
        type="password"
        placeholder="Confirm Password"
        value={data.confirmPassword}
        onChange={(e) => handleChange("confirmPassword", e.target.value)}
        required
        minLength={8}
      />
      {showPasswordError && (
        <p className={style.error}>Passwords do not match.</p>
      )}

      <label className={style.terms}>
        <input
          type="checkbox"
          className={style.check}
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          required
        />
        I accept the terms of service.
      </label>

      <div className={style.buttonGroup}>
        <button
          type="button"
          onClick={prev}
          className={style.back}
          disabled={loading}
        >
          Back
        </button>
        <button
          type="submit"
          className={style.button}
          disabled={loading || !acceptTerms || !passwordsMatch}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </div>
    </form>
  );
};

export default Credentials;