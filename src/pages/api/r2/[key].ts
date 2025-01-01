import { GetObjectCommand } from "@aws-sdk/client-s3";
import { NextApiRequest, NextApiResponse } from "next";
import { r2Client } from "@/lib/r2Client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { key } = req.query;

  try {
    const command = new GetObjectCommand({
      Bucket: "oszkarbacsi",
      Key: key as string,
    });

    const response = await r2Client.send(command);

    if (!response.Body) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Set appropriate headers
    res.setHeader("Content-Type", response.ContentType || "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=31536000");

    // Convert the readable stream to buffer and send it
    const chunks = [];
    // Add type assertion to handle SDK stream type
    for await (const chunk of response.Body as unknown as AsyncIterable<Uint8Array>) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    res.send(buffer);
  } catch (error) {
    console.error("Error fetching image from R2:", error);
    return res.status(500).json({ message: "Error fetching image" });
  }
}
