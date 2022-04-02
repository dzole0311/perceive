/**
 * Takes seconds as an input and does formatting
 *
 * @param seconds
 */
export const formatTime = (seconds: number) => {
  let result = '';

  if (seconds < 60) {
    result = `${seconds}s`;
  } else if (seconds >= 60 && seconds < 3600) {
    let minutes = Math.round(seconds / 60);
    result = `${minutes}mins`;
  } else if (seconds > 3600) {
    let hours = Math.round(seconds / 3600 * 10) / 10;
    result = `${hours}h`;
  }

  return result;
}

/**
 * Takes an input in the form of bytes and formats it
 *
 * @param bytes
 * @param decimals
 */
export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return 0;
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
}
