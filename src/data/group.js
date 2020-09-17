import id from './group/id';
import visit from './group/visit';

export default function group() {
    const groups = {
        id: id.call(this),
        visit: visit.call(this),
    };

    return groups;
}
