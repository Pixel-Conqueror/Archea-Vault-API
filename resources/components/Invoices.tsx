import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import BasicTable from 'Components/BasicTable';
import { printDate } from 'Utils/index';
import { Stripe } from 'stripe';

const invoicesColumnHelper = createColumnHelper<any>();

export default function Invoices({ invoices }: { invoices: Array<Stripe.Invoice> }) {
	const invoicesTable = useReactTable({
		data: invoices,
		columns: [
			invoicesColumnHelper.accessor('id', {
				header: () => '#',
			}),
			invoicesColumnHelper.accessor('number', {
				header: () => 'Facture number',
			}),
			invoicesColumnHelper.accessor('hosted_invoice_url', {
				header: () => 'Stripe details',
				cell: (props) => (
					<a href={props.getValue()} target="_blank" rel="noreferrer">
						Click here to see the details
					</a>
				),
			}),
			invoicesColumnHelper.accessor('paid', {
				header: () => 'Status',
				cell: (props) => (props.getValue() ? 'Paied' : 'Not paied'),
			}),
			invoicesColumnHelper.accessor('total', {
				header: () => 'Price',
				cell: (props) => `${Number(props.getValue()) / 100} €`,
			}),
			invoicesColumnHelper.accessor('due_date', {
				header: () => 'Due date',
				cell: (props) => printDate(props.getValue() * 1000),
			}),
			invoicesColumnHelper.accessor('effective_at', {
				header: () => 'Effective date',
				cell: (props) => printDate(props.getValue() * 1000),
			}),
			invoicesColumnHelper.accessor('invoice_pdf', {
				header: () => 'Settings',
				cell: (props) => (
					<a href={props.getValue()} target="_blank" rel="noreferrer">
						Download invoice
					</a>
				),
			}),
		],
		getCoreRowModel: getCoreRowModel(),
	});

	return <BasicTable table={invoicesTable} />;
}
