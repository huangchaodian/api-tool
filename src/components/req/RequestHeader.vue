<script setup lang="ts">
import { ref } from 'vue'
defineProps<{
  showDiff: boolean
  header: [string, string][] | undefined
  orgHeader: [string, string][] | undefined
}>()

const monacoEditHeader = ref()
const getEditorValue = () => {
  return JSON.parse(monacoEditHeader.value.getEditorValue())
}
const layout = () => {
  return monacoEditHeader.value.layout()
}
defineExpose({ getEditorValue, layout })
</script>
<template>
  <MyMonacoEditor
    v-if="!showDiff"
    editor-id="monaco-edit-header"
    ref="monacoEditHeader"
    language="json"
    :text="JSON.stringify(header) || ''"
    :height="200"
  ></MyMonacoEditor>
  <MyMonacoDiffEditor
    v-if="showDiff"
    editor-id="monaco-diff-edit-header"
    language="json"
    :original="JSON.stringify(orgHeader) || ''"
    :modified="JSON.stringify(header) || ''"
    :height="200"
  ></MyMonacoDiffEditor>
</template>
