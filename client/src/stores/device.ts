import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useDeviceStore = defineStore("device", {
  state: () => ({
    device_name: "",
    device_type: "",
    device_status: "",
    device_location: "",
    device_description: "",
    device_owner: "",
    message_count: 0,
  }),
  actions: {
    setDeviceInformation(
      name: string,
      type: string,
      status: string,
      location: string,
      description: string,
      owner: string,
    ) {
      this.device_name = name;
      this.device_type = type;
      this.device_status = status;
      this.device_location = location;
      this.device_description = description;
      this.device_owner = owner;
    },
    setMessageCount(count: number) {
      this.message_count = count;
    },
  },
});
