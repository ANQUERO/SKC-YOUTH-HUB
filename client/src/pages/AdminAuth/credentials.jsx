import React from 'react';
import style from '@styles/adminAuth.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { adminAuth } from '@hooks/adminAuthThunk.js';

const Credentials = ({ prev, handleChange }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector(state => state.adminAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const {
      first_name,
      last_name,
      email,
      organization,
      position,
      password,
      role
    } = data;

    const formData = {
      first_name,
      last_name,
      email,
      organization,
      position,
      password,
      role
    };

    console.log('Form Data:', formData);

    try {
      const resultAction = await dispatch(adminAuth(formData));

      if (adminAuth.fulfilled.match(resultAction)) {
        navigate('/signin');
      } else {
        console.error("Registration failed", resultAction.payload);
        alert("Error: " + (resultAction.payload?.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Unexpected error", err);
    }
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
        <input type="checkbox" className={style.check} /> I accept the terms of service.
      </label>

      <button onClick={handleSubmit} className={style.button}>
        Sign Up
      </button>

      <button onClick={prev} className={style.back}>Back</button>
    </div>
  );
};

export default Credentials;
