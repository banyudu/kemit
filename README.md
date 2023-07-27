# kemit

Git提交便捷工具 - 贝壳

根据当前分支名，自动添加符合规范的 Git Commit 消息前缀

## 安装

```bash
npm install -g kemit
```

## 使用

```bash
# 假设当前在 feat/12345678/xxx 分支
kemit -m '添加xxx功能' # 等价于 git commit -m '[需求][12345678] 添加xxx功能'

# 也可以写成 git kemit -m '添加xxx功能'
```

```bash
# 假设当前在 master 分支，或其它不符合 feat/<数字>/<描述> 规范的分支
kemit -m '添加xxx功能' # 等价于 git commit -m '添加xxx功能'

# 也可以写成 git kemit -m '添加xxx功能'
```
