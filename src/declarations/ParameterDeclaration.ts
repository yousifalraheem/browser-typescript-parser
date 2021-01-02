import { TypedDeclaration } from "./Declaration";

/**
 * Parameter declaration. Is contained in a method or function delaration since a parameter can not be exported
 * by itself.
 *
 * @export
 * @class ParameterDeclaration
 * @implements {TypedDeclaration}
 */
export class ParameterDeclaration implements TypedDeclaration {
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }
    public get type(): string | undefined {
        return this._type;
    }
    public set type(value: string | undefined) {
        this._type = value;
    }
    constructor(private _name: string, private _type: string | undefined, public start?: number, public end?: number) {}
}

export class BoundParameterDeclaration extends ParameterDeclaration {
    public parameters: ParameterDeclaration[] = [];
    public typeReference: string | undefined;

    public get name(): string {
        return this.parameters.length
            ? `${this.startCharacter} ${this.parameters.map((p) => p.name).join(", ")} ${this.endCharacter}`
            : this.startCharacter + this.endCharacter;
    }

    public set name(_: string) {}

    public get type(): string {
        return this.typeReference || this.parameters.length
            ? `{ ${this.parameters.map((p) => p.type).join(", ")} }`
            : this.startCharacter + this.endCharacter;
    }

    public set type(_: string) {}

    constructor(private startCharacter: string, private endCharacter: string, start?: number, end?: number) {
        super("", "", start, end);
    }
}

export class ObjectBoundParameterDeclaration extends BoundParameterDeclaration {
    constructor(start?: number, end?: number) {
        super("{", "}", start, end);
    }
}

export class ArrayBoundParameterDeclaration extends BoundParameterDeclaration {
    constructor(start?: number, end?: number) {
        super("[", "]", start, end);
    }
}
