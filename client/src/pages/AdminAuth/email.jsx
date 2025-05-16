import React from 'react';
import style from '@styles/adminAuth.module.scss'

const Email = ({ next, prev, handleChange, data }) => {
  return (
    <div className={style.emailBox}>
      <h2 className={style.emailTitle}>Check your email for a
        verification link</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={data.email}
        onChange={(e) => handleChange("email", e.target.value)}
      />
      <p className={style.emailDesc}>If the email doesn't arrive within a few minutes, 
        please be sure to check your spam or junk folder.</p>
      <button onClick={next}>Continue</button>
      <button onClick={prev} className={style.back}>Back</button>
    </div>
  );
};

export default Email;
