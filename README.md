# Description

Quick and simple way to generate TypeScript classes, interfaces and jsDocs from objects

# Example usage

```javascript
const { jsonToTS } = require("@live2ride/jsontots");

const config = {
    id: "0001",
    type: "donut",
    name: "Cake",
    ppu: 0.55,
    isyummy: true,
    batters: {
      batter: [
        { id: "1001", type: "Regular" },
        { id: "1002", type: "Chocolate" },
      ],
    },
    topping: [
      { id: "5001", type: "None" },
      { id: "5002", type: "Glazed" },
    ],
  };
  let rv = jsonToTS(config, { optional: true });


console.log(rv.jsDoc);

/**
 * @type Yourclass
 *
 * @property {string=} id -
 * @property {string=} type -
 * @property {string=} name -
 * @property {number=} ppu -
 * @property {boolean=} isyummy -
 * @property {Object=} batters -
 * @property {any=} batters.batter -
 * @property {any=} topping -
 *
 * @example
 *
 */





console.log(rv.interface);

interface IYourclass {
   id?: string;
   type?: string;
   name?: string;
   ppu?: number;
   isyummy?: boolean;
   batters?: {
      batter?: any[];
   }
   topping?: any[];
}



console.log(rv.class);

class Yourclass {
   id?: string;
   type?: string;
   name?: string;
   ppu?: number;
   isyummy?: boolean;
   batters?: {
      batter?: any[];
   }
   topping?: any[];

      constructor(_props: any){
         this.id = _props?.id
         this.type = _props?.type
         this.name = _props?.name
         this.ppu = _props?.ppu
         this.isyummy = _props?.isyummy
         this.batters = _props?.batters || {}
         this.batters?.batter = _props?.batters?.batter
         this.topping = _props?.topping
      }
}

```

### And if you're using [@live2ride/db](https://github.com/live2ride/db) then you can do something like this:

```javascript
import DB from "@live2ride/db";
const db = new DB();

let qry = `select top 1 * from dbo.yourTable`; //or any select statement
let res = await db.exec(qry, null, true); //get first row from the recordset

let rv: any = jsonToTS(res); //returns TypeScript jsDoc comments, class and interface
console.log(rv.jsDoc);
```
