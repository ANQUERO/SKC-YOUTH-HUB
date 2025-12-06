import style from '@styles/adminAuth.module.scss';
import { Link } from 'react-router-dom';

const PersonalDetails = ({ next, handleChange, data }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!data.first_name || !data.last_name || !data.organization || !data.position || !data.role) {
      alert("Please fill in all required fields");
      return;
    }
    
    next();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className={style.title}>Personal Details</h2>

      <div className={style.group1}>
        <div className={style['form-group']}>
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            name="first_name"
            id="first_name"
            placeholder="First Name"
            value={data.first_name}
            onChange={(e) => handleChange("first_name", e.target.value)}
          />
        </div>

        <div className={style['form-group']}>
          <label htmlFor="last_name">Last Name</label>
          <input
            type="text"
            name="last_name"
            id="last_name"
            placeholder="Last Name"
            value={data.last_name}
            onChange={(e) => handleChange("last_name", e.target.value)}
          />
        </div>
      </div>

      <div className={style.group2}>
        <div className={style['form-group']}>
          <label htmlFor="organization">Organization</label>
          <input
            type="text"
            name="organization"
            id="organization"
            placeholder="Organization"
            value={data.organization}
            onChange={(e) => handleChange("organization", e.target.value)}
          />
        </div>

        <div className={style['form-group']}>
          <label htmlFor="position">Position</label>
          <input
            type="text"
            name="position"
            id="position"
            placeholder="Position"
            value={data.position}
            onChange={(e) => handleChange("position", e.target.value)}
          />
        </div>
      </div>

      <div className={style['form-group']}>
        <label htmlFor="role">Select Role</label>
        <select
          name="role"
          id="role"
          className={style.select}
          value={data.role}
          onChange={(e) => handleChange("role", e.target.value)}
        >
          <option value="">Select a role</option>
          <option value="super_sk_admin">Super SK Admin</option>
          <option value="natural_sk_admin">Natural SK Admin</option>
        </select>
      </div>

      <button type="submit" className={style.button}>
        Next
      </button>

      <Link to='/signin' className={style.link}>
        Already have an account? <span className={style.login}>Login</span>
      </Link>
    </form>
  );
};

export default PersonalDetails;
