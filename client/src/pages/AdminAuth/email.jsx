import React from 'react';

const Email = ({ next, prev, handleChange, data }) => {
  return (
    <div>
      <h2>Check your email for a verification link</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={data.email}
        onChange={(e) => handleChange("email", e.target.value)}
      />
      <p>If the email doesn’t arrive, check your spam folder.</p>
      <button onClick={prev}>Back</button>
      <button onClick={next}>Continue</button>
    </div>
  );
};

export default Email;
