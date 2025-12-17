import type { Insight } from "$models/insight.ts";
import type { HasDBClient } from "../shared.ts";
import { ResponseError } from "../utils/error.ts";
import { Status } from "@oak/oak";
import * as insightsTable from "$tables/insights.ts";

type Input = HasDBClient & {
  data: insightsTable.Insert;
};

export default (input: Input): Insight => {
  const { brand, createdAt, text } = input.data;

  if (!brand || typeof brand !== "string") {
    console.error("Validation error: invalid 'brand'", { brand });
    throw new ResponseError(Status.BadRequest, "Invalid 'brand' value");
  }
  if (!text || typeof text !== "string") {
    console.error("Validation error: invalid 'text'", { text });
    throw new ResponseError(
      Status.BadRequest,
      "Invalid 'text' in insight payload",
    );
  }

  const createdAtDate = new Date(createdAt);
  if (Number.isNaN(createdAtDate.getTime())) {
    console.error("Validation error: invalid 'createdAt'", { createdAt });
    throw new ResponseError(
      Status.BadRequest,
      "Invalid 'createdAt' in insight payload",
    );
  }

  try {
    console.log(`Adding an insight`);

    input.db.exec(insightsTable.insertStatement, brand, createdAtDate.toISOString(), text);
    const insertedId = input.db.lastInsertRowId;

    const result: Insight = {
      id: insertedId,
      brand,
      createdAt: createdAtDate,
      text,
    };

    return result;
  } catch (error) {
    console.error("Failed to insert insight into DB", error);
    throw new ResponseError(Status.InternalServerError, "Failed to add an insight.");
  }
};