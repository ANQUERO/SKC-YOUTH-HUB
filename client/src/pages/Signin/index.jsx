import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
  Alert,
  Link,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import Logo from '@images/logo.jpg';
import style from '@styles/signin.module.scss';
import useLogin from '@hooks/useSignin';

const errorBoxStyles = {
  mt: 0.5,
  ml: 1,
  backgroundColor: '#ffe6e6',
  color: '#d32f2f',
  px: 1.5,
  py: 0.5,
  borderRadius: '6px',
  fontSize: '0.85rem',
  maxWidth: '300px',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-5px',
    left: '10px',
    width: 0,
    height: 0,
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderBottom: '6px solid #ffe6e6',
  },
};

const Signin = () => {
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPassword, setShowPassword] = useState(false);

  const { login, loading, errors, validateField } = useLogin();
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    const value = field === 'remember' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field !== 'remember') validateField(field, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { success, user } = await login(form.email, form.password);

    if (success && user) {
      const route = user.userType === 'admin' ? '/dashboard' : user.userType === 'youth' ? '/feed' : '/';
      navigate(route);
    }
  };

  const renderField = (label, field, type = 'text', showToggle = false) => (
    <Box sx={{ mb: 2 }}>
      <TextField
        label={label}
        type={showToggle ? (showPassword ? 'text' : 'password') : type}
        fullWidth
        required
        size="small"
        value={form[field]}
        onChange={handleChange(field)}
        error={Boolean(errors?.[field])}
        autoComplete={field}
        InputProps={
          showToggle
            ? {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }
            : undefined
        }
      />
      {errors?.[field] && <Box sx={errorBoxStyles}>{errors[field]}</Box>}
    </Box>
  );

  return (
    <div className={style.container}>
      {/* LEFT SIDE */}
      <div className={style.left}>
        <div className={style.text}>
          <img src={Logo} alt="SK Logo" className={style.logo} />
          <h1 className={style.title}>Catarman community</h1>
          <p className={style.tagline}>
            Our philosophy is simple: transparency, engagement, and accountability.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className={style.right}>
        <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}>
          <Typography variant="h3" gutterBottom>
            Welcome back
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Through clear communication and engagement, we empower young voters to stay informed,
            participate, and shape their communities.
          </Typography>

          {errors?.general && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.general}
            </Alert>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {renderField('Email', 'email', 'email')}
            {renderField('Password', 'password', 'password', true)}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.remember}
                    onChange={handleChange('remember')}
                    size="small"
                  />
                }
                label="Remember me"
              />
              <Link component={RouterLink} to="/forgot" variant="body2">
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, mb: 1 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : 'Login'}
            </Button>

            <Typography variant="body2" align="center">
              Don’t have an account?{' '}
              <Link component={RouterLink} to="/signup">
                Signup
              </Link>
            </Typography>
          </form>
        </Box>
      </div>
    </div>
  );
};

export default Signin;
