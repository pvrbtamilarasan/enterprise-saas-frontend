import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { 
  AppBar, Toolbar, Typography, Drawer, Box, List, ListItem, 
  ListItemButton, ListItemIcon, ListItemText, IconButton, Divider, CssBaseline,
  Avatar, Menu, MenuItem, Badge, Tooltip, useTheme, useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  AttachMoney as FinanceIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  BusinessCenter as BusinessIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import { authService, licensingService } from '../../services/api.service';

const drawerWidth = 260;

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [enabledModules, setEnabledModules] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);

  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const userMenuOpen = Boolean(anchorEl);
  const notificationsOpen = Boolean(notificationAnchorEl);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchEnabledModules = async () => {
      try {
        if (user && user.tenantId) {
          const response = await licensingService.getTenantLicense(user.tenantId);
          if (response.data && response.data.license) {
            setEnabledModules(response.data.license.enabledModules || []);
          }
        }
      } catch (error) {
        console.error('Failed to fetch enabled modules:', error);
      }
    };

    fetchEnabledModules();
  }, [navigate, user]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    handleUserMenuClose();
    authService.logout();
    navigate('/login');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', module: 'dashboard' },
    { text: 'Human Capital', icon: <PeopleIcon />, path: '/hcm', module: 'hcm' },
    { text: 'Finance', icon: <FinanceIcon />, path: '/finance', module: 'finance' },
    { text: 'Procurement', icon: <BusinessIcon />, path: '/procurement', module: 'procurement' },
    { text: 'Logistics', icon: <InventoryIcon />, path: '/logistics', module: 'logistics' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings', module: 'settings' }
  ];

  const drawer = (
    <div>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
          Enterprise SaaS
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          (enabledModules.includes(item.module) || item.module === 'dashboard') && (
            <ListItem 
              key={item.text}
              component="div"
              sx={{ 
                borderRadius: '8px', 
                m: 1, 
                '&:hover': { 
                  backgroundColor: 'rgba(25, 118, 210, 0.08)'
                }
              }}
            >
              <ListItemButton onClick={() => handleNavigate(item.path)}>
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          )
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2, mt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          © Enterprise SaaS {new Date().getFullYear()}
        </Typography>
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {user?.firstName ? `Welcome, ${user.firstName}` : 'Dashboard'}
          </Typography>
          
          <Tooltip title="Notifications">
            <IconButton 
              color="inherit" 
              onClick={handleNotificationsOpen}
              sx={{ mr: 1 }}
            >
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          <Menu
            anchorEl={notificationAnchorEl}
            open={notificationsOpen}
            onClose={handleNotificationsClose}
            PaperProps={{ sx: { width: 320, maxHeight: 400 } }}
          >
            <MenuItem onClick={handleNotificationsClose}>
              <Box>
                <Typography variant="subtitle2">New Employee Added</Typography>
                <Typography variant="body2" color="text.secondary">John Smith was added to the system</Typography>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleNotificationsClose}>
              <Box>
                <Typography variant="subtitle2">System Update</Typography>
                <Typography variant="body2" color="text.secondary">The system will be updated tonight</Typography>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleNotificationsClose}>
              <Box>
                <Typography variant="subtitle2">Report Ready</Typography>
                <Typography variant="body2" color="text.secondary">Q2 Financial report is ready for review</Typography>
              </Box>
            </MenuItem>
          </Menu>
          
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleUserMenuOpen}
              size="small"
              edge="end"
              color="inherit"
            >
              <Avatar 
                sx={{ 
                  bgcolor: theme.palette.secondary.main,
                  width: 35,
                  height: 35
                }}
              >
                {user?.firstName ? user.firstName.charAt(0) : <AccountCircle />}
              </Avatar>
            </IconButton>
          </Tooltip>
          
          <Menu
            anchorEl={anchorEl}
            open={userMenuOpen}
            onClose={handleUserMenuClose}
            PaperProps={{ sx: { mt: 1.5, width: 200 } }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle1" noWrap>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {user?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => { handleUserMenuClose(); navigate('/profile'); }}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              My Profile
            </MenuItem>
            <MenuItem onClick={() => { handleUserMenuClose(); navigate('/settings'); }}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRadius: '0 10px 10px 0' 
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: '1px solid rgba(0, 0, 0, 0.08)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: '64px',
          backgroundColor: '#f9fafc',
          minHeight: '100vh'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
