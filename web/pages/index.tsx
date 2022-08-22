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
  GraphModel,
  loadGraphModel,
  tensor1d,
  Tensor,
  Rank,
} from "@tensorflow/tfjs";
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
import Head from "next/head";

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

export const metadata = {
  title: "Hotel Review Rating Prediction",
  image: "",
  description: "Hotel Review Rating Prediction",
};

const Home: NextPage = () => {
  const [text, setText] = useState<string | null>(null);
  const chartRef = useRef<ChartJS | null>(null);
  const [model, setModel] = useState<GraphModel | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!text || text.length < 64) {
      return;
    }

    let currModel: GraphModel;

    if (!model) {
      currModel = await loadGraphModel(
        "https://raw.githubusercontent.com/timthedev07/trip-advisor-rating-prediction/dev/model/model.json"
      );
      setModel(currModel);
    } else {
      currModel = model;
    }

    const chart = chartRef.current;
    if (!chart) return;

    const [result] = (await currModel.executeAsync(
      tensor1d([text])
    )) as Tensor<Rank>[];

    const distribution = (await result.array()) as number[];

    chart.data.datasets[0].data = distribution;
    chart.update();
  };

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="title" content={metadata.title} />
        <meta name="description" content={metadata.title} />
        <meta name="robots" content="index, follow" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="0 days" />
        <meta name="author" content="Tim <timpersonal07@gmail.com>" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:site_name" content={metadata.title} />
        <meta property="og:url" content="https://timthedev07.github.io/" />
        <meta property="og:image" content={metadata.image} />
        <meta property="og:description" content={metadata.description} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@timthedev07" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image" content={metadata.image} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <meta
          name="google-site-verification"
          content="ou31BwzL6hYs78yHQZrfEFRvZIBWxVoPkErFfm0f2z4"
        />
      </Head>
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
                style={{
                  minHeight: "170px",
                }}
                placeholder={"Enter Review Here"}
              ></Textarea>
              {!!text && text.length < 64 && text.length > 0 ? (
                <FormErrorMessage>
                  A minimum of 64 characters is required to activate the
                  detector.
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
                    data: [0, 0, 0, 0, 0],
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
                // maintainAspectRatio: false,
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
    </>
  );
};

export default Home;
