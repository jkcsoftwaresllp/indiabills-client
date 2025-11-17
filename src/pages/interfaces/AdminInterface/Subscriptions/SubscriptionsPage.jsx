import { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Container,
  Typography
} from '@mui/material';
import SubscriptionPlans from './SubscriptionPlans';
import SubscriptionHistory from './SubscriptionHistory';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`subscription-tabpanel-${index}`}
      aria-labelledby={`subscription-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 1 }}>{children}</Box>}
    </div>
  );
}

const SubscriptionsPage = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="xl" sx={{ py: 1, flex: 1, overflow: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 2 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 800, 
              mb: 0.3,
              letterSpacing: '-0.02em',
              fontSize: '1.95rem',
              background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Subscription Management
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#64748b',
              fontWeight: 400,
              fontSize: '0.95rem'
            }}
          >
            Manage plans and view subscription history
          </Typography>
        </Box>

        {/* Tabs */}
        <Box 
          sx={{ 
            background: 'white',
            borderRadius: 1.75,
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
          }}
        >
          <Box sx={{ borderBottom: '2px solid #e2e8f0' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="subscription tabs"
              sx={{
                px: 2,
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  py: 1.5,
                  color: '#64748b',
                  minWidth: 'auto',
                  mr: 2,
                  '&.Mui-selected': {
                    color: 'primary.main'
                  }
                },
                '& .MuiTabs-indicator': {
                  background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
                  height: 3,
                  borderRadius: '2px 2px 0 0'
                }
              }}
            >
              <Tab 
                label="Available Plans" 
                id="subscription-tab-0" 
                aria-controls="subscription-tabpanel-0"
              />
              <Tab 
                label="Subscription History" 
                id="subscription-tab-1" 
                aria-controls="subscription-tabpanel-1"
              />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0} sx={{ py: 1.25 }}>
            <SubscriptionPlans />
          </TabPanel>
          <TabPanel value={tabValue} index={1} sx={{ py: 1.25 }}>
            <SubscriptionHistory />
          </TabPanel>
        </Box>
      </Container>
    </Box>
  );
};

export default SubscriptionsPage;
