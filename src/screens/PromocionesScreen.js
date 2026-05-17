import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { getPromociones, insertPromocion, updatePromocion, deletePromocion } from '../database/database';

const PromocionesScreen = () => {
  const [promociones, setPromociones] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPromocion, setEditingPromocion] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    duracion: '',
  });

  useEffect(() => {
    loadPromociones();
  }, []);

  const loadPromociones = async () => {
    const data = await getPromociones();
    setPromociones(data);
  };

  const handleAdd = () => {
    setEditingPromocion(null);
    setFormData({ nombre: '', descripcion: '', precio: '', duracion: '' });
    setModalVisible(true);
  };

  const handleEdit = (promocion) => {
    setEditingPromocion(promocion);
    setFormData({
      nombre: promocion.nombre,
      descripcion: promocion.descripcion || '',
      precio: promocion.precio.toString(),
      duracion: promocion.duracion || '',
    });
    setModalVisible(true);
  };

  const handleDelete = (id, nombre) => {
    Alert.alert(
      'Eliminar Promoción',
      `¿Estás seguro de eliminar "${nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await deletePromocion(id);
            loadPromociones();
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    if (!formData.nombre || !formData.precio) {
      Alert.alert('Error', 'Por favor complete el nombre y precio');
      return;
    }

    const promocion = {
      ...formData,
      precio: parseFloat(formData.precio),
    };

    let result;
    if (editingPromocion) {
      result = await updatePromocion(editingPromocion.id, promocion);
    } else {
      result = await insertPromocion(promocion);
    }

    if (result) {
      Alert.alert('Éxito', editingPromocion ? 'Promoción actualizada' : 'Promoción creada');
      setModalVisible(false);
      loadPromociones();
    } else {
      Alert.alert('Error', 'No se pudo guardar la promoción');
    }
  };

  const renderPromocion = ({ item }) => (
    <View style={styles.promocionCard}>
      <View style={styles.promocionInfo}>
        <Text style={styles.promocionNombre}>{item.nombre}</Text>
        <Text style={styles.promocionDescripcion}>{item.descripcion}</Text>
        <Text style={styles.promocionPrecio}>{item.precio} Bs</Text>
        <Text style={styles.promocionDuracion}>Duración: {item.duracion}</Text>
      </View>
      <View style={styles.promocionActions}>
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
      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Text style={styles.addButtonText}>+ Nueva Promoción</Text>
      </TouchableOpacity>

      <FlatList
        data={promociones}
        renderItem={renderPromocion}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay promociones registradas</Text>
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
              {editingPromocion ? 'Editar Promoción' : 'Nueva Promoción'}
            </Text>

            <Text style={styles.label}>Nombre *</Text>
            <TextInput
              style={styles.input}
              value={formData.nombre}
              onChangeText={(text) => setFormData({ ...formData, nombre: text })}
              placeholder="Nombre de la promoción"
              placeholderTextColor="#888"
            />

            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={styles.input}
              value={formData.descripcion}
              onChangeText={(text) => setFormData({ ...formData, descripcion: text })}
              placeholder="Descripción"
              placeholderTextColor="#888"
            />

            <Text style={styles.label}>Precio (Bs) *</Text>
            <TextInput
              style={styles.input}
              value={formData.precio}
              onChangeText={(text) => setFormData({ ...formData, precio: text })}
              placeholder="Precio"
              placeholderTextColor="#888"
              keyboardType="decimal-pad"
            />

            <Text style={styles.label}>Duración</Text>
            <TextInput
              style={styles.input}
              value={formData.duracion}
              onChangeText={(text) => setFormData({ ...formData, duracion: text })}
              placeholder="Ej: 1 mes, 2 meses, 1 sesión"
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
    backgroundColor: '#e94560',
    padding: 15,
    margin: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 15,
  },
  promocionCard: {
    backgroundColor: '#16213e',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  promocionInfo: {
    marginBottom: 10,
  },
  promocionNombre: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  promocionDescripcion: {
    color: '#888',
    fontSize: 14,
    marginBottom: 5,
  },
  promocionPrecio: {
    color: '#e94560',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  promocionDuracion: {
    color: '#888',
    fontSize: 14,
  },
  promocionActions: {
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

export default PromocionesScreen;
