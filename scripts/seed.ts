
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Sembrando base de datos...');

  // Crear permisos del sistema
  const permissions = [
    { name: 'view_dashboard', displayName: 'Ver Panel Principal', category: 'panel_principal', description: 'Acceso al panel principal del sistema' },
    { name: 'view_reservations', displayName: 'Ver Reservas', category: 'reservas', description: 'Ver lista de reservas' },
    { name: 'manage_reservations', displayName: 'Gestionar Reservas', category: 'reservas', description: 'Crear, editar y cancelar reservas' },
    { name: 'view_reports', displayName: 'Ver Reportes', category: 'reportes', description: 'Acceso a reportes y estadísticas' },
    { name: 'export_reports', displayName: 'Exportar Reportes', category: 'reportes', description: 'Descargar reportes en PDF/Excel' },
    { name: 'view_campaigns', displayName: 'Ver Campañas', category: 'campañas', description: 'Ver campañas de marketing' },
    { name: 'manage_campaigns', displayName: 'Gestionar Campañas', category: 'campañas', description: 'Crear y editar campañas' },
    { name: 'view_qr', displayName: 'Ver Códigos QR', category: 'qr_mesas', description: 'Ver códigos QR y portales de mesas' },
    { name: 'manage_qr', displayName: 'Gestionar Códigos QR', category: 'qr_mesas', description: 'Editar configuración de códigos QR' },
    { name: 'view_inbox', displayName: 'Ver Bandeja de Mensajes', category: 'mensajería', description: 'Ver mensajes de WhatsApp/Instagram' },
    { name: 'manage_inbox', displayName: 'Gestionar Mensajes', category: 'mensajería', description: 'Responder y administrar mensajes' },
    { name: 'view_configuration', displayName: 'Ver Configuración', category: 'configuración', description: 'Ver configuración del sistema' },
    { name: 'manage_configuration', displayName: 'Gestionar Configuración', category: 'configuración', description: 'Editar configuración del sistema' },
    { name: 'manage_users', displayName: 'Gestionar Usuarios', category: 'usuarios', description: 'Crear, editar y eliminar usuarios' },
    { name: 'manage_permissions', displayName: 'Gestionar Permisos', category: 'usuarios', description: 'Asignar permisos a usuarios' },
  ];

  for (const permission of permissions) {
    await prisma.systemPermission.upsert({
      where: { name: permission.name },
      update: {},
      create: permission,
    });
  }

  console.log(`🔐 ${permissions.length} permisos del sistema creados`);

  // Crear Super Admin (Paul)
  // Using plain text password for development
  const superAdmin = await prisma.user.upsert({
    where: { email: 'paul@jaraquemada.com' },
    update: { role: 'SUPER_ADMIN' },
    create: {
      email: 'paul@jaraquemada.com',
      name: 'Paul Rodriguez',
      password: 'johndoe123',
      role: 'SUPER_ADMIN',
    },
  });

  console.log('👤 Super Admin creado:', superAdmin.name);

  // Crear Admin de prueba
  const hashedPasswordManager = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@restaurant.com' },
    update: { role: 'ADMIN' },
    create: {
      email: 'admin@restaurant.com',
      name: 'Maria Garcia',
      password: hashedPasswordManager,
      role: 'ADMIN',
      createdBy: superAdmin.id,
    },
  });

  console.log('👤 Admin creado:', admin.name);

  // Crear Usuario básico de prueba
  const hashedPasswordUser = await bcrypt.hash('user123', 12);
  
  const basicUser = await prisma.user.upsert({
    where: { email: 'user@restaurant.com' },
    update: { role: 'USER' },
    create: {
      email: 'user@restaurant.com',
      name: 'Carlos Mendez',
      password: hashedPasswordUser,
      role: 'USER',
      createdBy: superAdmin.id,
    },
  });

  console.log('👤 Usuario básico creado:', basicUser.name);

  // Asignar permisos limitados al Admin
  const adminPermissions = ['view_dashboard', 'view_reservations', 'manage_reservations', 'view_reports', 'view_campaigns', 'view_qr', 'view_inbox', 'manage_inbox'];
  for (const permissionName of adminPermissions) {
    const permission = await prisma.systemPermission.findUnique({ where: { name: permissionName } });
    if (permission) {
      await prisma.userPermission.upsert({
        where: { userId_permissionId: { userId: admin.id, permissionId: permission.id } },
        update: {},
        create: {
          userId: admin.id,
          permissionId: permission.id,
          granted: true,
          grantedBy: superAdmin.id,
        },
      });
    }
  }

  // Asignar permisos básicos al Usuario
  const userPermissions = ['view_dashboard', 'view_reservations', 'view_qr'];
  for (const permissionName of userPermissions) {
    const permission = await prisma.systemPermission.findUnique({ where: { name: permissionName } });
    if (permission) {
      await prisma.userPermission.upsert({
        where: { userId_permissionId: { userId: basicUser.id, permissionId: permission.id } },
        update: {},
        create: {
          userId: basicUser.id,
          permissionId: permission.id,
          granted: true,
          grantedBy: superAdmin.id,
        },
      });
    }
  }

  console.log('🔐 Permisos asignados a usuarios');

  // Crear restaurante
  const restaurant = await prisma.restaurant.upsert({
    where: { slug: 'jaraquemada' },
    update: {},
    create: {
      name: 'Jaraquemada',
      slug: 'jaraquemada',
      template: 'restaurant1',
      primaryColor: '#8B5CF6',
      secondaryColor: '#A855F7',
      description: 'Auténtica comida tradicional',
      address: 'Calle Principal 123, Centro',
      phone: '+34 912 345 678',
      email: 'info@jaraquemada.com',
      userId: superAdmin.id,
    },
  });

  console.log('🏪 Restaurante creado:', restaurant.name);

  // Crear configuración QR
  await prisma.qRConfiguration.upsert({
    where: { restaurantId: restaurant.id },
    update: {},
    create: {
      restaurantId: restaurant.id,
      primaryButtonText: 'Ver Menú',
      primaryButtonUrl: 'https://jaraquemada.com/menu',
      primaryButtonColor: '#8B5CF6',
      secondaryButtonText: 'Hacer Reserva',
      secondaryButtonUrl: 'https://jaraquemada.com/reserva',
      secondaryButtonColor: '#A855F7',
      tertiaryButtonText: 'Contactar',
      tertiaryButtonUrl: 'https://jaraquemada.com/contacto',
      tertiaryButtonColor: '#6366F1',
      captureLeadsEnabled: true,
      welcomeMessage: '¡Bienvenido a Jaraquemada!',
    },
  });

  console.log('🔗 Configuración QR creada');

  // Crear reservas de ejemplo
  const reservationsData = [
    {
      guestName: 'Ana García',
      guestEmail: 'ana@example.com',
      guestPhone: '+34 666 111 222',
      tableNumber: '5',
      covers: 2,
      date: new Date('2024-09-02'),
      time: '20:30',
      status: 'CONFIRMED' as const,
    },
    {
      guestName: 'Carlos Ruiz',
      guestEmail: 'carlos@example.com',
      guestPhone: '+34 666 333 444',
      tableNumber: '8',
      covers: 4,
      date: new Date('2024-09-02'),
      time: '21:00',
      status: 'CONFIRMED' as const,
    },
    {
      guestName: 'María López',
      guestEmail: 'maria@example.com',
      guestPhone: '+34 666 555 666',
      tableNumber: '12',
      covers: 3,
      date: new Date('2024-09-03'),
      time: '19:30',
      status: 'PENDING' as const,
    },
    {
      guestName: 'Juan Martín',
      guestEmail: 'juan@example.com',
      guestPhone: '+34 666 777 888',
      tableNumber: '3',
      covers: 6,
      date: new Date('2024-09-03'),
      time: '20:00',
      status: 'CONFIRMED' as const,
    },
    {
      guestName: 'Laura Sánchez',
      guestEmail: 'laura@example.com',
      guestPhone: '+34 666 999 000',
      tableNumber: '15',
      covers: 2,
      date: new Date('2024-09-04'),
      time: '21:30',
      status: 'CONFIRMED' as const,
    },
    {
      guestName: 'Pedro Gómez',
      guestEmail: 'pedro@example.com',
      guestPhone: '+34 666 111 333',
      tableNumber: '7',
      covers: 4,
      date: new Date('2024-09-01'),
      time: '19:00',
      status: 'COMPLETED' as const,
    },
    {
      guestName: 'Isabel Torres',
      guestEmail: 'isabel@example.com',
      guestPhone: '+34 666 222 444',
      tableNumber: '10',
      covers: 8,
      date: new Date('2024-09-05'),
      time: '20:30',
      status: 'CANCELLED' as const,
    },
  ];

  for (const reservationData of reservationsData) {
    await prisma.reservation.create({
      data: {
        ...reservationData,
        restaurantId: restaurant.id,
      },
    });
  }

  console.log(`📅 ${reservationsData.length} reservas creadas`);

  // Crear estadísticas QR de ejemplo
  const today = new Date();
  for (let i = 0; i < 50; i++) {
    const randomDate = new Date(today.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    await prisma.qRScan.create({
      data: {
        restaurantId: restaurant.id,
        scannedAt: randomDate,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        location: 'Madrid, España',
      },
    });
  }

  console.log('📊 50 escaneos QR creados');

  console.log('✅ Base de datos sembrada exitosamente');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
