import React from 'react'
import {
    Box,
    Grid,
    TextField,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio
} from '@mui/material'

const PersonalDetails = () => {
    return (
        <Box component="form" sx={{ flexGrow: 1, mt: 2 }}>
            <Grid container spacing={2}>
                {[
                    'First Name',
                    'Middle Name',
                    'Last Name',
                    'Suffix',
                    'Region',
                    'Province',
                    'Municipality',
                    'Barangay',
                    'Purok',
                ].map((label) => (
                    <Grid item xs={12} sm={6} md={4} key={label}>
                        <TextField fullWidth label={label} variant="outlined" />
                    </Grid>
                ))}

                <Grid item xs={12}>
                    <FormControl component="fieldset" fullWidth>
                        <FormLabel component="legend">Gender</FormLabel>
                        <RadioGroup row name="gender">
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                        </RadioGroup>
                    </FormControl>
                </Grid>
            </Grid>
        </Box>
    )
}

export default PersonalDetails
