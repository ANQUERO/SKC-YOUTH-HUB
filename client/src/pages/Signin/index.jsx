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
import { 
  Visibility, 
  VisibilityOff, 
  LoginRounded 
} from '@mui/icons-material';

import Logo from '@images/logo.jpg';
import style from '@styles/signin.module.scss';
import useLogin from '@hooks/useSignin';
import GoogleOAuth from '@components/GoogleOAuth';

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
      const route =
        user.userType === 'official'
          ? '/dashboard'
          : user.userType === 'youth'
            ? '/profile'
            : '/';
      navigate(route);
    }
  };

  const handleGoogleSuccess = async (credential) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential }),
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        const route = data.user.userType === 'official' ? '/dashboard' : '/profile';
        navigate(route);
      } else {
        console.error('Google login failed:', data.message);
      }
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const handleGoogleError = (error) => {
    console.error('Google OAuth error:', error);
  };

  const renderField = (label, field, type = 'text', showToggle = false) => (
    <Box sx={{ mb: 2.5 }}>
      <TextField
        label={label}
        type={showToggle ? (showPassword ? 'text' : 'password') : type}
        fullWidth
        required
        size="medium"
        value={form[field]}
        onChange={handleChange(field)}
        error={Boolean(errors?.[field])}
        autoComplete={field}
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: '#f8fafc',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: '#ffffff',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#2c5aa0',
              },
            },
            '&.Mui-focused': {
              backgroundColor: '#ffffff',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#2c5aa0',
                borderWidth: 2,
              },
            },
          },
        }}
        InputProps={
          showToggle
            ? {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    size="small"
                    sx={{ color: '#64748b' }}
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
          <h1 className={style.title}>Empowering Catarman Youth</h1>
          <p className={style.tagline}>
            Join us in building a brighter Catarman — where every voice matters.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className={style.right}>
        <Box sx={{ width: '100%', maxWidth: 440 }}>
          <h1 className={style.signinTitle} >
            Welcome Back
          </h1>
          <h3 className={style.signinSubtitle}>
           Be part of Catarman’s story — engage, connect, and create change.
          </h3>
          {errors?.general && (
            <Alert
              severity="error"
              sx={{
                mb: 2.5,
                borderRadius: 2,
                fontWeight: 500
              }}
            >
              {errors.general}
            </Alert>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {renderField('Email Address', 'email', 'email')}
            {renderField('Password', 'password', 'password', true)}

            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1
            }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.remember}
                    onChange={handleChange('remember')}
                    size="small"
                    sx={{
                      color: '#2c5aa0',
                      '&.Mui-checked': {
                        color: '#2c5aa0',
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Remember me
                  </Typography>
                }
              />
              <Link
                component={RouterLink}
                to="/forgot"
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: '#2c5aa0',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  }
                }}
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #2c5aa0, #1e4785)',
                boxShadow: '0 4px 15px rgba(44, 90, 160, 0.3)',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 20px rgba(44, 90, 160, 0.4)',
                  background: 'linear-gradient(135deg, #25518f, #1a3d75)',
                },
                '&:disabled': {
                  background: '#e2e8f0',
                }
              }}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <LoginRounded />}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            <Typography 
              variant="body2"
              align="center"
              sx={{
                color: '#64748b',
                fontWeight: 500
              }}
            >
              New to our community?{' '}
              <Link
                component={RouterLink}
                to="/signup"
                sx={{
                  fontWeight: 600,
                  color: '#2c5aa0',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  }
                }}
              >
                Create an account
              </Link>
            </Typography>
          </form>
        </Box>
      </div>
    </div>
  );
};

export default Signin;

const errorBoxStyles = {
  mt: 1,
  ml: 0.5,
  backgroundColor: '#fef2f2',
  color: '#dc2626',
  px: 2,
  py: 1,
  borderRadius: '8px',
  fontSize: '0.85rem',
  fontWeight: 500,
  border: '1px solid #fecaca',
  display: 'flex',
  alignItems: 'center',
  gap: 0.5,
  '&::before': {
    content: '"⚠"',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
};