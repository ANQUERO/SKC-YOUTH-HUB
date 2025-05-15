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
                <label htmlFor="position">Organization</label>
                <input
                  type="text"
                  name="organization"
                  id="organization"
                  autoComplete="off"
                  placeholder="organization"
                />
              </div>

              <div className={style['form-group']}>
                <label htmlFor="position">Position</label>
                <input
                  type="text"
                  name="position"
                  id="position"
                  autoComplete="off"
                  placeholder="Position"
                />
              </div>
            </div>

            <div className={style['form-group']}>
              <label htmlFor="role">Select Role</label>
              <select name="role" id="role" className={style.select}>
                <option value="super_sk_admin">Super SK Admin</option>
                <option value="natural_sk_admin">Natural SK Admin</option>
              </select>
            </div>

            <button type="submit" className={style.button}>
              Next
            </button>

             <p className={style.link}>
               Already have and account?
            <span className={style.login}> Login </span>
          </p>
          </form>

        </div>
      </div>
      {/*End of Right panel */}

    </div>

  );
}

export default AdminAuth