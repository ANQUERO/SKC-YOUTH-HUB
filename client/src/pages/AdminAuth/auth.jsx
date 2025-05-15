import style from '@styles/adminAuth.module.scss'

const AdminAuth = () => {
  return (

    <div className={style.container}>

      {/* Left panel */}
      <div className={style.left}>

        <div className={style.text}>

          <img src="" alt="Logo" className={style.logo} />
          <h1 className={style.title}>Admins Registration Form</h1>
          <h2 className={style.tagline}>
            Please fill then required information given.
          </h2>
          <p className={style.link}>
            Already have and account?
            <span>Login</span>
          </p>
        </div>

      </div>
      {/* End of Left panel */}

      {/* Right panel */}
      <div className={style.right}>
        <div className={style.box}>

          <h2 className={style.title}> Personal Details </h2>

          <form>
            <div className={style.group1}>
              <div className={style['form-group']}>
                <label htmlFor="first_name">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  id="first_name"
                  autoComplete="off"
                  placeholder="First Name"
                />
              </div>

              <div className={style['form-group']}>
                <label htmlFor="last_name">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  id="last_name"
                  autoComplete="off"
                  placeholder="Last Name"
                />
              </div>
            </div>

            <div className={style.group2}>
              <div className={style['form-group']}>
                <label htmlFor="position">Position</label>
                <input
                  type="position"
                  name="position"
                  id="position"
                  autoComplete="off"
                  placeholder="position"
                />
              </div>

              <div className={style['form-group']}>
                <label htmlFor="confirm_password">Confirm Password</label>
                <input
                  type="password"
                  name="confirm_password"
                  id="confirm_password"
                  autoComplete="off"
                  placeholder="Confirm Password"
                />
              </div>
            </div>

            <div className={style['form-group']}>
              <label htmlFor="admin_code">Admin Code</label>
              <input
                type="password"
                name="admin_code"
                id="admin_code"
                autoComplete="off"
                placeholder="Admin Code"
              />
            </div>

            <button type="submit" className={style.button}>
              Next
            </button>
          </form>

        </div>
      </div>
      {/*End of Right panel */}

    </div>

  );
}

export default AdminAuth