/** Formats the running number into a display code: AZ-0001, AZ-0002, ... */
export function nextOrderCode(runningNumber) {
  return `AZ-${String(runningNumber ?? 1).padStart(4, '0')}`
}
