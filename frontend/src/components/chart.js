import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import React from "react";
import { Pie } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);

function ChartPie(props) {
  const options = {
    labels: props.keys,
    datasets: [
      {
        label: "Expenses",
        data: props.values,
        backgroundColor: [
          "rgb(255,0,0)",
          "rgb(0,0,255)",
          "rgb(255,255,0)",
          "rgb(0,255,0)",
          "rgb(0,255,255)",
          "rgb(255,0,255)",
          "rgb(0,0,128)",
        ],
        hoverOffset: 4,
      },
    ],
  };
  return (
    <div>
      <Pie data={options} />
    </div>
  );
}

export default ChartPie;
