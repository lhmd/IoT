import { defineStore } from "pinia";
import { ref, computed } from "vue";

interface Message {
  device_name: string;
  time: string;
  content: string;
  location: string;
}

export const useMessageStore = defineStore("message", {
  state: () => ({
    messages: [] as Message[],
  }),
  actions: {
    addMessage(
      device_name: string,
      time: string,
      content: string,
      location: string,
    ) {
      this.messages.push({
        device_name,
        time,
        content,
        location,
      });
    },
    removeMessage(
      device_name: string,
      time: string,
      content: string,
      location: string,
    ) {
      const messageIndex = this.messages.findIndex(
        (m) =>
          m.device_name === device_name &&
          m.time === time &&
          m.content === content,
      );
      if (messageIndex !== -1) {
        this.messages.splice(messageIndex, 1);
      }
    },
    clearMessages() {
      this.messages = [];
    },
  },
});
