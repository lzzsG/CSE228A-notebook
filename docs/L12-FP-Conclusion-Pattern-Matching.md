### **今日学习计划**

- **FP（函数式编程）总结**：
   学习 `flatMap`、`filter` 和 `sum` 等函数式编程方法。
- **模式匹配（Pattern Matching）**：
   理解如何通过模式匹配简化代码逻辑。
- **优雅地处理 Option 类型**：
   掌握处理可能为空值的情境。

### **在 Notebook 中加载 Chisel 库**

可以通过以下代码将 Chisel 库加载到 Notebook 环境中：

```scala
interp.load.module(os.Path(s"${System.getProperty("user.dir")}/../resource/chisel_deps.sc"))
```

加载所需依赖：

```scala
import chisel3._
import chisel3.util._
import chiseltest._
import chiseltest.RawTester.test
```

### **Scala 的 `flatMap`**

#### **定义与用途**

- `flatMap` 类似于 `map`，但会将函数输出结果直接展开（即将嵌套集合展平）。
- 效率更高，直接避免了手动调用 `map` 后再用 `flatten` 的操作。

#### **适用场景**

- 用于函数输出为集合的情况，将结果平展成单层集合。
- 当函数可能返回 0 个或多个元素时，`flatMap` 可以灵活处理。

#### **代码示例**

```scala
val l = 0 until 5
// 使用 map 和 flatten 的组合
l.map { i => Seq.fill(i)(i) }.flatten
// 使用 flatMap 简化
l.flatMap { i => Seq.fill(i)(i) }
```

#### **更多示例**

```scala
// 返回偶数的情况
l flatMap { i => if (i % 2 == 0) Seq(i) else Seq() }
```

### **可视化 `map` 和 `flatMap`**

#### **`map` 的效果**

`map` 将输入集合中的每个元素应用函数 `f`，并将结果存储为一个新的集合：

- **输入**：`[x1, x2, x3...]`
- **输出**：`[f(x1), f(x2), f(x3)...]`

#### **`flatMap` 的效果**

`flatMap` 类似于 `map`，但会对结果集合进行平展：

- **输入**：`[x1, x2, x3...]`
- **输出**：`[f(x1)的所有结果, f(x2)的所有结果...]`

### **Scala 中的谓词（Predicates）**

#### **谓词函数的作用**

谓词函数是针对单个元素返回 `Boolean` 值的函数，用于对集合元素进行筛选或判断。

- 常见谓词操作

  ：

  - `filter`：仅保留满足谓词的元素。
  - `forall`：如果所有元素满足谓词则返回 `true`。
  - `exists`：如果至少有一个元素满足谓词则返回 `true`。

#### **代码示例**

```scala
def isEven(x: Int): Boolean = x % 2 == 0
val l = 0 until 5

// 筛选出偶数
l filter isEven

// 筛选出非偶数
l filterNot isEven

// 检查所有元素是否为偶数
l forall isEven

// 检查是否存在偶数
l exists isEven
```

通过这些操作，可以轻松地处理集合中的元素，并进行逻辑判断。

### **可视化 `filter`**

#### **`filter` 的功能**

`filter` 用于从集合中筛选出符合某一条件的元素。它的核心是一个**谓词函数**，对于集合中的每个元素，只有谓词返回 `true` 时，该元素才会被保留。

#### **示意图**

- **输入**：原始集合
- **函数**：谓词 `f`（决定元素是否保留）
- **输出**：仅包含满足条件的元素的新集合

### **例子：Scala 中的埃拉托色尼素数筛法**

埃拉托色尼筛法是一种经典算法，用于生成一组整数中的所有素数。

#### **代码实现**

```scala
def multipleOf(a: Int)(b: Int): Boolean = (b % a == 0)

def removeMultiplesOfX(l: Seq[Int], x: Int): Seq[Int] = 
  l filterNot multipleOf(x)

val allNums = 2 until 100

def seive(s: Seq[Int]): Seq[Int] = {
  if (s.isEmpty) Seq()
  else Seq(s.head) ++ seive(removeMultiplesOfX(s.tail, s.head))
}

println(seive(allNums))
```

#### **步骤说明**

1. `multipleOf` 用于检查某个数是否是另一个数的倍数。

2. `removeMultiplesOfX` 从集合中移除指定数的所有倍数。

3. ```
   seive
   ```

    是递归实现：

   - 如果集合为空，则返回空集合。
   - 否则，保留集合的第一个元素（即素数），并递归筛选剩余元素。

#### **输出结果**

代码会输出 2 到 100 范围内的所有素数。

### **Scala 内建的常见归约函数**

Scala 提供了许多用于集合归约的内建函数，例如 `sum`、`product`、`min` 和 `max`，用来快速对集合进行数学运算。

#### **代码示例**

```scala
val l = 0 until 5

// 使用 reduce 定义
l reduce { _ + _ }
l reduce { _ * _ }

// 直接调用内建函数
l.sum       // 求和
l.product   // 求积
l.min       // 最小值
l.max       // 最大值
```

#### **结果**

- `l.sum`：集合所有元素的和。
- `l.product`：集合所有元素的积。
- `l.min`：集合中的最小值。
- `l.max`：集合中的最大值。

### **小提示：学习 Scala 风格的方法**

Scala 提供了一些其他语言可能没有的函数和惯用法，比如：

- 集合检查函数：`isEmpty` / `nonEmpty`
- 范围生成：`to` / `until`
- 过滤：`filter` / `filterNot`
- 归约：`foldLeft` / `foldRight`

#### **潜在问题**

- 新手可能不了解 Scala 的丰富特性，从而导致代码中重复造轮子。

#### **解决方案**

1. **使用 IDE**：IDE 可以识别常见错误并建议使用内建函数。
2. **参考优秀代码**：通过阅读他人代码来学习惯用法。
3. **官方文档和资源**：Scala 官方文档和社区资源是非常好的学习工具。

### **函数式编程实现矩阵乘法**

矩阵乘法是函数式编程的一个经典应用场景，利用 Scala 中的集合操作，可以优雅地实现这一过程。

#### **代码实现**

##### **Step 1: 定义矩阵**

用 `Seq.tabulate` 创建矩阵，按行优先的布局：

```scala
val mat = Seq.tabulate(4,4)((i,j) => i+j)
```

##### **Step 2: 提取矩阵的行和列**

- 提取行：

```scala
def grabCol(m: Seq[Seq[Int]], i: Int) = m map { row => row(i) }
```

- 提取列： 类似上方逻辑，用 `grabCol` 函数获取矩阵的列。

##### **Step 3: 实现点乘**

```scala
def dotP(a: Seq[Int], b: Seq[Int]) = a.zip(b).map { case (a_i, b_i) => a_i * b_i }.sum
```

##### **Step 4: 矩阵乘法核心逻辑**

```scala
def matMul(a: Seq[Seq[Int]], b: Seq[Seq[Int]]) = 
  a map { rowOfA => 
    (0 until rowOfA.size) map { colIndex => 
      dotP(rowOfA, grabCol(b, colIndex))
    }
  }
```

### **总结**

通过函数式编程操作（如 `map`、`zip` 等），可以简洁地实现复杂逻辑（如矩阵乘法），同时提升代码的可读性和维护性。这种方法充分体现了 Scala 在函数式编程方面的强大能力。

### **Scala中的模式匹配（Pattern Matching）**

模式匹配是Scala语言的一项强大功能，可以代替简单的`if/else`语句或复杂的`switch`结构，提供更简洁、可读性更强的代码。以下是关于模式匹配的详细介绍和使用案例。

#### **什么是模式匹配？**

模式匹配允许我们根据变量的值或结构，定义不同的处理逻辑。可以通过`match`关键字开始匹配，然后使用`case`定义各个匹配条件。

#### **语法**

```scala
x match {
  case 条件1 => 执行语句1
  case 条件2 => 执行语句2
  ...
  case _     => 默认执行语句
}
```

### **基本用法示例**

#### **代码**

```scala
val x = 0

x match {
  case 0 => "0"
  case 1 | 3 => "nah"          // 匹配多个值
  case y if (y % 2 == 0) => "even" // 带条件的匹配
  case 5 => "found it!"
  case _ => "other"            // 默认匹配
}
```

#### **说明**

1. **单值匹配**：`case 0 => "0"`，当`x`为0时，返回`"0"`。
2. **多值匹配**：`case 1 | 3 => "nah"`，当`x`为1或3时，返回`"nah"`。
3. **带条件匹配**：`case y if (y % 2 == 0) => "even"`，当`x`是偶数时，返回`"even"`。
4. **默认匹配**：`case _ => "other"`，所有未匹配的情况执行此分支。

### **匹配Case Class**

在Scala中，`case class`（样例类）是一种特别适合模式匹配的数据结构。`case class`不仅支持按类型匹配，还支持按字段匹配。

#### **代码示例**

##### **定义抽象类和样例类**

```scala
abstract class Vehicle

case class helicopter(color: String, driver: String) extends Vehicle
case class submarine(color: String, driver: String) extends Vehicle
```

##### **创建数据集**

```scala
val movers = Seq(
  helicopter("grey", "Marta"),
  helicopter("blue", "Laura"),
  submarine("yellow", "Paul")
)
```

##### **样例类匹配**

1. **按类型匹配**

```scala
movers foreach { v => 
  v match {
    case h: helicopter => println(s"${h.color} helicopter")
    case s: submarine  => println(s"${s.color} submarine")
  }
}
```

**输出**

```
grey helicopter
blue helicopter
yellow submarine
```

1. **按字段匹配**

```scala
movers foreach { _ match {
  case helicopter("blue", driver) => println(s"$driver has a blue helicopter")
  case submarine(color, driver) if (color != "yellow") =>
    println(s"$driver's $color submarine")
  case _ => println("didn't match")
}}
```

**输出**

```
Laura has a blue helicopter
didn't match
didn't match
```

### **代码解析**

1. **按类型匹配**
   - `case h: helicopter` 匹配类型为`helicopter`的对象。
   - `case s: submarine` 匹配类型为`submarine`的对象。
2. **按字段匹配**
   - `case helicopter("blue", driver)` 匹配字段`color`为`"blue"`的`helicopter`对象，并将`driver`字段的值绑定到变量`driver`中。
   - `case submarine(color, driver) if (color != "yellow")` 匹配`color`不等于`"yellow"`的`submarine`对象，并绑定`color`和`driver`字段值。
3. **默认情况**
   - `case _` 捕获所有未匹配的情况。

### **总结**

Scala的模式匹配是一个功能强大的工具，不仅可以对简单的数值和字符串进行匹配，还可以对复杂的数据结构（如`case class`）进行深度匹配。同时，支持条件匹配和默认匹配的特性，使得代码更加灵活和优雅。

## **优雅地处理 Scala 的 `Option`**

在 Scala 中，`Option` 是一个封装可能存在或不存在值的容器，它的子类型有两种：`Some(value)` 表示有值，`None` 表示无值。使用 `Option` 可以优雅地避免空指针异常（`NullPointerException`），同时表达更清晰的意图。

### **处理 `Option` 的基本操作**

#### **创建一个包含 `Option` 的序列**

```scala
val l = Seq.tabulate(5)(i => if (i % 2 == 1) Some(i) else None)
```

- 解释

  ：

  - 使用 `Seq.tabulate` 按索引生成序列，序列中的偶数索引位置存储 `None`，奇数索引位置存储 `Some(i)`。
  - 结果：`l = Seq(None, Some(1), None, Some(3), None)`

### **操作和访问 `Option` 的方法**

#### **使用 `foreach` 遍历并打印有效值**

```scala
l foreach { x =>
  if (x.isDefined) println(x.get)
}
```

- **`isDefined`**：检查 `Option` 是否有值。

- **`get`**：提取 `Some(value)` 中的值。

- 输出

  ：

  ```
  1
  3
  ```

#### **其他常用方法**

1. **`getOrElse(default)`**

   - 如果 `Option` 中有值，返回该值；否则，返回默认值。

   ```scala
   println(l(1).getOrElse(-1)) // 输出：1
   println(l(0).getOrElse(-1)) // 输出：-1
   ```

2. **`flatten`**

   - 如果 `Option` 是嵌套的集合，则扁平化结果。

   ```scala
   val nestedOptions = Seq(Some(1), None, Some(Seq(2, 3)))
   println(nestedOptions.flatten) // 输出：Seq(1, Seq(2, 3))
   ```

3. **模式匹配**

   - 使用 `match` 对 `Option` 的值进行模式匹配：

   ```scala
   l foreach { _ match {
     case Some(i) => println(i)
     case None => println("was empty")
   }}
   ```

4. **直接遍历所有值**

   ```scala
   l.flatten foreach println // 输出：1 3
   ```

## **项目概述**

### **目标**

- **目的**：通过开发或修改一个生成器来获取设计、优化和测试硬件生成器的实践经验。

- 核心要求

  ：

  - **团队合作**：可以选择两人一组，也可以单独完成。
  - **项目范围**：从头构建生成器，复杂度大约是两倍于近期的作业问题。
  - 包括完整的设计流程：
    - **提案**：提出想法并设计生成器接口。
    - **开发**：编码实现并测试。
    - **优化**：改进性能和功能。
    - **文档**：完善说明文档。
    - **展示**：最终呈现成果。

### **项目时间表**

1. **第 5-6 周**：寻找合作伙伴并集思广益
   - 利用办公时间与导师交流，获取反馈。
2. **第 7 周**：提出项目提案并得到导师反馈
3. **第 8 周**：闭环开发，持续优化
4. **第 9 周**：完成初始开发，开始修订
5. **第 10 周**：项目收尾和展示

### **项目交付物**

#### **重要日期**

1. **2月20日**：提交初步提案（< 1页）
   - **内容**：生成器的目标、接口设计、关键参数及实现思路。
   - **反馈**：2月21日和2月23日可获得导师建议。
2. **3月4日**：提交代码库链接（功能可未完成）
   - **要求**：尽早闭环开发，并逐步迭代改进。
3. **3月11日**：外部（同伴）代码审查
4. **3月13日或3月15日**：项目展示
5. **3月20日**：提交最终代码库和修订后的展示文档
   - **后续**：展示完成后可进行小幅修改，鼓励公开发布代码。

### **总结**

通过这个项目，学生可以深入学习如何设计硬件生成器，同时通过迭代开发和团队合作提升实际工程能力。清晰的时间安排和交付要求确保了整个开发流程的完整性。
