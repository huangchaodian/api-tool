<script setup lang="ts">
import RequestTree from '@/components/RequestTree.vue'
import RequestAction from '@/components/RequestAction.vue'
import MyMonacoEditor from '@/components/editor/MyMonacoEditor.vue'
import { ref, computed } from 'vue'
import { getTreeData, onMessage, replay } from '../core/request'

const requests = ref<MyRequest[]>([
  // {
  //   url: 'http://localhost/test/tmp',
  //   method: 'POST',
  //   requestBody: '{"a":1,"b":2}',
  //   responseBody: '{"c":3,"d":4}'
  // },
  // {
  //   url: 'http://localhost/test/tmp',
  //   method: 'POST',
  //   requestBody: '{"a":5,"b":6}',
  //   responseBody: '{"c":7,"d":8}'
  // }
])
const selectedRequest = ref<MyRequest>()
const monacoEditUrl = ref()
const monacoEditReq = ref()

onMessage(requests.value)

const treeData = computed(() => {
  return getTreeData(requests.value)
})
const url = computed(() => {
  return selectedRequest?.value?.url || ''
})
const requestBody = computed(() => {
  return selectedRequest?.value?.requestBody || 'null'
})
const responseBody = computed(() => {
  return selectedRequest?.value?.responseBody || 'null'
})

const handleNodeClick = (data: number) => {
  data ? (selectedRequest.value = requests.value[data]) : null
}
const handleReply = () => {
  console.log(monacoEditReq?.value?.getEditorValue())
  const request: MyRequest = {
    url: monacoEditUrl?.value?.getEditorValue(),
    method: 'POST',
    requestBody: monacoEditReq?.value?.getEditorValue()
  }
  replay(request, requests.value)
}
</script>

<template>
  <div class="home-view">
    <div class="left-tree">
      <RequestTree :data="treeData" @request-click="handleNodeClick"></RequestTree>
    </div>
    <div class="right-content">
      <div class="action"><RequestAction @replay="handleReply"></RequestAction></div>
      <div class="request-url">
        <MyMonacoEditor
          editor-id="monaco-edit-url"
          ref="monacoEditUrl"
          language="text"
          :value="url"
          :height="20"
        ></MyMonacoEditor>
      </div>
      <div class="request-body">
        <MyMonacoEditor
          editor-id="monaco-edit-req"
          ref="monacoEditReq"
          language="json"
          :value="requestBody"
          :height="200"
        ></MyMonacoEditor>
      </div>
      <div class="response">
        <MyMonacoEditor
          editor-id="monaco-edit-resp"
          language="json"
          :value="responseBody"
          height="calc(100vh - 340px)"
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
  width: 20%;
}
.right-content {
  width: 80%;
}
.action {
  padding-left: 24px;
  padding-bottom: 10px;
}
</style>
