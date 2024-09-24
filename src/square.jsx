/* eslint-disable */
import React from 'react';

function Square({grid , index , onClick}) {






    return (
    <>
        <div className="square" onClick={e => onClick(index)}>
            {grid[index] == 1 ? "X" : null}
            {grid[index] == 2 ? "O" : null}
        </div>
    </>
    );
}

export default Square;