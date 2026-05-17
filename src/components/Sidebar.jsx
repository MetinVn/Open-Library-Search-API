import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, IconButton, Stack, Collapse } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Person, Book, Home, ArrowBack } from "@mui/icons-material";
import { ROUTES } from "../routes/routes";

const navItems = [
  {
    label: "Home",
    path: ROUTES.HOME,
    icon: <Home />,
  },
  {
    label: "Search Books",
    path: ROUTES.SEARCH_BOOKS,
    icon: <Book />,
  },
  {
    label: "Search Authors",
    path: ROUTES.SEARCH_AUTHORS,
    icon: <Person />,
  },
];

const Sidebar = ({ colors }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  const handleMenuClick = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsExpanded(false);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const primaryTextColor = colors === "dark" ? "common.white" : "common.black";
  const primaryBgColor = colors === "dark" ? "#1F2937" : "#bee3db";

  return (
    <Box
      ref={sidebarRef}
      sx={{
        position: "fixed",
        top: "16px",
        left: "16px",
        zIndex: 1100,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <Box
        sx={{ position: "relative" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Back Button */}
        <Button
          variant="text"
          onClick={handleBackClick}
          endIcon={<ArrowBack />}
          sx={{
            position: "absolute",
            left: "0",
            top: "50%",
            transform: isHovered ? "translateX(30px) translateY(-50%)" : "translateX(0) translateY(-50%)",
            transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
            opacity: isHovered ? 1 : 0,
            pointerEvents: isHovered ? "auto" : "none",
            backgroundColor: primaryBgColor,
            color: primaryTextColor,
            borderRadius: "5px",
            minWidth: "60px",
            height: "36px",
            px: 2,
            boxShadow: 3,
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: primaryBgColor,
              opacity: 0.9,
            },
          }}
        >
          Back
        </Button>

        {/* Menu Toggle Button */}
        <IconButton
          onClick={handleMenuClick}
          sx={{
            backgroundColor: primaryBgColor,
            color: primaryTextColor,
            boxShadow: 3,
            "&:hover": {
              backgroundColor: primaryBgColor,
              opacity: 0.9,
            },
            position: "relative",
            zIndex: 2,
          }}
        >
          <Box sx={{ position: "relative", width: 24, height: 24, display: "grid", placeItems: "center" }}>
            <MenuIcon
              sx={{
                position: "absolute",
                transition: "opacity 0.3s, transform 0.3s",
                opacity: isExpanded ? 0 : 1,
                transform: isExpanded ? "rotate(-90deg)" : "rotate(0)",
              }}
            />
            <CloseIcon
              sx={{
                position: "absolute",
                transition: "opacity 0.3s, transform 0.3s",
                opacity: isExpanded ? 1 : 0,
                transform: isExpanded ? "rotate(0)" : "rotate(90deg)",
              }}
            />
          </Box>
        </IconButton>
      </Box>

      {/* Collapsible Navigation Menu */}
      <Collapse in={isExpanded}>
        <Stack
          spacing={1}
          sx={{
            mt: 1,
            p: 2,
            backgroundColor: primaryBgColor,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="overline" sx={{ color: primaryTextColor, px: 1, opacity: 0.7 }}>
            Navigation
          </Typography>
          {navItems.map((item) => (
            <Button
              key={item.label}
              onClick={() => handleNavigation(item.path)}
              startIcon={item.icon}
              sx={{
                color: primaryTextColor,
                justifyContent: "flex-start",
                textTransform: "none",
                fontWeight: 500,
                width: "100%",
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Stack>
      </Collapse>
    </Box>
  );
};

export default Sidebar;
