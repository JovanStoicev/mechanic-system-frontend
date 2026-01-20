import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Car, Mechanic } from "../types/boss";
import type { Job, JobPart } from "../types/jobs";
import type { Part } from "../types/parts";

type BossData = {
  mechanics: Mechanic[];
  cars: Car[];
  parts: Part[];
  jobs: Job[];
  jobParts: JobPart[];

  addMechanic: (m: Omit<Mechanic, "id">) => void;
  addCar: (c: Omit<Car, "id">) => void;

  addPart: (p: Omit<Part, "id">) => void;
  updatePartStock: (partId: number, newQty: number) => void;

  addJob: (j: Omit<Job, "id" | "createdAt">) => number;
  setJobStatus: (jobId: number, status: Job["status"]) => void;
  addJobPart: (jp: Omit<JobPart, "id">) => void;

  consumePartStock: (lines: Array<{ partId: number; qty: number }>) => void;
};

const BossDataContext = createContext<BossData | undefined>(undefined);

const initialMechanics: Mechanic[] = [
  {
    id: 1,
    name: "Marko Markovic",
    email: "marko@garage.com",
    fixedSalary: 800,
  },
  { id: 2, name: "Ivan Ilic", email: "ivan@garage.com", fixedSalary: 900 },
];

const initialCars: Car[] = [
  {
    id: 1,
    brand: "Volkswagen",
    model: "Golf 7",
    vin: "WVWZZZ1KZFW000001",
    engineType: "Diesel",
    horsePower: 110,
  },
  {
    id: 2,
    brand: "BMW",
    model: "320d",
    vin: "WBA8E9G5XGNT00002",
    engineType: "Diesel",
    horsePower: 190,
  },
];

const initialParts: Part[] = [
  { id: 1, name: "Oil filter", price: 12, stockQty: 8 },
  { id: 2, name: "Brake pads (front)", price: 55, stockQty: 2 },
  { id: 3, name: "Spark plug", price: 9, stockQty: 20 },
];

const initialJobs: Job[] = [
  {
    id: 1,
    carId: 1,
    mechanicId: 1,
    description: "Oil + filter replacement",
    totalCost: 50,
    status: "DONE",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    carId: 2,
    mechanicId: 2,
    description: "Brake pads front",
    totalCost: 80,
    status: "OPEN",
    createdAt: new Date().toISOString(),
  },
];

const initialJobParts: JobPart[] = [
  { id: 1, jobId: 1, partId: 1, qty: 1 },
  { id: 2, jobId: 2, partId: 2, qty: 1 },
];

export function BossDataProvider({ children }: { children: ReactNode }) {
  const [mechanics, setMechanics] = useState<Mechanic[]>(initialMechanics);
  const [cars, setCars] = useState<Car[]>(initialCars);
  const [parts, setParts] = useState<Part[]>(initialParts);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [jobParts, setJobParts] = useState<JobPart[]>(initialJobParts);

  const mechanicId = useRef(mechanics.length + 1);
  const carId = useRef(cars.length + 1);
  const partId = useRef(parts.length + 1);
  const jobId = useRef(jobs.length + 1);
  const jobPartId = useRef(jobParts.length + 1);

  const value = useMemo<BossData>(
    () => ({
      mechanics,
      cars,
      parts,
      jobs,
      jobParts,

      addMechanic: (m) => {
        const newItem: Mechanic = { id: mechanicId.current++, ...m };
        setMechanics((prev) => [newItem, ...prev]);
      },

      addCar: (c) => {
        const newItem: Car = { id: carId.current++, ...c };
        setCars((prev) => [newItem, ...prev]);
      },

      addPart: (p) => {
        const newItem: Part = { id: partId.current++, ...p };
        setParts((prev) => [newItem, ...prev]);
      },

      updatePartStock: (id, newQty) => {
        setParts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, stockQty: newQty } : p)),
        );
      },

      addJob: (j) => {
        const newItem: Job = {
          id: jobId.current++,
          createdAt: new Date().toISOString(),
          ...j,
        };
        setJobs((prev) => [newItem, ...prev]);
        return newItem.id;
      },

      setJobStatus: (id, status) => {
        setJobs((prev) =>
          prev.map((j) => (j.id === id ? { ...j, status } : j)),
        );
      },

      addJobPart: (jp) => {
        const newItem: JobPart = { id: jobPartId.current++, ...jp };
        setJobParts((prev) => [newItem, ...prev]);
      },

      consumePartStock: (lines) => {
        setParts((prevParts) => {
          const byId = new Map(prevParts.map((p) => [p.id, p]));

          for (const l of lines) {
            const p = byId.get(l.partId);
            if (!p) continue;
            byId.set(l.partId, {
              ...p,
              stockQty: Math.max(0, p.stockQty - l.qty),
            });
          }

          return Array.from(byId.values());
        });
      },
    }),
    [mechanics, cars, parts, jobs, jobParts],
  );

  return (
    <BossDataContext.Provider value={value}>
      {children}
    </BossDataContext.Provider>
  );
}

export function useBossData() {
  const ctx = useContext(BossDataContext);
  if (!ctx) throw new Error("useBossData must be used inside BossDataProvider");
  return ctx;
}
