import type { Insight } from "$models/insight.ts";
import type { HasDBClient } from "../shared.ts";
import * as insightsTable from "$tables/insights.ts";

type Input = HasDBClient & {
  id: number;
};

export default (input: Input): number | undefined => {

  const result = input.db.exec(insightsTable.deleteStatement, input.id);

  return result;
};
