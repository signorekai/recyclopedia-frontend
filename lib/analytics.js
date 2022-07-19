export async function logVisit() {
  if (window) {
    const response = await fetch(`/api/log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
  }
}
