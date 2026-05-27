import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getPagos, getTotalIngresos, getIngresosPorMes, getTotalGastos, getTotalGanancias } from '../database/database';

const ReportesScreen = ({ route }) => {
  const { user } = route.params || {};
  const isAdmin = true; // Siempre mostrar reportes para admin
  
  const [pagos, setPagos] = useState([]);
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [ingresosPorMes, setIngresosPorMes] = useState([]);
  const [totalGastos, setTotalGastos] = useState(0);
  const [porcentajeSocio, setPorcentajeSocio] = useState(0);
  const [gananciaNeta, setGananciaNeta] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      console.log('Cargando datos de reportes...');
      console.log('User:', user);
      console.log('IsAdmin:', isAdmin);
      
      const pagosData = await getPagos();
      console.log('Pagos:', pagosData.length);
      
      const total = await getTotalIngresos();
      console.log('Total Ingresos:', total);
      
      const gananciasAdicionales = await getTotalGanancias();
      console.log('Ganancias adicionales:', gananciasAdicionales);
      
      const totalConGanancias = total + gananciasAdicionales;
      console.log('Total con ganancias:', totalConGanancias);
      
      const mensual = await getIngresosPorMes();
      console.log('Ingresos por mes:', mensual.length);
      
      const gastos = await getTotalGastos();
      console.log('Total Gastos:', gastos);
      
      // Calcular 10% solo para inscripciones mensuales (100Bs, 150Bs), no para sesiones de 10Bs
      const pagosMensuales = pagosData.filter(pago => 
        pago.tipo_pago && !pago.tipo_pago.toLowerCase().includes('sesión') && pago.monto >= 100
      );
      const totalMensual = pagosMensuales.reduce((sum, pago) => sum + pago.monto, 0);
      const socio = totalMensual * 0.10; // 10% solo para inscripciones mensuales
      const ganancia = totalConGanancias - socio - gastos; // Ganancia neta con ganancias adicionales
      
      setPagos(pagosData);
      setTotalIngresos(totalConGanancias);
      setIngresosPorMes(mensual);
      setTotalGastos(gastos);
      setPorcentajeSocio(socio);
      setGananciaNeta(ganancia);
      
      console.log('Datos de reportes cargados correctamente');
    } catch (error) {
      console.error('Error al cargar datos de reportes:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reportes e Ingresos</Text>
      </View>

      {isAdmin && (
        <>
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
        </>
      )}

      {isAdmin && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingresos por Mes</Text>
          {ingresosPorMes.map((item, index) => (
            <View key={index} style={styles.monthCard}>
              <Text style={styles.monthLabel}>{item.mes}</Text>
              <Text style={styles.monthAmount}>{item.total.toFixed(2)} Bs</Text>
            </View>
          ))}
          {ingresosPorMes.length === 0 && (
            <Text style={styles.emptyText}>No hay datos de ingresos por mes</Text>
          )}
        </View>
      )}

      {!isAdmin && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ventas de Productos</Text>
          <Text style={styles.emptyText}>No tienes acceso a información de ingresos</Text>
        </View>
      )}

      {isAdmin && (
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
      )}
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
