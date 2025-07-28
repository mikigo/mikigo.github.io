# 用户管理页面源码详解

本教程将详细解析 index.vue 文件，帮助前端初学者理解如何用 Vue3 + Naive UI 实现一个完整的用户管理页面。内容涵盖页面布局、表格展示、表单校验、权限控制、部门树筛选等常见后台开发场景。

---

## 1. 技术栈与页面结构

- **Vue3** 组合式 API（`<script setup>`）
- **Naive UI** 组件库
- **自定义复用组件**（如 `CommonPage`, `CrudTable`, `CrudModal`）
- **权限指令**（`v-permission`）
- **API 封装**（`api.getUserList` 等）

---

## 2. 页面功能概览

- 用户列表展示与查询
- 用户的新增、编辑、删除、重置密码
- 用户禁用/启用状态切换
- 部门树筛选
- 角色分配
- 权限控制（按钮级别）

---

## 3. 代码详解

### 3.1 依赖与变量声明

```js
import { h, onMounted, ref, resolveDirective, withDirectives } from 'vue'
import { NButton, NCheckbox, NCheckboxGroup, NForm, NFormItem, NInput, NSwitch, NTag, NPopconfirm, NLayout, NLayoutSider, NLayoutContent, NTreeSelect } from 'naive-ui'
import CommonPage from '@/components/page/CommonPage.vue'
import CrudModal from '@/components/table/CrudModal.vue'
import CrudTable from '@/components/table/CrudTable.vue'
import QueryBarItem from '@/components/query-bar/QueryBarItem.vue'
import { formatDate, renderIcon } from '@/utils'
import { useCRUD } from '@/composables'
import api from '@/api'
import TheIcon from '@/components/icon/TheIcon.vue'
import { useUserStore } from '@/store'
```

- 引入了页面所需的 UI 组件、工具函数和自定义 hooks。
- `useCRUD` 是自定义的 CRUD 逻辑复用 hooks，简化了增删改查的实现。

### 3.2 页面状态与表单初始化

```js
const $table = ref(null)
const queryItems = ref({})
const vPermission = resolveDirective('permission')
const roleOption = ref([])
const deptOption = ref([])
```

- `$table` 用于操作表格组件（如刷新）。
- `queryItems` 用于表格的查询条件。
- `roleOption`、`deptOption` 分别存储角色和部门数据，用于下拉选择。

### 3.3 CRUD 逻辑复用

```js
const {
  modalVisible,
  modalTitle,
  modalAction,
  modalLoading,
  handleSave,
  modalForm,
  modalFormRef,
  handleEdit,
  handleDelete,
  handleAdd,
} = useCRUD({
  name: '用户',
  initForm: {},
  doCreate: api.createUser,
  doUpdate: api.updateUser,
  doDelete: api.deleteUser,
  refresh: () => $table.value?.handleSearch(),
})
```

- 通过 `useCRUD` 统一管理弹窗、表单、增删改查等逻辑，极大简化了代码量。

### 3.4 生命周期与数据初始化

```js
onMounted(() => {
  $table.value?.handleSearch()
  api.getRoleList({ page: 1, page_size: 9999 }).then((res) => (roleOption.value = res.data))
  api.getDepts().then((res) => (deptOption.value = res.data))
})
```

- 页面加载时自动拉取用户列表、角色列表和部门树数据。

---

## 4. 表格列配置与操作

### 4.1 列配置

```js
const columns = [
  { title: '名称', key: 'username', ... },
  { title: '邮箱', key: 'email', ... },
  {
    title: '用户角色',
    key: 'role',
    render(row) {
      // 渲染多个角色标签
    },
  },
  { title: '部门', key: 'dept.name', ... },
  {
    title: '超级用户',
    key: 'is_superuser',
    render(row) {
      // 是/否标签
    },
  },
  {
    title: '上次登录时间',
    key: 'last_login',
    render(row) {
      // 格式化时间
    },
  },
  {
    title: '禁用',
    key: 'is_active',
    render(row) {
      // 开关切换禁用状态
    },
  },
  {
    title: '操作',
    key: 'actions',
    render(row) {
      // 编辑、删除、重置密码按钮
    },
  },
]
```

### 4.2 操作按钮详解

- **编辑**：弹窗编辑当前用户，自动填充部门和角色。
- **删除**：二次确认后删除用户。
- **重置密码**：非超级用户可重置，重置为默认密码（如123456）。
- **禁用/启用**：通过开关切换，不能禁用当前登录用户。

---

## 5. 用户禁用状态切换

```js
async function handleUpdateDisable(row) {
  if (!row.id) return
  const userStore = useUserStore()
  if (userStore.userId === row.id) {
    $message.error('当前登录用户不可禁用！')
    return
  }
  row.publishing = true
  row.is_active = row.is_active === false ? true : false
  row.publishing = false
  // 组装角色和部门数据
  row.role_ids = row.roles.map(e => e.id)
  row.dept_id = row.dept?.id
  try {
    await api.updateUser(row)
    $message?.success(row.is_active ? '已取消禁用该用户' : '已禁用该用户')
    $table.value?.handleSearch()
  } catch (err) {
    // 有异常恢复原来的状态
    row.is_active = row.is_active === false ? true : false
  } finally {
    row.publishing = false
  }
}
```

- 禁用/启用时会校验不能禁用自己，并同步更新后端数据。

---

## 6. 部门树筛选

```js
const nodeProps = ({ option }) => {
  return {
    onClick() {
      if (lastClickedNodeId === option.id) {
        $table.value?.handleSearch()
        lastClickedNodeId = null
      } else {
        api.getUserList({ dept_id: option.id }).then((res) => {
          $table.value.tableData = res.data
          lastClickedNodeId = option.id
        })
      }
    },
  }
}
```

- 点击部门树节点可筛选该部门下的用户，再次点击同一节点恢复全部用户。

---

## 7. 表单校验规则

```js
const validateAddUser = {
  username: [{ required: true, message: '请输入名称', trigger: ['input', 'blur'] }],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: ['input', 'change'] },
    {
      trigger: ['blur'],
      validator: (rule, value, callback) => {
        const re = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        if (!re.test(modalForm.value.email)) {
          callback('邮箱格式错误')
          return
        }
        callback()
      },
    },
  ],
  password: [{ required: true, message: '请输入密码', trigger: ['input', 'blur', 'change'] }],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: ['input'] },
    {
      trigger: ['blur'],
      validator: (rule, value, callback) => {
        if (value !== modalForm.value.password) {
          callback('两次密码输入不一致')
          return
        }
        callback()
      },
    },
  ],
  roles: [
    { type: 'array', required: true, message: '请至少选择一个角色', trigger: ['blur', 'change'] },
  ],
}
```

- 对用户名、邮箱、密码、确认密码、角色等字段做了详细校验，保证数据有效性。

---

## 8. 页面模板结构

### 8.1 页面布局

```vue
<NLayout has-sider wh-full>
  <NLayoutSider ...>
    <NTree ... /> <!-- 部门树 -->
  </NLayoutSider>
  <NLayoutContent>
    <CommonPage title="用户列表">
      <template #action>
        <NButton ...>新建用户</NButton>
      </template>
      <CrudTable ...>
        <template #queryBar>
          <!-- 查询条件输入框 -->
        </template>
      </CrudTable>
      <CrudModal ...>
        <NForm ...>
          <!-- 用户表单项 -->
        </NForm>
      </CrudModal>
    </CommonPage>
  </NLayoutContent>
</NLayout>
```

- 左侧为部门树，右侧为用户列表和操作弹窗。

### 8.2 查询与表单

- **查询栏**：支持按用户名、邮箱模糊查询。
- **表单弹窗**：支持新增/编辑用户，包含角色、部门、超级用户、禁用等字段。

---

## 9. 权限控制

- 通过 `v-permission` 指令，只有有权限的用户才能看到对应的操作按钮（如新增、编辑、删除、重置密码）。

---

## 10. 实践建议

- **组件复用**：如 `CrudTable`、`CrudModal`，大大提升开发效率。
- **hooks 封装**：如 `useCRUD`，让业务逻辑更清晰。
- **权限粒度**：前端按钮级权限，提升安全性和用户体验。
- **表单校验**：保证数据有效性，减少后端压力。
- **交互细节**：如删除二次确认、切换开关即时反馈。

---

## 11. 总结

本页面是一个典型的后台管理系统用户管理模块，涵盖了前端开发中常见的表格、表单、弹窗、权限、交互等内容。通过阅读和实践本文件，你可以掌握：

- Vue3 组合式 API 的实际用法
- Naive UI 组件的高效组合
- 前端权限控制的实现方式
- 业务组件与 hooks 的复用技巧
