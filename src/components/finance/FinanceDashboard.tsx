// src/components/finance/FinanceDashboard.tsx
import React from 'react';
import {
  Typography, Card, CardContent, CardHeader, Box,
  Button, Divider, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip,
  List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { useTheme } from '@mui/material/styles';

// Sample data
const revenueByMonth = [
  { month: 'Jan', revenue: 42000 },
  { month: 'Feb', revenue: 35000 },
  { month: 'Mar', revenue: 48000 },
  { month: 'Apr', revenue: 52000 },
  { month: 'May', revenue: 53000 },
  { month: 'Jun', revenue: 60000 },
];

const expenseBreakdown = [
  { name: 'Salaries', value: 42000 },
  { name: 'Equipment', value: 15000 },
  { name: 'Rent', value: 12000 },
  { name: 'Marketing', value: 8000 },
  { name: 'Operations', value: 18000 },
];

const transactions = [
  { id: 'TRX001', date: '2025-04-15', description: 'Software License', amount: -2500, status: 'Completed' },
  { id: 'TRX002', date: '2025-04-14', description: 'Client Payment - ABC Corp', amount: 15000, status: 'Completed' },
  { id: 'TRX003', date: '2025-04-12', description: 'Office Supplies', amount: -350, status: 'Completed' },
  { id: 'TRX004', date: '2025-04-10', description: 'Client Payment - XYZ Ltd', amount: 8700, status: 'Pending' },
  { id: 'TRX005', date: '2025-04-08', description: 'Equipment Purchase', amount: -3450, status: 'Completed' },
];

const COLORS = ['#4caf50', '#2196f3', '#ff9800', '#e91e63', '#9c27b0'];
const barChartColor = '#4caf50';

const FinanceDashboard = () => {
  const theme = useTheme();

  return (
    <div style={{ maxWidth: 1600, margin: '0 auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Financial Overview
        </Typography>
        <Box>
          <Button variant="outlined" sx={{ mr: 2 }}>Export Report</Button>
          <Button variant="contained">Add Transaction</Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 3, gap: 2 }}>
        <Card sx={{ flex: '1 1 30%', minWidth: 240, borderRadius: 2, boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)' }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">Total Revenue (YTD)</Typography>
            <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>$290,000</Typography>
            <Typography variant="body2" color="success.main">↑ 12.3% from last year</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: '1 1 30%', minWidth: 240, borderRadius: 2, boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)' }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">Total Expenses (YTD)</Typography>
            <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>$95,000</Typography>
            <Typography variant="body2" color="error.main">↑ 5.7% from last year</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: '1 1 30%', minWidth: 240, borderRadius: 2, boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)' }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">Net Profit</Typography>
            <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>$195,000</Typography>
            <Typography variant="body2" color="success.main">↑ 15.8% from last year</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Inserted Section Starts Here */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 3, gap: 2 }}>
        <Card sx={{ flex: '1 1 300px', borderRadius: 2, boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)' }}>
          {/* Monthly Revenue chart */}
        </Card>
        <Card sx={{ flex: '1 1 300px', borderRadius: 2, boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)' }}>
          {/* Expense Breakdown chart */}
        </Card>
        <Card sx={{ flex: '1 1 250px', borderRadius: 2, boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)' }}>
          <CardHeader
            title="Financial Alerts"
            titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
          />
          <Divider />
          <CardContent>
            <List sx={{ p: 0 }}>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon><WarningIcon color="warning" /></ListItemIcon>
                <ListItemText primary="Marketing budget exceeded by 12%" />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon><WarningIcon color="warning" /></ListItemIcon>
                <ListItemText primary="April revenue target missed" />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon><WarningIcon color="warning" /></ListItemIcon>
                <ListItemText primary="Operational costs rising faster than expected" />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Box>
      {/* Inserted Section Ends Here */}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 3, gap: 2 }}>
        <Card sx={{ flex: '1 1 45%', minWidth: 400, borderRadius: 2, boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)' }}>
          <CardHeader
            title="Monthly Revenue"
            titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
          />
          <Divider />
          <CardContent>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenueByMonth}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill={barChartColor} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: '1 1 45%', minWidth: 400, borderRadius: 2, boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)' }}>
          <CardHeader
            title="Expense Breakdown"
            titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
          />
          <Divider />
          <CardContent>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)' }}>
        <CardHeader
          title="Recent Transactions"
          titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
          action={<Button size="small" color="primary">View All</Button>}
        />
        <Divider />
        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.id}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell align="right" sx={{
                    color: transaction.amount < 0 ? 'error.main' : 'success.main',
                    fontWeight: 'medium'
                  }}>
                    {transaction.amount < 0 ? '-' : ''}${Math.abs(transaction.amount).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={transaction.status}
                      size="small"
                      sx={{
                        backgroundColor: transaction.status === 'Completed'
                          ? theme.palette.success.light
                          : theme.palette.warning.light,
                        color: transaction.status === 'Completed'
                          ? theme.palette.success.dark
                          : theme.palette.warning.dark,
                        fontWeight: 500
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </div>
  );
};

export default FinanceDashboard;
