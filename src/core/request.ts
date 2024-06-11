export function getTreeData(requests: Request[]): Tree[] {
  console.log(requests)
  const tree: Tree[] = []
  for (const i in requests) {
    const r = requests[i]
    const url = new URL(r.url)
    const host = url.host
    const uri = url.pathname

    if (!tree.map((e) => e.label).includes(host)) {
      tree.push({
        label: host,
        children: []
      })
    }
    const paths = uri.split('/').slice(1)
    let children = tree.find((e) => e.label === host).children
    for (const j in paths) {
      const path = paths[j]
      if (j == paths.length - 1) {
        children.push({
          id: i,
          label: path
        })
      } else if (!children.map((e) => e.label).includes(path)) {
        children.push({
          label: path,
          children: []
        })
      }
      children = children.find((e) => e.label === path).children
    }
  }
  return tree
}
