import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/authContext";

export default function LoginPage() {
  const { login } = useAuth();

  async function handleGoogleSuccess(credentialResponse: { credential?: string }) {
    if (!credentialResponse.credential) return;
    
    try {
      await login(credentialResponse.credential);
    } catch (error) {
      console.error("Login failed:", error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm flex flex-col items-center gap-6 w-full max-w-sm">
        <div className="flex flex-col items-center gap-2">
          <span className="text-4xl">🎁</span>
          <h1 className="text-2xl font-semibold text-gray-800">Wishlist</h1>
          <p className="text-gray-500 text-sm text-center">
            Creá tu lista de deseos y compartila con tus amigos
          </p>
        </div>

        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => console.error("Google login error")}
          useOneTap
        />
      </div>
    </div>
  );
}