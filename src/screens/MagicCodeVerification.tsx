import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import WebLayout from '../components/WebLayout';
import { db } from '../lib/db';

interface MagicCodeVerificationProps {
  email: string;
  onBack: () => void;
}

export default function MagicCodeVerification({
  email,
  onBack,
}: MagicCodeVerificationProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerifyCode = async () => {
    if (!code.trim()) {
      Alert.alert('Error', 'Please enter the magic code');
      return;
    }

    setIsLoading(true);
    try {
      await db.auth.signInWithMagicCode({ email: email, code: code.trim() });
    } catch (error) {
      Alert.alert('Error', 'Invalid magic code. Please try again.');
      console.error('Magic code verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      await db.auth.sendMagicCode({ email: email });
      Alert.alert('Success', 'Magic code resent to your email!');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend magic code. Please try again.');
      console.error('Resend magic code error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WebLayout maxWidth={400}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Enter Magic Code</Text>
          <Text style={styles.subtitle}>We sent a magic code to {email}</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter magic code"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
              maxLength={6}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleVerifyCode}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resendButton}
            onPress={handleResendCode}
            disabled={isLoading}
          >
            <Text style={styles.resendText}>Resend Code</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </WebLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 48,
    color: '#666',
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    textAlign: 'center',
    letterSpacing: 4,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resendButton: {
    alignItems: 'center',
    marginBottom: 16,
  },
  resendText: {
    color: '#007AFF',
    fontSize: 16,
  },
  backButton: {
    alignItems: 'center',
  },
  backText: {
    color: '#666',
    fontSize: 16,
  },
});
