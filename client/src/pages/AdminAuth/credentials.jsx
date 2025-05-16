import React from 'react';
import style from '@styles/adminAuth.module.scss'

const Credentials = ({ prev, handleChange, data }) => {
  const handleSubmit = () => {
    alert("Registration complete!\n" + JSON.stringify(data, null, 2));
  };

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
        <input type="checkbox" className={style.check}/> I accept the terms of service.
      </label>
      <button onClick={handleSubmit}>Sign Up</button>
      <button onClick={prev} className={style.back}>Back</button>
    </div>
  );
};

export default Credentials;
