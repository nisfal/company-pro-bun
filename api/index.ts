import { createAdaptorServer } from "@hono/node-server";
import app from "../src/router";

export default createAdaptorServer(app);
