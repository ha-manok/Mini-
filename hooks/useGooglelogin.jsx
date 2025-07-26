import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';  // <-- Import this
import { useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { useRouter } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleLogin = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '1013035801319-uknspvh3383k4ggdrjs6ilfpodim9neq.apps.googleusercontent.com',
    redirectUri: AuthSession.makeRedirectUri({
      useProxy: true,
    }),
  });

  useEffect(() => {
    const handleSignIn = async () => {
      if (response?.type === 'success') {
        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);
        setLoading(true);
        try {
          await signInWithCredential(auth, credential);
          // Redirect to dashboard on successful Google login
          router.replace('/(dashboard)');
        } catch (error) {
          console.error('Google sign-in error:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    handleSignIn();
  }, [response, router]);

  return { promptAsync, loading };
};
