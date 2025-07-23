import React, { useRef, useState } from 'react'
import {
    Box,
    FormControl,
    FormLabel,
    FormGroup,
    FormControlLabel,
    Checkbox,
    RadioGroup,
    Radio,
    TextField,
    Grid,
    useMediaQuery,
    useTheme,
    Button, // ✅ Add this
} from '@mui/material'

const DemographicsFile = () => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const responsiveRow = !isMobile

    const [selectedFile, setSelectedFile] = useState(null)
    const fileInputRef = useRef()

    const handleFileChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            setSelectedFile(file)
        }
    }

    const handleUploadClick = () => {
        fileInputRef.current.click()
    }

    const renderCheckboxGroup = (label, options) => (
        <FormControl component="fieldset">
            <FormLabel component="legend">{label}</FormLabel>
            <FormGroup row={responsiveRow}>
                {options.map((opt) => (
                    <FormControlLabel key={opt} control={<Checkbox />} label={opt} />
                ))}
            </FormGroup>
        </FormControl>
    )

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {renderCheckboxGroup('Civil Status', [
                'Single',
                'Married',
                'Widowed',
                'Divorced',
                'Separated',
                'Annulled',
                'Live-in',
                'Unknown',
            ])}

            {renderCheckboxGroup('Youth Age Group', [
                'Child Youth (16–17 years old)',
                'Core Youth (18–24 years old)',
                'Young Adult (25–30 years old)',
            ])}

            {renderCheckboxGroup('Youth Classification', [
                'In school youth',
                'Out of school youth',
                'Working school youth',
                'Youth w/ Specific needs',
                'Person w/ Disability',
                'Children in Conflict w/ Law',
                'Indigenoues People',
            ])}

            {renderCheckboxGroup('Educational Background', [
                'Elementary Level',
                'Elementary Grad',
                'High School Level',
                'High School Grad',
                'Vocational Grad',
                'College Level',
                'College Grad',
                'Masters Level',
                'Masters Grad',
                'Doctorate Level',
                'Doctorate Graduate',
            ])}

            {renderCheckboxGroup('Work Status', [
                'Employed',
                'Unemployed',
                'Self-Employed',
                'Currently looking for a job',
                'Not interested looking for a job',
            ])}

            {/* ✅ Voter Information - 3 items per row */}
            <FormControl component="fieldset">
                <FormLabel component="legend">Voter Information</FormLabel>
                <Box sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                        {/* SK Voter */}
                        <Grid item xs={12} sm={4}>
                            <FormLabel>Registered SK Voter:</FormLabel>
                            <RadioGroup name="sk_voter">
                                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                <FormControlLabel value="no" control={<Radio />} label="No" />
                            </RadioGroup>
                        </Grid>

                        {/* National Voter */}
                        <Grid item xs={12} sm={4}>
                            <FormLabel>Registered National Voter:</FormLabel>
                            <RadioGroup name="nat_voter">
                                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                <FormControlLabel value="no" control={<Radio />} label="No" />
                            </RadioGroup>
                        </Grid>

                        {/* Voted in SK election */}
                        <Grid item xs={12} sm={4}>
                            <FormLabel>Did you vote in the last SK election?</FormLabel>
                            <RadioGroup name="voted_sk">
                                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                <FormControlLabel value="no" control={<Radio />} label="No" />
                            </RadioGroup>
                        </Grid>

                        {/* Attended SK meetings */}
                        <Grid item xs={12} sm={4}>
                            <FormLabel>Attended SK meetings?</FormLabel>
                            <RadioGroup name="attended_sk_meeting">
                                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                <FormControlLabel value="no" control={<Radio />} label="No" />
                            </RadioGroup>
                        </Grid>

                        {/* How many times */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                type="number"
                                label="If yes, how many times?"
                                name="sk_meeting_count"
                                inputProps={{ min: 0 }}
                                fullWidth
                            />
                        </Grid>

                        {/* Reason for not attending */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="If no, why not?"
                                name="sk_meeting_reason"
                                multiline
                                rows={3}
                                placeholder="Reason for not attending"
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </Box>
            </FormControl>

            {/* ✅ File Upload Section (Styled) */}
            {/* File Upload */}
            <Box
                sx={{
                    width: '100%',
                    maxWidth: '800px',
                    padding: 2,
                    backgroundColor: '#fafafa',
                    border: '1px dashed #ccc',
                    borderRadius: '12px',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
                }}
            >
                <FormLabel
                    sx={{
                        fontWeight: 'bold',
                        mb: 2,
                        display: 'block',
                        fontSize: '1.1rem',
                        color: 'text.primary',
                    }}
                >
                    Attachment Here
                </FormLabel>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    style={{ display: 'none' }}
                />

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2,
                        mb: 2,
                    }}
                >
                    <Button variant="outlined" onClick={handleUploadClick}>
                        Choose File
                    </Button>
                    <Box sx={{ fontSize: 14, color: selectedFile ? 'text.primary' : 'text.secondary' }}>
                        {selectedFile ? selectedFile.name : 'No file selected'}
                    </Box>
                </Box>

                {/* Optional: Preview for image files */}
                {selectedFile && selectedFile.type.startsWith('image/') && (
                    <Box
                        component="img"
                        src={URL.createObjectURL(selectedFile)}
                        alt="Preview"
                        sx={{
                            width: '100%',
                            maxWidth: '100%',
                            height: 'auto',
                            borderRadius: 2,
                            mt: 2,
                            objectFit: 'contain',
                        }}
                    />
                )}
            </Box>

        </Box>
    )
}

export default DemographicsFile
