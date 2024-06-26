<script setup lang="ts">
import RequestTree from '@/components/RequestTree.vue'
import RequestAction from '@/components/RequestAction.vue'
import MyMonacoEditor from '@/components/editor/MyMonacoEditor.vue'
import { ref, computed, nextTick, toRaw } from 'vue'
import {
  getTreeData,
  onMessage,
  replay,
  clearHistoryMessage,
  type MyRequest
} from '../core/request'
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
const DEFAULT_INDEX = -1
//editor
const selectedIndex = ref(DEFAULT_INDEX)
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
const selectedCopyIndex = ref(DEFAULT_INDEX)
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
  }
  console.log(selectedRequest)
}
const disableReplay = ref(false)
const handleReply = async () => {
  let method = selectedRequest.value?.method || 'GET'
  const request: MyRequest = {
    url: monacoEditUrl?.value?.getEditorValue(),
    method: method,
    headers: toRaw(selectedRequest.value?.headers)
  }
  if (method.toLocaleUpperCase() === 'POST') {
    request.requestBody = monacoEditReq?.value?.getEditorValue()
  }
  disableReplay.value = true
  const data = await replay(request)
  disableReplay.value = false
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
  if (selectedIndex.value >= 0) {
    selectedCopyIndex.value = selectedIndex.value
  }
  if (showDiff.value) {
    selectedCopyIndex.value = DEFAULT_INDEX
  }

  showDiff.value = !showDiff.value
}
const handleClear = () => {
  requests.value.splice(0, requests.value.length)
  clearHistoryMessage(requests.value)
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
        <RequestAction
          :disable-replay="disableReplay"
          @replay="handleReply"
          @copy="handleCopy"
          @diff="handleDiff"
          @clear="handleClear"
        ></RequestAction>
      </div>
      <div class="request-url">
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
      <div class="request-body">
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
      <div class="response">
        <MyMonacoEditor
          v-if="!showDiff"
          editor-id="monaco-edit-resp"
          language="json"
          :text="selectedRequest?.responseBody || ''"
          height="calc(100vh - 440px)"
        ></MyMonacoEditor>
        <MyMonacoDiffEditor
          v-if="showDiff"
          editor-id="monaco-diff-edit-resp"
          language="json"
          :original="selectedCopyedRequest?.responseBody || ''"
          :modified="selectedRequest?.responseBody || ''"
          height="calc(100vh - 440px)"
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
  background-color: white;
  padding-top: 2rem;
  padding-left: 2rem;
  width: 400px;
  height: 100vh;
  overflow: scroll;
  overflow-y: scroll;
}
.resize {
  cursor: col-resize;
  float: left;
  position: relative;
  top: 50%;
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
  width: calc(100% - 400px);
}
.action {
  margin-top: 10px;
  border-radius: 12px 12px 0 0;
  border-bottom: 1px solid #f0f0f0;
  background-color: white;
  padding-top: 24px;
  padding-left: 24px;
  padding-bottom: 10px;
}
.request-url {
  padding-top: 24px;
  background-color: white;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}
.request-body {
  padding-top: 24px;
  background-color: white;
  padding-bottom: 10px;
  border-radius: 0 0 12px 12px;
}
.response {
  margin-top: 12px;
  padding-top: 24px;
  border-radius: 12px 12px 0 0;
  background-color: white;
  padding-bottom: 10px;
}
</style>
