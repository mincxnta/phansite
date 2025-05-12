
export const Table = ({ headers, rows }) => {
    //const skewAngles = [15, 20, 10, 25];

    const getSkewClass = (index) => {
        const skewClasses = ['-skew-x-15', '-skew-x-20', '-skew-x-10', '-skew-x-15', '-skew-x-20', '-skew-x-10',];
        return skewClasses[index] || '';
    };


    return (
        <div className="w-full max-w-[90%] min-h-[33vh]">
            <table className="w-full table-auto border-collapse">
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
                                } text-white text-base md:text-xl`}
                        >
                            {row.map((cell, cellIndex) => (
                                <td
                                    key={cellIndex}
                                    className="px-4 py-3 text-center max-w-[25vw] break-words"
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