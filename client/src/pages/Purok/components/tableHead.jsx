import { TableHead, TableRow, TableCell, Checkbox, TableSortLabel, Box } from '@mui/material';
import { visuallyHidden } from '@mui/utils';

const basicHeadCells = [
    {
        id: 'select', label: '',
        numeric: false,
        disablePadding: true
    },
    {
        id: 'number',
        label: '#',
        numeric: true
    },
    {
        id: 'name',
        label: 'Purok Name',
        numeric: false
    }
];

const residentsHeadCells = [
    ...basicHeadCells,
    {
        id: 'total_residents',
        label: 'Total Residents',
        numeric: true
    },
    {
        id: 'verified_residents',
        label: 'Verified',
        numeric: true
    },
    {
        id: 'unverified_residents',
        label: 'Unverified',
        numeric: true
    },
    {
        id: 'registered_voters',
        label: 'Registered Voters',
        numeric: true
    },
    {
        id: 'gender_distribution',
        label: 'Gender (M/F)',
        numeric: false
    }
];

export default function EnhancedTableHead({
    order,
    orderBy,
    onRequestSort,
    onSelectAllClick,
    rowCount,
    numSelected,
    showResidents = false
}) {
    const headCells = showResidents ? residentsHeadCells : basicHeadCells;
    const createSortHandler = (property) => (e) => onRequestSort(e, property);
    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                    />
                </TableCell>
                {headCells.slice(1).map((cell) => (
                    <TableCell
                        key={cell.id}
                        sortDirection={orderBy === cell.id ? order : false}
                        padding="normal"
                    >
                        <TableSortLabel
                            active={orderBy === cell.id}
                            direction={orderBy === cell.id ? order : 'asc'}
                            onClick={createSortHandler(cell.id)}
                        >
                            {cell.label}
                            {orderBy === cell.id && (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            )}
                        </TableSortLabel>
                    </TableCell>
                ))}
                <TableCell align="right">Actions</TableCell>
            </TableRow>
        </TableHead>
    );
}
