simple monorepo
===

use yarn workspace to manager project, [https://classic.yarnpkg.com/en/docs/workspaces/](https://classic.yarnpkg.com/en/docs/workspaces/)

support official subProject 

- (react typescript) umi project [https://v2.umijs.org/](https://v2.umijs.org/)

## install

```bash
yarn
```
## new subProject

```bash
yarn new
```

- local-template

noop

- official-template
  - umi `yarn workspace <subProject> run create-umi`
  - other @todo

## start subProject

```bash
# in root
yarn workspace <subProject> start

# in subProject
cd packages/<subProject>
yarn start
```

## build subProject

current monorepo is so simple. use local compilare to `dist/` for deploy.

before deploy should check `dist/` make sure there is only one project change

```bash
# in root
yarn workspace <subProject> build

# in subProject
cd packages/<subProject>
yarn build
```

## deploy

only deploy `dist/` static page, maybe use `github pages` or others.

external some library, like react,react-dom. CDN is good idea.(jsdeliver, bootcdn, ...)



