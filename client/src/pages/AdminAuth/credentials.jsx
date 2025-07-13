import React, { useState } from 'react';
import style from '@styles/adminAuth.module.scss';
import { useNavigate } from 'react-router-dom';

const Credentials = ({ prev, handleChange, handleSubmit, data }) => {
  const [acceptTerms, setAcceptTerms] = useState(false);

  return (
    <div className={style.credentials}>
      <h2 className={style.signupTitle}>Sign Up</h2>

      <input
        type="password"
        placeholder="Password"
        value={data.password}
        onChange={(e) => handleChange("password", e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={data.confirmPassword}
        onChange={(e) => handleChange("confirmPassword", e.target.value)}
      />

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
        onClick={() => {
          if (acceptTerms) {
            handleSubmit();
          } else {
            alert("Please accept the terms of service.");
          }
        }}
        className={style.button}
      >
        Sign Up
      </button>

      <button onClick={prev} className={style.back}>Back</button>
    </div>
  );
};

export default Credentials;
