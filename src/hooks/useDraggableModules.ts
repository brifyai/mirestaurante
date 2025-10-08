
'use client';

import { useState, useEffect, useCallback } from 'react';

export interface DraggableModule {
  id: string;
  title: string;
  component: React.ReactNode;
  order: number;
}

export function useDraggableModules(initialModules: DraggableModule[]) {
  const [modules, setModules] = useState<DraggableModule[]>(initialModules);
  const [draggedOver, setDraggedOver] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<string | null>(null);

  // Cargar orden guardado del localStorage
  useEffect(() => {
    const savedOrder = localStorage.getItem('dashboard-modules-order');
    if (savedOrder) {
      try {
        const orderMap: Record<string, number> = JSON.parse(savedOrder);
        const sortedModules = [...initialModules].sort((a, b) => {
          const orderA = orderMap[a.id] !== undefined ? orderMap[a.id] : a.order;
          const orderB = orderMap[b.id] !== undefined ? orderMap[b.id] : b.order;
          return orderA - orderB;
        });
        setModules(sortedModules);
      } catch (error) {
        console.error('Error loading saved module order:', error);
        setModules(initialModules);
      }
    }
  }, [initialModules]);

  // Guardar orden en localStorage
  const saveOrder = useCallback((newModules: DraggableModule[]) => {
    const orderMap: Record<string, number> = {};
    newModules.forEach((module, index) => {
      orderMap[module.id] = index;
    });
    localStorage.setItem('dashboard-modules-order', JSON.stringify(orderMap));
  }, []);

  const handleDragStart = useCallback((e: React.DragEvent, moduleId: string) => {
    setIsDragging(moduleId);
    e.dataTransfer.setData('text/plain', moduleId);
    e.dataTransfer.effectAllowed = 'move';
    
    // Crear imagen personalizada para el drag
    const dragImage = document.createElement('div');
    dragImage.innerHTML = `
      <div style="
        padding: 12px 20px; 
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
        color: white; 
        border-radius: 8px; 
        font-weight: 600;
        font-size: 14px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        transform: rotate(-2deg);
      ">
        📦 ${modules.find(m => m.id === moduleId)?.title || 'Módulo'}
      </div>
    `;
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  }, [modules]);

  const handleDragOver = useCallback((e: React.DragEvent, moduleId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDraggedOver(moduleId);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDraggedOver(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    
    if (draggedId && draggedId !== targetId) {
      const newModules = [...modules];
      const draggedIndex = newModules.findIndex(m => m.id === draggedId);
      const targetIndex = newModules.findIndex(m => m.id === targetId);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        // Intercambiar posiciones
        const draggedModule = newModules[draggedIndex];
        newModules.splice(draggedIndex, 1);
        newModules.splice(targetIndex, 0, draggedModule);
        
        setModules(newModules);
        saveOrder(newModules);
      }
    }
    
    setDraggedOver(null);
    setIsDragging(null);
  }, [modules, saveOrder]);

  const handleDragEnd = useCallback(() => {
    setDraggedOver(null);
    setIsDragging(null);
  }, []);

  const resetOrder = useCallback(() => {
    const resetModules = [...initialModules].sort((a, b) => a.order - b.order);
    setModules(resetModules);
    localStorage.removeItem('dashboard-modules-order');
  }, [initialModules]);

  return {
    modules,
    draggedOver,
    isDragging,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    resetOrder
  };
}
