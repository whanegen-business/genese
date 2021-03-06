import { CpxFactors } from '../cpx-factor/cpx-factors.model';
import { NestingCpx } from '../cpx-factor/nesting-cpx.model';
import { TreeNode } from '../tree/tree-node.model';
import { addObjects } from '../../services/tools.service';
import { Ast } from '../../services/ast.service';
import { DepthCpx } from '../cpx-factor/depth-cpx.model';

/**
 * A line of a Code object
 */
export class CodeLine {

    cpxFactors?: CpxFactors = new CpxFactors();             // The complexity factors relative to this line (breakFlows, increments,...)
    issue ?= 0;                                             // The number of the line in its Code parentFunction (method)
    position ?= 0;                                          // The position (in number of characters) of the start of the line
    text ?= '';                                             // The text of the line
    treeNodes?: TreeNode[] = [];


    /**
     * Sets the nesting complexity to this CodeLine
     */
    setDepthAndNestingCpx(): void {
        this.cpxFactors.nesting = new NestingCpx();
        this.cpxFactors.depth = new DepthCpx();
        for (const treeNode of this.treeNodes) {
            if (treeNode.intrinsicNestingCpx > 0) {
                // console.log('KIND', Ast.getType(treeNode.node), 'NESTING', treeNode.parent?.cpxFactors?.nesting, 'DEPTH', treeNode.cpxFactors?.depth)
                this.cpxFactors.depth = addObjects(this.cpxFactors.depth, treeNode.cpxFactors?.depth);
                this.cpxFactors.nesting = addObjects(this.cpxFactors.nesting, treeNode.parent?.cpxFactors?.nesting);
            }
            if (treeNode.intrinsicDepthCpx > 0) {
                this.cpxFactors.depth = addObjects(this.cpxFactors.depth, treeNode.parent?.cpxFactors?.depth);
            }
        }
    }
}
