export type MechanicDto = {
  id: number;
  name: string;
  email: string;
  fixedSalary: number;
};

export async function createMechanic(
  token: string,
  data: {
    name: string;
    email: string;
    fixedSalary: number;
    tempPassword: string;
  },
) {
  const res = await fetch("http://localhost:8080/api/boss/mechanics", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to create mechanic");
  }

  return res.json();
}

export async function getMechanics(token: string): Promise<MechanicDto[]> {
  const res = await fetch("http://localhost:8080/api/boss/mechanics", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to load mechanics");
  }

  return res.json();
}
