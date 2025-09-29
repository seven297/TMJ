# 全局文件别名使用指南

本项目已配置了全局文件别名，可以简化导入路径，提高代码可读性和维护性。

## 已配置的别名

| 别名 | 对应路径 | 用途 |
|------|----------|------|
| `@` | `/src` | 项目根目录 |
| `@components` | `/src/components` | 组件目录 |
| `@composables` | `/src/composables` | 组合式API目录 |
| `@utils` | `/src/utils` | 工具函数目录 |
| `@services` | `/src/services` | 服务层目录 |
| `@stores` | `/src/stores` | 状态管理目录 |
| `@types` | `/src/types` | 类型定义目录 |
| `@views` | `/src/views` | 页面组件目录 |
| `@layouts` | `/src/layouts` | 布局组件目录 |
| `@assets` | `/src/assets` | 静态资源目录 |
| `@config` | `/src/config` | 配置文件目录 |
| `@router` | `/src/router` | 路由配置目录 |

## 使用示例

### 1. 导入组件
```typescript
// 旧方式
import HomeView from '../../../views/HomeView.vue'
import BaseButton from '../../components/BaseButton.vue'

// 新方式
import HomeView from '@views/HomeView.vue'
import BaseButton from '@components/BaseButton.vue'
```

### 2. 导入工具函数
```typescript
// 旧方式
import { request } from '../utils/request'
import { debounce } from '../utils/debounce'

// 新方式
import { request } from '@utils/request'
import { debounce } from '@utils/debounce'
```

### 3. 导入类型定义
```typescript
// 旧方式
import type { BaseResponse } from '../types/response'
import type { UserInfo } from '../types/auth'

// 新方式
import type { BaseResponse } from '@types/response'
import type { UserInfo } from '@types/auth'
```

### 4. 导入组合式API
```typescript
// 旧方式
import { useLoading } from '../composables/useLoading'
import { useNotification } from '../composables/useNotification'

// 新方式
import { useLoading } from '@composables/useLoading'
import { useNotification } from '@composables/useNotification'
```

### 5. 导入静态资源
```vue
<template>
  <!-- 旧方式 -->
  <img src="../../assets/images/logo.png" alt="logo" />
  
  <!-- 新方式 -->
  <img src="@assets/images/logo.png" alt="logo" />
</template>
```

### 6. 导入服务层
```typescript
// 旧方式
import { userService } from '../services/userService'
import { apiService } from '../services/apiService'

// 新方式
import { userService } from '@services/userService'
import { apiService } from '@services/apiService'
```

### 7. 导入状态管理
```typescript
// 旧方式
import { useUserStore } from '../stores/user'
import { useAppStore } from '../stores/app'

// 新方式
import { useUserStore } from '@stores/user'
import { useAppStore } from '@stores/app'
```

## 配置说明

### Vite 配置 (vite.config.ts)
```typescript
export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      // ... 其他别名
    }
  }
})
```

### TypeScript 配置 (tsconfig.app.json)
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      // ... 其他路径映射
    }
  }
}
```

## 注意事项

1. 别名配置需要在 Vite 和 TypeScript 中同时设置
2. 使用别名时，路径以 `@` 开头，不需要 `./` 或 `../`
3. 别名在构建时会被正确解析，不会影响最终打包结果
4. IDE 需要重启才能正确识别新的别名配置
5. 建议统一使用别名，避免混用相对路径和别名

## 优先级规范

根据项目规范，使用优先级如下：

1. **组件使用优先级**：
   - 第一优先级：使用项目自定义基础组件(`@components`)
   - 第二优先级：使用ArcoDesign组件库
   - 第三优先级：创建新的组件

2. **组合式API使用优先级**：
   - 第一优先级：使用项目自定义组合式API(`@composables`)
   - 第二优先级：使用Vue核心组合式API
   - 第三优先级：创建新的组合式API

3. **工具函数使用优先级**：
   - 第一优先级：使用项目自定义工具函数(`@utils`)
   - 第二优先级：使用第三方工具库
   - 第三优先级：创建新的工具函数