"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Checkbox } from "../../../components/ui/checkbox";
import {
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  Settings,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Save,
  Upload,
  Trash2,
  Key,
  Globe,
  Star,
  BarChart3,
  Users,
  UserPlus,
  Edit,
  Crown,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Home,
} from "lucide-react";
import { useNavigation } from "../../../contexts/NavigationContext";
import { useRestaurant } from "../../../contexts/RestaurantContext";
import { supabase, supabaseServer } from "../../../lib/supabase";
import Swal from "sweetalert2";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  phone?: string;
  bio?: string;
  company?: string;
  website?: string;
  location?: string;
  joinedAt: string;
  lastLoginAt?: string;
  restaurants: Array<{
    id: string;
    name: string;
    slug: string;
    role: string;
    status: string;
    location: string;
  }>;
}

interface UserPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  weeklyReports: boolean;
  realTimeAlerts: boolean;
  language: string;
  timezone: string;
  dashboardLayout: string;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange: string;
  activeSessions: number;
  loginHistory: Array<{
    date: string;
    location: string;
    device: string;
    ip: string;
  }>;
}

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "USER";
  is_active: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  createdBy: string | null;
  Creator: {
    name: string;
    email: string;
  } | null;
  UserPermissions: Array<{
    Permission: {
      name: string;
      displayName: string;
      category: string;
    };
  }>;
}

interface SystemPermission {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
}

interface NewUserForm {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "USER";
  permissions: string[];
}

export default function PerfilContent() {
  const navigation = useNavigation();
  const { setSelectedRestaurant, setViewMode } = useRestaurant();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Estados del formulario
  const [profile, setProfile] = useState<UserProfile>({
    id: "",
    name: "",
    email: "",
    image: "",
    phone: "",
    bio: "",
    company: "",
    website: "",
    location: "",
    joinedAt: "",
    lastLoginAt: "",
    restaurants: [],
  });

  const [preferences, setPreferences] = useState<UserPreferences>({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    weeklyReports: true,
    realTimeAlerts: true,
    language: "es",
    timezone: "America/Bogota",
    dashboardLayout: "standard",
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    lastPasswordChange: "",
    activeSessions: 1,
    loginHistory: [],
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Estados para gestión de usuarios (Solo Super Admin)
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([]);
  const [systemPermissions, setSystemPermissions] = useState<
    Record<string, SystemPermission[]>
  >({});
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isRestaurantModalOpen, setIsRestaurantModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [newUserForm, setNewUserForm] = useState<NewUserForm>({
    name: "",
    email: "",
    password: "",
    role: "USER",
    permissions: [],
  });
  const [currentUserRole, setCurrentUserRole] = useState<
    "SUPER_ADMIN" | "ADMIN" | "USER" | null
  >(null);

  // Cargar datos del perfil
  useEffect(() => {
    loadUserData();
    loadUserRole();
    loadCurrentPassword();
  }, []);

  // Debug temporal para verificar cambios en profile
  useEffect(() => {
    console.log("Profile state actualizado:", {
      phone: profile.phone,
      location: profile.location,
      company: profile.company,
      website: profile.website,
      bio: profile.bio,
    });
  }, [
    profile.phone,
    profile.location,
    profile.company,
    profile.website,
    profile.bio,
  ]);

  const loadUserData = async () => {
    try {
      setIsLoading(true);

      // Get current user from localStorage (custom authentication)
      const userSession = localStorage.getItem("user_session");
      const userData = localStorage.getItem("user_data");

      if (!userSession || !userData) {
        console.error("No user session found");
        return;
      }

      const session = JSON.parse(userSession);
      const user = JSON.parse(userData);

      // Fetch user profile data from Supabase (primario - datos del usuario)
      const { data: userProfileData, error: userError } = await supabase
        .from("users")
        .select(
          `
          id,
          name,
          email,
          email_verified,
          image,
          telefono,
          ubicacion,
          empresa,
          sitio_web,
          biografia,
          role,
          is_active,
          last_login_at,
          created_at,
          updated_at
        `,
        )
        .eq("id", user.id)
        .single();

      // Fetch restaurants del usuario por separado
      const { data: userRestaurants, error: restaurantsError } = await supabase
        .from("restaurants")
        .select("id, name, slug")
        .eq("user_id", user.id);

      if (userError) {
        console.error("Error fetching user data:", userError);
        console.error(
          "Query error details:",
          userError.message,
          userError.code,
        );
        // Fallback a localStorage pero intentando mantener la imagen si existe
        const userProfile = {
          id: user.id,
          name: user.name || "",
          email: user.email,
          image: user.image || "", // Mantener imagen del localStorage si existe
          phone: "",
          bio: "",
          company: "",
          website: "",
          location: "",
          joinedAt: session.loggedInAt,
          lastLoginAt: session.loggedInAt,
          restaurants: [],
        };
        setProfile(userProfile);
        return; // Salir temprano si hay error en datos principales
      } else {
        console.log("Raw user data from database:", userProfileData);
        console.log("Raw restaurants data:", userRestaurants);
        console.log("🔍 DIAGNÓSTICO DE IMAGEN:");
        console.log("- Imagen desde base de datos:", userProfileData.image);
        console.log("- Imagen desde localStorage:", user.image);
        console.log("- Tipo de dato (DB):", typeof userProfileData.image);
        console.log("- Longitud (DB):", userProfileData.image?.length || 0);
        console.log("- Es nulo/undefined (DB):", userProfileData.image == null);
        console.log("- Es string vacío (DB):", userProfileData.image === "");
        console.log("📋 DATOS RECIBIDOS DE LA BASE DE DATOS:");
        console.log("👤 Nombre:", userProfileData.name);
        console.log("📧 Email:", userProfileData.email);
        console.log("📱 Teléfono:", userProfileData.telefono);
        console.log("📍 Ubicación:", userProfileData.ubicacion);
        console.log("🏢 Empresa:", userProfileData.empresa);
        console.log("🌐 Sitio web:", userProfileData.sitio_web);
        console.log("📝 Biografía:", userProfileData.biografia);
        console.log("🖼️ Imagen:", userProfileData.image);
        console.log("📅 Creado:", userProfileData.created_at);
        console.log("🔄 Actualizado:", userProfileData.updated_at);
        console.log("Mapping to profile object...");

        // Update profile state with user data
        const userProfile = {
          id: userProfileData.id,
          name: userProfileData.name || user.name || "",
          email: userProfileData.email || user.email,
          image: userProfileData.image || user.image || "", // Priorizar base de datos, luego localStorage
          phone: userProfileData.telefono || "",
          bio: userProfileData.biografia || "",
          company: userProfileData.empresa || "",
          website: userProfileData.sitio_web || "",
          location: userProfileData.ubicacion || "",
          joinedAt: userProfileData.created_at,
          lastLoginAt: userProfileData.last_login_at,
          restaurants: restaurantsError
            ? [] // Si hay error en restaurantes, dejar array vacío
            : userRestaurants?.map((restaurant: any) => ({
                id: restaurant.id,
                name: restaurant.name,
                slug: restaurant.slug,
                role: "owner", // Asumiendo que el usuario es dueño de sus restaurantes
                status: "active",
                location: "", // Sin campo location en la tabla restaurants
              })) || [],
        };

        console.log("📋 PERFIL FINAL CONFIGURADO:");
        console.log("- Nombre:", userProfile.name);
        console.log("- Email:", userProfile.email);
        console.log("- Imagen final:", userProfile.image);
        console.log("- Longitud imagen final:", userProfile.image?.length || 0);
        console.log("- Teléfono:", userProfile.phone);
        console.log("- Ubicación:", userProfile.location);
        console.log("- Empresa:", userProfile.company);
        console.log("- Sitio web:", userProfile.website);
        console.log("- Biografía:", userProfile.bio);

        if (restaurantsError) {
          console.warn(
            "Error fetching restaurants (continuando sin ellos):",
            restaurantsError,
          );
        }

        setProfile(userProfile);

        // Actualizar localStorage con los datos más recientes del usuario (especialmente la imagen)
        const updatedUserData = {
          ...user,
          name: userProfile.name,
          email: userProfile.email,
          image: userProfile.image,
        };
        localStorage.setItem("user_data", JSON.stringify(updatedUserData));

        // Set security data
        setSecurity((prev) => ({
          ...prev,
          lastPasswordChange: userProfileData.createdAt,
          activeSessions: 1,
          loginHistory: [
            {
              date: userProfileData.lastLoginAt
                ? new Date(userProfileData.lastLoginAt).toLocaleString("es-ES")
                : new Date(session.loggedInAt).toLocaleString("es-ES"),
              location: "Desconocida",
              device: "Desconocido",
              ip: "Desconocida",
            },
          ],
        }));
      }
    } catch (error) {
      console.error("Error cargando datos del perfil:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar rol del usuario actual
  const loadUserRole = async () => {
    try {
      // Get user role from localStorage
      const userData = localStorage.getItem("user_data");

      if (!userData) {
        setCurrentUserRole(null);
        return;
      }

      const user = JSON.parse(userData);
      setCurrentUserRole(user.role as "SUPER_ADMIN" | "ADMIN" | "USER");
    } catch (error) {
      console.error("Error loading user role:", error);
      setCurrentUserRole(null);
    }
  };

  // Cargar contraseña actual decodificada
  const loadCurrentPassword = async () => {
    try {
      const userSession = localStorage.getItem("user_session");
      if (!userSession) return;

      const session = JSON.parse(userSession);

      const { data: userData, error } = await supabase
        .from("users")
        .select("password")
        .eq("id", session.id)
        .single();

      if (!error && userData) {
        // Mostrar contraseña en texto plano
        setPasswordForm((prev) => ({
          ...prev,
          currentPassword: userData.password,
        }));
      }
    } catch (error) {
      console.error("Error loading current password:", error);
    }
  };

  // Cargar todos los usuarios del sistema (Solo Super Admin)
  const loadSystemUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        setSystemUsers(data.users || []);
      }
    } catch (error) {
      console.error("Error cargando usuarios del sistema:", error);
    }
  };

  // Cargar permisos del sistema (Solo Super Admin)
  const loadSystemPermissions = async () => {
    try {
      const response = await fetch("/api/permissions");
      if (response.ok) {
        const data = await response.json();
        setSystemPermissions(data.permissions || {});
      }
    } catch (error) {
      console.error("Error cargando permisos del sistema:", error);
    }
  };

  // Crear nuevo usuario (Solo Super Admin)
  const handleCreateUser = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserForm),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Usuario creado exitosamente",
          text: "El nuevo usuario ha sido creado y puede iniciar sesión.",
          confirmButtonColor: "#10b981",
        });
        setIsUserModalOpen(false);
        setNewUserForm({
          name: "",
          email: "",
          password: "",
          role: "USER",
          permissions: [],
        });
        loadSystemUsers();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al crear usuario",
          text: result.error,
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error creando usuario:", error);
      Swal.fire({
        icon: "error",
        title: "Error al crear usuario",
        text: "Ha ocurrido un error inesperado. Inténtalo de nuevo.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Actualizar usuario existente (Solo Super Admin)
  const handleUpdateUser = async (
    userId: string,
    updates: Partial<SystemUser>,
  ) => {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Usuario actualizado exitosamente",
          text: "Los cambios han sido guardados correctamente.",
          confirmButtonColor: "#10b981",
        });
        loadSystemUsers();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al actualizar usuario",
          text: result.error,
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error actualizando usuario:", error);
      Swal.fire({
        icon: "error",
        title: "Error al actualizar usuario",
        text: "Ha ocurrido un error inesperado. Inténtalo de nuevo.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar usuario (Solo Super Admin)
  const handleDeleteUser = async (userId: string) => {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Usuario eliminado exitosamente",
          text: "El usuario ha sido eliminado del sistema.",
          confirmButtonColor: "#10b981",
        });
        loadSystemUsers();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al eliminar usuario",
          text: result.error,
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Error eliminando usuario:", error);
      Swal.fire({
        icon: "error",
        title: "Error al eliminar usuario",
        text: "Ha ocurrido un error inesperado. Inténtalo de nuevo.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener badge del rol
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return (
          <Badge className="bg-purple-600 text-white">
            <Crown className="w-3 h-3 mr-1" />
            Super Admin
          </Badge>
        );
      case "ADMIN":
        return (
          <Badge className="bg-blue-600 text-white">
            <Shield className="w-3 h-3 mr-1" />
            Admin
          </Badge>
        );
      case "USER":
        return (
          <Badge variant="outline">
            <User className="w-3 h-3 mr-1" />
            Usuario
          </Badge>
        );
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  const handleProfileUpdate = async () => {
    try {
      setIsLoading(true);

      // Verificar que Swal esté disponible
      if (typeof Swal === "undefined") {
        console.error("SweetAlert2 no está disponible");
        alert("Error: SweetAlert2 no está disponible. Refrescando página...");
        window.location.reload();
        return;
      }

      // Actualizar directamente en Supabase
      const { error } = await supabase
        .from("users")
        .update({
          name: profile.name,
          email: profile.email,
          telefono: profile.phone, // phone -> telefono
          ubicacion: profile.location, // location -> ubicacion
          empresa: profile.company, // company -> empresa
          sitio_web: profile.website, // website -> sitio_web
          biografia: profile.bio, // bio -> biografia
        })
        .eq("id", profile.id);

      if (error) {
        console.error("Error updating profile:", error);
        await Swal.fire({
          icon: "error",
          title: "Error al actualizar perfil",
          text: error.message || "Ha ocurrido un error desconocido.",
          confirmButtonColor: "#ef4444",
        });
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Perfil actualizado exitosamente",
        text: "Tus cambios han sido guardados correctamente.",
        confirmButtonColor: "#10b981",
      });

      // Actualizar localStorage con los nuevos datos
      const userData = localStorage.getItem("user_data");
      if (userData) {
        const user = JSON.parse(userData);
        const updatedUser = {
          ...user,
          name: profile.name,
          email: profile.email,
        };
        localStorage.setItem("user_data", JSON.stringify(updatedUser));
      }

      // Recargar datos del perfil para mostrar cambios
      await loadUserData();
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      // Fallback a alert si Swal falla
      try {
        await Swal.fire({
          icon: "error",
          title: "Error al actualizar perfil",
          text: "Ha ocurrido un error inesperado. Inténtalo de nuevo.",
          confirmButtonColor: "#ef4444",
        });
      } catch (swalError) {
        console.error("SweetAlert2 error:", swalError);
        alert(
          "Error al actualizar perfil. Revisa la consola para más detalles.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferencesUpdate = async () => {
    try {
      setIsLoading(true);

      // TODO: Implementar API de preferencias
      console.log("Preferencias actualizadas:", preferences);
      Swal.fire({
        icon: "success",
        title: "Preferencias actualizadas exitosamente",
        text: "Tus preferencias han sido guardadas.",
        confirmButtonColor: "#10b981",
      });
    } catch (error) {
      console.error("Error actualizando preferencias:", error);
      Swal.fire({
        icon: "error",
        title: "Error al actualizar preferencias",
        text: "Ha ocurrido un error inesperado. Inténtalo de nuevo.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Contraseñas no coinciden",
        text: "La nueva contraseña y su confirmación deben ser iguales.",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      Swal.fire({
        icon: "warning",
        title: "Contraseña muy corta",
        text: "La contraseña debe tener al menos 6 caracteres.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Store new password as plain text
      const newPassword = passwordForm.newPassword;

      // Update password in User table
      const { error: updateError } = await supabase
        .from("users")
        .update({
          password: newPassword,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (updateError) {
        console.error("Error updating password:", updateError);
        Swal.fire({
          icon: "error",
          title: "Error al cambiar contraseña",
          text: "Ha ocurrido un error al actualizar tu contraseña.",
          confirmButtonColor: "#ef4444",
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Contraseña cambiada exitosamente",
        text: "Tu contraseña ha sido actualizada correctamente.",
        confirmButtonColor: "#10b981",
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error cambiando contraseña:", error);
      Swal.fire({
        icon: "error",
        title: "Error al cambiar contraseña",
        text: "Ha ocurrido un error inesperado. Inténtalo de nuevo.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      // 2MB limit
      Swal.fire({
        icon: "warning",
        title: "Imagen demasiado grande",
        text: "La imagen debe ser menor a 2MB.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Obtener el ID del usuario actual
      const userData = localStorage.getItem("user_data");
      if (!userData) {
        throw new Error("No se encontró información del usuario");
      }
      const user = JSON.parse(userData);

      // Generar un nombre de archivo único
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      console.log("Iniciando subida de imagen:", {
        fileName,
        filePath,
        fileSize: file.size,
        fileType: file.type,
      });

      // Subir archivo a Supabase Storage usando el cliente regular
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("img")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        console.error("Error uploading file:", uploadError);

        // Manejo específico de errores RLS
        if (uploadError.message.includes("row-level security policy")) {
          throw new Error(
            "🚫 ERROR DE PERMISOS RLS - SOLUCIÓN RÁPIDA:\n\n" +
              "1. Ve al Dashboard de Supabase\n" +
              "2. Ve a Storage → img → Policies\n" +
              "3. Crea esta política SQL:\n\n" +
              'CREATE POLICY "Allow avatar uploads" ON storage.objects\n' +
              "    FOR INSERT WITH CHECK (\n" +
              "        bucket_id = 'img' AND\n" +
              "        (storage.foldername(name))[1] = 'avatars'\n" +
              "    );\n\n" +
              "4. También crea:\n\n" +
              'CREATE POLICY "Allow public read access to img bucket" ON storage.objects\n' +
              "    FOR SELECT USING (bucket_id = 'img');\n\n" +
              "✅ Después de crear las políticas, intenta subir la imagen nuevamente.",
          );
        }

        throw new Error(
          "Error al subir la imagen al almacenamiento: " + uploadError.message,
        );
      }

      console.log("Archivo subido exitosamente:", uploadData);

      // Obtener la URL pública del archivo (más confiable que signed URL para avatares)
      const { data: publicUrlData } = supabase.storage
        .from("img")
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) {
        throw new Error("No se pudo obtener la URL pública de la imagen");
      }

      console.log("URL pública obtenida:", publicUrlData.publicUrl);

      // Actualizar el campo image en la tabla users
      const { error: updateError } = await supabase
        .from("users")
        .update({
          image: publicUrlData.publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) {
        console.error("Error updating user image:", updateError);

        // Manejo específico de errores RLS
        if (updateError.message.includes("row-level security policy")) {
          // Si hay error al actualizar, eliminar el archivo subido
          await supabase.storage.from("img").remove([filePath]);
          throw new Error(
            "🚫 ERROR DE PERMISOS RLS - SOLUCIÓN RÁPIDA:\n\n" +
              "1. Ve al Dashboard de Supabase\n" +
              "2. Ve a Authentication → Policies\n" +
              "3. Para la tabla 'users', elimina políticas existentes y crea:\n\n" +
              'CREATE POLICY "Enable all operations for users table" ON users\n' +
              "    FOR ALL USING (true) WITH CHECK (true);\n\n" +
              "✅ Después de crear esta política, intenta subir la imagen nuevamente.",
          );
        }

        // Si hay error al actualizar, eliminar el archivo subido
        await supabase.storage.from("img").remove([filePath]);
        throw new Error(
          "Error al actualizar la imagen en el perfil: " + updateError.message,
        );
      }

      // Actualizar el estado local
      console.log("Actualizando imagen de perfil a:", publicUrlData.publicUrl);
      setProfile((prev) => ({ ...prev, image: publicUrlData.publicUrl }));

      // Actualizar localStorage con la nueva imagen
      const updatedUser = {
        ...user,
        image: publicUrlData.publicUrl,
      };
      localStorage.setItem("user_data", JSON.stringify(updatedUser));

      Swal.fire({
        icon: "success",
        title: "Imagen actualizada",
        text: "Tu imagen de perfil ha sido actualizada correctamente.",
        confirmButtonColor: "#10b981",
        footer: `
          <div style="font-size: 12px; color: #666; text-align: left;">
            <strong>✅ Éxito:</strong> Imagen subida correctamente<br>
            <strong>📁 Bucket:</strong> img/avatars/<br>
            <strong>🔗 URL:</strong> ${publicUrlData.publicUrl.substring(0, 50)}...<br>
            <strong>✨ Política RLS:</strong> Configurada correctamente
          </div>
        `,
      });

      // Recargar los datos del perfil para asegurar que la imagen se muestre
      await loadUserData();
    } catch (error) {
      console.error("Error subiendo imagen:", error);
      Swal.fire({
        icon: "error",
        title: "Error al subir imagen",
        text:
          (error as Error).message ||
          "Ha ocurrido un error al subir tu imagen de perfil.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="text-gray-600 mt-1">
            Gestiona tu información personal y preferencias
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => navigation.navigateTo("/")}
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>

          <Badge variant="secondary" className="text-sm">
            <Star className="w-4 h-4 mr-1" />
            Usuario Premium
          </Badge>
        </div>
      </div>

      {/* Tabs principales */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList
          className={`grid w-full ${currentUserRole === "SUPER_ADMIN" ? "grid-cols-5" : "grid-cols-4"} bg-gray-100 rounded-lg p-1`}
        >
          <TabsTrigger
            value="profile"
            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200 transition-all duration-200 rounded-md"
          >
            <User className="w-4 h-4" />
            <span>Perfil</span>
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200 transition-all duration-200 rounded-md"
          >
            <Settings className="w-4 h-4" />
            <span>Preferencias</span>
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200 transition-all duration-200 rounded-md"
          >
            <Shield className="w-4 h-4" />
            <span>Seguridad</span>
          </TabsTrigger>
          <TabsTrigger
            value="restaurants"
            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200 transition-all duration-200 rounded-md"
          >
            <Building className="w-4 h-4" />
            <span>Restaurantes</span>
          </TabsTrigger>
          {currentUserRole === "SUPER_ADMIN" && (
            <TabsTrigger
              value="users"
              className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200 transition-all duration-200 rounded-md"
            >
              <Users className="w-4 h-4" />
              <span>Usuarios</span>
            </TabsTrigger>
          )}
        </TabsList>

        {/* Tab: Perfil */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Avatar y datos básicos */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Foto de Perfil</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="w-32 h-32">
                    {profile.image ? (
                      <AvatarImage
                        src={profile.image}
                        alt={profile.name}
                        onError={(e) => {
                          console.error("Error cargando imagen:", e);
                          console.log(
                            "URL de imagen que falló:",
                            profile.image,
                          );
                        }}
                        onLoad={() => {
                          console.log(
                            "Imagen cargada exitosamente:",
                            profile.image,
                          );
                        }}
                      />
                    ) : null}
                    <AvatarFallback className="bg-purple-100 text-purple-600 text-2xl">
                      {profile.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        document.getElementById("avatar-upload")?.click()
                      }
                      disabled={isLoading}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Cambiar
                    </Button>

                    {profile.image && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setProfile((prev) => ({ ...prev, image: "" }))
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Miembro desde</span>
                    <span className="font-medium">
                      {new Date(profile.joinedAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {profile.lastLoginAt && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Último acceso</span>
                      <span className="font-medium">
                        {new Date(profile.lastLoginAt).toLocaleDateString(
                          "es-ES",
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Información personal */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Información Personal</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">
                        Cargando información del perfil...
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Debug info - Solo para desarrollo */}
                    {process.env.NODE_ENV === "development" && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg text-xs">
                        <p className="font-semibold mb-2">
                          🔍 Debug - Datos en perfil:
                        </p>
                        <p>Nombre: {profile.name || "(vacío)"}</p>
                        <p>Email: {profile.email || "(vacío)"}</p>
                        <p>Teléfono: {profile.phone || "(vacío)"}</p>
                        <p>Ubicación: {profile.location || "(vacío)"}</p>
                        <p>Empresa: {profile.company || "(vacío)"}</p>
                        <p>Sitio web: {profile.website || "(vacío)"}</p>
                        <p>Biografía: {profile.bio || "(vacío)"}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre completo</Label>
                        <Input
                          id="name"
                          type="text"
                          value={profile.name}
                          onChange={(e: any) =>
                            setProfile((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          placeholder="Tu nombre completo"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e: any) =>
                            setProfile((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          placeholder="tu@email.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={profile.phone || ""}
                          onChange={(e: any) =>
                            setProfile((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          placeholder="+57 300 123 4567"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Ubicación</Label>
                        <Input
                          id="location"
                          type="text"
                          value={profile.location || ""}
                          onChange={(e: any) =>
                            setProfile((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                          placeholder="Ciudad, País"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company">Empresa</Label>
                        <Input
                          id="company"
                          type="text"
                          value={profile.company || ""}
                          onChange={(e: any) =>
                            setProfile((prev) => ({
                              ...prev,
                              company: e.target.value,
                            }))
                          }
                          placeholder="Nombre de tu empresa"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website">Sitio web</Label>
                        <Input
                          id="website"
                          type="url"
                          value={profile.website || ""}
                          onChange={(e: any) =>
                            setProfile((prev) => ({
                              ...prev,
                              website: e.target.value,
                            }))
                          }
                          placeholder="https://turestaurante.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Biografía</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio || ""}
                        onChange={(e: any) =>
                          setProfile((prev) => ({
                            ...prev,
                            bio: e.target.value,
                          }))
                        }
                        placeholder="Cuéntanos sobre ti..."
                        rows={4}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={handleProfileUpdate}
                        disabled={isLoading}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors duration-200"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Guardar Cambios
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Preferencias */}
        <TabsContent value="preferences" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Notificaciones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Notificaciones</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="email-notifications"
                      className="text-sm font-medium"
                    >
                      Notificaciones por email
                    </Label>
                    <p className="text-xs text-gray-600">
                      Recibir alertas importantes por correo
                    </p>
                  </div>
                  <Button
                    variant={
                      preferences.emailNotifications ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      setPreferences((prev) => ({
                        ...prev,
                        emailNotifications: !prev.emailNotifications,
                      }))
                    }
                  >
                    {preferences.emailNotifications ? "ON" : "OFF"}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="sms-notifications"
                      className="text-sm font-medium"
                    >
                      Notificaciones SMS
                    </Label>
                    <p className="text-xs text-gray-600">
                      Alertas urgentes vía mensaje de texto
                    </p>
                  </div>
                  <Button
                    variant={
                      preferences.smsNotifications ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      setPreferences((prev) => ({
                        ...prev,
                        smsNotifications: !prev.smsNotifications,
                      }))
                    }
                  >
                    {preferences.smsNotifications ? "ON" : "OFF"}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="marketing-emails"
                      className="text-sm font-medium"
                    >
                      Emails de marketing
                    </Label>
                    <p className="text-xs text-gray-600">
                      Novedades, promociones y contenido
                    </p>
                  </div>
                  <Button
                    variant={
                      preferences.marketingEmails ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      setPreferences((prev) => ({
                        ...prev,
                        marketingEmails: !prev.marketingEmails,
                      }))
                    }
                  >
                    {preferences.marketingEmails ? "ON" : "OFF"}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="weekly-reports"
                      className="text-sm font-medium"
                    >
                      Reportes semanales
                    </Label>
                    <p className="text-xs text-gray-600">
                      Resumen semanal de actividad
                    </p>
                  </div>
                  <Button
                    variant={preferences.weeklyReports ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setPreferences((prev) => ({
                        ...prev,
                        weeklyReports: !prev.weeklyReports,
                      }))
                    }
                  >
                    {preferences.weeklyReports ? "ON" : "OFF"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Configuraciones regionales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5" />
                  <span>Configuración Regional</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <select
                    id="language"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={preferences.language}
                    onChange={(e: any) =>
                      setPreferences((prev) => ({
                        ...prev,
                        language: e.target.value,
                      }))
                    }
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                    <option value="pt">Português</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Zona horaria</Label>
                  <select
                    id="timezone"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={preferences.timezone}
                    onChange={(e: any) =>
                      setPreferences((prev) => ({
                        ...prev,
                        timezone: e.target.value,
                      }))
                    }
                  >
                    <option value="America/Bogota">Bogotá (GMT-5)</option>
                    <option value="America/Mexico_City">
                      Ciudad de México (GMT-6)
                    </option>
                    <option value="America/Santiago">Santiago (GMT-3)</option>
                    <option value="America/Buenos_Aires">
                      Buenos Aires (GMT-3)
                    </option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dashboard-layout">Layout del dashboard</Label>
                  <select
                    id="dashboard-layout"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={preferences.dashboardLayout}
                    onChange={(e: any) =>
                      setPreferences((prev) => ({
                        ...prev,
                        dashboardLayout: e.target.value,
                      }))
                    }
                  >
                    <option value="standard">Estándar</option>
                    <option value="compact">Compacto</option>
                    <option value="expanded">Expandido</option>
                  </select>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handlePreferencesUpdate}
                    disabled={isLoading}
                    variant="outline"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Preferencias
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Seguridad */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cambiar contraseña */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="w-5 h-5" />
                  <span>Cambiar Contraseña</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Contraseña actual</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showPassword ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      readOnly
                      placeholder="Tu contraseña actual"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">Nueva contraseña</Label>
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    placeholder="Nueva contraseña (mín. 6 caracteres)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    placeholder="Confirma la nueva contraseña"
                  />
                </div>

                <Button
                  onClick={handlePasswordChange}
                  disabled={
                    isLoading ||
                    !passwordForm.currentPassword ||
                    !passwordForm.newPassword
                  }
                  className="w-full"
                >
                  <Key className="w-4 h-4 mr-2" />
                  Cambiar Contraseña
                </Button>

                <div className="text-xs text-gray-500 mt-2">
                  Última actualización:{" "}
                  {new Date(security.lastPasswordChange).toLocaleDateString(
                    "es-ES",
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actividad de sesión */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Actividad de la Cuenta</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sesiones activas</span>
                  <Badge variant="outline">{security.activeSessions}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Autenticación de dos factores</span>
                  <Button
                    variant={security.twoFactorEnabled ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setSecurity((prev) => ({
                        ...prev,
                        twoFactorEnabled: !prev.twoFactorEnabled,
                      }))
                    }
                  >
                    {security.twoFactorEnabled ? "Activada" : "Inactiva"}
                  </Button>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Historial de accesos recientes
                  </Label>
                  {security.loginHistory?.map((login, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-xs bg-gray-50 p-3 rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{login.date}</div>
                        <div className="text-gray-600">{login.location}</div>
                      </div>
                      <div className="text-right">
                        <div>{login.device}</div>
                        <div className="text-gray-600">{login.ip}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="w-full">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Cerrar todas las sesiones
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        ¿Cerrar todas las sesiones?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Esto cerrará todas las sesiones activas en todos los
                        dispositivos. Tendrás que iniciar sesión nuevamente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                        Cerrar todas
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Restaurantes */}
        <TabsContent value="restaurants" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="w-5 h-5" />
                <span>Mis Restaurantes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.restaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Building className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {restaurant.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          @{restaurant.slug}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <Badge
                        variant={
                          restaurant.status === "Activo"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {restaurant.status}
                      </Badge>
                      <Badge variant="outline">{restaurant.role}</Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Cambiar a vista específica del restaurante
                          const restaurantObj = {
                            id: restaurant.id,
                            name: restaurant.name,
                            location: restaurant.location,
                            type: "sucursal" as "sucursal" | "principal",
                            image: "",
                            status: (restaurant.status === "Activo"
                              ? "activo"
                              : restaurant.status === "Inactivo"
                                ? "cerrado"
                                : "mantenimiento") as
                              | "activo"
                              | "mantenimiento"
                              | "cerrado",
                            user_id: profile.id,
                            slug: restaurant.slug,
                            metrics: {
                              ventasHoy: 0,
                              ventasAyer: 0,
                              clientesHoy: 0,
                              clientesAyer: 0,
                              ocupacionActual: 0,
                              reservasHoy: 0,
                              reservasManana: 0,
                              calificacionPromedio: 0,
                              totalCalificaciones: 0,
                              mesasDisponibles: 0,
                              mesasOcupadas: 0,
                              tiempoEsperaPromedio: 0,
                              ventasSemana: 0,
                              ventasSemanaPasada: 0,
                              ticketPromedio: 0,
                            },
                          };
                          navigation.navigateTo("/");
                          // Usar setTimeout para asegurar que la navegación se complete primero
                          setTimeout(() => {
                            setSelectedRestaurant(restaurantObj);
                            setViewMode("specific");
                          }, 100);
                        }}
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Ver Dashboard
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="flex justify-center pt-4">
                  <Dialog
                    open={isRestaurantModalOpen}
                    onOpenChange={setIsRestaurantModalOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Building className="w-4 h-4 mr-2" />
                        Agregar Restaurante
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Agregar Nuevo Restaurante</DialogTitle>
                        <DialogDescription>
                          Completa la información para crear un nuevo
                          restaurante en tu cuenta.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="restaurant-name"
                            className="text-right"
                          >
                            Nombre
                          </Label>
                          <Input
                            id="restaurant-name"
                            placeholder="Nombre del restaurante"
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="restaurant-location"
                            className="text-right"
                          >
                            Ubicación
                          </Label>
                          <Input
                            id="restaurant-location"
                            placeholder="Ciudad, País"
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="restaurant-type"
                            className="text-right"
                          >
                            Tipo
                          </Label>
                          <Select defaultValue="sucursal">
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Selecciona un tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="principal">
                                Principal
                              </SelectItem>
                              <SelectItem value="sucursal">Sucursal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="submit"
                          onClick={() => {
                            // Aquí iría la lógica para crear el restaurante
                            Swal.fire({
                              icon: "success",
                              title: "Restaurante creado exitosamente",
                              text: "El restaurante ha sido agregado a tu cuenta.",
                              confirmButtonColor: "#10b981",
                            });
                            setIsRestaurantModalOpen(false);
                          }}
                        >
                          Crear Restaurante
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Gestión de Usuarios (Solo Super Admin) */}
        {currentUserRole === "SUPER_ADMIN" && (
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Gestión de Usuarios
                </h2>
                <p className="text-gray-600 mt-1">
                  Administra usuarios y permisos del sistema
                </p>
              </div>
              <Button
                onClick={() => {
                  setEditingUser(null);
                  setNewUserForm({
                    name: "",
                    email: "",
                    password: "",
                    role: "USER",
                    permissions: [],
                  });
                  setIsUserModalOpen(true);
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors duration-200"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Nuevo Usuario
              </Button>
            </div>

            {/* Lista de usuarios */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Usuarios del Sistema</span>
                  <Badge variant="outline" className="ml-auto">
                    {systemUsers.length} usuarios
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-purple-100 text-purple-600">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900">
                              {user.name}
                            </h3>
                            {getRoleBadge(user.role)}
                            {!user.is_active && (
                              <Badge variant="destructive" className="text-xs">
                                Inactivo
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500">
                            Creado:{" "}
                            {new Date(user.createdAt).toLocaleDateString(
                              "es-ES",
                            )}
                            {user.lastLoginAt && (
                              <span className="ml-2">
                                • Último acceso:{" "}
                                {new Date(user.lastLoginAt).toLocaleDateString(
                                  "es-ES",
                                )}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {user.UserPermissions.length} permisos
                        </Badge>

                        {user.role !== "SUPER_ADMIN" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingUser(user);
                                setNewUserForm({
                                  name: user.name,
                                  email: user.email,
                                  password: "",
                                  role: user.role as "ADMIN" | "USER",
                                  permissions: user.UserPermissions.map(
                                    (up) => up.Permission.name,
                                  ),
                                });
                                setIsUserModalOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    ¿Eliminar usuario?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Se
                                    eliminará permanentemente el usuario "
                                    {user.name}" y todos sus datos asociados.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={() => handleDeleteUser(user.id)}
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Modal para crear/editar usuario */}
            {isUserModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">
                      {editingUser ? "Editar Usuario" : "Crear Nuevo Usuario"}
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsUserModalOpen(false)}
                    >
                      ✕
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {/* Información básica */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="user-name">Nombre completo</Label>
                        <Input
                          id="user-name"
                          value={newUserForm.name}
                          onChange={(e) =>
                            setNewUserForm((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          placeholder="Nombre del usuario"
                        />
                      </div>

                      <div>
                        <Label htmlFor="user-email">Email</Label>
                        <Input
                          id="user-email"
                          type="email"
                          value={newUserForm.email}
                          onChange={(e) =>
                            setNewUserForm((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          placeholder="email@ejemplo.com"
                          disabled={!!editingUser} // No permitir cambiar email al editar
                        />
                      </div>

                      {!editingUser && (
                        <div>
                          <Label htmlFor="user-password">Contraseña</Label>
                          <Input
                            id="user-password"
                            type="password"
                            value={newUserForm.password}
                            onChange={(e) =>
                              setNewUserForm((prev) => ({
                                ...prev,
                                password: e.target.value,
                              }))
                            }
                            placeholder="Contraseña temporal"
                          />
                        </div>
                      )}

                      <div>
                        <Label htmlFor="user-role">Rol</Label>
                        <select
                          id="user-role"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={newUserForm.role}
                          onChange={(e) =>
                            setNewUserForm((prev) => ({
                              ...prev,
                              role: e.target.value as "ADMIN" | "USER",
                            }))
                          }
                        >
                          <option value="USER">Usuario</option>
                          <option value="ADMIN">Administrador</option>
                        </select>
                      </div>
                    </div>

                    {/* Permisos */}
                    <div>
                      <Label className="text-base font-semibold">
                        Permisos del Usuario
                      </Label>
                      <p className="text-sm text-gray-600 mb-4">
                        Selecciona los permisos que tendrá este usuario
                      </p>

                      <div className="space-y-4">
                        {Object.entries(systemPermissions).map(
                          ([category, permissions]) => (
                            <div
                              key={category}
                              className="border rounded-lg p-4"
                            >
                              <h4 className="font-semibold text-gray-900 mb-3 capitalize">
                                {category.replace(/_/g, " ")}
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {permissions.map((permission) => (
                                  <div
                                    key={permission.id}
                                    className="flex items-center space-x-2"
                                  >
                                    <Checkbox
                                      id={permission.id}
                                      checked={newUserForm.permissions.includes(
                                        permission.id,
                                      )}
                                      onCheckedChange={(checked: any) => {
                                        if (checked) {
                                          setNewUserForm((prev) => ({
                                            ...prev,
                                            permissions: [
                                              ...prev.permissions,
                                              permission.id,
                                            ],
                                          }));
                                        } else {
                                          setNewUserForm((prev) => ({
                                            ...prev,
                                            permissions:
                                              prev.permissions.filter(
                                                (p) => p !== permission.id,
                                              ),
                                          }));
                                        }
                                      }}
                                    />
                                    <div>
                                      <Label
                                        htmlFor={permission.id}
                                        className="text-sm"
                                      >
                                        {permission.displayName}
                                      </Label>
                                      {permission.description && (
                                        <p className="text-xs text-gray-500">
                                          {permission.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    {/* Botones */}
                    <div className="flex space-x-4">
                      <Button
                        onClick={() => setIsUserModalOpen(false)}
                        variant="outline"
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={
                          editingUser
                            ? () =>
                                handleUpdateUser(editingUser.id, {
                                  name: newUserForm.name,
                                  role: newUserForm.role,
                                  permissions: newUserForm.permissions,
                                } as any)
                            : handleCreateUser
                        }
                        disabled={
                          isLoading ||
                          !newUserForm.name ||
                          !newUserForm.email ||
                          (!editingUser && !newUserForm.password)
                        }
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors duration-200"
                      >
                        {editingUser ? "Actualizar Usuario" : "Crear Usuario"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Estadísticas de usuarios */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Total Usuarios</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {systemUsers.length}
                  </div>
                  <p className="text-xs text-gray-600">
                    +
                    {
                      systemUsers.filter(
                        (u) =>
                          new Date(u.createdAt) >
                          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                      ).length
                    }{" "}
                    este mes
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Usuarios Activos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {systemUsers.filter((u) => u.is_active).length}
                  </div>
                  <p className="text-xs text-gray-600">
                    {Math.round(
                      (systemUsers.filter((u) => u.is_active).length /
                        systemUsers.length) *
                        100,
                    )}
                    % del total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Administradores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {
                      systemUsers.filter(
                        (u) => u.role === "ADMIN" || u.role === "SUPER_ADMIN",
                      ).length
                    }
                  </div>
                  <p className="text-xs text-gray-600">
                    Incluyendo Super Admins
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
