/**
 * Response into IResponse Interface
 *
 * @param data
 * @param result
 * @param message
 */
export const responseToInterface = (
  data = {},
  result = true,
  message = "success",
) => ({
  result,
  data,
  message
});