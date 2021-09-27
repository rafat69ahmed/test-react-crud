import React from 'react'

const Container = ({ children, className = '', ...other }) => {
    return (
        <div className={'container ' + className} {...other}>
            {children}
        </div>
    )
}

export default Container
