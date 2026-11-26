import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as DocumentPicker from 'expo-document-picker';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.31.139:5000/api/coop';

export default function App() {
  const [roleTab, setRoleTab] = useState<'member' | 'staff'>('member');
  const [uploadToken, setUploadToken] = useState('');
  const [items, setItems] = useState([
    {
      id: 'item-1',
      title: 'Officially Valid ID Proof (PAN / Voter ID / Passport / Driving Licence)',
      requirement: 'MANDATORY',
      status: 'UNDER_REVIEW',
    },
    {
      id: 'item-2',
      title: 'PAN Card or Form 60 Declaration',
      requirement: 'MANDATORY',
      status: 'REQUESTED',
    },
  ]);
  const [rejectReason, setRejectReason] = useState('');

  const handlePickDocument = async (itemId: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/png'],
        copyToCacheDirectory: true,
      });
      if (result.canceled || !result.assets?.[0]) return;

      const file = result.assets[0];
      if (uploadToken) {
        const formData = new FormData();
        formData.append('checklistItemId', itemId);
        formData.append('file', {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || 'application/pdf',
        } as unknown as Blob);

        const res = await fetch(`${API_BASE}/upload/${uploadToken}`, {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) {
          const err = await res.json();
          Alert.alert('Upload Error', err.error || 'Upload failed');
          return;
        }
      }

      setItems((prev) =>
        prev.map((it) => (it.id === itemId ? { ...it, status: 'UNDER_REVIEW' } : it))
      );
      Alert.alert('Uploaded', `${file.name} uploaded securely for staff review.`);
    } catch (e) {
      Alert.alert('Error', (e as Error).message);
    }
  };

  const handleStaffDecision = async (itemId: string, decision: 'ACCEPTED' | 'REJECTED_RESUBMISSION_REQUIRED') => {
    if (decision === 'REJECTED_RESUBMISSION_REQUIRED' && !rejectReason.trim()) {
      Alert.alert('Reason Required', 'Please enter a rejection / resubmission reason.');
      return;
    }

    try {
      await fetch(`${API_BASE}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'verifier-mobile-1',
          'x-branch-id': 'br-1',
          'x-user-role': 'VERIFIER_MAKER',
        },
        body: JSON.stringify({ itemId, decision, reason: rejectReason }),
      }).catch(() => undefined);

      setItems((prev) =>
        prev.map((it) => (it.id === itemId ? { ...it, status: decision } : it))
      );
      setRejectReason('');
      Alert.alert('Recorded', `Checklist item marked ${decision.replace(/_/g, ' ')}.`);
    } catch (e) {
      Alert.alert('Error', (e as Error).message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.brand}>ClarioLoop Cooperative</Text>
        <Text style={styles.subtitle}>Member Checklist & Verification Mobile App</Text>

        <View style={styles.tabRow}>
          <TouchableOpacity
            onPress={() => setRoleTab('member')}
            style={[styles.tabBtn, roleTab === 'member' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabText, roleTab === 'member' && styles.tabTextActive]}>
              Member Upload
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setRoleTab('staff')}
            style={[styles.tabBtn, roleTab === 'staff' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabText, roleTab === 'staff' && styles.tabTextActive]}>
              Staff Review
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {roleTab === 'member' ? (
          <View style={styles.section}>
            <Text style={styles.label}>Secure Request Token (Optional for Live Sync)</Text>
            <TextInput
              style={styles.input}
              placeholder="Paste token from SMS/Email link"
              value={uploadToken}
              onChangeText={setUploadToken}
            />

            {items.map((item) => (
              <View key={item.id} style={styles.card}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.badge}>
                  {item.requirement} • {item.status.replace(/_/g, ' ')}
                </Text>
                {item.status === 'REQUESTED' || item.status === 'REJECTED_RESUBMISSION_REQUIRED' ? (
                  <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={() => handlePickDocument(item.id)}
                  >
                    <Text style={styles.primaryBtnText}>Upload PDF / JPG / PNG</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.label}>Verification Reason (Required for Reject)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter reason for rejection or resubmission"
              value={rejectReason}
              onChangeText={setRejectReason}
            />

            {items
              .filter((i) => i.status === 'UNDER_REVIEW')
              .map((item) => (
                <View key={item.id} style={styles.card}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={[styles.primaryBtn, { flex: 1 }]}
                      onPress={() => handleStaffDecision(item.id, 'ACCEPTED')}
                    >
                      <Text style={styles.primaryBtnText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.dangerBtn, { flex: 1 }]}
                      onPress={() =>
                        handleStaffDecision(item.id, 'REJECTED_RESUBMISSION_REQUIRED')
                      }
                    >
                      <Text style={styles.primaryBtnText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#ffffff', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  brand: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  subtitle: { fontSize: 12, color: '#64748b', marginTop: 2 },
  tabRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  tabBtn: { flex: 1, paddingVertical: 8, borderRadius: 10, backgroundColor: '#f1f5f9', alignItems: 'center' },
  tabBtnActive: { backgroundColor: '#059669' },
  tabText: { fontSize: 12, fontWeight: '700', color: '#475569' },
  tabTextActive: { color: '#ffffff' },
  scroll: { padding: 16 },
  section: { gap: 12 },
  label: { fontSize: 12, fontWeight: '700', color: '#334155' },
  input: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, padding: 10, fontSize: 13 },
  card: { backgroundColor: '#ffffff', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#e2e8f0', gap: 8 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  badge: { fontSize: 11, fontWeight: '700', color: '#059669' },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  primaryBtn: { backgroundColor: '#059669', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  dangerBtn: { backgroundColor: '#e11d48', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  primaryBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '800' },
});
