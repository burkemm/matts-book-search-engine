// This decodes the token and retrieves the user's information.
import decode from 'jwt-decode';

// this creates a new class to instantiate a new user.
class AuthService {
  // this retrieves the user's profile data.
  getProfile() {
    return decode(this.getToken());
  }

  // validates if a user is logged in currently.
  loggedIn() {
    // this validates if a user has a valid token.
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // this validates if a token is current or expired.
  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  }

  getToken() {
    // this retrieves the user's token from localStorage.
    return localStorage.getItem('id_token');
  }

  login(idToken) {
    // this saves a token to localStorage.
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  logout() {
    // this deletes the user token and profile from localStorage.
    localStorage.removeItem('id_token');
    // this resets the application state.
    window.location.assign('/');
  }
}

export default new AuthService();
