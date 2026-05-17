import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { getClientes, getPromociones, getTotalIngresos, getClientesPorVencer } from '../database/database';

const HomeScreen = ({ navigation }) => {
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalPromociones: 0,
    totalIngresos: 0,
    clientesPorVencer: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const clientes = await getClientes();
    const promociones = await getPromociones();
    const ingresos = await getTotalIngresos();
    const porVencer = await getClientesPorVencer();

    setStats({
      totalClientes: clientes.length,
      totalPromociones: promociones.length,
      totalIngresos: ingresos,
      clientesPorVencer: porVencer.length,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/icon.png')} style={styles.logo} />
        <Text style={styles.welcomeText}>Bienvenido al Gym Admin</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalClientes}</Text>
          <Text style={styles.statLabel}>Clientes Activos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalPromociones}</Text>
          <Text style={styles.statLabel}>Promociones</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalIngresos.toFixed(2)} Bs</Text>
          <Text style={styles.statLabel}>Ingresos Totales</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.clientesPorVencer}</Text>
          <Text style={styles.statLabel}>Por Vencer</Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('RegistroCliente')}
        >
          <Text style={styles.actionButtonText}>+ Registrar Cliente</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Clientes')}
        >
          <Text style={styles.actionButtonText}>Ver Clientes</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Promociones')}
        >
          <Text style={styles.actionButtonText}>Gestionar Promociones</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Alertas')}
        >
          <Text style={styles.actionButtonText}>Ver Alertas</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#16213e',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#16213e',
    width: '48%',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  statNumber: {
    color: '#e94560',
    fontSize: 28,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#888',
    fontSize: 14,
    marginTop: 5,
  },
  quickActions: {
    padding: 15,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  actionButton: {
    backgroundColor: '#e94560',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
