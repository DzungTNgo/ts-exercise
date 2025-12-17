import type { Insight } from "$models/insight.ts";
import type { HasDBClient } from "../shared.ts";
import { ResponseError } from "../utils/error.ts";
import { Status } from "@oak/oak";
import * as insightsTable from "$tables/insights.ts";

type Input = HasDBClient & {
  id: number;
};

export default (input: Input): number => {
  try {
    console.log(`Deleting insight with ID ${input.id}`);
    const result = input.db.exec(insightsTable.deleteStatement, input.id);
    return result;
  } catch (error) {
    console.error("Failed to delete insight from DB", error);
    throw new ResponseError(
      Status.InternalServerError,
      "Failed to add an insight.",
    );
  }
};
