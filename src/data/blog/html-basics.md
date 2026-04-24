---
title: "HTML 基础笔记"
description: 标签与文档结构、常见标签、表格/列表/表单、布局标签及简单练手页面示例，偏前端入门与课堂记录。
pubDatetime: 2023-05-01T00:00:00.000Z
tags:
  - html
---

> 学习笔记。文中示例在浏览器中查看源码时，请使用完整 HTML5 文档结构。

## Table of contents

## 1. HTML 结构
认识 HTML 标签 ，HTML 代码是由 "标签" 构成的。

形如:

```html
<body>hello</body>
```

(1).标签名(body)放到<>中.

(2).大部分标签成对出现,<body>为开始标签,</body>为结束标签.

(3).少数标签只有开始标签, 称为 "单标签".

(4).开始标签和结束标签之间, 写的是标签的内容.(hello everyone)

(5).开始标签中可能会带有 "属性". id 属性相当于给这个标签设置了一个唯一的标识符(身份证号码).

```html
<body id="myId">hello everyone</body>
```

## 2. HTML 文件基本结构

示例如下（补全了 `<html>` 与 `DOCTYPE`）：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>第一个HTML页面</title>
</head>
<body>
      你好,浏览者。
</body>
</html>
```

(1)html 标签是整个 html 文件的根标签(最顶层标签).

(2)head 标签中写页面的属性.

(3)body 标签中写的是页面上显示的内容

(4)title 标签中写的是页面的标题.

例子如下：



标签的层次结构：父子关系   兄弟关系 

其中:

(1)head 和 body 是 html 的子标签(html 就是 head 和 body 的父标签)

(2)title 是 head 的子标签. head 是 title 的父标签.

(3)head 和 body 之间是兄弟关系.

标签之间的结构关系, 构成了一个 DOM 树 DOM 是 Document Object Model (文档对象模型) 的缩写

注意：快速生成代码框架 在 IDEA 中创建文件 xxx.html , 直接输入 ! , 按 tab 键, 此时能自动生成代码的主体框架.

细节解释: 



## 3. HTML 常见标签
### 3.1 注释标签
注释不会显示在界面上. 目的是提高代码的可读性.

```html
<!-- 我是注释 -->
```

注意：ctrl + / 快捷键可以快速进行注释/取消注释.

### 3.2 标题标签：h1-h6
有六个, 从 h1 - h6. 数字越大, 则字体越小.

```html
<h1>hello</h1>
<h2>hello</h2>
<h3>hello</h3>
<h4>hello</h4>
<h5>hello</h5>
<h6>hello</h6>
```

### 3.3 段落标签：p
p 标签表示一个段落.

```html
<p>这是一个段落</p>
```

通过 p 标签改进上述代码, 每个段落放到 p 标签中.

```html
<p>css中的1px并不等于设备的1px</p>
```

### 3.4 换行标签：br
(1) br 是 break 的缩写. 表示换行.

(2) br 是一个单标签(不需要结束标签)

(3) br 标签不像 p 标签那样带有一个很大的空隙.

(4) <br/>是规范写法. 不建议写成<br>


### 3.5 格式化标签
(1) 加粗: strong 标签 和 b 标签

(2) 倾斜: em 标签 和 i 标签

(3) 删除线: del 标签 和 s 标签

(4) 下划线: ins 标签 和 u 标签

```html
<strong>strong 加粗</strong>
<b>b 加粗</b>
<em>倾斜</em>
<i>倾斜</i>
<del>删除线</del>
<s>删除线</s>
<ins>下划线</ins>
<u>下划线</u>
```

### 3.6 图片标签：img
img 标签必须带有 src 属性. 表示图片的路径.

<img src="rose.jpg">
此时要把 rose.jpg 这个图片文件放到和 html 中的同级目录中.

img 标签的其他属性:

(1) alt: 替换文本. 当文本不能正确显示的时候, 会显示一个替换的文字.

(2) title: 提示文本. 鼠标放到图片上, 就会有提示.

(3) width/height: 控制宽度高度. 高度和宽度一般改一个就行, 另外一个会等比例缩放. 否则就会图片 失衡.

(4) border: 边框, 参数是宽度的像素. 但是一般使用 CSS 来设定.

<img src="rose.jpg" alt="鲜花" title="这是一朵鲜花" width="500px" height="800px"
border="5px">
注意:

1. 属性可以有多个, 不能写到标签之前

2. 属性之间用空格分割, 可以是多个空格, 也可以是换行.

3. 属性之间不分先后顺序

4. 属性使用 "键值对" 的格式来表示.

关于目录结构:

对于一个复杂的网站, 页面资源很多, 这种情况可以使用目录把这些文件整理好.

1) 相对路径: 以 html 所在位置为基准, 找到图片的位置.

同级路径: 直接写文件名即可 (或者 ./)

下一级路径: image/1.jpg

上一级路径: ../image/1.jpg

2) 绝对路径: 一个完整的磁盘路径, 或者网络路径. 例如

磁盘路径 D:\rose.jpg

网络路径 https://images0.cnblogs.com/blog/130623/201407/300958470402077.png

代码示例:

1) 使用相对路径: 创建一个 image 目录和 html 同级, 并放入一个 rose2.jpg

<img src="image/rose2.jpg" alt="">
2) 使用相对路径2: 在 image 目录中创建一个 html, 并访问上级目录的 rose.jpg

<img src="../rose.jpg" alt="">
3) 使用绝对路径1: 最好使用 / , 不要使用 \

<img src="D:/rose.jpg" alt="">
4) 使用绝对路径2: 使用网络路径

<img src="https://images0.cnblogs.com/blog/130623/201407/300958475557219.png"
alt="">
### 3.7 超链接标签：a

（1）href: 必须具备, 表示点击后会跳转到哪个页面.

（2）target: 打开方式. 默认是 _self. 如果是 _blank 则用新的标签页打开.

<a href="http://www.baidu.com">百度</a>
链接的几种形式:

(1) 外部链接: href 引用其他网站的地址

<a href="http://www.baidu.com">百度</a>
(2) 内部链接: 网站内部页面之间的链接. 写相对路径即可.

在一个目录中, 先创建一个 1.html, 再创建一个 2.html

<!-- 1.html -->
我是 1.html
<a href="2.html">点我跳转到 2.html</a>
<!-- 2.html -->
我是 2.html
<a href="1.html">点我跳转到 1.html</a>
(3)  空链接: 使用 # 在 href 中占位.

<a href="#">空链接</a>
(4) 下载链接: href 对应的路径是一个文件. (可以使用 zip 文件)

<a href="test.zip">下载文件</a>
(5) 网页元素链接: 可以给图片等任何元素添加链接(把元素放到 a 标签中)

<a href="http://www.sogou.com">
    <img src="rose.jpg" alt="">
</a>
(6) 锚点链接: 可以快速定位到页面中的某个位置.

<a href="#one">第一集</a>
<a href="#two">第二集</a>
<a href="#three">第三集</a>
<p id="one">
   第一集剧情 <br>
   第一集剧情 <br>
   ...
</p>
<p id="two">
   第二集剧情 <br>
   第二集剧情 <br>
 ...
</p>
<p id="three">
   第三集剧情 <br>
   第三集剧情 <br>
 ...
</p>
### 3.8表格标签
#### 3.8.1 基本使用：

  table 标签: 表示整个表格

  tr: 表示表格的一行

  td: 表示一个单元格

  th: 表示表头单元格. 会居中加粗

  thead: 表格的头部区域(注意和 th 区分, 范围是比 th 要大的)

  tbody: 表格得到主体区域.

注意：table 包含 tr , tr 包含 td 或者 th.

#### 3.8.2 表格标签有一些属性, 可以用于设置大小边框等. 但是一般使用 CSS 方式来设置. 这些属性都要放到 table 标签中.

align 是表格相对于周围元素的对齐方式. align="center" (不是内部元素的对齐方式)

border 表示边框. 1 表示有边框(数字越大, 边框越粗), "" 表示没边框.

cellpadding: 内容距离边框的距离, 默认 1 像素

cellspacing: 单元格之间的距离. 默认为 2 像素

width / height: 设置尺寸.

注意, 这几个属性, vscode 都提示不出来.

<table align="center" border="1" cellpadding="20" cellspacing="0" width="500"
height="500">
    <tr>
        <td>姓名</td>
        <td>性别</td>
        <td>年龄</td>
    </tr>
    <tr>
        <td>张三</td>
        <td>男</td>
        <td>10</td>
    </tr>
    <tr>
        <td>李四</td>
        <td>女</td>
        <td>11</td>
    </tr>
</table>
### 3.9 合并单元格
跨行合并: rowspan="n"

跨列合并: colspan="n"

步骤 ：

1. 先确定跨行还是跨列

2. 找好目标单元格(跨列合并, 左侧是目标单元格; 跨行合并, 上方是目标单元格)

3. 删除的多余的单元格

<table align="center" border="10" cellpadding="20" cellspacing="0" width="500"
height="500">
    <tr>
        <td>姓名</td>
        <td>性别</td>
        <td>年龄</td>
    </tr>
    <tr>
        <td>张三</td>
        <td colspan="2">男</td>
    </tr>
    <tr>
        <td>李四</td>
        <td>女</td>
        <td>11</td>
    </tr>
</table>
### 3.10 列表标签
主要使用来布局的. 整齐好看.

(1)无序列表[重要] ul li , .

(2)有序列表[用的不多] ol li

(3)自定义列表[重要] dl (总标签) dt (小标题) dd (围绕标题来说明) 上面有个小标题, 下面有几个围绕 着标题来展开的.

注意: 元素之间是并列关系; ul/ol 中只能放 li 不能放其他标签, dl 中只能放 dt 和 dd ;li 中可以放其他标签.;列表带有自己的样式, 可以使用 CSS 来修改. (例如前面的小圆点都会去掉)

<h3>无序列表</h3>
<ul>
    <li>丽丽</li>
    <li>兔总裁</li>
    <li>和叶俊</li>
</ul>
<h3>有序列表</h3>
<ol>
    <li>丽丽</li>
    <li>兔总裁</li>
    <li>和叶君</li>
</ol>
<h3>自定义列表</h3>
<dl>
    <dt>我的家人们</dt>
    <dd>丽丽</dd>
    <dd>兔总裁</dd>
    <dd>和叶君</dd>
</dl>
### 3.11 表单标签
表单是让用户输入信息的重要途径.

分成两个部分:

      (1) 表单域: 包含表单元素的区域. 重点是 form 标签.
    
      (2) 表单控件: 输入框, 提交按钮等. 重点是 input 标签.

form 标签

<form action="test.html">
   ... [form 的内容]
</form>
描述了要把数据按照什么方式, 提交到哪个页面中.

input 标签

各种输入控件, 单行文本框, 按钮, 单选框, 复选框.

(1) type(必须有), 取值种类很多多, button, checkbox, text, file, image, password, radio 等.

(2) name: 给 input 起了个名字. 尤其是对于 单选按钮, 具有相同的 name 才能多选一.

(3) value: input 中的默认值.

(4) checked: 默认被选中. (用于单选按钮和多选按钮)

(5) maxlength: 设定最大长度.

1)文本框

<input type="text">
2)密码框

<input type="password">
3)单选框

性别: 
<input type="radio" name="sex">男
<input type="radio" name="sex" checked="checked">女
注意: 单选框之间必须具备相同的 name 属性, 才能实现 多选一 效果.

4)复选框

爱好:
<input type="checkbox"> 吃饭 <input type="checkbox"> 睡觉 <input type="checkbox">
打游戏
5)普通按钮

<input type="button" value="我是个按钮">
<input type="button" value="我是个按钮" onclick="alert('hello')">
当前点击了没有反应. 需要搭配 JS 使用

6)提交按钮

<form action="test.html">
    <input type="text" name="username">
    <input type="submit" value="提交">
</form>
提交按钮必须放到 form 标签内. 点击后就会尝试给服务器发送

7)清空按钮

<form action="test.html">
    <input type="text" name="username">
    <input type="submit" value="提交">
    <input type="reset" value="清空">
</form>
清空按钮必须放在 form 中. 点击后会将 form 内所有的用户输入内容重置.

8)选择文件

<input type="file">
label 标签

搭配 input 使用. 点击 label 也能选中对应的单选/复选框, 能够提升用户体验.

for 属性: 指定当前 label 和哪个相同 id 的 input 标签对应. (此时点击才是有用的)

<label for="male">男</label> <input id="male" type="radio" name="sex">
select 标签

下拉菜单   

<select>
    <option>北京</option>
    <option selected="selected">上海</option>
</select>
option 中定义 selected="selected" 表示默认选中.

textarea 标签

<textarea rows="3" cols="50">

</textarea>
文本域中的内容, 就是默认内容, 注意, 空格也会有影响. 

rows 和 cols 也都不会直接使用, 都是用 css 来改的.

### 3.12 无语义标签：div & span
（1）div 标签, division 的缩写, 含义是 分割

（2）span 标签, 含义是跨度

就是两个盒子. 用于网页布局：

（1）div 是独占一行的, 是一个大盒子.

（2）span 不独占一行, 是一个小盒子.

## 4. 简单列表窗口实现：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>提交列表窗口</title>
</head>
<body> 
       <h2>无语意标签 div & span </h2>
       <div>
               <span> 学习HTML <span style="font-size: 30;color: blue;"></span></span>
               <span> 是十分重要的. </span>
       </div>
       <h2>用户注册</h2>
       <form action="http://www.baidu.com"></form>
        <table>
                <tr>
                       <td>用户名：</td>
                       <td>
                             <input name="wd" type="text" checked="checked" maxlength="50">
                       </td>
                </tr>
                <tr>
                       <td>密码：</td>
                       <td><input name="password" type="password"></td>
                </tr>
                <tr>
                       <td>性别：</td>
                       <td>
                           <input id="man" name="sex" type="radio" value="男">男
                           <label for="man">男</label>
                           &nbsp;&nbsp;
                           <input id="女" name="sex" type="radio" value="女" checked="checked">女
                           <label for="woman">女</label>
                        </td>
                </tr>
                <tr>
                       <td>爱好</td>
                       <td>
                              <input name="爱好" type="checkbox">打豆豆 &nbsp;&nbsp;
                              <input name="爱好" type="checkbox">滑雪 &nbsp;&nbsp;
                              <input name="爱好" type="checkbox">国画 &nbsp;&nbsp;
                       </td>
                </tr>
                <tr>
                       <td>头像:</td>
                       <td>
                             <input type="file">
                       </td>
                </tr>
                <tr>
                       <td>城市：</td>
                       <td>
                             <select>
                                        <option>北京</option>
                                        <option>云南</option>
                                        <option selected="selected">杭州</option>

                             </select>
                       </td>
                </tr>
                <tr>
                       <td>个人介绍</td>
                       <td>
                               <textarea rows="20" cols="30">
     
                               </textarea>
                       </td>
                </tr>
                <tr>
                       <td></td>
                       <td >
                              <input type="button" value="普通按钮">
                              &nbsp;&nbsp;
                              <input type="submit" value=" 提 交 ">
                              &nbsp;&nbsp;
                              <input type="reset" value=" 清 空 ">
                       </td>
                </tr>
        </table>             
</body>
</html>

```

## 5. 简单个人简历的实现：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>个人简历</title>
</head>
<body>
    <div style="margin: left 50px;">
    <h2>某某某</h2>
      <h3>基本信息</h3>
      <img width="40%" height="80%" src="2f17-fynwxum4433912.jpg">
      <br>
      求职意向：<b>Java 测开工程师</b>
      <p></p>
      联系电话：1234567805
      <p></p>
      邮箱：1867547982@qq.com
      <p></p>
      <a href="http://www.baidu.com" target="_blank">我的Gitee</a>
      <p></p>
      <a href="http://www.baidu.com" target="_blank">我的CSDN</a>
      <h3>教育背景</h3>
      <ol>
           <li>1999-2002 幼儿园</li>
           <li>2002-2008 东区小学</li>
           <li>2008-2011 实验中学</li>
           <li>2011-2014 一山中学</li>
      </ol>
      <h3>专业技能</h3>
      <ul>
           <li>掌握 java 基础语言</li>
           <li>掌握 数据结构 理论</li>
           <li>掌握 算法核心思想 </li>
           <li>掌握 前端开发技能 </li>
      </ul>
      <h3>我的项目</h3>
      <ol>
          <li>
              <h4>留言板</h4>
              开发时间：2021-11-4 / 2022-1-3<p></p>
              功能介绍：
              <ul>
                   <li>支持留言功能</li>
                   <li>支持匿名留言功能</li>
              </ul>

          </li>
          <li>
              <h4>个人博客</h4>
              开发时间：2021-11-4 / 2022-1-3<p></p>
              功能介绍：
              <ul>
                  <li>支持登录</li>
                  <li>支持发布文章</li>
                  <li>支持浏览文章并统计</li>
              </ul>
          </li>
      </ol>
      <h3>个人评价</h3>
      在校期间，和同学团结友爱，积极上进，有爱心。
     
    </div>
</body>
</html>
```







> 转载自 CSDN 原文，遵循 CC 4.0 BY-SA；链接：<https://blog.csdn.net/a1085653724/article/details/124276811>。