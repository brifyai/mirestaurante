import React from 'react';
import Swal from 'sweetalert2';

interface MensajePopupProps {
  cliente: {
    nombre: string;
    telefono: string;
    email: string;
  };
  onEnviar: (mensaje: string) => Promise<void>;
}

export default function MensajePopup({ cliente, onEnviar }: MensajePopupProps) {
  const mostrarPopup = async () => {
    const { value: mensaje } = await Swal.fire({
      title: `Enviar Mensaje a ${cliente.nombre}`,
      html: `
        <div class="text-left space-y-4">
          <div class="bg-gray-50 p-3 rounded">
            <p class="text-sm"><strong>Cliente:</strong> ${cliente.nombre}</p>
            <p class="text-sm"><strong>Teléfono:</strong> ${cliente.telefono}</p>
            <p class="text-sm"><strong>Email:</strong> ${cliente.email}</p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Mensaje</label>
            <textarea id="mensaje" class="swal2-textarea" style="min-height: 120px; resize: vertical; border: 1px solid #d1d5db; border-radius: 0.375rem; padding: 0.5rem; font-size: 0.875rem; line-height: 1.25rem;" placeholder="Escribe tu mensaje aquí..."></textarea>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <button type="button" class="swal2-styled swal2-default-outline" style="display: inline-block; background-color: rgba(0,0,0,0); color: #313131; border: 1px solid rgba(0,0,0,0.2); border-radius: 0.25rem; padding: 0.375rem 0.75rem; font-size: 0.875rem; line-height: 1.5rem; text-align: center; cursor: pointer;" onclick="document.getElementById('mensaje').value = '¡Hola! Tenemos una promoción especial para ti.'">Promoción</button>
            <button type="button" class="swal2-styled swal2-default-outline" style="display: inline-block; background-color: rgba(0,0,0,0); color: #313131; border: 1px solid rgba(0,0,0,0.2); border-radius: 0.25rem; padding: 0.375rem 0.75rem; font-size: 0.875rem; line-height: 1.5rem; text-align: center; cursor: pointer;" onclick="document.getElementById('mensaje').value = 'Recordatorio: Tienes una reserva confirmada.'">Recordatorio</button>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Enviar Mensaje',
      cancelButtonText: 'Cancelar',
      width: 600,
      preConfirm: () => {
        const mensaje = (document.getElementById('mensaje') as HTMLTextAreaElement)?.value;
        if (!mensaje) {
          Swal.showValidationMessage('Por favor escribe un mensaje');
          return false;
        }
        return mensaje;
      }
    });

    if (mensaje) {
      await onEnviar(mensaje);
      await Swal.fire({
        title: '¡Mensaje Enviado!',
        text: `Mensaje enviado exitosamente a ${cliente.nombre}`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  return (
    <button
      onClick={mostrarPopup}
      className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-md flex items-center gap-2 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      Mensaje
    </button>
  );
}