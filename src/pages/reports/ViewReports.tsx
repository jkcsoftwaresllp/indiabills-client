// ViewReports.tsx

import React, { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Carousel from "react-material-ui-carousel";
import PageAnimate from "../../components/Animate/PageAnimate";
import {
  Inventory as InventoryIcon,
  Person as PersonIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  LocationOn as LocationOnIcon,
  BugReport as BugReportIcon,
  Category as CategoryIcon,
  LocalOffer as LocalOfferIcon,
} from "@mui/icons-material";

const reports = [
  {
    key: "stock-level",
    title: "Stock and Sales Summary",
    description: "View current stock levels and sales summaries.",
    icon: <InventoryIcon fontSize="large" />,
    navigateTo: "/reports/stocklevel",
  },
  {
    key: "supplier-performance",
    title: "Supplier Performance",
    description: "Analyze performance of your suppliers.",
    icon: <PersonIcon fontSize="large" />,
    navigateTo: "/reports/supplierperformance",
  },
  {
    key: "invoice",
    title: "Invoice",
    description: "Check invoice details and summaries.",
    icon: <AssessmentIcon fontSize="large" />,
    navigateTo: "/reports/invoice",
  },
  {
    key: "customer-purchase",
    title: "Customer Purchase",
    description: "Review customer purchase reports.",
    icon: <PersonIcon fontSize="large" />,
    navigateTo: "/reports/customerpurchase",
  },
  {
    key: "expense",
    title: "Expense",
    description: "Monitor your expenses over time.",
    icon: <TrendingUpIcon fontSize="large" />,
    navigateTo: "/reports/expenses",
  },
  // {
  //   key: "warehouse-utilization",
  //   title: "Warehouse Utilization",
  //   description: "Evaluate warehouse space utilization.",
  //   icon: <LocationOnIcon fontSize="large" />,
  //   navigateTo: "/reports/warehouse-utilization",
  // },
  {
    key: "stock-issue",
    title: "Stock Issue",
    description: "Identify and resolve stock issues.",
    icon: <BugReportIcon fontSize="large" />,
    navigateTo: "/reports/stockissue",
  },
  {
    key: "credits",
    title: "Credit",
    description: "Manage credit reports and analyses.",
    icon: <CategoryIcon fontSize="large" />,
    navigateTo: "/reports/credits",
  },
  {
    key: "revenue",
    title: "Revenue Report",
    description: "Track revenue reports over periods.",
    icon: <TrendingUpIcon fontSize="large" />,
    navigateTo: "/reports/revenue",
  },
  {
    key: "HSN",
    title: "HSN Report",
    description: "Report of HSN.",
    icon: <LocalOfferIcon fontSize="large" />,
    navigateTo: "/reports/hsn",
  },
  {
    key: "Sales",
    title: "Sales Report",
    description: "Viewing invoice ordered by their tax slabs.",
    icon:  <AssessmentIcon fontSize="large" />,
    navigateTo: "/reports/pms",
  },
];

const ViewReports = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeIndex, setActiveIndex] = useState(0);

  const handleCarouselChange = (index: number) => {
    setActiveIndex(index);
  };

  const handleReportClick = (index: number) => {
    setActiveIndex(index);
  };

  const handleNavigate = () => {
    navigate(reports[activeIndex].navigateTo);
  };

  return (
    <PageAnimate nostyle>
      <Box
        p={2}
        width="100%"
        minHeight="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Box width="100%" maxWidth={800}>
          <Carousel
            index={activeIndex}
            onChange={handleCarouselChange}
            interval={5000}
            indicators={false}
            navButtonsAlwaysVisible
          >
            {reports.map((report, index) => (
              <Paper
                key={report.key}
                elevation={3}
                sx={{
                  padding: theme.spacing(4),
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: "var(--color-primary)",
                  color: theme.palette.getContrastText("#1e2938"),
                }}
                onClick={handleNavigate}
              >
                {React.cloneElement(report.icon, {
                  style: { fontSize: "80px" },
                })}
                <Typography
                  variant="h4"
                  sx={{ marginTop: theme.spacing(2), fontWeight: "bold" }}
                >
                  {report.title}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ marginTop: theme.spacing(1) }}
                >
                  {report.description}
                </Typography>
              </Paper>
            ))}
          </Carousel>
        </Box>
        <Box
          mt={4}
          width="100%"
          maxWidth={800}
          display="flex"
          justifyContent="center"
          overflow="overflow"
        >
          <Grid container spacing={2} justifyContent="center">
            {reports.map((report, index) => (
              <Grid item key={report.key}>
                <Paper
                  elevation={3}
                  sx={{
                    padding: theme.spacing(1),
                    cursor: "pointer",
                    borderRadius: theme.shape.borderRadius,
                    border:
                      activeIndex === index
                        ? `4px solid var(--color-accent)`
                        : `4px solid transparent`,
                    backgroundColor: "var(--color-primary)",
                    color: theme.palette.getContrastText("#1e2938"),
                    "&:hover": {
                      borderColor: "var(--color-accent)",
                    },
                  }}
                  onClick={() => handleReportClick(index)}
                >
                  {React.cloneElement(report.icon)}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </PageAnimate>
  );
};

export default ViewReports;
