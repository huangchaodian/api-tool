<script setup lang="ts">
import RequestTree from '@/components/RequestTree.vue'
import RequestAction from '@/components/RequestAction.vue'
</script>

<template>
  <div class="home-view">
    <div class="left-tree">
      <RequestTree></RequestTree>
    </div>
    <div class="right-content">
      <div class="action"><RequestAction></RequestAction></div>
      <div class="request-url"></div>
      <div class="request-body"></div>
      <div class="response"></div>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  display: flex;
}
.left-tree {
  width: 30%;
}
.right-content {
  width: 70%;
}
</style>
