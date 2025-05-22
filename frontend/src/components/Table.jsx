
export const Table = ({ headers, rows }) => {
    const getSkewClass = (index) => {
        const skewClasses = ['-skew-x-15', '-skew-x-20', '-skew-x-10', '-skew-x-15', '-skew-x-20', '-skew-x-10',];
        return skewClasses[index] || '';
    };


    return (
        //TODO Si añadimos el scroll, se recortan los headers
        <div className="w-[90%] sm:w-full sm:max-w-[90%] min-h-[33vh] overflow-x-auto sm:overflow-x-hidden">
            <table className="w-full table-auto border-collapse ">
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th>
                                <div
                                    key={index}
                                    className={`bg-white text-black py-2 text-lg md:text-xl font-header ${getSkewClass(index)}
                                ${index > 0 ? 'ml-[.5rem]' : ''} ${index < headers.length - 1 ? 'mr-[.5rem]' : ''}`}
                                >
                                    {header}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className={`${rowIndex % 2 === 0 ? 'bg-black/70' : 'bg-table-grey/90'
                                } text-white text-base md:text-xl `}
                        >
                            {row.map((cell, cellIndex) => (
                                <td
                                    key={cellIndex}
                                    className="px-4 py-3 text-center max-w-[50vw] sm:max-w-[25vw] break-words"
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};