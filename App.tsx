import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import mqtt, { MqttClient } from "mqtt";

// ✅ Use WebSocket Secure (React Native requires WebSocket)
const MQTT_BROKER = "wss://0rpdnt.stackhero-network.com:8884/mqtt";
const MQTT_TOPIC = "demo/reactnative/mqtt";

export default function App() {
  const insets = useSafeAreaInsets();
  const [client, setClient] = useState<MqttClient | null>(null);
  const [message, setMessage] = useState("");
  const [received, setReceived] = useState("");

  useEffect(() => {
    console.log("🔄 Connecting to MQTT...");

    const mqttClient = mqtt.connect(MQTT_BROKER, {
      username: "admin",
      password: "OB4bVpQfW3WVH2awqNSJH9mcM7ci0LlI",
      protocol: "wss", // 👈 force WebSocket
      clean: true,
      reconnectPeriod: 2000,
      connectTimeout: 30 * 1000,
    });

    mqttClient.on("connect", () => {
      console.log("✅ Connected to MQTT broker");
      mqttClient.subscribe(MQTT_TOPIC, { qos: 1 }, (err, granted) => {
        if (err) {
          console.error("❌ Subscribe error:", err);
        } else {
          console.log("📡 Subscribed:", granted);
        }
      });
    });

    mqttClient.on("message", (topic, msg) => {
      const text = msg.toString();
      console.log("📩 Incoming:", topic, text);
      if (topic === MQTT_TOPIC) {
        setReceived(text);
      }
    });

    mqttClient.on("reconnect", () => {
      console.log("🔄 Reconnecting...");
    });

    mqttClient.on("error", (err) => {
      console.error("❌ MQTT Error:", err.message);
    });

    mqttClient.stream.on("error", (err: any) => {
      console.error("🔍 Stream error:", err.message);
    });

    mqttClient.on("close", () => {
      console.log("❌ Connection closed");
    });

    setClient(mqttClient);

    return () => {
      console.log("👋 Disconnecting...");
      mqttClient.end();
    };
  }, []);

  const publish = () => {
    if (!client) {
      console.warn("⚠️ No MQTT client yet");
      return;
    }
    if (!message.trim()) {
      console.warn("⚠️ Message is empty");
      return;
    }

    console.log("🚀 Publishing:", message.trim());
    client.publish(MQTT_TOPIC, message.trim(), { qos: 1 }, (err) => {
      if (err) {
        console.error("❌ Publish error:", err);
      } else {
        console.log("✅ Publish success");
      }
    });
    setMessage("");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.wrapper, { paddingTop: insets.top }]}>
        <Text style={styles.title}>MQTT Demo with Auth</Text>

        <TextInput
          placeholder="Enter message"
          style={styles.input}
          value={message}
          onChangeText={setMessage}
        />

        <TouchableOpacity style={styles.btn} onPress={publish}>
          <Text style={styles.btnText}>PUBLISH</Text>
        </TouchableOpacity>

        <Text style={styles.subtitle}>Last Received Message:</Text>
        <Text style={styles.received}>{received || "None value"}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderColor: "#888",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitle: {
    marginTop: 24,
    fontSize: 18,
    fontWeight: "500",
  },
  received: {
    fontSize: 16,
    color: "green",
    marginTop: 8,
  },
});
