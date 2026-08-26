import { handle } from "@hono/node-server/vercel";
import app from "../src/router";

export default handle(app);
