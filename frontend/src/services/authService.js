// Google OAuth configuration and service
// Note: This requires Google OAuth Client ID to be configured in environment variables

class GoogleAuthService {
  constructor() {
    this.clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    this.gapi = null;
    this.auth2 = null;
  }

  async initializeGoogleAuth() {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        window.gapi.load('auth2', () => {
          this.auth2 = window.gapi.auth2.init({
            client_id: this.clientId,
          });
          resolve();
        });
      } else {
        reject(new Error('Google API not loaded'));
      }
    });
  }

  async signIn() {
    try {
      if (!this.auth2) {
        await this.initializeGoogleAuth();
      }

      const authInstance = window.gapi.auth2.getAuthInstance();
      const googleUser = await authInstance.signIn();
      
      const profile = googleUser.getBasicProfile();
      const userData = {
        id: profile.getId(),
        name: profile.getName(),
        email: profile.getEmail(),
        imageUrl: profile.getImageUrl(),
        token: googleUser.getAuthResponse().id_token
      };

      return userData;
    } catch (error) {
      console.error('Google sign-in failed:', error);
      throw new Error('Failed to sign in with Google');
    }
  }

  async signOut() {
    try {
      if (this.auth2) {
        await this.auth2.signOut();
      }
    } catch (error) {
      console.error('Google sign-out failed:', error);
    }
  }

  // Mock implementation for development when Google API is not available
  async mockSignIn() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'mock_user_123',
          name: 'John Doe',
          email: 'john.doe@example.com',
          imageUrl: 'https://via.placeholder.com/150',
          token: 'mock_token'
        });
      }, 1000);
    });
  }
}

export const googleAuth = new GoogleAuthService();
