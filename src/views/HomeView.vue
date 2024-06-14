<script setup lang="ts">
import RequestTree from '@/components/RequestTree.vue'
import RequestAction from '@/components/RequestAction.vue'
import MyMonacoEditor from '@/components/editor/MyMonacoEditor.vue'
import { ref, computed, nextTick } from 'vue'
import { getTreeData, onMessage, replay, type MyRequest } from '../core/request'
import { resizeDiv } from '../components/resize/resizeDiv'

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
//editor
const selectedIndex = ref(-1)
const selectedRequest = computed(() => {
  if (selectedIndex.value >= 0) {
    return requests.value[selectedIndex.value]
  }
  return null
})
const monacoEditUrl = ref()
const monacoEditReq = ref()
//diff editor
const showDiff = ref(false)
const selectedCopyIndex = ref(-1)
const selectedCopyedRequest = computed(() => {
  if (selectedCopyIndex.value >= 0) {
    return requests.value[selectedCopyIndex.value]
  }
  return null
})

onMessage(requests.value)

const treeData = computed(() => {
  return getTreeData(requests.value)
})

const handleNodeClick = (data: number) => {
  if (data >= 0) {
    selectedIndex.value = data
    showDiff.value = false
  }
  console.log(selectedRequest)
}
const handleReply = async () => {
  let method = selectedRequest.value?.method || 'GET'
  const request: MyRequest = {
    url: monacoEditUrl?.value?.getEditorValue(),
    method: method,
    headers: selectedRequest.value?.headers
  }
  if (method === 'POST') {
    request.requestBody = monacoEditReq?.value?.getEditorValue()
  }
  const data = await replay(request)
  request.responseBody = data
  requests.value.push(request)
  selectedIndex.value = requests.value.length - 1
}
const handleCopy = () => {
  if (selectedIndex.value >= 0) {
    selectedCopyIndex.value = selectedIndex.value
  }
}
const handleDiff = () => {
  showDiff.value = !showDiff.value
}
nextTick(() => {
  resizeDiv('home-view', 'left-tree', 'resize', 'right-content')
})
</script>

<template>
  <div class="home-view">
    <div class="left-tree">
      <RequestTree
        :data="treeData"
        :selected="selectedIndex"
        :copied="selectedCopyIndex"
        @request-click="handleNodeClick"
      ></RequestTree>
    </div>
    <div>
      <div class="resize" title="收缩侧边栏">⋮</div>
    </div>
    <div class="right-content">
      <div class="action">
        <RequestAction @replay="handleReply" @copy="handleCopy" @diff="handleDiff"></RequestAction>
      </div>
      <div class="request-url" v-if="selectedIndex !== -1">
        <MyMonacoEditor
          v-if="!showDiff"
          editor-id="monaco-edit-url"
          ref="monacoEditUrl"
          language="text"
          :text="selectedRequest?.url || ''"
          :height="40"
        ></MyMonacoEditor>
        <MyMonacoDiffEditor
          v-if="showDiff"
          editor-id="monaco-diff-edit-url"
          language="text"
          :original="selectedCopyedRequest?.url || ''"
          :modified="selectedRequest?.url || ''"
          :height="40"
        ></MyMonacoDiffEditor>
      </div>
      <div class="request-body" v-if="selectedIndex !== -1">
        <MyMonacoEditor
          v-if="!showDiff"
          editor-id="monaco-edit-req"
          ref="monacoEditReq"
          language="json"
          :text="selectedRequest?.requestBody || ''"
          :height="200"
        ></MyMonacoEditor>
        <MyMonacoDiffEditor
          v-if="showDiff"
          editor-id="monaco-diff-edit-req"
          language="json"
          :original="selectedCopyedRequest?.requestBody || ''"
          :modified="selectedRequest?.requestBody || ''"
          :height="200"
        ></MyMonacoDiffEditor>
      </div>
      <div class="response" v-if="selectedIndex !== -1">
        <MyMonacoEditor
          v-if="!showDiff"
          editor-id="monaco-edit-resp"
          language="json"
          :text="selectedRequest?.responseBody || ''"
          height="calc(100vh - 340px)"
        ></MyMonacoEditor>
        <MyMonacoDiffEditor
          v-if="showDiff"
          editor-id="monaco-diff-edit-resp"
          language="json"
          :original="selectedCopyedRequest?.responseBody || ''"
          :modified="selectedRequest?.responseBody || ''"
          height="calc(100vh - 340px)"
        ></MyMonacoDiffEditor>
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
  height: calc(100vh - 100px);
  overflow: scroll;
  overflow-y: scroll;
}
.resize {
  cursor: col-resize;
  float: left;
  position: relative;
  top: 45%;
  background-color: #d6d6d6;
  border-radius: 5px;
  margin-top: -10px;
  width: 8px;
  height: 32px;
  background-size: cover;
  background-position: center;
  font-size: 18px;
  color: white;
}
/*拖拽区鼠标悬停样式*/
.resize:hover {
  color: #444444;
}
.right-content {
  width: calc(70% - 10px);
}
.action {
  padding-left: 24px;
  padding-bottom: 10px;
}
</style>
