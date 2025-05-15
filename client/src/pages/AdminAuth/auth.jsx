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
              <input
                type="text"
                name="name"
                autoComplete="off"
                placeholder="Username"
              />
              <input
                type="email"
                name="email"
                autoComplete="off"
                placeholder="Email"
              />
            </div>

            <div className={style.group2}>
              <input
                type="password"
                name="password"
                autoComplete="off"
                placeholder="Password"
              />

              <input
                type="password"
                name="password"
                autoComplete="off"
                placeholder="Password"
              />

            </div>

            <input
              type="password"
              name="password"
              autoComplete="off"
              placeholder="Password"
            />

            <button type="submit" className={style.button}>
              Sign up
            </button>
          </form>

          <p className={style.changeAuthentication}>
            Already have an account?
            <span
              className={style.span}>
              Sign in
            </span>
          </p>

        </div>
      </div>
      {/*End of Right panel */}

    </div>

  );
}

export default AdminAuth