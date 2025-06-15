
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Plus } from 'lucide-react';
import { Subcontractor, SubcontractorFormData } from '@/types/subcontractor';

const formSchema = z.object({
  name: z.string().min(1, 'Business name is required'),
  companyName: z.string().min(1, 'Company name is required'),
  representativeName: z.string().min(1, 'Representative name is required'),
  commercialRegistration: z.string().min(1, 'Commercial registration is required'),
  taxCardNo: z.string().min(1, 'Tax card number is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
});

interface SubcontractorFormProps {
  subcontractor?: Subcontractor;
  onSubmit: (data: SubcontractorFormData) => void;
  onCancel: () => void;
}

const availableTrades = [
  'Electrical', 'HVAC', 'Plumbing', 'Water Systems', 'Ventilation',
  'Concrete', 'Steel Works', 'Finishing', 'Interior Design', 'Painting',
  'Masonry', 'Roofing', 'Flooring', 'Landscaping'
];

export function SubcontractorForm({ subcontractor, onSubmit, onCancel }: SubcontractorFormProps) {
  const [selectedTrades, setSelectedTrades] = React.useState<string[]>(
    subcontractor?.trades || []
  );
  const [newTrade, setNewTrade] = React.useState('');

  const form = useForm<SubcontractorFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: subcontractor?.name || '',
      companyName: subcontractor?.companyName || '',
      representativeName: subcontractor?.representativeName || '',
      commercialRegistration: subcontractor?.commercialRegistration || '',
      taxCardNo: subcontractor?.taxCardNo || '',
      email: subcontractor?.email || '',
      phone: subcontractor?.phone || '',
      address: subcontractor?.address || '',
    },
  });

  const handleSubmit = (data: SubcontractorFormData) => {
    onSubmit({
      ...data,
      trades: selectedTrades,
    });
  };

  const addTrade = (trade: string) => {
    if (trade && !selectedTrades.includes(trade)) {
      setSelectedTrades([...selectedTrades, trade]);
    }
    setNewTrade('');
  };

  const removeTrade = (trade: string) => {
    setSelectedTrades(selectedTrades.filter(t => t !== trade));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          {subcontractor ? 'Edit Subcontractor' : 'Add New Subcontractor'}
        </h2>
        <p className="text-muted-foreground">
          {subcontractor ? 'Update the subcontractor information below.' : 'Fill in the details to add a new subcontractor.'}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter business name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="representativeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Representative Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter representative name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="commercialRegistration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commercial Registration</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter commercial registration" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="taxCardNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax Card No.</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tax card number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter full address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Trades Section */}
          <div className="space-y-4">
            <FormLabel>Trades & Specializations</FormLabel>
            
            <div className="flex gap-2">
              <Select value={newTrade} onValueChange={setNewTrade}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a trade" />
                </SelectTrigger>
                <SelectContent>
                  {availableTrades
                    .filter(trade => !selectedTrades.includes(trade))
                    .map((trade) => (
                      <SelectItem key={trade} value={trade}>
                        {trade}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                onClick={() => addTrade(newTrade)}
                disabled={!newTrade || selectedTrades.includes(newTrade)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedTrades.map((trade) => (
                <Badge key={trade} variant="outline" className="px-3 py-1">
                  {trade}
                  <button
                    type="button"
                    onClick={() => removeTrade(trade)}
                    className="ml-2 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">
              {subcontractor ? 'Update Subcontractor' : 'Add Subcontractor'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
