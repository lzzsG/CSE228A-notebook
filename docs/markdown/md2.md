# 接下来可以期待什么

> 翻译自 [daisyUI 布局和排版](https://daisyui.com/docs/layout-and-typography/#what-to-expect-from-here-on-out)，用于展示markdown。

从这里开始，只是我写的一堆完全没有意义的废话，用来自我检验这个插件。它包括了我能想到的每一个有意义的排版元素，像是**加粗文字**、无序列表、有序列表、代码块、引用块、*甚至是斜体*。

覆盖所有这些用例很重要，原因有几个：

1. 我们希望一切从开始就看起来不错。
2. 实际上就是第一个原因，这就是插件的全部意义。
3. 这里有第三个假装的原因，虽然有三项的列表看起来比两项的列表更真实。

现在我们将尝试另一种标题风格。

### 排版应该简单

所以这是一个标题——如果我们的工作做得正确，它看起来应该相当合理。

一个聪明人曾经告诉我关于排版的事情是：

> 如果你不希望你的东西看起来像垃圾，排版是非常重要的。做得好，它就不会变糟。

图片在这里默认看起来还可以也是挺重要的：

![雏菊花](https://daisyui.com/images/stock/photo-1560717789-0ac7c58ac90a.jpg)

现在我将展示一个无序列表的例子，确保它看起来也不错：

- 所以这是这个列表的第一项。
- 在这个例子中，我们保持项目短小。
- 后面，我们将使用更长、更复杂的列表项目。

这就是这一节的结尾。

## 如果我们堆叠标题呢？

### 我们也应该确保它看起来不错

有时你会有标题直接彼此堆叠在一起。在这些情况下，你通常必须撤销第二个标题的顶部边距，因为标题彼此之间更紧密通常看起来更好，而不是段落后跟着标题应该是的样子。

### 当一个标题在段落之后……

当一个标题出现在段落之后，就像我上面已经提到的，我们需要更多的空间。现在让我们看看一个更复杂的列表会是什么样子。

- **我经常做这种列表项目有标题的事情。**

  出于某种原因，我觉得这看起来很酷，这很不幸，因为让样式变得正确相当烦人。

  这些列表项中我经常有两到三段话，所以难点在于让段落之间、列表项标题和单独列表项之间的间距都有意义。说实话，这相当困难，你完全可以强烈主张你根本就不应该这样写。

- **既然这是一个列表，我需要至少两项。**

  我已经在前一个列表项中解释了我在做什么，但如果列表只有一项，它就不会是一个列表，我们真的希望这看起来现实。这就是为什么我添加了这第二个列表项，所以我在写样式时实际上有东西可以看。

- **添加第三项也不是一个坏主意。**

  我认为可能只用两项就已经足够好了，但三项绝对不会更差，既然我似乎毫无困难地编造出任意事物来打字，我也可以包括它。

在这种列表之后，我通常会有一个结束语或段落，因为如果直接跳转到标题会看起来有点奇怪。

## 代码默认应该看起来可以

我认为大多数人如果想要给他们的代码块设置样式，可能会使用[highlight.js](https://highlightjs.org/)或[Prism](https://prismjs.com/)之类的东西，但即使没有语法高亮，让它们默认看起来*可以*也无妨。

这是截至撰写时默认的`tailwind.config.js`文件长什么样子：

```js
module.exports = {
  purge: [],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
}
```

### JSX

```jsx
// JSX Example
function App() {
  return (
    <div className="App">
      <h1>Hello, highlight.js!</h1>
    </div>
  );
}
```

### HTML

```html
<!-- HTML Example -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Highlight.js Test</title>
</head>
<body>
    <h1>Hello, World!</h1>
</body>
</html>
```

### Rust

```rust
// Rust Example
fn main() {
    println!("Hello, world!");
}
```

### Python

```python
# Python Example
def greet(name):
    print(f"Hello, {name}!")

greet("highlight.js")
```

### C++

```c++
// C++ Example
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, highlight.js!" << endl;
    return 0;
}
```

### Assembly (x86 ASM)

```assembly
; Assembly Example
section .text
    global _start
    
_start:
    mov edx, len    ; message length
    mov ecx, msg    ; message to write
    mov ebx, 1      ; file descriptor (stdout)
    mov eax, 4      ; system call for sys_write
    int 0x80        ; call kernel
    
    mov eax, 1      ; system call for sys_exit
    int 0x80

section .data
msg db 'Hello, highlight.js!', 0xA  ; our dear string
len equ $ - msg                 ; length of our dear string
```

### TOML

```toml
# TOML Example
[owner]
name = "highlight.js"
dob = 1979-05-27T07:32:00Z
```

希望这对你来说看起来足够好。

### 嵌套列表怎么样？

嵌套列表基本上总是看起来很糟糕，这就是为什么像Medium这样的编辑器甚至不允许你这么做，但我猜既然你们中的一些人会这么做，我们必须承担至少让它工作的负担。

1. 嵌套列表很少是个好主意。
   - 你可能觉得你在变得非常“有组织”或类似的东西，但你只是在屏幕上创建了一个难以阅读的、难看的形状。
   - 在UI中嵌套导航也是个坏主意，尽量保持事物尽可能扁平。
   - 在你的源代码中嵌套大量文件夹也没有帮助。
2. 既然我们需要有更多项目，这里是另一个。
   - 我不确定我们是否会费心样式化超过两层深度。
   - 两层已经太多了，三层保证是个坏主意。
   - 如果你嵌套了四层，你应该进监狱。
3. 两个项目实际上并不真的是一个列表，三个才好。
   - 同样，请不要嵌套列表，如果你希望人们真正阅读你的内容。
   - 没人想看这个。
   - 我们甚至不应该费心去样式化这个，我很生气。

关于Markdown中的列表最烦人的事情是，除非列表项中有多个段落，否则`<li>`元素不会给出一个子`<p>`标签。这意味着我还得担心样式化那种烦人的情况。

- **例如，这里是另一个嵌套列表。**

  但这次带有第二段。

  - 这些列表项不会有`<p>`标签
  - 因为它们每一行都只有一行

- **但在这第二个顶级列表项中，它们会有。**

  这特别烦人，因为这一段的间距。

  - 正如你在这里看到的，因为我添加了第二行，这个列表项现在有一个`<p>`标签。

    这就是我所说的第二行。

  - 最后这里是另一个列表项，所以它更像是一个列表。

- 一个没有嵌套列表的结尾列表项，因为为什么不呢？

最后是结束这一节的一句话。

## 我们还需要样式化其他元素

我几乎忘了提到链接，比如[这个链接到Tailwind CSS网站](https://tailwindcss.com/)。我们几乎让它们变成蓝色，但那是昨天的事了，所以我们选择了深灰色，感觉更有边缘感。

我们甚至包括了表格样式，看看这个：

| 摔跤手                  | 来源         | 终结技             |
| ----------------------- | ------------ | ------------------ |
| Bret “The Hitman” Hart  | Calgary, AB  | Sharpshooter       |
| Stone Cold Steve Austin | Austin, TX   | Stone Cold Stunner |
| Randy Savage            | Sarasota, FL | Elbow Drop         |
| Vader                   | Boulder, CO  | Vader Bomb         |
| Razor Ramon             | Chuluota, FL | Razor’s Edge       |

我们还需要确保内联代码看起来不错，比如如果我想谈论`<span>`元素或告诉你关于`@tailwindcss/typography`的好消息。

### 有时我甚至在标题中使用`代码`

即使这可能是个坏主意，而且从历史上看我很难让它看起来不错。不过，这个*“将代码块包在反引号中”*的技巧还是相当不错的。

我过去做的另一件事是在链接内部放一个`code`标签，比如如果我想告诉你关于[`tailwindcss/docs`](https://github.com/tailwindcss/docs)仓库的事情。我不喜欢反引号下面有下划线，但避免它绝对不值得为此而疯狂。

#### 我们还没有使用`h4`

但现在我们有了。请不要在你的内容中使用`h5`或`h6`，Medium只支持两个标题级别是有原因的，你们这些野兽。老实说，我考虑过使用`before`伪元素如果你使用`h5`或`h6`就在那里对你大喊大叫。

我们默认根本不样式化它们，因为`h4`元素已经够小了，它们和正文大小一样。我们要怎么做`h5`，让它*小于*正文吗？不，谢谢。

### 我们仍然需要考虑堆叠的标题

#### 让我们确保我们不会在`h4`元素上搞砸那个

哎呀，如果运气好的话，我们已经样式化了上面的标题，它们看起来相当不错。

让我们在这里添加一个结束段落，这样事情就以一个相当大的文本块结束。我无法解释为什么我希望事情以这种方式结束，但我不得不假设这是因为我认为如果文档末尾太接近一个标题，事情会看起来奇怪或不平衡。

我写的这里可能已经够长了，但添加这最后一句也无妨
