<script setup lang="ts">
import RequestTree from '@/components/RequestTree.vue'
import RequestAction from '@/components/RequestAction.vue'
import MyMonacoEditor from '@/components/editor/MyMonacoEditor.vue'
import { ref, computed } from 'vue'

const requests = ref([
  {
    host: 'localhost',
    uri: '/test/tmp',
    requestBody: '{"a":1,"b":2}',
    responseBody: '{"c":3,"d",4}'
  }
])
const treeData = computed(() => {
  let nodes = []
  for (let request of requests.value) {
    if (!nodes.map((e) => e.label).includes(request.host)) {
      nodes.push({
        label: request.host,
        children: []
      })
    }
  }
  return nodes
})
</script>

<template>
  <div class="home-view">
    <div class="left-tree">
      <RequestTree :data="treeData"></RequestTree>
    </div>
    <div class="right-content">
      <div class="action"><RequestAction></RequestAction></div>
      <div class="request-url">
        <MyMonacoEditor
          editor-id="monaco-edit-url"
          language="text"
          :value="'test'"
          :height="20"
        ></MyMonacoEditor>
      </div>
      <div class="request-body">
        <MyMonacoEditor
          editor-id="monaco-edit-req"
          language="json"
          value="{}"
          :height="100"
        ></MyMonacoEditor>
      </div>
      <div class="response">
        <MyMonacoEditor
          editor-id="monaco-edit-resp"
          language="json"
          value="{}"
          :height="100"
        ></MyMonacoEditor>
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
