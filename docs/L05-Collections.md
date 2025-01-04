## 今日计划

本次学习的内容集中在 Scala 和 Chisel 的使用，重点包括以下几个方面：

- Scala 中的 `for` 循环与集合（本次主要讨论 `Seq`）。
- 使用集合来进行 Chisel 编程。
- Chisel 的 `Vec` 组件。
- Chisel 的 `Mem` 存储模块。

通过这几个模块的讲解，将逐步深入理解如何在硬件描述语言 Chisel 中灵活使用 Scala 的集合特性。



## Scala 中的 Seq

`Seq` 是 Scala 集合库中的一个重要特性，用于表示**有序的集合**。以下是 `Seq` 的核心特点和基本用法：

1. **特点**

   - `Seq` 是一个有序集合（Sequence）。
   - 默认情况下，`Seq` 是不可变的（immutable）。
   - 可以通过小括号 `()` 对 `Seq` 进行索引访问，支持快速检索。

2. **实现方式**

   - `Seq` 是一个基类，其下有多个具体实现。
   - 对于大多数小规模的场景，直接使用 `Seq` 即可满足需求。
   - 某些代码风格建议明确使用具体实现，例如 `List` 或 `Vector`，以提高可读性和性能优化的确定性。

3. **基本操作**
    以下代码展示了对 `Seq` 的一些常见操作：

   ```scala
   val l = Seq(1, 2, 3)    // 创建一个 Seq
   l(1)                    // 通过索引访问元素，返回 2
   l.isEmpty               // 判断集合是否为空，返回 false
   l.nonEmpty              // 判断集合是否非空，返回 true
   l.length                // 获取集合长度，返回 3
   Seq.fill(3)(8)          // 创建一个包含三个 8 的集合：Seq(8, 8, 8)
   l.getClass              // 获取集合的具体类型
   ```

   上述代码中：

   - `Seq(1, 2, 3)` 表示创建一个包含三个元素的有序集合。
   - `l(1)` 通过索引访问第二个元素，Scala 的索引从 0 开始。
   - `Seq.fill(3)(8)` 是一种创建集合的快捷方式，用于生成包含相同值的多个元素的序列。

`Seq` 的强大之处在于其灵活性和丰富的操作方法，使得它在 Scala 中成为处理有序数据的重要工具。

## Scala 中的 Ranges

`Range` 是 Scala 提供的用于创建数字序列的工具，简化了很多循环与序列生成的操作。以下是它的主要用法：

1. **基本创建方式**

   - 使用 `start until end`：创建一个从 `start` 到 `end` 的范围（不包括 `end`）。
   - 使用 `start to end`：创建一个从 `start` 到 `end` 的范围（包括 `end`）。

2. **自定义步长**

   - 默认情况下，步长为 1。
   - 使用 `by` 指定自定义步长。例如，创建一个以 2 为步长的范围。

3. **示例代码**

   ```scala
   0 until 4    // 创建范围 0, 1, 2, 3（不包括 4）
   0 to 3       // 创建范围 0, 1, 2, 3（包括 3）
   0 to 4 by 2  // 创建范围 0, 2, 4（步长为 2）
   3 to 0 by -1 // 创建范围 3, 2, 1, 0（步长为 -1）
   ```

   在这些例子中：

   - `0 until 4` 生成的序列为 0 到 3。
   - `0 to 4 by 2` 表示每次递增 2，生成的序列为 0, 2, 4。
   - `3 to 0 by -1` 表示从 3 开始，每次递减 1，生成的序列为 3, 2, 1, 0。

`Range` 提供了便捷的序列生成方式，常用于循环、条件过滤和数据初始化等场景。
通过掌握 `Seq` 和 `Range` 的基本特性，可以更高效地使用 Scala 来操作集合数据。同时，这些知识对于后续 Chisel 编程中使用集合来描述硬件逻辑非常重要。

## Scala 中的 `for` 循环

`for` 循环是 Scala 的一个强大工具，用于迭代集合或范围，同时支持嵌套和过滤操作，非常灵活且简洁。以下是其主要特点和用法：

### 核心特点

1. **基本迭代**
    `for` 循环可用于遍历范围或集合，常与 `Range` 或 `Seq` 搭配使用。
2. **变量传递**
    在某些情况下，可以使用 `var` 来存储和传递迭代中的中间结果。
3. **状态空间测试**
    `for` 循环在硬件设计和测试中非常有用，尤其是在生成状态空间时。
4. **全量推导（comprehensions）**
    `for` 循环支持嵌套和过滤，允许通过条件筛选生成复杂的组合。

### 基本语法示例

```scala
for (i <- 0 until 4) {
  println(i) // 输出 0, 1, 2, 3
}
```

#### 高级操作示例

- 传递变量：

  ```scala
  var last = -1
  for (i <- 0 until 4) {
    println(last) // 输出前一个循环中的值
    last = i      // 将当前值存储为 last
  }
  ```

- 嵌套循环与过滤：

  ```scala
  for (i <- 0 until 4; j <- 1 until 4 if i + j == 4) {
    println(i, j) // 输出满足条件的 (i, j) 对
  }
  ```

  在上述代码中，`if i + j == 4` 是过滤条件，仅输出满足条件的值。

## 示例：使用 `for` 实现延迟线（Delay Line）

延迟线是硬件设计中一个常见的模块，用于将输入信号延迟若干个时钟周期后再输出。以下示例展示了如何通过 `for` 循环实现延迟线：

### 代码实现

```scala
class DelayNCycles(n: Int) extends Module {
  val io = IO(new Bundle {
    val in  = Input(Bool())
    val out = Output(Bool())
  })
  
  require(n > 0) // 确保延迟的周期数大于 0
  
  val regs = Seq.fill(n)(Reg(Bool())) // 创建长度为 n 的寄存器序列
  regs(0) := io.in                    // 第一个寄存器的输入连接到模块输入
  for (i <- 1 until n) {              // 遍历寄存器序列，级联连接
    regs(i) := regs(i - 1)
  }
  io.out := regs(n - 1)               // 模块输出连接到最后一个寄存器
}

printVerilog(new DelayNCycles(2)) // 生成延迟 2 个周期的模块 Verilog 代码
```

### 图解

- **输入输出端口**：`io.in` 是输入信号，`io.out` 是延迟后的输出信号。
- **寄存器序列**：`Seq.fill(n)` 创建了一个长度为 `n` 的寄存器链，每个寄存器存储一个时钟周期的信号延迟。
- **延迟过程**：信号从第一个寄存器开始逐步传递，最终延迟了 `n` 个时钟周期后输出。

下方图表展示了延迟线的硬件结构：

```
io.in --> [Reg] --> [Reg] --> ... --> [Reg] --> io.out
               ^         ^                 ^
               |         |                 |
            n = 1     n = 2             n = n
```

## 示例：结合 `for` 和 `var` 实现延迟线

在某些情况下，可以使用 `var` 来简化代码，避免显式的寄存器序列。这种方法在编写清晰易读的代码时非常有用。

### 代码实现

```scala
class DelayNCycles(n: Int) extends Module {
  val io = IO(new Bundle {
    val in  = Input(Bool())
    val out = Output(Bool())
  })

  var lastConn = io.in               // 初始化连接到输入信号
  for (i <- 0 until n) {             // 遍历 n 个延迟周期
    lastConn = RegNext(lastConn)     // 使用 RegNext 实现逐级寄存
  }
  io.out := lastConn                 // 最终输出连接到最后的寄存器
}

printVerilog(new DelayNCycles(3))    // 生成延迟 3 个周期的模块 Verilog 代码
```

### 解析

- **`var` 的作用**：`lastConn` 用于在每次迭代中存储当前寄存器的输出，同时作为下一级寄存器的输入。
- **`RegNext`**：每调用一次 `RegNext`，都会生成一个寄存器，延迟一个时钟周期。
- **代码简洁性**：使用 `var` 替代显式的寄存器序列，可以使代码更加紧凑，逻辑清晰。

## 在测试中使用 `for` 循环

硬件测试是验证设计正确性的重要环节。在 Chisel 中，可以通过 `for` 循环生成测试向量，简化测试代码的编写。

### 示例代码

以下代码展示了如何使用 `for` 循环对组合逻辑模块进行测试：

#### 组合逻辑模块

```scala
class CombLogic extends Module {
  val io = IO(new Bundle {
    val a = Input(Bool())
    val b = Input(Bool())
    val c = Input(Bool())
    val out = Output(Bool())
  })
  
  io.out := (io.a && io.b) || !io.c // 输出逻辑：(a && b) || !c
}
```

#### 测试代码

```scala
test(new CombLogic) { dut =>
  for (a <- Seq(true, false)) {               // 遍历 a 的所有可能值
    for (b <- Seq(true, false)) {             // 遍历 b 的所有可能值
      for (c <- Seq(true, false)) {           // 遍历 c 的所有可能值
        dut.io.a.poke(a)                      // 设置输入 a
        dut.io.b.poke(b)                      // 设置输入 b
        dut.io.c.poke(c)                      // 设置输入 c
        println(s"a: $a, b: $b, c: $c")       // 打印当前输入组合
        val expected = (a && b) || !c         // 计算期望输出
        dut.io.out.expect(expected.B)         // 验证输出是否正确
        dut.clock.step()                      // 推进一个时钟周期
      }
    }
  }
}
```

### 测试解析

- **输入组合**：使用嵌套的 `for` 循环枚举所有可能的输入组合，自动生成测试向量。
- **动态验证**：每种输入组合对应一个期望值，通过调用 `.expect` 方法检查实际输出与期望值是否匹配。
- **调试输出**：`println` 打印当前的输入组合，方便调试和结果分析。
通过以上内容，可以看出 `for` 循环在 Chisel 中不仅用于硬件描述，还能帮助编写简洁高效的测试代码。这种灵活性使得 `for` 循环成为 Scala 和 Chisel 编程中的重要工具。

## Chisel 中的 `Vec`

`Vec` 是 Chisel 提供的一种集合结构，用于处理具有动态选择或参数化数量的端口的硬件设计。它类似于硬件中的多路复用器（Mux）和端口数组，具有灵活且高效的特性。

### `Vec` 的主要用途

1. **动态选择（Dynamic Select）**
   - 用于在硬件中动态选择信号。例如，基于一个选择信号，从多个输入中选择一个输出。
2. **参数化端口数量**
   - 支持根据设计需求动态定义端口数量。这在模块的可配置设计中非常有用，例如总线接口或并行信号处理。

### 基本用法

创建 `Vec` 的基本语法如下：

```scala
Vec(num_elements, type)
```

- `num_elements`：集合的元素数量。
- `type`：集合中元素的类型，例如 `UInt` 或 `Bool`。

#### 注意事项

- **`Vec` 是一种类型，而不是物理硬件组件。**
   它本质上是一个逻辑抽象，用于在生成硬件时定义信号集合。
- 状态与寄存器的关系
  - 如果需要将 `Vec` 存储在寄存器中，可以使用 `Reg(Vec(num_elements, type))`。
  - 不允许使用 `Vec(Reg(...))`，即不能创建一个由寄存器组成的 `Vec`。

#### 示例：定义 `Reg` 和 `Wire` 的 `Vec`

```scala
Reg(Vec(num_elements, type))   // 定义寄存器 Vec
Wire(Vec(num_elements, type))  // 定义线网 Vec
```

## 示例 1：使用 `Vec` 实现多路复用器

以下示例展示了如何使用 `Vec` 来实现一个支持动态选择的多路复用器（Mux）：

### 代码实现

```scala
class MyMuxN(n: Int, w: Int) extends Module {
  val io = IO(new Bundle {
    val in  = Input(Vec(n, UInt(w.W))) // 输入信号的 Vec，包含 n 个 w 位宽的输入
    val sel = Input(UInt(log2Ceil(n).W)) // 选择信号，宽度为 log2(n)
    val out = Output(UInt(w.W)) // 输出信号
  })
  
  io.out := io.in(io.sel) // 根据选择信号动态选择输入
}

printVerilog(new MyMuxN(4, 1)) // 生成具有 4 个 1 位输入的多路复用器 Verilog 代码
```

### 工作原理

1. **输入信号**
   - `io.in` 是一个 `Vec`，包含了 `n` 个输入信号。
   - 每个输入信号的宽度为 `w` 位。
2. **选择信号**
   - `io.sel` 是选择信号，其宽度为 `log2Ceil(n)`，用于选择输入信号的索引。
3. **输出信号**
   - `io.out` 根据选择信号从输入集合中动态选择一个信号输出。

这种设计非常适合在硬件中实现动态选择的功能，例如多路选择器或总线仲裁器。

## 示例 2：使用 `Vec` 参数化端口数量

以下示例展示了如何通过 `Vec` 实现具有可配置数量输入端口的加法器（Reducer）：

### 代码实现

```scala
class Reducer(n: Int, w: Int) extends Module {
  val io = IO(new Bundle {
    val in  = Input(Vec(n, UInt(w.W))) // 包含 n 个输入的 Vec
    val out = Output(UInt(w.W))       // 输出信号
  })
  
  require(n > 0) // 确保输入数量大于 0
  
  var totalSoFar = io.in(0) // 初始化累加器为第一个输入信号
  for (i <- 1 until n) {    // 遍历剩余的输入信号
    totalSoFar = io.in(i) + totalSoFar // 逐步累加
  }
  io.out := totalSoFar // 输出最终累加结果
}

printVerilog(new Reducer(2, 2)) // 生成具有 2 个 2 位输入的加法器 Verilog 代码
```

### 工作原理

1. **输入信号**
   - `io.in` 是一个 `Vec`，包含了 `n` 个输入信号。
   - 每个输入信号的宽度为 `w` 位。
2. **累加操作**
   - 初始化累加器为 `io.in(0)`。
   - 使用 `for` 循环遍历剩余的输入信号，并逐步累加每个信号的值。
3. **输出信号**
   - `io.out` 输出累加结果。

### 图解

下方展示了加法器的硬件结构，其中每个输入信号通过级联加法器进行累加：

```
io.in(0) --> + --> + --> ... --> + --> io.out
             ^     ^         ^
             |     |         |
          io.in(1) io.in(2) io.in(n-1)
```

### 应用场景

- 数字信号处理中的并行数据求和。
- 总线数据聚合与处理。
通过以上内容，可以看出 `Vec` 在硬件设计中是一个极其重要的工具。无论是实现动态选择，还是参数化端口数量，`Vec` 都能够显著提高模块的灵活性和扩展性。

## 使用 `VecInit` 实现只读存储器（ROM）

在 Chisel 中，`VecInit` 是一种用于创建和初始化 `Vec` 的方法。通过它可以轻松实现只读存储器（ROM）的功能，用于根据输入索引返回固定的预定义值。

### `VecInit` 的作用

1. **创建 `Wire` 类型的 `Vec`**
   - `VecInit` 生成的 `Vec` 是一个 `Wire`，可以动态索引使用。
2. **初始化寄存器**
   - 可以结合 `RegInit` 使用，用于初始化寄存器中的值。

### 示例：使用 `VecInit` 创建 ROM

以下示例通过 `VecInit` 实现一个简单的只读存储器，用于检查某个值是否能被常数 `x` 整除：

#### 代码实现

```scala
class DivByXTable(x: Int) extends Module {
  val io = IO(new Bundle {
    val in  = Input(UInt(4.W))  // 输入信号，4 位宽度
    val out = Output(Bool())    // 输出信号，布尔类型
  })

  var results = Seq[Bool]()     // 定义一个布尔值序列
  for (i <- 0 to 15) {          // 遍历 0 到 15
    results = results :+ (i % x == 0).B // 检查是否被 x 整除
  }
  val table = VecInit(results)  // 用 results 初始化一个 Vec
  io.out := table(io.in)        // 根据输入索引从 table 中获取值
}

printVerilog(new DivByXTable(3)) // 生成 Verilog 代码，x=3
```

#### 解析

1. **`results` 序列**
   - 预计算出所有从 0 到 15 是否能被 `x` 整除的布尔值，并存储在 `results` 中。
2. **`VecInit` 初始化**
   - 使用 `VecInit` 将 `results` 转换为一个 `Vec`，并支持动态索引。
3. **动态索引**
   - 根据输入信号 `io.in` 的值，在 `table` 中选择对应的布尔值，并将其输出到 `io.out`。

## Chisel 中的 `Mem`

`Mem` 是 Chisel 提供的内存构造，用于描述可动态寻址和可变的存储器。它是一种强大的工具，适用于实现组合或时序逻辑下的存储器结构。

### `Mem` 的特点

1. **动态寻址**
   - 支持通过地址动态访问存储器中的内容。
2. **硬件实现**
   - Chisel 后端会根据具体硬件选择适当的存储器实现方式。
3. **默认行为**
   - 组合式读取（无周期延迟）。
   - 同步写入（1 个周期延迟）。
4. **可配置延迟**
   - 可以调整延迟参数，例如 `SyncReadMem` 默认具有 1 个周期的读延迟。
5. **写入掩码**
   - 支持写掩码，用于部分更新存储器的内容。

### 寄存器文件（Register File）

以下示例展示了如何使用 `Reg` 实现一个具有两个读取端口（2R）和一个写入端口（1W）的寄存器文件：

#### 代码实现

```scala
class RegFile() extends Module {
  val io = IO(new Bundle {
    val r0addr = Input(UInt(5.W))  // 读取端口 0 的地址
    val r1addr = Input(UInt(5.W))  // 读取端口 1 的地址
    val w0en   = Input(Bool())     // 写使能信号
    val w0addr = Input(UInt(5.W))  // 写入端口的地址
    val w0data = Input(UInt(64.W)) // 写入数据
    val r0out  = Output(UInt(64.W)) // 读取端口 0 的输出
    val r1out  = Output(UInt(64.W)) // 读取端口 1 的输出
  })

  // 定义寄存器文件
  val regs = Reg(Vec(32, UInt(64.W))) // 使用寄存器实现的 Vec

  // 读取操作
  io.r0out := regs(io.r0addr) // 根据地址读取寄存器
  io.r1out := regs(io.r1addr)

  // 写入操作
  when(io.w0en) {              // 写使能有效时执行写入
    regs(io.w0addr) := io.w0data
  }
}

printVerilog(new RegFile()) // 生成 Verilog 代码
```

### 使用 `Reg` 与 `Mem` 的区别

| **功能**     | **`Reg(Vec)`** | **`Mem`**                      |
| ------------ | -------------- | ------------------------------ |
| **实现方式** | 使用寄存器实现 | 使用内存块实现                 |
| **寻址模式** | 固定索引       | 动态索引                       |
| **存储容量** | 小规模存储     | 大规模存储                     |
| **延迟**     | 零延迟读取     | 默认组合式读取，支持同步式延迟 |
| **写掩码**   | 不支持         | 支持                           |

### 解析

1. **输入信号**
   - 两个读取地址信号：`r0addr` 和 `r1addr`，用于分别指定读取端口的地址。
   - 一个写入地址信号：`w0addr` 和写入数据信号：`w0data`，用于指定写入操作的目标和内容。
   - 写使能信号 `w0en` 控制是否进行写入操作。
2. **输出信号**
   - 两个读取端口的输出信号：`r0out` 和 `r1out`，分别返回指定地址的存储内容。
3. **存储器实现**
   - 使用 `Reg(Vec(32, UInt(64.W)))` 实现一个 32 个条目、每条 64 位的寄存器文件。
4. **条件写入**
   - 当写使能信号有效时，将 `w0data` 写入到指定地址 `w0addr` 中的存储器位置。
   通过对 `VecInit` 和 `Mem` 的学习，我们能够实现灵活的存储结构，从简单的 ROM 到复杂的寄存器文件都可以高效地描述。根据具体需求选择合适的工具，可以充分利用 Chisel 的特性优化硬件设计。

## 解析 **`Reg`**、**`Mem`** 和 **`SyncReadMem`**

## **1. Chisel 中的 `Reg`**

`Reg` 是 Chisel 中用于描述**时序逻辑**的最基础构造，表示**单个寄存器**或寄存器数组（`Vec` 形式）。

- **主要特点**：

  1. **时序逻辑存储**：`Reg` 的值在每个时钟上升沿更新。
  2. **无延迟读取**：`Reg` 的值可以立即访问（组合逻辑读取）。
  3. **可与 `Vec` 结合**：通过 `Vec` 创建寄存器数组，支持索引访问。

- **典型用法**：

  ```scala
  val reg = RegInit(0.U(8.W))   // 带初始值的寄存器
  reg := io.input              // 时钟上升沿时更新值
  io.output := reg             // 无延迟读取当前值
  ```

## **2. Chisel 中的 `Mem`**

`Mem` 是用于描述存储器（Memory）的构造，适合**大规模存储**需求，比如 SRAM 或寄存器文件。

- **主要特点**：

  1. 支持组合逻辑读取：

     - 默认情况下，`Mem` 的读取是**组合逻辑读取**，即读取路径不依赖时钟信号。
   - 数据可以通过地址立即访问。
     
  2. 时序逻辑写入：

     - 写入受时钟控制，仅在时钟边沿写入。

  3. **适用于大规模存储**：相比 `Reg(Vec)`，`Mem` 更适合描述大规模存储。

- **代码示例**：

  ```scala
  val mem = Mem(1024, UInt(8.W))  // 创建 1024 个 8 位宽的存储单元
  io.output := mem.read(io.addr) // 组合逻辑读取
  when(io.wen) {
    mem.write(io.addr, io.data)  // 时序逻辑写入
  }
  ```

## **3. Chisel 中的 `SyncReadMem`**

`SyncReadMem` 是一种用于描述存储器的构造，但与 `Mem` 不同，其读取操作是**同步的（非组合逻辑读取）**。这意味着：

- **读取路径需要一个时钟周期延迟**才能返回结果。
- **写入仍然是时序逻辑写入**，与 `Mem` 一致。

这种设计更接近 FPGA 中 BRAM（Block RAM）的行为，适合高密度的存储场景。

- **主要特点**：

  1. **同步读取**：读取时需要一个时钟周期的延迟。
  2. **写入行为**：受时钟信号控制。
  3. **适合 FPGA 后端**：与 FPGA 的 BRAM 行为一致。

- **代码示例**：

  ```scala
  val syncMem = SyncReadMem(1024, UInt(8.W))  // 创建同步存储器
  val data = syncMem.read(io.addr, io.en)    // 读取操作（1 周期延迟）
  io.output := data                          // 返回结果
  when(io.wen) {
    syncMem.write(io.addr, io.data)          // 写入操作
  }
  ```

## **不同存储元素的特性对比**

| **特性**         | **`Reg`**     | **`Mem`**                | **`SyncReadMem`**          |
| ---------------- | ------------- | ------------------------ | -------------------------- |
| **适用场景**     | 小规模寄存器  | 大规模组合逻辑读取存储器 | 大规模同步读取存储器       |
| **读取方式**     | 组合逻辑读取  | 组合逻辑读取             | 同步读取（1 时钟周期延迟） |
| **写入方式**     | 时序逻辑写入  | 时序逻辑写入             | 时序逻辑写入               |
| **硬件资源**     | 寄存器        | SRAM 或 FPGA LUTRAM      | FPGA BRAM                  |
| **延迟特性**     | 0（立即读取） | 0（组合逻辑读取）        | 1 个时钟周期延迟           |
| **支持写掩码**   | 不支持        | 支持                     | 支持                       |
| **容量和灵活性** | 小规模        | 大规模灵活存储           | 大规模高效存储             |

## **实例解析：非组合逻辑读取（`SyncReadMem`）的实现**

假设我们需要实现一个**同步读取**的寄存器文件，其行为如下：

- 读取操作在读取地址提供后的下一个时钟周期生效。
- 写入操作通过时钟触发。

### **Chisel 实现：**

```scala
class SyncRegFile(numRegs: Int, dataWidth: Int) extends Module {
  val io = IO(new Bundle {
    val rAddr  = Input(UInt(log2Ceil(numRegs).W))  // 读取地址
    val rEn    = Input(Bool())                    // 读取使能信号
    val wEn    = Input(Bool())                    // 写入使能信号
    val wAddr  = Input(UInt(log2Ceil(numRegs).W)) // 写入地址
    val wData  = Input(UInt(dataWidth.W))         // 写入数据
    val rData  = Output(UInt(dataWidth.W))        // 读取输出数据
  })

  // 使用 SyncReadMem 定义同步存储器
  val mem = SyncReadMem(numRegs, UInt(dataWidth.W))

  // 同步读取（1 个周期延迟）
  val rData = mem.read(io.rAddr, io.rEn) // 只有在 rEn 有效时读取

  // 输出延迟后的读取数据
  io.rData := rData

  // 时序逻辑写入
  when(io.wEn) {
    mem.write(io.wAddr, io.wData)
  }
}
```

### **测试验证**

```scala
import chiseltest._
import org.scalatest.flatspec.AnyFlatSpec

class SyncRegFileTester extends AnyFlatSpec with ChiselScalatestTester {
  "SyncRegFile" should "work correctly" in {
    test(new SyncRegFile(32, 8)) { dut =>
      // 写入数据
      dut.io.wEn.poke(true.B)
      dut.io.wAddr.poke(10.U)
      dut.io.wData.poke(42.U)
      dut.clock.step()  // 推进一个时钟周期

      // 读取数据（同步延迟）
      dut.io.rEn.poke(true.B)
      dut.io.rAddr.poke(10.U)
      dut.clock.step()  // 推进一个时钟周期，等待结果
      dut.io.rData.expect(42.U) // 验证读取值
    }
  }
}
```

## **选择存储结构的建议**

1. **小规模存储（如寄存器文件）：**
   - 使用 `Reg` 或 `Reg(Vec)`，结合组合逻辑读取实现快速访问。
2. **大规模存储（如缓冲区、RAM）：**
   - 需要快速访问：使用 `Mem`，适合组合逻辑读取。
   - FPGA BRAM 优化：使用 `SyncReadMem`，适合同步逻辑读取。
3. **其他高级需求：**
   - 多端口读取或写入：可以通过多个 `Mem` 或 `Reg` 配合实现。
   - 写掩码支持：选择 `Mem` 或 `SyncReadMem`。

