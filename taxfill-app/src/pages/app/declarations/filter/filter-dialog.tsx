import { DeclarationStatus } from '@/interfaces/enums/declaration-status';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input as BaseInput } from '@/components/ui/input';
import { Select as BaseSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import React, { forwardRef } from 'react';

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

const filterDialogForm = z.object({
  year: z
    .number()
    .nullable()
    .optional()
    .refine((val) => val?.toString().length === 4, {
      message: 'O ano deve ter exatamente 4 dígitos',
    }),
  status: z.nativeEnum(DeclarationStatus).nullable().optional(),
});

type FilterDialogForm = z.infer<typeof filterDialogForm>;

interface FilterDialogProps {
  open: boolean;
  onClose: () => void;
  onApply: (year?: number, status?: DeclarationStatus) => void;
}

export function FilterDialog({ open, onClose, onApply }: Readonly<FilterDialogProps>) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FilterDialogForm>();

  const onSubmit = (data: FilterDialogForm) => {
    onApply(data.year ?? undefined, data.status ?? undefined);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Consultar declarações</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2 mb-4">
            <Label htmlFor="year">Ano</Label>
            <Controller
              name="year"
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <Input
                  id="year"
                  type="number"
                  {...field}
                  value={field.value ?? 0}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || null)}
                />
              )}
            />
            {errors.year && <p className="text-red-500">{errors.year.message}</p>}
          </div>
          <div className="space-y-2 mb-4">
            <Label htmlFor="status">Status</Label>
            <Controller
              name="status"
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <Select
                  value={field.value ?? undefined}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">TODOS</SelectItem>
                    {Object.entries(DeclarationStatus).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && <p className="text-red-500">{errors.status.message}</p>}
          </div>
          <div className="flex space-x-2">
            <Button onClick={onClose} className="mr-2" type="button">
              Cancelar
            </Button>
            <Button type="submit" color="primary">
              Aplicar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}