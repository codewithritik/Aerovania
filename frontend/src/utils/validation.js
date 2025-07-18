// Drone violation JSON schema validation helper

/**
 * Validates the structure of a drone violation JSON object.
 * @param {object} data - The parsed JSON object.
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateDroneViolationJSON(data) {
  if (typeof data !== 'object' || data === null) {
    return { valid: false, error: 'File is not a valid JSON object.' };
  }
  const requiredFields = ['drone_id', 'date', 'location', 'violations'];
  for (const field of requiredFields) {
    if (!(field in data)) {
      return { valid: false, error: `Missing required field: ${field}` };
    }
  }
  if (!Array.isArray(data.violations)) {
    return { valid: false, error: 'Violations must be an array.' };
  }
  for (const v of data.violations) {
    const vFields = ['id', 'type', 'timestamp', 'latitude', 'longitude', 'image_url'];
    for (const vf of vFields) {
      if (!(vf in v)) {
        return { valid: false, error: `Violation missing field: ${vf}` };
      }
    }
  }
  return { valid: true };
} 