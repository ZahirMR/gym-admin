import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { getTrabajadores, insertTrabajador, updateTrabajador, deleteTrabajador } from '../database/database';

const TrabajadoresScreen = () => {
  const [trabajadores, setTrabajadores] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTrabajador, setEditingTrabajador] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nombre: '',
  });

  useEffect(() => {
    loadTrabajadores();
  }, []);

  const loadTrabajadores = async () => {
    const data = await getTrabajadores();
    setTrabajadores(data);
  };

  const handleAdd = () => {
    setEditingTrabajador(null);
    setFormData({ username: '', password: '', nombre: '' });
    setModalVisible(true);
  };

  const handleEdit = (trabajador) => {
    setEditingTrabajador(trabajador);
    setFormData({
      username: trabajador.username,
      password: trabajador.password,
      nombre: trabajador.nombre || '',
    });
    setModalVisible(true);
  };

  const handleDelete = (id, nombre) => {
    Alert.alert(
      'Eliminar Trabajador',
      `¿Estás seguro de eliminar a "${nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await deleteTrabajador(id);
            loadTrabajadores();
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    if (!formData.username || !formData.password) {
      Alert.alert('Error', 'Por favor complete el usuario y contraseña');
      return;
    }

    const trabajador = {
      username: formData.username,
      password: formData.password,
      nombre: formData.nombre,
    };

    let result;
    if (editingTrabajador) {
      result = await updateTrabajador(editingTrabajador.id, trabajador);
    } else {
      result = await insertTrabajador(trabajador);
    }

    if (result) {
      Alert.alert('Éxito', editingTrabajador ? 'Trabajador actualizado' : 'Trabajador creado');
      setModalVisible(false);
      loadTrabajadores();
    } else {
      Alert.alert('Error', 'No se pudo guardar el trabajador');
    }
  };

  const renderTrabajador = ({ item }) => (
    <View style={styles.trabajadorCard}>
      <View style={styles.trabajadorInfo}>
        <Text style={styles.trabajadorNombre}>{item.nombre || item.username}</Text>
        <Text style={styles.trabajadorUsuario}>Usuario: {item.username}</Text>
        <Text style={styles.trabajadorRol}>Rol: {item.rol}</Text>
      </View>
      <View style={styles.trabajadorActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEdit(item)}
        >
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id, item.nombre || item.username)}
        >
          <Text style={styles.deleteButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Text style={styles.addButtonText}>+ Nuevo Trabajador</Text>
      </TouchableOpacity>

      <FlatList
        data={trabajadores}
        renderItem={renderTrabajador}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay trabajadores registrados</Text>
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
              {editingTrabajador ? 'Editar Trabajador' : 'Nuevo Trabajador'}
            </Text>

            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              value={formData.nombre}
              onChangeText={(text) => setFormData({ ...formData, nombre: text })}
              placeholder="Nombre completo"
              placeholderTextColor="#888"
            />

            <Text style={styles.label}>Usuario *</Text>
            <TextInput
              style={styles.input}
              value={formData.username}
              onChangeText={(text) => setFormData({ ...formData, username: text })}
              placeholder="Nombre de usuario"
              placeholderTextColor="#888"
            />

            <Text style={styles.label}>Contraseña *</Text>
            <TextInput
              style={styles.input}
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              placeholder="Contraseña"
              placeholderTextColor="#888"
              secureTextEntry
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
  trabajadorCard: {
    backgroundColor: '#16213e',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  trabajadorInfo: {
    marginBottom: 10,
  },
  trabajadorNombre: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  trabajadorUsuario: {
    color: '#888',
    fontSize: 14,
    marginBottom: 3,
  },
  trabajadorRol: {
    color: '#4ade80',
    fontSize: 14,
    fontWeight: 'bold',
  },
  trabajadorActions: {
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

export default TrabajadoresScreen;
