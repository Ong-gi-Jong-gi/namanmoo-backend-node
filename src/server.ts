import express, { Application, Request, Response } from "express";

const app: Application = express();
const PORT: number = 8080;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
