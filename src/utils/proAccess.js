export const PRO_TESTER_EMAILS = ["manubroo112@gmail.com", "tusharswami17@gmail.com"];

export function hasProAccess(email) {
  return PRO_TESTER_EMAILS.includes(String(email || "").trim().toLowerCase());
}
