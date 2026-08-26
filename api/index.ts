import { createAdaptorServer } from "@hono/node-server";
import app from "../src/router";

module.exports = createAdaptorServer(app);
