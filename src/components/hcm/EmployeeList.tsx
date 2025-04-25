import React, { useState, useEffect } from 'react';
import { 
  Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Button, CircularProgress, Box, TextField,
  InputAdornment, IconButton, Chip, Card, Tooltip, Menu, MenuItem,
  ButtonGroup, Alert, Avatar
} from '@mui/material';
import { 
  Add as AddIcon, 
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { hcmService, authService } from '../../services/api.service';

// Styled components
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StatusChip = styled(Chip)<{ status: string }>(({ theme, status }) => {
  let color;
  switch (status.toLowerCase()) {
    case 'active':
      color = theme.palette.success.main;
      break;
    case 'on leave':
      color = theme.palette.warning.main;
      break;
    case 'terminated':
      color = theme.palette.error.main;
      break;
    default:
      color = theme.palette.info.main;
  }
  
  return {
    backgroundColor: color + '20', // 20% opacity
    color: color,
    fontWeight: 600,
    '& .MuiChip-label': {
      padding: '0 8px',
    }
  };
});

const EmployeeList = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [actionAnchorEl, setActionAnchorEl] = useState<null | HTMLElement>(null);
  const [activeEmployee, setActiveEmployee] = useState<any>(null);
  const user = authService.getCurrentUser();

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!user?.tenantId) {
        setError('No tenant ID found');
        setLoading(false);
        return;
      }

      try {
        const response = await hcmService.getEmployees(user.tenantId);
        setEmployees(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch employees');
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [user]);

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleActionClick = (event: React.MouseEvent<HTMLElement>, employee: any) => {
    setActiveEmployee(employee);
    setActionAnchorEl(event.currentTarget);
  };

  const handleActionClose = () => {
    setActionAnchorEl(null);
  };

  // Filter employees based on search term
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      searchTerm === '' || 
      employee.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" variant="h6">{error}</Typography>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Employees
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          sx={{ 
            borderRadius: 2,
            px: 3,
            py: 1
          }}
        >
          Add Employee
        </Button>
      </Box>

      {/* HCM Navigation */}
      <Box sx={{ mb: 3 }}>
        <ButtonGroup variant="outlined" sx={{ mb: 3 }}>
          <Button component={Link} to="/hcm">Employees</Button>
          <Button component={Link} to="/hcm/leave">My Leave Requests</Button>
          {user?.roles?.includes('manager') && (
            <Button component={Link} to="/hcm/leave-approval">Leave Approvals</Button>
          )}
        </ButtonGroup>
      </Box>

      <Card sx={{ mb: 4, p: 2, borderRadius: 2, boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <TextField
            placeholder="Search employees..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <Box>
            <Tooltip title="Filter">
              <IconButton onClick={handleFilterClick}>
                <FilterIcon />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={handleFilterClose}
              PaperProps={{
                sx: { width: 250, p: 1 }
              }}
            >
              {/* Filter options would go here */}
              <MenuItem onClick={handleFilterClose}>All Departments</MenuItem>
              <MenuItem onClick={handleFilterClose}>Engineering</MenuItem>
              <MenuItem onClick={handleFilterClose}>Sales</MenuItem>
              <MenuItem onClick={handleFilterClose}>Marketing</MenuItem>
              <MenuItem onClick={handleFilterClose}>HR</MenuItem>
            </Menu>
          </Box>
        </Box>

        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
          {filteredEmployees.length} {filteredEmployees.length === 1 ? 'employee' : 'employees'} found
        </Typography>

        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Employee ID</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Job Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <StyledTableRow key={employee.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: (theme: any) => theme.palette.primary.main }}>
                          {employee.firstName ? employee.firstName[0] : ''}
                          {employee.lastName ? employee.lastName[0] : ''}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {`${employee.firstName || ''} ${employee.lastName || ''}`}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {employee.email || ''}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{employee.employeeId || 'N/A'}</TableCell>
                    <TableCell>{employee.department || 'N/A'}</TableCell>
                    <TableCell>{employee.jobTitle || 'N/A'}</TableCell>
                    <TableCell>
                      <StatusChip 
                        label={employee.employmentStatus || 'Unknown'} 
                        status={employee.employmentStatus || 'Unknown'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Actions">
                        <IconButton 
                          size="small"
                          onClick={(e) => handleActionClick(e, employee)}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="subtitle1" color="text.secondary">
                      No employees found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Try adjusting your search or filters
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={actionAnchorEl}
        open={Boolean(actionAnchorEl)}
        onClose={handleActionClose}
        PaperProps={{
          sx: { width: 180 }
        }}
      >
        <MenuItem onClick={handleActionClose}>
          <EditIcon fontSize="small" sx={{ mr: 2 }} />
          Edit
        </MenuItem>
          <MenuItem onClick={handleActionClose}>
          <VisibilityIcon fontSize="small" sx={{ mr: 2 }} />
           View Details
        </MenuItem>
        <MenuItem onClick={handleActionClose}>
          <PrintIcon fontSize="small" sx={{ mr: 2 }} />
          Print Info
        </MenuItem>
        <MenuItem onClick={handleActionClose}>
          <DeleteIcon fontSize="small" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
};

export default EmployeeList;