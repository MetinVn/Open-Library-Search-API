import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Person as PersonIcon, Book as BookIcon } from "@mui/icons-material";

const Sidebar = ({ colors }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  const handleMenuClick = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleNavigation = (navigation) => {
    if (navigation === "author") {
      navigate("/author");
    } else if (navigation === "book") {
      navigate("/books");
    }
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Box
      ref={sidebarRef}
      className="fixed top-0 left-[50%] transform -translate-x-1/2 z-[16]">
      <Box
        className={`flex flex-row rounded-b-md w-[30%] min-w-fit mx-auto items-center transition-all duration-300 ease-in-out ${
          isExpanded
            ? "h-fit mt-20 sm:h-[60px] sm:mt-0 md:h-[80px] py-4"
            : "h-0 py-0"
        } overflow-hidden`}>
        <Box
          className="w-full hover:opacity-50 bg-transparent border-none cursor-pointer font-medium text-base px-3 py-1 rounded-md transition duration-300 ease-in-out"
          onClick={() => handleNavigation("book")}>
          <Typography
            variant="body1"
            component="div"
            className="flex items-center gap-2 justify-center w-full">
            <BookIcon
              sx={{ color: colors === "dark" ? "black" : "white" || "#ffffff" }}
            />
            <Button
              sx={{ color: colors === "dark" ? "black" : "white" || "#ffffff" }}
              className="whitespace-nowrap text-white dark:text-black">
              Search Books
            </Button>
          </Typography>
        </Box>
        <Box
          className="w-full hover:opacity-50 bg-transparent border-none cursor-pointer font-medium text-base px-3 py-1 rounded-md transition duration-300 ease-in-out"
          onClick={() => handleNavigation("author")}>
          <Typography
            variant="body1"
            component="div"
            className="flex items-center gap-2 justify-center w-full">
            <PersonIcon
              sx={{ color: colors === "dark" ? "black" : "white" || "#ffffff" }}
            />
            <Button
              sx={{ color: colors === "dark" ? "black" : "white" || "#ffffff" }}
              className="whitespace-nowrap text-white dark:text-black">
              Search Authors
            </Button>
          </Typography>
        </Box>
      </Box>
      <Box
        className="flex items-center justify-center w-12 h-12 rounded-full dark:bg-[#1F2937] bg-[#bee3db] duration-300 fixed top-4 left-[-10%] sm:left-[-80%] cursor-pointer z-[16]"
        onClick={handleMenuClick}>
        <IconButton aria-label="menu" color="inherit">
          <MenuIcon
            sx={{
              color: colors === "dark" ? "white" : "black" || "#ffffff",
              transition: colors,
              transitionDuration: "300",
            }}
            className={`burger-menu ${isExpanded ? "open" : ""}`}
          />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Sidebar;
