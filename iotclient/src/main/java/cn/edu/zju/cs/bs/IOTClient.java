package cn.edu.zju.cs.bs;

import java.io.FileInputStream;
import java.util.Properties;
import java.util.Vector;

public class IOTClient {
    public static void main(String[] args) {
        int devices = 1;
        String mqttServer = "tcp://localhost:1883";
        String topic = "testapp";

        try {
            Properties properties = new Properties();
            FileInputStream in = new FileInputStream("iot.properties");
            properties.load(in);
            devices = Integer.parseInt(properties.getProperty("devices"));
            mqttServer = properties.getProperty("server");
            topic = properties.getProperty("topic");

            Vector<WorkerThread> threadVector = new Vector<WorkerThread>();
            for (int i = 0; i < devices; i++) {
                WorkerThread thread = new WorkerThread();
                thread.setDeviceId(i + 1);
                thread.setMqttServer(mqttServer);
                thread.setTopic(topic);
                threadVector.add(thread);
                thread.start();
            }
            for (WorkerThread thread : threadVector) {
                thread.join();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
