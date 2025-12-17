// deno-lint-ignore-file no-explicit-any
import { Database } from "@db/sqlite";
import * as oak from "@oak/oak";
import * as path from "@std/path";
import { Port } from "../lib/utils/index.ts";
import listInsights from "./operations/list-insights.ts";
import lookupInsight from "./operations/lookup-insight.ts";
import addInsight from "./operations/add-insight.ts";
import deleteInsight from "./operations/delete-insight.ts";
import { createTable } from "$tables/insights.ts";
import { ResponseError } from "./utils/error.ts";

console.log("Loading configuration");

const env = {
  port: Port.parse(Deno.env.get("SERVER_PORT")),
};

const dbFilePath = path.resolve("tmp", "db.sqlite3");

console.log(`Opening SQLite database at ${dbFilePath}`);

await Deno.mkdir(path.dirname(dbFilePath), { recursive: true });
const db = new Database(dbFilePath);

db.exec(createTable);

console.log("Initialising server");

const router = new oak.Router();

router.get("/_health", (ctx) => {
  ctx.response.body = "OK";
  ctx.response.status = oak.Status.OK;
});

router.get("/insights", (ctx) => {
  const result = listInsights({ db });
  ctx.response.body = result;
  ctx.response.status = oak.Status.OK;
});

router.get("/insights/:id", (ctx) => {
  const params = ctx.params as Record<string, any>;
  const result = lookupInsight({ db, id: params.id });
  ctx.response.body = result;
  ctx.response.status = oak.Status.OK;
});

router.post("/insights", async (ctx) => {
  try {
    const insightData = await ctx.request.body.json();
    const result = addInsight({ db, data: insightData });

    ctx.response.status = oak.Status.Created;
    ctx.response.body = result;
  } catch (error) {
    if (error instanceof ResponseError) {
      ctx.response.status = error.status;
      ctx.response.body = error.message;
    } else {
      ctx.response.status = oak.Status.InternalServerError;
      ctx.response.body = "Internal Server Error";
    }
  }
});

router.delete("/insights/:id", (ctx) => {
  try {
    const params = ctx.params as Record<string, any>;
    const result = deleteInsight({ db, id: params.id });
    
    const responseStatus = result > 0 ? oak.Status.NoContent : oak.Status.NotFound;
    ctx.response.status = responseStatus;
  } catch (error) {
    if (error instanceof ResponseError) {
      ctx.response.status = error.status;
      ctx.response.body = error.message;
    } else {
      ctx.response.status = oak.Status.InternalServerError;
      ctx.response.body = "Internal Server Error";
    }
  }
});

const app = new oak.Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(env);
console.log(`Started server on port ${env.port}`);
