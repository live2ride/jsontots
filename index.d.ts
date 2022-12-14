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
export declare function jsonToTS(json: any, options?: IOptions): IjsonToTS;
export default jsonToTS;
