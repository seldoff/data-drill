import {useSelector} from '../redux/store';
import {ResultTable} from './ResultTable';

export function SelectedNodeResultTable() {
    const selectedNode = useSelector(s => s.ui.selectedNode);
    return selectedNode !== undefined ? (
        <ResultTable nodeId={selectedNode} />
    ) : (
        <span className="error-msg">Please select node</span>
    );
}
