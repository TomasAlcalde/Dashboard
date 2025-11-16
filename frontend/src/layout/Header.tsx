import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import {
  Menu as MenuIcon,
  NotificationsNoneOutlined,
  Search,
} from "@mui/icons-material";
import VambeLogo from "../components/UI/VambeLogo";
import VambeLogoSmall from "../components/UI/VambeLogoSmall";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <Box
      component="header"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        width: "100%",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(255,255,255,0.95)",
        paddingRight: { xs: "16px", md: "32px" },
        paddingLeft: {
          xs: "16px",
          md: "32px",
        },
        py: 2,
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Box className="hidden md:block w-56">
            <VambeLogo className="h-10" />
          </Box>
        <IconButton
          onClick={onMenuClick}
          className="hover:text-primary"
          sx={{
            borderRadius: 2,
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box display="flex" alignItems="center" gap={2}>
          <Box className="md:hidden">
            <VambeLogo className="h-8" />
          </Box>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Typography variant="h6" fontWeight={600}>
              Revenue Intelligence
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Deal overview
            </Typography>
          </Box>
        </Box>
      </Stack>

      <Stack direction="row" spacing={1.5} alignItems="center">
        <IconButton
          sx={{
            display: { xs: "none", md: "inline-flex" },
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <Search />
        </IconButton>
        <IconButton
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <NotificationsNoneOutlined />
        </IconButton>
        <Button
          variant="contained"
          size="small"
          sx={{ display: { xs: "none", sm: "inline-flex" } }}
        >
          New Report
        </Button>
      </Stack>
    </Box>
  );
};

export default Header;
