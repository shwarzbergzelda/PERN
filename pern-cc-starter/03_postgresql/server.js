import express from "express";
import { eq } from "drizzle-orm";
import { db } from "./db.js";
import { cars } from "./schema.js";

const app = express();
const PORT = 3000;

const router = express.Router();

app.use(express.json());

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Hello from Car API!");
});

router.get("/cars", async (req, res) => {
  const allCars = await db.select().from(cars);

  res.json(allCars)
});

router.post("/cars", async (req, res) => {
  const { make, model, year, price } = req.body;

  if (!make || !model || !year || !price) {
    return res.status(400).json({
      error: "Please provide make, model, year, and price",
    });
  }

  const [newCar] = await db.insert(cars).values({ make, model, year, price }).returning();

  res.status(201).json(newCar);
});

router.put("/cars/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });

    const { make, model, year, price } = req.body;

    const update = {};
    if (make != null) update.make = make;
    if (model != null) update.model = model;
    if (year != null) update.year = Number(year);
    if (price != null) update.price = String(price);

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const [updatedCar] = await db
      .update(cars)
      .set(update)
      .where(eq(cars.id, id))
      .returning();

    if (!updatedCar) return res.status(404).json({ error: "Car not found" });
    res.json(updatedCar);
  } catch (err) {
    next(err);
  }
});

router.delete("/cars/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });

    const [deletedCar] = await db
      .delete(cars)
      .where(eq(cars.id, id))
      .returning();

    if (!deletedCar) return res.status(404).json({ error: "Car not found" });

    res.json({ message: "Car deleted successfully", car: deletedCar });
  } catch (err) {
    next(err);
  }
});

router.get("/cars/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });

    const [car] = await db.select().from(cars).where(eq(cars.id, id));

    if (!car) return res.status(404).json({ error: "Car not found" });
    res.json(car);
  } catch (err) {
    next(err);
  }
});

app.use("/api/v1", router);

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
