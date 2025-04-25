// src/components/hcm/leave/ManagerApprovalDashboard.tsx
import { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, CardHeader, Divider,
  Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip,
  Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, IconButton, Tooltip,
  CircularProgress, Alert
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { format, differenceInCalendarDays } from 'date-fns';
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
    createdAt: '2025-04-20',
    rejectionReason: '',
    employee: {
      id: 'emp1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      department: 'Engineering'
    }
  },
  {
    id: '2',
    startDate: '2025-05-15',
    endDate: '2025-05-18',
    leaveType: 'sick',
    status: 'pending',
    reason: 'Medical appointment',
    createdAt: '2025-04-15',
    rejectionReason: '',
    employee: {
      id: 'emp2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      department: 'Marketing'
    }
  },
  {
    id: '3',
    startDate: '2025-06-10',
    endDate: '2025-06-10',
    leaveType: 'personal',
    status: 'pending',
    reason: 'Personal matters',
    createdAt: '2025-04-10',
    rejectionReason: '',
    employee: {
      id: 'emp3',
      firstName: 'Michael',
      lastName: 'Johnson',
      email: 'michael.j@example.com',
      department: 'Finance'
    }
  }
];

// Temporary mock until we implement the service
const leaveService = {
  getPendingLeaves: async () => ({ data: testLeaves }),
  approveLeaveRequest: async (leaveId: string) => {
    const leaveIndex = testLeaves.findIndex(leave => leave.id === leaveId);
    if (leaveIndex >= 0) {
      testLeaves[leaveIndex].status = 'approved';
    }
    return { success: true };
  },
  rejectLeaveRequest: async (leaveId: string, reason: string) => {
    const leaveIndex = testLeaves.findIndex(leave => leave.id === leaveId);
    if (leaveIndex >= 0) {
      testLeaves[leaveIndex].status = 'rejected';
      testLeaves[leaveIndex].rejectionReason = reason;
    }
    return { success: true };
  }
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

const LeaveTypeChip = styled(Chip)<{ leavetype: string }>(({ theme, leavetype }) => {
  let color;
  switch (leavetype.toLowerCase()) {
    case 'vacation':
      color = theme.palette.primary.main;
      break;
    case 'sick':
      color = theme.palette.error.main;
      break;
    case 'personal':
      color = theme.palette.info.main;
      break;
    case 'bereavement':
      color = theme.palette.warning.main;
      break;
    case 'unpaid':
      color = theme.palette.grey[700];
      break;
    default:
      color = theme.palette.secondary.main;
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

const ManagerApprovalDashboard = () => {
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const user = authService.getCurrentUser();

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const response = await leaveService.getPendingLeaves();
      setPendingRequests(response.data.filter(req => req.status === 'pending'));
    } catch (err) {
      console.error('Failed to fetch pending leave requests:', err);
      setError('Failed to load pending requests. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (request: any) => {
    setSelectedRequest(request);
    setOpenDetailsDialog(true);
  };

  const handleApprove = async (leaveId: string) => {
    try {
      await leaveService.approveLeaveRequest(leaveId);
      fetchPendingRequests(); // Refresh the list
    } catch (err) {
      console.error('Failed to approve leave request:', err);
      setError('Failed to approve request. Please try again.');
    }
  };

  const handleOpenRejectDialog = (request: any) => {
    setSelectedRequest(request);
    setOpenRejectDialog(true);
  };

  const handleCloseRejectDialog = () => {
    setOpenRejectDialog(false);
    setRejectionReason('');
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    
    try {
      await leaveService.rejectLeaveRequest(selectedRequest.id, rejectionReason);
      handleCloseRejectDialog();
      fetchPendingRequests(); // Refresh the list
    } catch (err) {
      console.error('Failed to reject leave request:', err);
      setError('Failed to reject request. Please try again.');
      // Close the dialog even on error, but show error message
      handleCloseRejectDialog();
    }
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setSelectedRequest(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Leave Approval
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Pending leave requests require your approval
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      )}

      <Card sx={{ boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)', borderRadius: 2 }}>
        <CardHeader 
          title={`Pending Requests (${pendingRequests.length})`} 
          titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
        />
        <Divider />
        <CardContent>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Leave Type</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Date Requested</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingRequests.length > 0 ? (
                  pendingRequests.map((request) => {
                    const startDate = new Date(request.startDate);
                    const endDate = new Date(request.endDate);
                    const duration = differenceInCalendarDays(endDate, startDate) + 1;
                    const requestDate = new Date(request.createdAt);
                    
                    return (
                      <StyledTableRow key={request.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="subtitle2">
                              {request.employee?.firstName} {request.employee?.lastName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <LeaveTypeChip 
                            label={leaveTypeLabels[request.leaveType as string] || request.leaveType} 
                            leavetype={request.leaveType}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {format(startDate, 'MMM dd')} - {format(endDate, 'MMM dd, yyyy')}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {duration} day{duration !== 1 ? 's' : ''}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {format(requestDate, 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="View Details">
                              <IconButton 
                                size="small" 
                                onClick={() => handleViewDetails(request)}
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Approve">
                              <IconButton 
                                size="small" 
                                color="success"
                                onClick={() => handleApprove(request.id)}
                              >
                                <ApproveIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => handleOpenRejectDialog(request)}
                              >
                                <RejectIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </StyledTableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="text.secondary">
                        No pending requests found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Leave Request Detail Dialog */}
      <Dialog 
        open={openDetailsDialog} 
        onClose={handleCloseDetailsDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedRequest && (
          <>
            <DialogTitle>
              <Typography variant="h6" fontWeight="bold">
                Leave Request Details
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">Employee</Typography>
                <Typography variant="h6">
                  {selectedRequest.employee?.firstName} {selectedRequest.employee?.lastName}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Leave Type</Typography>
                  <Typography variant="body1">
                    {leaveTypeLabels[selectedRequest.leaveType as string] || selectedRequest.leaveType}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Typography variant="body1">Pending</Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Start Date</Typography>
                  <Typography variant="body1">
                    {format(new Date(selectedRequest.startDate), 'MMM dd, yyyy')}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">End Date</Typography>
                  <Typography variant="body1">
                    {format(new Date(selectedRequest.endDate), 'MMM dd, yyyy')}
                  </Typography>
                </Box>
                
                <Box sx={{ gridColumn: 'span 2' }}>
                  <Typography variant="subtitle2" color="text.secondary">Duration</Typography>
                  <Typography variant="body1">
                    {differenceInCalendarDays(
                      new Date(selectedRequest.endDate), 
                      new Date(selectedRequest.startDate)
                    ) + 1} day(s)
                  </Typography>
                </Box>
                
                {selectedRequest.reason && (
                  <Box sx={{ gridColumn: 'span 2' }}>
                    <Typography variant="subtitle2" color="text.secondary">Reason</Typography>
                    <Typography variant="body1">{selectedRequest.reason}</Typography>
                  </Box>
                )}
                
                <Box sx={{ gridColumn: 'span 2' }}>
                  <Typography variant="subtitle2" color="text.secondary">Requested On</Typography>
                  <Typography variant="body1">
                    {format(new Date(selectedRequest.createdAt), 'MMM dd, yyyy')}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetailsDialog}>Close</Button>
              <Button 
                variant="contained" 
                color="error"
                onClick={() => {
                  handleCloseDetailsDialog();
                  handleOpenRejectDialog(selectedRequest);
                }}
              >
                Reject
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => {
                  handleCloseDetailsDialog();
                  handleApprove(selectedRequest.id);
                }}
              >
                Approve
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Reject Dialog */}
      <Dialog 
        open={openRejectDialog} 
        onClose={handleCloseRejectDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Reject Leave Request
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Please provide a reason for rejecting this leave request.
          </Typography>
          
          <TextField
            label="Rejection Reason"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            multiline
            rows={4}
            fullWidth
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRejectDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleReject}
            disabled={!rejectionReason.trim()}
          >
            Confirm Rejection
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManagerApprovalDashboard;