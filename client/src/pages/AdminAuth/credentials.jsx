import React from 'react';

const Credentials = ({ prev, handleChange, data }) => {
  const handleSubmit = () => {
    alert("Registration complete!\n" + JSON.stringify(data, null, 2));
  };

  return (
    <div>
      <h2>Sign Up</h2>
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
      <label>
        <input type="checkbox" /> I accept the terms of service.
      </label>
      <button onClick={prev}>Back</button>
      <button onClick={handleSubmit}>Sign Up</button>
    </div>
  );
};

export default Credentials;
