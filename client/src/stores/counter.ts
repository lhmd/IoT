import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", () => {
  const name = ref("John Doe");
  function setName(newName: string) {
    name.value = newName;
  }
});
