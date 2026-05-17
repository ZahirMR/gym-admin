import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getPagos, getTotalIngresos, getIngresosPorMes, getTotalGastos } from '../database/database';

const ReportesScreen = () => {
  const [pagos, setPagos] = useState([]);
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [ingresosPorMes, setIngresosPorMes] = useState([]);
  const [totalGastos, setTotalGastos] = useState(0);
  const [porcentajeSocio, setPorcentajeSocio] = useState(0);
  const [gananciaNeta, setGananciaNeta] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const pagosData = await getPagos();
    const total = await getTotalIngresos();
    const mensual = await getIngresosPorMes();
    const gastos = await getTotalGastos();
    
    const socio = total * 0.10; // 10% para socio
    const ganancia = total - socio - gastos; // Ganancia neta
    
    setPagos(pagosData);
    setTotalIngresos(total);
    setIngresosPorMes(mensual);
    setTotalGastos(gastos);
    setPorcentajeSocio(socio);
    setGananciaNeta(ganancia);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reportes e Ingresos</Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total de Ingresos</Text>
        <Text style={styles.summaryAmount}>{totalIngresos.toFixed(2)} Bs</Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>10% para Socio</Text>
        <Text style={styles.summaryAmountWarning}>{porcentajeSocio.toFixed(2)} Bs</Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total de Gastos</Text>
        <Text style={styles.summaryAmountDanger}>{totalGastos.toFixed(2)} Bs</Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Ganancia Neta</Text>
        <Text style={styles.summaryAmountSuccess}>{gananciaNeta.toFixed(2)} Bs</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingresos por Mes</Text>
        {ingresosPorMes.map((item, index) => (
          <View key={index} style={styles.monthCard}>
            <Text style={styles.monthLabel}>{item.mes}</Text>
            <Text style={styles.monthAmount}>{item.total.toFixed(2)} Bs</Text>
          </View>
        ))}
        {ingresosPorMes.length === 0 && (
          <Text style={styles.emptyText}>No hay datos de ingresos</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Historial de Pagos</Text>
        {pagos.map((pago) => (
          <View key={pago.id} style={styles.pagoCard}>
            <View style={styles.pagoInfo}>
              <Text style={styles.pagoCliente}>{pago.cliente_nombre}</Text>
              <Text style={styles.pagoTipo}>{pago.tipo_pago}</Text>
              <Text style={styles.pagoFecha}>{pago.fecha_pago}</Text>
            </View>
            <Text style={styles.pagoMonto}>{pago.monto.toFixed(2)} Bs</Text>
          </View>
        ))}
        {pagos.length === 0 && (
          <Text style={styles.emptyText}>No hay pagos registrados</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    padding: 20,
    backgroundColor: '#16213e',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: '#16213e',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#888',
    fontSize: 16,
  },
  summaryAmount: {
    color: '#e94560',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 10,
  },
  summaryAmountWarning: {
    color: '#f59e0b',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 10,
  },
  summaryAmountDanger: {
    color: '#ef4444',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 10,
  },
  summaryAmountSuccess: {
    color: '#4ade80',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 10,
  },
  section: {
    margin: 15,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  monthCard: {
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthLabel: {
    color: '#fff',
    fontSize: 16,
  },
  monthAmount: {
    color: '#e94560',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pagoCard: {
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pagoInfo: {
    flex: 1,
  },
  pagoCliente: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  pagoTipo: {
    color: '#888',
    fontSize: 14,
    marginBottom: 3,
  },
  pagoFecha: {
    color: '#666',
    fontSize: 12,
  },
  pagoMonto: {
    color: '#4ade80',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
  },
});

export default ReportesScreen;
