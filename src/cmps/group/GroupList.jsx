import { AddGroupBtn } from "./AddGroupBtn";
import { GroupPreview } from "./GroupPreview";

export function GroupList({ board, onAddNewGroup, onAddTask, onSetIsOpenTaskDetails }) {

    const { groups } = board

    return (
        <section className='groups-list-container'>
            <ul className="groups-list">
                {groups.map((group) => (
                    <li key={group.id}>
                        <GroupPreview 
                        board={board} 
                        group={group} 
                        onAddTask={onAddTask}
                        onSetIsOpenTaskDetails={onSetIsOpenTaskDetails} />
                    </li>
                ))}
            </ul>
            <AddGroupBtn onAddNewGroup={onAddNewGroup} />
        </section>
    )
}
