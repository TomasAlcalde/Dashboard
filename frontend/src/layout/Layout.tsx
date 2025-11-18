import { useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import Sidebar from "./Sidebar";
import Header from "./Header";
import DeployMenu from "./DeployMenu";
import { Outlet } from "react-router-dom";

const SIDEBAR_OPEN = 256;
const SIDEBAR_CLOSED = 80;

const DESKTOP_CONTENT_GAP = 20;

const Layout = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    if (isDesktop) {
      setSidebarOpen((prev) => !prev);
    } else {
      setMobileMenuOpen((prev) => !prev);
    }
  };

  const sidebarWidth = isDesktop
    ? sidebarOpen
      ? SIDEBAR_OPEN
      : SIDEBAR_CLOSED
    : 0;
  const totalOffset = isDesktop ? sidebarWidth + DESKTOP_CONTENT_GAP : 0;

  return (
    <Box className="h-screen bg-white flex flex-col">
      <Header onMenuClick={toggleMenu} />

      {!isDesktop && (
        <DeployMenu
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
      )}

      <Box className="flex flex-1 w-full">
        {isDesktop && (
          <Sidebar
            open={sidebarOpen}
            openWidth={SIDEBAR_OPEN}
            closedWidth={SIDEBAR_CLOSED}
          />
        )}

        <Box
          className="flex-1 flex flex-col rounded-xl bg-slate-100 transition-all duration-300"
          sx={{
            minWidth: 0,
            ml: { xs: 0, md: `${sidebarWidth}px` },
            mr: { xs: 0, md: `${DESKTOP_CONTENT_GAP}px` },
            width: { xs: "100%", md: `calc(100% - ${totalOffset}px)` },
          }}
        >
          <Box component="main" className="flex-1 overflow-y-auto p-4 md:p-6">
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
