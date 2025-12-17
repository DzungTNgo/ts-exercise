import { useEffect, useState } from "react";
import { Header } from "../components/header/header.tsx";
import { Insights } from "../components/insights/insights.tsx";
import styles from "./app.module.css";
import type { Insight } from "../schemas/insight.ts";

export const App = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    fetch(`/api/insights`)
      .then((res) => {

        if (!res.ok) throw new Error(`Error fetching data.`);
        return res.json();
      })
      .then((data: Insight[]) => setInsights(data))
      .catch((err) => {

        console.error("Failed to fetch insights:", err);
      });
  }, [reload]);

  return (
    <main className={styles.main}>
      <Header reload={reload} setReload={setReload}/>
      <Insights className={styles.insights} insights={insights} reload={reload} setReload={setReload}/>
    </main>
  );
};
