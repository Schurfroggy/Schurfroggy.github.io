---
title: "MySQL 语法与用法笔记"
description: 从基础到进阶的 MySQL 学习笔记：SQL 分类、DDL/DML/DQL/DCL、函数与约束、多表查询、事务、存储引擎、索引、优化、视图、存储过程与触发器。
pubDatetime: 2023-11-01T00:00:00.000Z
tags:
  - mysql
  - databases
---

## 知识地图

**基础概念：**

- MySQL、SQL、函数、约束、多表查询
- 单库：事务、存储引擎、索引、SQL 优化、锁
- 集群：日志、主从、读写分离、分库分表

> 原始笔记中单独一行的「#」用于标记案例分段；本稿在代码中保留为注释，正文不再用标题表示。

## Table of contents

## 1.MySQL概述

### 相关概念

- 数据库 DB 存储数据的仓库
- 数据库管理系统 DBMS 操纵和管理数据库的大型软件
- SQL Structured Query Language 操作关系型数据库的编程语言，提供了统一标准

### 主流数据库

- Oracle,MySQL,SQL Server PostgreSQL,SQLite

### 启动与停止

- cmd输入services.msc打开列表寻找mysql80启动
- 输入net start mysql80 \ net stop mysql80
- mysql -u root -p
- mysql [-h 127.0.0.1] [-P 3306] -u root -p

### 配置环境变量

- path中添加C:\Program Files\MySQL\MySQL Server 8.0\bin\

### 数据模型

- 关系型数据库 RDBMS：

建立在关系模型基础上，由多张相互连接的**二维表**组成的数据库

## 2.SQL

### SQL通用语法

1. SQL语句可以单行或多行书写，以分号结尾

2. SQL语句可以使用空格/缩进来增强语句的可读性

3. MySQL数据库的SQL语句不区分大小写，关键字建议使用大写

4. 注释:

   单行注释:-- 注释内容或#注释内容(MySQL特有)

   多行注释:/注释内容\*/

### SQL语言分类

- DDL Data Definition Language数据定义语言，用来定义数据库对象(数据库，表，字段)
- DML Data Manipulation Language数据操作语言，用来对数据库表中的数据进行增删改
- DQL Data Query Language数据查询语言，用来查询数据库中表的记录
- DCL Data Control Language数据控制语言，用来创建数据库用户、控制数据库的访问权限

### I.DDL

#### DDL常用操作

##### 数据库操作

```sql
#数据库操作
#查询
-- 查询所有数据库
SHOW DATABASES;
-- 查询当前数据库
SELECT DATABASE();
#创建
CREATE DATABASE [IF NOT EXISTS] 数据库名 [DEFAULT CHARSET 字符集][COLLATE 排序规则];
-- 推荐字符集utf8mb4
#删除
DROP DATABASE[IF EXISTS] 数据库名;
#使用
USE 数据库名;
```

##### 表操作

```sql
#表操作：创建/查询
#查询当前数据库所有表
SHOW TABLES;
#查询表结构
DESC 表名;
#查询指定表的建表语句
SHOW CREATE TABLE 表名;
#创建表
CREATE TABLE 表名(
    字段1 字段1类型[COMMENT 字段1注释],
    字段2 字段2类型[COMMENT 字段2注释],
    字段3 字段3类型[COMMENT 字段3注释],
    ...
    字段n 字段n类型[COMMENT 字段n注释]
)[COMMENT 表注释];

#表操作：修改/删除
#添加字段
ALTER TABLE 表名 ADD 字段名 类型(长度)[COMMENT 注释][约束];
#修改数据类型
ALTER TABLE 表名 MODIFY 字段名 新数据类型(长度);
#修改字段名和字段类型
ALTER TABLE 表名 CHANGE 旧字段名 新字段名 类型(长度) [COMMENT 注释][约束];
#删除字段
ALTER TABLE 表名 DROP 字段名;
#修改表名
ALTER TABLE 表名 RENAME TO 新表名;
#删除表
DROP TABLE[IF EXISTS] 表名;
#删除指定表，并重新创建该表
TRUNCATE TABLE 表名;
```

#### DDL数据类型

| 数值类型    | 大小(bytes) | 无符号范围（0，~）                                  |
| ----------- | ----------- | --------------------------------------------------- |
| TINYINT     | 1           | 255                                                 |
| SMALLINT    | 2           | 65535                                               |
| MEDIUMINT   | 3           | 16777215                                            |
| INT/INTEGER | 4           | 4294967295                                          |
| BIGINT      | 8           | 2^64-1                                              |
| FLOAT       | 4           | 1.175494351 E-38 , 3.402823466 E+38                 |
| DOUBLE      | 8           | 2.2250738585072014 E-308 , 1.7976931348623157 E+308 |
| DECIMAL     |             | 依赖于M(精度)和D(标度)的值                          |

| 字符串类型 | 大小(0,~) bytes | 描述                   |
| ---------- | --------------- | ---------------------- |
| CHAR       | 255             | 定长字符串             |
| VARCHAR    | 65535           | 变长字符串             |
| TINYBLOB   | 255             | 短二进制文本数据       |
| TINYTEXT   | 255             | 短文本字符串           |
| BLOB       | 65535           | 长二进制文本数据       |
| TEXT       | 65535           | 长文本数据             |
| MEDIUMBLOB | 16777215        | 中等长度二进制文本数据 |
| MEDIUMTEXT | 16777215        | 中等长度文本数据       |
| LONGBLOB   | 4294967295      | 极大二进制文本数据     |
| LONGTEXT   | 4294967295      | 极大文本数据           |

| 日期类型  | 大小 | 范围                                    | 格式                | 描述                     |
| --------- | ---- | --------------------------------------- | ------------------- | ------------------------ |
| DATE      | 3    | 1000-01-01~9999-12-31                   | YYYY-MM-DD          | 日期值                   |
| TIME      | 3    | -838:59:59~838:59:59                    | HH:MM:SS            | 时间值或持续时间         |
| YEAR      | 1    | 1901~2155                               | YYYY                | 年份值                   |
| DATETIME  | 8    | 1000-01-01 00:00:00~9999-12-31 23:59:59 | YYYY-MM-DD HH:MM:SS | 混合日期和时间值         |
| TIMESTAMP | 4    | 1970-01-01 00:00:01~2038-01-19 03:14:07 | YYYY-MM-DD HH:MM:SS | 混合日期和时间值，时间戳 |

### II.DML

#### DML常用操作

```sql
#添加数据
#给指定字段添加数据
INSERT INTO 表名(字段名1，字段名2，...)VALUES(值1，值2，...)；
#给全部字段添加数据
INSERT INTO 表名 VALUES(值1，值2，...);
#批量添加数据
INSERT INTO 表名(字段名1，字段名2，...)VALUES(值1，值2，...),(值1，值2，...),(值1，值2，...);
INSERT INTO 表名 VALUES(值1，值2，...),(值1，值2，...),(值1，值2，...)；

#修改数据
UPDATE 表名 SET 字段名1 = 值1, 字段名2 = 值2，...[WHERE 条件];
-- 如果没有修改语句的条件，则会修改整张表的数据
#删除数据
DELETE FROM 表名[WHERE 条件]
```

### III.DQL

#### DQL语法

```sql
SELECT 字段列表
FROM 表名列表
WHERE 条件列表
GROUP BY 分组字段列表
HAVING 分组后条件列表
ORDER BY 排序字段列表
LIMIT 分页参数
```

#### 基本查询

```sql
#查询多个字段
SELECT 字段1，字段2，字段3，... FROM 表名;
SELECT * FROM 表名;
#设置别名
SELECT 字段1[AS 别名1]，字段2[AS 别名2]...FROM 表名;
#去除重复记录
SELECT DISTINCT 字段列表 FROM 表名;
```

#### 条件查询

##### 语法

```sql
SELECT 字段列表 FROM 表名 WHERE 条件列表;
```

##### 条件

| 比较运算符       | 功能                                    |
| ---------------- | --------------------------------------- |
| >,>=,<,<=,=      |                                         |
| <>,!=            | 不等于                                  |
| BETWEEN...AND... | 在某个范围之内(含最小，最大值)          |
| IN(...)          | 在in之后的列表中的值，多选一            |
| LIKE 占位符      | 模糊匹配(\_匹配单个字符，%匹配多个字符) |
| IS NULL          | 是NULL                                  |

| 逻辑运算符 | 功能 |
| ---------- | ---- |
| AND,&&     |      |
| OR,\|\|    |      |
| NOT,!      |      |

#### 聚合函数

##### 常见聚合函数

| 函数  | 功能     |
| ----- | -------- |
| count | 统计数量 |
| max   |          |
| min   |          |
| avg   |          |
| sum   | 求和     |

##### 语法

```sql
SELECT 聚合函数(字段列表) FROM 表名;
```

#### 分组查询

##### 语法

```sql
SELECT 字段列表 FROM 表名 [WHERE 条件] GROUP BY 分组字段名 [HAVING 分组后过滤条件];
#WHERE和HAVING的区别：
-- 执行时机不同：WHERE在分组前过滤，HAVING在分组后过滤
-- 判断条件不同：WHERE不能对聚合函数进行判断，HAVING则可以
```

#### 排序查询

##### 语法

```sql
SELECT 字段列表 FROM 表名 ORDER BY 字段1 排序方式1，字段2 排序方式2;
```

##### 排序方式

ASC：升序(默认)

DESC：降序

#如果是多字段排序，当第一个字段值相同时，才会根据第二个字段进行排序。

#### 分页查询

##### 语法

```sql
SELECT 字段列表 FROM 表名 LIMIT 起始索引，查询记录数;
#注意：
-- 起始索引从0开始，起始索引=(查询页码-1)*每页显示记录数
-- 分页查询函数在不同数据库中有所不同，mySQL中是LIMIT
-- 如果查询的是第一页数据，起始索引可以省略，直接简写为limit 10
```

#### DQL执行顺序

FROM>WHERE>GROUP BY/HAVING>SELECT>ORDER BY>LIMIT

### IV.DCL

#### 管理用户

```sql
#查询用户
USE mysql;
SELECT * FROM user;
#创建用户
CREATE USER '用户名'@'主机名' IDENTIFIED BY '密码';
-- %代表任一主机
#修改用户密码
ALTER USER '用户名'@'主机名' IDENTIFIED WITH mysql_native_password BY '新密码';
#删除用户
DROP USER '用户名'@'主机名';
```

#### 权限控制

##### 常用权限

| 权限                |        说明        |
| :------------------ | :----------------: |
| ALL, ALL PRIVILEGES |      所有权限      |
| SELECT              |      查询数据      |
| INSERT              |      插入数据      |
| UPDATE              |      修改数据      |
| DELETE              |      删除数据      |
| ALTER               |       修改表       |
| DROP                | 删除数据库/表/视图 |
| CREATE              |   创建数据库/表    |

##### 权限控制方法

```sql
#查询权限
SHOW GRANTS FOR '用户名'@'主机名';
#授予权限
GRANT 权限列表 ON 数据库名.表名 TO '用户名'@'主机名';
#撤销权限
REVOKE 权限列表 ON 数据库名.表名 FROM '用户名'@'主机名';
#注意：
-- 多个权限之间使用逗号分隔
-- 授权时，数据库名和表名都可以使用*进行通配，代表所有
```

## 3.函数

### I.字符串函数

| 函数                     | 功能                                                      |
| ------------------------ | --------------------------------------------------------- |
| CONCAT(S1,S2,...Sn)      | 字符串拼接，将51，S2，...Sn拼接成一个字符串               |
| LOWER(str)               | 将字符串str全部转为小写                                   |
| UPPER(str)               | 将字符串str全部转为大写                                   |
| LPAD(str,n,pad)          | 左填充，用字符串pad对str的左边进行填充，达到n个字符串长度 |
| RPAD(str,n,pad)          | 右填充，用字符串pad对str的右边进行填充，达到n个字符串长度 |
| TRIM(str)                | 去掉字符串头部和尾部的空格                                |
| SUBSTRING(str,start,len) | 返回从字符串str从start位置起的len个长度的字符串           |

```sql
SELECT 函数(参数);
#注意：在SUBSTRING中字符串的位置从1开始索引
#
-- 案例:  由于业务需求变更，企业员工的工号，统一为5位数，目前不足5位数的全部在前面补0。比如： 1号员工的工号应该为00001。
update emp set workno = lpad(workno, 5, '0');
```

### II.数值函数

| 函数       | 功能                               |
| ---------- | ---------------------------------- |
| CEIL(x)    | 向上取整                           |
| FLOOR(x)   | 向下取整                           |
| MOD(x,y)   | 返回x/y的模                        |
| RAND()     | 返回0~1内的随机数                  |
| ROUND(x,y) | 求参数x的四舍五入的值，保留y位小数 |

```sql
#
-- 案例: 通过数据库的函数，生成一个六位数的随机验证码。
select lpad(round(rand()*1000000 , 0), 6, '0');
```

### III.日期函数

| 函数                              | 功能                                              |
| --------------------------------- | ------------------------------------------------- |
| CURDATE()                         | 返回当前日期                                      |
| CURTIME()                         | 返回当前时间                                      |
| NOW()                             | 返回当前日期和时间                                |
| YEAR(date)                        | 获取指定date的年份                                |
| MONTH(date)                       | 获取指定date的月份                                |
| DAY(date)                         | 获取指定date的日期                                |
| DATE_ADD(date,INTERVAL expr type) | 返回一个日期/时间值加上一个时间间隔expr后的时间值 |
| DATEDIFF(date1,date2)             | 返回起始时间date1 和 结束时间date2之间的天数      |

```sql
#type：DAY,MONTH,YEAR
#DATEDIFF逻辑：第一个时间减去第二个时间
#
-- 案例: 查询所有员工的入职天数，并根据入职天数倒序排序。
select name, datediff(curdate(), entrydate) as 'entrydays' from emp order by entrydays desc;
```

### IV.流程控制函数

| 函数                                                      | 功能                                                      |
| --------------------------------------------------------- | --------------------------------------------------------- |
| IF(value , t, f)                                          | 如果value为true，则返回t，否则返回f                       |
| IFNULL(value1, value2)                                    | 如果value1不为空，返回value1，否则返回value2              |
| CASE WHEN [val1] THEN [res1] ... ELSE[ default] END       | 如果val1为true，返回res1，...否则返回default默认值        |
| CASE[expr] WHEN [val1 ] THEN [res1] ... ELSE[default] END | 如果expr的值等于val1，返回res1，... 否则返回default默认值 |

```sql
#
-- 需求: 查询emp表的员工姓名和工作地址 (北京/上海 ----> 一线城市 , 其他 ----> 二线城市)
select
    name,
    ( case workaddress when '北京' then '一线城市' when '上海' then '一线城市' else '二线城市' end ) as '工作地址'
from emp;
#
-- 案例: 统计班级各个学员的成绩，展示的规则如下：
-- >= 85，展示优秀
-- >= 60，展示及格
-- 否则，展示不及格

create table score(
    id int comment 'ID',
    name varchar(20) comment '姓名',
    math int comment '数学',
    english int comment '英语',
    chinese int comment '语文'
) comment '学员成绩表';
insert into score(id, name, math, english, chinese) VALUES (1, 'Tom', 67, 88, 95 ), (2, 'Rose' , 23, 66, 90),(3, 'Jack', 56, 98, 76);

--
select
    id,
    name,
    (case when math >= 85 then '优秀' when math >=60 then '及格' else '不及格' end ) '数学',
    (case when english >= 85 then '优秀' when english >=60 then '及格' else '不及格' end ) '英语',
    (case when chinese >= 85 then '优秀' when chinese >=60 then '及格' else '不及格' end ) '语文'
from score;
```

## 4.约束

### 概述

概念：约束是作用于表中字段上的规则，用于限制存储在表中的数据。

目的：保证数据库中数据的正确、有效性和完整性。

分类：

| 约束     | 描述                                                     | 关键字      |
| -------- | -------------------------------------------------------- | ----------- |
| 非空约束 | 限制字段的数据不能为null                                 | NOT NULL    |
| 唯一约束 | 保证该字段的所有数据都是唯一、不重复的                   | UNIQUE      |
| 主键约束 | 主键是一行数据的唯一标识，要求非空且唯一                 | PRIMARY KEY |
| 默认约束 | 保存数据时，如果未指定该字段的值，则采用默认值           | DEFAULT     |
| 检查约束 | 保证字段值满足某一个条件                                 | CHECK       |
| 外键约束 | 用来让两张表的数据之间建立连接，保证数据的一致性和完整性 | FOREIGN KEY |

#在ORACLE中实现自增需要使用Sequence序列

### 举例

```sql
CREATE TABLE user(
    id int primary key auto_increment comment '主键',
    name varchar(10) not null unique comment '姓名',
    age int check(age>0&&age<=120) comment '年龄',
    status char(1) default '1' comment '状态',
    gender char(1) comment '性别'
) comment '用户表';
```

### 外键约束

概念：具有外键的表称为子表(从表)，外键所关联的表称为父表(主表)。

```sql
#添加外键
CREATE TABLE 表名(
    字段名 数据类型,
    ...
    [CONSTRAINT] [外键名称] FOREIGN KEY(外键字段名) REFERENCES 主表(主表列名)
);
-- OR
ALTER TABLE 表名 ADD CONSTRAINT 外键名称 FOREIGN KEY (外键字段名) REFERENCES 主表(主表列名);

#删除外键
ALTER TABLE 表名 DROP FOREIGN KEY 外键名称;

#
create table emp(
    id  int auto_increment comment 'ID' primary key,
    name varchar(50) not null comment '姓名',
    age  int comment '年龄',
    job varchar(20) comment '职位',
    salary int comment '薪资',
    entrydate date comment '入职时间',
    managerid int comment '直属领导ID',
    dept_id int comment '部门ID'
)comment '员工表';

INSERT INTO emp (id, name, age, job,salary, entrydate, managerid, dept_id) VALUES
            (1, '金庸', 66, '总裁',20000, '2000-01-01', null,5),(2, '张无忌', 20, '项目经理',12500, '2005-12-05', 1,1),
            (3, '杨逍', 33, '开发', 8400,'2000-11-03', 2,1),(4, '韦一笑', 48, '开发',11000, '2002-02-05', 2,1),
            (5, '常遇春', 43, '开发',10500, '2004-09-07', 3,1),(6, '小昭', 19, '程序员鼓励师',6600, '2004-10-12', 2,1);

-- 添加外键
alter table emp add constraint fk_emp_dept_id foreign key (dept_id) references dept(id);

-- 删除外键
alter table emp drop foreign key fk_emp_dept_id;
```

#### 删除/更新行为

| 行为        | 说明                                                                                                              |
| ----------- | ----------------------------------------------------------------------------------------------------------------- |
| NO ACTION   | 当在父表中删除/更新对应记录时，首先检查该记录是否有对应外键，如果有则不允许删除/更新。(与RESTRICT一致)            |
| RESTRICT    | 当在父表中删除/更新对应记录时，首先检查该记录是否有对应外键，如果有则不允许删除/更新。(与NO ACTION一致)           |
| CASCADE     | 当在父表中删除/更新对应记录时，首先检查该记录是否有对应外键，如果有，则也删除/更新外键在子表中的记录              |
| SET NULL    | 当在父表中删除对应记录时，首先检查该记录是否有对应外键，如果有则设置子表中该外键值为nul(这就要求该外键允许取null) |
| SET DEFAULT | 父表有变更时，子表将外键列设置成一个默认的值(Innodb不支持)                                                        |

```sql
ALTER TABLE 表名 ADD CONSTRAINT 外键名称 FOREIGN KEY (外键字段名) REFERENCES 主表(主表列名) ON UPDATE CASCADE ON DELETE CASCADE;
```

## 5.多表查询

### 概述

项目开发中，在进行数据库表结构设计时，会根据业务需求及业务模块之间的关系，分析并设计表结构，由于业务之间相互关联，所以各个表结构之间也存在着各种联系，基本上分为三种:

> 一对多(多对一)：外键实现，多->一
> 多对多：建立第三张中间表，中间表至少包含两个外键，分别关联两方主键
> 一对一：在任意一方加入外键，关联另外一方的主键。并且设置外键为UNIQUE

#多表查询需要消除无效的笛卡尔积。

#### 多表查询分类

##### 连接查询

- 内连接：相当于查询A、B交集部分数据

- 外连接：

> 左外连接：查询左表所有数据，以及两张表交集部分数据
> 右外连接：查询右表所有数据，以及两张表交集部分数据

- 自连接：当前表与自身的连接查询，自连接必须使用表别名

##### 子查询

### I.内连接

```sql
#查询A、B交集部分数据
#隐式内连接
SELECT 字段列表 FROM 表1，表2 WHERE 条件...;
#显式内连接
SELECT 字段列表 FROM 表1 [INNER] JOIN 表2 ON 连接条件...;

-- 1. 查询每一个员工的姓名 , 及关联的部门的名称 (隐式内连接实现)
-- 表结构: emp , dept
-- 连接条件: emp.dept_id = dept.id
select emp.name , dept.name from emp , dept where emp.dept_id = dept.id ;

select e.name,d.name from emp e , dept d where e.dept_id = d.id;


-- 2. 查询每一个员工的姓名 , 及关联的部门的名称 (显式内连接实现)  --- INNER JOIN ... ON ...
-- 表结构: emp , dept
-- 连接条件: emp.dept_id = dept.id

select e.name, d.name from emp e inner join dept d  on e.dept_id = d.id;

select e.name, d.name from emp e join dept d  on e.dept_id = d.id;
```

### II.外连接

```sql
#左外连接
SELECT 字段列表 FROM 表1 LEFT [OUTER] JOIN 表2 ON 条件...;
-- 相当于查询表1(左表)的所有数据(包含表1和表2交集部分的数据)

#右外连接
SELECT 字段列表 FROM 表1 RIGHT [OUTER] JOIN 表2 ON 条件...;
-- 相当于查询表2(右表)的所有数据(包含表1和表2交集部分的数据)

#
-- 1. 查询emp表的所有数据, 和对应的部门信息(左外连接)
-- 表结构: emp, dept
-- 连接条件: emp.dept_id = dept.id

select e.*, d.name from emp e left outer join dept d on e.dept_id = d.id;

select e.*, d.name from emp e left join dept d on e.dept_id = d.id;


-- 2. 查询dept表的所有数据, 和对应的员工信息(右外连接)

select d.*, e.* from emp e right outer join dept d on e.dept_id = d.id;

select d.*, e.* from dept d left outer join emp e on e.dept_id = d.id;
```

### III.自连接

```sql
SELECT 字段列表 FROM 表A 别名A JOIN 表A 别名B ON 条件...;
-- 自连接查询，可以是内连接查询，也可以是外连接查询
-- 为了区分必须要给两个表各自的别名
#
-- 1. 查询员工 及其 所属领导的名字
-- 表结构: emp

select a.name , b.name from emp a , emp b where a.managerid = b.id;
#
-- 2. 查询所有员工 emp 及其领导的名字 emp , 如果员工没有领导, 也需要查询出来
-- 表结构: emp a , emp b

select a.name '员工', b.name '领导' from emp a left join emp b on a.managerid = b.id;
```

### IV.联合查询

```sql
#联合查询，就是把多次查询的结果合并起来，形成一个新的查询结果集
SELECT 字段列表 FROM 表A...
UNION [ALL]
SELECT 字段列表 FROM 表B...;
-- union all直接将两次结果合并
-- union会去除重复的数据
-- 对于联合查询的多张表的列数必须保持一致，字段类型也需要保持一致
#
-- 1. 将薪资低于 5000 的员工 , 和 年龄大于 50 岁的员工全部查询出来.

select * from emp where salary < 5000
union all
select * from emp where age > 50;

select * from emp where salary < 5000
union
select * from emp where age > 50;
```

### V.子查询

#### 概念

```sql
#SQL语句中嵌套SELECT语句，称为嵌套查询，或子查询
#语法
SELECT * FROM t1 WHERE column1 = (SELECT column1 FROM t2);
-- 子查询的外部的语句可以是INSERT/UPDATE/DELETE/SELECT的任何一个
```

#### 分类

由子查询结果不同，分为：

> 标量子查询(子查询结果为单个值)
>
> 列子查询(子查询结果为一列)
>
> 行子查询(子查询结果为一行)
>
> 表子查询(子查询结果为多行多列)

由子查询位置不同，分为：

> WHERE之后
>
> FROM之后
>
> SELECT之后

#### i).标量子查询

- 子查询返回的结果是单个值(数字、字符串、日期等)
- 常用操作符：=, <>, >, >=, <, <=

```sql
#
-- 1. 查询 "销售部" 的所有员工信息
-- a. 查询 "销售部" 部门ID
select id from dept where name = '销售部';

-- b. 根据销售部部门ID, 查询员工信息
select * from emp where dept_id = (select id from dept where name = '销售部');
#
-- 2. 查询在 "方东白" 入职之后的员工信息
-- a. 查询 方东白 的入职日期
select entrydate from emp where name = '方东白';

-- b. 查询指定入职日期之后入职的员工信息
select * from emp where entrydate > (select entrydate from emp where name = '方东白');
```

#### ii).列子查询

- 子查询返回的结果是一列(可以是多行)，称为列子查询
- 常用操作符：

| 操作符 | 描述                                   |
| ------ | -------------------------------------- |
| IN     | 在指定的集合范围之内，多选一           |
| NOT IN | 不在指定范围之内                       |
| ANY    | 子查询返回列表中，由任意一个满足即可   |
| SOME   | 与ANY等同，使用SOME的地方都可以使用ANY |
| ALL    | 子查询返回列表的所有值都必须同时满足   |

```sql
#
-- 1. 查询 "销售部" 和 "市场部" 的所有员工信息
-- a. 查询 "销售部" 和 "市场部" 的部门ID
select id from dept where name = '销售部' or name = '市场部';

-- b. 根据部门ID, 查询员工信息
select * from emp where dept_id in (select id from dept where name = '销售部' or name = '市场部');
#
-- 2. 查询比 财务部 所有人工资都高的员工信息
-- a. 查询所有 财务部 人员工资
select id from dept where name = '财务部';

select salary from emp where dept_id = (select id from dept where name = '财务部');

-- b. 比 财务部 所有人工资都高的员工信息
select * from emp where salary > all ( select salary from emp where dept_id = (select id from dept where name = '财务部') );
#
-- 3. 查询比研发部其中任意一人工资高的员工信息
-- a. 查询研发部所有人工资
select salary from emp where dept_id = (select id from dept where name = '研发部');

-- b. 比研发部其中任意一人工资高的员工信息
select * from emp where salary > some ( select salary from emp where dept_id = (select id from dept where name = '研发部') );
```

#### iii).行子查询

- 子查询返回的结果是一行(可以是多列)，这种子查询称为行子查询
- 常用操作符：=, <>, IN, NOT IN

```sql
#
-- 1. 查询与 "张无忌" 的薪资及直属领导相同的员工信息 ;
-- a. 查询 "张无忌" 的薪资及直属领导
select salary, managerid from emp where name = '张无忌';

-- b. 查询与 "张无忌" 的薪资及直属领导相同的员工信息 ;
select * from emp where (salary,managerid) = (select salary, managerid from emp where name = '张无忌');
```

#### iv).表子查询

- 子查询返回的结果是多行多列，这种子查询称为表子查询

- 常用操作符：IN

```sql
#
-- 1. 查询与 "鹿杖客" , "宋远桥" 的职位和薪资相同的员工信息
-- a. 查询 "鹿杖客" , "宋远桥" 的职位和薪资
select job, salary from emp where name = '鹿杖客' or name = '宋远桥';

-- b. 查询与 "鹿杖客" , "宋远桥" 的职位和薪资相同的员工信息
select * from emp where (job,salary) in ( select job, salary from emp where name = '鹿杖客' or name = '宋远桥' );
#
-- 2. 查询入职日期是 "2006-01-01" 之后的员工信息 , 及其部门信息
-- a. 入职日期是 "2006-01-01" 之后的员工信息
select * from emp where entrydate > '2006-01-01';

-- b. 查询这部分员工, 对应的部门信息;
select e.*, d.* from (select * from emp where entrydate > '2006-01-01') e left join dept d on e.dept_id = d.id ;
```

### VI.多表查询案例

```sql
#准备工作
create table salgrade(
    grade int,
    losal int,-- 表示该等级下的最低工资
    hisal int-- 表示该等级下的最高工资
) comment '薪资等级表';

insert into salgrade values (1,0,3000);
insert into salgrade values (2,3001,5000);
insert into salgrade values (3,5001,8000);
insert into salgrade values (4,8001,10000);
insert into salgrade values (5,10001,15000);
insert into salgrade values (6,15001,20000);
insert into salgrade values (7,20001,25000);
insert into salgrade values (8,25001,30000);
#
-- 1. 查询员工的姓名、年龄、职位、部门信息 （隐式内连接）
-- 表: emp , dept
-- 连接条件: emp.dept_id = dept.id

select e.name , e.age , e.job , d.name from emp e , dept d where e.dept_id = d.id;


-- 2. 查询年龄小于30岁的员工的姓名、年龄、职位、部门信息（显式内连接）
-- 表: emp , dept
-- 连接条件: emp.dept_id = dept.id

select e.name , e.age , e.job , d.name from emp e inner join dept d on e.dept_id = d.id where e.age < 30;


-- 3. 查询拥有员工的部门ID、部门名称
-- 表: emp , dept
-- 连接条件: emp.dept_id = dept.id

select distinct d.id , d.name from emp e , dept d where e.dept_id = d.id;



-- 4. 查询所有年龄大于40岁的员工, 及其归属的部门名称; 如果员工没有分配部门, 也需要展示出来
-- 表: emp , dept
-- 连接条件: emp.dept_id = dept.id
-- 外连接

select e.*, d.name from emp e left join dept d on e.dept_id = d.id where e.age > 40 ;


-- 5. 查询所有员工的工资等级
-- 表: emp , salgrade
-- 连接条件 : emp.salary >= salgrade.losal and emp.salary <= salgrade.hisal

select e.* , s.grade , s.losal, s.hisal from emp e , salgrade s where e.salary >= s.losal and e.salary <= s.hisal;

select e.* , s.grade , s.losal, s.hisal from emp e , salgrade s where e.salary between s.losal and s.hisal;


-- 6. 查询 "研发部" 所有员工的信息及 工资等级
-- 表: emp , salgrade , dept
-- 连接条件 : emp.salary between salgrade.losal and salgrade.hisal , emp.dept_id = dept.id
-- 查询条件 : dept.name = '研发部'

select e.* , s.grade from emp e , dept d , salgrade s where e.dept_id = d.id and ( e.salary between s.losal and s.hisal ) and d.name = '研发部';


-- 7. 查询 "研发部" 员工的平均工资
-- 表: emp , dept
-- 连接条件 :  emp.dept_id = dept.id

select avg(e.salary) from emp e, dept d where e.dept_id = d.id and d.name = '研发部';


-- 8. 查询工资比 "灭绝" 高的员工信息。
-- a. 查询 "灭绝" 的薪资
select salary from emp where name = '灭绝';

-- b. 查询比她工资高的员工数据
select * from emp where salary > ( select salary from emp where name = '灭绝' );


-- 9. 查询比平均薪资高的员工信息
-- a. 查询员工的平均薪资
select avg(salary) from emp;

-- b. 查询比平均薪资高的员工信息
select * from emp where salary > ( select avg(salary) from emp );


-- 10. 查询低于本部门平均工资的员工信息

-- a. 查询指定部门平均薪资  1
select avg(e1.salary) from emp e1 where e1.dept_id = 1;
select avg(e1.salary) from emp e1 where e1.dept_id = 2;

-- b. 查询低于本部门平均工资的员工信息
select * from emp e2 where e2.salary < ( select avg(e1.salary) from emp e1 where e1.dept_id = e2.dept_id );


-- 11. 查询所有的部门信息, 并统计部门的员工人数
select d.id, d.name , ( select count(*) from emp e where e.dept_id = d.id ) '人数' from dept d;

select count(*) from emp where dept_id = 1;


-- 12. 查询所有学生的选课情况, 展示出学生名称, 学号, 课程名称
-- 表: student , course , student_course
-- 连接条件: student.id = student_course.studentid , course.id = student_course.courseid

select s.name , s.no , c.name from student s , student_course sc , course c where s.id = sc.studentid and sc.courseid = c.id ;
```

## 6.事务

### 事务简介

**事务**是一组操作的集合，它是一个不可分割的工作单位，事务会把所有的操作作为一个整体一起向系统提交或撤销操作请求，即这些操作要么同时成功，要么同时失败。

```sql
#开启事务
-- 查询张三账户余额
-- 张三账户余额-1000
                 -- 抛出异常  -- 回滚事务
-- 李四账户余额+1000
#提交事务
```

### 事务操作

- 查看/设置事务提交方式

```sql
select @@autocommit;
set @@autocommit = 0; -- 设置为手动提交
```

- 提交事务

```sql
commit;
```

- 回滚事务

```sql
rollback ;
```

- 开启事务

```sql
start transaction;
begin;
```

```sql
#
-- 数据准备
create table account(
    id int auto_increment primary key comment '主键ID',
    name varchar(10) comment '姓名',
    money int comment '余额'
) comment '账户表';
insert into account(id, name, money) VALUES (null,'张三',2000),(null,'李四',2000);


-- 恢复数据
update account set money = 2000 where name = '张三' or name = '李四';


select @@autocommit;

set @@autocommit = 0; -- 设置为手动提交

-- 转账操作 (张三给李四转账1000)
-- 1. 查询张三账户余额
select * from account where name = '张三';

-- 2. 将张三账户余额-1000
update account set money = money - 1000 where name = '张三';

程序执行报错 ...

-- 3. 将李四账户余额+1000
update account set money = money + 1000 where name = '李四';

commit;
rollback ;



-- 方式二
-- 转账操作 (张三给李四转账1000)
start transaction ;

-- 1. 查询张三账户余额
select * from account where name = '张三';

-- 2. 将张三账户余额-1000
update account set money = money - 1000 where name = '张三';

程序执行报错 ...

-- 3. 将李四账户余额+1000
update account set money = money + 1000 where name = '李四';

commit;
rollback;
```

### 事务四大特性ACID

| 特性                    | 解释                                                                       |
| ----------------------- | -------------------------------------------------------------------------- |
| 原子性(**A**tomicity)   | 事务是不可分割的最小操作单元，要么全部成功，要么全部失败                   |
| 一致性(**C**onsistency) | 事务完成时，必须使所有的数据都保持一致状态                                 |
| 隔离性(**I**solation)   | 数据库系统提供的隔离机制，保证事务在不受外部并发操作影响下的独立环境下运行 |
| 持久性(**D**urability)  | 事务一旦提交或回滚，它对数据库中的数据的改变就是永久的                     |

### 并发事务问题

| 问题       | 描述                                                                                   |
| ---------- | -------------------------------------------------------------------------------------- |
| 脏读       | 一个事务读到另外一个事务还没有提交的数据                                               |
| 不可重复读 | 一个事务先后读取同一条数据，但两次读取的数据不同                                       |
| 幻读       | 一个事务按照条件查询数据时，没有对应的数据行，但是在插入数据时，又发现这行数据已经存在 |

### 事务隔离级别

| 隔离级别                       | 脏读 | 不可重复读 | 幻读 |
| ------------------------------ | ---- | ---------- | ---- |
| Read uncommitted               | √    | √          | √    |
| Read committed(Oracle default) | ×    | √          | √    |
| Repeatable Read(mysql default) | ×    | ×          | √    |
| Serializable                   | ×    | ×          | ×    |

```sql
-- 查看事务隔离级别
select @@transaction_isolation;

-- 设置事务隔离级别
set [session|global] transaction isolation level {read uncommitted|read committed|repeatable read|serializable}
```

---

_以下为进阶部分（存储引擎、索引、优化、视图、过程、触发器等）。_

## 7.存储引擎

### MySQL体系结构

客户端连接器：Native C API, JDBC, ODBC, .NET, PHP, Python, Puby, Cobol

- 连接层

连接池：Authentication, Thread Reuse, Connection Limits, Check Memory, Caches

_最上层是一些客户端和链接服务，主要完成一些类似于连接处理、授权认证、及相关的安全方案。服务器也会为安全接入的每个客户端验证它所具有的操作权限。_

- 服务层

> SQL接口：DML, DDL, Stored Procedures Views, Triggers, stc
>
> 解析器：Query Translation, Object Privilege
>
> 查询优化器：Acess Paths. Statistics
>
> 缓存：Global and Engine Specific Caches & Buffers

_第二层架构主要完成大多数的核心服务功能，如SQL接口，并完成缓存的查询，SQL的分析和优化，部分内置函数的执行。所有跨存储引擎的功能也在这一层实现，如 过程、函数等。_

- 引擎层

Memory, Index&Storage Management

可插拔存储引擎

InnoDB, MyISAM, NDB, Archive, Federated, Memory, Merge, Partner, Community, Custom

_存储擎真正的负责了MySQL中数据的存储和提取，服务器通过AP和存储引擎进行通信。不同的存储引擎具有不同的功能，这样我们可以根据自己的需要，来选取合适的存储引擎。_

- 存储层

> 系统文件：NTFS, ufs, ext2/3, NFS, SAN, NAS
>
> 文件和日志：Redo, Undo, Data, Index, Binary, Error, Query and Slow

_主要是将数据存储在文件系统之上，并完成与存储引擎的交互。_

### 存储引擎简介

**存储引擎：**存储数据、建立索引、更新/查询数据等技术的实现方式。存储引擎是基于表的，而不是基于库的，所以存储引擎也可被称为表类型。

```sql
#在创建表时，指定存储引擎
CREATE TABLE 表名(
  字段1 字段1类型 [COMMENT 字段1注释],
  ...
  字段n 字段n类型 [COMMENT 字段n注释]
) ENGINE = InnoDB [COMMENT 表注释]

#查看当前数据库支持的存储引擎
SHOW ENGINES;

#查询建表语句
show create table 表名;
  -- 默认存储引擎：InnoDB
```

### 存储引擎特点

#### InnoDB

- InnoDB是一种兼顾高可靠性和高性能的通用存储引擎。
- 特点：

  > DML操作遵循ACID模型，支持**事务**
  >
  > **行级锁**，提高并发访问性能
  >
  > 支持**外键**FOREIGN KEY约束，保证数据的完整性和正确性

- 文件：xxx.ibd，innoDB引擎的每张表都会对应这样一个表空间文件，存储该表的表结构(frm、sdi)、数据和索引。参数：innodb_file_per_table

```sql
#查看系统变量
show variables like '参数名';
#查看ibd文件内容：
-- cbd打开输入 ibd2sdi 表名.ibd
```

- 逻辑存储结构

Tablespace-->

Segement-->

Extent(Mixed 1M)-->

Page(Mixed 16K)-->

Row

#### MyISAM

- MyISAM时MySQL早期默认的存储引擎
- 特点：

  > 不支持事务，不支持外键
  >
  > 支持表锁，不支持行锁
  >
  > 访问速度快

- 文件：
  > xxx.sdi：存储表结构信息
  >
  > xxx.MYD：存储数据
  >
  > xxx.MYI：存储索引

#### Memory

- Memory引擎的表数据存储在内存当中，由于受到硬件问题或断电问题影响，只能将这些表作为临时表或缓存使用
- 特点：

> 内存存放
>
> hash索引(默认)

- 文件：

xxx.sdi：存储表结构信息

#### 各引擎特点区别

|     特点     |   InnoDB    | MyISAM | Memory |
| :----------: | :---------: | :----: | :----: |
|   存储限制   |    64TB     |   有   |   有   |
|   事务安全   |  **支持**   |   -    |   -    |
|      锁      |  **行锁**   |  表锁  |  表锁  |
|  B+tree索引  |    支持     |  支持  |  支持  |
|   Hash索引   |      -      |   -    |  支持  |
|   全文索引   | 支持(v5.6+) |  支持  |   -    |
|   空间使用   |     高      |   低   |  N/A   |
|   内存使用   |     高      |   低   |  中等  |
| 批量插入速度 |     低      |   高   |   高   |
|   支持外键   |  **支持**   |   -    |   -    |

### 存储引擎选择

- 在选择存储引擎时，应该根据应用系统的特点选择合适的存储引擎。对于复杂的应用系统，还可以根据实际情况选择多种存储引擎进行组合。

1. InnoDB:是Mysql的默认存储引擎，支持事务、外键。如果应用对事务的完整性有比较高的要求，在并发条件下要求数据的一致性，数据操作除了插入和查询之外，还包含很多的更新、删除操作，那么innoDB存储引擎是比较合适的选择。
2. MyISAM :如果应用是以读操作和插入操作为主，只有很少的更新和删除操作，并且对事务的完整性、并发性要求不是很高，那么选择这个存储引擎是非常合适的。(like:Mongodb)
3. MEMORY:将所有数据保存在内存中，访问速度快，通常用于临时表及缓存。MEMORY的缺陷就是对表的大小有限制，太大的表无法缓存在内存中，而且无法保障数据的安全性。(like:Redis)

## 8.索引

### 索引概述

- 索引（index）是帮助MySQL高效获取数据的数据结构(有序)。在数据之外，数据库系统还维护着满足

特定查找算法的数据结构，这些数据结构以某种方式引用（指向）数据， 这样就可以在这些数据结构

上实现高级查找算法，这种数据结构就是索引。

- 索引特点：

| 优势                                                          | 劣势                                                                                             |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 提高数据检索的效率，降低数据库的IO成本                        | 索引列也是要占用空间的。                                                                         |
| 通过索引列对数据进行排序，降低数据排序的成本，降低CPU的消耗。 | 索引大大提高了查询效率，同时却也降低更新表的速度，如对表进行INSERT、UPDATE、DELETE时，效率降低。 |

### 索引结构

#### 概述

MySQL的索引是在存储引擎层实现的，不同的存储引擎有不同的索引结构，主要包含以下几种：

| 索引结构            | 描述                                                                           |
| ------------------- | ------------------------------------------------------------------------------ |
| B+Tree索引          | 最常见的索引类型，大部分引擎都支持 B+ 树索引                                   |
| Hash索引            | 底层数据结构是用哈希表实现的, 只有精确匹配索引列的查询才有效, 不支持范围查询   |
| R-tree(空间索引)    | 空间索引是MyISAM引擎的一个特殊索引类型，主要用于地理空间数据类型，通常使用较少 |
| Full-text(全文索引) | 是一种通过建立倒排索引,快速匹配文档的方式。类似于Lucene,Solr,ES                |

#### 引擎支持情况

| 索引       | InnoDB     | MyISAM | Memory |
| ---------- | ---------- | ------ | ------ |
| B+tree索引 | 支持       | 支持   | 支持   |
| Hash索引   | 不支持     | 不支持 | 支持   |
| R-tree索引 | 不支持     | 支持   | 不支持 |
| Full-text  | v5.6后支持 | 支持   | 不支持 |

### 索引分类

#### 索引分类

| 分类     | 含义                                                 | 特点                     | 关键字   |
| -------- | ---------------------------------------------------- | ------------------------ | -------- |
| 主键索引 | 针对于表中主键创建的索引                             | 默认自动创建, 只能有一个 | PRIMARY  |
| 唯一索引 | 避免同一个表中某数据列中的值重复                     | 可以有多个               | UNIQUE   |
| 常规索引 | 快速定位特定数据                                     | 可以有多个               |          |
| 全文索引 | 全文索引查找的是文本中的关键词，而不是比较索引中的值 | 可以有多个               | FULLTEXT |

#### 聚集索引&二级索引

| 分类                      | 含义                                                       | 特点                |
| ------------------------- | ---------------------------------------------------------- | ------------------- |
| 聚集索引(Clustered Index) | 将数据存储与索引放到了一块，索引结构的叶子节点保存了行数据 | 必须有,而且只有一个 |
| 二级索引(Secondary Index) | 将数据与索引分开存储，索引结构的叶子节点关联的是对应的主键 | 可以存在多个        |

聚集索引选取规则:

- 如果存在主键，主键索引就是聚集索引。
- 如果不存在主键，将使用第一个唯一（UNIQUE）索引作为聚集索引。

- 如果表没有主键，或没有合适的唯一索引，则InnoDB会自动生成一个rowid作为隐藏的聚集索

引

> 回表查询： 这种先到二级索引中查找数据，找到主键值，然后再到聚集索引中根据主键值，获取
>
> 数据的方式，就称之为回表查询

### 索引语法

```sql
#创建索引
CREATE [ UNIQUE | FULLTEXT ] INDEX index_name ON table_name (index_col_name,... ) ;
#查看索引
SHOW INDEX FROM table_name ;
#删除索引
DROP INDEX index_name ON table_name ;

#
-- 先来创建一张表 tb_user，并且查询测试数据。
create table tb_user(
id int primary key auto_increment comment '主键',
name varchar(50) not null comment '用户名',
phone varchar(11) not null comment '手机号',
email varchar(100) comment '邮箱',
profession varchar(11) comment '专业',
age tinyint unsigned comment '年龄',
gender char(1) comment '性别 , 1: 男, 2: 女',
status char(1) comment '状态',
createtime datetime comment '创建时间'
) comment '系统用户表';
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
createtime) VALUES ('吕布', '17799990000', 'lvbu666@163.com', '软件工程', 23, '1',
'6', '2001-02-02 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
createtime) VALUES ('曹操', '17799990001', 'caocao666@qq.com', '通讯工程', 33,
'1', '0', '2001-03-05 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
createtime) VALUES ('赵云', '17799990002', '17799990@139.com', '英语', 34, '1',
'2', '2002-03-02 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
createtime) VALUES ('孙悟空', '17799990003', '17799990@sina.com', '工程造价', 54,
'1', '0', '2001-07-02 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
createtime) VALUES ('花木兰', '17799990004', '19980729@sina.com', '软件工程', 23,
'2', '1', '2001-04-22 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
createtime) VALUES ('大乔', '17799990005', 'daqiao666@sina.com', '舞蹈', 22, '2',
'0', '2001-02-07 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
createtime) VALUES ('露娜', '17799990006', 'luna_love@sina.com', '应用数学', 24,
'2', '0', '2001-02-08 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
createtime) VALUES ('程咬金', '17799990007', 'chengyaojin@163.com', '化工', 38,
'1', '5', '2001-05-23 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
createtime) VALUES ('项羽', '17799990008', 'xiaoyu666@qq.com', '金属材料', 43,
'1', '0', '2001-09-18 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
createtime) VALUES ('白起', '17799990009', 'baiqi666@sina.com', '机械工程及其自动
化', 27, '1', '2', '2001-08-16 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
createtime) VALUES ('韩信', '17799990010', 'hanxin520@163.com', '无机非金属材料工
程', 27, '1', '0', '2001-06-12 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
createtime) VALUES ('荆轲', '17799990011', 'jingke123@163.com', '会计', 29, '1',
'0', '2001-05-11 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
createtime) VALUES ('兰陵王', '17799990012', 'lanlinwang666@126.com', '工程造价',
44, '1', '1', '2001-04-09 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
createtime) VALUES ('狂铁', '17799990013', 'kuangtie@sina.com', '应用数学', 43,
'1', '2', '2001-04-10 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
createtime) VALUES ('貂蝉', '17799990014', '84958948374@qq.com', '软件工程', 40,
'2', '3', '2001-02-12 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
createtime) VALUES ('妲己', '17799990015', '2783238293@qq.com', '软件工程', 31,
'2', '0', '2001-01-30 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
createtime) VALUES ('芈月', '17799990016', 'xiaomin2001@sina.com', '工业经济', 35,
'2', '0', '2000-05-03 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
createtime) VALUES ('嬴政', '17799990017', '8839434342@qq.com', '化工', 38, '1',
'1', '2001-08-08 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
createtime) VALUES ('狄仁杰', '17799990018', 'jujiamlm8166@163.com', '国际贸易',
30, '1', '0', '2007-03-12 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
createtime) VALUES ('安琪拉', '17799990019', 'jdodm1h@126.com', '城市规划', 51,
'2', '0', '2001-08-15 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
createtime) VALUES ('典韦', '17799990020', 'ycaunanjian@163.com', '城市规划', 52,
'1', '2', '2000-04-12 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
createtime) VALUES ('廉颇', '17799990021', 'lianpo321@126.com', '土木工程', 19,
'1', '3', '2002-07-18 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
createtime) VALUES ('后羿', '17799990022', 'altycj2000@139.com', '城市园林', 20,
'1', '0', '2002-03-10 00:00:00');
INSERT INTO tb_user (name, phone, email, profession, age, gender, status,
createtime) VALUES ('姜子牙', '17799990023', '37483844@qq.com', '工程造价', 29,
'1', '4', '2003-05-26 00:00:00');

-- 表结构中插入的数据如下：
-- 数据准备好了之后，接下来，我们就来完成如下需求：

-- A. name字段为姓名字段，该字段的值可能会重复，为该字段创建索引。

CREATE INDEX idx_user_name ON tb_user(name);

-- B. phone手机号字段的值，是非空，且唯一的，为该字段创建唯一索引。

CREATE UNIQUE INDEX idx_user_phone ON tb_user(phone);

-- C. 为profession、age、status创建联合索引。

CREATE INDEX idx_user_pro_age_sta ON tb_user(profession,age,status);

-- D. 为email建立合适的索引来提升查询效率。

CREATE INDEX idx_email ON tb_user(email);
```

### SQL性能分析

#### SQL执行频率

- MySQL 客户端连接成功后，通过 show [session|global] status 命令可以提供服务器状态信

息。通过如下指令，可以查看当前数据库的INSERT、UPDATE、DELETE、SELECT的访问频次：

```sql
-- session 是查看当前会话 ;

-- global 是查询全局数据 ;

SHOW GLOBAL STATUS LIKE 'Com_______';
```

> Com_delete: 删除次数
>
> Com_insert: 插入次数
>
> Com_select: 查询次数
>
> Com_update: 更新次数

通过上述指令，我们可以查看到当前数据库到底是以查询为主，还是以增删改为主，从而为数据

库优化提供参考依据。 如果是以增删改为主，我们可以考虑不对其进行索引的优化。 如果是以

查询为主，那么就要考虑对数据库的索引进行优化了。

#### 慢查询日志

- 慢查询日志记录了所有执行时间超过指定参数（long_query_time，单位：秒，默认10秒）的所有

SQL语句的日志。

MySQL的慢查询日志默认没有开启，我们可以查看一下系统变量 slow_query_log。

如果要开启慢查询日志，需要在MySQL的配置文件（/etc/my.cnf）中配置如下信息：

```sql
# 开启MySQL慢日志查询开关

slow_query_log=1

# 设置慢日志的时间为2秒，SQL语句执行时间超过2秒，就会视为慢查询，记录慢查询日志

long_query_time=2
```

配置完毕之后，通过以下指令重新启动MySQL服务器进行测试，查看慢日志文件中记录的信息

/var/lib/mysql/localhost-slow.log。

```sql
systemctl restart mysqld
```

然后，再次查看开关情况，慢查询日志就已经打开了。

**测试：**

A. 执行如下SQL语句 ：

```sql
select * from tb_user; -- 这条SQL执行效率比较高, 执行耗时 0.00sec

select count(*) from tb_sku; -- 由于tb_sku表中, 预先存入了1000w的记录, count一次,耗时13.35sec
```

B. 检查慢查询日志 ：

最终我们发现，在慢查询日志中，只会记录执行时间超多我们预设时间（2s）的SQL，执行较快的SQL

是不会记录的。

那这样，通过慢查询日志，就可以定位出执行效率比较低的SQL，从而有针对性的进行优化。

#### Profile详情

- show profiles 能够在做SQL优化时帮助我们了解时间都耗费到哪里去了。通过have_profiling

参数，能够看到当前MySQL是否支持profile操作：

```sql
SELECT @@have_profiling ;
```

可以看到，当前MySQL是支持 profile操作的，但是开关是关闭的。可以通过set语句在

session/global级别开启profiling：

```sql
SET profiling = 1;
```

开关已经打开了，接下来，我们所执行的SQL语句，都会被MySQL记录，并记录执行时间消耗到哪儿去

了。 我们直接执行如下的SQL语句：

```sql
select * from tb_user;
select * from tb_user where id = 1;
select * from tb_user where name = '白起';
select count(*) from tb_sku;
```

执行一系列的业务SQL的操作，然后通过如下指令查看指令的执行耗时：

```sql
-- 查看每一条SQL的耗时基本情况
show profiles;
-- 查看指定query_id的SQL语句各个阶段的耗时情况
show profile for query query_id;
-- 查看指定query_id的SQL语句CPU的使用情况
show profile cpu for query query_id;
```

#### explain

- EXPLAIN 或者 DESC命令获取 MySQL 如何执行 SELECT 语句的信息，包括在 SELECT 语句执行

  过程中表如何连接和连接的顺序。

语法:

```sql
-- 直接在select语句之前加上关键字 explain / desc

EXPLAIN SELECT 字段列表 FROM 表名 WHERE 条件 ;
```

Explain 执行计划中各个字段的含义:

| 字段         | 含义                                                                                                                                                                                                  |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id           | select查询的序列号，表示查询中执行select子句或者是操作表的顺序(id相同，执行顺序从上到下；id不同，值越大，越先执行)。                                                                                  |
| select_type  | 表示 SELECT 的类型，常见的取值有 SIMPLE（简单表，即不使用表连接或者子查询）、PRIMARY（主查询，即外层的查询）、UNION（UNION 中的第二个或者后面的查询语句）、SUBQUERY（SELECT/WHERE之后包含了子查询）等 |
| type         | 表示连接类型，性能由好到差的连接类型为NULL、system、const、eq_ref、ref、range、 index、all 。UNION（UNION 中的第二个或者后面的查询语句）、                                                            |
| possible_key | 显示可能应用在这张表上的索引，一个或多个。                                                                                                                                                            |
| key          | 实际使用的索引，如果为NULL，则没有使用索引。                                                                                                                                                          |
| key_len      | 表示索引中使用的字节数， 该值为索引字段最大可能长度，并非实际使用长度，在不损失精确性的前提下， 长度越短越好 。                                                                                       |
| rows         | MySQL认为必须要执行查询的行数，在innodb引擎的表中，是一个估计值，可能并不总是准确的。                                                                                                                 |
| filtered     | 表示返回结果的行数占需读取行数的百分比， filtered 的值越大越好。                                                                                                                                      |

### 索引使用

#### 验证索引效率

在讲解索引的使用原则之前，先通过一个简单的案例，来验证一下索引，看看是否能够通过索引来提升数据查询性能。在演示的时候，我们还是使用之前准备的一张表 tb_sku , 在这张表中准备了1000w的记录。

这张表中id为主键，有主键索引，而其他字段是没有建立索引的。 我们先来查询其中的一条记录，看看里面的字段情况，执行如下SQL：

```sql
select * from tb_sku where id = 1\G;
```

可以看到即使有1000w的数据,根据id进行数据查询,性能依然很快，因为主键id是有索引的。 那么接下来，我们再来根据 sn 字段进行查询，执行如下SQL：

```sql
SELECT * FROM tb_sku WHERE sn = '100000003145001';
```

我们可以看到根据sn字段进行查询，查询返回了一条数据，结果耗时 20.78sec，就是因为sn没有索引，而造成查询效率很低。

那么我们可以针对于sn字段，建立一个索引，建立了索引之后，我们再次根据sn进行查询，再来看一下查询耗时情况。

创建索引：

然后再次执行相同的SQL语句，再次查看SQL的耗时。

```sql
create index idx_sku_sn on tb_sku(sn) ;
```

然后再次执行相同的SQL语句，再次查看SQL的耗时。

```sql
SELECT * FROM tb_sku WHERE sn = '100000003145001'; 1
```

我们明显会看到，sn字段建立了索引之后，查询性能大大提升。建立索引前后，查询耗时都不是一个数量级的。

#### 最左前缀法则

- 如果索引了多列（联合索引），要遵守最左前缀法则。最左前缀法则指的是查询从索引的最左列开始，并且不跳过索引中的列。如果跳跃某一列，索引将会部分失效(后面的字段索引失效)。

```sql
#
#在 tb_user 表中，有一个联合索引，这个联合索引涉及到三个字段，顺序分别为：profession，age，status。
#对于最左前缀法则指的是，查询时，最左变的列，也就是profession必须存在，否则索引全部失效。而且中间不能跳过某一列，否则该列后面的字段索引将失效。 接下来，我们来演示几组案例，看一下具体的执行计划：

explain select * from tb_user where profession = '软件工程' and age = 31 and status = '0';

explain select * from tb_user where profession = '软件工程' and age = 31;

explain select * from tb_user where profession = '软件工程';

#以上的这三组测试中，我们发现只要联合索引最左边的字段 profession存在，索引就会生效，只不过索引的长度不同。 而且由以上三组测试，我们也可以推测出profession字段索引长度为47、age字段索引长度为2、status字段索引长度为5。

explain select * from tb_user where age = 31 and status = '0';

explain select * from tb_user where status = '0';

#而通过上面的这两组测试，我们也可以看到索引并未生效，原因是因为不满足最左前缀法则，联合索引最左边的列profession不存在。

explain select * from tb_user where profession = '软件工程' and status = '0';

#上述的SQL查询时，存在profession字段，最左边的列是存在的，索引满足最左前缀法则的基本条件。但是查询时，跳过了age这个列，所以后面的列索引是不会使用的，也就是索引部分生效，所以索引的长度就是47。
```

#### 范围查询

- 联合索引中，出现范围查询(>,<)，范围查询右侧的列索引失效。

```sql
#
explain select * from tb_user where profession = '软件工程' and age > 30 and status = '0';

#当范围查询使用> 或 < 时，走联合索引了，但是索引的长度为49，就说明范围查询右边的status字段是没有走索引的。

explain select * from tb_user where profession = '软件工程' and age >= 30 and status = '0';

#当范围查询使用>= 或 <= 时，走联合索引了，但是索引的长度为54，就说明所有的字段都是走索引的。
```

所以，在业务允许的情况下，尽可能的使用类似于 >= 或 <= 这类的范围查询，而避免使用 > 或 <。

#### 索引失效情况

##### 索引列运算

- 不要在索引列上进行运算操作， 索引将失效。

```sql
explain select * from tb_user where substring(phone,10,2) = '15';
```

##### 字符串不加引号

－ 字符串类型字段使用时，不加引号，索引将失效。

```sql
explain select * from tb_user where profession='软件工程' and age = 31 and status = 0;
```

##### 模糊查询

－ 如果仅仅是尾部模糊匹配，索引不会失效。如果是头部模糊匹配，索引失效。

```sql
explain select * from tb_user where profession like '%工%';
```

##### or连接

－ 用or分割开的条件，如果or前的条件中的列有索引，而后面的列中没有索引，那么涉及的索引都不会被用到。

```sql
explain select * from tb_user where id = 10 or age = 23;
```

##### 数据分布影响

－ 如果mysql评估使用索引比全表扫描还慢，则不会使用索引

#### SQL提示

－ SQL提示，是优化数据库的一个重要手段，简单来说，就是在SQL语句中加入一些人为的提示来达到优化操作的目的。

```sql

#use index
explain select * from tb_user use index(idx_user_Pro) where profession = 'fkjvb';

#ignore index
explain select * from tb_user ignore index(idx_user_Pro) where profession = 'fkjvb';

#force index
explain select * from tb_user force index(idx_user_Pro) where profession = 'fkjvb';

```

#### 覆盖索引

- 尽量使用覆盖索引(查询使用了索引，并且需要返回的列，在该索引中已经全部能够找到)，减少select \*。

> using index condition：查找使用了索引，但是需要回表查询数据
> using where, using index：查找使用了索引，但是需要的数据在索引中都能找到，不需要进行回表查询

接下来，我们来看一组SQL的执行计划，看看执行计划的差别，然后再来具体做一个解析。

```sql
explain select id, profession from tb_user where profession = '软件工程' and age =31 and status = '0' ;
explain select id,profession,age, status from tb_user where profession = '软件工程'and age = 31 and status = '0' ;
explain select id,profession,age, status, name from tb_user where profession = '软件工程' and age = 31 and status = '0' ;
explain select * from tb_user where profession = '软件工程' and age = 31 and status= '0';
```

从上述的执行计划我们可以看到，这四条SQL语句的执行计划前面所有的指标都是一样的，看不出来差异。但是此时，我们主要关注的是后面的Extra，前面两天SQL的结果为 Using where; Using Index ; 而后面两条SQL的结果为: Using index condition 。

| Extra                    | 含义                                                                     |
| ------------------------ | ------------------------------------------------------------------------ |
| Using where; Using Index | 查找使用了索引，但是需要的数据都在索引列中能找到，所以不需要回表查询数据 |
| Using index condition    | 查找使用了索引，但是需要回表查询数据                                     |

> 因为，在tb_user表中有一个联合索引 idx_user_pro_age_sta，该索引关联了三个字段 profession、age、status，而这个索引也是一个二级索引，所以叶子节点下面挂的是这一行的主 键id。 所以当我们查询返回的数据在 id、profession、age、status 之中，则直接走二级索引 直接返回数据了。 如果超出这个范围，就需要拿到主键id，再去扫描聚集索引，再获取额外的数据了，这个过程就是回表。 而我们如果一直使用select \* 查询返回所有字段值，很容易就会造成回表 查询（除非是根据主键查询，此时只会扫描聚集索引）。

思考题：

一张表, 有四个字段(id, username, password, status), 由于数据量大, 需要对 以下SQL语句进行优化, 该如何进行才是最优方案:

select id,username,password from tb_user where username = 'itcast';

答案: 针对于 username, password建立联合索引, sql为: create index idx_user_name_pass on tb_user(username,password); 这样可以避免上述的SQL语句，在查询的过程中，出现回表查询。

#### 前缀索引

- 当字段类型为字符串（varchar，text，longtext等）时，有时候需要索引很长的字符串，这会让索引变得很大，查询时，浪费大量的磁盘IO， 影响查询效率。此时可以只将字符串的一部分前缀，建立索引，这样可以大大节约索引空间，从而提高索引效率。

##### 语法

```sql
create index idx_xxxx on table_name(column(n)) ;

#
-- 为tb_user表的email字段，建立长度为5的前缀索引。
create index idx_email_5 on tb_user(email(5));
```

##### 前缀长度

可以根据索引的选择性来决定，而选择性是指不重复的索引值（基数）和数据表的记录总数的比值， 索引选择性越高则查询效率越高， 唯一索引的选择性是1，这是最好的索引选择性，性能也是最好的。

```sql
select count(distinct email) / count(*) from tb_user ;
select count(distinct substring(email,1,5)) / count(*) from tb_user ;
```

##### 前缀索引的查询流程

#### 单列索引与联合索引

> 单列索引：即一个索引只包含单个列。
>
> 联合索引：即一个索引包含了多个列。

- 在业务场景中，如果存在多个查询条件，考虑针对于查询字段建立索引时，建议建立联合索引， 而非单列索引。

### 索引设计原则

1. 针对于数据量较大，且查询比较频繁的表建立索引。

2. 针对于常作为查询条件（where）、排序（order by）、分组（group by）操作的字段建立索 引。

3. 尽量选择区分度高的列作为索引，尽量建立唯一索引，区分度越高，使用索引的效率越高。

4. 如果是字符串类型的字段，字段的长度较长，可以针对于字段的特点，建立前缀索引。

5. 尽量使用联合索引，减少单列索引，查询时，联合索引很多时候可以覆盖索引，节省存储空间， 避免回表，提高查询效率。

6. 要控制索引的数量，索引并不是多多益善，索引越多，维护索引结构的代价也就越大，会影响增 删改的效率。 1 create unique index idx_user_phone_name on tb_user(phone,name);

7. 如果索引列不能存储NULL值，请在创建表时使用NOT NULL约束它。当优化器知道每列是否包含 NULL值时，它可以更好地确定哪个索引最有效地用于查询。

## 9.SQL优化

### 插入数据

### 主键优化

### order by优化

### group by优化

### limit优化

### count优化

### update优化

## 10.视图

### 介绍

视图（View）是一种虚拟存在的表。视图中的数据并不在数据库中实际存在，行和列数据来自定义视 图的查询中使用的表，并且是在使用视图时动态生成的。 通俗的讲，视图只保存了查询的SQL逻辑，不保存查询结果。所以我们在创建视图的时候，主要的工作 就落在创建这条SQL查询语句上。

### 语法

```sql
#创建
CREATE [OR REPLACE] VIEW 视图名称[(列名列表)] AS SELECT语句 [ WITH [CASCADED | LOCAL ] CHECK OPTION ]
#查询
-- 查看创建视图语句：
SHOW CREATE VIEW 视图名称;
-- 查看视图数据：
SELECT * FROM 视图名称 ...... ;
#修改
CREATE [OR REPLACE] VIEW 视图名称[(列名列表)] AS SELECT语句 [ WITH [ CASCADED | LOCAL ] CHECK OPTION ]
-- 或者
ALTER VIEW 视图名称[(列名列表)] AS SELECT语句 [ WITH [ CASCADED | LOCAL ] CHECK OPTION ]
#删除
DROP VIEW [IF EXISTS] 视图名称 [,视图名称] ...

#
-- 创建视图
create or replace view stu_v_1 as select id,name from student where id <= 10;
-- 查询视图
show create view stu_v_1;
select * from stu_v_1;
select * from stu_v_1 where id < 3;
-- 修改视图
create or replace view stu_v_1 as select id,name,no from student where id <= 10;
alter view stu_v_1 as select id,name from student where id <= 10;
-- 删除视图
drop view if exists stu_v_1;
```

### 检查选项

当使用WITH CHECK OPTION子句创建视图时，MySQL会通过视图检查正在更改的每个行，例如插入，更新，删除，以使其符合视图的定义。 MySQL允许基于另一个视图创建视图，它还会检查依赖视 图中的规则以保持一致性。为了确定检查的范围，mysql提供了两个选项： CASCADED 和 LOCAL ，默认值为 CASCADED 。

#### CASCADED

- 级联。

比如，v2视图是基于v1视图的，如果在v2视图创建的时候指定了检查选项为 cascaded，但是v1视图 创建时未指定检查选项。 则在执行检查时，不仅会检查v2，还会级联检查v2的关联视图v1。

#### LOCAL

- 本地

比如，v2视图是基于v1视图的，如果在v2视图创建的时候指定了检查选项为 local ，但是v1视图创 建时未指定检查选项。 则在执行检查时，知会检查v2，不会检查v2的关联视图v1。

### 视图的更新

要使视图可更新，视图中的行与基础表中的行之间必须存在一对一的关系。如果视图包含以下任何一 项，则该视图不可更新：

> A. 聚合函数或窗口函数（SUM()、 MIN()、 MAX()、 COUNT()等）
>
> B. DISTINCT
>
> C. GROUP BY
>
> D. HAVING
>
> E. UNION 或者 UNION ALL

```sql
#
create view stu_v_count as select count(*) from student;
-- 上述的视图中，就只有一个单行单列的数据，如果我们对这个视图进行更新或插入的，将会报错。
insert into stu_v_count values(10);
-- error
```

### 视图作用

#### 简单

视图不仅可以简化用户对数据的理解，也可以简化他们的操作。那些被经常使用的查询可以被定义为视图，从而使得用户不必为以后的操作每次指定全部的条件。

#### 安全

数据库可以授权，但不能授权到数据库特定行和特定的列上。通过视图用户只能查询和修改他们所能见到的数据

#### 数据独立

视图可帮助用户屏蔽真实表结构变化带来的影响。

### 案例

```sql
#
-- 1. 为了保证数据库表的安全性，开发人员在操作tb_user表时，只能看到的用户的基本字段，屏蔽手机号和邮箱两个字段。
create view tb_user_view as select id,name,profession,age,gender,status,createtime from tb_user;
select * from tb_user_view;

-- 2.查询每个学生所选修的课程（三张表联查），这个功能在很多的业务中都有使用到，为了简化操作，定义一个视图。
create view tb_stu_course_view as select s.name student_name, s.no student_no , c.name course_name from student s, student_course sc , course c where s.id = sc.studentid and sc.courseid = c.id;
select * from tb_stu_course_view;
```

## 11.存储过程

### 介绍

- 存储过程是事先经过编译并存储在数据库中的一段 SQL 语句的集合，调用存储过程可以简化应用开发 人员的很多工作，减少数据在数据库和应用服务器之间的传输，对于提高数据处理的效率是有好处的。 存储过程思想上很简单，就是数据库 SQL 语言层面的代码封装与重用。

特点:

> 封装，复用 -----------------------> 可以把某一业务SQL封装在存储过程中，需要用到 的时候直接调用即可
>
> 可以接收参数，也可以返回数据 --------> 再存储过程中，可以传递参数，也可以接收返回 值。
>
> 减少网络交互，效率提升 -------------> 如果涉及到多条SQL，每执行一次都是一次网络传 输。 而如果封装在存储过程中，我们只需要网络交互一次可能就可以了。

### 基本语法

```sql
#创建
CREATE PROCEDURE 存储过程名称 ([ 参数列表 ])
BEGIN
  -- SQL语句
END ;
#调用
CALL 名称 ([ 参数 ]);
#查看
SELECT * FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_SCHEMA = 'xxx'; -- 查询指定数据库的存储过程及状态信息
SHOW CREATE PROCEDURE 存储过程名称 ; -- 查询某个存储过程的定义
#删除
DROP PROCEDURE [ IF EXISTS ] 存储过程名称;
```

- 注意: 在命令行中，执行创建存储过程的SQL时，需要通过关键字 delimiter 指定SQL语句的结束符。

  ```sql
  #
  delimiter $$;

  #
  create procedure p1()
  begin
  select count(*) from student;
  end$$
  ```

```sql
#
-- 存储过程基本语法
-- 创建
create procedure p1()
begin
select count(*) from student;
end;
-- 调用
call p1();
-- 查看
select * from information_schema.ROUTINES where ROUTINE_SCHEMA = 'itcast';
show create procedure p1;
-- 删除
drop procedure if exists p1;
```

### 变量

在MySQL中变量分为三种类型: 系统变量、用户定义变量、局部变量。

#### 系统变量

系统变量 是MySQL服务器提供，不是用户定义的，属于服务器层面。分为全局变量（GLOBAL）、会话变量（SESSION）。

```sql
#查看系统变量
SHOW [ SESSION | GLOBAL ] VARIABLES ; -- 查看所有系统变量
SHOW [ SESSION | GLOBAL ] VARIABLES LIKE '......'; -- 可以通过LIKE模糊匹配方式查找变量
SELECT @@[SESSION | GLOBAL] 系统变量名; -- 查看指定变量的值
#设置系统变量
SET [ SESSION | GLOBAL ] 系统变量名 = 值 ;
SET @@[SESSION | GLOBAL]系统变量名 = 值 ;
```

- 注意: 如果没有指定SESSION/GLOBAL，默认是SESSION，会话变量。

- mysql服务重新启动之后，所设置的全局参数会失效，要想不失效，可以在 /etc/my.cnf 中配置。

> A. 全局变量(GLOBAL): 全局变量针对于所有的会话。
>
> B. 会话变量(SESSION): 会话变量针对于单个会话，在另外一个会话窗口就不生效了。

```sql
#
-- 查看系统变量
show session variables ;
show session variables like 'auto%';
show global variables like 'auto%';
select @@global.autocommit;
select @@session.autocommit;
-- 设置系统变量
set session autocommit = 1;
insert into course(id, name) VALUES (6, 'ES');
set global autocommit = 0;
select @@global.autocommit;
```

#### 用户定义变量

用户定义变量 是用户根据需要自己定义的变量，用户变量不用提前声明，在用的时候直接用 "@变量 名" 使用就可以。其作用域为当前连接。

```sql
#赋值
SET @var_name = expr [, @var_name = expr] ... ;
SET @var_name := expr [, @var_name := expr] ... ;
-- 赋值时，可以使用 = ，也可以使用 := 。
-- 或者：
SELECT @var_name := expr [, @var_name := expr] ... ;
SELECT 字段名 INTO @var_name FROM 表名;
#使用
SELECT @var_name ;
```

- 注意: 用户定义的变量无需对其进行声明或初始化，只不过获取到的值为NULL。

```sql
#
-- 赋值
set @myname = 'itcast';
set @myage := 10;
set @mygender := '男',@myhobby := 'java';
select @mycolor := 'red';
select count(*) into @mycount from tb_user;
-- 使用
select @myname,@myage,@mygender,@myhobby;
select @mycolor , @mycount;
select @abc;
```

#### 局部变量

局部变量 是根据需要定义的在局部生效的变量，访问之前，需要DECLARE声明。可用作存储过程内的 局部变量和输入参数，局部变量的范围是在其内声明的BEGIN ... END块。

```sql
#声明
DECLARE 变量名 变量类型 [DEFAULT ... ] ;
-- 变量类型就是数据库字段类型：INT、BIGINT、CHAR、VARCHAR、DATE、TIME等。
#赋值
SET 变量名 = 值 ;
SET 变量名 := 值 ;
SELECT 字段名 INTO 变量名 FROM 表名 ... ;

#
-- 声明局部变量 - declare
-- 赋值
create procedure p2()
begin
declare stu_count int default 0;
select count(*) into stu_count from student;
select stu_count;
end;
call p2();
```

### If

- if 用于做条件判断，具体的语法结构为：

```sql
IF 条件1 THEN
.....
ELSEIF 条件2 THEN -- 可选
.....
ELSE -- 可选
.....
END IF;
```

```sql
#
create procedure p3()
begin
 declare score int default 58;
 declare result varchar(10);
 if score >= 85 then
  set result := '优秀';
 elseif score >= 60 then
  set result := '及格';
 else
  set result := '不及格';
 end if;
select result;
end;
call p3();
```

### 参数

- 参数的类型，主要分为以下三种：IN、OUT、INOUT。

| 类型  | 含义                                         | 备注 |
| ----- | -------------------------------------------- | ---- |
| IN    | 该类参数作为输入，也就是需要调用时传入值     | 默认 |
| OUT   | 该类参数作为输出，也就是该参数可以作为返回值 |      |
| INOUT | 既可以作为输入参数，也可以作为输出参数       |      |

```sql
#用法
CREATE PROCEDURE 存储过程名称 ([ IN/OUT/INOUT 参数名 参数类型 ])
BEGIN
-- SQL语句
END ;
```

```sql
#
-- 案例一
-- 根据传入参数score，判定当前分数对应的分数等级，并返回。
-- score >= 85分，等级为优秀。
-- score >= 60分 且 score < 85分，等级为及格。
-- score < 60分，等级为不及格。
create procedure p4(in score int, out result varchar(10))
begin
 if score >= 85 then
  set result := '优秀';
 elseif score >= 60 then
  set result := '及格';
 else
  set result := '不及格';
end if;
end;
-- 定义用户变量 @result来接收返回的数据, 用户变量可以不用声明
call p4(18, @result);
select @result;

-- 案例二
-- 将传入的200分制的分数，进行换算，换算成百分制，然后返回。
create procedure p5(inout score double)
begin
 set score := score * 0.5;
end;
set @score = 198;
call p5(@score);
select @score;
```

### Case

- case结构及作用，和我们在基础篇中所讲解的流程控制函数很类似。有两种语法格式：

```sql
#1
-- 含义： 当case_value的值为 when_value1时，执行statement_list1，当值为 when_value2时，执行statement_list2， 否则就执行 statement_list
CASE case_value
  WHEN when_value1 THEN statement_list1
  [ WHEN when_value2 THEN statement_list2] ...
  [ ELSE statement_list ]
END CASE;
#2
-- -- 含义： 当条件search_condition1成立时，执行statement_list1，当条件search_condition2成立时，执行statement_list2， 否则就执行 statement_list
CASE
  WHEN search_condition1 THEN statement_list1
  [WHEN search_condition2 THEN statement_list2] ...
  [ELSE statement_list]
END CASE;
```

```sql
#
-- 根据传入的月份，判定月份所属的季节（要求采用case结构）。
-- 1-3月份，为第一季度
-- 4-6月份，为第二季度
-- 7-9月份，为第三季度
-- 10-12月份，为第四季度
create procedure p6(in month int)
begin
  declare result varchar(10);
  case
    when month >= 1 and month <= 3 then
        set result := '第一季度';
    when month >= 4 and month <= 6 then
        set result := '第二季度';
    when month >= 7 and month <= 9 then
        set result := '第三季度';
    when month >= 10 and month <= 12 then
        set result := '第四季度';
    else
        set result := '非法参数';
    end case ;
    select concat('您输入的月份为: ',month, ', 所属的季度为: ',result);
end;
call p6(16);
```

### While

- while 循环是有条件的循环控制语句。满足条件后，再执行循环体中的SQL语句。具体语法为：

```sql
-- 先判定条件，如果条件为true，则执行逻辑，否则，不执行逻辑
WHILE 条件 DO
  -- SQL逻辑...
END WHILE;
```

```sql
#
-- 计算从1累加到n的值，n为传入的参数值。
-- A. 定义局部变量, 记录累加之后的值;
-- B. 每循环一次, 就会对n进行减1 , 如果n减到0, 则退出循环
create procedure p7(in n int)
begin
declare total int default 0;
while n>0 do
set total := total + n;
set n := n - 1;
end while;
select total;
end;
call p7(100);
```

### Repeat

- repeat是有条件的循环控制语句, 当满足until声明的条件的时候，则退出循环 。具体语法为：

```sql
-- 先执行一次逻辑，然后判定UNTIL条件是否满足，如果满足，则退出。如果不满足，则继续下一次循环
REPEAT
  -- SQL逻辑...
UNTIL 条件
END REPEAT;
```

```sql
#
-- 计算从1累加到n的值，n为传入的参数值。(使用repeat实现)
-- A. 定义局部变量, 记录累加之后的值;
-- B. 每循环一次, 就会对n进行-1 , 如果n减到0, 则退出循环
create procedure p8(in n int)
begin
declare total int default 0;
repeat
set total := total + n;
set n := n - 1;
until n <= 0
end repeat;
select total;
end;
call p8(10);
call p8(100);
```

### Loop

- LOOP 实现简单的循环，如果不在SQL逻辑中增加退出循环的条件，可以用其来实现简单的死循环。 LOOP可以配合一下两个语句使用：

> LEAVE ：配合循环使用，退出循环。
>
> ITERATE：必须用在循环中，作用是跳过当前循环剩下的语句，直接进入下一次循环。

```sql
[begin_label:] LOOP
  -- SQL逻辑...
END LOOP [end_label];

LEAVE label; -- 退出指定标记的循环体
ITERATE label; -- 直接进入下一次循环
```

- 上述语法中出现的 begin_label，end_label，label 指的都是我们所自定义的标记。

```sql
#
#案例一
-- 计算从1累加到n的值，n为传入的参数值。
-- A. 定义局部变量, 记录累加之后的值;
-- B. 每循环一次, 就会对n进行-1 , 如果n减到0, 则退出循环 ----> leave xx
create procedure p9(in n int)
begin
declare total int default 0;
sum:loop
if n<=0 then
leave sum;
end if;
set total := total + n;
set n := n - 1;
end loop sum;
select total;
end;
call p9(100);

#案例二
-- 计算从1到n之间的偶数累加的值，n为传入的参数值。
-- A. 定义局部变量, 记录累加之后的值;
-- B. 每循环一次, 就会对n进行-1 , 如果n减到0, 则退出循环 ----> leave xx
-- C. 如果当次累加的数据是奇数, 则直接进入下一次循环. --------> iterate xx
create procedure p10(in n int)
begin
declare total int default 0;
sum:loop
if n<=0 then
leave sum;
end if;
if n%2 = 1 then
set n := n - 1;
iterate sum;
end if;
set total := total + n;
set n := n - 1;
end loop sum;
select total;
end;
call p10(100);
```

### 游标

- 游标（CURSOR）是用来存储查询结果集的数据类型 , 在存储过程和函数中可以使用游标对结果集进行循环的处理。游标的使用包括游标的声明、OPEN、FETCH 和 CLOSE，其语法分别如下。

```sql
#声明游标
DECLARE 游标名称 CURSOR FOR 查询语句 ;
#打开游标
OPEN 游标名称 ;
#获取游标记录
FETCH 游标名称 INTO 变量 [, 变量 ] ;
#关闭游标
CLOSE 游标名称 ;
```

```sql
#
-- 根据传入的参数uage，来查询用户表tb_user中，所有的用户年龄小于等于uage的用户姓名（name）和专业（profession），并将用户的姓名和专业插入到所创建的一张新表(id,name,profession)中。
-- 逻辑:
-- A. 声明游标, 存储查询结果集
-- B. 准备: 创建表结构
-- C. 开启游标
-- D. 获取游标中的记录
-- E. 插入数据到新表中
-- F. 关闭游标
create procedure p11(in uage int)
begin
declare uname varchar(100);
declare upro varchar(100);
declare u_cursor cursor for select name,profession from tb_user where age <=
uage;
drop table if exists tb_user_pro;
create table if not exists tb_user_pro(
id int primary key auto_increment,
name varchar(100),
profession varchar(100)
);
open u_cursor;
while true do
fetch u_cursor into uname,upro;
insert into tb_user_pro values (null, uname, upro);
end while;
close u_cursor;
end;
call p11(30);
-- 上述的存储过程，最终我们在调用的过程中，会报错，之所以报错是因为上面的while循环中，并没有退出条件。当游标的数据集获取完毕之后，再次获取数据，就会报错，从而终止了程序的执行。
-- 但是此时，tb_user_pro表结构及其数据都已经插入成功了，我们可以直接刷新表结构，检查表结构中的数据。
-- 上述的功能，虽然我们实现了，但是逻辑并不完善，而且程序执行完毕，获取不到数据，数据库还报错。要想解决这个问题，就需要通过MySQL中提供的条件处理程序 Handler 来解决。
```

### 条件处理程序

- 条件处理程序（Handler）可以用来定义在流程控制结构执行过程中遇到问题时相应的处理步骤。具体语法为：

```sql
DECLARE handler_action HANDLER FOR condition_value [, condition_value] ... statement ;
#handler_action 的取值：
  CONTINUE -- 继续执行当前程序
  EXIT -- 终止执行当前程序
#condition_value 的取值：
  SQLSTATE sqlstate_value -- 状态码，如 02000

SQLWARNING -- 所有以01开头的SQLSTATE代码的简写
NOT FOUND -- 所有以02开头的SQLSTATE代码的简写
SQLEXCEPTION -- 所有没有被SQLWARNING 或 NOT FOUND捕获的SQLSTATE代码的简写

```

```sql
#继续上一个案例
-- 根据传入的参数uage，来查询用户表tb_user中，所有的用户年龄小于等于uage的用户姓名（name）和专业（profession），并将用户的姓名和专业插入到所创建的一张新表(id,name,profession)中。

-- A.通过SQLSTATE指定具体的状态码
-- 逻辑:
-- A. 声明游标, 存储查询结果集
-- B. 准备: 创建表结构
-- C. 开启游标
-- D. 获取游标中的记录
-- E. 插入数据到新表中
-- F. 关闭游标
create procedure p11(in uage int)
begin
declare uname varchar(100);
declare upro varchar(100);
declare u_cursor cursor for select name,profession from tb_user where age <=
uage;
-- 声明条件处理程序 ： 当SQL语句执行抛出的状态码为02000时，将关闭游标u_cursor，并退出
declare exit handler for SQLSTATE '02000' close u_cursor;
drop table if exists tb_user_pro;
create table if not exists tb_user_pro(
id int primary key auto_increment,
name varchar(100),
profession varchar(100)
);
open u_cursor;
while true do
fetch u_cursor into uname,upro;
insert into tb_user_pro values (null, uname, upro);
end while;
close u_cursor;
end;
call p11(30);


-- B.通过SQLSTATE的代码简写方式 NOT FOUND
-- 02 开头的状态码，代码简写为 NOT FOUND
create procedure p12(in uage int)
begin
declare uname varchar(100);
declare upro varchar(100);
declare u_cursor cursor for select name,profession from tb_user where age <=
uage;
-- 声明条件处理程序 ： 当SQL语句执行抛出的状态码为02开头时，将关闭游标u_cursor，并退出
declare exit handler for not found close u_cursor;
drop table if exists tb_user_pro;
create table if not exists tb_user_pro(
id int primary key auto_increment,
    name varchar(100),
profession varchar(100)
);
open u_cursor;
while true do
fetch u_cursor into uname,upro;
insert into tb_user_pro values (null, uname, upro);
end while;
close u_cursor;
end;
call p12(30);
```

- 具体的错误状态码，可以参考官方文档：

  > https://dev.mysql.com/doc/refman/8.0/en/declare-handler.html
  >
  > https://dev.mysql.com/doc/mysql-errors/8.0/en/server-error-reference.html

## 12.触发器

### 介绍

- 触发器是与表有关的数据库对象，指在insert/update/delete之前(BEFORE)或之后(AFTER)，触发并执行触发器中定义的SQL语句集合。触发器的这种特性可以协助应用在数据库端确保数据的完整性 , 日志记录, 数据校验等操作 。

- 使用别名OLD和NEW来引用触发器中发生变化的记录内容，这与其他的数据库是相似的。现在触发器还只支持行级触发，不支持语句级触发。

| 触发器类型      | NEW和OLD                                                |
| --------------- | ------------------------------------------------------- |
| INSERT 型触发器 | NEW 表示将要或者已经新增的数据                          |
| UPDATE 型触发器 | OLD 表示修改之前的数据 , NEW 表示将要或已经修改后的数据 |
| DELETE 型触发器 | OLD 表示将要或者已经删除的数据                          |

### 语法

```sql
#创建
CREATE TRIGGER trigger_name
    BEFORE/AFTER    INSERT/UPDATE/DELETE
ON tbl_name FOR EACH ROW -- 行级触发器
BEGIN
  -- trigger_stmt;
END;
#查看
SHOW TRIGGERS;
#删除
DROP TRIGGER [schema_name.]trigger_name ; -- 如果没有指定 schema_name，默认为当前数据库。
```

```sql
#
-- 通过触发器记录 tb_user 表的数据变更日志，将变更日志插入到日志表user_logs中, 包含增加,修改,删除;
-- 表结构：
create table user_logs(
id int(11) not null auto_increment,
operation varchar(20) not null comment '操作类型, insert/update/delete',
operate_time datetime not null comment '操作时间',
operate_id int(11) not null comment '操作的ID',
operate_params varchar(500) comment '操作参数',
primary key(`id`)
)engine=innodb default charset=utf8;

-- A.插入数据触发器
create trigger tb_user_insert_trigger
after insert on tb_user for each row
begin
insert into user_logs(id, operation, operate_time, operate_id, operate_params)
VALUES
(null, 'insert', now(), new.id, concat('插入的数据内容为:id=',new.id,',name=',new.name, ', phone=', NEW.phone, ', email=', NEW.email, ',profession=', NEW.profession));
end;
-- 测试
-- 查看
show triggers ;
-- 插入数据到tb_user
insert into tb_user(id, name, phone, email, profession, age, gender, status,createtime) VALUES (26,'三皇子','18809091212','erhuangzi@163.com','软件工程',23,'1','1',now());

-- B..修改数据触发器
create trigger tb_user_update_trigger
after update on tb_user for each row
begin
insert into user_logs(id, operation, operate_time, operate_id, operate_params)
VALUES
(null, 'update', now(), new.id,concat('更新之前的数据: id=',old.id,',name=',old.name, ', phone=',old.phone, ', email=', old.email, ', profession=', old.profession,' | 更新之后的数据: id=',new.id,',name=',new.name, ', phone=',NEW.phone, ', email=', NEW.email, ', profession=', NEW.profession));
end;
-- 测试
-- 查看
show triggers ;
-- 更新
update tb_user set profession = '会计' where id = 23;
update tb_user set profession = '会计' where id <= 5;

-- C.删除数据触发器
create trigger tb_user_delete_trigger
after delete on tb_user for each row
begin
insert into user_logs(id, operation, operate_time, operate_id, operate_params)
VALUES
(null, 'delete', now(), old.id,concat('删除之前的数据: id=',old.id,',name=',old.name, ', phone=',old.phone, ', email=', old.email, ', profession=', old.profession));
end;
-- 测试
-- 查看
show triggers ;
-- 删除数据
delete from tb_user where id = 26;
```
