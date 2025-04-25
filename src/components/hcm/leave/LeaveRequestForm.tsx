// src/components/hcm/leave/LeaveRequestForm.tsx
import React, { useState } from 'react';
import {
  Box, Button, Card, CardContent, CardHeader, Divider,
  TextField, FormControl, InputLabel, Select, MenuItem,
  Typography, Alert, SelectChangeEvent
} from '@mui/material';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { differenceInCalendarDays } from 'date-fns';
import { authService } from '../../../services/api.service';

// Define leave type options
const leaveTypeOptions = [
  { value: 'vacation', label: 'Vacation' },
  { value: 'sick', label: 'Sick Leave' },
  { value: 'personal', label: 'Personal Leave' },
  { value: 'bereavement', label: 'Bereavement' },
  { value: 'unpaid', label: 'Unpaid Leave' }
];

interface LeaveRequestFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({ onSubmit, onCancel }) => {
  const user = authService.getCurrentUser();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [leaveType, setLeaveType] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const calculateDays = () => {
    if (startDate && endDate) {
      const days = differenceInCalendarDays(endDate, startDate) + 1;
      return days > 0 ? days : 0;
    }
    return 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }
    
    if (!leaveType) {
      setError('Please select a leave type');
      return;
    }
    
    if (startDate > endDate) {
      setError('End date cannot be before start date');
      return;
    }
    
    const days = calculateDays();
    if (days <= 0) {
      setError('Leave must be at least one day');
      return;
    }
    
    setLoading(true);
    
    try {
      const leaveData = {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        leaveType,
        reason,
        employeeId: user?.id || 'user123',
      };
      
      await onSubmit(leaveData);
    } catch (err) {
      setError('Failed to submit leave request. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)', borderRadius: 2 }}>
      <CardHeader 
        title="New Leave Request" 
        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
      />
      <Divider />
      <CardContent>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box component="form" onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
            )}
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
              <Box>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                />
              </Box>
              <Box>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                />
              </Box>
              <Box>
                <FormControl fullWidth required>
                  <InputLabel>Leave Type</InputLabel>
                  <Select
                    value={leaveType}
                    label="Leave Type"
                    onChange={(e: SelectChangeEvent) => setLeaveType(e.target.value)}
                  >
                    {leaveTypeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <TextField
                  label="Days Requested"
                  value={calculateDays()}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Box>
              <Box sx={{ gridColumn: { xs: '1', md: 'span 2' } }}>
                <TextField
                  label="Reason (Optional)"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  multiline
                  rows={3}
                  fullWidth
                />
              </Box>
              <Box sx={{ gridColumn: { xs: '1', md: 'span 2' }, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={onCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </Button>
              </Box>
            </Box>
          </Box>
        </LocalizationProvider>
      </CardContent>
    </Card>
  );
};

export default LeaveRequestForm;