<script setup lang="ts">
import * as monaco from 'monaco-editor'
import { nextTick, watch } from 'vue'

const props = defineProps<{
  editorId: string
  original: string
  modified: string
  language: string
  height: number | string
}>()
let diffEditInstance: monaco.editor.IStandaloneDiffEditor | null = null

const getJsonModel = (data: string) => {
  try {
    return monaco.editor.createModel(JSON.stringify(JSON.parse(data), null, '\t'), 'json')
  } catch (e) {
    console.log(e)
  }
  return monaco.editor.createModel(data, 'text')
}
nextTick(() => {
  let editorDom = document.getElementById(props.editorId)
  if (editorDom !== null) {
    diffEditInstance = monaco.editor.createDiffEditor(editorDom)
    if (props.language === 'text') {
      diffEditInstance.setModel({
        original: monaco.editor.createModel(props.original, props.language),
        modified: monaco.editor.createModel(props.modified, props.language)
      })
    } else if (props.language === 'json') {
      diffEditInstance.setModel({
        original: getJsonModel(props.original),
        modified: getJsonModel(props.modified)
      })
    }
  }
})
watch(
  () => [props.original, props.modified],
  () => {
    if (diffEditInstance) {
      if (props.language === 'text') {
        diffEditInstance.setModel({
          original: monaco.editor.createModel(props.original, props.language),
          modified: monaco.editor.createModel(props.modified, props.language)
        })
      } else if (props.language === 'json') {
        diffEditInstance.setModel({
          original: getJsonModel(props.original),
          modified: getJsonModel(props.modified)
        })
      }
    }
  }
)
</script>
<template>
  <div
    :id="editorId"
    :style="{ height: typeof height === 'number' ? height + 'px' : height }"
  ></div>
</template>
