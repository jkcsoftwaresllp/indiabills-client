import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Card,
  CardActionArea
} from '@mui/material';
import { LocalAtm, CreditCard } from '@mui/icons-material';

const PaymentTypeDialog = ({ open, onClose, onSelectPaymentType, fullAmount }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 800, fontSize: '1.2rem' }}>
        Select Payment Type
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          How would you like to proceed with payment?
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Full Payment Option */}
          <Card
            sx={{
              border: '2px solid',
              borderColor: 'primary.main',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 16px rgba(30, 41, 56, 0.15)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            <CardActionArea onClick={() => onSelectPaymentType('full')}>
              <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                <CreditCard
                  sx={{
                    fontSize: '2.5rem',
                    color: 'primary.main'
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Full Payment
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Pay the complete amount now
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 800,
                      color: 'primary.main',
                      mt: 0.5,
                      fontSize: '1.1rem'
                    }}
                  >
                    ₹{(fullAmount / 100).toLocaleString('en-IN')}
                  </Typography>
                </Box>
              </Box>
            </CardActionArea>
          </Card>

          {/* Partial Payment Option */}
          <Card
            sx={{
              border: '2px solid',
              borderColor: '#cbd5e1',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 16px rgba(30, 41, 56, 0.15)',
                transform: 'translateY(-2px)',
                borderColor: 'primary.main'
              }
            }}
          >
            <CardActionArea onClick={() => onSelectPaymentType('partial')}>
              <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocalAtm
                  sx={{
                    fontSize: '2.5rem',
                    color: '#cbd5e1'
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Partial Payment
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Pay in installments
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      mt: 0.5,
                      color: '#64748b'
                    }}
                  >
                    Pay less than full amount
                  </Typography>
                </Box>
              </Box>
            </CardActionArea>
          </Card>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentTypeDialog;
