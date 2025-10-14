"use client";

import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { supabase } from "../../../lib/supabase";
import bcrypt from "bcryptjs";

export default function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { forceUpdate } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Obtener la ruta a la que se intentaba acceder antes de ser redirigido al login
  const from = location.state?.from || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Query the users table from Supabase
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("email", formData.email)
        .single();

      if (userError || !user) {
        setError("Usuario no encontrado");
        setIsLoading(false);
        return;
      }

      if (!user.is_active) {
        setError("Cuenta desactivada");
        setIsLoading(false);
        return;
      }

      // Check password - plain text comparison
      const passwordValid = user.password === formData.password;

      if (!passwordValid) {
        setError("Contraseña incorrecta");
        setIsLoading(false);
        return;
      }
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      };
      const sessionData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        loggedInAt: new Date().toISOString(),
      };

      // Login exitoso - guardar sesión en localStorage
      localStorage.setItem("user_session", JSON.stringify(sessionData));
      localStorage.setItem("user_data", JSON.stringify(userData));

      console.log("Login exitoso - datos guardados en localStorage");
      console.log("User data saved:", userData);
      console.log("Session data saved:", sessionData);

      // Forzar actualización del hook de autenticación antes de navegar
      const authUpdated = forceUpdate();
      console.log("Auth state actualizado:", authUpdated);

      // Pequeña pausa para asegurar que los componentes se actualicen
      setTimeout(() => {
        console.log("Navegando a:", from);
        navigate(from, { replace: true });
      }, 100);
    } catch (err) {
      console.error("Login error:", err);
      setError("Error al iniciar sesión. Inténtalo de nuevo.");
    }

    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600">
                <span className="text-xl font-bold text-white">AI</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">AI Restaurante</h1>
            <p className="text-gray-600 mt-2">Inicia sesión en tu cuenta</p>
          </div>

          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="mt-1 pr-10"
                  placeholder="Tu contraseña"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar sesión"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <Link
                to="/auth/signup"
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
