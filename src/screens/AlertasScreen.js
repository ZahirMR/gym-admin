import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { getClientesPorVencer, getClientesVencidos, updateCliente } from '../database/database';

const AlertasScreen = () => {
  const [porVencer, setPorVencer] = useState([]);
  const [vencidos, setVencidos] = useState([]);

  useEffect(() => {
    loadAlertas();
  }, []);

  const loadAlertas = async () => {
    const vencer = await getClientesPorVencer();
    const vencido = await getClientesVencidos();
    setPorVencer(vencer);
    setVencidos(vencido);
  };

  const handleRenovar = async (cliente) => {
    Alert.alert(
      'Renovar Membresía',
      `¿Deseas renovar la membresía de ${cliente.nombre}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Renovar',
          onPress: async () => {
            const fechaFin = new Date();
            fechaFin.setMonth(fechaFin.getMonth() + 1);
            await updateCliente(cliente.id, {
              ...cliente,
              fecha_finalizacion: fechaFin.toISOString().split('T')[0],
            });
            loadAlertas();
          },
        },
      ]
    );
  };

  const handleDesactivar = async (cliente) => {
    Alert.alert(
      'Desactivar Cliente',
      `¿Deseas desactivar a ${cliente.nombre}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desactivar',
          style: 'destructive',
          onPress: async () => {
            await updateCliente(cliente.id, {
              ...cliente,
              estado: 'inactivo',
            });
            loadAlertas();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Alertas</Text>
        <Text style={styles.subtitle}>Gestión de Membresías</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Por Vencer ({porVencer.length})
        </Text>
        {porVencer.map((cliente) => (
          <View key={cliente.id} style={styles.alertCard}>
            <View style={styles.alertInfo}>
              <Text style={styles.clienteNombre}>{cliente.nombre}</Text>
              <Text style={styles.alertDetalle}>Celular: {cliente.celular}</Text>
              <Text style={styles.alertDetalle}>Vence: {cliente.fecha_finalizacion}</Text>
              <Text style={styles.alertDetalle}>Plan: {cliente.tipo_inscripcion}</Text>
            </View>
            <TouchableOpacity
              style={styles.renovarButton}
              onPress={() => handleRenovar(cliente)}
            >
              <Text style={styles.renovarButtonText}>Renovar</Text>
            </TouchableOpacity>
          </View>
        ))}
        {porVencer.length === 0 && (
          <Text style={styles.emptyText}>No hay clientes por vencer</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, styles.vencidoTitle]}>
          Expiradas ({vencidos.length})
        </Text>
        {vencidos.map((cliente) => (
          <View key={cliente.id} style={[styles.alertCard, styles.vencidoCard]}>
            <View style={styles.alertInfo}>
              <Text style={styles.clienteNombre}>{cliente.nombre}</Text>
              <Text style={styles.alertDetalle}>Celular: {cliente.celular}</Text>
              <Text style={styles.alertDetalle}>Expiró: {cliente.fecha_finalizacion}</Text>
              <Text style={styles.alertDetalle}>Plan: {cliente.tipo_inscripcion}</Text>
              <Text style={[styles.alertDetalle, styles.estadoExpirado]}>Estado: Expirada</Text>
            </View>
            <View style={styles.vencidoActions}>
              <TouchableOpacity
                style={styles.renovarButton}
                onPress={() => handleRenovar(cliente)}
              >
                <Text style={styles.renovarButtonText}>Renovar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.desactivarButton}
                onPress={() => handleDesactivar(cliente)}
              >
                <Text style={styles.desactivarButtonText}>Desactivar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        {vencidos.length === 0 && (
          <Text style={styles.emptyText}>No hay membresías expiradas</Text>
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
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#888',
    fontSize: 14,
    marginTop: 5,
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  vencidoTitle: {
    color: '#ef4444',
  },
  alertCard: {
    backgroundColor: '#16213e',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vencidoCard: {
    borderWidth: 2,
    borderColor: '#ef4444',
  },
  alertInfo: {
    flex: 1,
  },
  clienteNombre: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  alertDetalle: {
    color: '#888',
    fontSize: 14,
    marginBottom: 3,
  },
  estadoExpirado: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
  renovarButton: {
    backgroundColor: '#4ade80',
    padding: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  renovarButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  vencidoActions: {
    flexDirection: 'row',
  },
  desactivarButton: {
    backgroundColor: '#ef4444',
    padding: 10,
    borderRadius: 8,
    marginLeft: 5,
  },
  desactivarButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
  },
});

export default AlertasScreen;
