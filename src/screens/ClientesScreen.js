import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
import { getClientes, deleteCliente, getClienteById } from '../database/database';

const ClientesScreen = ({ navigation }) => {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    const data = await getClientes();
    setClientes(data);
  };

  const handleDelete = (id, nombre) => {
    console.log('Botón eliminar presionado para:', nombre, 'ID:', id);
    Alert.alert(
      'Eliminar Cliente',
      `¿Estás seguro de eliminar a ${nombre}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            console.log('Confirmado eliminar cliente con ID:', id);
            const result = await deleteCliente(id);
            console.log('Resultado de eliminación:', result);
            if (result) {
              loadClientes();
              Alert.alert('Éxito', 'Cliente eliminado correctamente');
            } else {
              Alert.alert('Error', 'No se pudo eliminar el cliente');
            }
          },
        },
      ]
    );
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
});

export default ClientesScreen;
