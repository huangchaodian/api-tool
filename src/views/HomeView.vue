<script setup lang="ts">
import RequestTree from '@/components/RequestTree.vue'
</script>

<template>
  <div>
    <div class="left-tree">
      <RequestTree></RequestTree>
    </div>
    <div class="right-content">
      <div class="request-url"></div>
      <div class="request-body"></div>
      <div class="response"></div>
    </div>
  </div>
</template>
