// components/AdminAuth.jsx
import style from '@styles/adminAuth.module.scss';
import StepWrapper from './wrapper.jsx';

const AdminAuth = () => {
  return (
    <div className={style.container}>
      {/* Left panel */}
      <div className={style.left}>
        <div className={style.text}>
          <img src="" alt="Logo" className={style.logo} />
          <h1 className={style.title}>Admins Registration Form</h1>
          <h2 className={style.tagline}>
            Please fill the required information given.
          </h2>
        </div>
      </div>

      {/* Right panel */} 
      <div className={style.right}>
        <div className={style.box}>
          <StepWrapper />
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
