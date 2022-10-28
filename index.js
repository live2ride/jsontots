"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonToTS = void 0;
function repeatTab(tabCount) {
    let str = "";
    for (let i = 0; i < tabCount; i++) {
        str += `   `;
    }
    return str;
}
function getName(name) {
    name = name.toLowerCase();
    const tnArray = name.split("");
    tnArray[0] = tnArray[0].toUpperCase();
    return tnArray.join("");
}
function getType(value) {
    const type = String(typeof value);
    if (["string", "number", "boolean"].includes(type)) {
        return type;
    }
    else {
        if (Array.isArray(value)) {
            return "any";
        }
        return getName(type);
    }
    // if (typeof value === "string") {
    //   return "string";
    // } else if (typeof value === "number") {
    //   return "number";
    // }else if (typeof
}
const isPlainObject = (value) => (value === null || value === void 0 ? void 0 : value.constructor) === Object;
function childObjects(props, callback) {
    const { obj, name, tabCount = 1, options } = props;
    let thisList = {};
    let thisObject = {};
    let printedObject = "";
    const printedSpace = repeatTab(tabCount);
    if (obj) {
        for (const [key, value] of Object.entries(obj)) {
            let newName = name ? `${name}.${key}` : key;
            const type = getType(value);
            const printedName = `${printedSpace}${key}${(options === null || options === void 0 ? void 0 : options.optional) ? "?" : ""}`;
            if (isPlainObject(value)) {
                // Recurse
                // newObject.push(newName);
                let newChild = childObjects({
                    obj: value,
                    name: newName,
                    tabCount: tabCount + 1,
                    options,
                }, callback);
                /* this is object without values */
                thisList[newName] = type;
                thisList = Object.assign(Object.assign({}, thisList), newChild.list);
                thisObject[key] = newChild.obj;
                printedObject += `${printedName}: {\n${newChild.po}${printedSpace}}\n`;
            }
            else {
                thisList[newName] = type;
                thisObject[key] = type;
                printedObject += `${printedName}: ${type}${Array.isArray(value) ? "[]" : ""};\n`;
            }
        }
    }
    return {
        obj: thisObject,
        list: thisList,
        po: printedObject,
    };
}
/**
 * Additional options
 * @typedef {Object} Options
 * @property {boolean} [optional=false] - mark all keys as optional
 * @property {string} something else
 */
/**
 * Converts json object to TypeScript interface, class and jsDoc
 *
 *
 * @param {*} json Object to be converted into class or interface or jsDoc
 * @param {Options} options - additional options]
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
    let cleanObject = childObjects({ obj: json, options: allOptions });
    console.log("--------------------");
    console.log(cleanObject.list);
    console.log("--------------------");
    const name = getName("node");
    // let interfaceName = `I${name}`;
    let tmp = `${name} {\n`;
    let interfaceStr = `interface I${tmp}${cleanObject.po}}\n`;
    let classStr = `class ${tmp}`;
    let jsDoc = `/**\n * @type ${name}\n *\n`;
    const classSpaces = repeatTab(2);
    const classSpacesParams = repeatTab(3);
    classStr += cleanObject.po;
    classStr += `\n${classSpaces}constructor(_props: any){\n`;
    // console.log("cleanObject", cleanObject);
    // cleanObject.arr.forEach((str: string)=>{
    // })
    for (const [key, value] of Object.entries(cleanObject.list)) {
        jsDoc += ` * @property {${value}${allOptions.optional ? "=" : ""}} ${key} - \n`;
        let elseStr = "";
        if (String(value).toLowerCase() === "object") {
            elseStr = " || {}";
        }
        let constructorKey = key.replace(".", "?.");
        classStr += `${classSpacesParams}this.${constructorKey} = _props.${constructorKey}${elseStr}\n`;
    }
    for (const [key, value] of Object.entries(cleanObject.obj)) {
        tmp = ` ${key}${allOptions.optional ? "?" : ""}: ${value};\n`;
    }
    classStr += `${classSpaces}}\n`;
    // classStr += `\nconstructor(_props: any){
    // let _fields = ${JSON.stringify(fields.keys)}
    //   if(_props){
    //     for(const f of _fields){
    //       this[f  as keyof this] = _props[f]
    //     }
    //   }
    // }`;
    tmp = `}\n`;
    classStr += tmp;
    jsDoc += ` *
 * @example
 *
 */
      `;
    // console.log("interfaceStr", interfaceStr);
    return { interface: interfaceStr, class: classStr, jsDoc: jsDoc };
}
exports.jsonToTS = jsonToTS;
exports.default = jsonToTS;
