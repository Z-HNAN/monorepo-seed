simple monorepo
===

use yarn workspace to manager project, [https://classic.yarnpkg.com/en/docs/workspaces/](https://classic.yarnpkg.com/en/docs/workspaces/)

support official subProject 

- (react typescript) umi project [https://v2.umijs.org/](https://v2.umijs.org/)
- (react typescript) alita project [https://alitajs.com/](https://alitajs.com/)

## install

```bash
yarn
```
## new subProject

```bash
yarn new

# next will get Command line interaction
```

- local-template

noop (auto copy file)

please add some template like (`/root/template/base/package.json`) before new subProject

- official-template
  - umi `yarn workspace <subProject> run create-umi`
  - alita `yarn workspace <subProject> run create-alita`
  - other @todo

when create subProject, ensure exist "name", "version" in package.json

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

```bash
yarn deploy

# next will get Command line interaction

# when in master will git commit/push and git tag
# when in other branch will open http-server to preview
```

only deploy `dist/` static page, maybe use `github pages` or others.

external some library, like react,react-dom. CDN is good idea.(jsdeliver, bootcdn, ...)



