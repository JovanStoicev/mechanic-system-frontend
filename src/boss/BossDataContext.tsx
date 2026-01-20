import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from "react"
import type { Car, Mechanic } from "../types/boss"

type BossData = {
  mechanics: Mechanic[]
  cars: Car[]
  addMechanic: (m: Omit<Mechanic, "id">) => void
  addCar: (c: Omit<Car, "id">) => void
}

const BossDataContext = createContext<BossData | undefined>(undefined)

const initialMechanics: Mechanic[] = [
  { id: 1, name: "Marko Markovic", email: "marko@garage.com", fixedSalary: 800 },
  { id: 2, name: "Ivan Ilic", email: "ivan@garage.com", fixedSalary: 900 },
]

const initialCars: Car[] = [
  { id: 1, brand: "Volkswagen", model: "Golf 7", vin: "WVWZZZ1KZFW000001", engineType: "Diesel", horsePower: 110 },
  { id: 2, brand: "BMW", model: "320d", vin: "WBA8E9G5XGNT00002", engineType: "Diesel", horsePower: 190 },
]

export function BossDataProvider({ children }: { children: ReactNode }) {
  const [mechanics, setMechanics] = useState<Mechanic[]>(initialMechanics)
  const [cars, setCars] = useState<Car[]>(initialCars)

  const mechanicId = useRef(mechanics.length + 1)
  const carId = useRef(cars.length + 1)

  const value = useMemo<BossData>(
    () => ({
      mechanics,
      cars,
      addMechanic: (m) => {
        const newItem: Mechanic = { id: mechanicId.current++, ...m }
        setMechanics((prev) => [newItem, ...prev])
      },
      addCar: (c) => {
        const newItem: Car = { id: carId.current++, ...c }
        setCars((prev) => [newItem, ...prev])
      },
    }),
    [mechanics, cars]
  )

  return <BossDataContext.Provider value={value}>{children}</BossDataContext.Provider>
}

export function useBossData() {
  const ctx = useContext(BossDataContext)
  if (!ctx) throw new Error("useBossData must be used inside BossDataProvider")
  return ctx
}
