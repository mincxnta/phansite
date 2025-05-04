
export const Table = ({ headers, rows }) => {
    const skewAngles = [15, 20, 10, 25];

    return (
        <div className="w-full max-w-[90%]">
            <table className="w-full table-auto border-collapse">
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th
                                key={index}
                                className={`bg-white text-black py-2 text-lg md:text-xl ${`-skew-x-${skewAngles[index % skewAngles.length]
                                    }`}`}
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className={`${rowIndex % 2 === 0 ? 'bg-black/50' : 'bg-gray-400/50'
                                } text-white text-base md:text-lg`}
                        >
                            {row.map((cell, cellIndex) => (
                                <td
                                    key={cellIndex}
                                    className="px-4 py-3 text-center"
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