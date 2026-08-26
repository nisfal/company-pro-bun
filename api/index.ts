import app from "../src/router";

export default async function handler(req: Request): Promise<Response> {
  return app.fetch(req);
}

export const config = {
  runtime: "edge",
};
