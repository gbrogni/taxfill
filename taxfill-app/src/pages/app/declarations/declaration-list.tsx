import { useState } from 'react';
import { fetchDeclarations, FetchDeclarationsQuery } from '@/api/fetch-declarations';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { isAuthenticated } from '@/context/auth';
import { Declaration } from '@/interfaces/declaration';
import { DeclarationStatus } from '@/interfaces/enums/declaration-status';
import { ColumnDef } from '@tanstack/react-table';
import { redirect } from 'react-router-dom';
import { FilterDialog } from './filter/filter-dialog';
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DeclarationEditor } from './declaration-editor';
import { Pencil } from 'lucide-react';

export function DeclarationsList() {
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [open, setOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState<boolean>(false);
  const [selectedDeclaration, setSelectedDeclaration] = useState<Declaration | undefined>(undefined);

  const fetchDeclarationsFn = async (query: FetchDeclarationsQuery) => {
    try {
      const token: string | undefined = isAuthenticated();
      if (!token) {
        redirect('/auth/sign-in');
        return;
      }
      const fetchedDeclarations: Declaration[] = await fetchDeclarations(query, token);
      setDeclarations(fetchedDeclarations);
    } catch {
      console.error('Failed to fetch declarations');
    }
  };

  const handleApplyFilter = (year?: number, status?: DeclarationStatus) => {
    const query: FetchDeclarationsQuery = { year, status };
    fetchDeclarationsFn(query);
  };

  const handleCloseEditorModal = async () => {
    setOpen(false);
    setSelectedDeclaration(undefined);
    fetchDeclarationsFn({});
  };

  const handleEditRow = (declaration: Declaration) => {
    setSelectedDeclaration(declaration);
    setOpen(true);
  };

  const columns: ColumnDef<Declaration, unknown>[] = [
    {
      accessorKey: 'description',
      header: 'Descrição',
    },
    {
      accessorKey: 'year',
      header: 'Ano',
    },
    {
      accessorKey: 'taxDue',
      header: 'Imposto devido',
    },
    {
      accessorKey: 'taxRefund',
      header: 'Reembolso de imposto',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => DeclarationStatus[row.original.status as unknown as keyof typeof DeclarationStatus],
    },
    {
      id: 'edit',
      header: '',
      cell: ({ row }) => (
        <button onClick={() => handleEditRow(row.original)}>
          <Pencil className="w-4 h-4 text-blue-500" />
        </button>
      ),
    },
  ];

  return (
    <div className="flex-grow flex flex-col justify-between p-4 md:p-4">
      <div className="flex justify-between mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="self-start w-auto md:w-32">Adicionar</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>{selectedDeclaration ? 'Editar declaração' : 'Adicionar declaração'}</DialogTitle>
            <DeclarationEditor onClose={handleCloseEditorModal} declaration={selectedDeclaration} />
            <DialogClose />
          </DialogContent>
        </Dialog>
        <Button size="sm" className="self-end w-auto md:w-32" onClick={() => setFilterDialogOpen(true)}>Consultar</Button>
      </div>
      <div className="flex-grow w-full border border-gray-300 rounded-lg p-4 md:p-8 min-h-[300px]">
        <DataTable columns={columns} data={declarations} />
      </div>
      <FilterDialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        onApply={handleApplyFilter}
      />
    </div>
  );
}