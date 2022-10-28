"use strict";

import { Options } from "body-parser";

/**
 * @interface IOptions
 *
 * @property {optional} boolean Mark all fields as optional
 */
interface IOptions {
  optional?: boolean;
}

interface IjsonToTS {
  interface: string;
  class: string;
  jsDoc: string;
}
function repeatTab(tabCount: number): string {
  let str = "";
  for (let i = 0; i < tabCount; i++) {
    str += `   `;
  }
  return str;
}
function getName(name: string) {
  name = name.toLowerCase();
  const tnArray = name.split("");
  tnArray[0] = tnArray[0].toUpperCase();
  return tnArray.join("");
}
function getType(value: any): string {
  const type = String(typeof value);
  if (["string", "number", "boolean"].includes(type)) {
    return type;
  } else {
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
const isPlainObject = (value: any) => value?.constructor === Object;
interface IChildObjects {
  obj: any;
  name?: string;
  tabCount?: number;
  options?: IOptions;
}
function childObjects(
  props: IChildObjects,
  callback?: CallableFunction
): { obj: any; list: any; po: string } {
  const { obj, name, tabCount = 1, options } = props;
  let thisList: any = {};
  let thisObject: any = {};
  let printedObject = "";
  const printedSpace = repeatTab(tabCount);

  if (obj) {
    for (const [key, value] of Object.entries(obj)) {
      let newName = name ? `${name}.${key}` : key;
      const type = getType(value);

      const printedName = `${printedSpace}${key}${
        options?.optional ? "?" : ""
      }`;
      if (isPlainObject(value)) {
        // Recurse

        // newObject.push(newName);
        let newChild: any = childObjects(
          {
            obj: value,
            name: newName,
            tabCount: tabCount + 1,
            options,
          },
          callback
        );

        /* this is object without values */
        thisList[newName] = type;
        thisList = { ...thisList, ...newChild.list };

        thisObject[key] = newChild.obj;
        printedObject += `${printedName}: {\n${newChild.po}${printedSpace}}\n`;
      } else {
        thisList[newName] = type;
        thisObject[key] = type;
        printedObject += `${printedName}: ${type}${
          Array.isArray(value) ? "[]" : ""
        };\n`;
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
export function jsonToTS(json: any, options?: IOptions): IjsonToTS {
  let allOptions: IOptions = {
    optional: false,

    ...(options || {}),
  };

  let cleanObject = childObjects({ obj: json, options: allOptions });
  console.log("--------------------");
  console.log(cleanObject.list);
  console.log("--------------------");

  const name = getName("yourClass");

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
    jsDoc += ` * @property {${value}${
      allOptions.optional ? "=" : ""
    }} ${key} - \n`;

    let elseStr = "";
    if (String(value).toLowerCase() === "object") {
      elseStr = " || {}";
    }
    let constructorKey = key.replace(".", "?.");
    classStr += `${classSpacesParams}this.${constructorKey} = _props?.${constructorKey}${elseStr}\n`;
  }
  for (const [key, value] of Object.entries(cleanObject.obj)) {
    tmp = ` ${key}${allOptions.optional ? "?" : ""}: ${value};\n`;
  }

  classStr += `${classSpaces}}\n`;

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
export default jsonToTS;
