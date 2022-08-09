import Stack from "@mui/material/Stack";
import React, { useEffect, useState } from "react";
import Constants from "../apis/Constants";
import BottomAppBar from "../components/Appbar";
import Error from "../components/Error";
import SkeletonItem from "../components/SkeletonItem";
import SummaryItem from "../components/SummaryItem";

function Summary(props) {
  const [summaries, setSummaries] = useState({});
  const [total, setTotal] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({
    summary: false,
    user: false,
  });

  const getSummarize = () => {
    fetch("http://127.0.0.1:8000/api/summarize", {
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
            inTotal(data);
            setErrors((errors) => ({
              ...errors,
              summary: false,
            }));
          });
        } else {
          throw new Error("Something went wrong");
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

  const getUser = () => {
    fetch("http://127.0.0.1:8000/api/auth/users/me/", {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setCurrentUser(data);
            setErrors((errors) => ({
              ...errors,
              user: false,
            }));
          });
        } else {
          throw new Error("Something went wrong");
        }
      })
      .catch((error) => {
        console.log(error);
        setErrors((errors) => ({
          ...errors,
          user: true,
        }));
      });
  };

  const Overrall = () => {
    if (total > 0) {
      return (
        <h5 style={{ color: "orange", padding: "10px" }}>
          Overall, you owe ${Math.abs(total)}
        </h5>
      );
    }
    return (
      <h5 style={{ color: "green", padding: "10px" }}>
        Overall, people owe you ${Math.abs(total).toFixed(2)}
      </h5>
    );
  };

  const toggleFetch = () => {
    getUser();
    getSummarize();
  };

  const inTotal = (summaries) => {
    var total = 0;
    for (let key in summaries) {
      total += summaries[key][0];
    }
    setTotal(total);
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      getUser();
      getSummarize();
      setLoading(false);
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
    <div>
      {loading ? (
        <SkeletonItem header={true} />
      ) : (
        <div>
          {total !== null ? Overrall() : null}
          <Stack spacing={2} style={{ marginBottom: "10px" }}>
            {Object.entries(summaries).map(([key, value], index) => (
              <SummaryItem
                key={index}
                user={{ id: value[1], username: key }}
                debt={value[0]}
                index={index}
                currentUser={currentUser}
              />
            ))}
          </Stack>
        </div>
      )}
      <BottomAppBar value="home" />
    </div>
  );
}

export default Summary;
