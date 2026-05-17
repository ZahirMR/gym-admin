// Implementación de base de datos usando Firebase Firestore
import { db, auth } from './firebaseConfig';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  setDoc 
} from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';

export const initDatabase = async () => {
  try {
    // Verificar si el admin ya existe
    const adminDoc = await getDoc(doc(db, 'admin', 'default'));
    if (!adminDoc.exists()) {
      // Crear admin por defecto
      await setDoc(doc(db, 'admin', 'default'), {
        username: 'admin',
        password: 'admin123',
        rol: 'admin',
        creado_en: new Date().toISOString()
      });
    }

    // Verificar si las promociones ya existen
    const promocionesSnapshot = await getDocs(collection(db, 'promociones'));
    if (promocionesSnapshot.empty) {
      // Crear promociones por defecto
      await addDoc(collection(db, 'promociones'), {
        nombre: 'Gym Mensual',
        descripcion: 'Acceso mensual al gimnasio',
        precio: 100,
        duracion: '1 mes',
        activo: 1,
        creado_en: new Date().toISOString()
      });
      await addDoc(collection(db, 'promociones'), {
        nombre: 'Promocional 2 meses',
        descripcion: 'Promoción especial de 2 meses',
        precio: 150,
        duracion: '2 meses',
        activo: 1,
        creado_en: new Date().toISOString()
      });
      await addDoc(collection(db, 'promociones'), {
        nombre: 'Por sesión',
        descripcion: 'Entrenamiento por sesión individual',
        precio: 10,
        duracion: '1 sesión',
        activo: 1,
        creado_en: new Date().toISOString()
      });
    }

    // Verificar si los clientes ya existen
    const clientesSnapshot = await getDocs(collection(db, 'clientes'));
    if (clientesSnapshot.empty) {
      // Crear clientes iniciales
      const clientesIniciales = [
        { nombre: 'Jorge Gazoia Salazar', fecha_nacimiento: '25/03/1987', celular: '68923393', fecha_inscripcion: '12/05/26', fecha_finalizacion: '12/06/26', tipo_inscripcion: 'Mensual', costo: 100, estado: 'activo', creado_en: new Date().toISOString() },
        { nombre: 'Cintura Zurita', fecha_nacimiento: 'Sin Dato', celular: '75163525', fecha_inscripcion: '13/05/26', fecha_finalizacion: '13/06/26', tipo_inscripcion: 'Mensual Promocional', costo: 75, estado: 'activo', creado_en: new Date().toISOString() },
        { nombre: 'Elda Dorado', fecha_nacimiento: 'Sin Dato', celular: '67772450', fecha_inscripcion: '13/05/26', fecha_finalizacion: '13/06/26', tipo_inscripcion: 'Mensual promocional', costo: 75, estado: 'activo', creado_en: new Date().toISOString() },
        { nombre: 'Anabel Panozo', fecha_nacimiento: 'Sin Dato', celular: '68783684', fecha_inscripcion: '12/05/26', fecha_finalizacion: '12/05/26', tipo_inscripcion: 'secion', costo: 10, estado: 'activo', creado_en: new Date().toISOString() },
        { nombre: 'Angel Garzon', fecha_nacimiento: '13/01/2008', celular: '74753255', fecha_inscripcion: '20/02/26', fecha_finalizacion: '20/05/26', tipo_inscripcion: 'Promoción', costo: 250, estado: 'activo', creado_en: new Date().toISOString() },
        { nombre: 'Oscuro Velazco Alvarez', fecha_nacimiento: 'Sin dato', celular: 'Sin Dato', fecha_inscripcion: '13/05/26', fecha_finalizacion: '13/06/26', tipo_inscripcion: 'Mensual', costo: 100, estado: 'activo', creado_en: new Date().toISOString() },
        { nombre: 'Franco Sandoval', fecha_nacimiento: '02/02/2010', celular: '69024826', fecha_inscripcion: '28/04/26', fecha_finalizacion: '28/06/26', tipo_inscripcion: 'Promoción 2 meses', costo: 150, estado: 'activo', creado_en: new Date().toISOString() },
        { nombre: 'Bernardo Justiniano', fecha_nacimiento: '20/05/2003', celular: '78105313', fecha_inscripcion: '13/05/26', fecha_finalizacion: '13/05/26', tipo_inscripcion: 'secion', costo: 10, estado: 'activo', creado_en: new Date().toISOString() },
        { nombre: 'Ana Sanchez', fecha_nacimiento: 'Sin Dato', celular: '72820124', fecha_inscripcion: '19/03/26', fecha_finalizacion: '19/05/26', tipo_inscripcion: 'Promoción 2 meses', costo: 150, estado: 'activo', creado_en: new Date().toISOString() },
        { nombre: 'Michel', fecha_nacimiento: 'Sin Dato', celular: '69024826', fecha_inscripcion: '13/05/26', fecha_finalizacion: '13/07/26', tipo_inscripcion: 'Promoción 2 meses', costo: 150, estado: 'activo', creado_en: new Date().toISOString() },
        { nombre: 'Juliana Aragon', fecha_nacimiento: 'Sin dato', celular: '76642266', fecha_inscripcion: '20/04/26', fecha_finalizacion: '20/05/26', tipo_inscripcion: 'Promoción 2 meses', costo: 150, estado: 'activo', creado_en: new Date().toISOString() }
      ];

      for (const cliente of clientesIniciales) {
        const docRef = await addDoc(collection(db, 'clientes'), cliente);
        // Registrar el pago correspondiente
        await addDoc(collection(db, 'pagos'), {
          cliente_id: docRef.id,
          monto: cliente.costo,
          fecha_pago: cliente.fecha_inscripcion,
          tipo_pago: cliente.tipo_inscripcion,
          promocion_id: null
        });
      }
    }

    console.log('Base de datos Firebase inicializada correctamente');
  } catch (error) {
    console.error('Error al inicializar la base de datos Firebase:', error);
    throw error;
  }
};

export const loginAdmin = async (username, password) => {
  try {
    // Primero intentar con admin por defecto
    const adminDoc = await getDoc(doc(db, 'admin', 'default'));
    if (adminDoc.exists()) {
      const adminData = adminDoc.data();
      if (adminData.username === username && adminData.password === password) {
        return { id: 'default', ...adminData };
      }
    }
    
    // Si no es admin por defecto, buscar en trabajadores
    const q = query(collection(db, 'admin'), where('username', '==', username), where('password', '==', password));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    
    return null;
  } catch (error) {
    console.error('Error en login:', error);
    return null;
  }
};

// Funciones para trabajadores
export const insertTrabajador = async (trabajador) => {
  try {
    const docRef = await addDoc(collection(db, 'admin'), {
      ...trabajador,
      rol: 'trabajador',
      creado_en: new Date().toISOString()
    });
    return { insertId: docRef.id };
  } catch (error) {
    console.error('Error al insertar trabajador:', error);
    return null;
  }
};

export const getTrabajadores = async () => {
  try {
    const q = query(collection(db, 'admin'), where('rol', '==', 'trabajador'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error al obtener trabajadores:', error);
    return [];
  }
};

export const updateTrabajador = async (id, trabajador) => {
  try {
    const docRef = doc(db, 'admin', id);
    await updateDoc(docRef, trabajador);
    return true;
  } catch (error) {
    console.error('Error al actualizar trabajador:', error);
    return false;
  }
};

export const deleteTrabajador = async (id) => {
  try {
    await deleteDoc(doc(db, 'admin', id));
    return true;
  } catch (error) {
    console.error('Error al eliminar trabajador:', error);
    return false;
  }
};

export const insertCliente = async (cliente) => {
  try {
    const docRef = await addDoc(collection(db, 'clientes'), {
      ...cliente,
      estado: 'activo',
      creado_en: new Date().toISOString()
    });

    // Registrar el pago
    await addDoc(collection(db, 'pagos'), {
      cliente_id: docRef.id,
      monto: cliente.costo,
      fecha_pago: cliente.fecha_inscripcion,
      tipo_pago: cliente.tipo_inscripcion,
      promocion_id: null
    });

    return { insertId: docRef.id };
  } catch (error) {
    console.error('Error al insertar cliente:', error);
    return null;
  }
};

export const getClientes = async () => {
  try {
    const q = query(collection(db, 'clientes'), orderBy('creado_en', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    return [];
  }
};

export const getClienteById = async (id) => {
  try {
    const docRef = doc(db, 'clientes', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    return null;
  }
};

export const updateCliente = async (id, cliente) => {
  try {
    const docRef = doc(db, 'clientes', id);
    await updateDoc(docRef, cliente);
    return true;
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    return false;
  }
};

export const deleteCliente = async (id) => {
  try {
    // Eliminar pagos asociados
    const pagosQuery = query(collection(db, 'pagos'), where('cliente_id', '==', id));
    const pagosSnapshot = await getDocs(pagosQuery);
    pagosSnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    // Eliminar cliente
    await deleteDoc(doc(db, 'clientes', id));
    return true;
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    return false;
  }
};

export const getPromociones = async () => {
  try {
    const q = query(collection(db, 'promociones'), where('activo', '==', 1));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error al obtener promociones:', error);
    return [];
  }
};

export const insertPromocion = async (promocion) => {
  try {
    const docRef = await addDoc(collection(db, 'promociones'), {
      ...promocion,
      activo: 1,
      creado_en: new Date().toISOString()
    });
    return { insertId: docRef.id };
  } catch (error) {
    console.error('Error al insertar promoción:', error);
    return null;
  }
};

export const updatePromocion = async (id, promocion) => {
  try {
    const docRef = doc(db, 'promociones', id);
    await updateDoc(docRef, promocion);
    return true;
  } catch (error) {
    console.error('Error al actualizar promoción:', error);
    return false;
  }
};

export const deletePromocion = async (id) => {
  try {
    const docRef = doc(db, 'promociones', id);
    await updateDoc(docRef, { activo: 0 });
    return true;
  } catch (error) {
    console.error('Error al eliminar promoción:', error);
    return false;
  }
};

export const getPagos = async () => {
  try {
    const q = query(collection(db, 'pagos'), orderBy('fecha_pago', 'desc'));
    const snapshot = await getDocs(q);
    const pagos = [];
    
    for (const doc of snapshot.docs) {
      const pagoData = doc.data();
      const clienteDoc = await getDoc(doc(db, 'clientes', pagoData.cliente_id));
      const clienteNombre = clienteDoc.exists() ? clienteDoc.data().nombre : 'Desconocido';
      pagos.push({
        id: doc.id,
        ...pagoData,
        cliente_nombre: clienteNombre
      });
    }
    
    return pagos;
  } catch (error) {
    console.error('Error al obtener pagos:', error);
    return [];
  }
};

export const getClientesPorVencer = async () => {
  try {
    const hoy = new Date().toISOString().split('T')[0];
    const en5Dias = new Date();
    en5Dias.setDate(en5Dias.getDate() + 5);
    const fecha5Dias = en5Dias.toISOString().split('T')[0];

    const q = query(
      collection(db, 'clientes'),
      where('estado', '==', 'activo'),
      where('fecha_finalizacion', '>=', hoy),
      where('fecha_finalizacion', '<=', fecha5Dias),
      orderBy('fecha_finalizacion', 'asc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error al obtener clientes por vencer:', error);
    return [];
  }
};

export const getClientesVencidos = async () => {
  try {
    const hoy = new Date().toISOString().split('T')[0];

    const q = query(
      collection(db, 'clientes'),
      where('estado', '==', 'activo'),
      where('fecha_finalizacion', '<', hoy),
      orderBy('fecha_finalizacion', 'asc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error al obtener clientes vencidos:', error);
    return [];
  }
};

export const getTotalIngresos = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'pagos'));
    let total = 0;
    snapshot.forEach(doc => {
      total += doc.data().monto;
    });
    return total;
  } catch (error) {
    console.error('Error al obtener total ingresos:', error);
    return 0;
  }
};

export const getIngresosPorMes = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'pagos'));
    const ingresosPorMes = {};
    
    snapshot.forEach(doc => {
      const pago = doc.data();
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
    
    return resultado;
  } catch (error) {
    console.error('Error al obtener ingresos por mes:', error);
    return [];
  }
};

// Funciones para gastos
export const insertGasto = async (gasto) => {
  try {
    const docRef = await addDoc(collection(db, 'gastos'), {
      ...gasto,
      creado_en: new Date().toISOString()
    });
    return { insertId: docRef.id };
  } catch (error) {
    console.error('Error al insertar gasto:', error);
    return null;
  }
};

export const getGastos = async () => {
  try {
    const q = query(collection(db, 'gastos'), orderBy('fecha', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error al obtener gastos:', error);
    return [];
  }
};

export const updateGasto = async (id, gasto) => {
  try {
    const docRef = doc(db, 'gastos', id);
    await updateDoc(docRef, gasto);
    return true;
  } catch (error) {
    console.error('Error al actualizar gasto:', error);
    return false;
  }
};

export const deleteGasto = async (id) => {
  try {
    await deleteDoc(doc(db, 'gastos', id));
    return true;
  } catch (error) {
    console.error('Error al eliminar gasto:', error);
    return false;
  }
};

export const getTotalGastos = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'gastos'));
    let total = 0;
    snapshot.forEach(doc => {
      total += doc.data().monto;
    });
    return total;
  } catch (error) {
    console.error('Error al obtener total gastos:', error);
    return 0;
  }
};

export const getGastosPorMes = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'gastos'));
    const gastosPorMes = {};
    
    snapshot.forEach(doc => {
      const gasto = doc.data();
      const mes = gasto.fecha.substring(0, 7); // YYYY-MM
      if (!gastosPorMes[mes]) {
        gastosPorMes[mes] = 0;
      }
      gastosPorMes[mes] += gasto.monto;
    });
    
    const resultado = Object.keys(gastosPorMes)
      .map(mes => ({ mes, total: gastosPorMes[mes] }))
      .sort((a, b) => b.mes.localeCompare(a.mes))
      .slice(0, 6);
    
    return resultado;
  } catch (error) {
    console.error('Error al obtener gastos por mes:', error);
    return [];
  }
};

export default null;
