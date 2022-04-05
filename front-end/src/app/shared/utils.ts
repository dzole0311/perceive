/**
 * Takes seconds as an input and returns a string formatted
 * depending on the total seconds
 *
 * @param seconds
 */
export const formatTime = (seconds: number) => {
  let result = '';

  if (seconds < 60) {
    result = `${seconds} s`;
  } else if (seconds >= 60 && seconds < 3600) {
    let minutes = Math.round(seconds / 60);
    result = `${minutes} mins`;
  } else if (seconds > 3600) {
    let hours = Math.round(seconds / 3600 * 10) / 10;
    result = `${hours} h`;
  }

  return result;
}

/**
 * Takes an input in the form of bytes and decimals and formats it
 *
 * @param bytes
 * @param decimals
 */
export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return 0;
  const kilobytes = 1024;
  const decim = decimals < 0 ? 0 : decimals;
  const i = Math.floor(Math.log(bytes) / Math.log(kilobytes));
  const result = parseFloat((bytes / Math.pow(kilobytes, i)).toFixed(decim));
  return result ? result : 0;
}

/**
 * Takes the platform on which the app is running (eg. linux, win32, darwin)
 * and returns a formatted string
 *
 * @param platform
 */
export const formatPlatform = (platform: string) => {
  let platformFormatted = '';

  if (platform === 'linux') {
    platformFormatted = 'Linux';
  } else if (platform === 'win32') {
    platformFormatted = 'Windows';
  } else if (platform === 'darwin') {
    platformFormatted = 'OS X';
  } else {
    platformFormatted = 'Not supported'
  }

  return platformFormatted;
}
