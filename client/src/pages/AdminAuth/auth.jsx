import style from '@styles/adminAuth.module.scss'

const AdminAuth = () => {
  return (

    <div className={style.container}>

      {/* Left panel */}
      <div className={style.left}>
        <div className={style.text}>
          <h1 className={style.logo}>ANQUERO</h1>
          <h2 className={style.tagline}>
            Simple task <br /> management
          </h2>
        </div>

      </div>
      {/* End of Left panel */}

      {/* Right panel */}
      <div className={style.right}>
        <div className={style.box}>

          <h2 className={style.title}> Sign up</h2>

          <form>

          
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