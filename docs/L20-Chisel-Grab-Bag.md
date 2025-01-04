## Agile Hardware Design: Chisel Grab Bag

本讲座内容由加州大学圣克鲁兹分校的 Scott Beamer 教授提供，旨在深入讲解 Chisel 设计方法及其核心理念。Chisel 是一个用于硬件描述的嵌入式领域特定语言 (Embedded Domain-Specific Language, DSL)，基于 Scala 构建。本次课程涵盖了 Chisel 的工作原理以及常见的错误避免技巧。

## 计划内容

1. 回顾 Chisel 的工作方式
2. 提供避免常见错误的实用建议

## 在 Notebook 中加载 Chisel 库

为方便在 Jupyter Notebook 环境中使用 Chisel，可以通过以下方式加载所需依赖：

```scala
interp.load.module(os.Path(s"${System.getProperty("user.dir")}/../resource/chisel_deps.sc"))
```

然后引入必要的 Chisel 模块：

```scala
import chisel3._
import chisel3.util._
import chiseltest._
import chiseltest.RawTester.test
```

这些导入为后续的硬件设计与测试提供了基础支持。

## Chisel/Scala 的核心工作原理回顾

### Chisel 与 Scala 的关系

- Chisel 设计实际上是一个合法的 Scala 程序（否则会引发 Scala 编译错误）。
- Chisel 是一个基于 Scala 的库，可以看作嵌入式领域特定语言 (DSL)。
- 在代码执行过程中，任何 Chisel 对象的引用或构造都会被实例化：
  - 包括简单的文字常量（如 `4.U`）或细微的调整（如 `~io.in`）。
  - 每个对象都具有输入 (inputs) 和输出 (outputs)。
- 在底层，Chisel 中的对象被跟踪并绑定到模块中，例如通过 `extends Module`。

### Chisel 连接语义

- 使用

  ```
  :=
  ```

   或

  ```
  <=>
  ```

   连接信号时，会对 Chisel 对象产生副作用：

  - 改变输入信号并将其连接到输出信号。

- 总结：可以将 Chisel 代码看作是 Scala 程序，它实例化了 Chisel 对象并连接了这些对象。

  - Chisel 的许多可配置性与灵活性来自其基础语言 Scala 的特性。

### 目标

- 核心目标是将信号正确连接到模块的输入和输出。
- Chisel 的工具会自动修剪无法从输入或输出到达的部分组件。

## 硬件设计的**静态结构**与**动态信号**

### 硬件的静态结构

- 硬件的连接与结构在综合 (elaboration) 之后是静态的：
  - 即使仅是模拟，而非制造物理设计，其结构仍然保持不变。
  - 例如，多路选择器 (mux) 可以改变输出信号，但其外部连接是静态的。
- 线 (wire) 可以在不同周期内传递不同的值（无论在仿真还是现实中），但其终端连接是不变的：
  - 线本身没有内部状态，它仅将输入直接传递到输出。
  - 线随时间变化的信号值来自其输入信号的变化。

### 寄存器的动态信号

- 寄存器（或存储器）具有内部状态，但仅在上升沿时钟触发时才改变值：
  - 在上升沿，输入值会成为输出值（以及内部状态）。
  - 在 Chisel 中，通常不会显式显示时钟信号，这可能导致在跟踪时序变化时容易出错。

## 即使在**最后连接语义**中，硬件结构仍然是静态的

### 最后连接语义（Last Connect Semantics）

- 当一个输入存在多个连接时，Chisel 会选择“优胜者”：

  - 硬件的实际输入只能连接到一个信号。
  - **最后连接语义**表示：在 Scala 程序中执行的最后一次连接“胜出”。

- 对于

  ```
  when
  ```

   语句，其行为特别与多路选择器 (mux) 有关：

  - 确定连接内容取决于

    ```
    when
    ```

     条件：

    - 当条件满足时，使用多路选择器选择正确的信号。

  - 最终，硬件实际连接的是 mux 的输出。

  - `when` 的条件用于选择 mux 的信号源。

### 示例代码

以下是一个简单的模块示例，展示了如何使用条件语句控制信号：

```scala
class Clipper extends Module {
  val io = IO(new Bundle {
    val in = Input(UInt(8.W))
    val out = Output(UInt(8.W))
  })

  io.out := io.in
  when (io.in > 3.U) {
    io.out := 3.U
  }
}

printVerilog(new Clipper)
```

**解释：**

- `Clipper` 模块的输入信号为 `in`，输出信号为 `out`。
- 默认情况下，`out` 直接连接到 `in`。
- 使用 `when` 语句，当输入信号大于 3 时，将输出值限制为 3。
- 最终生成的 Verilog 硬件将静态连接 `in` 和 `out`，并通过多路选择器在特定条件下修改输出。

本次讲解帮助我们理解了 Chisel 的核心设计理念及其与 Scala 的紧密结合方式。通过这些知识，我们可以更高效地设计和验证硬件，同时避免常见错误。

## 简化技巧：将嵌套的 `when` 转换为 `AND`

在 Chisel 代码中，嵌套的 `when` 语句可能导致代码复杂且难以阅读。可以通过逻辑 `AND` 简化这些嵌套条件，从而提高代码的可读性和清晰性。

以下代码展示了一个嵌套 `when` 的例子：

```scala
class NestedWhens() extends Module {
  val io = IO(new Bundle {
    val in = Input(UInt(3.W))
    val out = Output(Bool())
  })

  io.out := false.B
  when (io.in(0)) {
    when (io.in(1)) {
      when (io.in(2)) {
        io.out := true.B
      }
    }
  }
}

printVerilog(new NestedWhens)
```

### 解析

- 这是一个多层嵌套的 `when` 条件，依次检查输入 `io.in(0)`、`io.in(1)` 和 `io.in(2)` 是否为真。
- 如果所有条件均满足，则将 `io.out` 设为 `true.B`。

### 简化建议

- 通过使用逻辑

  ```
  AND
  ```

   运算符，可以将多个嵌套条件合并为单个条件：

  ```scala
  io.out := io.in(0) && io.in(1) && io.in(2)
  ```

- 这样的代码更加简洁、直观，且更易于理解。

## 可变性 (Mutability)：何时使用与避免？

在硬件设计中，可变性会对程序行为产生重要影响，特别是在使用 Scala 的 `val` 和 `var` 时：

### `val` 和 `var` 的区别

- **`val`**：不可变引用，表示一个值一旦赋值便无法更改。
- **`var`**：可变引用，可以在后续重新赋值。

### 注意事项

1. Chisel 工具对 `val` 和 `var` 的区分：

   - Chisel 工具通常无法分辨 `val` 和 `var`，因为硬件信号值的变化在时间上与 Scala 的引用类型无关。

2. 不要混淆 Scala 的可变性与硬件信号的动态变化：

   - 硬件信号的动态变化是时序（clock）驱动的，而 Scala 的可变性是编程语言层面的概念。

### 示例：计数器的实现

错误实现：

```scala
var counter = 0.U
counter = counter + 1.U
```

在综合后的硬件中，`counter` 的值始终是 `0 + 1`，因为它没有寄存状态。

正确实现：

```scala
val counter = Reg(UInt())
counter := counter + 1.U
```

使用 `Reg` 表示寄存器，`counter` 会随着时钟沿的触发逐渐增加。

## 避免使用 `var` 的更多原因

1. **重新赋值的问题**：

   - 在 Chisel 设计中，重新赋值可能导致设计行为混乱且难以调试。
   - `var` 的作用域可能超出其定义范围，产生意料之外的副作用。

2. **工具检测与警告**：

   - 虽然 Chisel 工具无法完全禁止使用

     ```
     var
     ```

     ，但已经能够检测并发出警告，例如：

     ```
     Source has escaped the scope of the when in which it was constructed.
     ```

3. **无必要性**：

   - 在 Chisel 中已经覆盖了诸如 `map`、`reduce` 等函数式工具，使用 `var` 的需求已显著减少。

### 示例：危险的 `var`

以下示例展示了 `var` 使用不当可能导致的问题：

```scala
class DangerousVar extends Module {
  val io = IO(new Bundle {
    val in = Input(SInt(8.W))
    val out = Output(SInt(8.W))
  })

  var w = WireInit(io.in)
  when (io.in < 0.S) {
    w := 0.S // 如果拼写错误为 w = 0.S，会导致意外问题
  }
  io.out := w
}

printVerilog(new DangerousVar)
```

**解析**：

- `var w` 被定义为可变变量，并通过 `WireInit` 初始化。
- 如果不小心使用 `=`（而非 `:=`），可能会导致硬件设计逻辑错误。

**改进建议**：

- 避免使用 `var`，通过 `Wire` 或 `Reg` 明确定义硬件信号。

## 谨慎使用可变集合

在硬件设计中，尽量避免使用可变集合，而优先采用函数式编程工具，如 `map`、`foreach` 等：

### 示例：增量操作

#### 不良实现

```scala
val a = ArrayBuffer.tabulate(5)(_.toInt)
for (i <- 0 until 5) {
  a(i) += 1
}
```

- 使用了可变集合 `ArrayBuffer` 和迭代，易引入副作用，且不直观。

#### 改进实现

```scala
val orig = Seq.tabulate(5)(_.toInt)
val incremented = orig.map(_ + 1)
```

- 使用不可变集合 `Seq` 和 `map` 方法，无需显式迭代或更改集合。

### 总结

1. 避免复杂的嵌套 `when`，使用逻辑运算符如 `AND` 简化条件。
2. 谨慎处理可变性，尽量使用不可变引用 `val` 和寄存器 `Reg` 表示状态。
3. 尽量避免 `var`，通过 `map` 等函数式工具替代。
4. 减少可变集合的使用，提升代码的简洁性与可读性。

通过以上优化，Chisel 代码将更清晰、更易维护，同时有效避免潜在错误。

## 减少特殊情况的数量

在硬件设计中，代码中包含过多硬编码的特殊情况会导致可维护性差，尤其当需要处理大量参数值时。这种方法难以扩展。例如：

- 为每个可能的参数值编写特殊处理代码会导致复杂度爆炸。

### 通用原则

1. 减少代码中的特殊情况：

   - 使用像 `foldLeft` 这样的函数式工具，它们可以优雅地处理 0 个或多个元素，无需特殊处理空集的情况。
   - 如果必须处理特殊情况，尽量限制为**单一特殊情况**。
   - 如果需要多个特殊情况，尝试将其**泛化**为更通用的规则。

## `for` 和 `foreach` 在 Chisel 中的作用

在 Chisel 中，`for` 和 `foreach` 都会影响硬件设计的构造方式，它们的主要作用是生成任意数量的连接。

### 使用建议

1. **最佳用途**：

   - 创建任意数量的连接。
   - 它们的主要优点是可以产生副作用，例如在循环中生成硬件连接。

2. **选择合适的工具**：

   - 如果需要产生结果，`map` 更适合，因为它会返回一个新集合。
   - 如果仅关注副作用（如生成连接），使用 `foreach`。

3. **代码风格建议**：

   - 当集合或范围已经存在时，优先使用 `foreach`。

   - 如果需要创建范围或索引变量，使用

     ```
     for
     ```

     。

     - 可以使用 `.zipWithIndex` 配合 `foreach`，但会显得繁琐。

## 避免不必要的额外逻辑

尽管 CAD 工具可以优化掉低效的逻辑，但尽量避免不必要的复杂逻辑仍然是设计清晰代码的重要实践。

### 简化逻辑的好处

- 更简单的逻辑更容易阅读、维护和调试。

### 常见建议

1. **二维网格中的索引逻辑**：

   - 许多代码中使用 `%` 和 `/` 提取行和列的索引，但这些操作在硬件中是相对复杂的。
   - 更好的方法是使用两个计数器（分别用于行和列）。
   - 避免使用 `%` 和 `/`，除非绝对必要。
   - 如果需要生成单一索引，可以使用 `*` 操作，但这通常也可以避免。

2. **位操作**：

   - 对于位的访问和移动，避免使用软件中的移位操作（

     ```
     <<
     ```

      和

     ```
     &
     ```

     ），尽量使用 Chisel 提供的工具：

     - `x(hi, lo)`：选择比特范围。
     - `tail` 和 `head`：提取尾部或头部比特。
     - `Cat`：将多个比特拼接在一起。

## Chisel 风格：避免在 `when` 中声明重要的硬件

在 Chisel 中，`when` 块的作用仅仅是控制硬件信号的激活连接，而不是控制硬件模块的实例化。

### 原因

- 在 `when` 块中声明的硬件总是会被实例化并存在，只是条件控制了它的连接。
- 与此相对，Scala 中的 `if` 块可能不会实例化其中的内容。

### 最佳实践

- 为了代码意图更清晰，建议将重要的硬件实例化放在 `when` 块之外。

### 示例代码

```scala
class CounterWhenDemo extends Module {
  val io = IO(new Bundle {
    val en = Input(Bool())
    val in = Input(UInt(8.W))
    val out = Output(UInt(8.W))
  })

  io.out := 0.U
  when (io.en) {
    val (count, wrap) = Counter(0 until 4) // 计数器实例化
    io.out := count
  }
}

printVerilog(new CounterWhenDemo)
```

### 解析

- 计数器 `Counter` 实际上总是被实例化，即使 `io.en` 为假。
- 将计数器实例化移到 `when` 块之外会更清晰。

## Scala 风格：使用 `until` 或 `to`

Scala 提供了两种用于生成范围的语法：

- **`until`**：生成**排除上界**的范围。
- **`to`**：生成**包含上界**的范围。

### 建议

- 通常无需显式地在范围中使用 `n-1` 或 `n+1`。
- 可以将 `0 to n-1` 转换为 `0 until n`。

### 示例

```scala
val n = 4
(0 until n) foreach println
```

## 总结

1. 减少特殊情况：

   - 限制代码中的特殊处理，并尝试泛化规则以提高可扩展性。

2. 高效使用循环：

   - 根据需要选择 `for` 或 `foreach`，并避免过于复杂的索引处理逻辑。

3. 避免额外逻辑：

   - 减少 `%` 和 `/` 操作，优先使用更简单的计数器或工具。

4. 避免在 `when` 中声明重要硬件：

   - 将硬件实例化放在 `when` 块之外以增强代码可读性和意图表达。

5. 遵循 Scala 风格指南：

   - 使用 `until` 或 `to` 定义范围，以简化边界处理。

通过以上优化，可以显著提升代码的清晰度、可维护性和效率，同时避免常见的设计陷阱。

## 何时使用 `require` 和 `assert`？

在硬件设计和软件开发中，经常需要对输入、逻辑或运行时条件进行验证。Chisel 和 Scala 都提供了验证工具，但它们的使用场景和机制有所不同。

### Chisel 中的 `assert`

- Chisel 的

  ```
  assert
  ```

   仅在

  仿真阶段

  检查条件，而不会在硬件构造期间（synthesis）起作用。

  - 其作用是生成非综合的 Verilog 代码，用于测试时验证逻辑正确性。

- 适用于结果类型为 `Bool` 的 Chisel 比较操作。

- 支持自定义断言消息。

### Scala 中的 `assert`

- Scala 的

  ```
  assert
  ```

   在

  硬件构造阶段

  检查条件，但不会在仿真阶段使用。

  - 其结果是 `Boolean` 类型（Scala 的比较结果）。

- 常用于调试 Scala 代码而非验证硬件信号。

### 推荐：优先使用 `require` 而非 Scala 的 `assert`

- **`require`**：用于检查输入合法性（通常在模块构造阶段验证输入参数是否合理）。
- **`assert`**：用于检查内部逻辑一致性（通常在仿真阶段验证内部信号是否符合预期）。
- 通过设置编译标志，可以在编译时移除 Scala 的 `assert`（但不能移除 `require`）。

### 示例代码：多种类型的 `assert`

以下代码展示了如何使用 `require` 和 `assert`：

```scala
class CheckNonZero(width: Int) extends Module {
  val io = IO(new Bundle {
    val in = Input(UInt(width.W))
    val out = Output(UInt(width.W))
  })

  require(width > 0) // 检查输入宽度是否大于 0
  assert(io.in > 0.U, "saw <=0 input") // 检查输入值是否大于 0
  io.out := io.in
}

printVerilog(new CheckNonZero(8))
```

**解析：**

- `require` 确保模块参数 `width` 为正，这是硬件构造前的检查。
- `assert` 用于仿真中验证输入信号 `io.in` 是否符合要求。如果断言失败，将输出自定义错误消息 `"saw <=0 input"`。

## 常见问题：如何在模块、函数和类之间做选择？

模块、函数和类的选择取决于代码的复用性、复杂性和清晰度要求。

### 模块的优点

1. **复用性**：设计为模块的硬件实体更容易在不同设计中复用。
2. **测试便利**：模块天然支持单元测试。
3. **降低复杂性**：模块可以通过封装将复杂的逻辑分解为简单的组件。

### 什么时候不使用模块？

- 对于简单的逻辑，用函数代替模块可能更方便：
  - 函数更易于与函数式编程工具（如 `map`）结合使用。
  - 函数可以避免模块化带来的 I/O 开销。
- 如果需要大量实例化，函数比模块更容易处理（工具运行时间、生成的 Verilog 层次结构、波形调试等方面）。

## “压平”与“解压” Bundles

在 Chisel 中，`Bundle` 是一种便于管理多个信号的结构，但在硬件实现中可能需要调整其内存布局。

### Chisel 的默认行为

- Chisel 会为

  ```
  Bundle
  ```

   的每个字段（或

  ```
  Vec
  ```

   的每个元素）生成独立的内存。

  - 这是大多数情况下的最佳选择，因为它便于管理。

- 但是，有些场景需要将所有字段合并为一个内存。

### 工具与方法

1. `getWidth` 方法：

   - 用于计算 `Bundle` 实例的总位宽（即信号的总位数）。

2. `asTypeOf` 方法：

   - 将数据类型转换为指定的 `Bundle` 类型（类似于反向拼接操作）。

### 示例代码：压平与解压 Bundles

以下代码展示了如何在内存中存储 `Bundle` 的所有字段，并从中读取。

```scala
class Pair extends Bundle {
  val a = UInt(1.W)
  val b = UInt(7.W)
}

class MemCohesion extends Module {
  val io = IO(new Bundle {
    val addr = Input(UInt(8.W))
    val out = Output(new Pair())
  })

  val m = Mem(256, UInt((new Pair).getWidth.W)) // 内存存储压平的 Pair
  io.out := m(io.addr).asTypeOf(new Pair) // 解压内存中的 Pair
}

printVerilog(new MemCohesion)
```

### 解析

1. 定义了一个包含两个字段 `a` 和 `b` 的 `Bundle`。
2. 内存 `m` 被定义为一个存储 256 个压平 `Pair` 的数组，其位宽为 `new Pair.getWidth`。
3. 通过 `asTypeOf` 方法，将存储的压平数据转换回 `Pair` 类型，便于输出。

## 总结

1. `require` 和 `assert` 的区别：

   - `require` 用于构造阶段的输入检查，`assert` 用于仿真阶段的逻辑验证。

2. 模块、函数与类的选择：

   - 优先选择模块用于复用和测试，函数用于简单逻辑，类适用于特殊的功能性封装。

3. 压平与解压 `Bundle`：

   - 使用 `getWidth` 压平信号以优化内存存储，使用 `asTypeOf` 解压信号以恢复语义清晰的结构。

通过这些实践，可以更高效地利用 Chisel 设计复杂的硬件，同时确保代码的复用性、可维护性和可读性。
