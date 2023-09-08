import { Row, Table, flexRender } from '@tanstack/react-table';

export default function BasicTable({
	table,
	caption,
	handleRowClick,
	handleRowDoubleClick,
}: {
	table: Table<any>;
	caption?: string;
	handleRowClick?: (row: Row<any>) => void;
	handleRowDoubleClick?: (row: Row<any>) => void;
}) {
	return (
		<table style={{ width: '100%' }}>
			{caption && <caption>{caption}</caption>}
			<thead>
				{table.getHeaderGroups().map((headerGroup) => (
					<tr key={headerGroup.id}>
						{headerGroup.headers.map((header, index) => (
							<th key={header.id + index}>
								{flexRender(header.column.columnDef.header, header.getContext())}
							</th>
						))}
					</tr>
				))}
			</thead>
			<tbody>
				{table.getRowModel().rows.map((row) => (
					<tr
						key={row.id}
						onClick={() => handleRowClick && handleRowClick(row)}
						onDoubleClick={() => handleRowDoubleClick && handleRowDoubleClick(row)}
					>
						{row.getVisibleCells().map((cell, index) => (
							<td key={cell.id + index}>
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
}
