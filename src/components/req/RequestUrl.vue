<script setup lang="ts">
import { ref } from 'vue'
defineProps<{
  showDiff: boolean
  url: string
  orgUrl: string
}>()

const monacoEditUrl = ref()
const getEditorValue = () => {
  return monacoEditUrl.value.getEditorValue()
}
defineExpose({ getEditorValue })
</script>
<template>
  <MyMonacoEditor
    v-if="!showDiff"
    editor-id="monaco-edit-url"
    ref="monacoEditUrl"
    language="text"
    :text="url"
    :height="40"
  ></MyMonacoEditor>
  <MyMonacoDiffEditor
    v-if="showDiff"
    editor-id="monaco-diff-edit-url"
    language="text"
    :original="orgUrl"
    :modified="url"
    :height="40"
  ></MyMonacoDiffEditor>
</template>
