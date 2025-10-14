"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  QrCode,
  Download,
  Settings,
  BarChart3,
  Eye,
  Users,
  Calendar,
  TrendingUp,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import { useNavigation } from "@/contexts/NavigationContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import MobilePreview from "@/components/mobile-preview";

interface QRConfiguration {
  id: string;
  qrBehavior: "menu" | "whatsapp";
  whatsappNumber: string;
  whatsappMessage: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
  primaryButtonColor: string;
  secondaryButtonText: string;
  secondaryButtonUrl: string;
  secondaryButtonColor: string;
  tertiaryButtonText: string;
  tertiaryButtonUrl: string;
  tertiaryButtonColor: string;
  captureLeadsEnabled: boolean;
  welcomeMessage: string;
}

export default function PortalQRContent() {
  const navigation = useNavigation();
  const [qrConfig, setQRConfig] = useState<QRConfiguration>({
    id: "",
    qrBehavior: "menu",
    whatsappNumber: "+56912345678",
    whatsappMessage:
      "Hola! Vengo del código QR de Jaraquemada. Me gustaría conocer más sobre el restaurante.",
    primaryButtonText: "Ver Menú Digital",
    primaryButtonUrl: `${typeof window !== "undefined" ? window.location.origin : ""}/menu`,
    primaryButtonColor: "#8B5CF6",
    secondaryButtonText: "Reservar por WhatsApp",
    secondaryButtonUrl:
      "https://wa.me/56912345678?text=Hola! Me gustaría hacer una reserva en Jaraquemada.",
    secondaryButtonColor: "#10B981",
    tertiaryButtonText: "Contactar Restaurante",
    tertiaryButtonUrl:
      "https://wa.me/56912345678?text=Hola! Tengo una consulta sobre Jaraquemada.",
    tertiaryButtonColor: "#F59E0B",
    captureLeadsEnabled: true,
    welcomeMessage:
      "¡Bienvenido a Jaraquemada! Tu experiencia gastronómica única en Santiago.",
  });
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const statsData = [
    { name: "Ene", escaneos: 450 },
    { name: "Feb", escaneos: 620 },
    { name: "Mar", escaneos: 580 },
    { name: "Abr", escaneos: 750 },
    { name: "May", escaneos: 890 },
    { name: "Jun", escaneos: 920 },
    { name: "Jul", escaneos: 1100 },
    { name: "Ago", escaneos: 1050 },
  ];

  useEffect(() => {
    loadQRConfiguration();
    generateQRCode();
  }, []);

  const loadQRConfiguration = async () => {
    try {
      const response = await fetch("/api/qr-config");
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setQRConfig(data);
        }
      }
    } catch (error) {
      console.error("Error loading QR config:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateQRCode = async () => {
    try {
      console.log("🔄 Generando código QR...");
      const response = await fetch("/api/qr-generate");
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setQrCodeUrl(url);
        console.log("✅ Código QR generado exitosamente");
      } else {
        console.error("❌ Error en respuesta del servidor:", response.status);
        // Crear QR de fallback
        createFallbackQR();
      }
    } catch (error) {
      console.error("❌ Error generando QR:", error);
      // Crear QR de fallback
      createFallbackQR();
    }
  };

  const createFallbackQR = () => {
    // Crear un QR simple usando canvas como fallback con patrón FIJO
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // Fondo blanco
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 200, 200);

      // Patrón QR FIJO - siempre el mismo patrón
      ctx.fillStyle = "black";
      const pattern = [
        [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1],
        [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1],
        [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1],
        [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1],
        [1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1],
        [0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0],
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1],
        [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1],
        [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
      ];

      for (let i = 0; i < 20 && i < pattern.length; i++) {
        for (let j = 0; j < 20 && j < pattern[i].length; j++) {
          if (pattern[i][j] === 1) {
            ctx.fillRect(j * 10, i * 10, 10, 10);
          }
        }
      }

      // Convertir a blob URL
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setQrCodeUrl(url);
          console.log("✅ QR de fallback FIJO creado");
        }
      });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/qr-config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(qrConfig),
      });

      if (response.ok) {
        console.log("Configuración guardada exitosamente");
        generateQRCode(); // Regenerar QR con nueva config
      }
    } catch (error) {
      console.error("Error saving QR config:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadQR = async () => {
    try {
      if (qrCodeUrl) {
        // Si ya tenemos el QR en cache, descargarlo directamente
        const link = document.createElement("a");
        link.href = qrCodeUrl;
        link.download = "qr-code-restaurante.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        alert("✅ QR descargado exitosamente");
      } else {
        // Si no hay QR, generarlo y descargarlo
        const response = await fetch("/api/qr-generate");
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setQrCodeUrl(url);

          const link = document.createElement("a");
          link.href = url;
          link.download = "qr-code-restaurante.png";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          alert("✅ QR generado y descargado exitosamente");
        } else {
          alert("❌ Error al generar el código QR");
        }
      }
    } catch (error) {
      console.error("Error downloading QR:", error);
      alert("❌ Error al descargar el código QR");
    }
  };

  const handleConfigChange = (
    field: keyof QRConfiguration,
    value: string | boolean,
  ) => {
    setQRConfig({ ...qrConfig, [field]: value });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">Cargando configuración...</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Actions Bar - Sin título para evitar duplicación con el header principal */}
      <div className="flex justify-end items-center">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handleDownloadQR}
            disabled={!qrCodeUrl}
            className="border-gray-300 hover:bg-gray-100 hover:border-gray-400 text-gray-700 hover:text-gray-900 transition-colors duration-200"
          >
            <Download className="mr-2 h-4 w-4" />
            Descargar QR
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors duration-200"
          >
            {isSaving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="config"
        className="space-y-4"
        onValueChange={(value) => console.log("QR Tab changed:", value)}
      >
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-lg p-1">
          <TabsTrigger
            value="config"
            className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200 transition-all duration-200 rounded-md"
            onClick={() => console.log("Config tab clicked")}
          >
            Configuración
          </TabsTrigger>
          <TabsTrigger
            value="stats"
            className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200 transition-all duration-200 rounded-md"
            onClick={() => console.log("Stats tab clicked")}
          >
            Estadísticas
          </TabsTrigger>
          <TabsTrigger
            value="preview"
            className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-200 transition-all duration-200 rounded-md"
            onClick={() => console.log("Preview tab clicked")}
          >
            Vista Previa
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configuration Panel */}
            <div className="space-y-6">
              {/* QR Behavior Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <QrCode className="h-5 w-5" />
                    <span>Comportamiento del QR</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">
                      ¿A dónde lleva el código QR?
                    </Label>
                    <p className="text-sm text-gray-600 mb-3">
                      Selecciona qué sucede cuando alguien escanea el código QR
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Option 1: Menu with buttons */}
                      <div
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          qrConfig.qrBehavior === "menu"
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleConfigChange("qrBehavior", "menu")}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <div
                            className={`p-2 rounded-full ${
                              qrConfig.qrBehavior === "menu"
                                ? "bg-purple-100"
                                : "bg-gray-100"
                            }`}
                          >
                            <Settings className="h-5 w-5 text-purple-600" />
                          </div>
                          <h4 className="font-semibold">Menú con Botones</h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          Muestra una página con 3 botones personalizables
                          (menú, reservas, contacto)
                        </p>
                        <div className="mt-2 flex items-center space-x-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-xs text-gray-500">
                            Más opciones para el cliente
                          </span>
                        </div>
                      </div>

                      {/* Option 2: Direct to WhatsApp */}
                      <div
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          qrConfig.qrBehavior === "whatsapp"
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() =>
                          handleConfigChange("qrBehavior", "whatsapp")
                        }
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <div
                            className={`p-2 rounded-full ${
                              qrConfig.qrBehavior === "whatsapp"
                                ? "bg-green-100"
                                : "bg-gray-100"
                            }`}
                          >
                            <MessageSquare className="h-5 w-5 text-green-600" />
                          </div>
                          <h4 className="font-semibold">Directo a WhatsApp</h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          Abre WhatsApp directamente con un mensaje predefinido
                        </p>
                        <div className="mt-2 flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-gray-500">
                            Contacto inmediato
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Configuration (only shown when whatsapp is selected) */}
                  {qrConfig.qrBehavior === "whatsapp" && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <h5 className="font-medium text-green-800 mb-3">
                        Configuración de WhatsApp
                      </h5>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="whatsappNumber">
                            Número de WhatsApp
                          </Label>
                          <Input
                            id="whatsappNumber"
                            placeholder="+56912345678"
                            value={qrConfig.whatsappNumber}
                            onChange={(e) =>
                              handleConfigChange(
                                "whatsappNumber",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="whatsappMessage">
                            Mensaje predefinido
                          </Label>
                          <textarea
                            id="whatsappMessage"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            rows={3}
                            placeholder="Hola! Vengo del código QR de tu restaurante..."
                            value={qrConfig.whatsappMessage}
                            onChange={(e) =>
                              handleConfigChange(
                                "whatsappMessage",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Button Configuration (only shown when menu is selected) */}
              {qrConfig.qrBehavior === "menu" && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Settings className="h-5 w-5" />
                        <span>Configuración de Botones</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Primary Button */}
                      <div className="space-y-3">
                        <Label className="text-base font-medium">
                          Botón Principal
                        </Label>
                        <div className="grid grid-cols-1 gap-3">
                          <Input
                            placeholder="Texto del botón"
                            value={qrConfig.primaryButtonText}
                            onChange={(e) =>
                              handleConfigChange(
                                "primaryButtonText",
                                e.target.value,
                              )
                            }
                          />
                          <Input
                            placeholder="URL de destino"
                            value={qrConfig.primaryButtonUrl}
                            onChange={(e) =>
                              handleConfigChange(
                                "primaryButtonUrl",
                                e.target.value,
                              )
                            }
                          />
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={qrConfig.primaryButtonColor}
                              onChange={(e) =>
                                handleConfigChange(
                                  "primaryButtonColor",
                                  e.target.value,
                                )
                              }
                              className="h-10 w-16 rounded border border-gray-300"
                            />
                            <Input
                              value={qrConfig.primaryButtonColor}
                              onChange={(e) =>
                                handleConfigChange(
                                  "primaryButtonColor",
                                  e.target.value,
                                )
                              }
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Secondary Button */}
                      <div className="space-y-3">
                        <Label className="text-base font-medium">
                          Botón Secundario
                        </Label>
                        <div className="grid grid-cols-1 gap-3">
                          <Input
                            placeholder="Texto del botón"
                            value={qrConfig.secondaryButtonText}
                            onChange={(e) =>
                              handleConfigChange(
                                "secondaryButtonText",
                                e.target.value,
                              )
                            }
                          />
                          <Input
                            placeholder="URL de destino"
                            value={qrConfig.secondaryButtonUrl}
                            onChange={(e) =>
                              handleConfigChange(
                                "secondaryButtonUrl",
                                e.target.value,
                              )
                            }
                          />
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={qrConfig.secondaryButtonColor}
                              onChange={(e) =>
                                handleConfigChange(
                                  "secondaryButtonColor",
                                  e.target.value,
                                )
                              }
                              className="h-10 w-16 rounded border border-gray-300"
                            />
                            <Input
                              value={qrConfig.secondaryButtonColor}
                              onChange={(e) =>
                                handleConfigChange(
                                  "secondaryButtonColor",
                                  e.target.value,
                                )
                              }
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Tertiary Button */}
                      <div className="space-y-3">
                        <Label className="text-base font-medium">
                          Botón Terciario
                        </Label>
                        <div className="grid grid-cols-1 gap-3">
                          <Input
                            placeholder="Texto del botón"
                            value={qrConfig.tertiaryButtonText}
                            onChange={(e) =>
                              handleConfigChange(
                                "tertiaryButtonText",
                                e.target.value,
                              )
                            }
                          />
                          <Input
                            placeholder="URL de destino"
                            value={qrConfig.tertiaryButtonUrl}
                            onChange={(e) =>
                              handleConfigChange(
                                "tertiaryButtonUrl",
                                e.target.value,
                              )
                            }
                          />
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={qrConfig.tertiaryButtonColor}
                              onChange={(e) =>
                                handleConfigChange(
                                  "tertiaryButtonColor",
                                  e.target.value,
                                )
                              }
                              className="h-10 w-16 rounded border border-gray-300"
                            />
                            <Input
                              value={qrConfig.tertiaryButtonColor}
                              onChange={(e) =>
                                handleConfigChange(
                                  "tertiaryButtonColor",
                                  e.target.value,
                                )
                              }
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Configuración Adicional</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-medium">
                            Activar Captura de Clientes
                          </Label>
                          <p className="text-sm text-gray-600">
                            Solicitar datos de contacto a los visitantes
                          </p>
                        </div>
                        <Switch
                          checked={qrConfig.captureLeadsEnabled}
                          onCheckedChange={(checked) =>
                            handleConfigChange("captureLeadsEnabled", checked)
                          }
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="welcomeMessage"
                          className="text-base font-medium"
                        >
                          Mensaje de Bienvenida
                        </Label>
                        <Input
                          id="welcomeMessage"
                          value={qrConfig.welcomeMessage}
                          onChange={(e) =>
                            handleConfigChange("welcomeMessage", e.target.value)
                          }
                          className="mt-2"
                          placeholder="Mensaje que verán los visitantes"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* QR Code Display */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <QrCode className="h-5 w-5" />
                    <span>Código QR Generado</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  {qrCodeUrl ? (
                    <div>
                      <img
                        src={qrCodeUrl}
                        alt="Código QR"
                        className="mx-auto mb-4 border border-gray-200 rounded-lg"
                        style={{ width: "200px", height: "200px" }}
                      />
                      <Button
                        onClick={handleDownloadQR}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors duration-200"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Descargar Código QR
                      </Button>
                    </div>
                  ) : (
                    <div className="py-8">
                      <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <QrCode className="h-12 w-12 text-gray-400" />
                      </div>
                      <p className="text-gray-500">Generando código QR...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="stats">
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Escaneos
                  </CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    22,669
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% desde el mes pasado
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Este Mes
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    1,050
                  </div>
                  <p className="text-xs text-muted-foreground">Agosto 2024</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Visitantes Únicos
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    18,432
                  </div>
                  <p className="text-xs text-muted-foreground">
                    81.3% tasa de retorno
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Conversiones
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">15</div>
                  <p className="text-xs text-muted-foreground">
                    Reservas desde QR
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Escaneos por Mes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                    />
                    <YAxis tick={{ fontSize: 12 }} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="escaneos" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Vista Previa del Portal</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <MobilePreview
                restaurantName="AI Restaurante"
                qrBehavior={qrConfig.qrBehavior}
                whatsappNumber={qrConfig.whatsappNumber}
                whatsappMessage={qrConfig.whatsappMessage}
                primaryButtonText={qrConfig.primaryButtonText}
                primaryButtonColor={qrConfig.primaryButtonColor}
                secondaryButtonText={qrConfig.secondaryButtonText}
                secondaryButtonColor={qrConfig.secondaryButtonColor}
                tertiaryButtonText={qrConfig.tertiaryButtonText}
                tertiaryButtonColor={qrConfig.tertiaryButtonColor}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
