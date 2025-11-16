// SettingsScreen.js
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Settings keys stored locally
 */
const STORAGE_KEY = '@twinlive_settings_v1';

/**
 * Default settings
 */
const DEFAULT_SETTINGS = {
  // Basic profile
  displayName: '',
  showOnlineStatus: true,
  showAge: false,
  locationSharing: 'city', // 'none' | 'city' | 'precise'

  // Media defaults
  defaultCamera: 'front', // 'front' | 'back'
  defaultMicMuted: false,
  videoQuality: 'medium', // 'low' | 'medium' | 'high'

  // Vibe / Matching preferences
  defaultVibe: 'Chill',
  maxDistanceKm: 50,
  preferredLanguage: 'en',

  // Privacy & Safety
  allowPrivateCallsFromFollowersOnly: false,
  autoAcceptPrivateCalls: false,
  allowRecording: false,
  showVibeBadge: true,
  blockedUsers: [],

  // Notifications & DND
  notificationsEnabled: true,
  notifShowPreviews: false,
  dndEnabled: false,
  dndFrom: '22:00',
  dndTo: '07:00',

  // Monetization & subscription
  twinPlusSubscribed: false,

  // Developer options / extra
  debugMode: false,
};

export default function SettingsScreen({ navigation }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        setSettings({ ...DEFAULT_SETTINGS, ...saved });
      } else {
        setSettings(DEFAULT_SETTINGS);
      }
    } catch (e) {
      console.warn('Failed to load settings', e);
      Alert.alert('Error', 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }

  async function persistSettings(newSettings, pushToServer = false) {
    try {
      const merged = { ...settings, ...newSettings };
      setSettings(merged);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      if (pushToServer) {
        await apiSaveSettings(merged);
      }
    } catch (e) {
      console.warn('Failed to persist settings', e);
      Alert.alert('Error', 'Failed to save settings');
    }
  }

  // ---------- Example API calls (replace baseURL) ----------
  const BASE_URL = 'http://YOUR_API_HOST:3000/api'; // change to your real API

  async function apiSaveSettings(payload) {
    try {
      const res = await fetch(`${BASE_URL}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' /* add auth header */ },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Save failed: ${text}`);
      }
      return await res.json();
    } catch (e) {
      console.warn('apiSaveSettings error', e);
      throw e;
    }
  }

  async function apiLoadSettings() {
    try {
      const res = await fetch(`${BASE_URL}/settings`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' /* add auth header */ },
      });
      if (!res.ok) throw new Error('Failed to load');
      const json = await res.json();
      return json;
    } catch (e) {
      console.warn('apiLoadSettings error', e);
      throw e;
    }
  }

  async function apiDeleteAccount() {
    try {
      const res = await fetch(`${BASE_URL}/account`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' /* add auth header */ },
      });
      if (!res.ok) throw new Error('Failed to delete account');
      return true;
    } catch (e) {
      console.warn('apiDeleteAccount error', e);
      throw e;
    }
  }

  // ---------- UI helpers ----------
  function toggleBoolean(key) {
    persistSettings({ [key]: !settings[key] }, true);
  }

  function updateField(key, value) {
    persistSettings({ [key]: value }, false);
  }

  function numericField(key, value) {
    const n = parseInt(value || '0', 10);
    if (!Number.isFinite(n) || n < 0) return;
    persistSettings({ [key]: n }, false);
  }

  // Export settings as JSON (shares or copy in production)
  async function exportSettings() {
    try {
      const json = JSON.stringify(settings, null, 2);
      // For simplicity we show an alert (in production use sharing module or file write)
      Alert.alert('Export Settings JSON', json.slice(0, 1000) + (json.length > 1000 ? '\n\n(truncated)' : ''));
    } catch (e) {
      Alert.alert('Error', 'Could not export settings');
    }
  }

  // Import settings from pasted JSON (simple)
  function importSettingsPrompt() {
    Alert.prompt(
      'Import Settings',
      'Paste settings JSON below (overwrites local settings).',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Import',
          onPress: async (text) => {
            try {
              const parsed = JSON.parse(text);
              await persistSettings(parsed, true);
              Alert.alert('Imported', 'Settings imported successfully');
            } catch (e) {
              Alert.alert('Invalid JSON', 'Please paste valid settings JSON');
            }
          },
        },
      ],
      'plain-text',
    );
  }

  // Delete account flow
  async function onDeleteAccount() {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // call server to delete account
              await apiDeleteAccount();
            } catch (e) {
              // If server not available, still clear local data
              console.warn('server delete failed, clearing local only', e);
            } finally {
              await AsyncStorage.removeItem(STORAGE_KEY);
              Alert.alert('Deleted', 'Account removed locally. Please sign out.');
              // navigate to onboarding/login
              navigation.replace && navigation.replace('Auth');
            }
          },
        },
      ],
    );
  }

  // Block user helper
  function blockUser(userId) {
    if (!userId) return;
    const blocked = Array.from(new Set([...(settings.blockedUsers || []), userId]));
    persistSettings({ blockedUsers: blocked }, true);
    Alert.alert('Blocked', `User ${userId} was blocked`);
  }

  // Unblock helper
  function unblockUser(userId) {
    const blocked = (settings.blockedUsers || []).filter(u => u !== userId);
    persistSettings({ blockedUsers: blocked }, true);
  }

  // Sync with server (pull)
  async function syncFromServer() {
    try {
      const serverSettings = await apiLoadSettings();
      await persistSettings(serverSettings, false);
      Alert.alert('Synced', 'Fetched settings from server');
    } catch (e) {
      Alert.alert('Sync Failed', 'Could not fetch settings from server');
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Loading settings…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ width: '100%' }} contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.title}>Settings</Text>

        {/* Profile */}
        <Section title="Profile">
          <LabeledInput label="Display name" value={settings.displayName} onChangeText={text => updateField('displayName', text)} />
          <ToggleRow label="Show online status" value={settings.showOnlineStatus} onValueChange={() => toggleBoolean('showOnlineStatus')} />
          <ToggleRow label="Show age" value={settings.showAge} onValueChange={() => toggleBoolean('showAge')} />
          <Row>
            <Text style={styles.rowLabel}>Location sharing</Text>
            <TouchableOpacity style={styles.smallButton} onPress={() => {
              const next = settings.locationSharing === 'none' ? 'city' : settings.locationSharing === 'city' ? 'precise' : 'none';
              persistSettings({ locationSharing: next }, true);
            }}>
              <Text style={styles.smallButtonText}>{settings.locationSharing}</Text>
            </TouchableOpacity>
          </Row>
        </Section>

        {/* Media */}
        <Section title="Media & Stream">
          <Row>
            <Text style={styles.rowLabel}>Default camera</Text>
            <TouchableOpacity style={styles.smallButton} onPress={() => persistSettings({ defaultCamera: settings.defaultCamera === 'front' ? 'back' : 'front' }, true)}>
              <Text style={styles.smallButtonText}>{settings.defaultCamera}</Text>
            </TouchableOpacity>
          </Row>
          <ToggleRow label="Start muted" value={settings.defaultMicMuted} onValueChange={() => toggleBoolean('defaultMicMuted')} />
          <Row>
            <Text style={styles.rowLabel}>Video quality</Text>
            <TouchableOpacity style={styles.smallButton} onPress={() => {
              const order = ['low', 'medium', 'high'];
              const idx = order.indexOf(settings.videoQuality);
              const next = order[(idx + 1) % order.length];
              persistSettings({ videoQuality: next }, true);
            }}>
              <Text style={styles.smallButtonText}>{settings.videoQuality}</Text>
            </TouchableOpacity>
          </Row>
        </Section>

        {/* Matching */}
        <Section title="Matching & Vibes">
          <LabeledInput label="Default vibe" value={settings.defaultVibe} onChangeText={text => updateField('defaultVibe', text)} />
          <Row>
            <Text style={styles.rowLabel}>Max distance (km)</Text>
            <TextInput
              style={styles.smallInput}
              keyboardType="numeric"
              value={String(settings.maxDistanceKm)}
              onChangeText={(t) => numericField('maxDistanceKm', t)}
            />
          </Row>
          <LabeledInput label="Preferred language" value={settings.preferredLanguage} onChangeText={text => updateField('preferredLanguage', text)} />
        </Section>

        {/* Privacy */}
        <Section title="Privacy & Safety">
          <ToggleRow label="Private calls from followers only" value={settings.allowPrivateCallsFromFollowersOnly} onValueChange={() => toggleBoolean('allowPrivateCallsFromFollowersOnly')} />
          <ToggleRow label="Auto-accept private calls" value={settings.autoAcceptPrivateCalls} onValueChange={() => toggleBoolean('autoAcceptPrivateCalls')} />
          <ToggleRow label="Allow others to record my streams" value={settings.allowRecording} onValueChange={() => toggleBoolean('allowRecording')} />
          <Row>
            <Text style={styles.rowLabel}>Blocked users</Text>
            <Text style={styles.smallMeta}>{(settings.blockedUsers || []).length} users</Text>
          </Row>

          {/* Block user input quick action (example) */}
          <Row>
            <TextInput placeholder="Block userId..." style={styles.smallInput} onSubmitEditing={(e) => blockUser(e.nativeEvent.text)} />
          </Row>
        </Section>

        {/* Notifications */}
        <Section title="Notifications">
          <ToggleRow label="Enable notifications" value={settings.notificationsEnabled} onValueChange={() => toggleBoolean('notificationsEnabled')} />
          <ToggleRow label="Show preview in notification" value={settings.notifShowPreviews} onValueChange={() => toggleBoolean('notifShowPreviews')} />
          <ToggleRow label="Do Not Disturb (DND)" value={settings.dndEnabled} onValueChange={() => toggleBoolean('dndEnabled')} />
          <Row>
            <Text style={styles.rowLabel}>DND from</Text>
            <TextInput style={styles.smallInput} value={settings.dndFrom} onChangeText={(t) => updateField('dndFrom', t)} />
            <Text style={{ marginHorizontal: 8 }}>to</Text>
            <TextInput style={styles.smallInput} value={settings.dndTo} onChangeText={(t) => updateField('dndTo', t)} />
          </Row>
        </Section>

        {/* Subscription */}
        <Section title="Subscription">
          <Row>
            <Text style={styles.rowLabel}>Twin+ status</Text>
            <Text style={styles.smallMeta}>{settings.twinPlusSubscribed ? 'Subscribed' : 'Not subscribed'}</Text>
          </Row>
          <Row>
            <TouchableOpacity style={styles.buttonSmall} onPress={() => {
              // Toggle locally for demo; integrate real in-app purchase instead.
              persistSettings({ twinPlusSubscribed: !settings.twinPlusSubscribed }, true);
              Alert.alert('Subscription', settings.twinPlusSubscribed ? 'You unsubscribed (demo)' : 'You subscribed (demo)');
            }}>
              <Text style={styles.buttonSmallText}>{settings.twinPlusSubscribed ? 'Unsubscribe (demo)' : 'Subscribe (demo)'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttonSmall, { marginLeft: 8 }]} onPress={() => Alert.alert('Benefits', 'Twin+ gives priority matching, special filters, and unlimited private calls.')}>
              <Text style={styles.buttonSmallText}>Benefits</Text>
            </TouchableOpacity>
          </Row>
        </Section>

        {/* Developer & Other */}
        <Section title="Other">
          <ToggleRow label="Debug mode" value={settings.debugMode} onValueChange={() => toggleBoolean('debugMode')} />
          <Row>
            <TouchableOpacity style={styles.buttonSmall} onPress={exportSettings}><Text style={styles.buttonSmallText}>Export Settings (JSON)</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.buttonSmall, { marginLeft: 8 }]} onPress={importSettingsPrompt}><Text style={styles.buttonSmallText}>Import Settings</Text></TouchableOpacity>
          </Row>

          <Row>
            <TouchableOpacity style={[styles.buttonDanger]} onPress={onDeleteAccount}><Text style={styles.buttonSmallText}>Delete Account</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.buttonSmall, { marginLeft: 8 }]} onPress={() => {
              AsyncStorage.removeItem(STORAGE_KEY).then(() => { setSettings(DEFAULT_SETTINGS); Alert.alert('Reset', 'Local settings reset.'); });
            }}>
              <Text style={styles.buttonSmallText}>Reset Local Settings</Text>
            </TouchableOpacity>
          </Row>

          <Row>
            <TouchableOpacity style={styles.buttonSmall} onPress={syncFromServer}><Text style={styles.buttonSmallText}>Sync From Server</Text></TouchableOpacity>
          </Row>

        </Section>

      </ScrollView>
    </SafeAreaView>
  );
}

// ---------- Small presentational components ----------
function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={{ paddingTop: 8 }}>{children}</View>
    </View>
  );
}

function ToggleRow({ label, value, onValueChange }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

function Row({ children }) {
  return <View style={styles.row}>{children}</View>;
}

function LabeledInput({ label, value, onChangeText }) {
  return (
    <View style={{ marginBottom: 8 }}>
      <Text style={{ marginBottom: 4 }}>{label}</Text>
      <TextInput style={styles.input} value={value} onChangeText={onChangeText} />
    </View>
  );
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  section: { marginBottom: 18, paddingBottom: 8, borderBottomWidth: 1, borderColor: '#eee' },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  rowLabel: { fontSize: 14, flex: 1 },
  smallMeta: { color: '#666', marginLeft: 8 },
  smallButton: { padding: 8, backgroundColor: '#0a84ff', borderRadius: 6 },
  smallButtonText: { color: 'white' },
  smallInput: { width: 80, borderWidth: 1, borderColor: '#ddd', padding: 6, borderRadius: 6, textAlign: 'center' },
  buttonSmall: { padding: 10, backgroundColor: '#0a84ff', borderRadius: 6 },
  buttonSmallText: { color: '#fff' },
  buttonDanger: { padding: 10, backgroundColor: '#c33', borderRadius: 6 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6 },
});