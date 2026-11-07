/// <reference path="types.d.ts"/>
import { PolymathPinecone, decodeEmbedding } from "@polymath-ai/host";
import { Form } from "multiparty";
import * as fs from "fs";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export const FORM_LIMITS = {
  maxFields: 20,
  maxFilesSize: 1, // multiparty bounds file bytes via maxFilesSize; 1 byte immediately triggers ETOOBIG
  maxFieldsSize: 1024 * 1024,
};

export default async function (req: VercelRequest, res: VercelResponse) {
  res.setHeader("content-type", "application/json");

  const sendJson = (status: number, data: any) => {
    if (typeof res.status === "function") {
      res.status(status);
    } else {
      res.statusCode = status;
    }
    return typeof res.json === "function" ? res.json(data) : res.send(data);
  };

  if (req.method !== "POST") {
    return sendJson(405, { error: "Only POST is supported." });
  }

  const contentType = (req.headers?.["content-type"] || "").toLowerCase();
  if (!contentType.includes("multipart/form-data")) {
    return sendJson(400, { error: "Invalid request: multipart form-data required." });
  }

  try {
    const { body } = req;
    const otherOptions: { [key: string]: any } = {};

    if (body == null) {
      let parsed: { fields: any; files: any };
      try {
        parsed = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
          const form = new Form(FORM_LIMITS);
          form.parse(req, (err: any, fields: any, files: any) => {
            if (err) return reject(err);
            resolve({ fields, files });
          });
        });
      } catch (parseErr: any) {
        return sendJson(400, { error: parseErr?.message || "Invalid form data." });
      }

      if (parsed.files && Object.keys(parsed.files).length > 0) {
        for (const fileList of Object.values(parsed.files) as any[]) {
          if (Array.isArray(fileList)) {
            for (const file of fileList) {
              if (file?.path) {
                try {
                  fs.unlinkSync(file.path);
                } catch {
                  // ignore cleanup error
                }
              }
            }
          }
        }
        return sendJson(400, { error: "File uploads are not supported." });
      }

      if (!parsed.fields) {
        return sendJson(400, { error: "Missing form fields." });
      }

      for (const [key, value] of Object.entries(parsed.fields)) {
        otherOptions[key] = value;
      }
    } else {
      return sendJson(400, { error: "Invalid request: multipart form-data required." });
    }

    if ("query_embedding" in otherOptions) {
      try {
        const rawEmbedding = Array.isArray(otherOptions["query_embedding"])
          ? otherOptions["query_embedding"][0]
          : otherOptions["query_embedding"];
        otherOptions["query_embedding"] = decodeEmbedding(rawEmbedding);
      } catch (decodeErr: any) {
        return sendJson(400, { error: decodeErr?.message || "Invalid query_embedding." });
      }
    }

    const ph = new PolymathPinecone({
      namespace: process.env.PINECONE_NAMESPACE,
    });

    const polymathResponse = await ph.query(otherOptions);
    return sendJson(200, polymathResponse);
  } catch (err: any) {
    const status = err?.statusCode || 500;
    return sendJson(status, { error: err?.message || "Internal server error." });
  }
}
