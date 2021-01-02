import { readFileSync } from "fs";
import { ClassDeclaration } from "../src/declarations/ClassDeclaration";
import { DeclarationVisibility } from "../src/declarations/DeclarationVisibility";
import { FunctionDeclaration } from "../src/declarations/FunctionDeclaration";
import { InterfaceDeclaration } from "../src/declarations/InterfaceDeclaration";
import { Resource } from "../src/resources/Resource";
import { TypescriptParser } from "../src/TypescriptParser";
import { getWorkspaceFile } from "./testUtilities";

describe("TypescriptParser", () => {
    let parser: TypescriptParser;

    beforeEach(() => {
        parser = new TypescriptParser();
    });

    describe("Declaration parsing", () => {
        describe("Enums", () => {
            const file = getWorkspaceFile("typescript-parser/enum.ts");
            let parsed: Resource;

            beforeEach(async () => {
                const source: string = readFileSync(file).toString();
                parsed = await parser.parseSource(source);
            });

            it("should parse a file", () => {
                expect(parsed.declarations).toHaveLength(2);
            });
        });

        describe("Type aliases", () => {
            const file = getWorkspaceFile("typescript-parser/typeAlias.ts");
            let parsed: Resource;

            beforeEach(async () => {
                const source: string = readFileSync(file).toString();
                parsed = await parser.parseSource(source);
            });

            it("should parse a file", () => {
                expect(parsed.declarations).toHaveLength(2);
            });
        });

        describe("Functions", () => {
            const file = getWorkspaceFile("typescript-parser/function.ts");
            let parsed: Resource;

            beforeEach(async () => {
                const source: string = readFileSync(file).toString();
                parsed = await parser.parseSource(source);
            });

            it("should parse a file", () => {
                expect(parsed.declarations).toHaveLength(4);
            });

            it("should parse return types correctly", () => {
                expect((parsed.declarations[0] as FunctionDeclaration).type).toBe("string");
                expect((parsed.declarations[1] as FunctionDeclaration).type).toBe("void");
                expect((parsed.declarations[2] as FunctionDeclaration).type).toBeUndefined();
            });

            it("should parse a typeguard correctly", () => {
                expect((parsed.declarations[3] as FunctionDeclaration).type).toBe("str is number");
            });
        });

        describe("Variables", () => {
            const file = getWorkspaceFile("typescript-parser/variable.ts");
            let parsed: Resource;

            beforeEach(async () => {
                const source: string = readFileSync(file).toString();
                parsed = await parser.parseSource(source);
            });

            it("should parse a file", () => {
                expect(parsed.declarations).toHaveLength(7);
            });
        });

        describe("Interfaces", () => {
            const file = getWorkspaceFile("typescript-parser/interface.ts");
            let parsed: Resource;

            beforeEach(async () => {
                const source: string = readFileSync(file).toString();
                parsed = await parser.parseSource(source);
            });

            it("should parse a file", () => {
                expect(parsed.declarations).toHaveLength(6);
            });

            it("should parse the returntype of a method", () => {
                const parsedInterface = parsed.declarations[0] as InterfaceDeclaration;

                expect(parsedInterface.methods[0].type).toBeUndefined();
                expect(parsedInterface.methods[1].type).toBe("void");
            });

            it("should parse the type of a property", () => {
                const parsedInterface = parsed.declarations[1] as InterfaceDeclaration;

                expect(parsedInterface.properties[0].type).toBe("string");
                expect(parsedInterface.properties[1].type).toBe("number");
            });

            it("should parse a generic interface", () => {
                const parsedInterface = parsed.declarations[2] as InterfaceDeclaration;

                expect(parsedInterface.typeParameters).toContain("T");
            });

            it("should parse a generic interface with multiple type params", () => {
                const parsedInterface = parsed.declarations[3] as InterfaceDeclaration;

                expect(parsedInterface.typeParameters).toContain("TIn");
                expect(parsedInterface.typeParameters).toContain("TOut");
                expect(parsedInterface.typeParameters).toContain("TError");
            });
        });

        describe("Classes", () => {
            const file = getWorkspaceFile("typescript-parser/class.ts");
            let parsed: Resource;

            beforeEach(async () => {
                const source: string = readFileSync(file).toString();
                parsed = await parser.parseSource(source);
            });

            it("should parse a file", () => {
                expect(parsed.declarations).toHaveLength(10);
            });

            it("should parse the returntype of a method", () => {
                const parsedClass = parsed.declarations[0] as ClassDeclaration;

                expect(parsedClass.methods[0].type).toBeUndefined();
                expect(parsedClass.methods[1].type).toBe("void");
            });

            it("should parse the type of a property", () => {
                const parsedClass = parsed.declarations[2] as ClassDeclaration;

                expect(parsedClass.properties[0].type).toBe("string");
            });

            it("should parse the type of a constructor introduced property", () => {
                const parsedClass = parsed.declarations[1] as ClassDeclaration;

                expect(parsedClass.properties[0].type).toBe("string");
            });

            it("should parse a methods visibility", () => {
                const parsedClass = parsed.declarations[1] as ClassDeclaration;

                expect(parsedClass.methods[0].visibility).toBe(DeclarationVisibility.Public);
            });

            it("should parse a generic class", () => {
                const parsedClass = parsed.declarations[3] as ClassDeclaration;

                expect(parsedClass.typeParameters).toContain("T");
            });

            it("should parse a generic class with multiple type params", () => {
                const parsedClass = parsed.declarations[4] as ClassDeclaration;

                expect(parsedClass.typeParameters).toContain("TIn");
                expect(parsedClass.typeParameters).toContain("TOut");
                expect(parsedClass.typeParameters).toContain("TError");
            });
        });

        describe("Modules", () => {
            const file = getWorkspaceFile("typescript-parser/module.ts");
            let parsed: Resource;

            beforeEach(async () => {
                const source: string = readFileSync(file).toString();
                parsed = await parser.parseSource(source);
            });

            it("should parse a file", () => {
                expect(parsed.resources).toHaveLength(2);
            });
        });
    });

    describe("Usage parsing", () => {
        const file = getWorkspaceFile("typescript-parser/usagesOnly.ts");
        let parsed: Resource;

        beforeEach(async () => {
            const source: string = readFileSync(file).toString();
            parsed = await parser.parseSource(source);
        });

        it("should parse decorator usages", () => {
            const usages = parsed.usages;

            expect(usages).toContain("ClassDecorator");
            expect(usages).toContain("PropertyDecorator");
            expect(usages).toContain("FunctionDecorator");
            expect(usages).toContain("ParamDecorator");
        });

        it("should parse class member", () => {
            const usages = parsed.usages;

            expect(usages).toContain("notInitializedProperty");
            expect(usages).toContain("typedProperty");
        });

        it("should parse class member types", () => {
            const usages = parsed.usages;

            expect(usages).toContain("TypedPropertyRef");
        });

        it("should parse class member assignment", () => {
            const usages = parsed.usages;

            expect(usages).toContain("AssignedProperty");
        });

        it("should parse params", () => {
            const usages = parsed.usages;

            expect(usages).toContain("param");
        });

        it("should parse param default assignment", () => {
            const usages = parsed.usages;

            expect(usages).toContain("DefaultParam");
        });

        it("should parse return value", () => {
            const usages = parsed.usages;

            expect(usages).toContain("ReturnValue");
        });

        it("should parse property access", () => {
            const usages = parsed.usages;

            expect(usages).toContain("PropertyAccess");
        });

        it("should not parse sub properties of accessed properties", () => {
            const usages = parsed.usages;

            expect(usages).not.toContain("To");
            expect(usages).not.toContain("My");
            expect(usages).not.toContain("Foobar");
        });

        it("should parse function call", () => {
            const usages = parsed.usages;

            expect(usages).toContain("functionCall");
            expect(usages).toContain("MyProperty");
        });

        it("should parse indexer access", () => {
            const usages = parsed.usages;

            expect(usages).toContain("Indexing");
        });

        it("should parse variable assignment", () => {
            const usages = parsed.usages;

            expect(usages).toContain("AssignmentToVariable");
        });

        it("should parse nested identifier", () => {
            const usages = parsed.usages;

            expect(usages).toContain("NestedBinaryAssignment");
        });

        it("should parse a global (file level) used function", () => {
            const usages = parsed.usages;

            expect(usages).toContain("globalFunction");
        });

        it("should parse a global extended class", () => {
            const usages = parsed.usages;

            expect(usages).toContain("DefaultClass");
        });

        it("should parse a generic identifier in a class extension", () => {
            const usages = parsed.usages;

            expect(usages).toContain("GenericType");
        });

        it("should parse a default exported element", () => {
            const usages = parsed.usages;

            expect(usages).toContain("defaultExportUsage");
        });

        it("should parse an indexer property", () => {
            const usages = parsed.usages;

            expect(usages).toContain("indexedUsage");
        });

        it("should parse an indexer property access", () => {
            const usages = parsed.usages;

            expect(usages).toContain("indexingUsage");
        });
    });

    describe("TSX Usage parsing", () => {
        const file = getWorkspaceFile("typescript-parser/usagesOnly.tsx");
        let parsed: Resource;

        beforeEach(async () => {
            const source: string = readFileSync(file).toString();
            parsed = await parser.parseSource(source);
        });

        it("should parse a tsx element usage", () => {
            const usages = parsed.usages;

            expect(usages).toContain("myComponent");
            expect(usages).toContain("div");
            expect(usages).toContain("complexComp");
            expect(usages).toContain("SingleComp");
        });

        it("should parse functions inside {}", () => {
            const usages = parsed.usages;

            expect(usages).toContain("myFunc");
        });

        it("should parse component functions inside {}", () => {
            const usages = parsed.usages;

            expect(usages).toContain("MyFunc");
        });

        it("should parse a component inside a map", () => {
            const usages = parsed.usages;

            expect(usages).toContain("AnotherComp");
            expect(usages).toContain("foobarVariable");
        });

        it("should parse a function inside a map", () => {
            const usages = parsed.usages;

            expect(usages).toContain("myFunc");
        });
    });
});
