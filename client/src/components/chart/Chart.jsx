import "./chart.scss";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useEffect, useState } from "react";
import axios from "axios";

const data = [];

const Chart = ({ aspect, title }) => {
  const [subject, setSubject] = useState("");
  const [chartData, setChartData] = useState([]);

  const fetchData = () => {
    axios
      .get(`http://localhost:8081/average-points/${subject}`)
      .then((results) => {
        setChartData(results.data);
      })
      .catch((error) => {
        console.error("Error fetching chart data: ", error);
      });
  };

  const handleSubjectChange = (event) => {
    setSubject(event.target.value);
  };

  // Fetch data when the subject changes
  useEffect(() => {
    if (subject) {
      fetchData();
    }
  }, [subject]);

  return (
    <div className="chart">
      <div className="wrapper">
        <div className="title">{title}</div>
        <div className="search">
          <input
            type="text"
            placeholder="Search by subject ..."
            value={subject}
            onChange={handleSubjectChange}
          />
          <SearchOutlinedIcon
            style={{ cursor: "pointer" }}
            onClick={fetchData}
          />
        </div>
      </div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <AreaChart
          width={730}
          height={250}
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="grade" stroke="gray" />
          <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="average_points"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#total)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
