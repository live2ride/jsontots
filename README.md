# Description

Simpler way to write TypeScript classes, interfaces and jsDocs

# Example usage

```javascript
const { jsonToTS } = require("@live2ride/jsontots");

const json = {
  id: "0001",
  type: "donut",
  name: "Cake",
  topping: [{ id: "5003", type: "Chocolate" }],
};

let rv: any = jsonToTS(json);


console.log(rv.jsDoc);

/**
 * @type Node
 *
 * @property {string} id
 * @property {string} type
 * @property {string} name
 * @property {any} topping
 *
 * @example
 *
 */





console.log(rv.interface);

interface INode {
 id: string;
 type: string;
 name: string;
 topping: any;
}



console.log(rv.class);

class Node {
  id: string;
 type: string;
 name: string;
 topping: any;

constructor(_props: any){
  let _fields = []
    if(_props){
      for(const f of _fields){
        this[f  as keyof this] = _props[f]
      }
    }
  }}
```
