import MultiPageAnimate from "../../components/Animate/MultiPageAnimate";
import { Button } from "@mui/material";
import React from "react";
import styles from './styles/SetupTemplate.module.css';

const SetupTemplate = ({ heading, main, finish, big, navigation, setPage, }) => {
	const parts = heading.split(/(\[.*?\])/);

	return (
  <MultiPageAnimate>
    <div
      className={`${styles.wrapper} ${big ? styles.big : styles.small}`}
    >
      <h1 className={styles.title}>
        {parts.map((part, index) =>
          part.startsWith('[') && part.endsWith(']') ? (
            <span key={index} className={styles.highlight}>
              {part.slice(1, -1)}
            </span>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </h1>

      <main className={big ? styles.fullWidth : ''}>{main}</main>

      <div className={styles.navigation}>
        {(navigation === 'final' || navigation === 'both') && (
          <Button
            sx={{ color: '#be123c' }}
            size="small"
            onClick={() => setPage((prev) => prev - 1)}
          >
            Previous
          </Button>
        )}
        {navigation === 'both' && (
          <Button
            sx={{ color: '#be123c' }}
            size="small"
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </Button>
        )}
        {navigation === 'next' && (
          <Button
            sx={{ color: '#be123c' }}
            size="small"
            onClick={() => setPage((prev) => prev + 1)}
          >
            Begin
          </Button>
        )}
        {navigation === 'final' && (
          <Button
            sx={{ color: '#be123c' }}
            size="small"
            onClick={() => finish()}
          >
            Finish
          </Button>
        )}
      </div>
    </div>
  </MultiPageAnimate>
);
};

export default SetupTemplate;
