import { useState } from 'react';
import {
  StyleSheet, Text, View, StatusBar, TextInput, Platform, Pressable, ScrollView,
  ActivityIndicator, Alert, Keyboard
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

const statusBarHeight = StatusBar.currentHeight;
const KEY_GPT = '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';

export default function App() {

  const [bookName, setBookName] = useState("");
  const [days, setDays] = useState(3);
  const [loading, setLoading] = useState(false);
  const [bookInfo, setBookInfo] = useState("")

  async function handleGenerate() {
    if (bookName === "") {
      Alert.alert("Olá", "Preencha o nome do livro que deseja ler!")
      return;
    }
  
    if (bookName.length < 3) {
      Alert.alert("Olá", "O nome do livro deve ter pelo menos 3 caracteres.")
      return;
    }
  
    if (days < 1 || days > 30) {
      Alert.alert("Olá", "O número de dias deve estar entre 1 e 30.")
      return;
    }

    setBookInfo ("")
    setLoading(true);
    Keyboard.dismiss();

    const prompt = `Busque a quantidade de páginas do livro "${bookName}" e calcule a quantidade de páginas para serem lidas por dia em ${days.toFixed(0)} dias. Forneça um breve resumo do livro "${bookName}" e informações adicionais sobre ele.`

    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KEY_GPT}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.20,
        max_tokens: 500,
        top_p: 1,
      })
    })
      .then(response => response.json())
      .then((data) => {
        console.log(data.choices[0].message.content);
        setBookInfo(data.choices[0].message.content)
      })
      .catch((error) => {
        console.log(error);
      })  
      .finally(() => {
        setLoading(false);
      })

  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent={true} backgroundColor="#F1F1F1" />
      <Text style={styles.heading}>ReadTracker</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Livro que deseja ler</Text>
        <TextInput
          placeholder="Ex: Tartarugas até lá embaixo"
          style={styles.input}
          value={bookName}
          onChangeText={(text) => setBookName(text)}
        />

        <Text style={styles.label}>Dias em que deseja terminar o livro: <Text style={styles.days}> {days.toFixed(0)} </Text> dias</Text>
        <Slider
          minimumValue={1}
          maximumValue={7}
          minimumTrackTintColor="#009688"
          maximumTrackTintColor="#000000"
          value={days}
          onValueChange={(value) => setDays(value)}
        />
      </View>

      <Pressable style={styles.button} onPress={handleGenerate}>
  <Text style={styles.buttonText}>Gerar resumo</Text> 
  <MaterialIcons name="book" size={24} color="#FFF" />
</Pressable>

      <ScrollView contentContainerStyle={{ paddingBottom: 24, marginTop: 4, }} style={styles.containerScroll} showsVerticalScrollIndicator={false} >
        {loading && (
          <View style={styles.content}>
            <Text style={styles.title}>Calculando dias...</Text>
            <ActivityIndicator color="#000" size="large" />
          </View>
        )}

        {bookInfo && (
          <View style={styles.content}>
            <Text style={styles.title}>Resumo do livro 👇</Text>
            <Text style={{ lineHeight: 24, }}>{bookInfo}</Text>
          </View>
        )}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    paddingTop: 20,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingTop: Platform.OS === 'android' ? statusBarHeight : 54
  },
  form: {
    backgroundColor: '#FFF',
    width: '90%',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#94a3b8',
    padding: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  days: {
    backgroundColor: '#F1f1f1'
  },
  button: {
    backgroundColor: '#6aa3a2',
    width: '90%',
    borderRadius: 8,
    flexDirection: 'row',
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold'
  },
  content: {
    backgroundColor: '#FFF',
    padding: 16,
    width: '100%',
    marginTop: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 14
  },
  containerScroll: {
    width: '90%',
    marginTop: 8,
  }
});

