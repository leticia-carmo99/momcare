import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Switch 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const PINK = "#C31E65";

export default function SettingsScreen({ navigation }) {
  const [reminder, setReminder] = useState(false);
  const [tips, setTips] = useState(false);
  const [newArticles, setNewArticles] = useState(false);
  const [community, setCommunity] = useState(false);
  const [publicProfile, setPublicProfile] = useState(true);
  const [comments, setComments] = useState(true);

  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER FIXO */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={PINK} />
          <View style={{ marginLeft: 8 }}>
            <Text style={[styles.title, { color: PINK }]}>Configurações</Text>
            <Text style={styles.subtitle}>Acesso rápido</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* CONTEÚDO ROLÁVEL */}
      <View style={{ flex: 1 }}>
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="notifications-outline" size={20} color={PINK} />
              <Text style={styles.cardTitle}>Notificações</Text>
            </View>

            <SettingRow 
              title="Lembretes de tarefas"
              desc="Notificações de tarefas próximas"
              value={reminder}
              onValueChange={setReminder}
            />

            <SettingRow 
              title="Dicas diárias"
              desc="Receber dicas personalizadas"
              value={tips}
              onValueChange={setTips}
            />

            <SettingRow 
              title="Novos artigos"
              desc="Notificação de novos conteúdos"
              value={newArticles}
              onValueChange={setNewArticles}
            />

            <SettingRow 
              title="Comunidade"
              desc="Atividades do fórum"
              value={community}
              onValueChange={setCommunity}
            />
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="shield-outline" size={20} color={PINK} />
              <Text style={styles.cardTitle}>Privacidade</Text>
            </View>

            <SettingRow 
              title="Perfil público"
              desc="Permitir que outras mães vejam seu perfil"
              value={publicProfile}
              onValueChange={setPublicProfile}
            />

            <SettingRow 
              title="Comentários"
              desc="Receber comentário no seu post"
              value={comments}
              onValueChange={setComments}
            />
          </View>

          <SettingsButton icon="settings-outline" text="Configurações Gerais" />
          <SettingsButton icon="alert-circle-outline" text="Segurança da Conta" />
          <SettingsButton icon="help-circle-outline" text="Ajuda e Suporte" />
          <SettingsButton icon="heart-outline" text="Avaliar o App" />

        </ScrollView>
      </View>

    </SafeAreaView>
  );
}

function SettingRow({ title, desc, value, onValueChange }) {
  return (
    <View style={styles.settingRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDesc}>{desc}</Text>
      </View>

      <Switch
        trackColor={{ false: "#ccc", true: PINK + "66" }}
        thumbColor={value ? PINK : "#f4f3f4"}
        ios_backgroundColor="#ccc"
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );
}

function SettingsButton({ icon, text }) {
  return (
    <TouchableOpacity style={styles.button}>
      <Ionicons name={icon} size={20} color={PINK} />
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff"
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center"
  },

  title: {
    fontSize: 20,
    fontWeight: "700"
  },

  subtitle: {
    fontSize: 13,
    color: "#888"
  },

  card: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 1
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10
  },

  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12
  },

  settingTitle: {
    fontSize: 15,
    fontWeight: "600"
  },

  settingDesc: {
    fontSize: 12,
    color: "#777"
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 10,
    elevation: 1
  },

  buttonText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "500"
  }
});
