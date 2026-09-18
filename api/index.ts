/**
 * Vercel Serverless Function entry point.
 * Bundled via esbuild (CJS) and deployed as @vercel/node function.
 * All routes are proxied here via vercel.json rewrites.
 */
import { createAdaptorServer } from "@hono/node-server";
import app from "../src/router";

module.exports = createAdaptorServer(app);
