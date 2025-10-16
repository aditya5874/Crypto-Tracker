import React, { useEffect, useState } from "react";
import Chart from "react-google-charts";

const LineChart = ({ historicalData }) => {
  const [data, setData] = useState([["Date", "Prices"]]);

  useEffect(() => {
    if (!historicalData || !historicalData.prices) return;

    const seenDays = new Set();
    const dataCopy = [["Date", "Prices"]];

    historicalData.prices.forEach(([timestamp, price]) => {
      const date = new Date(timestamp);
      const day = date.getDate(); //  Only show day number
      if (seenDays.has(day)) return;
      seenDays.add(day);
      dataCopy.push([day.toString(), price]);
    });

    setData(dataCopy);
  }, [historicalData]);

  const options = {
    legend: { position: "right", textStyle: { color: "#222" } },
    hAxis: {
      title: "Day",
      textStyle: { color: "#222" },
      titleTextStyle: { color: "#222" },
    },
    vAxis: {
      title: "Price",
      textStyle: { color: "#222" },
      titleTextStyle: { color: "#222" },
    },
    chartArea: { left: 80, right: 100, width: "70%", height: "60%" },
    backgroundColor: "#fff",
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Chart
        chartType="LineChart"
        data={data}
        options={options}
        height="100%"
      />
      {/* ✅ Heading below chart */}
      <p
        style={{
          marginTop: "8px",
          color: "#fff",
          fontSize: "16px",
          fontWeight: "500",
        }}
      >
        Past 7 Days History
      </p>
    </div>
  );
};

export default LineChart;
