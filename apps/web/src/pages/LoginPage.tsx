import type { CredentialResponse } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { Gift, Lock, Share2, ShieldCheck, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from "../context/authContext";

export default function LoginPage() {
  const { login } = useAuth();
  
  // Estado local para el mini-playground interactivo de la derecha (Mockup)
  const [quickItem, setQuickItem] = useState('');
  const [quickList, setQuickList] = useState<string[]>([
    'Teclado Mecánico Custom ⌨️', 
    'Libro de UX Design 📘'
  ]);

  // Manejador del mini-formulario del mockup
  const handleAddQuickItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickItem.trim()) {
      setQuickList([...quickList, quickItem.trim()]);
      setQuickItem('');
    }
  };

  // Esta función recibirá el JWT id_token original de Google de forma segura
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      await login(credentialResponse.credential);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col gap-16 md:gap-24">
      
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Hero Left Content */}
        <div className="lg:col-span-7 flex flex-col items-start gap-6">
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-yellow neo-border px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rotate-[-1deg] neo-shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>wishlist.io // El Futuro de los Regalos</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none text-black">
            Crea listas de <span className="bg-brand-lilac px-3 py-1.5 inline-block rotate-[1.5deg] neo-border">deseos</span> con identidad propia.
          </h1>
          
          <p className="text-lg md:text-xl font-bold text-gray-800 font-sans max-w-xl">
            Se acabó recibir calcetines aburridos. Diseña tus listas neobrutalistas, comparte el link público y permite que tus amigos reserven lo que de verdad quieres.
          </p>
          
          {/* Google Login Call to Action Real con Overlay Neobrutalista */}
          <div className="w-full sm:w-auto mt-4">
            {/* Contenedor relativo para alojar el overlay */}
            <div className="relative overflow-hidden w-full sm:w-auto inline-block neo-border neo-interactive">
              
              {/* 1. BOTÓN NEOBRUTALISTA REALMENTE DIBUJADO (No recibe clicks del puntero porque es traspasado) */}
              <div className="px-8 py-4 bg-brand-lilac text-black font-extrabold text-lg uppercase tracking-wide  flex items-center justify-center gap-3 w-full sm:w-auto pointer-events-none">
                {/* Google Icon SVG */}
                <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Acceder con Google</span>
              </div>

              {/* 2. COMPONENTE GOOGLE OFICIAL INVISIBLE (Garantiza el ID TOKEN (JWT) compatible con el backend) */}
              <div className="absolute inset-0 opacity-0 cursor-pointer scale-[2.5] origin-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => console.error("Google login error")}
                  useOneTap
                />
              </div>

            </div>
          </div>
          
          <div className="flex items-center gap-3 text-xs font-mono font-bold text-gray-500 mt-2">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Seguro & Privado
            </span>
            <span>•</span>
            <span>OAuth 2.0 Oficial</span>
            <span>•</span>
            <span>Sin tarjetas de crédito</span>
          </div>
        </div>
        
        {/* Hero Right Visual: Neo Playground */}
        <div className="lg:col-span-5 relative">
          {/* Decorative Backdrops */}
          <div className="absolute inset-0 bg-brand-cyan neo-border rounded-none translate-x-3 translate-y-3 -z-10"></div>
          
          <div className="bg-white neo-border-lg p-6 md:p-8 flex flex-col gap-6 relative">
            {/* Window bar */}
            <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 bg-brand-coral neo-border rounded-full"></div>
                <div className="w-3.5 h-3.5 bg-brand-yellow neo-border rounded-full"></div>
                <div className="w-3.5 h-3.5 bg-brand-green neo-border rounded-full"></div>
              </div>
              <span className="font-mono text-xs font-bold bg-gray-100 px-2 py-0.5 neo-border">
                demo_sandbox.exe
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xl uppercase tracking-tight">Mi Mini-Lista 📋</h3>
              <span className="text-xs font-mono font-bold bg-brand-lilac px-2 py-1 neo-border">
                PROBAR AHORA
              </span>
            </div>
            
            {/* Quick List sandbox interactivo */}
            <div className="flex flex-col gap-2 min-h-24">
              {quickList.map((item, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-3 bg-brand-orange/10 neo-border neo-shadow-sm font-bold text-sm"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-mono">#{idx+1}</span>
                    {item}
                  </span>
                  <button 
                    onClick={() => setQuickList(quickList.filter((_, i) => i !== idx))}
                    className="text-xs font-bold text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
            
            {/* Input del sandbox */}
            <form onSubmit={handleAddQuickItem} className="flex gap-2">
              <input
                type="text"
                value={quickItem}
                onChange={(e) => setQuickItem(e.target.value)}
                placeholder="Escribe un capricho..."
                className="flex-1 px-3 py-2 neo-border bg-gray-50 focus:bg-white font-bold text-sm outline-none placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-brand-green text-black font-extrabold uppercase text-xs neo-border neo-interactive"
              >
                Agregar
              </button>
            </form>
            
            <div className="text-center pt-2">
              <span className="text-[11px] font-mono font-bold text-gray-400">
                *Esto es un borrador rápido. Registrándote la guardarás para siempre.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="flex flex-col gap-10">
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-black inline-block bg-brand-cyan px-4 py-2 neo-border rotate-[-1deg] neo-shadow-sm">
            ¿Por qué wishlist.io?
          </h2>
          <p className="font-bold text-gray-700 mt-4 max-w-xl mx-auto">
            Hemos tirado las reglas del diseño corporativo plano a la basura. Así es cómo cuidamos tus deseos.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-brand-lilac neo-border-lg p-6 flex flex-col gap-4 neo-shadow-lg transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-white neo-border flex items-center justify-center neo-shadow-sm rotate-3">
              <Gift className="w-6 h-6 text-black stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-tight">Estilo Neobrutalista</h3>
            <p className="font-semibold text-gray-800 text-sm">
              Colores lila y pastel saturados, bordes gruesos de 3px y sombras duras. Tus deseos no pasarán desapercibidos ante nadie.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-brand-yellow neo-border-lg p-6 flex flex-col gap-4 neo-shadow-lg transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-white neo-border flex items-center justify-center neo-shadow-sm -rotate-3">
              <Share2 className="w-6 h-6 text-black stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-tight">Links Interactivos</h3>
            <p className="font-semibold text-gray-800 text-sm">
              Envía tu enlace público. Tus amigos podrán reservar lo que desees con un clic, sin necesidad de crear una cuenta ni recordar contraseñas.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-brand-coral neo-border-lg p-6 flex flex-col gap-4 neo-shadow-lg transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-white neo-border flex items-center justify-center neo-shadow-sm rotate-6">
              <Lock className="w-6 h-6 text-black stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-tight">Privacidad Total</h3>
            <p className="font-semibold text-gray-800 text-sm">
              Elige qué listas son públicas para compartir y cuáles son borradores privados para planificar tus compras personales.
            </p>
          </div>
        </div>
      </section>

      {/* Visual Identity Highlight Section */}
      <section className="bg-black text-white neo-border-lg p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-1/2 -right-12 w-64 h-64 bg-brand-lilac rounded-none rotate-45 -z-0 opacity-20"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 flex flex-col gap-4">
            <span className="font-mono text-xs text-brand-lilac font-bold uppercase tracking-widest block">
              IDENTIDAD VISUAL DIRECTA
            </span>
            <h3 className="text-2xl md:text-4xl font-extrabold uppercase leading-tight">
              Diseño de Maquetas wishlist.io listo para desarrollo React + Tailwind
            </h3>
            <p className="font-sans text-gray-300 font-medium">
              Esta maqueta interactiva implementa los componentes ideales para wishlist.io. Puedes navegar entre la página de inicio, el panel de control del usuario, la vista detallada de la lista y la interfaz de enlace compartido.
            </p>
          </div>



          <div className="lg:col-span-4 flex justify-start lg:justify-end relative overflow-hidden sm:w-auto neo-border neo-interactive">
            <span
              className="px-6 py-3.5 bg-brand-lilac text-black font-extrabold uppercase text-sm neo-border neo-interactive-lg cursor-pointer"
            >
              Comenzar a Explorar
            </span>

                        <div className="absolute inset-0 opacity-0 cursor-pointer scale-[2.5] origin-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => console.error("Google login error")}
                  useOneTap
                />
              </div>


          </div>

















        </div>
      </section>

    </div>
  );
}