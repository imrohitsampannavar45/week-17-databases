Steps to Run the TypeScript Files
```sh

npm init -y
npm install typescript
npx tsc -init
```

Go to tsconfig.json 
* rootDir : ./src
* outdir : ./dist

and do to package.json and change in scripts
```sh
    "dev": "tsc -b && node ./dist/index.js"
```

and install 

```sh
npm install pg @types/pg
```

and also install express 

```sh
npm install --save-dev @types/express
```

adn run the server 
```sh
npm run dev
```
