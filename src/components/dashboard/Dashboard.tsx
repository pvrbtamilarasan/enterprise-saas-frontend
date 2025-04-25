import { useState, useEffect } from 'react';
import { 
  Typography, Paper, Box, Card, CardContent, CardHeader,
  Avatar, List, ListItem, ListItemText, ListItemAvatar,
  useTheme
} from '@mui/material';
import { 
  People, BusinessCenter, Payments,
  CheckCircle, Error, Info, Assignment
} from '@mui/icons-material';
import { CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { authService } from '../../services/api.service';
import { styled } from '@mui/material/styles';

// Create a grid container and item replacement
const GridContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  margin: theme.spacing(-1.5),
}));

const GridItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
}));

// Sample data for charts
const revenueData = [
  { name: 'Jan', revenue: 15000, expenses: 12000 },
  { name: 'Feb', revenue: 18000, expenses: 13000 },
  { name: 'Mar', revenue: 17000, expenses: 10000 },
  { name: 'Apr', revenue: 19000, expenses: 14000 },
  { name: 'May', revenue: 21000, expenses: 15000 },
  { name: 'Jun', revenue: 25000, expenses: 16000 },
];

const employeeData = [
  { name: 'Engineering', value: 35 },
  { name: 'Sales', value: 28 },
  { name: 'Marketing', value: 17 },
  { name: 'HR', value: 8 },
  { name: 'Finance', value: 12 },
];

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const theme = useTheme();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const StatCard = ({ title, value, icon, color }: any) => (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        borderRadius: 2, 
        boxShadow: '0 2px 15px rgba(0, 0, 0, 0.05)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ color: 'text.secondary', fontSize: '0.875rem', fontWeight: 500 }}>
          {title}
        </Typography>
        <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main` }}>
          {icon}
        </Avatar>
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
        {value}
      </Typography>
      <Typography variant="subtitle2" sx={{ color: 'success.main', mt: 1 }}>
        +5.2% <span style={{ color: theme.palette.text.secondary }}>vs last month</span>
      </Typography>
    </Paper>
  );

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Typography>
      </Box>

      <GridContainer sx={{ mx: -1.5 }}>
        {/* Summary Cards */}
        <GridItem sx={{ width: { xs: '100%', sm: '50%', md: '25%' } }}>
          <StatCard 
            title="Total Employees" 
            value="128" 
            icon={<People />} 
            color="primary" 
          />
        </GridItem>
        <GridItem sx={{ width: { xs: '100%', sm: '50%', md: '25%' } }}>
          <StatCard 
            title="Departments" 
            value="12" 
            icon={<BusinessCenter />} 
            color="secondary" 
          />
        </GridItem>
        <GridItem sx={{ width: { xs: '100%', sm: '50%', md: '25%' } }}>
          <StatCard 
            title="Active Projects" 
            value="24" 
            icon={<Assignment />} 
            color="warning" 
          />
        </GridItem>
        <GridItem sx={{ width: { xs: '100%', sm: '50%', md: '25%' } }}>
          <StatCard 
            title="Revenue" 
            value="$845K" 
            icon={<Payments />} 
            color="success" 
          />
        </GridItem>

        {/* Charts */}
        <GridItem sx={{ width: { xs: '100%', md: '66.666%' } }}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 15px rgba(0, 0, 0, 0.05)' }}>
            <CardHeader 
              title="Revenue Overview" 
              titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
              sx={{ pb: 0 }}
            />
            <CardContent>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.5} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke={theme.palette.primary.main} 
                      fill={theme.palette.primary.light} 
                      fillOpacity={0.3}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="expenses" 
                      stroke={theme.palette.error.main} 
                      fill={theme.palette.error.light} 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </GridItem>

        <GridItem sx={{ width: { xs: '100%', md: '33.333%' } }}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 15px rgba(0, 0, 0, 0.05)', height: '100%' }}>
            <CardHeader 
              title="Department Distribution" 
              titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
              sx={{ pb: 0 }}
            />
            <CardContent>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={employeeData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill={theme.palette.secondary.main} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </GridItem>

        <GridItem sx={{ width: { xs: '100%', md: '50%' } }}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 15px rgba(0, 0, 0, 0.05)' }}>
            <CardHeader 
              title="Recent Activity" 
              titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
            />
            <CardContent sx={{ pt: 0 }}>
              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'success.light' }}>
                      <CheckCircle fontSize="small" sx={{ color: 'success.main' }} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="New employee onboarded" 
                    secondary="Alex Johnson joined Engineering"
                    primaryTypographyProps={{ fontWeight: 'medium' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      <Info fontSize="small" sx={{ color: 'primary.main' }} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Project completed" 
                    secondary="Mobile App v2.0 has been launched"
                    primaryTypographyProps={{ fontWeight: 'medium' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'warning.light' }}>
                      <Error fontSize="small" sx={{ color: 'warning.main' }} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="System maintenance" 
                    secondary="Scheduled for next weekend"
                    primaryTypographyProps={{ fontWeight: 'medium' }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </GridItem>

        <GridItem sx={{ width: { xs: '100%', md: '50%' } }}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 15px rgba(0, 0, 0, 0.05)' }}>
            <CardHeader 
              title="Top Performers" 
              titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
            />
            <CardContent sx={{ pt: 0 }}>
              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar>MJ</Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Maria Johnson" 
                    secondary="Sales • 125% of target"
                    primaryTypographyProps={{ fontWeight: 'medium' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar>RL</Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Robert Lee" 
                    secondary="Engineering • 5 projects completed"
                    primaryTypographyProps={{ fontWeight: 'medium' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar>SP</Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Sarah Parker" 
                    secondary="Marketing • 98% campaign success"
                    primaryTypographyProps={{ fontWeight: 'medium' }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
};

export default Dashboard;