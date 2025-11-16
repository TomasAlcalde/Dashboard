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
import VambeLogo from "../components/UI/VambeLogo";

const navigation = [
  { icon: <AnalyticsOutlined />, label: "Metrics", path: "/metrics" },
  { icon: <AccountBoxOutlined />, label: "Clients", path: "/clients" },
];

interface DeployMenuProps {
  open: boolean;
  onClose: () => void;
}

const DeployMenu = ({ open, onClose }: DeployMenuProps) => {
  const location = useLocation();

  return (
    <Box
      className="fixed inset-0 z-40 md:hidden"
      sx={{
        pointerEvents: open ? "auto" : "none",
      }}
    >
      <Box
        className="absolute inset-0 bg-slate-900/40 transition-opacity"
        sx={{ opacity: open ? 1 : 0 }}
        onClick={onClose}
      />

      <Box className="absolute inset-y-0 left-0 flex">
        <Box
          className="h-full w-72 max-w-[80vw] bg-white shadow-2xl border-r border-slate-100 flex flex-col"
          sx={{
            transform: open ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.3s ease",
          }}
        >
          <Box px={4} py={4} className="border-b border-slate-100">
            <VambeLogo className="h-8" />
          </Box>

          <List sx={{ flexGrow: 1, px: 1, py: 1 }}>
            {navigation.map((item) => (
              <ListItemButton
                key={item.path}
                component={NavLink}
                to={item.path}
                selected={location.pathname === item.path}
                onClick={onClose}
                sx={{
                  borderRadius: 2,
                  gap: 1.5,
                  px: 2,
                  "&.Mui-selected": {
                    bgcolor: "primary.light",
                    color: "primary.main",
                  },
                  "&.Mui-selected:hover": {
                    bgcolor: "primary.light",
                  },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  {item.icon}
                  <ListItemText primary={item.label} />
                </Stack>
              </ListItemButton>
            ))}
          </List>

          <Box
            px={4}
            py={3}
            className="border-t border-slate-100"
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "primary.main" }}>VT</Avatar>
              <Box>
                <Typography variant="subtitle2">Tom Lead</Typography>
                <Typography variant="caption" color="text.secondary">
                  Sales Ops
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DeployMenu;
