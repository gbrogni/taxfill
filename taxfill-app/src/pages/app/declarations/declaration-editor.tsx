import React, { forwardRef, useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input as BaseInput } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IncomeForm } from './income-form';
import { Declaration } from '@/interfaces/declaration';
import { Search } from 'lucide-react';
import { DeductionForm } from './deduction-form';
import { Select as BaseSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DeclarationStatus } from '@/interfaces/enums/declaration-status';
import { Income } from '@/interfaces/income';
import { createDeclaration } from '@/api/create-declaration';
import { IncomeType } from '@/interfaces/enums/income-type';
import { DeductionType } from '@/interfaces/enums/deduction-type';
import { Deduction } from '@/interfaces/deduction';
import { isAuthenticated } from '@/context/auth';
import { redirect } from 'react-router-dom';
import { toast } from 'sonner';
import { updateDeclaration } from '@/api/update-declaration';

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

interface DeclarationEditorProps {
  onClose: () => void;
  declaration?: Declaration;
}

const declarationForm = z.object({
  year: z.number().nonnegative(),
  description: z.string().optional(),
  incomes: z.array(z.object({
    id: z.string().optional(),
    description: z.string().optional(),
    amount: z.number().nonnegative(),
    type: z.nativeEnum(IncomeType),
  })),
  deductions: z.array(z.object({
    id: z.string().optional(),
    description: z.string().optional(),
    amount: z.number().nonnegative(),
    type: z.nativeEnum(DeductionType),
  })),
  status: z.nativeEnum(DeclarationStatus),
});

type DeclarationForm = z.infer<typeof declarationForm>;

export function DeclarationEditor({ onClose, declaration }: Readonly<DeclarationEditorProps>) {
  const [incomesOpen, setIncomesOpen] = useState(false);
  const [deductionsOpen, setDeductionsOpen] = useState(false);
  const [incomes, setIncomes] = useState<Income[]>(declaration?.incomes || []);
  const [deductions, setDeductions] = useState<Deduction[]>(declaration?.deductions || []);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DeclarationForm>();

  useEffect(() => {
    if (declaration) {
      setValue('year', declaration.year);
      setValue('description', declaration.description);
      setValue('status', declaration.status);
      setIncomes(declaration.incomes);
      setDeductions(declaration.deductions);
    }
  }, [declaration, setValue]);

  useEffect(() => {
    setValue('incomes', incomes);
  }, [incomes, setValue]);

  useEffect(() => {
    setValue('deductions', deductions);
  }, [deductions, setValue]);

  const onSubmit = async (data: DeclarationForm) => {
    const token: string | undefined = isAuthenticated();
    if (!token) {
      redirect('/auth/sign-in');
      return;
    }
    const mappedIncomes: Income[] = data.incomes.map((income) => ({
      ...income,
      id: income.id ?? (incomes.findIndex(i => i.id === income.id) + 1).toString(),
    }));
    const mappedDeductions: Deduction[] = data.deductions.map((deduction) => ({
      ...deduction,
      id: deduction.id ?? (deductions.findIndex(d => d.id === deduction.id) + 1).toString(),
    }));
    try {
      if (declaration) {
        await updateDeclaration({
          id: declaration.id,
          year: data.year,
          description: data.description ?? '',
          status: data.status,
          incomes: mappedIncomes,
          deductions: mappedDeductions,
          taxDue: 0,
          taxRefund: 0,
        }, token);
        toast.success('Declaração atualizada com sucesso');
      } else {
        await createDeclaration({
          year: data.year,
          status: data.status,
          incomes: mappedIncomes,
          deductions: mappedDeductions,
          taxDue: 0,
          taxRefund: 0,
        }, token);
        toast.success('Declaração salva com sucesso');
      }
      onClose();
    } catch (error) {
      console.error('Failed to save declaration', error);
    }
  };

  const handleCloseIncomesEditorModal = () => {
    setIncomesOpen(false);
  };

  const handleCloseDeductionsEditorModal = () => {
    setDeductionsOpen(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="description" className="block text-sm font-medium">Descrição</Label>
          <Input id="description" {...register('description')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        </div>

        <div>
          <Label htmlFor="year" className="block text-sm font-medium">Ano</Label>
          <Input id="year" type="number" {...register('year', { required: true, valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
          {errors.year && <span className="text-red-500 text-xs">Este campo é obrigatório</span>}
        </div>

        <div>
          <Dialog open={incomesOpen} onOpenChange={setIncomesOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="w-full mt-4 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center">
                <Search className="mr-2" /> Editar rendimentos
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>{declaration ? 'Editar rendimento' : 'Criar rendimento'}</DialogTitle>
              <IncomeForm onClose={handleCloseIncomesEditorModal} incomes={incomes} setIncomes={setIncomes} />
              <DialogClose />
            </DialogContent>
          </Dialog>
        </div>

        <div>
          <Dialog open={deductionsOpen} onOpenChange={setDeductionsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="w-full mt-4 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center">
                <Search className="mr-2" /> Editar deduções
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>{declaration ? 'Editar dedução' : 'Criar dedução'}</DialogTitle>
              <DeductionForm onClose={handleCloseDeductionsEditorModal} deductions={deductions} setDeductions={setDeductions} />
              <DialogClose />
            </DialogContent>
          </Dialog>
        </div>

        <div>
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Controller
              control={control}
              name="status"
              rules={{ required: "O campo status é obrigatório" }}
              render={({ field }) => (
                <>
                  <Select {...field} onValueChange={val => field.onChange(val)} value={field.value}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(DeclarationStatus).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.status && <span className="text-red-500 text-xs">{errors.status.message}</span>}
                </>
              )}
            />
          </div>
        </div>

        <Button
          type="submit"
          className={`w-full mt-4 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md ${Object.keys(errors).length > 0 ? 'bg-gray-400 hover:bg-gray-400' : 'bg-green-600 hover:bg-green-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
          disabled={Object.keys(errors).length > 0}
        >
          Salvar
        </Button>
      </form>
    </div>
  );
}