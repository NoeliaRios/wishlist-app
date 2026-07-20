import { Sparkles, Gift, LogOut } from "lucide-react";
import { useAuth } from "../context/authContext";
import { useLocation, useNavigate } from "react-router-dom";
import GoogleLoginButton from "./GoogleLoginButton";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = !!user;

  // Detectamos qué paso marcar como activo según la ruta real de tu app
  const getActiveStep = () => {
    if (location.pathname === "/" || location.pathname === "/login") return 1;
    if (location.pathname === "/dashboard") return 2;
    if (location.pathname.startsWith("/lists/")) return 3;
    if (location.pathname.startsWith("/share/")) return 4;
    return 0;
  };

  const activeStep = getActiveStep();

  // Función para obtener iniciales para el avatar cuadrado
  const getInitials = () => {
    if (!user?.name) return "NR";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="w-full flex flex-col">
      {/* 1. BARRA NEGRA DE AVISO (Idéntica a la del prototipo) */}
      <div className="w-full bg-black text-white py-2 px-6 flex justify-center items-center gap-2 overflow-x-auto whitespace-nowrap border-b-2 border-black">
        <span className="font-mono text-xs font-bold tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-yellow fill-brand-yellow animate-spin" />
          PROTOTIPO INTERACTIVO PARA <strong>WISHLIST.IO</strong> – HECHO CON IDENTIDAD NEOBRUTALISTA LILA • 
          <span className="text-brand-lilac font-medium"> Navega libremente usando la barra de arriba</span>
        </span>
      </div>

      {/* 2. HEADER PRINCIPAL */}
      <header className="sticky top-0 z-40 w-full bg-white neo-border-b border-black py-4 px-6 md:px-12 flex flex-col md:flex-row sm:items-center md:justify-between gap-4">
        <div className="w-full flex justify-between items-center gap-3">
          
          {/* LOGO (Izquierda) */}
          <div 
            onClick={() => navigate(isLoggedIn ? "/dashboard" : "/")}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="bg-brand-lilac p-2.5 neo-border neo-shadow-sm group-hover:rotate-6 transition-transform">
              <Gift className="w-6 h-6 text-black stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
                <span className="font-mono font-bold text-2xl tracking-tighter block leading-none">
            wishlist<span className="text-purple-600">.io</span>
              </span>
              <span className="font-mono text-xs font-bold text-gray-400 tracking-wide mt-1 uppercase">
                NEOBRUTALIST SPEC
              </span>
            </div>
          </div>

          {/* NAVEGADOR DE PASOS UNIFICADO (Centro - Idéntico a la foto) */}
          <nav className="flex flex-wrap items-center gap-2 bg-gray-100 p-1.5 neo-border rounded-none">
            {/* Paso 1 */}
            <button
              onClick={() => navigate("/")}
              className={`px-3 py-1.5 text-xs md:text-sm font-bold uppercase tracking-wider transition-all ${
                activeStep === 1 
                  ? "bg-brand-orange text-black neo-border neo-shadow-sm -translate-x-0.5 -translate-y-0.5" 
                  : "hover:bg-gray-200 text-gray-700"
              }`}
            >
              1. Inicio/Login
            </button>

            {/* Paso 2 */}
            <button
              onClick={() => navigate("/dashboard")}
              className={`px-3 py-1.5 text-xs md:text-sm font-bold uppercase tracking-wider transition-al ${
                activeStep === 2 
                  ? "bg-brand-lilac text-black neo-border neo-shadow-sm -translate-x-0.5 -translate-y-0.5" 
                  : "hover:bg-gray-200 text-gray-700"
              }`}
            >
              2. Dashboard
            </button>

            {/* Paso 3 */}
            <button
              onClick={() => {
                // Si ya estamos en una lista, no redirigimos; si no, simulamos paso
                if (activeStep !== 3) navigate("/dashboard");
              }}
              className={`px-4 py-3 border-r-2 border-black transition-colors ${
                activeStep === 3 
                  ? "bg-brand-yellow text-black border-4 border-black -my-[4px] -ml-[4px] z-10" 
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              3. Mi Lista
            </button>

            {/* Paso 4 */}
            <button
              className={`px-4 py-3 border-r-2 border-black transition-colors ${
                activeStep === 4 
                  ? "bg-brand-yellow text-black border-4 border-black -my-[4px] -ml-[4px] z-10" 
                  : "text-gray-400 cursor-not-allowed"
              }`}
              disabled={activeStep !== 4}
            >
              4. Links Públicos
            </button>

            
          </nav>

          {/* INFORMACIÓN DE USUARIO (Derecha) */}
          {isLoggedIn && user ? (
            <div className="flex items-center gap-4 shrink-0">
              {/* Bloque de Textos (Sin caja contenedora, sueltos como en tu foto) */}
              <div className="flex flex-col text-right">
                <span className="font-sans font-black text-sm text-black">
                  {user.name || "Noelia Rivers"}
                </span>
                <span className="font-mono text-xs text-gray-400">
                  {user.email || "noelia.rivers.1887@gmail.com"}
                </span>
              </div>

              {/* Avatar Cuadrado con Iniciales */}
              <div className="w-10 h-10 bg-brand-lilac border-4 border-black flex items-center justify-center font-mono font-bold text-sm text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {getInitials()}
              </div>

              {/* Botón Logout */}
              <button
                onClick={logout}
                className="w-10 h-10 bg-brand-coral hover:bg-rose-400 text-black border-4 border-black flex items-center justify-center cursor-pointer neo-border neo-interactive"
                title="Salir"
              >
                <LogOut className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          ) : (
            <div className="shrink-0">
    <GoogleLoginButton label="Acceder" />
  </div>
          )}

        </div>
      </header>
    </div>
  );
}