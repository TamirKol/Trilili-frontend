import { ExitBtnSvg } from "../svg/ImgSvg";
import { EditLabel } from "./EditLabel";
import { FeatureAttachment } from "./FeatureAttachment";
import { FeatureLabels } from "./FeatureLabels";
import { useState, useEffect, useRef } from 'react'
import { DeleteLabel } from "./TaskFeatures/DeleteLabel";
import { FeatureMembers } from "./TaskFeatures/FeatureMembers";
import { FeatureChecklist } from "./FeatureChecklist";
import { useSelector } from 'react-redux'
import { updateBoardGroupTaskType, updateCmp } from "../../store/board.actions";

export function TaskFeatureDynamic() {

    const board = useSelector(storeState => storeState.boardModule.board)
    const group = useSelector(storeState => storeState.boardModule.group)
    const task = useSelector(storeState => storeState.boardModule.task)
    const cmp = useSelector(storeState => storeState.boardModule.cmp)

    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    const [componentHeight, setComponentHeight] = useState(0);
    const [screenDiff, setScreenDiff] = useState(0)


    useEffect(() => {

        const handleResize = () => {
            setScreenWidth(prevWidth => {
                setScreenDiff(prevWidth - window.innerWidth)
                return window.innerWidth
            })

            if (cmp.location) {
                updateCmp({ ...cmp, location: { ...cmp.location, left: cmp.location.left - (screenDiff) / 2 } })
            }

            setScreenHeight(window.innerHeight)
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [cmp])

    useEffect(() => {
        if (wrapperRef.current) {
            const height = wrapperRef.current.clientHeight;
            setComponentHeight(height);
        }
    }, [cmp.type]);

    function useClickOutsideCmp(ref) {
        useEffect(() => {

            document.addEventListener("mousedown", handleClickOutside)
            return () => {
                document.removeEventListener("mousedown", handleClickOutside)
            }
        }, [cmp])
    }

    function exitCmp() {
        updateBoardGroupTaskType(null, null, null, '', null)
    }

    const [labelIdToEdit, setLabelIdToEdit] = useState('')
    const wrapperRef = useRef(null);
    useClickOutsideCmp(wrapperRef);

    function onSetLabelIdToEdit(labelId) {
        setLabelIdToEdit(labelId)
    }

    function handleClickOutside(event) {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            exitCmp()
        }
    }
    

    if (!board || !group || !task || !cmp.type || !cmp.location || !cmp.location.top || !cmp.location.left) return <div></div>
    return (
        <div className="dynamic-overlay" onClick={handleClickOutside} >

            <div className="dynamic-feature-container"
                ref={wrapperRef}
                style={{
                    top: cmp.location.top + componentHeight > screenHeight ? screenHeight - componentHeight : cmp.location.top + 37,
                    left: cmp.location.left + 304 > screenWidth ? screenWidth - 304 : cmp.location.left
                }} >

                <p className="dyn-cmp-header">{cmp.type}</p>

                {cmp.type === 'Labels' &&
                    <FeatureLabels onSetLabelIdToEdit={onSetLabelIdToEdit} />}

                {(cmp.type === 'Edit label' || cmp.type === 'Add label') &&
                    <EditLabel labelIdToEdit={labelIdToEdit} />}

                {cmp.type === 'Delete Label' &&
                    <DeleteLabel labelIdToEdit={labelIdToEdit} />}

                {cmp.type === 'Attach' && <FeatureAttachment />}

                {cmp.type === 'Members' && <FeatureMembers />}

                {cmp.type === 'Add checklist' && <FeatureChecklist />}

                <div className="exit-btn" onClick={() => exitCmp()}>
                    <ExitBtnSvg />
                </div>
            </div>
        </div>
    )
}