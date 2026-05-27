import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getClientesPorVencer, getClientesVencidos, updateCliente, getPromociones } from '../database/database';

const AlertasScreen = () => {
  const [porVencer, setPorVencer] = useState([]);
  const [vencidos, setVencidos] = useState([]);
  const [renovarModalVisible, setRenovarModalVisible] = useState(false);
  const [clienteRenovar, setClienteRenovar] = useState(null);
  const [mesesAgregar, setMesesAgregar] = useState('1');
  const [promociones, setPromociones] = useState([]);
  const [promocionSeleccionada, setPromocionSeleccionada] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      loadAlertas();
    }, [])
  );

  const loadAlertas = async () => {
    const vencer = await getClientesPorVencer();
    const vencido = await getClientesVencidos();
    const promos = await getPromociones();
    setPorVencer(vencer);
    setVencidos(vencido);
    setPromociones(promos);
  };

  const handleRenovar = async (cliente) => {
    setClienteRenovar(cliente);
    setMesesAgregar('1');
    setPromocionSeleccionada(null);
    setRenovarModalVisible(true);
  };

  const confirmarRenovacion = async () => {
    if (!clienteRenovar) return;

    try {
      let fechaFin;
      
      if (clienteRenovar.estado === 'expirado') {
        // Para expirados, reactivar desde hoy
        fechaFin = new Date();
      } else {
        // Para activos, sumar al tiempo que le falta
        const [anio, mes, dia] = clienteRenovar.fecha_finalizacion.split('-');
        fechaFin = new Date(parseInt(anio), parseInt(mes) - 1, parseInt(dia));
      }
      
      if (promocionSeleccionada) {
        // Usar duración de la promoción seleccionada
        const duracion = parseInt(promocionSeleccionada.duracion);
        fechaFin.setMonth(fechaFin.getMonth() + duracion);
      } else {
        // Usar meses a agregar
        const meses = parseInt(mesesAgregar) || 1;
        fechaFin.setMonth(fechaFin.getMonth() + meses);
      }
      
      const nuevaFecha = fechaFin.toISOString().split('T')[0];
      
      const result = await updateCliente(clienteRenovar.id, {
        ...clienteRenovar,
        fecha_finalizacion: nuevaFecha,
        estado: 'activo',
        estado_pago: 'pago',
        monto_pendiente: 0,
        tipo_inscripcion: promocionSeleccionada ? promocionSeleccionada.nombre : clienteRenovar.tipo_inscripcion,
        costo: promocionSeleccionada ? promocionSeleccionada.precio : clienteRenovar.costo,
      });
      
      if (result) {
        Alert.alert('Éxito', 'Membresía renovada correctamente');
        setRenovarModalVisible(false);
        loadAlertas();
      } else {
        Alert.alert('Error', 'No se pudo renovar la membresía');
      }
    } catch (error) {
      console.error('Error al renovar:', error);
      Alert.alert('Error', 'Ocurrió un error al renovar la membresía');
    }
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={renovarModalVisible}
        onRequestClose={() => setRenovarModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Renovar Membresía</Text>
            <Text style={styles.modalSubtitle}>
              {clienteRenovar?.nombre} - {clienteRenovar?.estado === 'expirado' ? 'Reactivar' : 'Extender'}
            </Text>

            <Text style={styles.label}>Agregar Meses</Text>
            <TextInput
              style={styles.input}
              value={mesesAgregar}
              onChangeText={setMesesAgregar}
              placeholder="Cantidad de meses"
              placeholderTextColor="#888"
              keyboardType="number-pad"
            />

            <Text style={styles.label}>O elegir Promoción</Text>
            <ScrollView style={styles.promocionesList} horizontal>
              {promociones.map((promocion) => (
                <TouchableOpacity
                  key={promocion.id}
                  style={[
                    styles.promocionCard,
                    promocionSeleccionada?.id === promocion.id && styles.promocionCardSelected,
                  ]}
                  onPress={() => {
                    setPromocionSeleccionada(promocion);
                    setMesesAgregar('');
                  }}
                >
                  <Text style={styles.promocionNombre}>{promocion.nombre}</Text>
                  <Text style={styles.promocionPrecio}>{promocion.precio} Bs</Text>
                  <Text style={styles.promocionDuracion}>{promocion.duracion} meses</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setRenovarModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmarRenovacion}
              >
                <Text style={styles.modalButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    padding: 20,
    borderRadius: 15,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    color: '#888',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#16213e',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  promocionesList: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  promocionCard: {
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    minWidth: 120,
    borderWidth: 2,
    borderColor: '#333',
  },
  promocionCardSelected: {
    borderColor: '#e94560',
    backgroundColor: '#e94560',
  },
  promocionNombre: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  promocionPrecio: {
    color: '#4ade80',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  promocionDuracion: {
    color: '#888',
    fontSize: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  confirmButton: {
    backgroundColor: '#e94560',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AlertasScreen;
