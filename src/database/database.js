// Importar implementación de Firebase (base de datos en la nube)
import * as firebaseDb from './firebaseDatabase';

// Usar Firebase como implementación principal para producción
export const initDatabase = () => firebaseDb.initDatabase();
export const loginAdmin = (username, password) => firebaseDb.loginAdmin(username, password);
export const insertCliente = (cliente) => firebaseDb.insertCliente(cliente);
export const getClientes = () => firebaseDb.getClientes();
export const getClienteById = (id) => firebaseDb.getClienteById(id);
export const updateCliente = (id, cliente) => firebaseDb.updateCliente(id, cliente);
export const deleteCliente = (id) => firebaseDb.deleteCliente(id);
export const getPromociones = () => firebaseDb.getPromociones();
export const insertPromocion = (promocion) => firebaseDb.insertPromocion(promocion);
export const updatePromocion = (id, promocion) => firebaseDb.updatePromocion(id, promocion);
export const deletePromocion = (id) => firebaseDb.deletePromocion(id);
export const getPagos = () => firebaseDb.getPagos();
export const getClientesPorVencer = () => firebaseDb.getClientesPorVencer();
export const getClientesVencidos = () => firebaseDb.getClientesVencidos();
export const getTotalIngresos = () => firebaseDb.getTotalIngresos();
export const getIngresosPorMes = () => firebaseDb.getIngresosPorMes();
export const insertGasto = (gasto) => firebaseDb.insertGasto(gasto);
export const getGastos = () => firebaseDb.getGastos();
export const updateGasto = (id, gasto) => firebaseDb.updateGasto(id, gasto);
export const deleteGasto = (id) => firebaseDb.deleteGasto(id);
export const getTotalGastos = () => firebaseDb.getTotalGastos();
export const getGastosPorMes = () => firebaseDb.getGastosPorMes();
export const insertTrabajador = (trabajador) => firebaseDb.insertTrabajador(trabajador);
export const getTrabajadores = () => firebaseDb.getTrabajadores();
export const updateTrabajador = (id, trabajador) => firebaseDb.updateTrabajador(id, trabajador);
export const deleteTrabajador = (id) => firebaseDb.deleteTrabajador(id);

export default null;
