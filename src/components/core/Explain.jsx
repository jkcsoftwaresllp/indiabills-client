import * as React from 'react';
import Popover from '@mui/material/Popover';
import styles from './styles/Explain.module.css';

const MouseHoverPopover = ({ triggerElement, popoverContent }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
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
      className={styles.customPopover}
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
      classes={{ paper: styles.popoverPaper }}
    >
      <div className={styles.popoverContent}>
        {popoverContent}
      </div>
    </Popover>
  </div>
);
};

export default MouseHoverPopover;
