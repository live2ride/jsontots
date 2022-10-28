"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This function converts json object to TypeScript interface, class and jsDoc
 *
 *
 * @param {*} json Object to be converted into class or interface or jsDoc
 * @param {IOptions} options additional options
 * @return {*} returns object with interface, class and jsDoc you can easily console.log and paste in your class ect...
 *
 * @example
const json = {
    id: "0001",
    type: "donut",
    name: "Cake",
    topping: [{ id: "5003", type: "Chocolate" }],
};

console.log(rv.jsDoc)
console.log(rv.interface)
console.log(rv.class)
 */
function jsonToTS(json, options) {
    let allOptions = Object.assign({ optional: false }, (options || {}));
    let nJson = {};
    for (const [key, value] of Object.entries(json)) {
        nJson = getType(nJson, key, typeof value);
    }
    const fields = {
        keys: [],
        interface: [],
    };
    const name = getName("node");
    // let interfaceName = `I${name}`;
    let tmp = `${name} {\n`;
    let interfaceStr = `interface I${tmp}`;
    let classStr = `class ${tmp} `;
    let jsDoc = `/**\n * @type ${name}\n *\n`;
    for (const [key, value] of Object.entries(nJson)) {
        jsDoc += ` * @property {${value}} ${key} \n`;
        tmp = ` ${key}${options.optional ? "?" : ""}: ${value};\n`;
        interfaceStr += tmp;
        classStr += tmp;
    }
    classStr += `\nconstructor(_props: any){ 
  let _fields = ${JSON.stringify(fields.keys)}
    if(_props){
      for(const f of _fields){
        this[f  as keyof this] = _props[f]
      }
    }
  }`;
    tmp = `}\n`;
    interfaceStr += tmp;
    classStr += tmp;
    jsDoc += ` *
 * @example
 *
 */
      `;
    return { interface: interfaceStr, class: classStr, jsDoc: jsDoc };
}
exports.default = jsonToTS;
function getName(name) {
    name = name.toLowerCase();
    const tnArray = name.split("");
    tnArray[0] = tnArray[0].toUpperCase();
    return tnArray.join("");
}
function getType(obj, key, type) {
    let tsType = "any";
    if (type === "string") {
        tsType = "string";
    }
    else if (type === "number") {
        tsType = "number";
    }
    obj[key] = tsType;
    return obj;
}
