import React from 'react'
import './Modal.css'

const Modal = ({active, setActive, children, closeOnOverlay = true}) => {
    return (
        <div className={active ? 'modal active' : 'modal'} onClick={() => {
            if (closeOnOverlay) setActive(false)
        }}>
            <div className={active ? 'modal-content active' : 'modal-content'} onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}
export default Modal
