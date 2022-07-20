export async function logVisit() {
  if (window) {
    console.log(`logging ${window.location.pathname}`);
    const response = await fetch(`/api/log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
  }
}
