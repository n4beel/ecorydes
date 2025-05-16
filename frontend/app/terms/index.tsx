import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View, Text } from 'react-native';
import { getStyles } from './styles';
import Header from '@/components/Header';

const termsData = [
  { title: 'Acceptance of Terms', content: 'By accessing or using the [App Name] mobile application ("App"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, please do not use the App.' },
  { title: 'Eligibility', content: 'You must be at least 18 years old to use the App. By using the App, you represent and warrant that you meet this requirement.' },
  { title: 'Account Registration', content: 'To use certain features of the App, you may be required to register for an account. You agree to provide accurate and complete information during the registration process and to keep your account information up to date.' },
  { title: 'Wallet Integration and Token Usage', content: 'The App integrates with blockchain wallets to facilitate transactions using digital tokens. By connecting your wallet, you authorize the App to interact with your wallet for transaction purposes. You are solely responsible for maintaining the security of your wallet and private keys.' },
  { title: 'Smart Contracts', content: 'Transactions within the App may be executed via smart contracts on the [Specify Blockchain, e.g., Solana] network. You acknowledge that once a transaction is submitted to the blockchain, it cannot be altered, reversed, or refunded.' },
  { title: 'Ride Sharing Services', content: 'The App allows users to offer and accept carpooling services. All arrangements are made directly between users. The App serves as a platform to facilitate these connections and does not guarantee the quality, safety, or legality of the services provided.' },
  { title: 'User Conduct', content: 'You agree not to: use the App for any unlawful purpose, impersonate any person or entity, interfere with or disrupt the App\'s operations, engage in any activity that could harm or exploit minors.' },
  { title: 'Fees and Payments', content: 'Transactions may involve fees, including but not limited to service fees and blockchain transaction fees ("gas fees"). All fees will be disclosed prior to transaction confirmation. You are responsible for all fees associated with your use of the App.' },
  { title: 'Intellectual Property', content: 'All content, trademarks, and data on the App, including but not limited to software, databases, text, graphics, icons, and hyperlinks are the property of or licensed to [Company Name], and are protected from infringement by local and international legislation.' },
  { title: 'Privacy Policy', content: 'Your use of the App is also governed by our Privacy Policy, which can be found at [Insert Link to Privacy Policy].' },
  { title: 'Disclaimers', content: 'The App is provided on an "as-is" and "as-available" basis. [Company Name] makes no warranties, expressed or implied, regarding the App\'s operation or the information, content, or materials included therein.' },
  { title: 'Limitation of Liability', content: 'To the fullest extent permitted by law, [Company Name] shall not be liable for any damages arising out of or in connection with your use of the App, including but not limited to direct, indirect, incidental, punitive, and consequential damages.' },
  { title: 'Indemnification', content: 'You agree to indemnify and hold harmless [Company Name], its affiliates, and their respective officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses arising out of or in any way connected with your use of the App.' },
  { title: 'Termination', content: '[Company Name] reserves the right to suspend or terminate your access to the App at any time, without notice, for conduct that [Company Name] believes violates these Terms or is harmful to other users of the App, [Company Name], or third parties.' },
  { title: 'Changes to Terms', content: 'We may modify these Terms at any time. Any changes will be effective immediately upon posting. Your continued use of the App after changes are posted constitutes your acceptance of the new Terms.' },
  { title: 'Governing Law', content: 'These Terms shall be governed by and construed in accordance with the laws of [Insert Jurisdiction], without regard to its conflict of law principles.' },
  { title: 'Contact Information', content: 'For any questions about these Terms, please contact us at [Insert Contact Information].' },
];

const Terms = () => {
  const styles = getStyles();

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
        <Header title="Terms & Condition" />
      </View>
      <ScrollView style={{ paddingHorizontal: 15, marginTop: 10 }}>
        {termsData.map((term, index) => (
          <View key={index} style={{ marginBottom: 15 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 5 }}>
              {index + 1}. {term.title}
            </Text>
            <Text style={{ fontSize: 14, lineHeight: 20, color: '#555' }}>
              {term.content}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Terms;
