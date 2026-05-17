// Implementación de base de datos para web usando localStorage
// Esto es una alternativa para cuando expo-sqlite no está disponible (web)

const DB_KEY = 'gym_db';

const getDB = () => {
  const data = localStorage.getItem(DB_KEY);
  if (data) {
    return JSON.parse(data);
  }
  return {
    admin: [],
    clientes: [],
    promociones: [],
    pagos: []
  };
};

const saveDB = (data) => {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
};

export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    try {
      let db = getDB();
      
      // Insertar admin por defecto si no existe
      if (!db.admin || db.admin.length === 0) {
        db.admin = [{ id: 1, username: 'admin', password: 'admin123' }];
      }
      
      // Insertar promociones por defecto si no existen
      if (!db.promociones || db.promociones.length === 0) {
        db.promociones = [
          { id: 1, nombre: 'Gym Mensual', descripcion: 'Acceso mensual al gimnasio', precio: 100, duracion: '1 mes', activo: 1 },
          { id: 2, nombre: 'Promocional 2 meses', descripcion: 'Promoción especial de 2 meses', precio: 150, duracion: '2 meses', activo: 1 },
          { id: 3, nombre: 'Por sesión', descripcion: 'Entrenamiento por sesión individual', precio: 10, duracion: '1 sesión', activo: 1 }
        ];
      }
      
      saveDB(db);
      console.log('Base de datos web inicializada correctamente');
      resolve();
    } catch (error) {
      console.error('Error al inicializar la base de datos web:', error);
      reject(error);
    }
  });
};

export const loginAdmin = (username, password) => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDB();
      const admin = db.admin.find(a => a.username === username && a.password === password);
      resolve(admin || null);
    } catch (error) {
      console.error('Error en login:', error);
      resolve(null);
    }
  });
};

export const insertCliente = (cliente) => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDB();
      const newId = db.clientes.length > 0 ? Math.max(...db.clientes.map(c => c.id)) + 1 : 1;
      
      const nuevoCliente = {
        ...cliente,
        id: newId,
        estado: 'activo',
        creado_en: new Date().toISOString()
      };
      
      db.clientes.push(nuevoCliente);
      
      // Registrar el pago
      const pagoId = db.pagos.length > 0 ? Math.max(...db.pagos.map(p => p.id)) + 1 : 1;
      db.pagos.push({
        id: pagoId,
        cliente_id: newId,
        monto: cliente.costo,
        fecha_pago: cliente.fecha_inscripcion,
        tipo_pago: cliente.tipo_inscripcion,
        promocion_id: null
      });
      
      saveDB(db);
      resolve({ insertId: newId });
    } catch (error) {
      console.error('Error al insertar cliente:', error);
      resolve(null);
    }
  });
};

export const getClientes = () => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDB();
      resolve(db.clientes.sort((a, b) => new Date(b.creado_en) - new Date(a.creado_en)));
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      resolve([]);
    }
  });
};

export const getClienteById = (id) => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDB();
      const cliente = db.clientes.find(c => c.id === id);
      resolve(cliente || null);
    } catch (error) {
      console.error('Error al obtener cliente:', error);
      resolve(null);
    }
  });
};

export const updateCliente = (id, cliente) => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDB();
      const index = db.clientes.findIndex(c => c.id === id);
      if (index !== -1) {
        db.clientes[index] = { ...db.clientes[index], ...cliente };
        saveDB(db);
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      resolve(false);
    }
  });
};

export const deleteCliente = (id) => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDB();
      db.pagos = db.pagos.filter(p => p.cliente_id !== id);
      db.clientes = db.clientes.filter(c => c.id !== id);
      saveDB(db);
      resolve(true);
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      resolve(false);
    }
  });
};

export const getPromociones = () => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDB();
      resolve(db.promociones.filter(p => p.activo === 1).sort((a, b) => a.id - b.id));
    } catch (error) {
      console.error('Error al obtener promociones:', error);
      resolve([]);
    }
  });
};

export const insertPromocion = (promocion) => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDB();
      const newId = db.promociones.length > 0 ? Math.max(...db.promociones.map(p => p.id)) + 1 : 1;
      
      const nuevaPromocion = {
        ...promocion,
        id: newId,
        activo: 1,
        creado_en: new Date().toISOString()
      };
      
      db.promociones.push(nuevaPromocion);
      saveDB(db);
      resolve({ insertId: newId });
    } catch (error) {
      console.error('Error al insertar promoción:', error);
      resolve(null);
    }
  });
};

export const updatePromocion = (id, promocion) => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDB();
      const index = db.promociones.findIndex(p => p.id === id);
      if (index !== -1) {
        db.promociones[index] = { ...db.promociones[index], ...promocion };
        saveDB(db);
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      console.error('Error al actualizar promoción:', error);
      resolve(false);
    }
  });
};

export const deletePromocion = (id) => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDB();
      const index = db.promociones.findIndex(p => p.id === id);
      if (index !== -1) {
        db.promociones[index].activo = 0;
        saveDB(db);
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      console.error('Error al eliminar promoción:', error);
      resolve(false);
    }
  });
};

export const getPagos = () => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDB();
      const pagosConNombres = db.pagos.map(pago => ({
        ...pago,
        cliente_nombre: db.clientes.find(c => c.id === pago.cliente_id)?.nombre || 'Desconocido'
      })).sort((a, b) => new Date(b.fecha_pago) - new Date(a.fecha_pago));
      resolve(pagosConNombres);
    } catch (error) {
      console.error('Error al obtener pagos:', error);
      resolve([]);
    }
  });
};

export const getClientesPorVencer = () => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDB();
      const hoy = new Date().toISOString().split('T')[0];
      const en7Dias = new Date();
      en7Dias.setDate(en7Dias.getDate() + 7);
      const fecha7Dias = en7Dias.toISOString().split('T')[0];
      
      const porVencer = db.clientes.filter(c => 
        c.estado === 'activo' && 
        c.fecha_finalizacion >= hoy && 
        c.fecha_finalizacion <= fecha7Dias
      ).sort((a, b) => new Date(a.fecha_finalizacion) - new Date(b.fecha_finalizacion));
      
      resolve(porVencer);
    } catch (error) {
      console.error('Error al obtener clientes por vencer:', error);
      resolve([]);
    }
  });
};

export const getClientesVencidos = () => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDB();
      const hoy = new Date().toISOString().split('T')[0];
      
      const vencidos = db.clientes.filter(c => 
        c.estado === 'activo' && 
        c.fecha_finalizacion < hoy
      ).sort((a, b) => new Date(a.fecha_finalizacion) - new Date(b.fecha_finalizacion));
      
      resolve(vencidos);
    } catch (error) {
      console.error('Error al obtener clientes vencidos:', error);
      resolve([]);
    }
  });
};

export const getTotalIngresos = () => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDB();
      const total = db.pagos.reduce((sum, pago) => sum + pago.monto, 0);
      resolve(total);
    } catch (error) {
      console.error('Error al obtener total ingresos:', error);
      resolve(0);
    }
  });
};

export const getIngresosPorMes = () => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDB();
      const ingresosPorMes = {};
      
      db.pagos.forEach(pago => {
        const mes = pago.fecha_pago.substring(0, 7); // YYYY-MM
        if (!ingresosPorMes[mes]) {
          ingresosPorMes[mes] = 0;
        }
        ingresosPorMes[mes] += pago.monto;
      });
      
      const resultado = Object.keys(ingresosPorMes)
        .map(mes => ({ mes, total: ingresosPorMes[mes] }))
        .sort((a, b) => b.mes.localeCompare(a.mes))
        .slice(0, 6);
      
      resolve(resultado);
    } catch (error) {
      console.error('Error al obtener ingresos por mes:', error);
      resolve([]);
    }
  });
};

export default null;
