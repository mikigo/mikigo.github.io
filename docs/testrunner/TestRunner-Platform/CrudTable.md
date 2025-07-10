# CrudTable.vue 组件详解

## 📁 文件结构概览

```vue
<template>
  <!-- 模板部分：包含查询栏和表格 -->
</template>

<script setup>
  // 脚本部分：使用 Composition API 编写逻辑
</script>
```


该组件是一个通用的 CRUD 表格组件，支持远程分页、本地分页、查询、重置、选中行等功能，通过插槽机制提供高度可定制性。

---

## 🧱 `<template>` 部分解析

### 1. 根容器

```html
<div v-bind="$attrs">
```


- 使用 `v-bind="$attrs"` 将父组件传递的所有未被显式声明的属性绑定到根元素上。
- 这样可以允许开发者在使用组件时直接传入如 `class`、`style` 等属性。

---

### 2. 查询栏（QueryBar）

```html
<QueryBar v-if="$slots.queryBar" mb-30 @search="handleSearch" @reset="handleReset">
  <slot name="queryBar" />
</QueryBar>
```


- `v-if="$slots.queryBar"`：只有当父组件提供了 `queryBar` 插槽时才渲染此部分。
- `@search="handleSearch"` 和 `@reset="handleReset"` 是从子组件 `QueryBar` 向上传递事件的方法。
- `<slot name="queryBar" />`：用户自定义的查询表单项。

---

### 3. 表格主体（n-data-table）

```html
<n-data-table
  :remote="remote"
  :loading="loading"
  :columns="columns"
  :data="tableData"
  :scroll-x="scrollX"
  :row-key="(row) => row[rowKey]"
  :pagination="isPagination ? pagination : false"
  @update:checked-row-keys="onChecked"
  @update:page="onPageChange"
/>
```


- 使用了 Naive UI 的 `n-data-table` 组件。
- 关键属性解释：
  - `remote`：是否启用远程分页。
  - `loading`：控制加载状态。
  - `columns`：表格列配置。
  - `data`：当前显示的数据。
  - `scroll-x`：横向滚动宽度。
  - `row-key`：用于标识每一行的唯一 key，默认是 [id](file://C:\Users\Administrator\Desktop\code\MarkRunner-Platfrom\app\models\base.py#L9-L9)。
  - `pagination`：分页配置对象。
- 事件监听：
  - `@update:checked-row-keys="onChecked"`：当勾选行变化时触发。
  - `@update:page="onPageChange"`：当页码变化时触发。

---

## 🔧 `<script setup>` 部分详解

### 1. 定义 props

```js
const props = defineProps({
  remote: { type: Boolean, default: true },
  isPagination: { type: Boolean, default: true },
  scrollX: { type: Number, default: 450 },
  rowKey: { type: String, default: 'id' },
  columns: { type: Array, required: true },
  queryItems: { type: Object, default: () => ({}) },
  extraParams: { type: Object, default: () => ({}) },
  getData: { type: Function, required: true },
})
```


| Prop 名称      | 类型     | 默认值 | 说明             |
| -------------- | -------- | ------ | ---------------- |
| `remote`       | Boolean  | `true` | 是否后端分页     |
| `isPagination` | Boolean  | `true` | 是否启用分页     |
| `scrollX`      | Number   | `450`  | 表格横向滚动宽度 |
| `rowKey`       | String   | `'id'` | 行唯一标识字段   |
| `columns`      | Array    | ——     | 表格列配置       |
| `queryItems`   | Object   | `{}`   | 查询条件         |
| `extraParams`  | Object   | `{}`   | 额外参数         |
| `getData`      | Function | ——     | 获取数据的函数   |

---

### 2. 定义 emits

```js
const emit = defineEmits(['update:queryItems', 'onChecked', 'onDataChange'])
```


- 自定义事件：
  - `update:queryItems`：用于更新查询条件。
  - `onChecked`：行选中事件。
  - `onDataChange`：数据变化通知。

---

### 3. 响应式变量与分页配置

```js
const loading = ref(false)
const initQuery = { ...props.queryItems }
const tableData = ref([])
const pagination = reactive({
  page: 1,
  page_size: 10,
  pageSizes: [10, 20, 50, 100],
  showSizePicker: true,
  prefix({ itemCount }) {
    return `共 ${itemCount} 条`
  },
  onChange: (page) => {
    pagination.page = page
  },
  onUpdatePageSize: (pageSize) => {
    pagination.page_size = pageSize
    pagination.page = 1
    handleQuery()
  },
})
```


- `loading`：控制表格加载状态。
- `initQuery`：保存初始查询条件，用于重置。
- `tableData`：当前展示的数据。
- `pagination`：分页配置对象，包含页码、每页条数等信息。

---

### 4. 数据获取方法 `handleQuery`

```js
async function handleQuery() {
  try {
    loading.value = true
    let paginationParams = {}
    if (props.isPagination && props.remote) {
      paginationParams = { page: pagination.page, page_size: pagination.page_size }
    }
    const { data, total } = await props.getData({
      ...props.queryItems,
      ...props.extraParams,
      ...paginationParams,
    })
    tableData.value = data
    pagination.itemCount = total || 0
  } catch (error) {
    tableData.value = []
    pagination.itemCount = 0
  } finally {
    emit('onDataChange', tableData.value)
    loading.value = false
  }
}
```


- **功能**：调用 `props.getData` 获取数据，并处理分页参数。
- 如果是远程分页，则传入 `page` 和 `page_size`。
- 捕获异常并清空数据，确保 UI 稳定。

---

### 5. 查询与重置方法

```js
function handleSearch() {
  pagination.page = 1
  handleQuery()
}

async function handleReset() {
  const queryItems = { ...props.queryItems }
  for (const key in queryItems) {
    queryItems[key] = null
  }
  emit('update:queryItems', { ...queryItems, ...initQuery })
  await nextTick()
  pagination.page = 1
  handleQuery()
}
```


- `handleSearch`：重置页码为 1 并重新查询。
- `handleReset`：将所有查询条件设为 `null`，恢复初始值并重新查询。

---

### 6. 分页切换事件处理

```js
function onPageChange(currentPage) {
  pagination.page = currentPage
  if (props.remote) {
    handleQuery()
  }
}
```


- 当页码改变时，如果是远程分页则重新请求数据。

---

### 7. 行选中事件处理

```js
function onChecked(rowKeys) {
  if (props.columns.some((item) => item.type === 'selection')) {
    emit('onChecked', rowKeys)
  }
}
```


- 只有当列中有 `type: 'selection'` 时才触发行选中事件。

---

### 8. 暴露方法给父组件

```js
defineExpose({
  handleSearch,
  handleReset,
  tableData,
})
```


- 允许父组件通过 `ref` 访问这些方法或数据。

---

## ✅ 总结

这个组件是一个典型的 Vue 3 Composition API 实践：

- 使用 [defineProps](file://C:\Users\Administrator\Desktop\code\MarkRunner-Platfrom\web\src\components\table\CrudTable.vue#L0-L51) 和 `defineEmits` 定义接口；
- 使用 `ref` 和 `reactive` 创建响应式状态；
- 使用 `async/await` 处理异步请求；
- 使用插槽机制提高灵活性；
- 使用 `defineExpose` 暴露内部方法；
- 支持远程/本地分页、查询、重置、选中等多种功能。

---

## 📌 使用示例（父组件）

```vue
<template>
  <CrudTable
    :columns="columns"
    :query-items="queryParams"
    :get-data="fetchData"
    @update:query-items="queryParams = $event"
    @on-checked="handleCheck"
    @on-data-change="handleDataChange"
    ref="tableRef"
  >
    <template #queryBar>
      <n-input v-model:value="queryParams.name" placeholder="姓名" />
      <n-button @click="tableRef.handleSearch">搜索</n-button>
      <n-button @click="tableRef.handleReset">重置</n-button>
    </template>
  </CrudTable>
</template>

<script setup>
import { ref } from 'vue'
import CrudTable from '@/components/table/CrudTable.vue'

const queryParams = ref({})
const tableRef = ref()

async function fetchData(params) {
  const res = await api.get('/users', { params })
  return {
    data: res.data.list,
    total: res.data.total,
  }
}
</script>
```
