import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Input as BaseInput } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select as BaseSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Deduction } from '@/interfaces/deduction';
import { DeductionType } from '@/interfaces/enums/deduction-type';
import { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash } from 'lucide-react';
import React, { forwardRef, useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

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

interface DeductionEditorProps {
  onClose: () => void;
  allowEdit?: boolean;
  deductions?: Deduction[];
  setDeductions: React.Dispatch<React.SetStateAction<Deduction[]>>;
}

const deductionForm = z.object({
  description: z.string().optional(),
  amount: z.number().nonnegative(),
  type: z.nativeEnum(DeductionType),
});

type DeductionForm = z.infer<typeof deductionForm>;

export function DeductionForm({ onClose, allowEdit, deductions: initialDeductions, setDeductions }: Readonly<DeductionEditorProps>) {
  const [deductions, setDeductionsState] = useState<Deduction[]>(initialDeductions || []);
  const [selectedDeduction, setSelectedDeduction] = useState<Deduction | undefined>(undefined);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<DeductionForm>();

  useEffect(() => {
    if (selectedDeduction) {
      setValue('description', selectedDeduction.description);
      setValue('amount', selectedDeduction.amount);
      setValue('type', selectedDeduction.type);
    }
  }, [selectedDeduction, setValue]);

  const addToList = (data: DeductionForm) => {
    if (selectedDeduction) {
      const updatedDeductions = deductions.map((deduction) =>
        deduction === selectedDeduction ? { ...deduction, ...data } : deduction
      );
      setDeductionsState(updatedDeductions);
    } else {
      const newDeduction: Deduction = {
        id: '',
        ...data,
      };
      setDeductionsState((prevDeductions) => [...prevDeductions, newDeduction]);
    }
    reset();
    setSelectedDeduction(undefined);
  };

  const save = () => {
    setDeductions(deductions);
    setSelectedDeduction(undefined);
    reset();
    onClose();
  };

  const handleEditRow = (deduction: Deduction) => {
    setSelectedDeduction(deduction);
  };

  const handleDelete = (deduction: Deduction) => {
    setDeductionsState((prevDeductions) => prevDeductions.filter((d) => d.id !== deduction.id));
  };

  const columns: ColumnDef<Deduction, unknown>[] = [
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
          <Label htmlFor="amount" className="block text-sm font-medium">Preço</Label>
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
                      {Object.entries(DeductionType).map(([key, value]) => (
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
            {selectedDeduction ? 'Salvar Alterações' : 'Adicionar à Lista'}
          </Button>
          {selectedDeduction && (
            <Button
              type="button"
              onClick={() => {
                reset();
                setSelectedDeduction(undefined);
              }}
              className="mt-2 mb-4 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Resetar
            </Button>
          )}
        </div>

        <div className="overflow-auto max-h-96">
          <DataTable columns={columns} data={deductions} />
        </div>

        <Button
          type="button"
          onClick={save}
          className="w-full mt-4 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          disabled={!allowEdit}
        >
          Salvar
        </Button>
      </form>
    </div>
  );
}