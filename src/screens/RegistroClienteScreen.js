import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { insertCliente, getPromociones, updateCliente } from '../database/database';

const RegistroClienteScreen = ({ route }) => {
  const { cliente, isEdit } = route.params || {};
  const [formData, setFormData] = useState({
    nombre: '',
    fecha_nacimiento: '',
    celular: '',
    fecha_inscripcion: '',
    fecha_finalizacion: '',
    tipo_inscripcion: '',
    costo: '',
  });
  const [promociones, setPromociones] = useState([]);

  useEffect(() => {
    loadPromociones();
    if (isEdit && cliente) {
      setFormData({
        nombre: cliente.nombre,
        fecha_nacimiento: cliente.fecha_nacimiento,
        celular: cliente.celular,
        fecha_inscripcion: cliente.fecha_inscripcion,
        fecha_finalizacion: cliente.fecha_finalizacion,
        tipo_inscripcion: cliente.tipo_inscripcion,
        costo: cliente.costo.toString(),
      });
    } else {
      setFechaHoy();
    }
  }, [isEdit, cliente]);

  const loadPromociones = async () => {
    const data = await getPromociones();
    setPromociones(data);
  };

  const setFechaHoy = () => {
    const hoy = new Date().toISOString().split('T')[0];
    setFormData(prev => ({
      ...prev,
      fecha_inscripcion: hoy,
    }));
  };

  const handlePromocionSelect = (promocion) => {
    const fechaFin = calcularFechaFinalizacion(promocion.duracion);
    setFormData(prev => ({
      ...prev,
      tipo_inscripcion: promocion.nombre,
      costo: promocion.precio.toString(),
      fecha_finalizacion: fechaFin,
    }));
  };

  const calcularFechaFinalizacion = (duracion) => {
    const fecha = new Date();
    if (duracion.includes('mes')) {
      const meses = parseInt(duracion) || 1;
      fecha.setMonth(fecha.getMonth() + meses);
    } else if (duracion.includes('sesión')) {
      fecha.setDate(fecha.getDate() + 1);
    }
    return fecha.toISOString().split('T')[0];
  };

  const handleSave = async () => {
    if (!formData.nombre || !formData.celular || !formData.tipo_inscripcion || !formData.costo) {
      Alert.alert('Error', 'Por favor complete todos los campos obligatorios');
      return;
    }

    const clienteData = {
      ...formData,
      costo: parseFloat(formData.costo),
    };

    let result;
    if (isEdit && cliente) {
      result = await updateCliente(cliente.id, clienteData);
    } else {
      result = await insertCliente(clienteData);
    }

    if (result) {
      Alert.alert('Éxito', isEdit ? 'Cliente actualizado correctamente' : 'Cliente registrado correctamente', [
        {
          text: 'OK',
          onPress: () => {
            setFormData({
              nombre: '',
              fecha_nacimiento: '',
              celular: '',
              fecha_inscripcion: '',
              fecha_finalizacion: '',
              tipo_inscripcion: '',
              costo: '',
            });
            setFechaHoy();
            navigation.goBack();
          },
        },
      ]);
    } else {
      Alert.alert('Error', isEdit ? 'No se pudo actualizar el cliente' : 'No se pudo registrar el cliente');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{isEdit ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}</Text>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Nombre *</Text>
        <TextInput
          style={styles.input}
          value={formData.nombre}
          onChangeText={(text) => setFormData({ ...formData, nombre: text })}
          placeholder="Nombre completo"
          placeholderTextColor="#888"
        />

        <Text style={styles.label}>Fecha de Nacimiento</Text>
        <TextInput
          style={styles.input}
          value={formData.fecha_nacimiento}
          onChangeText={(text) => setFormData({ ...formData, fecha_nacimiento: text })}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#888"
        />

        <Text style={styles.label}>Celular *</Text>
        <TextInput
          style={styles.input}
          value={formData.celular}
          onChangeText={(text) => setFormData({ ...formData, celular: text })}
          placeholder="Número de celular"
          placeholderTextColor="#888"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Fecha de Inscripción</Text>
        <TextInput
          style={styles.input}
          value={formData.fecha_inscripcion}
          onChangeText={(text) => setFormData({ ...formData, fecha_inscripcion: text })}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#888"
        />

        <Text style={styles.label}>Fecha de Finalización</Text>
        <TextInput
          style={styles.input}
          value={formData.fecha_finalizacion}
          onChangeText={(text) => setFormData({ ...formData, fecha_finalizacion: text })}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#888"
        />

        <Text style={styles.label}>Promociones Disponibles</Text>
        <ScrollView style={styles.promocionesList} horizontal>
          {promociones.map((promocion) => (
            <TouchableOpacity
              key={promocion.id}
              style={[
                styles.promocionCard,
                formData.tipo_inscripcion === promocion.nombre && styles.promocionCardSelected,
              ]}
              onPress={() => handlePromocionSelect(promocion)}
            >
              <Text style={styles.promocionNombre}>{promocion.nombre}</Text>
              <Text style={styles.promocionPrecio}>{promocion.precio} Bs</Text>
              <Text style={styles.promocionDuracion}>{promocion.duracion}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>Tipo de Inscripción *</Text>
        <TextInput
          style={styles.input}
          value={formData.tipo_inscripcion}
          onChangeText={(text) => setFormData({ ...formData, tipo_inscripcion: text })}
          placeholder="Tipo de inscripción"
          placeholderTextColor="#888"
        />

        <Text style={styles.label}>Costo (Bs) *</Text>
        <TextInput
          style={styles.input}
          value={formData.costo}
          onChangeText={(text) => setFormData({ ...formData, costo: text })}
          placeholder="Costo"
          placeholderTextColor="#888"
          keyboardType="decimal-pad"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Guardar Cliente</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
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
    borderColor: 'transparent',
  },
  promocionCardSelected: {
    borderColor: '#e94560',
  },
  promocionNombre: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  promocionPrecio: {
    color: '#e94560',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  promocionDuracion: {
    color: '#888',
    fontSize: 12,
  },
  saveButton: {
    backgroundColor: '#e94560',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RegistroClienteScreen;
