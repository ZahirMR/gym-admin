import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Image, Modal } from 'react-native';
import { getClientes, deleteCliente, getClienteById } from '../database/database';

const ClientesScreen = ({ navigation }) => {
  const [clientes, setClientes] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState(null);

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    const data = await getClientes();
    setClientes(data);
  };

  const handleDelete = (id, nombre) => {
    console.log('Botón eliminar presionado para:', nombre, 'ID:', id);
    if (!id) {
      console.error('ID del cliente es undefined');
      alert('Error: ID del cliente no válido');
      return;
    }
    
    setClienteToDelete({ id, nombre });
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!clienteToDelete) return;
    
    console.log('Confirmado eliminar cliente con ID:', clienteToDelete.id);
    try {
      const result = await deleteCliente(clienteToDelete.id);
      console.log('Resultado de eliminación:', result);
      if (result) {
        loadClientes();
        alert('Cliente eliminado correctamente');
      } else {
        alert('No se pudo eliminar el cliente');
      }
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      alert('Ocurrió un error al eliminar el cliente');
    }
    setDeleteModalVisible(false);
    setClienteToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setClienteToDelete(null);
  };

  const handleEdit = async (id) => {
    const cliente = await getClienteById(id);
    if (cliente) {
      navigation.navigate('RegistroCliente', { cliente, isEdit: true });
    }
  };

  const renderCliente = ({ item }) => (
    <View style={styles.clienteCard}>
      <View style={styles.clienteInfo}>
        <Text style={styles.clienteNombre}>{item.nombre}</Text>
        <Text style={styles.clienteDetalle}>Celular: {item.celular}</Text>
        <Text style={styles.clienteDetalle}>Inscripción: {item.tipo_inscripcion}</Text>
        <Text style={styles.clienteDetalle}>Costo: {item.costo} Bs</Text>
        <Text style={styles.clienteDetalle}>Inicio: {item.fecha_inscripcion}</Text>
        <Text style={styles.clienteDetalle}>Fin: {item.fecha_finalizacion}</Text>
        <Text style={[
          styles.clienteEstado,
          { color: item.estado === 'activo' ? '#4ade80' : '#ef4444' }
        ]}>
          Estado: {item.estado.toUpperCase()}
        </Text>
      </View>
      <View style={styles.clienteActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEdit(item.id)}
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
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('RegistroCliente')}
      >
        <Text style={styles.addButtonText}>+ Nuevo Cliente</Text>
      </TouchableOpacity>

      <FlatList
        data={clientes}
        renderItem={renderCliente}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay clientes registrados</Text>
          </View>
        }
      />

      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Eliminar Cliente</Text>
            <Text style={styles.modalMessage}>
              ¿Estás seguro de eliminar a {clienteToDelete?.nombre}?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={cancelDelete}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonDelete]}
                onPress={confirmDelete}
              >
                <Text style={styles.modalButtonText}>Eliminar</Text>
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
  clienteCard: {
    backgroundColor: '#16213e',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clienteInfo: {
    flex: 1,
  },
  clienteNombre: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  clienteDetalle: {
    color: '#888',
    fontSize: 14,
    marginBottom: 3,
  },
  clienteEstado: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  clienteActions: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: '#4ade80',
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    marginBottom: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#16213e',
    borderRadius: 15,
    padding: 20,
    width: '80%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: '#e94560',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalMessage: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#4ade80',
  },
  modalButtonDelete: {
    backgroundColor: '#ef4444',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ClientesScreen;
