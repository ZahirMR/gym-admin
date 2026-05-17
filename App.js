import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { initDatabase } from './src/database/database';

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    initDatabase()
      .then(() => {
        console.log('Database initialized successfully');
        setDbInitialized(true);
      })
      .catch((err) => {
        console.error('Database initialization error:', err);
        setError(err.message);
      });
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' }}>
        <Text style={{ color: '#fff', fontSize: 18 }}>Error: {error}</Text>
      </View>
    );
  }

  if (!dbInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' }}>
        <Text style={{ color: '#fff', fontSize: 18 }}>Cargando base de datos...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <AppNavigator />
    </>
  );
}
