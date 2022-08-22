import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Textarea,
} from "dragontail-experimental";
import type { NextPage } from "next";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title,
} from "chart.js";
import { FormEvent, useRef, useState } from "react";
ChartJS.register(
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title
);
ChartJS.defaults.color = "#bfbfbf";
ChartJS.defaults.borderColor = "rgba(255, 255, 255, 0.2)";

const Home: NextPage = () => {
  const [text, setText] = useState<string | null>(null);
  const chartRef = useRef<ChartJS | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!text || text.length < 64) {
      return;
    }

    const chart = chartRef.current;
    if (!chart) return;

    fetch("/", {
      method: "POST",
      body: JSON.stringify({
        text,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      const result = await res.json();

      const { distribution }: { distribution: number[] } = result;

      chart.data.datasets[0].data = distribution;
      chart.update();
    });
  };

  return (
    <div className="page">
      <main className="page-content">
        <form onSubmit={handleSubmit} className="text-form">
          <FormControl
            isInvalid={!!text && text.length < 64 && text.length > 0}
          >
            <FormLabel>Hotel Review to Predict</FormLabel>
            <Textarea
              onChange={(e) => {
                const newText = e.target.value;
                setText(newText);
              }}
              placeholder={"Enter Review Here"}
            ></Textarea>
            {!!text && text.length < 64 && text.length > 0 ? (
              <FormErrorMessage>
                A minimum of 64 characters is required to activate the detector.
              </FormErrorMessage>
            ) : null}
          </FormControl>
          <Button
            type="submit"
            className="submit-button"
            color="green"
            variant="solid"
          >
            Predict
          </Button>
        </form>
        <div className="bar-container">
          <Bar
            ref={chartRef as any}
            data={{
              datasets: [
                {
                  data: [1, 2, 3, 4, 5],
                  label: "HEY",
                  backgroundColor: [
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(255, 205, 86, 0.6)",
                    "rgba(255, 159, 64, 0.6)",
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                  ],
                },
              ],
              labels: [1, 2, 3, 4, 5],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: "Probability Distribution",
                },
                legend: {
                  display: false,
                },
              },
              scales: {
                yAxes: {
                  display: true,
                  beginAtZero: true,
                  title: {
                    text: "Probability",
                    display: true,
                  },
                },
                xAxes: {
                  title: {
                    text: "Star Rating",
                    display: true,
                  },
                },
              },
            }}
          ></Bar>
        </div>
      </main>
    </div>
  );
};

export default Home;
