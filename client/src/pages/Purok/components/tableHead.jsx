import { TableHead, TableRow, TableCell, Checkbox, TableSortLabel, Box } from '@mui/material';
import { visuallyHidden } from '@mui/utils';

const headCells = [
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
    },
    {
        id: 'total_residence',
        label: 'Total Residence',
        numeric: false
    }
];

export default function EnhancedTableHead({
    order,
    orderBy,
    onRequestSort,
    onSelectAllClick,
    rowCount,
    numSelected
}) {
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
