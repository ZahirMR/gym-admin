import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getGastos, insertGasto, updateGasto, deleteGasto, insertGanancia } from '../database/database';

const GastosScreen = () => {
  const [gastos, setGastos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('gasto'); // 'gasto' o 'ganancia'
  const [editingGasto, setEditingGasto] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    monto: '',
    tipo: '',
    fecha: '',
  });

  useFocusEffect(
    React.useCallback(() => {
      loadGastos();
    }, [])
  );

  const loadGastos = async () => {
    const data = await getGastos();
    setGastos(data);
  };

  const handleAdd = () => {
    setEditingGasto(null);
    setModalType('gasto');
    const hoy = new Date().toISOString().split('T')[0];
    setFormData({ nombre: '', monto: '', tipo: '', fecha: hoy });
    setModalVisible(true);
  };

  const handleAddGanancia = () => {
    setEditingGasto(null);
    setModalType('ganancia');
    const hoy = new Date().toISOString().split('T')[0];
    setFormData({ nombre: '', monto: '', tipo: '', fecha: hoy });
    setModalVisible(true);
  };

  const handleEdit = (gasto) => {
    setEditingGasto(gasto);
    setFormData({
      nombre: gasto.nombre,
      monto: gasto.monto.toString(),
      tipo: gasto.tipo || '',
      fecha: gasto.fecha,
    });
    setModalVisible(true);
  };

  const handleDelete = (id, nombre) => {
    Alert.alert(
      'Eliminar Gasto',
      `¿Estás seguro de eliminar "${nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await deleteGasto(id);
            loadGastos();
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    if (!formData.nombre || !formData.monto || !formData.fecha) {
      Alert.alert('Error', 'Por favor complete el nombre, monto y fecha');
      return;
    }

    const data = {
      ...formData,
      monto: parseFloat(formData.monto),
    };

    let result;
    if (modalType === 'ganancia') {
      result = await insertGanancia(data);
    } else {
      if (editingGasto) {
        result = await updateGasto(editingGasto.id, data);
      } else {
        result = await insertGasto(data);
      }
    }

    if (result) {
      Alert.alert('Éxito', modalType === 'ganancia' ? 'Ganancia registrada' : (editingGasto ? 'Gasto actualizado' : 'Gasto creado'));
      setModalVisible(false);
      loadGastos();
    } else {
      Alert.alert('Error', 'No se pudo guardar');
    }
  };

  const renderGasto = ({ item }) => (
    <View style={styles.gastoCard}>
      <View style={styles.gastoInfo}>
        <Text style={styles.gastoNombre}>{item.nombre}</Text>
        <Text style={styles.gastoTipo}>Tipo: {item.tipo}</Text>
        <Text style={styles.gastoFecha}>Fecha: {item.fecha}</Text>
        <Text style={styles.gastoMonto}>{item.monto} Bs</Text>
      </View>
      <View style={styles.gastoActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEdit(item)}
        >
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id, item.nombre)}
        >
          <Text style={styles.deleteButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.addButton, styles.gastoButton]} onPress={handleAdd}>
          <Text style={styles.addButtonText}>+ Nuevo Gasto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.addButton, styles.gananciaButton]} onPress={handleAddGanancia}>
          <Text style={styles.addButtonText}>+ Nueva Ganancia</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={gastos}
        renderItem={renderGasto}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay gastos registrados</Text>
          </View>
        }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingGasto ? 'Editar Gasto' : 'Nuevo Gasto'}
            </Text>

            <Text style={styles.label}>Nombre *</Text>
            <TextInput
              style={styles.input}
              value={formData.nombre}
              onChangeText={(text) => setFormData({ ...formData, nombre: text })}
              placeholder="Nombre del gasto"
              placeholderTextColor="#888"
            />

            <Text style={styles.label}>Tipo</Text>
            <TextInput
              style={styles.input}
              value={formData.tipo}
              onChangeText={(text) => setFormData({ ...formData, tipo: text })}
              placeholder="Ej: Alquiler, Servicios, Materiales"
              placeholderTextColor="#888"
            />

            <Text style={styles.label}>Monto (Bs) *</Text>
            <TextInput
              style={styles.input}
              value={formData.monto}
              onChangeText={(text) => setFormData({ ...formData, monto: text })}
              placeholder="Monto"
              placeholderTextColor="#888"
              keyboardType="decimal-pad"
            />

            <Text style={styles.label}>Fecha *</Text>
            <TextInput
              style={styles.input}
              value={formData.fecha}
              onChangeText={(text) => setFormData({ ...formData, fecha: text })}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#888"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.modalButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  addButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
  },
  gastoButton: {
    backgroundColor: '#e94560',
    marginRight: 5,
  },
  gananciaButton: {
    backgroundColor: '#4ade80',
    marginLeft: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  listContent: {
    padding: 15,
  },
  gastoCard: {
    backgroundColor: '#16213e',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  gastoInfo: {
    marginBottom: 10,
  },
  gastoNombre: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  gastoTipo: {
    color: '#888',
    fontSize: 14,
    marginBottom: 3,
  },
  gastoFecha: {
    color: '#888',
    fontSize: 14,
    marginBottom: 3,
  },
  gastoMonto: {
    color: '#ef4444',
    fontSize: 20,
    fontWeight: 'bold',
  },
  gastoActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    backgroundColor: '#4ade80',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    padding: 10,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 50,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
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
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#16213e',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
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
  saveButton: {
    backgroundColor: '#e94560',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GastosScreen;
