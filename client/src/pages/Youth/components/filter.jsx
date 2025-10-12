import React from 'react';
import {
    Box,
    Typography,
    Stack,
    Chip,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

const FilterChip = ({ label, active, onClick }) => (
    <Chip
        label={label}
        variant={active ? "filled" : "outlined"}
        color={active ? "primary" : "default"}
        onClick={onClick}
        size="small"
    />
);

const Filter = ({ 
    filter, 
    verifiedFilter, 
    genderFilter, 
    purokFilter,
    onFilterChange,
    onVerifiedFilterChange,
    onGenderFilterChange,
    onPurokFilterChange 
}) => {
    const purokOptions = ["Purok 1", "Purok 2", "Purok 3", "Purok 4", "Purok 5", "Purok 6"];

    return (
        <Box sx={{ width: 280, p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FilterListIcon /> Filters
            </Typography>
            
            {/* Voting Status Filter */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom color="text.secondary">VOTING STATUS</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    <FilterChip 
                        label="All" 
                        active={filter === "all"} 
                        onClick={() => onFilterChange("all")} 
                    />
                    <FilterChip 
                        label="Registered" 
                        active={filter === "registered"} 
                        onClick={() => onFilterChange("registered")} 
                    />
                    <FilterChip 
                        label="Unregistered" 
                        active={filter === "unregistered"} 
                        onClick={() => onFilterChange("unregistered")} 
                    />
                </Stack>
            </Box>

            {/* Verification Filter */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom color="text.secondary">VERIFICATION</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    <FilterChip 
                        label="All" 
                        active={verifiedFilter === "all"} 
                        onClick={() => onVerifiedFilterChange("all")} 
                    />
                    <FilterChip 
                        label="Verified" 
                        active={verifiedFilter === "yes"} 
                        onClick={() => onVerifiedFilterChange("yes")} 
                    />
                    <FilterChip 
                        label="Unverified" 
                        active={verifiedFilter === "no"} 
                        onClick={() => onVerifiedFilterChange("no")} 
                    />
                </Stack>
            </Box>

            {/* Gender Filter */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom color="text.secondary">GENDER</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    <FilterChip 
                        label="All" 
                        active={genderFilter === "all"} 
                        onClick={() => onGenderFilterChange("all")} 
                    />
                    <FilterChip 
                        label="Male" 
                        active={genderFilter === "male"} 
                        onClick={() => onGenderFilterChange("male")} 
                    />
                    <FilterChip 
                        label="Female" 
                        active={genderFilter === "female"} 
                        onClick={() => onGenderFilterChange("female")} 
                    />
                </Stack>
            </Box>

            {/* Purok Filter */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom color="text.secondary">PUROK</Typography>
                <Stack spacing={1}>
                    <FilterChip 
                        label="All" 
                        active={purokFilter === "all"} 
                        onClick={() => onPurokFilterChange("all")} 
                    />
                    {purokOptions.map((purok) => (
                        <FilterChip 
                            key={purok} 
                            label={purok} 
                            active={purokFilter === purok} 
                            onClick={() => onPurokFilterChange(purok)} 
                        />
                    ))}
                </Stack>
            </Box>
        </Box>
    );
};

export default Filter;