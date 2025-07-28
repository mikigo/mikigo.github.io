# 菜单管理页面源码详解

本文将详细讲解 index.vue 文件的实现逻辑，帮助理解如何用 Vue3 + Naive UI 实现一个菜单管理页面。

---

## 1. 文件结构与技术栈

- **Vue3** 组合式 API（`<script setup>`）
- **Naive UI** 组件库
- **自定义组件**（如 `CommonPage`, `CrudTable`, `CrudModal`, `IconPicker`）
- **权限指令**（`v-permission`）
- **API 封装**（`api.getMenus` 等）

---

## 2. 主要功能

- 菜单的增删改查（CRUD）
- 支持目录/菜单两种类型
- 菜单树结构选择
- 权限控制（按钮级别）
- 表单校验与交互体验优化

---

## 3. 代码详解

### 3.1 变量与依赖

```js
import { h, onMounted, ref, resolveDirective, withDirectives } from 'vue'
import { NButton, NForm, NFormItem, NInput, NInputNumber, NPopconfirm, NSwitch, NTreeSelect, NRadio, NRadioGroup, NTag } from 'naive-ui'
import CommonPage from '@/components/page/CommonPage.vue'
import CrudModal from '@/components/table/CrudModal.vue'
import CrudTable from '@/components/table/CrudTable.vue'
import IconPicker from '@/components/icon/IconPicker.vue'
import TheIcon from '@/components/icon/TheIcon.vue'
import { formatDate, renderIcon } from '@/utils'
import { useCRUD } from '@/composables'
import api from '@/api'
```

- 引入了页面所需的 UI 组件和工具函数。
- `useCRUD` 是自定义的 CRUD 逻辑复用 hooks，简化了增删改查的实现。

### 3.2 页面状态与表单初始化

```js
const $table = ref(null)
const queryItems = ref({})
const vPermission = resolveDirective('permission')

const initForm = {
  order: 1,
  keepalive: true,
}
```

- `$table` 用于操作表格组件（如刷新）。
- `queryItems` 用于表格的查询条件。
- `vPermission` 用于按钮权限控制。
- `initForm` 是新增菜单的默认表单数据。

### 3.3 CRUD 逻辑复用

```js
const {
  modalVisible,
  modalTitle,
  modalLoading,
  handleAdd,
  handleDelete,
  handleEdit,
  handleSave,
  modalForm,
  modalFormRef,
} = useCRUD({
  name: '菜单',
  initForm,
  doCreate: api.createMenu,
  doDelete: api.deleteMenu,
  doUpdate: api.updateMenu,
  refresh: () => $table.value?.handleSearch(),
})
```

- 通过 `useCRUD` 统一管理弹窗、表单、增删改查等逻辑，极大简化了代码量。

### 3.4 生命周期与数据初始化

```js
onMounted(() => {
  $table.value?.handleSearch()
  getTreeSelect()
})
```

- 页面加载时自动拉取菜单列表和菜单树结构。

### 3.5 表格列配置

```js
const columns = [
  { title: 'ID', key: 'id', ... },
  { title: '菜单名称', key: 'name', ... },
  {
    title: '菜单类型',
    key: 'menu_type',
    render(row) {
      // 目录/菜单不同样式
    },
  },
  // ... 其他字段
  {
    title: '操作',
    key: 'actions',
    render(row) {
      // 子菜单、编辑、删除按钮，带权限控制
    },
  },
]
```

- 每一列都定义了标题、字段、宽度、对齐方式等。
- `render` 方法可自定义单元格内容，如按钮、标签等。

#### 操作按钮详解

- **子菜单**：仅目录类型可添加子菜单。
- **编辑**：弹窗编辑当前菜单。
- **删除**：无子菜单时可删除，带二次确认。

### 3.6 表格交互

- **keepalive/隐藏**：通过 `NSwitch` 实现，切换后自动调用接口更新状态。

### 3.7 新增菜单逻辑

```js
function handleClickAdd() {
  initForm.parent_id = 0
  initForm.menu_type = 'catalog'
  initForm.is_hidden = false
  initForm.order = 1
  initForm.keepalive = true
  showMenuType.value = true
  handleAdd()
}
```

- 点击“新建根菜单”时，初始化表单为根目录，并弹出新增弹窗。

### 3.8 菜单树结构获取

```js
async function getTreeSelect() {
  const { data } = await api.getMenus()
  const menu = { id: 0, name: '根目录', children: [] }
  menu.children = data
  menuOptions.value = [menu]
}
```

- 获取菜单树数据，供上级菜单选择使用。

---

## 4. 模板结构详解

### 4.1 页面布局

```vue
<CommonPage show-footer title="菜单列表">
  <template #action>
    <NButton v-permission="'post/api/v1/menu/create'" ...>新建根菜单</NButton>
  </template>
  <CrudTable ... />
  <CrudModal ...>
    <NForm ...>
      <!-- 表单项 -->
    </NForm>
  </CrudModal>
</CommonPage>
```

- **CommonPage**：统一页面布局和标题。
- **CrudTable**：菜单列表展示。
- **CrudModal**：新增/编辑菜单弹窗。

### 4.2 表单项说明

- **菜单类型**：目录/菜单，决定菜单的行为和展示。
- **上级菜单**：树形选择，支持多级嵌套。
- **菜单名称/路径/组件路径/跳转路径**：基础信息。
- **菜单图标**：支持图标选择。
- **显示排序/是否隐藏/KeepAlive**：控制菜单显示和缓存。

---

## 5. 权限控制

- 通过 `v-permission` 指令，只有有权限的用户才能看到对应的操作按钮（如新增、编辑、删除）。

---

## 6. 实践建议

- **组件复用**：如 `CrudTable`、`CrudModal`，大大提升开发效率。
- **hooks 封装**：如 `useCRUD`，让业务逻辑更清晰。
- **权限粒度**：前端按钮级权限，提升安全性和用户体验。
- **表单校验**：保证数据有效性，减少后端压力。
- **交互细节**：如删除二次确认、切换开关即时反馈。

---

## 7. 总结

本页面是一个典型的后台管理系统菜单管理模块，涵盖了前端开发中常见的表格、表单、弹窗、权限、交互等内容。通过阅读和实践本文件，你可以掌握：

- Vue3 组合式 API 的实际用法
- Naive UI 组件的高效组合
- 前端权限控制的实现方式
- 业务组件与 hooks 的复用技巧
