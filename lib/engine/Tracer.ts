import Interpreter from "js-interpreter";
import * as Babel from "@babel/standalone";

export interface ExecutionSnapshot {
  line: number;
  column: number;
  scope: Record<string, any>;
  stack: string[];
  output: string[];
  type: string;
}

export class Tracer {
  private interpreter: Interpreter | null = null;
  private snapshots: ExecutionSnapshot[] = [];
  private currentOutput: string[] = [];
  private sourceCode: string = "";
  private transformedCode: string = "";

  constructor(code: string) {
    this.sourceCode = code;
    this.init(code);
  }

  private init(code: string) {
    this.currentOutput = [];
    this.snapshots = [];
    
    // Transpile ES6 to ES5 for JS-Interpreter
    try {
      const result = Babel.transform(code, {
        presets: ["env"],
        retainLines: true, // Crucial for mapping back to original line numbers
      });
      this.transformedCode = result.code || code;
    } catch (err) {
      console.error("Babel Transpilation Error:", err);
      this.transformedCode = code;
    }

    const initFunc = (interpreter: any, scope: any) => {
      // Intercept console.log
      const logWrapper = (...args: any[]) => {
        const formattedArgs = args.map(arg => this.serializeValue(arg, true)).join(" ");
        this.currentOutput.push(formattedArgs);
      };
      
      interpreter.setProperty(scope, "console", interpreter.createObject(interpreter.OBJECT));
      const consoleObj = interpreter.getProperty(scope, "console");
      interpreter.setProperty(consoleObj, "log", interpreter.createNativeFunction(logWrapper));
    };

    try {
      this.interpreter = new Interpreter(this.transformedCode, initFunc);
    } catch (err) {
      console.error("Interpreter Init Error:", err);
      this.interpreter = null;
    }
  }

  public trace(): ExecutionSnapshot[] {
    if (!this.interpreter) return [];

    let steps = 0;
    const maxSteps = 2000; // Increased limit

    while (this.interpreter.step() && steps < maxSteps) {
      const state = this.interpreter.stateStack[this.interpreter.stateStack.length - 1];
      if (state && state.node) {
        const node = state.node;
        const { line, column } = this.getLineColumn(node.start);
        
        const interestingTypes = [
          "VariableDeclaration", 
          "ExpressionStatement", 
          "ReturnStatement", 
          "IfStatement", 
          "ForStatement", 
          "WhileStatement",
          "FunctionDeclaration",
          "CallExpression"
        ];

        if (interestingTypes.includes(node.type)) {
          const snapshot = {
            line,
            column,
            scope: this.captureScope(),
            stack: this.captureStack(),
            output: [...this.currentOutput],
            type: node.type
          };

          // Basic de-duplication: don't add if the line and scope haven't changed from the last snapshot
          const last = this.snapshots[this.snapshots.length - 1];
          if (!last || last.line !== snapshot.line || JSON.stringify(last.scope) !== JSON.stringify(snapshot.scope) || last.output.length !== snapshot.output.length) {
            this.snapshots.push(snapshot);
          }
        }
      }
      steps++;
    }

    return this.snapshots;
  }

  private getLineColumn(offset: number) {
    const lines = this.transformedCode.slice(0, offset).split("\n");
    return {
      line: lines.length,
      column: lines[lines.length - 1].length + 1
    };
  }

  private captureScope(): Record<string, any> {
    if (!this.interpreter) return {};
    const scope: Record<string, any> = {};
    let currentScope = this.interpreter.getScope();
    
    while (currentScope) {
      const scopeObj = currentScope.object;
      if (scopeObj && scopeObj.properties) {
        for (const name in scopeObj.properties) {
          // Skip built-ins and internal names
          if (name === "window" || name === "console" || name === "Infinity" || name === "NaN" || name === "undefined") continue;
          
          const val = scopeObj.properties[name];
          if (scope[name] === undefined) {
            scope[name] = this.serializeValue(val);
          }
        }
      }
      currentScope = currentScope.parentScope;
    }
    return scope;
  }

  private captureStack(): string[] {
    if (!this.interpreter) return [];
    const stack: string[] = [];
    // Traverse the stateStack to find function calls
    for (let i = 0; i < this.interpreter.stateStack.length; i++) {
      const state = this.interpreter.stateStack[i];
      if (state.scope && state.scope.parentScope) {
        // This is likely a function scope
        const node = state.node;
        if (node.type === "FunctionDeclaration") {
          stack.push(node.id.name);
        } else if (node.type === "CallExpression") {
           const name = node.callee.name || "(anonymous)";
           stack.push(name);
        }
      }
    }
    return stack;
  }

  private serializeValue(val: any, forLog: boolean = false): any {
    if (val === null) return "null";
    if (val === undefined) return "undefined";
    
    // JS-Interpreter primitive wrappers
    if (typeof val === "object" && val.data !== undefined) {
      return val.data;
    }

    // JS-Interpreter objects
    if (typeof val === "object" && val.properties) {
      if (forLog) return "[Object]";
      
      const obj: Record<string, any> = {};
      for (const key in val.properties) {
        if (key === "window" || key === "console") continue;
        obj[key] = this.serializeValue(val.properties[key], true);
      }
      return obj;
    }

    return val;
  }
}
