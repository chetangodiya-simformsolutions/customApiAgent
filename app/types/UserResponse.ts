/**
 * Represents the response from a user API request.
 */
export interface UserResponse {
  id?: string;
  email?: string;
  phone?: string;
  displayName?: string;
  photoURL?: string;
  message?: string;
}
