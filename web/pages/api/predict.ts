import type { NextApiRequest, NextApiResponse } from "next";
import {} from "@tensorflow/tfjs";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  const {} = req.body;
}
