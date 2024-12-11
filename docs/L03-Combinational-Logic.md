# Combinational Logic

### 今日课程目标

- 理解 **参数化** 和 **条件选择** 的基本概念。
- 掌握如何在 Chisel 中使用多路选择器（`Mux`）。
- 构建组合逻辑电路，为更复杂的设计打下基础。

---

### 加载 Chisel 库

在 Notebook 环境中，加载 Chisel 和相关工具库，以便进行设计和仿真：

```scala
interp.load.module(os.Path(s"${System.getProperty("user.dir")}/../resource/chisel_deps.sc"))

import chisel3._
import chisel3.util._
import chiseltest._
import chiseltest.RawTester.test
```

这些库提供了基础硬件构造工具（`chisel3._`）、通用硬件工具（`chisel3.util._`）以及测试支持（`chiseltest._`）。

---

### Chisel 的多路选择器（Mux）

#### **Mux 的基本形式**

Chisel 中的 `Mux` 函数类似于 Verilog 或 C 中的三元条件运算符（`? :`），用于根据选择信号输出不同的输入值。

**语法**：

```scala
Mux(select, in1, in0)
```

- **`select`**：布尔类型的选择信号，值为 `true` 时输出 `in1`，值为 `false` 时输出 `in0`。
- **`in1`**：当 `select` 为 `true` 时选择的输入。
- **`in0`**：当 `select` 为 `false` 时选择的输入。

#### **示例：两路选择器**

```scala
val result = Mux(sel, a, b)  // 如果 sel 为 true，输出 a；否则输出 b
```

#### **多种 Mux 类型**

除了基本的 `Mux`，Chisel 提供了适用于多种需求的扩展版本：

- **`MuxCase`**：基于多个条件进行选择。
- **`Mux1H`**：优先选择多个输入中的某一个（只允许一个高电平）。

---

### 实现一个简单的多路选择器模块

#### **模块定义**

以下代码实现了一个两路选择器：

```scala
class MyMux extends Module {
  val io = IO(new Bundle {
    val s = Input(Bool())      // 选择信号
    val in0 = Input(Bool())    // 输入 0
    val in1 = Input(Bool())    // 输入 1
    val out = Output(Bool())   // 输出
  })

  io.out := Mux(io.s, io.in1, io.in0) // 根据 io.s 选择输入
}
```

#### **代码解析**

1. **输入输出接口**：
   - 使用 `Bundle` 定义多路选择器的输入（`s`、`in0`、`in1`）和输出（`out`）。
   - 输入和输出均为布尔类型（`Bool`）。
2. **逻辑实现**：
   - 调用 `Mux` 函数，根据 `io.s` 信号的值选择 `io.in1` 或 `io.in0`。

#### **生成 Verilog**

可以通过以下代码生成对应的 Verilog 硬件描述：

```scala
printVerilog(new MyMux)
```

**输出示例**：

```verilog
module MyMux(
  input   s,
  input   in0,
  input   in1,
  output  out
);
  assign out = s ? in1 : in0; // Verilog 中的三元选择器
endmodule
```

---

### 可视化设计

Chisel 提供工具将硬件模块的结构图形化呈现，使设计的信号流一目了然：

```scala
visualize(() => new MyMux)
```

设计中 `io.s` 控制信号负责选择 `in0` 或 `in1` 的输出路径，具体信号流如图所示。

---

### 使用 Mux 设计更复杂的电路

#### **多路选择扩展**

可以通过嵌套多个 `Mux` 构造多路选择器：

```scala
val out = Mux(sel0, 
              Mux(sel1, in3, in2), 
              Mux(sel1, in1, in0))
```

或者使用 Chisel 提供的 **`MuxCase`** 进行简化：

```scala
val out = MuxCase(default, Array(
  (cond1 -> in1),
  (cond2 -> in2),
  (cond3 -> in3)
))
```

#### **优先选择器（Priority Mux）**

**`Mux1H`** 用于实现优先选择：

```scala
val out = Mux1H(Seq(
  sel0 -> in0,
  sel1 -> in1,
  sel2 -> in2
))
```

要求 `sel` 中仅一个信号为高电平。

---

### 总结

通过学习 Chisel 中的多路选择器（`Mux`）及其扩展功能，设计者可以轻松构造条件选择逻辑，支持从简单到复杂的组合电路设计。结合参数化和条件选择，Chisel 提供了强大的灵活性与高效性，为后续的模块化设计奠定了基础。

## Chisel 参数化与 Scala 类基础

硬件设计中，模块参数化是提高设计灵活性和复用性的核心方法。通过参数化，可以根据需求动态配置模块的位宽或功能。Chisel 使用 Scala 的类构造功能，实现模块的参数化设计。

---

### Scala 类的基本概念

#### **Scala 的 `class` 关键字**

在 Scala 中，`class` 是创建对象和定义行为的基础。以下是一些关键概念：

1. **构造函数参数**：
   - 类的构造函数参数直接在类定义中声明。
   - 使用 `val` 或 `var` 将参数暴露为公共成员，否则仅在类内部可见。
2. **实例化对象**：
   - 使用 `new` 关键字创建类的实例。
   - 实例化时会自动调用类的构造函数。
3. **默认访问控制**：
   - 类的成员默认是公共的（`public`），无需显式声明。

#### **示例：定义与实例化类**

```scala
class MyClass(argS: String, argI: Int) {
  val name = argS         // 构造参数通过 val 声明为公共成员
  println("Created " + argS)
}

val mc = new MyClass("mc", 4)
println(mc.name)           // 输出 "mc"
// println(mc.argI)        // 错误：argI 仅在类内部可见
```

通过 `val` 将构造参数暴露为公共成员，可以直接访问 `mc.name`。

---

### 在 Chisel 中实现参数化设计

#### **参数化多路选择器（Mux）**

在硬件设计中，模块的输入、输出信号的位宽通常需要灵活调整。例如，多路选择器的输入、输出位宽应由参数决定。Chisel 支持使用 Scala 类参数实现动态参数化。

#### **实现一个参数化的 Mux 模块**

以下代码定义了一个位宽可配置的多路选择器：

```scala
class MyPMux(w: Int) extends Module {
  val io = IO(new Bundle {
    val s = Input(Bool())        // 选择信号
    val in0 = Input(UInt(w.W))   // 输入 0，位宽由参数 w 决定
    val in1 = Input(UInt(w.W))   // 输入 1，位宽由参数 w 决定
    val out = Output(UInt(w.W))  // 输出，位宽由参数 w 决定
  })

  io.out := Mux(io.s, io.in1, io.in0) // 根据选择信号 io.s 输出 in1 或 in0
}
```

#### **代码解析**

1. **模块参数化**：
   - 构造函数参数 `w: Int` 定义了位宽，可在实例化时指定。
2. **信号位宽动态配置**：
   - 使用 `UInt(w.W)` 为输入/输出信号动态指定位宽。
   - `w.W` 表示将 Scala 整数 `w` 转换为 Chisel 的位宽描述。
3. **逻辑实现**：
   - 使用 `Mux` 实现两路选择器，逻辑与之前非参数化模块一致。

#### **实例化与生成 Verilog**

```scala
printVerilog(new MyPMux(8))  // 生成一个 8 位宽的多路选择器
```

**生成的 Verilog 代码**：

```verilog
module MyPMux(
  input        s,
  input  [7:0] in0,    // 输入位宽为 8
  input  [7:0] in1,    // 输入位宽为 8
  output [7:0] out     // 输出位宽为 8
);
  assign out = s ? in1 : in0;
endmodule
```

此设计通过参数化灵活适配不同位宽需求，无需重复定义多个模块。

---

### 参数化的优势与扩展

#### **1. 提高模块的通用性**

- 参数化设计使得模块能够适应不同的需求，而无需重写代码。
- 例如，位宽、输入输出通道数都可以通过参数动态调整。

#### **2. 与 Scala 类型结合**

- 参数可以是任意 Scala 类型（整数、布尔值等），并在模块内部进行转换：

  ```scala
  class ConfigurableAdder(val width: Int, val signed: Boolean) extends Module {
    val io = IO(new Bundle {
      val a = Input(if (signed) SInt(width.W) else UInt(width.W))
      val b = Input(if (signed) SInt(width.W) else UInt(width.W))
      val sum = Output(if (signed) SInt(width.W) else UInt(width.W))
    })
  
    io.sum := io.a + io.b
  }
  ```

#### **3. 支持更复杂的硬件配置**

- 多输入的优先选择器（`Mux1H`）或多条件选择器（`MuxCase`）可以通过参数扩展为支持任意输入通道数。

#### **4. 高效资源复用**

- 参数化模块可以复用相同的逻辑，避免重复设计，减少开发成本。

---

### 小结

通过将 Scala 的类构造和 Chisel 的硬件描述结合，设计者能够轻松实现模块的参数化，大幅提升设计的灵活性和通用性。参数化设计适用于位宽动态配置、多路选择扩展等场景，为现代硬件开发提供了高效的解决方案。

## Scala 条件语句与 Chisel 条件选择

在硬件设计中，条件选择是基本但非常重要的概念。在 Chisel 和 Scala 中，条件逻辑可以以不同方式实现，并在电路级别和生成级别表现出显著的区别。以下详细讨论 Scala 的 `if/else` 和 Chisel 的 `Mux` 条件选择。

---

### Scala 中的 `if/else`

Scala 的条件语句类似于其他编程语言，但具有以下独特特性：

#### **特点**

1. **函数式特性**：
   - `if/else` 是一个表达式，返回最后一个分支的值。
   - 适用于将条件逻辑直接嵌入表达式。
2. **简洁语法**：
   - 单行分支可以省略花括号 `{}`。
   - 多行分支推荐使用完整的花括号语法以保持清晰性。

#### **示例**

```scala
val condition = true

// 标准 if/else 用法
if (condition) {
  println("true case")
} else {
  println("false case")
}

// 作为表达式的 if/else
val x = if (condition) 3 else 4
println(x)  // 输出 3
```

---

### Chisel 中的条件逻辑（`Mux`）

在硬件设计中，`Mux` 是条件选择的核心组件，它在电路中通过硬件实现逻辑分支，而不是像 Scala 的 `if/else` 那样在生成时确定。

#### **特点**

1. **电路级选择**：

   - `Mux` 基于运行时的信号值决定输出，因此硬件会保留所有可能路径。

2. **实时计算**：

   - 输入信号的值决定选择的路径，而非生成时的静态值。

3. **语法**：

   ```scala
   val result = Mux(select, inTrue, inFalse)
   ```

---

### 条件逻辑的对比：**电路级选择** vs. **生成时选择**

#### **1. 在电路中：Chisel 的 `Mux`**

- **运行时行为**：
  电路中保留两条可能路径，选择信号（`select`）决定具体使用哪一条。

- **示例**：计算绝对值：

  ```scala
  val absX = Mux(x < 0.S, -x, x)
  ```

  - 逻辑：

    - 如果 `x < 0`，选择 `-x`；
    - 否则选择 `x`。

  - 硬件表示：

    - 包括一个比较器（`<`）、一个取反操作（`-`）以及一个多路选择器（`Mux`）。

- **电路结构图**： 如图所示，`Mux` 的两个路径 `-x` 和 `x` 同时存在，`x < 0` 的结果决定输出路径。

---

#### **2. 在生成时：Scala 的 `if/else`**

- **生成时行为**：
  `if/else` 根据生成器参数（非信号值）决定执行路径，仅生成选定路径的硬件。

- **示例**：条件取反：

  ```scala
  val invX = if (invert) -x else x
  ```

  - 逻辑：

    - 如果 `invert` 为真，生成 `-x` 的硬件；
    - 如果 `invert` 为假，生成 `x` 的硬件。

- **硬件表示**：

  - 根据 `invert` 值，在生成时决定仅保留一条路径。
  - 例如：
    - 如果 `invert = true`，仅生成取反的硬件。
    - 如果 `invert = false`，仅生成直通的硬件。

- **电路结构图**： 不同于 `Mux`，Scala 的 `if/else` 在硬件中只实现一个路径。

---

### 使用场景的选择

#### **1. 使用 `Mux`**

- **实时选择**：当需要基于信号值动态决定输出时，使用 `Mux`。

- 典型场景：

  - 输入信号的实时选择（如多路复用器）。
  - 算术操作中的动态路径选择（如绝对值计算）。

#### **2. 使用 `if/else`**

- **生成时优化**：当条件仅与生成器参数相关，且不依赖运行时信号时，使用 `if/else`。

- 典型场景：

  - 硬件生成器的配置。
  - 模块实例化时的固定选择。

---

### 小结

- **`Mux`**：在电路中动态选择路径，硬件包含所有可能分支。

- **`if/else`**：在生成时确定路径，硬件仅保留选定分支。

- 选择关键：

  - 运行时信号 -> 使用 `Mux`。
  - 静态生成器参数 -> 使用 `if/else`。

理解两者的差异和适用场景，是高效进行硬件设计的关键，为不同需求选择合适的方法能显著提升设计质量和性能。

## Chisel 前端工具链与硬件设计执行过程

在 Chisel 中，前端工具链和执行过程负责从 Scala 程序生成具体的硬件描述。通过理解工具链与执行流程，设计者可以高效地编写和调试硬件模块。以下重点讨论工具链的前端部分、硬件设计的生成过程，以及 Scala 值如何作为对 Chisel 对象的引用。

---

### Chisel 前端工具链回顾

1. **设计的表达与生成**：
   - Chisel 是基于 Scala 的硬件描述语言，设计由 Scala 程序构建并最终生成硬件描述。
   - **`.fir` 文件**（FIRRTL 中间表示）是 Chisel 工具链生成的具体硬件实例，后续可以被用于仿真或硬件实现。
2. **生成文件的作用**：
   - **仿真**：`.fir` 文件直接用于轻量级仿真工具（如 Treadle）。
   - **实现**：FIRRTL 工具链将 `.fir` 文件转化为 Verilog，用于传统 CAD 工具进行 FPGA 或 ASIC 的实现。

---

### Chisel 的执行过程

#### **硬件设计的生成逻辑**

Chisel 的执行过程与常规软件执行有显著不同，它更接近于硬件生成器的概念：

1. **Scala 程序的执行**：
   - Chisel 程序在运行时利用 Chisel 库动态构建硬件设计。
   - 程序的执行过程即为硬件模块的生成过程。
2. **设计的 Elaborate 阶段**：
   - 程序结束后，Chisel 将构造好的硬件设计 elaborated（展开并导出），最终输出为 `.fir` 文件，表示具体的硬件实例。

#### **Chisel 的核心操作**

Chisel 的硬件设计过程由简单的操作构成，Scala 提供了对这些操作的高效组合支持：

1. **组件的构造**：
   - Chisel 的组件包括逻辑运算符、信号线、寄存器和模块等。
2. **组件的实例化与连接**：
   - 使用 Chisel 库实例化这些组件，并通过连接符（`:=`）描述它们之间的信号关系。
3. **空间化的设计方式**：
   - Chisel 的设计以空间化（spatial）的方式组织硬件，即创建并连接组件。
   - 与传统软件的时序化（temporal）描述方式不同，这种方式更贴近硬件的结构化特性。

#### **示例：硬件设计的执行过程**

```scala
class MyXOR extends Module {
  val io = IO(new Bundle {
    val a = Input(Bool())
    val b = Input(Bool())
    val c = Output(Bool())
  })

  val myGate = io.a ^ io.b  // 使用 XOR 运算构造中间信号
  io.c := myGate            // 将中间信号连接到输出
}
```

- 执行过程：

  - 运行 Scala 程序时，`io.a ^ io.b` 动态创建了 XOR 门的硬件描述，并将结果存储在 `myGate`。
  - `io.c := myGate` 表示将 XOR 运算结果连接到模块的输出端口。

---

### Scala 值作为 Chisel 对象的引用

在 Chisel 中，Scala 的变量可以用来引用硬件对象（信号、模块、寄存器等）。这种机制极大地提高了代码的清晰性和可维护性。

#### **Scala 引用与 Chisel 对象**

1. **变量与连接**：
   - Scala 的变量（`val`）可以引用 Chisel 的硬件对象。
   - 通过 `:=` 操作符将硬件对象连接到输入输出信号。
2. **中间结果的引用**：
   - 中间结果（如逻辑运算的输出）可以用 Scala 的变量保存，并在后续逻辑中复用。

#### **示例**

```scala
class MyXOR extends Module {
  val io = IO(new Bundle {
    val a = Input(Bool())
    val b = Input(Bool())
    val c = Output(Bool())
  })

  val myGate = io.a ^ io.b   // Scala 变量引用 XOR 逻辑对象
  io.c := myGate             // 使用连接符将 myGate 的值分配给 io.c
}
```

- 图示化说明：

  - 输入信号 `a` 和 `b` 被 XOR 门计算后，结果存储在 `myGate`。
  - `myGate` 的值通过连接符（`:=`）传递给输出端口 `c`。

---

### 核心思想总结

#### **工具链与设计流程**

- Chisel 程序的执行既是硬件生成的过程，最终输出为硬件设计文件（如 `.fir`）。
- 通过工具链前端完成从高级设计到中间表示的转换，为仿真和实现提供基础。

#### **Scala 与 Chisel 的结合**

- Scala 提供了高效的编程范式，支持硬件设计中的模块化、复用和动态生成。
- Scala 值作为对 Chisel 对象的引用，使得硬件逻辑设计更为直观。

#### **生产性与空间化设计**

- Chisel 的硬件设计是以组件的实例化与连接为核心，遵循空间化的设计方式。
- 借助 Scala 的元编程能力，Chisel 实现了更高的生产效率和灵活性。

这种结合不仅降低了硬件设计的复杂度，还为设计者提供了强大的工具支持，用于构建复杂而灵活的硬件模块。

## Chisel 中的 `Wire`

在 Chisel 中，`Wire` 是一个关键组件，用于在硬件设计中创建中间连接信号。与寄存器（`Reg`）不同，`Wire` 表示的是一个**无状态**的组合逻辑信号，通常用于在设计中传递数据或连接模块的输入输出。

---

### 什么是 `Wire`

- **用途**：`Wire` 通常用来连接硬件信号，尤其是在信号的驱动关系尚未完全确定时。

- 特点：

  - 是一个**组合逻辑信号**。
  - 没有状态（无存储功能），与寄存器（`Reg`）不同。
  - 需要在设计中显式驱动，否则会引发未连接错误。

---

### 典型用法

#### **1. 定义一个 `Wire`**

通过 `Wire` 创建一个布尔类型的中间信号：

```scala
val myWire = Wire(Bool())  // 定义一个布尔类型的 Wire
```

- **参数**：`Wire` 的类型需要显式指定，如 `Bool()`、`UInt()` 或 `SInt()`。
- **作用**：`Wire` 作为一个中间信号，可在设计中被连接或操作。

#### **2. 为 `Wire` 赋值**

`Wire` 必须在硬件设计中被驱动，通常使用 `:=` 操作符：

```scala
myWire := io.a ^ io.b  // myWire 被赋值为 a 和 b 的异或结果
```

- **注意**：`:=` 是 Chisel 中的连接符，用于连接硬件信号。

#### **3. 将 `Wire` 用作输出**

`Wire` 可以作为模块输出的一部分，传递信号给其他模块：

```scala
io.c := myWire  // 将 myWire 的值连接到输出端口 io.c
```

---

### 示例：使用 `Wire` 实现一个 XOR 模块

以下代码演示如何使用 `Wire` 构建一个简单的 XOR 模块：

```scala
class MyXOR2 extends Module {
  val io = IO(new Bundle {
    val a = Input(Bool())
    val b = Input(Bool())
    val c = Output(Bool())
  })

  val myWire = Wire(Bool())    // 定义中间信号
  myWire := io.a ^ io.b        // myWire 被赋值为 a 和 b 的异或结果
  io.c := myWire               // 将 myWire 连接到输出端口 c
}
```

#### **代码解析**

1. **输入输出接口**：
   - `io.a` 和 `io.b` 是输入信号。
   - `io.c` 是 XOR 运算的输出信号。
2. **中间信号 `myWire`**：
   - 定义 `Wire(Bool())` 作为中间信号，用于存储异或运算的结果。
3. **逻辑实现**：
   - `myWire := io.a ^ io.b` 计算 XOR 运算结果，并赋值给 `myWire`。
   - `io.c := myWire` 将计算结果通过 `myWire` 传递到输出端口。

---

### Verilog 代码生成

通过以下代码生成 Verilog：

```scala
printVerilog(new MyXOR2)
```

**生成的 Verilog 示例**：

```verilog
module MyXOR2(
  input   a,
  input   b,
  output  c
);
  wire myWire;
  assign myWire = a ^ b;  // myWire 是中间信号
  assign c = myWire;      // myWire 的值连接到输出端口 c
endmodule
```

---

### `Wire` 的应用场景

1. **连接复杂信号**：
   - 在组合逻辑中，`Wire` 用于连接和传递中间信号。
2. **配合条件语句**：
   - `Wire` 常与 `when/elsewhen/otherwise` 语句结合，用于灵活描述硬件逻辑。
   - 示例将在下一部分详细讨论。
3. **调试和信号复用**：
   - `Wire` 可以简化信号路径，方便设计调试和信号复用。

---

### 图示说明

如图所示：

- `io.a` 和 `io.b` 通过异或门连接，结果存储在 `myWire`。
- `myWire` 作为中间信号，最终连接到输出端口 `io.c`。

---

### 小结

- **`Wire` 的核心功能**：表示组合逻辑信号，用于连接输入输出和中间信号。

- 注意事项：

  - `Wire` 必须显式驱动，否则会引发未连接错误。
  - `Wire` 没有存储功能，仅在组合逻辑中使用。

- 灵活性：

  - 配合条件语句、复杂逻辑和信号复用，`Wire` 是硬件设计中不可或缺的工具。

## Chisel 条件构造：`when`、`otherwise` 和信号连接规则

在硬件描述中，条件语句用于根据不同的输入状态实现不同的逻辑功能。Chisel 提供了 `when`、`elsewhen` 和 `otherwise` 构造，用于条件逻辑表达。同时，Chisel 的 "最后连接优先"（Last Connect）语义提供了灵活的信号连接方式。

---

### **1. Chisel 的 `when` 条件构造**

#### **功能**

- `when` 是 Chisel 中的条件语句，用于描述硬件中的条件逻辑。
- 在底层实现中，`when` 会生成由多路选择器（`Mux`）组成的逻辑电路。

#### **基本语法**

```scala
when(condition) {
  // 当 condition 为 true 时执行
} .elsewhen(condition2) {
  // 当 condition 为 false 且 condition2 为 true 时执行
} .otherwise {
  // 以上条件均不满足时执行
}
```

- `when` 相当于硬件中的优先级逻辑。
- `elsewhen` 用于添加额外条件，类似 `else if`。
- `otherwise` 用于处理默认情况。

---

#### **示例：条件多路选择器**

以下代码使用 `when` 实现一个带条件的多路选择器：

```scala
class MyWMux(w: Int) extends Module {
  val io = IO(new Bundle {
    val s = Input(Bool())          // 选择信号
    val in0 = Input(UInt(w.W))     // 输入 0
    val in1 = Input(UInt(w.W))     // 输入 1
    val out = Output(UInt(w.W))    // 输出
  })

  when(io.s) {
    io.out := io.in1               // 如果 s 为 true，选择 in1
  } .otherwise {
    io.out := io.in0               // 否则选择 in0
  }
}
```

#### **生成 Verilog**

运行以下代码生成 Verilog：

```scala
printVerilog(new MyWMux(8))
```

**生成的 Verilog 示例**：

```verilog
module MyWMux(
  input        s,
  input  [7:0] in0,
  input  [7:0] in1,
  output [7:0] out
);
  assign out = s ? in1 : in0;  // 使用三元选择器实现
endmodule
```

---

### **2. Chisel 的信号连接规则：Last Connect**

#### **"最后连接优先" 的含义**

- 在 Chisel 中，信号可以被多次连接（多次赋值）。
- **最后一次连接的值**将作为信号的最终值。

#### **示例：多次连接**

以下代码演示信号的多次连接：

```scala
class LastC extends Module {
  val io = IO(new Bundle {
    val x = Input(Bool())          // 输入信号
    val y = Output(UInt())         // 输出信号
  })

  val w = Wire(UInt())             // 定义一个中间信号
  w := 1.U                         // 默认值为 1
  when(io.x) {
    w := 7.U                       // 如果 x 为 true，将 w 赋值为 7
  }
  io.y := w                        // 将最终的 w 赋值给输出 y
}
```

#### **生成 Verilog**

```scala
printVerilog(new LastC)
```

**生成的 Verilog 示例**：

```verilog
module LastC(
  input        x,
  output [31:0] y
);
  wire [31:0] w;
  assign w = x ? 7 : 1;   // 最终生成三元逻辑
  assign y = w;
endmodule
```

- `w` 在逻辑上相当于 `Mux(io.x, 7, 1)`。

---

### **3. `when` 与信号连接的结合使用**

#### **结合 `when` 实现多条件逻辑**

多条件逻辑通过 `when` 和 `elsewhen` 描述硬件行为：

```scala
val w = Wire(UInt())
w := 0.U  // 默认值
when(io.a === 1.U) {
  w := 4.U
} .elsewhen(io.b === 1.U) {
  w := 8.U
} .otherwise {
  w := 12.U
}
io.out := w
```

- `w` 的最终值由 `when/elsewhen/otherwise` 的逻辑决定。

---

### **4. 注意事项与设计最佳实践**

1. **默认值设置**：
   - 确保在条件逻辑之前为信号赋默认值（例如 `w := 0.U`）。
   - 避免未连接信号引发编译错误。
2. **信号优先级**：
   - 在 `when` 语句中，条件从上到下按顺序匹配，第一个匹配的条件会被执行。
3. **优化电路结构**：
   - 使用 `Mux` 或 `when` 时，尽量简化条件逻辑，避免生成过于复杂的电路。

---

### 图示解析

1. **`when` 条件逻辑**：
   - `when(io.s)` 会生成一个选择器，决定输出信号连接到 `in1` 或 `in0`。
   - 硬件中底层实现为多路选择器（`Mux`）。
2. **Last Connect 优先级**：
   - 信号 `w` 最终值为程序最后一次赋值的结果，形成了优先级逻辑。

---

### 小结

- `when` 结构：

  - 描述硬件中的条件逻辑，适用于组合逻辑。
  - 底层通过 `Mux` 实现。

- "最后连接优先" 语义：

  - 支持信号多次赋值，最后一次连接为最终值。

- 最佳实践：

  - 为信号赋默认值，确保所有可能路径均已覆盖。
  - 在复杂条件逻辑中，合理组织 `when/elsewhen/otherwise` 顺序，避免优先级错误。

## Chisel 设计中的信号连接与位宽处理

在硬件设计中，信号连接和位宽处理是两个重要的问题。Chisel 提供了灵活的工具（如 `when` 条件语句）和位宽管理机制（如截断和扩展），帮助开发者高效地处理这些需求。

---

### **1. 信号连接的 "最后连接优先" 原则**

#### **示例：用 `when` 实现绝对值计算**

`when` 和信号的最后连接规则（Last Connect Semantics）可以结合使用，以实现更灵活的逻辑设计。以下是一个使用 `when` 计算绝对值的例子：

```scala
class WhenAbs(w: Int) extends Module {
  val io = IO(new Bundle {
    val x = Input(SInt(w.W))       // 输入信号，带符号整数
    val absX = Output(SInt(w.W))   // 输出信号，绝对值
  })

  io.absX := io.x                  // 默认值：absX 直接等于 x
  when(io.x < 0.S) {               // 条件：x 小于 0 时
    io.absX := -io.x               // 计算绝对值
  }
}
```

#### **代码解析**

1. **默认值设置**：
   - `io.absX := io.x` 提前为 `io.absX` 设置默认值，确保信号不会悬空。
2. **条件逻辑**：
   - 使用 `when` 语句，根据条件 `io.x < 0` 决定是否重新连接 `io.absX`。
3. **最后连接规则**：
   - 如果 `when` 条件成立，则 `io.absX` 的最终值是 `-io.x`。
   - 否则，`io.absX` 保持默认值 `io.x`。

#### **生成的 Verilog**

```verilog
module WhenAbs(
  input  signed [3:0] x,
  output signed [3:0] absX
);
  assign absX = (x < 0) ? -x : x;  // 使用三元运算符实现绝对值
endmodule
```

- 条件逻辑被转换为 Verilog 的三元运算符。
- 输入和输出均为带符号整数（`SInt`）。

---

### **2. 位宽管理与截断（Truncation）**

#### **位宽推断与操作规则**

1. **位宽推断**：
   - Chisel 自动根据操作符和输入信号的位宽推断结果的位宽。
   - 某些操作（如加法）可能会导致位宽增长，需要截断或扩展以匹配目标信号的位宽。
2. **常见操作符的位宽处理**：
   - **`+`（普通加法）**：可能截断结果位宽。
   - **`+%`（截断加法）**：结果位宽与输入相同。
   - **`+&`（扩展加法）**：结果位宽增加一位，避免溢出。

#### **示例：加法操作的位宽处理**

以下代码展示了三种加法操作的使用：

```scala
class MyAdder(w: Int) extends Module {
  val io = IO(new Bundle {
    val a = Input(UInt(w.W))       // 无符号整数输入 a
    val b = Input(UInt(w.W))       // 无符号整数输入 b
    val c = Output(UInt())         // 输出
  })

  // 普通加法（可能截断位宽）
  io.c := io.a + io.b              // 结果位宽可能小于输入位宽

  // 截断加法（位宽与输入相同）
  // io.c := io.a +% io.b           // 保持输入位宽

  // 扩展加法（结果位宽增加一位）
  // io.c := io.a +& io.b           // 结果位宽为输入位宽 + 1
}
```

---

#### **位宽增长规则**

- **加法**：结果位宽通常为 `max(输入位宽) + 1`。
- **截断加法（`+%`）**：结果位宽与输入一致。
- **扩展加法（`+&`）**：结果位宽始终扩展一位。

---

#### **生成的 Verilog**

运行以下代码生成 Verilog：

```scala
printVerilog(new MyAdder(8))
```

**生成的 Verilog 示例**：

```verilog
module MyAdder(
  input  [7:0] a,
  input  [7:0] b,
  output [7:0] c
);
  assign c = a + b;  // 普通加法，可能截断
endmodule
```

- 如果使用扩展加法（`+&`），`c` 的位宽会增加一位。

---

### **3. 截断与扩展的应用场景**

#### **截断加法（`+%`）的适用场景**

- 输入信号的位宽固定，结果位宽不需要额外增长。
- 典型应用：固定精度计算。

#### **扩展加法（`+&`）的适用场景**

- 输入信号可能溢出，结果需要更高位宽存储。
- 典型应用：累加器设计或计数器设计。

#### **符号位扩展（`SInt`）与零扩展（`UInt`）**

- 对于带符号整数（`SInt`），扩展时会保留符号位。
- 对于无符号整数（`UInt`），扩展时会添加零填充。

---

### **4. 实用建议**

1. **默认值与条件逻辑结合**：
   - 在 `when` 中为信号设置默认值，确保硬件逻辑完整性。
   - 避免未连接信号导致错误。
2. **选择合适的操作符**：
   - 使用 `+` 进行普通加法时，需注意可能的截断。
   - 在需要保持位宽或防止溢出时，优先使用 `+%` 或 `+&`。
3. **明确位宽推断规则**：
   - 熟悉 Chisel 的位宽推断规则，确保结果与预期一致。
   - 在必要时显式设置目标信号的位宽。

---

### 小结

- 信号连接与 `when`：

  - `when` 提供了强大的条件逻辑描述能力，结合默认值与最后连接规则，可实现灵活的逻辑设计。

- 位宽管理：

  - Chisel 自动推断位宽，开发者需要根据需求选择合适的操作符，避免溢出或截断问题。

- 实践中的平衡：

  - 在硬件设计中合理管理信号连接与位宽，能显著提高设计的可靠性和效率。

## 位操作与数据表示转换：Chisel 中的位处理功能

在硬件设计中，处理位范围、数据拼接以及扩展是常见需求。Chisel 提供了丰富的工具来帮助开发者完成这些操作，例如 `x(hi, lo)` 提取位范围、`Cat` 拼接信号和 `Fill` 重复信号。以下详细讲解相关功能，并通过实例展示它们的应用。

---

### **1. 例子：符号与幅值表示（Sign & Magnitude）到二进制补码（2’s Complement）的转换**

#### **背景**

- 在硬件中，有时需要将符号与幅值表示法（Sign & Magnitude）转换为二进制补码（2’s Complement）形式，以便进行算术运算。
- 转换规则：
  - 如果符号位为 1（负数），结果为幅值取反加 1。
  - 如果符号位为 0（正数），结果等于幅值。

#### **实现代码**

```scala
class SignMagConv(w: Int) extends Module {
  val io = IO(new Bundle {
    val sign = Input(Bool())           // 符号位
    val mag = Input(UInt(w.W))         // 幅值部分
    val twos = Output(UInt((w + 1).W)) // 二进制补码结果
  })

  when(io.sign) {
    io.twos := ~io.mag +& 1.U          // 符号位为 1，计算补码
  } .otherwise {
    io.twos := io.mag                  // 符号位为 0，直接传递幅值
  }
}
```

#### **代码解析**

1. **输入输出接口**：
   - `sign` 表示符号位。
   - `mag` 是幅值部分。
   - `twos` 是转换后的二进制补码结果，位宽为 `w + 1`。
2. **条件判断**：
   - 使用 `when` 和 `otherwise` 实现符号条件判断。
3. **二进制补码计算**：
   - 使用取反运算（`~`）和扩展加法（`+&`）确保结果正确。

#### **生成的 Verilog**

```verilog
module SignMagConv(
  input        sign,
  input  [6:0] mag,
  output [7:0] twos
);
  assign twos = sign ? (~mag + 8'd1) : {1'b0, mag};
endmodule
```

---

### **2. 位操作功能**

#### **（1）位范围提取：`x(hi, lo)`**

- **功能**：提取信号的特定位范围。

- **限制**：提取的范围是只读的，不能直接赋值给提取的范围。

- 示例：

  ```scala
  val highBits = x(7, 4) // 提取第 7 到第 4 位
  val singleBit = x(2)   // 提取第 2 位
  ```

#### **（2）信号拼接：`Cat(x, y)`**

- **功能**：将两个或多个信号拼接为一个更宽的信号。

- 示例：

  ```scala
  val combined = Cat(a, b) // a 的高位与 b 的低位拼接
  ```

#### **（3）信号重复：`Fill(n, x)`**

- **功能**：将信号 `x` 按位重复 `n` 次。

- 示例：

  ```scala
  val repeated = Fill(3, x) // 将 x 的位重复 3 次
  ```

---

### **3. 示例：带符号扩展（Sign Extension）**

#### **背景**

- 符号扩展用于扩展信号的位宽，同时保持其数值含义。
- 对于带符号数（`SInt`），扩展时需要复制符号位。
- 对于无符号数（`UInt`），扩展时用零填充高位。

#### **实现代码**

```scala
class SignExtender(win: Int, wout: Int) extends Module {
  val io = IO(new Bundle {
    val in = Input(UInt(win.W))      // 输入信号，宽度为 win
    val out = Output(UInt(wout.W))  // 输出信号，宽度为 wout
  })

  assert(win > 0)                   // 输入宽度必须大于 0
  assert(win <= wout)               // 输出宽度必须大于等于输入宽度

  val signBit = io.in(win - 1)      // 提取最高位（符号位）
  val extension = Fill(wout - win, signBit) // 符号位扩展
  io.out := Cat(extension, io.in)  // 拼接扩展位和输入信号
}
```

#### **代码解析**

1. **输入输出接口**：
   - `in` 是输入信号。
   - `out` 是符号扩展后的输出信号。
2. **符号位提取**：
   - 使用 `io.in(win - 1)` 提取输入信号的最高位（符号位）。
3. **符号扩展**：
   - 使用 `Fill(wout - win, signBit)` 重复符号位，填充高位。
4. **信号拼接**：
   - 使用 `Cat(extension, io.in)` 将扩展位与输入信号拼接。

#### **生成的 Verilog**

```verilog
module SignExtender(
  input  [3:0] in,
  output [7:0] out
);
  assign out = { {4{in[3]}}, in };
endmodule
```

---

### **4. 小结**

- **数据表示转换**：
  - 使用条件语句（`when`）和位操作（`~`、`+&`）轻松实现数据格式转换。
  - 符号与幅值到二进制补码的转换在算术运算中尤为重要。
- **位操作工具**：
  - **提取范围**：`x(hi, lo)`。
  - **信号拼接**：`Cat(x, y)`。
  - **信号重复**：`Fill(n, x)`。
- **实际应用**：
  - 位范围提取常用于访问特定位。
  - 拼接与重复操作用于符号扩展、数据格式转换等场景。

这些工具为 Chisel 提供了强大的位操作能力，帮助开发者高效完成复杂的硬件设计任务。
