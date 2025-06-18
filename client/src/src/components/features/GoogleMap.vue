<template>
  <div>
    <div id="map" style="width: 100%; height: 500px; border-radius: 5px"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const emit = defineEmits(["update:modelValue"]);

const lat = ref(10.7769);
const lng = ref(106.7009);
let map;
let marker;

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ lat: 10.7769, lng: 106.7009 }),
  },
});

onMounted(() => {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: lat.value, lng: lng.value },
    zoom: 5,
  });

  marker = new google.maps.Marker({
    position: { lat: lat.value, lng: lng.value },
    map,
    draggable: true,
  });

  marker.addListener("dragend", (e) => {
    lat.value = e.latLng.lat();
    lng.value = e.latLng.lng();
  });

  map.addListener("click", (e) => {
    marker.setPosition(e.latLng);
    lat.value = e.latLng.lat();
    lng.value = e.latLng.lng();
    emit("update:modelValue", {
      lat: lat.value,
      lng: lng.value,
    });
  });
});
</script>
