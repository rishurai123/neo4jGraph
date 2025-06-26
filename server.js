const express = require("express");
const cors = require("cors");
const neo4j = require("neo4j-driver");

const app = express();
app.use(cors());

const driver = neo4j.driver(
  "bolt://localhost:7687",
  neo4j.auth.basic("neo4j", "Rishurai@123")
);

app.get("/movies", async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(`
      MATCH (m:Movies)-[:BELONGS_TO]->(g:Genre)
      RETURN m.title AS title, g.name AS genre
    `);

    const movies = result.records.map((record) => ({
      title: record.get("title"),
      genre: record.get("genre"),
    }));

    res.json(movies);
  } catch (err) {
    console.error("Error fetching data from Neo4j:", err);
    res.status(500).json({ error: "Failed to fetch movies" });
  } finally {
    await session.close();
  }
});

app.listen(4000, () => {
  console.log("🚀 Express API running on http://localhost:4000/movies");
});
