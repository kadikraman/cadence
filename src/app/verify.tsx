import { router, useLocalSearchParams } from 'expo-router';
import MagicCodeVerification from '../screens/MagicCodeVerification';

export default function VerifyScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();

  const handleBack = () => {
    router.back();
  };

  if (!email) {
    router.replace('/login');
    return null;
  }

  return <MagicCodeVerification email={email} onBack={handleBack} />;
}
