# Publicación del CLI

## Comprobaciones

```sh
npm run check
npm test --workspace packages/cli
npm run cli:pack
```

`cli:pack` regenera el registro y crea el paquete que se publicará. Conviene instalar
ese archivo `.tgz` en un proyecto temporal antes de cada versión.

## Nombre y versión

El paquete se publica bajo el ámbito del usuario `dediho`:

```sh
npx @dediho/vue-kit create mi-dashboard
```

La distribución utiliza licencia MIT.

## Publicación

```sh
npm version patch --workspace packages/cli
npm publish --workspace packages/cli
```

Para un paquete con ámbito público se utiliza:

```sh
npm publish --workspace packages/cli --access public
```

Publicar modifica el registro de npm y requiere una cuenta autenticada. No forma parte
de la compilación local del dashboard.
