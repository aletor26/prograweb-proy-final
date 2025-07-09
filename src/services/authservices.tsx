const API_URL = 'postgres-cloud-pw.postgres.database.azure.com';

export async function recuperarPassword(email: string, nueva: string) {
  const res = await fetch(`${API_URL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo: email, nueva }),
  });

  if (!res.ok) throw await res.json();
  return res.json();
}
