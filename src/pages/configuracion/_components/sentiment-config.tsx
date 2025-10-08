

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Brain, 
  Settings, 
  Star, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Plus,
  Trash2,
  RotateCcw,
  Save
} from 'lucide-react';
import { ScoreConfiguration, DEFAULT_SCORE_CONFIG } from '@/lib/sentiment-analysis';
import Swal from 'sweetalert2';

interface SentimentConfigProps {
  onConfigUpdate?: (config: ScoreConfiguration) => void;
}

export default function SentimentConfig({ onConfigUpdate }: SentimentConfigProps) {
  const [config, setConfig] = useState<ScoreConfiguration>(DEFAULT_SCORE_CONFIG);
  const [newPositiveKeyword, setNewPositiveKeyword] = useState('');
  const [newNegativeKeyword, setNewNegativeKeyword] = useState('');
  const [loading, setLoading] = useState(false);

  // Cargar configuración guardada al montar
  useEffect(() => {
    loadSavedConfiguration();
  }, []);

  const loadSavedConfiguration = async () => {
    try {
      const response = await fetch('/api/config/sentiment-analysis');
      if (response.ok) {
        const savedConfig = await response.json();
        setConfig({ ...DEFAULT_SCORE_CONFIG, ...savedConfig });
      }
    } catch (error) {
      console.error('Error cargando configuración:', error);
    }
  };

  const saveConfiguration = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/config/sentiment-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        await Swal.fire({
          title: '✅ Configuración Guardada',
          text: 'La configuración de análisis de sentimiento se ha guardado correctamente.',
          icon: 'success',
          timer: 3000,
          showConfirmButton: false
        });

        // Notificar al componente padre
        onConfigUpdate?.(config);
      } else {
        throw new Error('Error guardando configuración');
      }
    } catch (error) {
      await Swal.fire({
        title: '❌ Error',
        text: 'No se pudo guardar la configuración. Inténtalo de nuevo.',
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaults = async () => {
    const result = await Swal.fire({
      title: '🔄 Restaurar Configuración',
      text: '¿Estás seguro que deseas restaurar la configuración por defecto? Se perderán todos los cambios personalizados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, restaurar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    });

    if (result.isConfirmed) {
      setConfig(DEFAULT_SCORE_CONFIG);
      await Swal.fire({
        title: '✅ Restaurado',
        text: 'La configuración ha sido restaurada a los valores por defecto.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const addPositiveKeyword = () => {
    if (newPositiveKeyword.trim() && !config.positiveKeywords.includes(newPositiveKeyword.trim().toLowerCase())) {
      setConfig(prev => ({
        ...prev,
        positiveKeywords: [...prev.positiveKeywords, newPositiveKeyword.trim().toLowerCase()]
      }));
      setNewPositiveKeyword('');
    }
  };

  const addNegativeKeyword = () => {
    if (newNegativeKeyword.trim() && !config.negativeKeywords.includes(newNegativeKeyword.trim().toLowerCase())) {
      setConfig(prev => ({
        ...prev,
        negativeKeywords: [...prev.negativeKeywords, newNegativeKeyword.trim().toLowerCase()]
      }));
      setNewNegativeKeyword('');
    }
  };

  const removePositiveKeyword = (keyword: string) => {
    setConfig(prev => ({
      ...prev,
      positiveKeywords: prev.positiveKeywords.filter(k => k !== keyword)
    }));
  };

  const removeNegativeKeyword = (keyword: string) => {
    setConfig(prev => ({
      ...prev,
      negativeKeywords: prev.negativeKeywords.filter(k => k !== keyword)
    }));
  };

  const updateCategoryWeight = (category: keyof ScoreConfiguration['categoryWeights'], value: number) => {
    setConfig(prev => ({
      ...prev,
      categoryWeights: {
        ...prev.categoryWeights,
        [category]: value / 100 // Convertir de porcentaje a decimal
      }
    }));
  };

  const testConfiguration = async () => {
    const testMessages = [
      "La comida estaba deliciosa y el servicio excelente. Definitivamente volveré!",
      "El servicio fue muy lento y la comida llegó fría. No recomiendo este lugar.",
      "Estuvo bien, nada espectacular pero tampoco malo. Precio razonable."
    ];

    try {
      setLoading(true);
      const results = [];

      for (const message of testMessages) {
        const response = await fetch('/api/sentiment-analysis/test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            message, 
            config: config 
          }),
        });

        if (response.ok) {
          const result = await response.json();
          results.push({ message: message.substring(0, 50) + '...', ...result });
        }
      }

      // Mostrar resultados de prueba
      await Swal.fire({
        title: '🧪 Resultados de Prueba',
        html: results.map(r => 
          `<div class="text-left mb-3 p-3 border rounded">
            <strong>Mensaje:</strong> ${r.message}<br>
            <strong>Puntuación:</strong> ${r.sentimentScore}/5<br>
            <strong>Reseña Google:</strong> ${r.recommendation?.requestGoogleReview ? '✅' : '❌'}<br>
            <strong>Razón:</strong> ${r.recommendation?.reason}
          </div>`
        ).join(''),
        width: 600,
        confirmButtonText: 'Entendido'
      });

    } catch (error) {
      await Swal.fire({
        title: '❌ Error en Prueba',
        text: 'No se pudo ejecutar la prueba. Verifica la configuración.',
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-500" />
            <span>Análisis de Sentimiento con IA</span>
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Configura cómo la IA analiza los comentarios de los clientes y decide cuándo solicitar reseñas de Google
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={testConfiguration}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <Settings className="w-4 h-4" />
            <span>Probar Config</span>
          </Button>
          <Button
            variant="outline"
            onClick={resetToDefaults}
            className="flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restaurar</span>
          </Button>
          <Button
            onClick={saveConfiguration}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Guardar</span>
          </Button>
        </div>
      </div>

      {/* Configuración de Umbrales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span>Umbrales de Puntuación</span>
          </CardTitle>
          <CardDescription>
            Configura los umbrales que determinan cuándo solicitar reseñas de Google y cuándo escalar al gerente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Google Review Threshold */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Umbral para Reseña de Google: {config.googleReviewThreshold}/5
            </Label>
            <Slider
              value={[config.googleReviewThreshold]}
              onValueChange={([value]) => setConfig(prev => ({ ...prev, googleReviewThreshold: value }))}
              max={5}
              min={1}
              step={0.1}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Puntuación mínima para solicitar automáticamente una reseña de Google
            </p>
          </div>

          {/* Confidence Threshold */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Confianza Mínima: {config.googleReviewMinConfidence}%
            </Label>
            <Slider
              value={[config.googleReviewMinConfidence]}
              onValueChange={([value]) => setConfig(prev => ({ ...prev, googleReviewMinConfidence: value }))}
              max={100}
              min={50}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Nivel de confianza mínimo que debe tener la IA en su análisis
            </p>
          </div>

          {/* Manager Escalation Thresholds */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Escalamiento Normal: {config.managerEscalationThreshold}/5
              </Label>
              <Slider
                value={[config.managerEscalationThreshold]}
                onValueChange={([value]) => setConfig(prev => ({ ...prev, managerEscalationThreshold: value }))}
                max={4}
                min={1}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-gray-500">Puntuación para escalamiento estándar</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Escalamiento Urgente: {config.urgentEscalationThreshold}/5
              </Label>
              <Slider
                value={[config.urgentEscalationThreshold]}
                onValueChange={([value]) => setConfig(prev => ({ ...prev, urgentEscalationThreshold: value }))}
                max={3}
                min={1}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-gray-500">Puntuación para escalamiento urgente</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pesos por Categorías */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <span>Pesos por Categorías</span>
          </CardTitle>
          <CardDescription>
            Ajusta la importancia de cada categoría en el análisis final
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(config.categoryWeights).map(([category, weight]) => (
              <div key={category} className="space-y-2">
                <Label className="text-sm font-medium capitalize">
                  {category === 'food' ? 'Comida' : 
                   category === 'service' ? 'Servicio' :
                   category === 'ambiance' ? 'Ambiente' :
                   category === 'price' ? 'Precio' : 'Limpieza'}: {Math.round(weight * 100)}%
                </Label>
                <Slider
                  value={[weight * 100]}
                  onValueChange={([value]) => updateCategoryWeight(category as keyof ScoreConfiguration['categoryWeights'], value)}
                  max={50}
                  min={5}
                  step={1}
                  className="w-full"
                />
              </div>
            ))}
          </div>
          <Alert className="mt-4">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Pesos Totales</AlertTitle>
            <AlertDescription>
              Los pesos suman: {Math.round(Object.values(config.categoryWeights).reduce((a, b) => a + b, 0) * 100)}%. 
              Se recomienda que sumen cerca del 100% para un análisis balanceado.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Palabras Clave */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Palabras Clave Positivas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span>Palabras Clave Positivas</span>
            </CardTitle>
            <CardDescription>
              Palabras que automáticamente activan solicitud de reseña Google
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Agregar palabra positiva..."
                value={newPositiveKeyword}
                onChange={(e) => setNewPositiveKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addPositiveKeyword()}
              />
              <Button onClick={addPositiveKeyword} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {config.positiveKeywords.map((keyword, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-green-100 text-green-800 flex items-center space-x-1"
                >
                  <span>{keyword}</span>
                  <button
                    onClick={() => removePositiveKeyword(keyword)}
                    className="ml-1 hover:text-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Palabras Clave Negativas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <span>Palabras Clave Negativas</span>
            </CardTitle>
            <CardDescription>
              Palabras que automáticamente evitan solicitud de reseña Google
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Agregar palabra negativa..."
                value={newNegativeKeyword}
                onChange={(e) => setNewNegativeKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addNegativeKeyword()}
              />
              <Button onClick={addNegativeKeyword} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {config.negativeKeywords.map((keyword, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-red-100 text-red-800 flex items-center space-x-1"
                >
                  <span>{keyword}</span>
                  <button
                    onClick={() => removeNegativeKeyword(keyword)}
                    className="ml-1 hover:text-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuración de Respuestas */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Respuestas Automáticas</CardTitle>
          <CardDescription>
            Controla cómo y cuándo responde automáticamente el sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Habilitar Respuestas Automáticas</Label>
              <p className="text-xs text-gray-500">
                El sistema responderá automáticamente a los comentarios
              </p>
            </div>
            <Switch
              checked={config.enableAutoResponse}
              onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enableAutoResponse: checked }))}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Delay de Respuesta: {config.responseDelay} minutos
            </Label>
            <Slider
              value={[config.responseDelay]}
              onValueChange={([value]) => setConfig(prev => ({ ...prev, responseDelay: value }))}
              max={60}
              min={0}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Tiempo de espera antes de enviar la respuesta automática
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Información de Estado */}
      <Alert>
        <Brain className="h-4 w-4" />
        <AlertTitle>Estado del Sistema de IA</AlertTitle>
        <AlertDescription>
          El sistema analizará automáticamente todos los comentarios de clientes usando estos criterios. 
          Los cambios se aplicarán inmediatamente a nuevas evaluaciones.
        </AlertDescription>
      </Alert>
    </div>
  );
}

