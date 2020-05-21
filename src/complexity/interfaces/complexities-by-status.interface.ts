import { RepartitionByStatus } from '../models/statuses.model';
import { Addition } from './add.interface';

/**
 * Repartition by status for each kind of complexity
 */
export class ComplexitiesByStatus implements Addition<ComplexitiesByStatus> {

    cognitive?: RepartitionByStatus = new RepartitionByStatus();
    cyclomatic?: RepartitionByStatus = new RepartitionByStatus();


    /**
     * Adds other cognitive and cyclomatic complexities
     * @param cpxByStatus
     */
    add(cpxByStatus: ComplexitiesByStatus): ComplexitiesByStatus {
        if (!cpxByStatus) {
            return new ComplexitiesByStatus();
        }
        const result: ComplexitiesByStatus = new ComplexitiesByStatus();
        result.cognitive = result.cognitive.add(cpxByStatus.cognitive);
        result.cyclomatic = result.cyclomatic.add(cpxByStatus.cyclomatic);
        return result;
    }

}