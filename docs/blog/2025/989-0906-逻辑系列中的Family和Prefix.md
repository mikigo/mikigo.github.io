# 0906-逻辑系列中的Family和Prefix

### 一、最常见的原理图 Prefix（参考标识符）

这些是用于原理图位号的标准前缀，几乎所有原理图都遵循此约定。

| Prefix | 描述 | 示例元件 |
| :--- | :--- | :--- |
| **R** | 电阻器 | 固定电阻、排阻 |
| **C** | 电容器 | 瓷片电容、电解电容 |
| **L** | 电感器 | 功率电感、磁珠 |
| **D** | 二极管 | 整流二极管、LED、肖特基二极管 |
| **Q** | 晶体管 | MOSFET, BJT, IGBT |
| **U** 或 **IC** | 集成电路 | MCU, 运放, 逻辑门, 存储器 |
| **J** 或 **P** 或 **CONN** | 连接器 | 排针、USB接口、电源插座 |
| **TP** | 测试点 | 用于测量的过孔或焊盘 |
| **Y** | 晶振 | 石英晶体振荡器 |
| **X** | 晶振 | 另一种常见表示法 |
| **S** 或 **SW** | 开关 | 按键开关、拨码开关 |
| **F** | 保险丝 | 自恢复保险丝、玻璃管保险丝 |
| **FB** | 磁珠 | 用于抑制高频噪声的铁氧体磁珠 |
| **T** | 变压器 | 电源变压器、网络变压器 |
| **LED** 或 **D** | 发光二极管 | 通常LED会单独分类，有时也归为二极管 |

---

### 二、常见的 Family（用于技术、封装和功能分类）

Family的用法更多元，通常在下拉菜单或库管理器中用于筛选元件。

#### 1. 按 **封装类型** 分类的 Family
这些Family直接描述了元件的物理外形，对PCB布局至关重要。

| Family | 全称 | 描述 |
| :--- | :--- | :--- |
| **BGA** | Ball Grid Array | 球栅阵列封装，底部以焊球阵列连接，用于高密度引脚芯片。 |
| **QFP** | Quad Flat Package | 四方扁平封装，引脚从四边引出。 |
| **TQFP** | Thin Quad Flat Package | 薄型四方扁平封装。 |
| **LQFP** | Low-profile Quad Flat Package | 低剖面四方扁平封装。 |
| **SOIC** | Small Outline Integrated Circuit | 小外形集成电路，双列引脚。 |
| **SOT** | Small Outline Transistor | 小外形晶体管，用于三极管等。 |
| **QFN** | Quad Flat No-leads | 四方无引线封装，底部有导热焊盘。 |
| **DFN** | Dual Flat No-leads | 双列无引线封装。 |
| **0805, 0603, 0402** | - | 表示片式电阻/电容的封装尺寸。 |
| **DIP** | Dual In-line Package | 双列直插封装，常用于老式芯片或实验板。 |

#### 2. 按 **技术/功能** 分类的 Family
这些Family描述了元件的电气功能或技术流派。

| Family | 全称 / 含义 | 描述 |
| :--- | :--- | :--- |
| **ANA** | **Ana**log | **模拟器件**。用于区分模拟和数字器件，如模拟开关、模拟传感器。 |
| **DIG** | **Dig**ital | **数字器件**。如逻辑门、数字隔离器。 |
| **BPF** | **B**and**P**ass **F**ilter | **带通滤波器**。用于库中标识具有此特定功能的器件。 |
| **LPF** | **L**ow-**P**ass **F**ilter | **低通滤波器**。 |
| **HPF** | **H**igh-**P**ass **F**ilter | **高通滤波器**。 |
| **ADC** | **A**nalog-to-**D**igital **C**onverter | **模数转换器**。 |
| **DAC** | **D**igital-to-**A**nalog **C**onverter | **数模转换器**。 |
| **LED** | **L**ight-**E**mitting **D**iode | **发光二极管**。在Family中用于区分普通二极管。 |
| **MEM** | **Mem**ory | **存储器**。如EEPROM, FLASH, SRAM芯片。 |
| **RF** | **R**adio **F**requency | **射频器件**。如RF放大器、RF开关、RF滤波器。 |
| **PWR** | **P**o**w**e**r** | **电源管理**。如LDO、DC-DC转换器、PMIC。 |
| **LOGIC** | - | **逻辑系列**。其下又可细分为 `TTL`, `CMOS`, `HC`, `LS`, `LVC` 等子家族。 |

#### 3. 按 **逻辑系列** 分类的 Family (数字IC的子集)
这是“Family”概念最经典的应用场景，用于区分数字IC的技术标准。

| Family | 全称 | 描述 |
| :--- | :--- | :--- |
| **HC** | High-speed CMOS | 高速CMOS，最通用的5V CMOS逻辑系列。 |
| **HCT** | High-speed CMOS, TTL-compatible | 输入电平与TTL兼容的HC系列。 |
| **AHC** | Advanced High-speed CMOS | HC的升级版，速度更快。 |
| **LVC** | Low-Voltage CMOS | 低电压CMOS（1.65V - 3.6V），现代主流。 |
| **LVTTL** | Low-Voltage TTL | 低电压TTL。 |
| **LS** | Low-power Schottky | 低功耗肖特基TTL，曾是工业标准。 |
| **ALS** | Advanced Low-power Schottky | LS的升级版。 |
| **ACL** | Advanced CMOS Logic | 另一种高速CMOS系列。 |

---

### 总结与使用示例

*   **场景一：在原理图中**
    *   你放置了一个运放。它的 **Prefix** 是 `U1`（因为它是一个IC）。
    *   它的 **Family** 可能被设置为 `ANA`（表明它是一个模拟器件）或者 `SOIC`（表明你选择了SOIC封装的版本）。

*   **场景二：在BOM清单中**
    *   一列是 **Item**，一列是 **Qty**，一列是 **Part Number**，一列是 **Description**。
    *   通常会有一列叫做 **Reference**，这里面填的就是 `R1, R2, C1, C2, U1, U2` 等 **Prefix**。
    *   通常会有一列叫做 **Family** 或 **Category**，用于给元件分类以便采购和装配，如 `RESISTOR 0805`, `CAPACITOR 0603`, `IC-SOIC`, `IC-BGA`。
