import React, { useState } from 'react'
import {
    TextField,
    Box,
    IconButton,
    InputAdornment,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

const Credentials = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const isEmailValid = email === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    const doPasswordsMatch =
        confirmPassword === '' || password === confirmPassword

    return (
        <Box
            component="form"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                mt: 2,
            }}
            noValidate
            autoComplete="off"
        >
            <TextField
                label="Email"
                type="email"
                variant="outlined"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!isEmailValid}
                helperText={!isEmailValid && 'Enter a valid email'}
                fullWidth
            />

            <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={() => setShowPassword((prev) => !prev)}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    )
                }}
            />

            <TextField
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                variant="outlined"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={!doPasswordsMatch}
                helperText={!doPasswordsMatch && 'Passwords do not match'}
                fullWidth
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                edge="end"
                            >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    )
                }}
            />
        </Box>
    )
}

export default Credentials
