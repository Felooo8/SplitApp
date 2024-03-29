import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import React, { useEffect, useState } from 'react';

import Constants from '../apis/Constants';
import BottomAppBar from '../components/Appbar';
import Error from '../components/Error';
import NothingToDisplay from '../components/NothingToDisplay';
import SkeletonItem from '../components/SkeletonItem';
import SummaryItem from '../components/SummaryItem';

type Errors = {
  summary: boolean;
};

// key == username, [number, number] == [user balance, user id]
type SummaryType = {
  [key: string]: [number, number];
};

export default function Summary() {
  const [summaries, setSummaries] = useState<SummaryType>({});
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({
    summary: false,
  });
  const timer = React.useRef<number>();

  const getSummarize = () => {
    fetch(Constants.SERVER + "/api/summarize", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            console.log(data);
            setSummaries(data);
            settingTotalBalance(data);
            setLoading(false);
            setErrors((errors) => ({
              ...errors,
              summary: false,
            }));
          });
        } else {
          throw Error("Something went wrong");
        }
      })
      .catch((error) => {
        console.log(error);
        setErrors((errors) => ({
          ...errors,
          summary: true,
        }));
      });
  };

  const OverrallHeading = () => {
    if (totalBalance < 0) {
      return (
        <h5 style={{ color: "orange", padding: "10px" }}>
          Overall, you owe ${Math.abs(totalBalance).toFixed(2)}
        </h5>
      );
    } else if (totalBalance === 0) {
      return (
        <h5 style={{ color: "black", padding: "10px" }}>You have no debts!</h5>
      );
    }
    return (
      <h5 style={{ color: "green", padding: "10px" }}>
        Overall, people owe you ${Math.abs(totalBalance).toFixed(2)}
      </h5>
    );
  };

  const toggleFetch = () => {
    setRefreshing(true);
    timer.current = window.setTimeout(() => {
      setRefreshing(false);
    }, Constants.PROGRESS_ANIMATION_TIME);
    getSummarize();
  };

  const settingTotalBalance = (summaries: SummaryType) => {
    var totalBalance = 0;
    for (let key in summaries) {
      totalBalance += summaries[key][0];
    }
    setTotalBalance(totalBalance);
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      getSummarize();
    }, Constants.LOADING_DATA_DELAY);
    return () => clearTimeout(timer);
  }, []);

  if (Object.values(errors).some((error) => error === true)) {
    return (
      <div>
        <Error toggle={toggleFetch} />
        <BottomAppBar value="home" />
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "65px" }}>
      {loading ? (
        <SkeletonItem header={true} />
      ) : (
        <div>
          <Box
            style={{
              position: "fixed",
              left: "0",
              right: "0",
              bottom: "56px",
              zIndex: "10",
            }}
          >
            <Fade in={refreshing} unmountOnExit>
              <LinearProgress sx={{ height: "8px" }} />
            </Fade>
          </Box>
          {totalBalance !== null ? OverrallHeading() : null}
          <Stack spacing={2} style={{ marginBottom: "10px" }}>
            {Object.keys(summaries).length === 0 ? (
              <NothingToDisplay
                statusIcon={MoneyOffIcon}
                mainText={"No debts yet"}
                helperText={"When you get one, it'll show up here"}
                toggleRefresh={toggleFetch}
                refreshing={refreshing}
              />
            ) : (
              Object.entries(summaries).map(([key, value], index) => (
                <SummaryItem
                  key={index}
                  id={value[1]}
                  balance={value[0]}
                  name={key}
                  index={index}
                  isGroup={false}
                />
              ))
            )}
          </Stack>
        </div>
      )}
      <BottomAppBar value="home" />
    </div>
  );
}
