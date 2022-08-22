import type { NextApiRequest, NextApiResponse } from "next";
import { loadLayersModel, Tensor, Rank } from "@tensorflow/tfjs-node";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  const { text } = req.body;

  if (!text || text.length < 64) {
    res.status(400).send("Requires a minimum length of 32 characters");
  }

  const model = await loadLayersModel("file://model/model.json");
  const [result] = model.predict([text]) as Tensor<Rank>[];
  const distribution = (await result.array()) as number[];

  res.status(200).json({
    distribution,
  });
};

export default handler;
