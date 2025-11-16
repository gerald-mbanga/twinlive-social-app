// SettingsButton.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Switch } from 'react-native';
import Modal from 'react-native-modal'; // optional (nice bottom sheet); remove if using RN Modal
import Icon from 'react-native-vector-icons/Ionicons'; // change to what you have
import { useNavigation } from '@react-navigation/native';

export default function SettingsButton({ initialToggles = {} }) {
  const nav = useNavigation();
  const [visible, setVisible] = useState(false);

  // example local toggles for quick controls
  const [mutedOnStart, setMutedOnStart] = useState(initialToggles.startMuted ?? false);
  const [showOnline, setShowOnline] = useState(initialToggles.showOnline ?? true);

  function openSettingsScreen() {
    setVisible(false);
    // Navigate to full settings screen (you should have a route named "Settings")
    nav.navigate('Settings');
  }

  return (
    <>
      <TouchableOpacity style={styles.iconButton} onPress={() => setVisible(true)} accessibilityLabel="Open settings">
        <Icon name="settings-outline" size={22} color="#fff" />
      </TouchableOpacity>

      <Modal
        isVisible={visible}
        onBackdropPress={() => setVisible(false)}
        onBackButtonPress={() => setVisible(false)}
        style={styles.modal}
        swipeDirection={['down']}
        onSwipeComplete={() => setVisible(false)}
        backdropOpacity={0.4}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Settings</Text>

          {/* Quick toggles */}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Start muted</Text>
            <Switch value={mutedOnStart} onValueChange={val => { setMutedOnStart(val); /* persist to store */ }} />
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Show online status</Text>
            <Switch value={showOnline} onValueChange={val => { setShowOnline(val); /* persist to store */ }} />
          </View>

          {/* Quick actions */}
          <TouchableOpacity style={styles.action} onPress={() => { /* example - clear cache */ setVisible(false); }}>
            <Text style={styles.actionText}>Clear Cache</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.action, { backgroundColor: '#0a84ff' }]} onPress={openSettingsScreen}>
            <Text style={[styles.actionText, { color: '#fff' }]}>Open All Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancel} onPress={() => setVisible(false)}>
            <Text style={styles.cancelText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0a84ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  sheet: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    minHeight: 260,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 },
  rowLabel: { fontSize: 16 },
  action: { marginTop: 12, padding: 12, borderRadius: 8, backgroundColor: '#f2f2f2', alignItems: 'center' },
  actionText: { fontWeight: '600' },
  cancel: { marginTop: 8, padding: 10, alignItems: 'center' },
  cancelText: { color: '#666' },
});