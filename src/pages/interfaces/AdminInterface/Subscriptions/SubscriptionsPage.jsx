import { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Container
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
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const SubscriptionsPage = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="subscription tabs"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500
            }
          }}
        >
          <Tab label="Available Plans" id="subscription-tab-0" aria-controls="subscription-tabpanel-0" />
          <Tab label="Subscription History" id="subscription-tab-1" aria-controls="subscription-tabpanel-1" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <SubscriptionPlans />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <SubscriptionHistory />
      </TabPanel>
    </Container>
  );
};

export default SubscriptionsPage;
