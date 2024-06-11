<script setup lang="ts">
import RequestTree from '@/components/RequestTree.vue'
import RequestAction from '@/components/RequestAction.vue'
import MyMonacoEditor from '@/components/MyMonacoEditor.vue'
</script>

<template>
  <div class="home-view">
    <div class="left-tree">
      <RequestTree></RequestTree>
    </div>
    <div class="right-content">
      <div class="action"><RequestAction></RequestAction></div>
      <div class="request-url">
        <MyMonacoEditor
          editor-id="url"
          language="text"
          :value="'test'"
          height="20"
        ></MyMonacoEditor>
      </div>
      <div class="request-body">
        <MyMonacoEditor editor-id="req" language="json" value="{}" height="100"></MyMonacoEditor>
      </div>
      <div class="response">
        <MyMonacoEditor editor-id="resp" language="json" value="{}" height="100"></MyMonacoEditor>
      </div>
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
