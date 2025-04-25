// src/components/hcm/leave/EmployeeLeavesDashboard.tsx
import { useState, useEffect } from 'react';
import {
  Box, Button, Card, CardContent, CardHeader, Divider,
  Typography, Tabs, Tab, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip,
  Dialog, IconButton, Tooltip, CircularProgress,
  Alert
} from '@mui/material';
import { Add as AddIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { format, differenceInCalendarDays } from 'date-fns';
import LeaveRequestForm from './LeaveRequestForm';
import { authService } from '../../../services/api.service';

// Temporary in-memory storage for testing
const testLeaves = [
  {
    id: '1',
    startDate: '2025-05-01',
    endDate: '2025-05-05',
    leaveType: 'vacation',
    status: 'pending',
    reason: 'Annual vacation',
    createdAt: '2025-04-20'
  },
  {
    id: '2',
    startDate: '2025-06-15',
    endDate: '2025-06-18',
    leaveType: 'sick',
    status: 'approved',
    reason: 'Medical appointment',
    createdAt: '2025-04-15'
  },
  {
    id: '3',
    startDate: '2025-07-10',
    endDate: '2025-07-10',
    leaveType: 'personal',
    status: 'rejected',
    reason: 'Personal matters',
    createdAt: '2025-04-10'
  }
];

// Temporary mock service until we implement API integration
const leaveService = {
  getEmployeeLeaves: async () => ({ data: testLeaves }),
  createLeaveRequest: async (leaveData: any) => {
    const newLeave = {
      id: (testLeaves.length + 1).toString(),
      ...leaveData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    testLeaves.push(newLeave);
    return { data: newLeave };
  },
  cancelLeaveRequest: async (leaveId: string) => {
    const leaveIndex = testLeaves.findIndex(leave => leave.id === leaveId);
    if (leaveIndex >= 0) {
      testLeaves[leaveIndex].status = 'cancelled';
    }
    return { success: true };
  }
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`leave-tabpanel-${index}`}
      aria-labelledby={`leave-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

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
    case 'approved':
      color = theme.palette.success.main;
      break;
    case 'pending':
      color = theme.palette.warning.main;
      break;
    case 'rejected':
      color = theme.palette.error.main;
      break;
    case 'cancelled':
      color = theme.palette.text.secondary;
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

// Mapping leave types to display names
const leaveTypeLabels: Record<string, string> = {
  vacation: 'Vacation',
  sick: 'Sick Leave',
  personal: 'Personal Leave',
  bereavement: 'Bereavement',
  unpaid: 'Unpaid Leave'
};

const EmployeeLeavesDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openNewRequestDialog, setOpenNewRequestDialog] = useState(false);
  const user = authService.getCurrentUser();

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    setLoading(true);
    try {
      // In a real application, we would pass the user ID
      const response = await leaveService.getEmployeeLeaves();
      setLeaveRequests(response.data);
    } catch (err) {
      console.error('Failed to fetch leave requests:', err);
      setError('Failed to load leave requests. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleNewRequest = () => {
    setOpenNewRequestDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenNewRequestDialog(false);
  };

  const handleSubmitLeave = async (leaveData: any) => {
    try {
      await leaveService.createLeaveRequest(leaveData);
      setOpenNewRequestDialog(false);
      fetchLeaveRequests(); // Refresh the list
    } catch (err) {
      console.error('Failed to submit leave request:', err);
      throw err; // Let the form handle the error
    }
  };

  const handleCancelRequest = async (leaveId: string) => {
    try {
      await leaveService.cancelLeaveRequest(leaveId);
      fetchLeaveRequests(); // Refresh the list
    } catch (err) {
      console.error('Failed to cancel leave request:', err);
      setError('Failed to cancel request. Please try again.');
    }
  };

  // Filter leave requests by status
  const pendingRequests = leaveRequests.filter(request => request.status === 'pending');
  const approvedRequests = leaveRequests.filter(request => request.status === 'approved');
  const otherRequests = leaveRequests.filter(request => 
    request.status !== 'pending' && request.status !== 'approved'
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  const renderLeaveTable = (requests: any[]) => (
    <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Leave Type</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.length > 0 ? (
            requests.map((leave) => {
              const startDate = new Date(leave.startDate);
              const endDate = new Date(leave.endDate);
              const duration = differenceInCalendarDays(endDate, startDate) + 1;
              
              return (
                <StyledTableRow key={leave.id}>
                  <TableCell>{leaveTypeLabels[leave.leaveType as string] || leave.leaveType}</TableCell>
                  <TableCell>{format(startDate, 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{format(endDate, 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{duration} day{duration !== 1 ? 's' : ''}</TableCell>
                  <TableCell>
                    <StatusChip 
                      label={leave.status.charAt(0).toUpperCase() + leave.status.slice(1)} 
                      status={leave.status}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {leave.status === 'pending' && (
                      <Tooltip title="Cancel Request">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleCancelRequest(leave.id)}
                        >
                          <CancelIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </StyledTableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                <Typography variant="body1" color="text.secondary">
                  No leave requests found
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          My Leave Requests
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleNewRequest}
        >
          New Request
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      )}

      <Card sx={{ boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)', borderRadius: 2 }}>
        <CardHeader 
          title="Leave History" 
          titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
        />
        <Divider />
        <CardContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label={`Pending (${pendingRequests.length})`} />
              <Tab label={`Approved (${approvedRequests.length})`} />
              <Tab label={`Other (${otherRequests.length})`} />
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            {renderLeaveTable(pendingRequests)}
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            {renderLeaveTable(approvedRequests)}
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            {renderLeaveTable(otherRequests)}
          </TabPanel>
        </CardContent>
      </Card>

      {/* New Leave Request Dialog */}
      <Dialog 
        open={openNewRequestDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <LeaveRequestForm 
          onSubmit={handleSubmitLeave}
          onCancel={handleCloseDialog}
        />
      </Dialog>
    </div>
  );
};

export default EmployeeLeavesDashboard;