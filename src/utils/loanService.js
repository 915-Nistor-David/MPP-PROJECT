// src/utils/loanService.js
const API = process.env.REACT_APP_API_URL;

export async function fetchLoansPage({
  page      = 1,
  size      = 50,
  sort      = 'id',
  dir       = 'ASC',
  search    = '',
  insurance = 'all',
}) {
  const params = new URLSearchParams({
    page,
    size,
    sort,
    dir,
    search,
    insurance: insurance === 'all' ? '' : insurance,
  });
  const res = await fetch(`${API}/loans?${params.toString()}`);
  if (!res.ok) throw new Error(`Failed to load loans (status ${res.status})`);
  return res.json();
}

export function subscribeNewLoans(onNewLoan) {
  const socket = io(API, { transports: ['websocket'] });
  socket.on('new-loan', onNewLoan);
  return () => socket.disconnect();
}
