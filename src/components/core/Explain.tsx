import * as React from 'react';
import Popover from '@mui/material/Popover';

interface MouseHoverPopoverProps {
  triggerElement: React.ReactNode;
  popoverContent: React.ReactNode;
}

const MouseHoverPopover: React.FC<MouseHoverPopoverProps> = ({ triggerElement, popoverContent }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <div
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        {triggerElement}
      </div>
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none',
          '& .MuiPaper-root': {
            backgroundColor: 'rgba(229, 229, 229, 0.85)',
            backdropFilter: 'blur(20px)',
            boxShadow: 'none',
          },
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <div className="rounded-xl text-lg font-semibold px-3 py-1">{popoverContent}</div>
      </Popover>
    </div>
  );
};

export default MouseHoverPopover;