const API_URL = 'https://backend-cloud-proyecto-c7gng2dehwezhhh3.canadacentral-01.azurewebsites.net';

export async function recuperarPassword(email: string, nueva: string) {
  const res = await fetch(`${API_URL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo: email, nueva }),
  });

  if (!res.ok) throw await res.json();
  return res.json();
}
