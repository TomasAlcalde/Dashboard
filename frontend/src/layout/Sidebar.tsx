import {
  Avatar,
  Box,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import { AnalyticsOutlined, AccountBoxOutlined } from "@mui/icons-material";

const navigation = [
  { icon: <AnalyticsOutlined />, label: "Metrics", path: "/metrics" },
  { icon: <AccountBoxOutlined />, label: "Clients", path: "/clients" },
];

interface SidebarProps {
  open: boolean;
  openWidth: number;
  closedWidth: number;
}

const Sidebar = ({ open, openWidth, closedWidth }: SidebarProps) => {
  const location = useLocation();

  return (
    <Box
      component="aside"
      sx={{
        width: open ? openWidth : closedWidth,
        height: "80vh",
        position: "fixed",
        left: 0,
        top: 0,
        display: "flex",
        flexDirection: "column",
        bgcolor: "white",
        transition: "width 0.3s ease",
        overflow: "hidden",
        zIndex: 30,
        mt: 10,
      }}
    >
      {open ? (
        <Box px={open ? 3 : 2} py={1}>
          <Typography
            variant="overline"
            color="text.secondary"
            className="tracking-wider"
          >
            Navigation
          </Typography>
        </Box>
      ) : null}

      <List
        component="nav"
        sx={{
          flexGrow: 0,
          px: open ? 2 : 1,
          py: 1,
          gap: 0.5,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {navigation.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: 2,
              gap: open ? 1.5 : 0,
              justifyContent: open ? "flex-start" : "center",
              px: open ? 2 : 1.25,
              py: 0,
              minHeight: 40,

              "& .MuiListItemText-primary": {
                fontWeight: 800,
              },
              "&.Mui-selected": {
                bgcolor: "primary.light",
                color: "primary.dark",
              },
              "&.Mui-selected:hover": {
                bgcolor: "primary.light",
              },
            }}
          >
            {item.icon}
            {open && <ListItemText primary={item.label} />}
          </ListItemButton>
        ))}
      </List>

      <Box
        px={open ? 3 : 2}
        py={3}
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: "primary.main" }}>VT</Avatar>
          {open && (
            <Box>
              <Typography variant="subtitle2">Tom Lead</Typography>
              <Typography variant="caption" color="text.secondary">
                Sales Ops
              </Typography>
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default Sidebar;
