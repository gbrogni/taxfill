import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Input as BaseInput } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select as BaseSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IncomeType } from '@/interfaces/enums/income-type';
import { Income } from '@/interfaces/income';
import { ColumnDef } from '@tanstack/react-table';
import React, { forwardRef, useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Trash, Pencil } from 'lucide-react';

const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => (
  <BaseInput {...props} ref={ref} />
));

const Select = forwardRef<HTMLDivElement, { value?: string; onValueChange?: (value: string) => void; children: React.ReactNode; }>(
  ({ value, onValueChange, children, ...props }, ref) => (
    <BaseSelect value={value} onValueChange={onValueChange}>
      <div ref={ref} {...props}>
        {children}
      </div>
    </BaseSelect>
  )
);

interface IncomeEditorProps {
  onClose: () => void;
  allowEdit?: boolean;
  incomes?: Income[];
  setIncomes: React.Dispatch<React.SetStateAction<Income[]>>;
}

const incomeForm = z.object({
  description: z.string().optional(),
  amount: z.number().nonnegative(),
  type: z.nativeEnum(IncomeType),
});

type IncomeForm = z.infer<typeof incomeForm>;

export function IncomeForm({ onClose, allowEdit, incomes: initialIncomes, setIncomes }: Readonly<IncomeEditorProps>) {
  const [incomes, setIncomesState] = useState<Income[]>(initialIncomes || []);
  const [selectedIncome, setSelectedIncome] = useState<Income | undefined>(undefined);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<IncomeForm>();

  useEffect(() => {
    if (selectedIncome) {
      setValue('description', selectedIncome.description);
      setValue('amount', selectedIncome.amount);
      setValue('type', selectedIncome.type);
    }
  }, [selectedIncome, setValue]);

  const addToList = (data: IncomeForm) => {
    if (selectedIncome) {
      setIncomesState((prevIncomes) =>
        prevIncomes.map((income) =>
          income.id === selectedIncome.id ? { ...income, ...data } : income
        )
      );
    } else {
      const newIncome: Income = {
        id: (incomes.length + 1).toString(), ...data,
      };
      setIncomesState((prevIncomes) => [...prevIncomes, newIncome]);
    }
    reset();
    setSelectedIncome(undefined);
  };

  const save = () => {
    setIncomes(incomes);
    setSelectedIncome(undefined);
    reset();
    onClose();
  };

  const handleEditRow = (income: Income) => {
    setSelectedIncome(income);
  };

  const handleDelete = (income: Income) => {
    setIncomesState((prevIncomes) => prevIncomes.filter((i) => i.id !== income.id));
  };

  const columns: ColumnDef<Income, unknown>[] = [
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
    },
    {
      accessorKey: 'type',
      header: 'Tipo',
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
    {
      id: 'delete',
      header: '',
      cell: ({ row }) => (
        <button onClick={() => handleDelete(row.original)}>
          <Trash className="w-4 h-4 text-red-500" />
        </button>
      ),
    },
  ];

  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div>
          <Label htmlFor="description" className="block text-sm font-medium">Descrição</Label>
          <Input id="description" {...register('description')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        </div>

        <div>
          <Label htmlFor="amount" className="block text-sm font-medium">Valor</Label>
          <Input id="amount" type="number" {...register('amount', { required: true, valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
          {errors.amount && <span className="text-red-500 text-xs">O campo valor é obrigatório</span>}
        </div>

        <div>
          <div className="grid gap-2">
            <Label htmlFor="type">Tipo</Label>
            <Controller
              control={control}
              name="type"
              rules={{ required: "O campo tipo é obrigatório" }}
              render={({ field }) => (
                <>
                  <Select {...field} onValueChange={val => field.onChange(val)} value={field.value}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(IncomeType).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && <span className="text-red-500 text-xs">{errors.type.message}</span>}
                </>
              )}
            />
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            type="button"
            onClick={handleSubmit(addToList)}
            className="mt-2 mb-4 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={Object.keys(errors).length > 0}
          >
            {selectedIncome ? 'Salvar Alterações' : 'Adicionar à Lista'}
          </Button>
          {selectedIncome && (
            <Button
              type="button"
              onClick={() => {
                reset();
                setSelectedIncome(undefined);
              }}
              className="mt-2 mb-4 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Resetar
            </Button>
          )}
        </div>

        <div className="overflow-auto max-h-96">
          <DataTable columns={columns} data={incomes} />
        </div>

        <Button
          type="button"
          onClick={save}
          className="w-full mt-4 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          disabled={!allowEdit}
        >
          Salvar
        </Button>
      </form >
    </div >
  );
}