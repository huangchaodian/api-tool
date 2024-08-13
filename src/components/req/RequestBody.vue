<script setup lang="ts">
import { ref } from 'vue'
defineProps<{
  showDiff: boolean
  body: string
  orgBody: string
}>()

const monacoEditReq = ref()
const getEditorValue = () => {
  return monacoEditReq.value.getEditorValue()
}
const layout = () => {
  return monacoEditReq.value.layout()
}
defineExpose({ getEditorValue, layout })
</script>
<template>
  <MyMonacoEditor
    v-if="!showDiff"
    editor-id="monaco-edit-req"
    ref="monacoEditReq"
    language="json"
    :text="body"
    :height="200"
  ></MyMonacoEditor>
  <MyMonacoDiffEditor
    v-if="showDiff"
    editor-id="monaco-diff-edit-req"
    language="json"
    :original="orgBody"
    :modified="body"
    :height="200"
  ></MyMonacoDiffEditor>
</template>
