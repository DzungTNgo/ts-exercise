import type { Insight } from "$models/insight.ts";
import type { HasDBClient } from "../shared.ts";
import * as insightsTable from "$tables/insights.ts";

type Input = HasDBClient & {
  data: insightsTable.Insert;
};

export default (input: Input): Insight | undefined => {
  const { brand, createdAt, text } = input.data;

  if (!brand || typeof brand !== "string") {
    console.error("Validation error: invalid 'brand'", { brand });
    return;
  }
  if (!text || typeof text !== "string") {
    console.error("Validation error: invalid 'text'", { text });
    return;
  }

  const createdAtDate = new Date(createdAt);
  if (Number.isNaN(createdAtDate.getTime())) {
    console.error("Validation error: invalid 'createdAt'", { createdAt });
    return;
  }

  try {
    console.log(`Add an insight`);

    input.db.exec(
      "INSERT INTO insights (brand, createdAt, text) VALUES (?, ?, ?)",
      brand,
      createdAtDate.toISOString(),
      text,
    );
    const insertedId = input.db.lastInsertRowId;

    const [row] = input.db.sql<
      insightsTable.Row
    >`SELECT * FROM insights WHERE id = ${insertedId} LIMIT 1`;
    const result = { ...row, createdAt: new Date(row.createdAt) };
    return result;
  } catch (error) {
    
    console.error("Failed to insert insight into DB", error);
    return;
  }
};
