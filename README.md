# How to run project

**1. Clone the repository “OnomaAI/OnomaMarketplace”**

**2. Create .env file to the root directory**

![image](https://user-images.githubusercontent.com/58359639/164145027-dd3170b3-8040-4aec-bf3a-508bc92a873d.png)
![image](https://user-images.githubusercontent.com/58359639/164145042-5b9c69ad-c1e6-4c76-9e98-6825764e9411.png)

PRIVATE_KEY는 메타마스크의 다음 화면에서,

![https://user-images.githubusercontent.com/58359639/158768423-ec7096d2-01f2-4671-8f00-97c27df958d9.png](https://user-images.githubusercontent.com/58359639/158768423-ec7096d2-01f2-4671-8f00-97c27df958d9.png)

아래의 버튼을 눌러 복사할 수 있다.

![https://user-images.githubusercontent.com/58359639/158768500-4e6edfeb-fe60-4429-8903-03b181b45193.png](https://user-images.githubusercontent.com/58359639/158768500-4e6edfeb-fe60-4429-8903-03b181b45193.png)

**3. NPM Installation**

```bash
npm install -D ethers hardhat @openzeppelin/contracts ipfs-http-client axios web3modal tailwindcss@latest postcss@latest autoprefixer@latest @nomiclabs/hardhat-ethers postgresql express cors pg pg-hstore body-parser path
```

**4. Set sequelizer to run DB**
```bash
npm install -D sequelize sequelize-cli
```

```bash
npx sequelize init
```

Then update server/config/config.json

```json
{
  "development": {
    "username": "<Your DB Username>",
    "password": "<Your DB Password>",
    "database": "onoma",
    "host": "<DB IP>",
    "dialect": "postgres"
  },
  ...
```

**5. Run**
- To run server

```bash
node server/app.js
```

- To execute next project app
```bash
npm run dev
```
