import {
    Box,
    Typography,
    Divider,
    FormGroup,
    FormControlLabel,
    CheckBox
} from '@mui/material';

function Filter({ filters, setFilters }) {

    const handleChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: prev[key].includes(value)
                ? prev[key].filter((v) => v !== value)
                : [...prev[key], value],
        }));
    };


    return (
        <Box sx={{
            width: 260,
            p: 2
        }}>


            {/**Voting Fiter */}
            <Typography variant="h5">
                Voting Status
            </Typography>

            <FormGroup>
                {[
                    "Registered",
                    "Unregistered"
                ].map((options) => (
                    <FormControlLabel
                        key={options}
                        control={
                            <CheckBox
                                checked={filters.registred.includes(options)}
                                onchange={() => handleChange("registered", options)}
                            />
                        }
                        label={options}
                    />
                ))}
            </FormGroup>

            <Divider
                sx={{
                    my: 2
                }}
            />

            {/**Verified Filter */}
            <Typography variant="h5">
                Voting Status
            </Typography>

            <FormGroup>
                {[
                    "Yes",
                    "No"
                ].map((options) => (
                    <FormControlLabel
                        key={options}
                        control={
                            <CheckBox
                                checked={filters.registred.includes(options)}
                                onchange={() => handleChange("registered", options)}
                            />
                        }
                        label={options}
                    />
                ))}
            </FormGroup>



        </Box>
    )

}