import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { useAuth } from "../context/authContext";

interface GoogleLoginButtonProps {
  label?: string;
  className?: string;
}

export default function GoogleLoginButton({ label = "Acceder con Google", className = "" }: GoogleLoginButtonProps) {
  const { login } = useAuth();

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      await login(credentialResponse.credential);
    }
  };

  return (
    <div className={`relative overflow-hidden inline-block neo-border neo-interactive ${className}`}>
      
      {/* 1. DISEÑO NEOBRUTALISTA VISUAL */}
      <div className="px-4 py-2 font-bold uppercase text-sm bg-brand-lilac text-black ">
        {label}
      </div>

      {/* 2. OVERLAY INVISIBLE DE GOOGLE */}
      <div className="absolute inset-0 opacity-0 cursor-pointer scale-[2.5] origin-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => console.error("Google login error")}
          useOneTap
        />
      </div>

    </div>
  );
}