import * as fs from 'fs-extra';
import * as ts from 'typescript';
import { getFilename } from './file.service';

/**
 * Service for operations on TreeNode elements relative to a given node in Abstract Syntax TreeNode (AST)
 */
export class Ast {


    /**
     * Gets the typescript SourceFile of a given file
     * @param path // The absolute path of the file
     */
    static getSourceFile(path: string): ts.SourceFile {
        return ts.createSourceFile(getFilename(path), fs.readFileSync(path, 'utf-8'), ts.ScriptTarget.Latest);
    }


    /**
     * Gets the type of a node in the AST (MethodDeclaration, IfStatement, ...)
     * @param node // The node in the AST
     */
    static getType(node: ts.Node): string {
        return node ? ts.SyntaxKind[node.kind] : '';
    }


    /**
     * Gets the name of the method of a node with type = MethodDeclaration
     * @param node // The AST node
     */
    static getMethodName(node: ts.Node): string {
        if (Ast.isFunctionOrMethod(node)) {
            return node?.['name']?.['escapedText'] ?? '';
        } else {
            return '';
        }
    }


    // ------------------------------------------------------------------------------------------------
    // -------------------------------------   TYPE CHECKS   ------------------------------------------
    // ------------------------------------------------------------------------------------------------


    /**
     * Checks if an AST node is a Parameter
     * @param node // The AST node
     */
    static isCallExpression(node: ts.Node): boolean {
        return node?.kind === ts.SyntaxKind.CallExpression ?? false;
    }


    /**
     * Checks if an AST node is a Parameter
     * @param node // The AST node
     */
    static isParam(node: ts.Node): boolean {
        return node?.kind === ts.SyntaxKind.Parameter ?? false;
    }


    /**
     * Checks if an AST node is a BinaryExpression
     * @param node // The AST node
     */
    static isBinary(node: ts.Node): boolean {
        return node?.kind === ts.SyntaxKind.BinaryExpression ?? false;
    }


    /**
     * Checks if an AST node is a logic door (ie : || or &&)
     * @param node // The AST node to check
     */
    static isLogicDoor(node: ts.Node): boolean {
        return (node?.['operatorToken']?.kind === ts.SyntaxKind.AmpersandAmpersandToken
            || node?.['operatorToken']?.kind === ts.SyntaxKind.BarBarToken)
            ?? false;
    }


    /**
     * Checks if an AST node is "||" anf if this node is between two binary expressions
     * @param node
     */
    static isOrTokenBetweenBinaries(node: ts.Node): boolean {
        return (node?.['operatorToken']?.kind === ts.SyntaxKind.BarBarToken
            && node?.['left']?.kind === ts.SyntaxKind.BinaryExpression
            && node?.['right']?.kind === ts.SyntaxKind.BinaryExpression)
            ?? false;
    }


    /**
     * Checks if two AST nodes have the same type
     * @param firstNode   // The first AST node
     * @param secondNode  // The second AST node
     */
    static isSameOperatorToken(firstNode: ts.Node, secondNode: ts.Node): boolean {
        return firstNode?.['operatorToken']?.kind === secondNode?.['operatorToken']?.kind ?? false;
    }


    /**
     * Checks if an AST node is a function or a method
     * @param node
     */
    static isFunctionOrMethod(node: ts.Node): boolean {
        return node?.kind === ts.SyntaxKind.MethodDeclaration || node?.kind === ts.SyntaxKind.FunctionDeclaration || false;
    }


    /**
     * Checks if an AST node is a Block which is a "else"
     * @param node      // The node to analyse
     */
    static isElseStatement(node: ts.Node): boolean {
        return (Ast.isBlock(node)
            && node?.parent?.kind === ts.SyntaxKind.IfStatement
            && node?.parent['elseStatement']?.pos === node?.pos);
    }


    /**
     * Checks if an AST node is a IfStatement which is an "else if"
     * @param node      // The node to analyse
     */
    static isElseIfStatement(node: ts.Node): boolean {
        return (node?.kind === ts.SyntaxKind.IfStatement && node?.parent?.kind === ts.SyntaxKind.IfStatement);
    }


    /**
     * Checks if an AST node is a Block which is a "else"
     * @param node      // The node to analyse
     */
    static isBlock(node: ts.Node): boolean {
        return (node?.kind === ts.SyntaxKind.Block);
    }


    /**
     * Checks if an AST node is an array of array, ie if it's an ElementAccessExpression which is the first son of another ElementAccessExpression
     * @param node      // The node to analyse
     */
    static isArrayOfArray(node: ts.Node): boolean {
        return(node?.parent?.kind === ts.SyntaxKind.ElementAccessExpression && node?.kind === ts.SyntaxKind.ElementAccessExpression && node?.pos === node.parent['expression'].pos);
    }


    /**
     * Checks if an AST node is an index of an array, ie if it's a Node which is the second son of an ElementAccessExpression
     * @param node      // The node to analyse
     */
    static isArrayIndex(node: ts.Node): boolean {
        return(node?.parent?.kind === ts.SyntaxKind.ElementAccessExpression && node?.pos === node.parent['argumentExpression'].pos);
    }


    /**
     * Checks if an AST node is an index of an array, ie if it's a Node which is the second son of an ElementAccessExpression
     * @param node      // The node to analyse
     */
    static isMethodIdentifier(node: ts.Node): boolean {
        return(Ast.isCallExpression(node.parent) && node?.pos === node.parent?.pos);
    }


    /**
     * Returns true when the AST node is a logic door succeeding to a different logic door
     * a && b && c => returns false
     * a && b || c => returns true
     * (a && b) || c => returns false because of the brackets
     * @param node      // The node to analyse
     */
    static isDifferentLogicDoor(node: ts.Node): boolean {
        if (Ast.isBinary(node) && Ast.isLogicDoor(node)) {
            if (Ast.isBinary(node.parent)
                && !Ast.isSameOperatorToken(node, node.parent)
                && !Ast.isOrTokenBetweenBinaries(node)
            ) {
               return true;
            }
        }
        return false;
    }

}
