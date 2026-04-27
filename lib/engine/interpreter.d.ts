declare module "js-interpreter" {
  class Interpreter {
    constructor(code: string, initFunc?: (interpreter: any, scope: any) => void);
    step(): boolean;
    run(): boolean;
    stateStack: any[];
    value: any;
    getScope(): any;
    setProperty(obj: any, name: string, value: any): void;
    createObject(type: any): any;
    createNativeFunction(func: Function): any;
    createPrimitive(value: any): any;
  }
  export default Interpreter;
}
