// SetupComponents/LandingSetup.jsx
import React, { memo } from "react";
import SetupTemplate from "../../../components/core/SetupTemplate";
import styles from "./LandingSetup.module.css"; 

const LandingSetup = memo(({ setPage }) => {
  const main = (
    <p className={styles.mainText}>
      We commit to provide the modern solution for inventory and
      distributorships. We are excited to have you onboard. Let&apos;s get you
      started with the setup.
    </p>
  );

  return (
    <SetupTemplate
      heading="Welcome to IndiaBills!"
      main={main}
      navigation="next"
      setPage={setPage}
    />
  );
});

LandingSetup.displayName = "LandingSetup";

export default LandingSetup;