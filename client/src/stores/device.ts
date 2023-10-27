import { defineStore } from "pinia";
import { ref, computed } from "vue";

interface Device {
  name: string;
  type: string;
  status: string;
  location: string;
  description: string;
  owner: string;
  message_count: number;
}

export const useDeviceStore = defineStore("device", {
  state: () => ({
    devices: [] as Device[],
  }),
  actions: {
    addDevice(
      name: string,
      type: string,
      status: string,
      location: string,
      description: string,
      owner: string
    ) {
      this.devices.push({
        name,
        type,
        status,
        location,
        description,
        owner,
        message_count: 0,
      });
    },
    updateDevice(name: string, deviceInfo: Partial<Device>) {
      const deviceIndex = this.devices.findIndex((d) => d.name === name);
      if (deviceIndex !== -1) {
        this.devices[deviceIndex] = {
          ...this.devices[deviceIndex],
          ...deviceInfo,
        };
      }
    },
    removeDevice(name: string) {
      const deviceIndex = this.devices.findIndex((d) => d.name === name);
      if (deviceIndex !== -1) {
        this.devices.splice(deviceIndex, 1);
      }
    },
    setMessageCount(name: string, count: number) {
      const deviceIndex = this.devices.findIndex((d) => d.name === name);
      if (deviceIndex !== -1) {
        this.devices[deviceIndex].message_count = count;
      }
    },
    clearDevices() {
      this.devices = [];
    },
  },
});
