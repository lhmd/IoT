import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useMessageStore = defineStore("message", {
  state: () => ({
    message_device: "",
    message_time: "",
    message_content: "",
  }),
  actions: {
    setMessageInformation(device: string, time: string, content: string) {
      this.message_device = device;
      this.message_time = time;
      this.message_content = content;
    },
  },
});
