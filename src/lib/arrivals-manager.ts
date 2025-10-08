
// Sistema global para manejar llegadas de clientes
let llegadasGlobales: Array<{
  guestName: string;
  tableNumber: string;
  arrivedAt: string;
  type: 'manual' | 'automatic';
  reservationId?: string;
}> = [];

// Callbacks para notificar cambios
let callbacks: Array<(llegadas: typeof llegadasGlobales) => void> = [];

export const ArrivalsManager = {
  // Registrar una llegada
  addArrival: (arrival: {
    guestName: string;
    tableNumber: string;
    type: 'manual' | 'automatic';
    reservationId?: string;
  }) => {
    const newArrival = {
      ...arrival,
      arrivedAt: new Date().toISOString()
    };
    
    llegadasGlobales.push(newArrival);
    
    // Notificar a todos los callbacks
    callbacks.forEach(callback => callback([...llegadasGlobales]));
    
    console.log(`✅ Llegada registrada: ${arrival.guestName} - Mesa ${arrival.tableNumber} (${arrival.type})`);
  },

  // Obtener todas las llegadas
  getArrivals: () => [...llegadasGlobales],

  // Limpiar llegadas
  clearArrivals: () => {
    llegadasGlobales = [];
    callbacks.forEach(callback => callback([]));
  },

  // Suscribirse a cambios
  subscribe: (callback: (llegadas: typeof llegadasGlobales) => void) => {
    callbacks.push(callback);
    
    // Retornar función para desuscribirse
    return () => {
      callbacks = callbacks.filter(cb => cb !== callback);
    };
  },

  // Obtener llegadas de hoy
  getTodayArrivals: () => {
    const today = new Date().toISOString().split('T')[0];
    return llegadasGlobales.filter(arrival => 
      arrival.arrivedAt.startsWith(today)
    );
  }
};
